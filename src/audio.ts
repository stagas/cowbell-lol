import type { SchedulerEventGroupNode, SchedulerNode } from 'scheduler-node'
import type { MonoNode } from 'mono-worklet'
import { ObjectPool } from './util/pool'

export type AppAudioNode = MonoNode | SchedulerNode | SchedulerEventGroupNode

export class Audio {
  audioContext!: AudioContext
  audioNode!: AppAudioNode
  gainNode!: GainNode
  analyserNode!: AnalyserNode
  schedulerNode!: SchedulerNode
  workerBytes!: Uint8Array
  workerFreqs!: Uint8Array
  fftSize!: number

  gainNodePool!: ObjectPool<GainNode>
  monoNodePool!: ObjectPool<MonoNode>
  groupNodePool!: ObjectPool<SchedulerEventGroupNode>
  analyserNodePool!: ObjectPool<AnalyserNode>

  constructor(data: Partial<Audio>) {
    Object.assign(this, data)
  }

  setParam = (param: AudioParam, targetValue: number, slope = 0.015) => {
    try {
      param.setTargetAtTime(targetValue, this.audioContext.currentTime, slope)
    } catch (error) {
      console.warn(error)
    }
  }
}

