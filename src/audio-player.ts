import { cheapRandomId } from 'everyday-utils'
import { reactive } from 'minimal-view'
import { anim } from './anim'
import { Audio, AudioState } from './audio'
import { Project } from './project'
import { filterState } from './util/filter-state'
import { oneOf } from './util/one-of'

export const audioPlayers = new Set<AudioPlayer>()

export type AudioPlayer = typeof AudioPlayer.State

export const AudioPlayer = reactive('audio-player',
  class props {
    id?: string = cheapRandomId()
    vol?: number
    isSpeakers?: boolean = false
    preview?: boolean = false
    project?: Project | null
  },

  class local {
    audio?: Audio | null
    state: AudioState = 'init'
    inputNode?: AudioNode
    outputNode?: AudioNode
    gainNode?: GainNode
    analyserNode?: AnalyserNode
    bytes?: Uint8Array
    freqs?: Uint8Array
    workerBytes?: Uint8Array
    workerFreqs?: Uint8Array
  },

  function actions({ $, fn, fns }) {
    let tick = () => { }
    let startPromise: Promise<unknown>

    return fns(new class actions {
      start = fn(({ audio }) => async (resetTime = false) => {
        if (oneOf($.state, 'running', 'preparing')) {
          return startPromise
        }

        $.state = 'preparing'

        startPromise = audio.$.start(resetTime)
        await startPromise

        $.state = 'running'

        this.analyseStart()
      })

      stop = fn(({ audio }) => (resetTime = true) => {
        $.state = 'suspended'

        this.analyseStop()

        if (!filterState(audioPlayers, 'preparing', 'running').size) {
          audio.$.stop(resetTime)
        }
      })

      toggle = () => {
        if ($.state === 'running') {
          this.stop(false)
        } else {
          this.start(false)
        }
      }

      analyseStart = fn(({ analyserNode, bytes, freqs, workerBytes, workerFreqs }) => {
        tick = () => {
          if ($.state === 'running') {
            anim.schedule(tick)
          }
          analyserNode.getByteTimeDomainData(bytes)
          analyserNode.getByteFrequencyData(freqs)
          workerBytes.set(bytes)
          workerFreqs.set(freqs)
        }

        return () => {
          anim.schedule(tick)
        }
      })

      analyseStop = fn(({ workerBytes, workerFreqs }) => () => {
        workerBytes.fill(128)
        workerFreqs.fill(0)
        anim.remove(tick)
      })
    })
  },

  function effects({ $, fx }) {
    fx(({ isSpeakers }) => {
      if (isSpeakers) return

      audioPlayers.add($.self)
      return () => {
        audioPlayers.delete($.self)
      }
    })

    fx(({ analyserNode }) => {
      $.bytes = new Uint8Array(analyserNode.fftSize)
      $.freqs = new Uint8Array(analyserNode.frequencyBinCount)
    })

    fx(({ bytes, freqs }) => {
      $.workerBytes = new Uint8Array(new SharedArrayBuffer(bytes.byteLength))
        .fill(128) // center it at 128 (0-256)
      $.workerFreqs = new Uint8Array(new SharedArrayBuffer(freqs.byteLength))
    })

    fx(({ audio }) =>
      fx(({ gainNode, vol }) => {
        audio.$.setParam(gainNode.gain, vol)
      })
    )

    fx(({ audio, isSpeakers }) =>
      audio.fx(async ({ analyserNodePool, gainNodePool }) => {
        $.gainNode = await gainNodePool.acquire({ channelCount: 2 })
        $.outputNode = $.gainNode

        $.inputNode = await gainNodePool.acquire({ channelCount: 2 })
        if (!isSpeakers) {
          $.analyserNode = await analyserNodePool.acquire()
        }
      })
    )

    fx(({ audio, isSpeakers }) => {
      if (!isSpeakers) return
      return audio.fx(({ state }) => {
        if (state === 'running') {
          $.start(false)
        } else {
          $.stop(false)
        }
        $.state = state
      })
    })

    fx(({ audio, inputNode, outputNode, isSpeakers }) => {
      if (!isSpeakers) return

      inputNode.connect(outputNode)
      outputNode.connect(audio.$.audioContext!.destination)
      return () => {
        audio.$.disconnect(inputNode, outputNode)
        audio.$.disconnect(outputNode, audio.$.audioContext!.destination)
      }
    })

    fx(({ audio, isSpeakers, inputNode, outputNode, analyserNode }) => {
      if (isSpeakers) return

      inputNode.connect(outputNode)
      inputNode.connect(analyserNode)
      return () => {
        audio.$.disconnect(inputNode, outputNode)
        audio.$.disconnect(inputNode, analyserNode)
      }
    })

    fx(({ audio, outputNode, isSpeakers }) => audio.fx(({ disconnect, destPlayer }) => {
      if (!isSpeakers) {
        return destPlayer.fx(({ inputNode }) => {
          outputNode.connect(inputNode)
          return () => {
            disconnect(outputNode, inputNode)
          }
        })
      }
    }))
  }
)
