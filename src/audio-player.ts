import { cheapRandomId } from 'everyday-utils'
import { reactive } from 'minimal-view'
import { anim } from './anim'
import { Audio, AudioState } from './audio'
import { Project } from './project'
import { filterState } from './util/filter-state'
import { oneOf } from './util/one-of'

export const audioPlayers = new Set<AudioPlayer>()

export const AudioPlayer = reactive('audio-player',
  class props {
    id?: string = cheapRandomId()
    audio?: Audio | undefined
    vol?: number
    isSpeakers?: boolean = false
    project?: Project
  },

  class local {
    state: AudioState = 'init'
    destNode?: GainNode
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
          this.start()
        }
      }

      analyseStart = fn(({ analyserNode, bytes, freqs, workerBytes, workerFreqs }) => {
        tick = () => {
          analyserNode.getByteTimeDomainData(bytes)
          analyserNode.getByteFrequencyData(freqs)
          workerBytes.set(bytes)
          workerFreqs.set(freqs)
          anim.schedule(tick)
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
    fx(() => {
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
      audio.fx(async ({ audioContext, analyserNodePool, gainNodePool, destPlayer }) => {
        $.analyserNode = await analyserNodePool.acquire()
        $.gainNode = await gainNodePool.acquire()
        $.destNode = await gainNodePool.acquire()

        $.destNode.gain.value = 1
        $.destNode.connect($.analyserNode)
        $.destNode.connect($.gainNode)

        if (isSpeakers) {
          $.gainNode.connect(audioContext.destination)
        } else {
          return destPlayer.fx(({ destNode }) => {
            $.gainNode!.connect(destNode)
          })
        }
      })
    )
  }
)

export type AudioPlayer = typeof AudioPlayer.State
