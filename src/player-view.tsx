/** @jsxImportSource minimal-view */

import { cheapRandomId } from 'everyday-utils'
import { chain, view, web } from 'minimal-view'
import { MonoNode } from 'mono-worklet'
import { SchedulerEventGroupNode } from 'scheduler-node'
import { animRemoveSchedule, animSchedule } from './anim'
import { app } from './app'
import { Audio, AudioState } from './audio'
import { EditorBuffer } from './editor-buffer'
import { Player } from './player'
import { getCodeWithoutArgs } from './util/args'
import { get } from './util/list'

export const PlayerView = web(view('player-view',
  class props {
    id?= cheapRandomId()
    audio!: Audio
    player!: Player
  },

  class local {
    state?: AudioState
    sound?: EditorBuffer
    pattern?: EditorBuffer
    patterns?: EditorBuffer[]

    monoNode?: MonoNode
    gainNode?: GainNode
    groupNode?: SchedulerEventGroupNode

    analyserNode?: AnalyserNode
    bytes?: Uint8Array
    freqs?: Uint8Array
    workerBytes?: Uint8Array
    workerFreqs?: Uint8Array

    soundValue?: string
  },

  function actions({ $, fns, fn }) {
    let tick = () => { }

    return fns(new class actions {
      analyseStop = () => {
        animRemoveSchedule(tick)
      }

      analyseStart =
        fn(({ analyserNode, bytes, freqs, workerBytes, workerFreqs }) => {

          tick = () => {
            analyserNode.getByteTimeDomainData(bytes)
            analyserNode.getByteFrequencyData(freqs)
            workerBytes.set(bytes)
            workerFreqs.set(freqs)
            animSchedule(tick)
          }

          return () => {
            animSchedule(tick)
          }
        })

      updateMidiEvents =
        fn(({ patterns, groupNode }) => () => {
          let bars = 0

          const events = patterns.map(
            (pattern) => [pattern.$.midiEvents!, pattern.$.numberOfBars!] as const
          ).map(([midiEvents, numberOfBars], x) => {
            const evs = midiEvents.map((midiEvent) => {
              const newEvent = new MIDIMessageEvent('message', { data: midiEvent.data })
              newEvent.receivedTime = midiEvent.receivedTime + bars * 1000
              return newEvent
            })
            bars += numberOfBars
            return evs
          })

          groupNode.eventGroup.replaceAllWithMidiEvents(events.flat())
          // groupNode.eventGroup.replaceAllWithMidiEvents(midiEvents)
          // TODO: for the sequencer we also need to tweak loopStart
          // groupNode.eventGroup.loopStart = 0
          groupNode.eventGroup.loopEnd = bars
          groupNode.eventGroup.loop = true

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

          const label = `${id} mono compile`

          do {
            try {
              if (queue) {
                code = queue
                queue = null
              }

              console.time(label)
              await monoNode.setCode(code)
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

          busy = false
        }
      }
      )
    })
  },

  function effects({ $, fx }) {
    fx(({ id }) => {
      return () => {
      }
    })

    fx(({ player }) =>
      chain(
        player.fx(({ state }) => {
          $.state = state
        }),
        player.fx(({ sound }) => {
          $.sound = get(app.sounds, sound)!
        }),
        player.fx(({ pattern, patterns }) => {
          $.pattern = get(app.patterns, patterns[pattern])!
        }),
      )
    )

    fx(({ id, audio }) =>
      audio.fx(async ({ gainNode: audioGainNode, disconnect, monoNodePool, gainNodePool, groupNodePool, analyserNodePool }) => {
        audio.$.connectedPlayers.add(id)
        const monoNode = $.monoNode = await monoNodePool.acquire()
        const gainNode = $.gainNode = await gainNodePool.acquire()
        const groupNode = $.groupNode = await groupNodePool.acquire()
        const analyserNode = $.analyserNode = await analyserNodePool.acquire()
        audio.$.setParam(gainNode.gain, 0)
        gainNode.connect(audioGainNode)
        return () => {
          audio.$.connectedPlayers.delete(id)
          $.analyseStop()
          audio.$.setParam(gainNode.gain, 0)
          monoNodePool.release(monoNode)
          gainNodePool.release(gainNode)
          groupNodePool.release(groupNode)
          analyserNodePool.release(analyserNode)
          setTimeout(() => {
            if (!audio.$.connectedPlayers.has(id)) {
              monoNode.suspend()
              disconnect(monoNode, gainNode)
              disconnect(gainNode, audioGainNode)
              disconnect(groupNode, monoNode)
            }
          }, 50)
        }
      }))

    fx(function createAnalyserBytes({ analyserNode }) {
      $.bytes = new Uint8Array(analyserNode.fftSize)
      $.freqs = new Uint8Array(analyserNode.frequencyBinCount)
    })

    fx(function createWorkerBytes({ bytes, freqs }) {
      $.workerBytes = new Uint8Array(new SharedArrayBuffer(bytes.byteLength))
        .fill(128) // center it at 128 (0-256)
      $.workerFreqs = new Uint8Array(new SharedArrayBuffer(freqs.byteLength))
    })

    fx(({ state, audio, monoNode, gainNode, groupNode, analyserNode }) => {
      if (state === 'running' || state === 'preview') {
        $.analyseStart()
        audio.$.setParam(gainNode.gain, $.player.$.vol!)
        if (state === 'running') {
          // audio.$.start()
          groupNode.connect(monoNode)
        }

        monoNode.resume()
        monoNode.connect(gainNode)
      } else {
        $.analyseStop()

        audio.$.setParam(gainNode.gain, 0)
        audio.$.disconnect(groupNode, monoNode)
        setTimeout(() => {
          if ($.state !== 'running' && $.state !== 'preview') {
            audio.$.disconnect(monoNode, gainNode)
            audio.$.disconnect(monoNode, analyserNode)
          }
        }, 50)
      }
    })

    fx(({ audio, gainNode, player }) =>
      player.fx(({ vol }) => {
        audio.$.setParam(gainNode.gain, vol)
      })
    )

    let prevCodeNoArgs: string

    fx(({ sound, monoNode: _ }) =>
      chain(
        sound.fx(({ compiledValue }) => {
          const codeNoArgs = getCodeWithoutArgs(compiledValue)
          if (prevCodeNoArgs !== codeNoArgs) {
            prevCodeNoArgs = codeNoArgs
            $.compileCode(compiledValue)
          }
        }),
      )
    )

    fx(({ player }) =>
      player.fx(({ patterns }) => {
        $.patterns = patterns.map((patternId) =>
          get(app.patterns, patternId)!
        )
      })
    )

    fx(({ patterns, groupNode }) =>
      chain(
        patterns.map((pattern) =>
          pattern.fx(({ midiEvents, numberOfBars }) => {
            $.updateMidiEvents()
          })
        )
      )
    )

    fx(({ audio, sound, monoNode }) =>
      sound.fx(({ sliders }) =>
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
))
