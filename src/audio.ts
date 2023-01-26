import { attempt, Deferred } from 'everyday-utils'
import { on, reactive } from 'minimal-view'
import { MonoNode } from 'mono-worklet'
import { SchedulerNode, SchedulerEventGroupNode, SchedulerTargetNode } from 'scheduler-node'
import { app } from './app'
import { AudioPlayer } from './audio-player'
import { Player, players } from './player'
import { projects } from './project'
import { filterState } from './util/filter-state'
import { oneOf } from './util/one-of'
import { ObjectPool } from './util/pool'
import { storage } from './util/storage'

export type AudioState = 'init' | 'preparing' | 'running' | 'suspended' | 'preview' | 'restarting'

export let lastRunningPlayers: Set<Player> | null

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
      vol: storage.vols.get('audio', 0.5),
      isSpeakers: true
    })

    bpm = storage.bpm.get(135)
    coeff = 1

    schedulerNode?: SchedulerNode
    startTime = 0
    delayStart = 0.2
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
    let startPromise: Promise<number>

    return fns(new class actions {
      startClick = async (resetTime = true) => {
        if (lastRunningPlayers?.size) {
          $.state = 'restarting'
          const audioPlayersToStart: AudioPlayer[] = []
          await Promise.all(
            [...lastRunningPlayers].map((player) =>
              new Promise<void>((resolve) => player.fx.once.task(async ({ audioPlayer }) => {
                audioPlayersToStart.push(audioPlayer)
                await player.$.start(resetTime, false)
                resolve()
              }))
            )
          )
          return Promise.all(
            audioPlayersToStart.map((audioPlayer) => new Promise<unknown>((resolve) => {
              audioPlayer.$.start().then(resolve)
            }))
          )
        } else {
          return app.$.project?.$.start()
        }
      }

      start = fn(({ audioContext, schedulerNode }) => async (resetTime = false) => {
        if (oneOf($.state, 'preparing', 'running')) {
          return startPromise
        }

        const deferred = Deferred<number>()
        startPromise = deferred.promise

        $.state = 'preparing'

        const now = audioContext.currentTime
        lastReceivedTime = now

        if (resetTime) {
          this.resetTime()
        }

        lastRunningPlayers = null

        $.startTime = await schedulerNode.start(now + $.delayStart, $.internalTime + $.delayStart)

        const loop = this.seekTime(-1, true)
        if ($.repeatState === 'bar') {
          $.internalTime = $.repeatStartTime
          clearInterval(repeatIv)
          repeatIv = setInterval(loop, 1000 / $.coeff)
        }

        queueMicrotask(() => {
          $.state = 'running'
        })

        deferred.resolve($.startTime)

        return startPromise
      })

      stopClick = (resetTime = true) => {
        // TODO: wait for 'preparing' to settle or something else? AbortController?
        lastRunningPlayers = filterState(players, 'running')
        this.stop(resetTime)
      }

      stop = fn(({ schedulerNode }) => (resetTime = true) => {
        clearInterval(repeatIv)

        if (resetTime) {
          this.resetTime()
        }

        if ($.state === 'suspended') return

        $.state = 'suspended'

        schedulerNode.stop()

        filterState(projects, 'running').forEach((project) => {
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

    fx(({ destPlayer }) =>
      destPlayer.fx.raf(({ vol }) => {
        storage.vols.set('audio', vol)
      })
    )
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
        return new GainNode(audioContext, { channelCount: 1, gain: 1 })
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
