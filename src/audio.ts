import { attempt, cheapRandomId } from 'everyday-utils'
import { on, reactive } from 'minimal-view'
import { MonoNode } from 'mono-worklet'
import { SchedulerNode, SchedulerEventGroupNode, SchedulerTargetNode } from 'scheduler-node'
import { anim } from './anim'
import { ObjectPool } from './util/pool'
import { storage } from './util/storage'

export type AudioState = 'init' | 'running' | 'suspended' | 'preview'

export const AudioPlayer = reactive('audio-player',
  class props {
    id?: string = cheapRandomId()
    vol?: number = storage.vol.get(0.35)
    audio?: Audio | undefined
    isSpeakers?: boolean = false
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

    return fns(new class actions {
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

      start = fn(({ audio }) => async (resetTime = false) => {
        if ($.state === 'running') return

        $.state = 'running'

        await audio.$.start(resetTime)

        this.analyseStart()
      })

      stop = fn(({ audio }) => (resetTime = true) => {
        $.state = 'suspended'
        this.analyseStop()
        audio.$.stop(resetTime)
      })

      toggle = () => {
        if ($.state === 'running') {
          this.stop(false)
        } else {
          this.start()
        }
      }
    })
  },

  function effects({ $, fx }) {
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

export const Audio = reactive('audio',
  class props {
    sampleRate!: number
    latencyHint!: number
  },
  class local {
    id = 'audio'
    state: AudioState = 'init'
    audioContext?: AudioContext
    connectedNodes = new Set<AudioNode | SchedulerEventGroupNode>()

    destPlayer?: AudioPlayer = AudioPlayer({
      vol: 1,
      isSpeakers: true
    })

    bpm = storage.bpm.get(135)
    coeff = 1

    schedulerNode?: SchedulerNode
    startTime = 0
    delayStart = 0.15
    internalTime = -this.delayStart
    repeatStartTime = 0
    repeatState: 'none' | 'turn' | 'bar' = 'none'

    gainNodePool?: ObjectPool<GainNode>
    monoNodePool?: ObjectPool<MonoNode>
    testNodePool?: ObjectPool<MonoNode>
    groupNodePool?: ObjectPool<SchedulerEventGroupNode>

    fftSize = 1024
    analyserNodePool?: ObjectPool<AnalyserNode>
  },
  function actions({ $, fns, fn }) {
    let lastReceivedTime = 0
    let repeatIv: any

    return fns(new class actions {
      start = fn(({ audioContext, schedulerNode }) => async (resetTime = false) => {
        if ($.state === 'running') return

        $.state = 'running'

        const now = audioContext.currentTime
        lastReceivedTime = now

        if (resetTime) {
          this.resetTime()
        }

        $.startTime = await schedulerNode.start(now + $.delayStart, $.internalTime + $.delayStart)

        const loop = this.seekTime(-1, true)
        if ($.repeatState === 'bar') {
          $.internalTime = $.repeatStartTime
          clearInterval(repeatIv)
          repeatIv = setInterval(loop, 1000 / $.coeff)
        }

        return $.startTime
      })

      stop = fn(({ schedulerNode }) => (resetTime = true) => {
        clearInterval(repeatIv)

        if (resetTime) {
          this.resetTime()
        }

        if ($.state === 'suspended') return

        $.state = 'suspended'

        schedulerNode.stop()
      })

      toggle = () => {
        if ($.state === 'running') {
          this.stop(false)
        } else {
          this.start()
        }
      }

      resetTime = () => {
        $.internalTime = -$.delayStart
      }

      toggleRepeat = () => {
        if ($.repeatState === 'none') {
          $.repeatState = 'bar'
          $.repeatStartTime = Math.max(0, $.internalTime - 1)
          if ($.state === 'running') {
            const loop = this.seekTime(-1, true)
            repeatIv = setInterval(loop, 1000 / $.coeff)
            loop()
          }
        } else {
          clearInterval(repeatIv)
          $.repeatState = 'none'
        }
      }

      getTime = fn(({ audioContext }) =>
        () => {
          if ($.state === 'running') {
            const now = audioContext.currentTime
            $.internalTime += (now - lastReceivedTime) * $.coeff
            lastReceivedTime = now
          }
          return $.internalTime
        })

      seekTime = fn(({ schedulerNode }) =>
        (diff: number, keepRepeatTime?: boolean) =>
          async () => {
            if (!keepRepeatTime && $.repeatState === 'bar') {
              $.repeatStartTime += diff
            }
            // TODO: this won't compute correctly
            // we need to have a per-event group start time
            // if we want to play projects in parallel and each
            // one starting at its own time but still synced.
            // $.internalTime = await schedulerNode.seek(diff)
            await schedulerNode.seek(diff)
            $.internalTime += diff
          })

      setParam = fn(({ audioContext }) => (param: AudioParam, targetValue: number, slope = 0.0015) => {
        attempt(() => {
          param.setTargetAtTime(targetValue, audioContext.currentTime, slope)
        })
      })

      resumeAudio = fn(({ audioContext }) => () => {
        if (audioContext.state !== 'running') {
          console.log('resuming audio')
          audioContext.resume()
        }
      })

      disconnect: {
        (
          sourceNode: SchedulerEventGroupNode,
          targetNode: SchedulerTargetNode
        ): void
        (
          sourceNode: AudioNode,
          targetNode: AudioNode
        ): void
      } = (
        sourceNode: AudioNode | SchedulerEventGroupNode,
        targetNode: AudioNode | SchedulerTargetNode
      ) => {
          attempt(() => {
            sourceNode.disconnect(targetNode as any)
            // if (targetNode instanceof SchedulerTargetNode) {
            // } else if (sourceNode instanceof AudioNode) {
            //   sourceNode.disconnect(targetNode)
            // }
          }, true)
        }

    })
  },
  function effects({ $, fx }) {
    fx(() =>
      on(document.body, 'pointerdown').capture($.resumeAudio)
    )

    fx(({ sampleRate, latencyHint }) => {
      if ($.audioContext) {
        $.audioContext.close()
      }
      $.audioContext = new AudioContext({ sampleRate, latencyHint })
    })

    fx(({ destPlayer }) => {
      destPlayer.$.audio = $.self
    })

    fx(({ bpm }) => {
      storage.bpm.set(bpm)
    })

    fx(async ({ audioContext }) => {
      $.schedulerNode = await SchedulerNode.create(audioContext)
    })

    fx(async ({ schedulerNode, bpm }) => {
      $.coeff = await schedulerNode.setBpm(bpm)
    })

    fx(async ({ audioContext, schedulerNode, fftSize }) => {
      $.gainNodePool = new ObjectPool(() => {
        return new GainNode(audioContext, { channelCount: 1, gain: 0 })
      })

      $.monoNodePool = new ObjectPool(async () => {
        return await MonoNode.create(audioContext, {
          numberOfInputs: 0,
          numberOfOutputs: 1,
          processorOptions: {
            metrics: 0,
          }
        })
      })

      $.groupNodePool = new ObjectPool(() => {
        return new SchedulerEventGroupNode(schedulerNode)
      })

      $.analyserNodePool = new ObjectPool(() => {
        return new AnalyserNode(audioContext, {
          channelCount: 1,
          fftSize,
          smoothingTimeConstant: 0
        })
      })
    })
  }
)

export type Audio = typeof Audio.State
