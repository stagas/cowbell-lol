import type { SchedulerEventGroupNode, SchedulerNode } from 'scheduler-node'

export type AppAudioNode = AudioNode | SchedulerNode | SchedulerEventGroupNode

export class Audio {
  audioContext!: AudioContext
  audioNodes!: Map<string, AppAudioNode>
  audioNode!: AudioNode
  analyserNode!: AnalyserNode
  schedulerNode!: SchedulerNode
  workerBytes!: Uint8Array
  fftSize!: number

  constructor(data: Partial<Audio>) {
    Object.assign(this, data)
  }

  setParam = (param: AudioParam, targetValue: number, slope = 0.015) => {
    param.setTargetAtTime(targetValue, this.audioContext.currentTime, slope)
  }
}

