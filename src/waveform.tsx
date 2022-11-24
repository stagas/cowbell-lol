/** @jsxImportSource minimal-view */

import { element, view, web } from 'minimal-view'

import { animRemoveSchedule, animSchedule } from './anim'

export const Waveform = web('waveform', view(
  class props {

    running = false

    width = 200
    height = 100

    analyserNode!: AnalyserNode

  }, class local {

  host = element
  running?: boolean

  bytes?: Uint8Array
  analyser?: AnalyserNode

  canvas?: HTMLCanvasElement
  c?: CanvasRenderingContext2D | null

}, (({ $, fx, fn, refs }) => {
  $.css = /*css*/`
  & {
    display: block;
    width: 100%;
    height: 100%;
  }
  canvas {
    background: #000;
    display: flex;
    image-rendering: pixelated;
    height: 0;
    min-height: 100%;
    width: 100%;
  }
  &(:not([running])) {
    opacity: 0.2;
  }
  `

  const pr = window.devicePixelRatio

  let stop = () => { }
  const draw = fn(({ analyserNode: analyser, bytes, canvas, c, width, height }) => {
    stop = () => animRemoveSchedule(waveTick)
    let py = 0.5 * height

    c.fillStyle = '#000'
    c.strokeStyle = '#16e'
    c.imageSmoothingEnabled = false
    function waveTick() {
      analyser.getByteTimeDomainData(bytes)

      let h = bytes[0] / 256
      const normal = 1 - h * 2
      const sign = Math.sign(normal)
      h = ((Math.abs(normal) ** 0.38) * sign * 0.5 + 0.5)
      animSchedule(waveTick)

      c.drawImage(canvas, -1, 0, width, height)
      c.fillRect(canvas.width - 1, 0, 1, height)

      const y = (height - pr) * h + pr / 2
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

  fx.raf(({ host, running }) => {
    host.toggleAttribute('running', running)
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

  fx(({ analyserNode: analyser }) => {
    $.bytes = new Uint8Array(analyser.fftSize)
  })

  fx(({ width, height }) => {
    $.view = <canvas ref={refs.canvas} width={width} height={height}
    // onclick={() => {
    //   $.running = !$.running
    // }}
    />
  })
})))
