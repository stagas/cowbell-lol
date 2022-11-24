import { MonoParam } from 'monolang'

export class Param extends MonoParam implements AudioParam {
  constructor(data: Partial<MonoParam>, public audioParam: AudioParam) {
    super(data)
  }

  get automationRate() {
    return this.audioParam.automationRate
  }

  get value() {
    return this.defaultValue //audioParam.value
  }
  set value(v) {
    this.audioParam.value = v
  }

  cancelAndHoldAtTime(cancelTime: number): AudioParam {
    return this.audioParam.cancelAndHoldAtTime(cancelTime)
  }
  cancelScheduledValues(cancelTime: number): AudioParam {
    return this.audioParam.cancelScheduledValues(cancelTime)
  }
  exponentialRampToValueAtTime(value: number, endTime: number): AudioParam {
    return this.audioParam.exponentialRampToValueAtTime(value, endTime)
  }
  linearRampToValueAtTime(value: number, endTime: number): AudioParam {
    return this.audioParam.linearRampToValueAtTime(value, endTime)
  }
  setTargetAtTime(
    target: number,
    startTime: number,
    timeConstant: number,
  ): AudioParam {
    return this.audioParam.setTargetAtTime(target, startTime, timeConstant)
  }
  setValueAtTime(value: number, startTime: number): AudioParam {
    return this.audioParam.setValueAtTime(value, startTime)
  }
  setValueCurveAtTime(
    values: number[] | Float32Array,
    startTime: number,
    duration: number,
  ): AudioParam
  setValueCurveAtTime(
    values: Iterable<number>,
    startTime: number,
    duration: number,
  ): AudioParam {
    return this.audioParam.setValueCurveAtTime(values, startTime, duration)
  }
}
