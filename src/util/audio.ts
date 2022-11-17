export function setParam(audioContext: AudioContext, param: AudioParam, targetValue: number, slope = 0.015) {
  param.setTargetAtTime(targetValue, audioContext.currentTime, slope)
}
