import { attempt, Deferred } from 'everyday-utils'
import { on, reactive } from 'minimal-view'
import { MonoNode, MonoNodeOptions } from 'mono-worklet'
import { Clock, SchedulerEventGroupNode, SchedulerNode, SchedulerTargetNode } from 'scheduler-node'
import { AudioPlayer } from './audio-player'
import { players } from './player'
import { projects, cachedProjects } from './projects'
import { shared } from './shared'
import { filterState } from './util/filter-state'
import { oneOf } from './util/one-of'
import { ObjectPool } from './util/pool'
import { storage } from './util/storage'

let monoNodes = 0

export type AudioState = 'init' | 'preparing' | 'running' | 'suspended' | 'preview' | 'restarting'

export type Audio = typeof Audio.State

export const Audio = reactive('audio',
  class props {
    sampleRate!: number
    latencyHint!: number
  },
  class local {
    id = 'audio'
    state: AudioState = 'init'
    audioContext?: AudioContext

    destPlayer?: AudioPlayer = AudioPlayer({
      vol: storage.vols.get('audio', 0.61803),
      isSpeakers: true
    })

    bpm = storage.bpm.get(135)

    clock = new Clock()

    schedulerNode?: SchedulerNode
    stopTime = 0
    delayStart = 0.25
    internalTime = -this.delayStart
    repeatStartTime = 0
    repeatState: 'none' | 'turn' | 'bar' = 'none'

    gainNodePool?: ObjectPool<GainNode, { channelCount: number }>
    panNodePool?: ObjectPool<StereoPannerNode>
    monoNodePool?: ObjectPool<MonoNode, MonoNodeOptions>
    testNodePool?: ObjectPool<MonoNode, MonoNodeOptions>
    groupNodePool?: ObjectPool<SchedulerEventGroupNode>

    fftSize = 1024
    analyserNodePool?: ObjectPool<AnalyserNode>
  },
  function actions({ $, fns, fn }) {
    let repeatIv: any
    let startPromise: Promise<void>

    return fns(new class actions {
      startClick = async (resetTime = true) => {
        if (shared.$.lastRunningPlayers.size) {
          $.state = 'restarting'
          const audioPlayersToStart: AudioPlayer[] = []
          await Promise.all(
            [...shared.$.lastRunningPlayers].map((player) =>
              new Promise<void>((resolve) => player.fx.once.task(async ({ audioPlayer }) => {
                audioPlayersToStart.push(audioPlayer)
                await player.$.start(resetTime, false)
                resolve()
              }))
            )
          )
          await Promise.all(
            audioPlayersToStart.map((audioPlayer) => new Promise<unknown>((resolve) => {
              audioPlayer.$.start().then(resolve)
            }))
          )
        } else {
          await projects.$.project?.$.start()
        }
      }

      start = fn(({ audioContext, schedulerNode, clock }) => async (resetTime = false) => {
        if (oneOf($.state, 'preparing', 'running')) {
          return startPromise
        }

        const deferred = Deferred<void>()
        startPromise = deferred.promise

        $.state = 'preparing'

        const now = audioContext.currentTime

        if (resetTime) {
          $.stopTime = 0
        }

        schedulerNode.start(now + $.delayStart, $.stopTime)

        const loop = this.seekTime(-1, true)
        if ($.repeatState === 'bar') {
          $.internalTime = $.repeatStartTime
          clearInterval(repeatIv)
          // TODO: this needs to happen with derived setTimeouts instead
          // because coeff changes during bpm changes
          repeatIv = setInterval(loop, 1000 / clock.coeff)
        }

        queueMicrotask(() => {
          $.state = 'running'
        })

        deferred.resolve()

        return startPromise
      })

      stopClick = (resetTime = true) => {
        // TODO: wait for 'preparing' to settle or something else? AbortController?
        shared.$.lastRunningPlayers = filterState(players, 'running')
        this.stop(resetTime)
      }

      stop = fn(({ clock, schedulerNode }) => (resetTime = true) => {
        clearInterval(repeatIv)

        if (resetTime) {
          $.stopTime = 0
        } else {
          $.stopTime = clock.internalTime
        }

        if ($.state === 'suspended') return

        $.state = 'suspended'

        schedulerNode.stop()

        filterState(cachedProjects, 'running').forEach((project) => {
          project.$.stop()
        })
      })

      toggle = () => {
        if ($.state === 'running') {
          this.stopClick(false)
        } else {
          this.startClick()
        }
      }

      toggleRepeat = fn(({ clock }) => () => {
        if ($.repeatState === 'none') {
          $.repeatState = 'bar'
          $.repeatStartTime = Math.max(0, clock.internalTime - 1)
          if ($.state === 'running') {
            const loop = this.seekTime(-1, true)
            // TODO: this needs to happen with derived setTimeouts instead
            // because the coeff changes during bpm change and the loop will
            // be stuck at the previous speed.
            repeatIv = setInterval(loop, 1000 / clock.coeff)
            loop()
          }
        } else {
          clearInterval(repeatIv)
          $.repeatState = 'none'
        }
      })

      getTime = fn(({ clock }) => () => {
        return clock.internalTime
      })

      seekTime = fn(({ clock }) => (diff: number, keepRepeatTime?: boolean) => () => {
        if (!keepRepeatTime && $.repeatState === 'bar') {
          $.repeatStartTime += diff
        }
        clock.internalTime += diff
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

    fx(({ destPlayer }) =>
      destPlayer.fx.raf(({ vol }) => {
        storage.vols.set('audio', vol)
      })
    )
    fx(({ bpm }) => {
      storage.bpm.set(bpm)
    })

    fx(async ({ audioContext, clock }) => {
      $.schedulerNode = await SchedulerNode.create(audioContext)
      $.schedulerNode.setClockBuffer(clock.buffer)
    })

    fx(({ schedulerNode, bpm }) => {
      schedulerNode.setBpm(bpm)
    })

    fx(async ({ audioContext, schedulerNode, fftSize, clock }) => {
      $.gainNodePool = new ObjectPool(({ channelCount }: { channelCount: number }) => {
        return new GainNode(audioContext, { channelCount, gain: 1 })
      }, (gainNode) => {
        gainNode.disconnect()
        gainNode.gain.value = 1
        return gainNode
      })

      $.panNodePool = new ObjectPool(() => {
        return new StereoPannerNode(audioContext)
      }, (panNode) => {
        panNode.disconnect()
        panNode.pan.value = 0
        return panNode
      })

      $.monoNodePool = new ObjectPool(async (options: MonoNodeOptions) => {
        console.log('mono nodes', ++monoNodes)
        const monoNode = await MonoNode.create(audioContext, {
          ...options,
          processorOptions: {
            metrics: 0,
          }
        })
        monoNode.setClockBuffer(clock.buffer)
        return monoNode
      }, (monoNode) => {
        monoNode.disconnect()
        return monoNode
      })

      $.groupNodePool = new ObjectPool(() => {
        return new SchedulerEventGroupNode(schedulerNode)
      }, (node) => node)

      $.analyserNodePool = new ObjectPool(() => {
        return new AnalyserNode(audioContext, {
          channelCount: 1,
          fftSize,
          smoothingTimeConstant: 0
        })
      }, (node) => node)
    })
  }
)
