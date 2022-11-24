/** @jsxImportSource minimal-view */

import { view, web } from 'minimal-view'

import { animRemoveSchedule, animSchedule } from './anim'

export const Wave = web('wave', view(
  class props {
    width = 200
    height = 100
    funcSource!: string
  }, class local {
  canvas?: HTMLCanvasElement
  c?: CanvasRenderingContext2D | null
  running = true
  func?: (t: number) => number
}, (({ $, fx, fn, refs }) => {
  $.css = /*css*/`
  canvas {
    background: #000;
    display: flex;
    image-rendering: pixelated;
    height: 0;
    min-height: 100%;
    width: 100%;
  }`

  const pr = window.devicePixelRatio

  let t = 0
  let stop = () => { }
  const draw = fn(({ func, canvas, c, width, height }) => {
    stop = () => animRemoveSchedule(waveTick)
    function waveTick() {
      const y = func(t)
      animSchedule(waveTick)
      c.imageSmoothingEnabled = false
      c.fillStyle = '#333'
      c.drawImage(canvas, -1, 0, width, height)
      c.fillRect(canvas.width - pr, 0, pr, height)
      c.fillStyle = '#aaa'
      t += 0.025
      c.fillRect(width - pr, (height - pr) * (y * 0.5 + 0.5), pr, pr)
    }
    return waveTick
  })

  fx(function waveEvalFuncSource({ funcSource }) {
    stop()
    // @ts-ignore
    const { sin, cos, tanh, PI: pi } = Math
    try {
      eval(`
        $.func = function waveFunc(t) {
          let y = 0, x;
          ${funcSource};
          return y
        }
      `)
    } catch (error) {
      console.error(error)
    }
  })

  fx(({ canvas }) => {
    $.c = canvas.getContext('2d')
  })

  fx(({ c: ctx, width, height }) => {
    ctx.fillStyle = '#333'
    ctx.fillRect(0, 0, width, height)
  })

  fx(function waveStart({ func: _, c: __ }) {
    draw()
  })

  fx(({ width, height }) => {
    $.view = <canvas ref={refs.canvas} width={width} height={height}
      onclick={() => {
        if ($.running) {
          stop()
          $.running = false
        } else {
          draw()
          $.running = true
        }
      }}
    />
  })
})))
