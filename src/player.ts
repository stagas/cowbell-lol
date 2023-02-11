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
import { Route } from './route'
import { services } from './services'
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
    sound!: string
    patterns!: string[]
    pattern!: number

    page?: number = 1
    pages?: PlayerPage[]

    routes?: Map<string, Route> = new Map()

    project?: Project
    audioPlayer?: AudioPlayer
  },

  class local {
    state: AudioState = 'init'
    compileState: 'init' | 'compiling' | 'compiled' = 'init'
    connectedState: 'disconnected' | 'connected' = 'disconnected'

    audio?: Audio
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
    groupNode?: SchedulerEventGroupNode

    sliders?: Sliders
    sendSliders?: Map<string, Sliders>
    cachedSliders: Map<string, Slider> = new Map()
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
              await monoNode.setCode(code, true)
              console.timeEnd(label)
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
          pick($, ['sound', 'pattern', 'vol']),
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
          'vol'
        ]),
        sound: $.soundBuffer!.$.checksum!,
        patterns: $.patternBuffers!.map((p) => p.$.checksum!),
        pages: $.pages!.map((page) => ({
          sound: get(library.$.sounds, page.sound)!.$.checksum!,
          patterns: getMany(library.$.patterns, page.patterns).map((p) => p!.$.checksum!)
        })),
        routes: [...$.routes!].filter(([, route]) =>
          route.$.targetId === 'dest'
            ? route.$.amount < 1
            : route.$.amount > 0
        ).map(([id, route]): [number, string, number] => {
          const [playerId, targetId] = id.split('::')
          const playerIndex: number = project.$.players!.findIndex((p) => p.$.id === playerId)
          return [playerIndex, targetId, route.$.amount]
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
          anim.schedule(tick)
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

    fx(({ project }) => {
      $.audioPlayer = project.$.audioPlayer
    })

    fx(({ audio }) =>
      audio.fx(({ disconnect, monoNodePool, gainNodePool, groupNodePool }) =>
        fx(async ({ id }) => {
          const monoNode = $.monoNode = await monoNodePool.acquire()
          const gainNode = $.gainNode = await gainNodePool.acquire()
          const groupNode = $.groupNode = await groupNodePool.acquire()

          audio.$.connectedNodes.add(monoNode)
          audio.$.connectedNodes.add(gainNode)
          audio.$.connectedNodes.add(groupNode)

          groupNode.connect(monoNode)
          groupNode.suspend(monoNode)
          monoNode.connect(gainNode)

          console.log('create', $.sound)

          console.log('connect mononode:', id, '- sound:', $.sound)
          return () => {
            console.log('disconnect mononode:', id, '- sound:', $.sound)

            audio.$.connectedNodes.delete(monoNode)
            audio.$.connectedNodes.delete(gainNode)
            audio.$.connectedNodes.delete(groupNode)

            audio.$.setParam(gainNode.gain, 0)
            groupNode.destroy()

            $.monoNode = $.gainNode = $.groupNode = void 0 as any
            $.compileState = 'init'

            setTimeout(() => {
              monoNode.suspend()
              disconnect(monoNode, gainNode)
              disconnect(groupNode, monoNode)

              monoNodePool.release(monoNode)
              gainNodePool.release(gainNode)

              // TODO: should we release groupNodes?
              // groupNodePool.release(groupNode)
            }, 250)
          }
        })
      )
    )

    let suspendTimeout: any

    fx(({ audio, state, preview, monoNode, gainNode, groupNode }) => {
      if (oneOf(state, 'preparing', 'running') || preview) {
        audio.$.setParam(gainNode.gain, $.vol)

        groupNode.connect(monoNode)
        groupNode.resume(monoNode)
        monoNode.resume()
        monoNode.connect(gainNode)

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
          audio.$.setParam(gainNode.gain, 0)
          monoNode.suspend()
          audio.$.disconnect(monoNode, gainNode)
          // audio.$.disconnect(gainNode, audioPlayer.$.destNode!)
        }, 500)

        $.connectedState = 'disconnected'
      }
    })

    fx(({ audio, gainNode, vol }) => {
      audio.$.setParam(gainNode.gain, vol)
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
              audio.$.setParam(monoParam.audioParam, normal)
            }
          })
        )
      )
    )

    // TODO: the following two fx seem way too complicated.

    fx(({ project, routes, cachedSliders }) =>
      project.fx(({ players }) =>
        chain(
          players.map((player) =>
            player.fx(({ sliders: _ }) => {
              const paramId = `${$.id!}::dest`
              let slider = cachedSliders.get(paramId)
              if (!slider) {
                const route = routes.get(paramId)
                slider = Slider({
                  id: paramId,
                  min: 0,
                  max: 1,
                  value: route?.$.amount ?? 1,
                  hue: checksum('dest') % 300 + 20,
                  name: 'dest'
                })
                cachedSliders.set(paramId, slider)
              }

              $.sendSliders = new Map([
                ['dest', new Map([[paramId, slider]])],
                ...filterMap(players, (player) =>
                  player !== $.self
                  && player.$.sliders
                  && [player.$.id!, new Map([
                    ...['vol', 'input'].map((name) => {
                      const paramId = `${player.$.id!}::${name}`
                      const route = routes.get(paramId)
                      let slider = cachedSliders.get(paramId)
                      if (!slider) {
                        slider = Slider({
                          id: paramId,
                          min: 0,
                          max: 1,
                          value: route?.$.amount ?? 0,
                          hue: checksum(name) % 300 + 20,
                          name: name
                        })
                        cachedSliders.set(paramId, slider)
                      }
                      return [paramId, slider] as const
                    }),
                    ...[...player.$.sliders!].map(([sliderId, s]) => {
                      const paramId = `${player.$.id!}::${sliderId}`
                      const route = routes.get(paramId)
                      let slider = cachedSliders.get(paramId)
                      if (!slider) {
                        slider = Slider({
                          id: paramId,
                          min: 0,
                          max: 1,
                          value: route?.$.amount ?? 0,
                          hue: s.$.hue,
                          name: s.$.name
                        })
                        cachedSliders.set(paramId, slider)
                      }
                      return [paramId, slider] as const
                    })
                  ])] as const
                )
              ])
            })
          )
        )
      )
    )

    fx(({ project, audioPlayer }) =>
      audioPlayer.fx(({ destNode: _d }) =>
        project.fx(({ players }) =>
          chain(
            players.map((player) =>
              player.fx(({ audioPlayer }) =>
                audioPlayer.fx(({ destNode: _d }) => {
                  if (players.every((p) => p.$.audioPlayer?.$.destNode)) {
                    players.forEach((p) => {
                      const paramId = `${p.$.id}::dest`
                      if (!p.$.routes!.has(paramId)) {
                        p.$.routes = new Map([
                          [paramId, Route({
                            sourcePlayer: p,
                            targetPlayer: p,
                            targetId: 'dest',
                            amount: 1,
                          })]
                        ])
                      }
                    })
                    return fx(({ sendSliders, routes }) => {
                      return chain([...sendSliders].flatMap(([, sliders]) => [...sliders].map(([paramId, slider]) =>
                        slider.fx(({ value }) => {
                          const [targetPlayerId, targetId] = paramId.split('::')

                          const targetPlayer = players.find((p) => p.$.id === targetPlayerId)!

                          let route = routes.get(paramId)

                          if (value > 0) {
                            if (!route) {
                              route = Route({
                                sourcePlayer: $.self,
                                targetPlayer,
                                targetId,
                                amount: value
                              })
                              routes.set(paramId, route)
                            } else {
                              route!.$.amount = value
                            }
                          } else {
                            if (targetId !== 'dest') {
                              if (route) {
                                route.dispose()
                                routes.delete(paramId)
                              }
                            } else {
                              if (route) {
                                route!.$.amount = 0
                              }
                            }
                          }

                          project.$.updateChecksum()
                          project.$.autoSave()
                        })
                      )))
                    })
                  }
                })
              )
            )
          )
        )
      ))
  }
)
