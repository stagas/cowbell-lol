/** @jsxImportSource minimal-view */

import { web, view } from 'minimal-view'

import { animSchedule, animRemoveSchedule } from './anim'

export const Waveform = web('waveform', view(
  class props {

    running = false

    width = 200
    height = 100

    analyser!: AnalyserNode

  }, class local {

  running?: boolean

  bytes?: Uint8Array
  analyser?: AnalyserNode

  canvas?: HTMLCanvasElement
  c?: CanvasRenderingContext2D | null

}, (({ $, fx, fn, refs }) => {
  $.css = /*css*/`
  & {
    display: block;
  }
  canvas {
    background: #000;
    display: flex;
    image-rendering: pixelated;
    height: 0;
    min-height: 100%;
    width: 100%;
  }`

  const pr = window.devicePixelRatio

  let stop = () => { }
  const draw = fn(({ analyser, bytes, canvas, c, width, height }) => {
    stop = () => animRemoveSchedule(waveTick)
    let py = 0.5 * height

    c.fillStyle = '#000'
    c.strokeStyle = '#66f'
    c.imageSmoothingEnabled = false
    function waveTick() {
      analyser.getByteTimeDomainData(bytes)

      const h = bytes[0] / 256
      animSchedule(waveTick)

      c.drawImage(canvas, -1, 0, width, height)
      c.fillRect(canvas.width - 1, 0, 1, height)

      const y = (height - pr) * h
      c.beginPath()
      c.lineWidth = pr
      c.moveTo(width - 1, py)
      c.lineTo(width, y)
      c.closePath()
      c.stroke()
      py = y
    }
    return waveTick
  })

  fx(({ canvas }) => {
    $.c = canvas.getContext('2d')
  })

  fx(({ c: ctx, width, height }) => {
    ctx.fillRect(0, 0, width, height)
  })

  fx(function waveStartStop({ running, bytes: _, c: __ }) {
    if (running) {
      draw()
    } else {
      stop()
    }
  })

  fx(({ analyser }) => {
    $.bytes = new Uint8Array(analyser.fftSize)
  })

  fx(({ width, height }) => {
    $.view = <canvas ref={refs.canvas} width={width} height={height}
      onclick={() => {
        $.running = !$.running
      }}
    />
  })
})))
