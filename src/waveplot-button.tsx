/** @jsxImportSource minimal-view */

import { view, web } from 'minimal-view'
import { EditorBuffer } from './types'
import { Waveplot } from './waveplot'

export const WaveplotButton = web('waveplot-button', view(
  class props {
    id!: string
    waveplot!: Waveplot
    buffers!: Map<string, EditorBuffer>

    onClick!: () => void
    children?: JSX.Element
  },
  class local {
    canvasView: JSX.Element = false
  },
  function actions({ $, fns, fn }) {
    return fns(new class actions {
      onPointerDown = fn(({ onClick }) => (e: PointerEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      })
    })
  },
  function effects({ $, fx }) {
    $.css = /*css*/`
    & {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: #000;
    }
    button {
      all: unset;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Mono;
      width: 100%;
      height: 100%;
      color: #fff;
      cursor: pointer;
      text-shadow: 1px 1px #000;
    }
    canvas {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      image-rendering: pixelated;
      pointer-events: none;
    }
    `

    fx(async ({ id, waveplot }) => {
      const { canvas } = await waveplot.create(id)
      $.buffers.get(id)!.canvas = canvas
      $.canvasView =
        <canvas
          part="canvas"
          ref={{
            get current(): HTMLCanvasElement {
              return canvas
            }
          }}
        />
    })

    fx(({ canvasView, children }) => {
      $.view = <>
        {canvasView}
        <button onpointerdown={$.onPointerDown}>
          {children}
        </button>
      </>
    })
  }
))
