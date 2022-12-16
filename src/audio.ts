import type { SchedulerEventGroupNode, SchedulerNode } from 'scheduler-node'
import type { MonoNode } from 'mono-worklet'
import { ObjectPool } from './util/pool'
import { getSliders } from './util/args'

function attempt(x: () => void) {
  try {
    x()
  } catch (error) {
    console.warn(error)
  }
}

export type AppAudioNode = MonoNode | SchedulerNode | SchedulerEventGroupNode

export class Audio {
  audioContext!: AudioContext
  offlineAudioContext!: OfflineAudioContext
  audioNode!: AppAudioNode
  gainNode!: GainNode
  analyserNode!: AnalyserNode
  schedulerNode!: SchedulerNode
  workerBytes!: Uint8Array
  workerFreqs!: Uint8Array
  fftSize!: number

  gainNodePool!: ObjectPool<GainNode>
  monoNodePool!: ObjectPool<MonoNode>
  testNodePool!: ObjectPool<MonoNode>
  groupNodePool!: ObjectPool<SchedulerEventGroupNode>
  analyserNodePool!: ObjectPool<AnalyserNode>

  startTime = 0

  constructor(data: Partial<Audio>) {
    Object.assign(this, data)
  }

  getTime = () => {
    return this.audioContext.currentTime - this.startTime
  }

  getSliders = (code: string) => getSliders(code, {
    sampleRate: this.audioContext.sampleRate,
    beatSamples: this.audioContext.sampleRate,
    numberOfBars: 1
  })

  setParam = (param: AudioParam, targetValue: number, slope = 0.015) => {
    attempt(() => {
      param.setTargetAtTime(targetValue, this.audioContext.currentTime, slope)
    })
  }

  disconnect = (sourceNode: AudioNode, targetNode: AudioNode) => {
    attempt(() => {
      sourceNode.disconnect(targetNode)
    })
  }
}
