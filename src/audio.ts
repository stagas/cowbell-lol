import { pick, attempt } from 'everyday-utils'
import { on, reactive } from 'minimal-view'
import { MonoNode } from 'mono-worklet'
import { SchedulerNode, SchedulerEventGroupNode, SchedulerTargetNode } from 'scheduler-node'
import { app } from './app'
import { Preview, createPreview } from './preview-service'
import { getSliders } from './util/args'
import { ObjectPool } from './util/pool'
import { Waveplot, createWaveplot } from './waveplot'

export type AudioState = 'init' | 'running' | 'suspended' | 'preview'

export type Audio = typeof Audio.State
export const Audio = reactive('audio',
  class props {
    vol!: number
    audioContext!: AudioContext
    bpm!: number
  },
  class local {
    state: AudioState = 'init'

    connectedPlayers = new Set<string>()

    schedulerNode?: SchedulerNode
    gainNode?: GainNode

    gainNodePool?: ObjectPool<GainNode>
    monoNodePool?: ObjectPool<MonoNode>
    testNodePool?: ObjectPool<MonoNode>
    groupNodePool?: ObjectPool<SchedulerEventGroupNode>

    analyserNodePool?: ObjectPool<AnalyserNode>
    fftSize = 32

    startTime = 0
    coeff = 1
    internalTime = 0

    waveplot?: Waveplot
    preview?: Preview
    previewSampleRate = 11025
    previewSamplesLength = this.previewSampleRate / 2 | 0
  },
  function actions({ $, fns, fn }) {
    let lastReceivedTime = 0

    return fns(new class actions {
      toJSON = () => pick($, ['bpm', 'vol'])

      start = fn(({ audioContext, schedulerNode }) => () => {
        if ($.state === 'running') return
        schedulerNode.start().then((startTime) => {
          $.startTime = startTime
          $.internalTime = 0
          lastReceivedTime = audioContext.currentTime
        })
        $.state = 'running'

        const shouldStartAll = app.players.every((player) => player.$.state !== 'running')

        if (shouldStartAll) {
          app.players.forEach((player) => {
            player.$.start()
          })
        }
      })

      stop = () => {
        $.state = 'suspended'
        app.players.forEach((player) => {
          player.$.stop()
        })
      }

      toggle = () => {
        if ($.state === 'running') {
          this.stop()
        } else {
          this.start()
        }
      }

      getTime = fn(({ audioContext }) => () => {
        const now = audioContext.currentTime
        $.internalTime += (now - lastReceivedTime) * $.coeff
        lastReceivedTime = now
        return $.internalTime
      })

      getSliders = fn(({ audioContext }) =>
        (code: string) =>
          getSliders(code, {
            sampleRate: audioContext.sampleRate,
            beatSamples: audioContext.sampleRate,
            numberOfBars: 1
          })
      )

      setParam = fn(({ audioContext }) => (param: AudioParam, targetValue: number, slope = 0.015) => {
        attempt(() => {
          param.setTargetAtTime(targetValue, audioContext.currentTime, slope)
        })
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
            if (targetNode instanceof SchedulerTargetNode) {
              sourceNode.disconnect(targetNode)
            } else if (sourceNode instanceof AudioNode) {
              sourceNode.disconnect(targetNode)
            }
          })
        }

    })
  },
  function effects({ $, fx }) {
    fx(() =>
      on(document.body, 'pointerdown')(function resumeAudio() {
        if ($.audioContext.state !== 'running') {
          console.log('resuming audio')
          $.audioContext.resume()
        }
      })
    )

    fx(async ({ audioContext }) => {
      $.schedulerNode = await SchedulerNode.create(audioContext)
    })

    fx(async ({ schedulerNode, bpm }) => {
      $.coeff = await schedulerNode.setBpm(bpm)
    })

    fx(function updateGainValue({ gainNode, vol }) {
      $.setParam(gainNode.gain, vol)
    })

    fx(({ audioContext, schedulerNode, fftSize }) => {
      $.gainNode = new GainNode(audioContext, { channelCount: 1, gain: $.vol })
      $.gainNode.connect(audioContext.destination)

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
          smoothingTimeConstant: 0.5
        })
      })
    })

    fx(async function initWaveplot({ previewSampleRate, previewSamplesLength }) {
      $.waveplot = await createWaveplot({
        width: 250,
        height: 100,
        pixelRatio: window.devicePixelRatio,
        sampleRate: previewSampleRate,
        samplesLength: previewSamplesLength
      })
    })

    fx(async function initPreview({ waveplot, previewSampleRate }) {
      $.preview = createPreview(waveplot, previewSampleRate)
    })
  }
)
