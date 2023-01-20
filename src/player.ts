import { cheapRandomId, pick } from 'everyday-utils'
import { Scalar } from 'geometrik'
import { chain, queue, reactive } from 'minimal-view'
import { MonoNode } from 'mono-worklet'
import { LoopKind, SchedulerEventGroupNode } from 'scheduler-node'
import { Audio, AudioPlayer, AudioState } from './audio'
import { EditorBuffer } from './editor-buffer'
import { Library } from './library'
import { PlayerView } from './player-view'
import { services } from './services'
import { fixed, markerForSlider } from './slider'
import { areSlidersCompatible, getCodeWithoutArgs, getSliders } from './util/args'
import { add, del, derive, findEqual, get, getMany } from './util/list'
import { spacer } from './util/storage'

const { clamp } = Scalar

class MIDIMessageEvent extends Event {
  data!: Uint8Array
  receivedTime!: number
  constructor(kind: string, payload: { data: Uint8Array }) {
    super(kind)
    this.data = payload.data
  }
}

export const Player = reactive('player',
  class props {
    id?: string = cheapRandomId()

    state?: AudioState = 'init'
    compileState?: 'init' | 'compiling' | 'compiled' = 'init'

    isPreview?= false

    vol: number = 0.5
    sound!: string
    patterns!: string[]
    pattern!: number

    audioPlayer?: AudioPlayer
    audio?: Audio
    library?: Library

    view?: PlayerView
  },

  class local {
    preview = false

    totalBars?: number
    patternOffsets?: number[]

    // TODO:
    // these are EditorBuffer[] but TS goes into infinite loop
    // in App
    soundBuffer?: EditorBuffer
    patternBuffer?: EditorBuffer
    patternBuffers?: EditorBuffer[]

    currentTime = 0
    turn = 0

    monoNode?: MonoNode
    gainNode?: GainNode
    groupNode?: SchedulerEventGroupNode
  },

  function actions({ $, fns, fn }) {
    // let tick = () => { }

    return fns(new class actions {
      derive = () =>
        Object.assign(
          pick($, ['sound', 'pattern', 'vol']),
          { patterns: [...$.patterns] }
        )

      start = (resetTime = false) => {
        if ($.state === 'running') return

        // TODO: is this necessary?
        if (resetTime) {
          $.currentTime = $.turn = 0
        }

        $.state = 'running'
      }

      stop = () => {
        if ($.state === 'suspended') return

        $.state = 'suspended'
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
        fn(({ patternBuffers: patterns, groupNode }) => async (turn: number, total: number, clear?: boolean) => {
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

          groupNode.eventGroup.setMidiEvents(turns, turn, clear)
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
              await monoNode.setCode(code, $.isPreview)
              console.timeEnd(label)

              // if (!queue) {
              // onCompileSuccess(id)
              // }
            } catch (error) {
              console.timeEnd(label)
              console.warn(error)
              // if (!queue) {
              //   onCompileError(id, error as Error, code)
              // }
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

        const equalItem = findEqual(buffers as any, bufferId, newBufferData as any)

        if (!buffer.$.isDraft) {
          const newBuffer = ctor(newBufferData)
          newBuffer.$.originalValue = buffer.$.value

          if (editor) {
            newBuffer.$.snapshot = editor.editor.getSnapshotJson(true)
          }
          newBuffer.$.parentId = bufferId

          const index = buffers.indexOf(buffer)
          const newBuffers = add(buffers, newBuffer, index + 1)

          if (kind === 'sound') {
            spacer.set(newBuffer.$.id!, spacer.get(bufferId, [0, 0.35]))
            library.$.sounds = newBuffers as any
            $.sound = newBuffer.$.id!
          } else if (kind === 'pattern') {
            library.$.patterns = newBuffers as any
            $.patterns[$.pattern] = newBuffer.$.id!
            $.patterns = [...$.patterns]
          }
        } else {
          // @ts-ignore
          if (equalItem && !equalItem.$.isDraft) {
            if (editor) {
              const snapshot = editor.editor.getSnapshotJson(true)
              // @ts-ignore
              equalItem.$.snapshot = snapshot
            }

            if (kind === 'sound') {
              library.$.sounds = del(library.$.sounds, buffer)
              $.sound = equalItem.$.id!
            } else if (kind === 'pattern') {
              library.$.patterns = del(library.$.patterns, buffer)
              const pat = $.patterns[$.pattern ?? 0]
              $.patterns = $.patterns
                .join(',')
                .replaceAll(pat, equalItem.$.id!)
                .split(',')
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
        if (nextDefault === source.default) return

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
      })
    })
  },

  function effects({ $, fx, deps, refs }) {
    fx(() =>
      services.fx(({ library }) => {
        $.library = library
      })
    )

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
        const iv = setInterval(() => {
          const now = audio.$.getTime()
          $.currentTime = (now % totalBars) * 1000
          $.turn = (now / totalBars) | 0
        }, 12)
        return () => {
          clearInterval(iv)
        }
      }
    })

    fx(({ audio, audioPlayer }) =>
      audioPlayer.fx(({ destNode }) =>
        audio.fx(({ disconnect, monoNodePool, gainNodePool, groupNodePool }) =>
          fx(async ({ id }) => {
            const monoNode = $.monoNode = await monoNodePool.acquire()
            const gainNode = $.gainNode = await gainNodePool.acquire()
            const groupNode = $.groupNode = await groupNodePool.acquire()
            // const analyserNode = $.analyserNode = await analyserNodePool.acquire()

            audio.$.connectedNodes.add(monoNode)
            audio.$.connectedNodes.add(gainNode)
            audio.$.connectedNodes.add(groupNode)

            console.log('connect mononode', id)
            return () => {
              console.log('disconnect mononode', id)

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
                disconnect(gainNode, destNode)
                disconnect(groupNode, monoNode)

                monoNodePool.release(monoNode)
                gainNodePool.release(gainNode)
                // groupNodePool.release(groupNode)
              }, 250)
            }
          })
        )
      )
    )

    fx(({ audio, audioPlayer, state, preview, monoNode, gainNode, groupNode }) => {
      if (state === 'running' || preview) {
        audio.$.setParam(gainNode.gain, $.vol)

        monoNode.resume()

        gainNode.connect(audioPlayer.$.destNode!)
        monoNode.connect(gainNode)

        // if (state === 'running') {
        groupNode.connect(monoNode)
        groupNode.resume(monoNode)
        // }
      } else {
        audio.$.setParam(gainNode.gain, 0)

        monoNode.suspend()
        groupNode.suspend(monoNode)

        audio.$.disconnect(monoNode, gainNode)
        audio.$.disconnect(gainNode, audioPlayer.$.destNode!)
        audio.$.disconnect(groupNode, monoNode)
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

    fx(({ audio, patternBuffers, groupNode: _ }) =>
      chain(
        patternBuffers.map((pattern) =>
          chain(
            fx(({ totalBars }) =>
              pattern.fx(({ value: _ }) => {
                const turn = (audio.$.getTime() / totalBars) | 0
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

    fx(({ audio, soundBuffer, monoNode }) =>
      soundBuffer.fx(({ sliders }) =>
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
    )
  }
)

export type Player = typeof Player.State
