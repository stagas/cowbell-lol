import { cheapRandomId, checksum, Deferred, filterMap, pick } from 'everyday-utils'
import { Scalar } from 'geometrik'
import { chain, queue, reactive } from 'minimal-view'
import { MonoNode } from 'mono-worklet'
import { LoopKind, SchedulerEventGroupNode } from 'scheduler-node'
import { anim } from './anim'
import { Audio, AudioState } from './audio'
import { AudioPlayer } from './audio-player'
import { EditorBuffer } from './editor-buffer'
import { Library } from './library'
import { Project } from './project'
import { projects } from './projects'
import { Send } from './send'
import { services } from './services'
import { shared } from './shared'
import { fixed, markerForSlider, Slider } from './slider'
import { Sliders } from './types'
import { areSlidersCompatible, getCodeWithoutArgs } from './util/args'
import { add, del, derive, findEqual, get, getMany } from './util/list'
import { MIDIMessageEvent } from './util/midi-message-event'
import { noneOf, oneOf } from './util/one-of'

const { clamp } = Scalar

export interface PlayerPage {
  sound: string
  patterns: string[]
}

export const players = new Set<Player>()

export type Player = typeof Player.State

export const Player = reactive('player',
  class props {
    id?: string = cheapRandomId()

    isPreview?= false

    vol: number = 0.5
    pan?: number = 0
    sound!: string
    patterns!: string[]
    pattern!: number

    page?: number = 1
    pages?: PlayerPage[]

    sends?: Map<string, Send> = new Map()

    project?: Project
    audioPlayer?: AudioPlayer
  },

  class local {
    state: AudioState = 'init'
    compileState: 'init' | 'compiling' | 'compiled' = 'init'
    connectedState: 'disconnected' | 'connected' = 'disconnected'

    audio?: Audio | null
    library?: Library
    preview = false

    totalBars?: number
    patternOffsets?: number[]

    soundBuffer?: EditorBuffer
    patternBuffer?: EditorBuffer
    patternBuffers?: EditorBuffer[]

    currentTime = 0
    turn = 0

    monoNode?: MonoNode
    gainNode?: GainNode
    panNode?: StereoPannerNode

    inputNode?: AudioNode
    outputNode?: AudioNode

    groupNode?: SchedulerEventGroupNode

    inputChannels = 0
    outputChannels = 1

    sliders?: Sliders

    sendVolSliders?: Map<string, Sliders>
    sendPanSliders?: Map<string, Sliders>
    cachedSendVolSliders: Map<string, Slider> = new Map()
    cachedSendPanSliders: Map<string, Slider> = new Map()
  },

  function actions({ $, fx, fns, fn }) {
    let startPromise: Promise<unknown>

    return fns(new class actions {
      start = fn(({ audioPlayer }) => async (resetTime = false, startAudioPlayer = true) => {
        if (oneOf($.state, 'preparing', 'running')) {
          return startPromise
        }

        // TODO: is this necessary?
        if (resetTime) {
          $.currentTime = $.turn = 0
        }

        if (!$.audio) {
          $.audio = services.$.audio!
        }

        $.state = 'preparing'

        const deferred = Deferred<void>()

        startPromise = deferred.promise

        if ($.project) {
          if (noneOf($.audio.$.state, 'restarting', 'preparing', 'running')) {
            $.audio.$.bpm = $.project.$.bpm!
            projects.$.project = $.project
          }

          $.project.$.audio = $.audio

          if (noneOf($.project.$.state, 'preparing', 'running')) {
            if ($.audio.$.state !== 'restarting') {
              $.project.$.startedAt = performance.now()
            }
            $.project.$.state = 'preparing'
          }
        }

        await new Promise<void>((resolve) =>
          audioPlayer.fx.once(({ audio: _ }) => resolve())
        )

        await new Promise<void>((resolve) => {
          const off = fx(({ compileState, connectedState }) => {
            if (compileState === 'compiled' && connectedState === 'connected') {
              off()
              resolve()
            }
          })
        })

        if (startAudioPlayer) {
          await audioPlayer.$.start(resetTime)
        }

        $.state = 'running'

        if ($.project) {
          $.project.$.state = 'running'
        }

        deferred.resolve()

        return startPromise
      })

      stop = (resetTime = false) => {
        if ($.state === 'suspended') return

        $.state = 'suspended'

        if (resetTime) {
          $.currentTime = $.turn = 0
        }

        if ($.project) {
          if ($.project.$.players.every((player) =>
            noneOf(player.$.state, 'preparing', 'running')
          )) {
            $.project.$.stop()
          }
        }
      }

      toggle = () => {
        if ($.state === 'running') {
          this.stop()
        } else {
          this.start()
        }
      }

      startPreview = () => {
        $.preview = true
        this.stopPreview()
      }

      stopPreview = queue.debounce(3000)(() => {
        $.preview = false
      })

      updateMidiEvents =
        fn(({ patternBuffers: patterns }) => async (turn: number, total: number, clear?: boolean) => {
          let bars = 0

          const turns: WebMidi.MIDIMessageEvent[][] = Array.from({ length: total }, () => [])

          outer: for (const pattern of patterns) {
            const fixTime = (midiEvent: WebMidi.MIDIMessageEvent) => {
              const newEvent = new MIDIMessageEvent('message', {
                data: midiEvent.data
              })
              newEvent.receivedTime = midiEvent.receivedTime + bars * 1000
              return newEvent
            }

            for (let i = 0; i < total; i++) {
              const t = await pattern.$.compilePattern(turn + i)
              if (!t) continue outer
              turns[i].push(...t.map(fixTime))
            }

            bars += pattern.$.numberOfBars!
          }

          $.totalBars = bars

          $.groupNode?.eventGroup.setMidiEvents(turns, turn, clear)
        })

      compileCode = fn(({ id, monoNode }) => {
        let busy = false
        let queue: string | null
        return async (code) => {
          if (busy) {
            queue = code
            return
          }

          busy = true

          $.compileState = 'compiling'

          const label = `${id} mono compile`

          do {
            try {
              if (queue) {
                code = queue
                queue = null
              }

              console.time(label)
              const res = await monoNode.setCode(code, true)
              console.timeEnd(label)

              $.soundBuffer!.$.inputChannels = res.inputChannels
              $.soundBuffer!.$.outputChannels = res.outputChannels
            } catch (error) {
              console.timeEnd(label)
              console.warn(error)
            }
          } while (queue)

          $.compileState = 'compiled'

          busy = false
        }
      })

      onBufferValue = services.fn(({ library }) => (newBufferValue: string, kind: 'sound' | 'pattern') => {
        let bufferId

        const buffers = kind === 'sound' ? library.$.sounds : library.$.patterns

        if (kind === 'sound') {
          bufferId = $.sound
        } else if (kind === 'pattern') {
          bufferId = $.patterns[$.pattern]
        }
        if (!bufferId) return

        const buffer = get(buffers, bufferId)
        if (!buffer) return

        const editor = buffer.$.editor

        const [ctor, newBufferData] = derive(buffers as any, bufferId, { value: newBufferValue } as any)

        const equalItem: false | EditorBuffer = findEqual(buffers as any, bufferId, newBufferData as any)

        // TODO: fix editor snapshots

        if (!buffer.$.isDraft) {
          const newBuffer: EditorBuffer = ctor(newBufferData) as EditorBuffer
          newBuffer.$.originalValue = buffer.$.value

          if (editor) {
            newBuffer.$.snapshot = editor.editor.getSnapshotJson(true)
          }
          newBuffer.$.parentId = bufferId

          const index = buffers.indexOf(buffer)
          const newBuffers = add(buffers, newBuffer, index + 1)

          if (kind === 'sound') {
            library.$.sounds = newBuffers as any
            $.sound = newBuffer.$.id!
            $.project!.$.selectedPreset = newBuffer
          } else if (kind === 'pattern') {
            library.$.patterns = newBuffers as any
            const patterns = [...$.patterns]
            patterns[$.pattern] = newBuffer.$.id!
            $.patterns = patterns
            $.project!.$.selectedPreset = newBuffer
          }
        } else {
          if (equalItem && !equalItem.$.isDraft) {
            if (editor) {
              const snapshot = editor.editor.getSnapshotJson(true)
              equalItem.$.snapshot = snapshot
            }

            if (kind === 'sound') {
              library.$.sounds = del(library.$.sounds, buffer)
              $.sound = equalItem.$.id!
              $.project!.$.selectedPreset = equalItem
            } else if (kind === 'pattern') {
              library.$.patterns = del(library.$.patterns, buffer)
              const pat = $.patterns[$.pattern ?? 0]
              $.patterns = $.patterns
                .join(',')
                .replaceAll(pat, equalItem.$.id!)
                .split(',')
              $.project!.$.selectedPreset = equalItem
            }
          } else {
            return true
          }
        }
      })

      onPatternValue = (newBufferValue: string) => {
        return this.onBufferValue(newBufferValue, 'pattern')
      }

      onSoundValue = services.fn(({ library }) => (newBufferValue: string, noMarkers?: boolean) => {
        if (!noMarkers) {
          const bufferId = $.sound

          const buffer = get(library.$.sounds, bufferId)
          if (!buffer) return

          const editor = buffer.$.editor

          if (editor) {
            queueMicrotask(() => {
              const markers = [...buffer.$.sliders.values()].map(markerForSlider)
              editor.setMarkers(markers)
            })
          }
        }
        return this.onBufferValue(newBufferValue, 'sound')
      })

      onSliderNormal = services.fn(({ library }) => (sliderId: string, normal: number) => {
        const bufferId = $.sound

        const buffer = get(library.$.sounds, bufferId)
        if (!buffer) return

        const slider = buffer.$.sliders.get(sliderId)
        if (!slider) return

        const source = slider.$.source!
        const sourceIndex = slider.$.sourceIndex!

        const { min, max, scale } = slider.$
        let sliderValue = fixed(normal * scale! + min)
        sliderValue = fixed(clamp(min, max, fixed(sliderValue)))

        const end = sourceIndex + source.arg.length
        const start = end - source.default.length

        const nextDefault = `${sliderValue}`
        if (nextDefault === source.default) return slider

        const before = buffer.$.value.slice(0, start)
        const after = buffer.$.value.slice(end)
        const newBufferValue = `${before}${sliderValue}${after}`

        if (this.onSoundValue(newBufferValue, true)) {
          const editor = buffer.$.editor

          const diff = nextDefault.length - source.default.length

          source.arg = source.arg.slice(0, -source.default.length) + `${sliderValue}`
          source.default = nextDefault

          slider.$.normal = normal

          const sliders = buffer.$.sliders
          sliders.forEach((other) => {
            if (other.$.id === sliderId) return
            if (other.$.sourceIndex! > start) {
              other.$.sourceIndex! += diff
            }
          })

          const markers = [...sliders.values()].map(markerForSlider)

          if (editor) {
            editor.replaceChunk({
              start,
              end,
              text: nextDefault,
              code: buffer.$.value,
              markers
            })
            buffer.$.value = newBufferValue
          } else {
            buffer.$.value = newBufferValue
          }
        }

        return slider
      })

      derive = () =>
        Object.assign(
          pick($, ['sound', 'pattern', 'vol', 'pan']),
          {
            patterns: [...$.patterns],
            pages: [...$.pages!].map((p) => ({
              ...p,
              patterns: [...p.patterns]
            })),
          }
        )

      toJSON = fn(({ project, library }) => () => ({
        ...pick($ as Required<typeof $>, [
          'vol',
          'pan',
        ]),
        sound: $.soundBuffer!.$.checksum!,
        patterns: $.patternBuffers!.map((p) => p.$.checksum!),
        pages: $.pages!.map((page) => ({
          sound: get(library.$.sounds, page.sound)!.$.checksum!,
          patterns: getMany(library.$.patterns, page.patterns).map((p) => p!.$.checksum!)
        })),
        sends: [...$.sends!].filter(([, send]) =>
          send.$.pan !== 0
          || (send.$.targetId === 'out'
            ? send.$.vol < 1
            : send.$.vol > 0)
        ).map(([id, send]): [number, string, number, number] => {
          const [playerId, targetId] = id.split('::')
          const playerIndex: number = project.$.players!.findIndex((p) => p.$.id === playerId)
          return [playerIndex, targetId, send.$.vol, send.$.pan]
        }),
      }))
    })
  },

  function effects({ $, fx, deps, refs }) {
    fx(() => {
      players.add($.self)
      return () => {
        players.delete($.self)
      }
    })

    fx(() =>
      services.fx(({ library }) => {
        $.library = library
      })
    )

    fx(({ page, pages }) => {
      const p = pages[page - 1]
      Object.assign($, p)
    })

    fx(({ sound, patterns, page, pages }) => {
      const p = pages[page - 1]
      if (p && p.sound === sound && p.patterns.join() === patterns.join()) return

      pages[page - 1] = {
        sound,
        patterns: patterns.slice()
      }

      pages = pages.filter((p) => p != null && p.sound && p.patterns)

      while (
        [pages.at(-1)?.sound, pages.at(-1)?.patterns].join()
        === [pages.at(-2)?.sound, pages.at(-2)?.patterns].join()
      ) {
        pages.pop()
      }

      $.pages = [...pages]
    })

    fx(({ preview, audioPlayer }) => {
      audioPlayer.$.preview = preview
    })

    fx(({ sound, library }) => {
      $.soundBuffer = get(library.$.sounds, sound)!
    })

    fx(({ patterns, library }) => {
      $.patternBuffers = getMany(library.$.patterns, patterns)

      const updateOffsets = () => {
        let bars = 0

        const patternOffsets: number[] = []

        for (const pat of $.patternBuffers!) {
          patternOffsets.push(bars)
          bars += pat.$.numberOfBars!
        }

        $.patternOffsets = patternOffsets
        $.totalBars = bars
      }

      return chain(
        $.patternBuffers.map((pat) =>
          pat.fx.keys(['midiEvents', 'numberOfBars'])(updateOffsets)
        )
      )
    })

    fx(({ pattern, patternBuffers }) => {
      $.patternBuffer = patternBuffers[pattern]
    })

    fx(({ state, audio, totalBars }) => {
      if (state === 'running') {
        const tick = () => {
          if ($.state === 'running') {
            anim.schedule(tick)
          }
          const now = audio.$.getTime()
          $.currentTime = (now % totalBars) * 1000
          $.turn = (now / totalBars) | 0
        }
        anim.schedule(tick)
        return () => {
          anim.remove(tick)
        }
      }
    })

    fx(({ audio: _, state, isPreview }) => {
      if (isPreview) return
      return shared.fx(({ lastRunningPlayers }) => {
        const isRunning = oneOf(state, 'preparing', 'running')

        if (isRunning) {
          lastRunningPlayers.add($.self)
        } else {
          if (!lastRunningPlayers.has($.self)) {
            console.log('NO AUDIO REMOVE', $.self)
            $.audio = null
          }
        }
      })
    })

    fx(({ project }) => {
      $.audioPlayer = project.$.audioPlayer
    })

    fx(({ soundBuffer }) =>
      soundBuffer.fx(({ inputChannels, outputChannels }) => {
        $.inputChannels = inputChannels
        $.outputChannels = outputChannels
      })
    )

    fx(({ audio, inputChannels, outputChannels }) => audio.fx(({ disconnect, gainNodePool, panNodePool, monoNodePool, groupNodePool }) => fx(async ({ id }) => {
      const monoNode = $.monoNode = await monoNodePool.acquire({
        numberOfInputs: inputChannels ? 1 : 0,
        numberOfOutputs: 1,
        outputChannelCount: [outputChannels],
        channelCount: Math.max(1, inputChannels)
      })
      const gainNode = $.gainNode = await gainNodePool.acquire({ channelCount: outputChannels })
      const panNode = $.panNode = await panNodePool.acquire()
      const groupNode = $.groupNode = await groupNodePool.acquire()

      $.inputNode = monoNode
      $.outputNode = panNode

      console.log('create', $.sound)
      console.log('connect mononode:', id, '- sound:', $.sound)

      return () => {
        console.log('disconnect mononode:', id, '- sound:', $.sound)

        groupNode.clear()
        groupNode.suspend(monoNode)
        disconnect(groupNode, monoNode)
        groupNode.destroy()

        $.monoNode
          = $.gainNode
          = $.panNode
          = $.inputNode
          = $.outputNode
          = $.groupNode
          = void 0 as any

        $.compileState = 'init'

        setTimeout(() => {
          audio.$.setParam(gainNode.gain, 0)
          setTimeout(() => {
            monoNode.disconnect()
            monoNode.disable()

            gainNode.disconnect()
            gainNodePool.release(gainNode)

            panNode.disconnect()
            panNodePool.release(panNode)
          }, 100)
        }, 2000)
      }
    })))

    let suspendTimeout: any

    fx(({ audio, state, preview, monoNode, gainNode, panNode, groupNode }) => {
      if (oneOf(state, 'preparing', 'running') || preview) {
        groupNode.connect(monoNode)
        groupNode.resume(monoNode)
        monoNode.resume()
        monoNode.connect(gainNode)
        gainNode.connect(panNode)

        // TODO: is this necessary to idle completely?
        // gainNode.connect(audioPlayer.$.destNode!)

        clearTimeout(suspendTimeout)
        suspendTimeout = setTimeout(() => {
          $.connectedState = 'connected'
        }, 50)
      } else {
        groupNode.clear()
        groupNode.suspend(monoNode)
        audio.$.disconnect(groupNode, monoNode)

        clearTimeout(suspendTimeout)
        suspendTimeout = setTimeout(() => {
          monoNode.suspend()
          audio.$.disconnect(monoNode, gainNode)
          audio.$.disconnect(gainNode, panNode)
          // audio.$.disconnect(gainNode, panNode)
          // console.log('yeah disconnect')
          // audio.$.disconnect(gainNode, audioPlayer.$.destNode!)
        }, 500)

        $.connectedState = 'disconnected'
      }
    })

    fx(({ audio, state, gainNode, vol, preview }) => {
      if (oneOf(state, 'preparing', 'running') || preview) {
        audio.$.setParam(gainNode.gain, vol)
      } else {
        setTimeout(() => {
          audio.$.setParam(gainNode.gain, 0)
        }, 500)
      }
    })

    fx(({ audio, panNode, pan }) => {
      audio.$.setParam(panNode.pan, pan)
    })

    fx(({ groupNode, totalBars }) => {
      groupNode.eventGroup.loopEnd = totalBars
      groupNode.eventGroup.loop = LoopKind.Live
    })

    fx(({ groupNode }) => {
      groupNode.eventGroup.onRequestNotes = $.updateMidiEvents
    })

    fx(({ patternBuffers }) =>
      chain(
        patternBuffers.map((pattern) =>
          chain(
            fx(({ totalBars }) =>
              pattern.fx(({ value: _ }) => {
                const now = services.$.audio!.$.getTime()
                const turn = $.turn = (now / totalBars) | 0
                $.updateMidiEvents(turn, 2, true)
              })
            ),
          )
        )
      )
    )

    fx(({ monoNode: _ }) => {
      let prevCodeNoArgs: string
      let prevCompiledValue: string
      return fx(({ soundBuffer }) =>
        soundBuffer.fx(({ compiledValue }) => {
          const codeNoArgs = getCodeWithoutArgs(compiledValue)
          if (prevCodeNoArgs !== codeNoArgs
            || !areSlidersCompatible(
              services.$.getSliders(compiledValue),
              services.$.getSliders(prevCompiledValue)
            )) {
            prevCodeNoArgs = codeNoArgs
            prevCompiledValue = compiledValue
            $.compileCode(compiledValue)
          }
        })
      )
    })

    fx(({ soundBuffer }) =>
      soundBuffer.fx(({ sliders }) => {
        $.sliders = sliders
      })
    )

    fx(({ audio, monoNode, sliders }) =>
      chain(
        [...sliders.values()].map((slider) =>
          slider.fx(({ id, normal }) => {
            const monoParam = monoNode.params.get(id)
            if (monoParam) {
              // TODO: make params -1..1 instead of 0..1
              audio.$.setParam(monoParam.audioParam, normal * 2 - 1)
            }
          })
        )
      )
    )

    fx(({ project, sends, cachedSendVolSliders, cachedSendPanSliders }) =>
      project.fx(({ players }) => {
        const sliderByName = (player: Player, kind: 'vol' | 'pan') => (name: string) => {
          const paramId = `${player.$.id!}::${name}`
          const send = sends.get(paramId)

          const cached = kind === 'vol' ? cachedSendVolSliders : cachedSendPanSliders

          let slider = cached.get(paramId)
          if (!slider) {
            slider = Slider({
              id: paramId,
              min: kind === 'vol' ? 0 : -1,
              max: 1,
              value: (kind === 'vol' ? send?.$.vol : send?.$.pan) ?? 0,
              hue: checksum(name + name + name) % 300 + 20,
              name: name
            })
            cached.set(paramId, slider)
          }
          return [paramId, slider] as const
        }

        const updateSendSliders = queue.task.not.first.not.next.last(() => {
          $.sendPanSliders = new Map([
            [$.id!, new Map(['out'].map(sliderByName($.self, 'pan')))],
            ...filterMap(players, (player) =>
              player !== $.self
              && player.$.sliders
              && [player.$.id!, new Map([
                ...['in'].map(sliderByName(player, 'pan')),
              ])] as const
            )
          ])

          $.sendVolSliders = new Map([
            [$.id!, new Map(['out'].map(sliderByName($.self, 'vol')))],
            ...filterMap(players, (player) =>
              player !== $.self
              && player.$.sliders
              && [player.$.id!, new Map([
                ...['in', 'vol', 'pan'].map(sliderByName(player, 'vol')),
                ...[...player.$.sliders!].map(([sliderId, s]) => {
                  const paramId = `${player.$.id!}::${sliderId}`
                  const send = sends.get(paramId)
                  let slider = cachedSendVolSliders.get(paramId)
                  if (!slider) {
                    slider = Slider({
                      id: paramId,
                      min: 0,
                      max: 1,
                      value: send?.$.vol ?? 0,
                      hue: s.$.hue,
                      name: s.$.name
                    })
                    cachedSendVolSliders.set(paramId, slider)
                  }
                  return [paramId, slider] as const
                })
              ])] as const
            )
          ])
        })

        return chain(
          players.map((player) =>
            player.fx(({ sliders: _ }) => {
              updateSendSliders()
            })
          )
        )
      })
    )

    fx(({ project, sends, sendVolSliders, sendPanSliders }) => project.fx(({ players, allPlayersReady }) => {
      if (!allPlayersReady) return

      return chain([
        ...[...sendVolSliders].flatMap(([, sliders]) => [...sliders].map(([paramId, slider]) =>
          slider.fx(({ value }) => {
            const [targetPlayerId, targetId] = paramId.split('::')

            const targetPlayer = get(players, targetPlayerId)!

            let send = sends.get(paramId)

            if (value > 0) {
              if (!send) {
                send = Send({
                  sourcePlayer: $.self,
                  targetPlayer,
                  targetId,
                  pan: 0,
                  vol: value
                })
                sends.set(paramId, send)
              } else {
                send.$.vol = value
              }
            } else {
              if (targetId !== 'out') {
                if (send) {
                  send.dispose()
                  sends.delete(paramId)
                }
              } else {
                if (send) {
                  send.$.vol = 0
                }
              }
            }

            project.$.updateChecksum()
            project.$.autoSave()
          })
        )),
        ...[...sendPanSliders].flatMap(([, sliders]) => [...sliders].map(([paramId, slider]) =>
          slider.fx(({ value }) => {
            const send = sends.get(paramId)

            if (send) {
              send.$.pan = value
              project.$.updateChecksum()
              project.$.autoSave()
            }
          })
        ))
      ])
    }))
  }
)
