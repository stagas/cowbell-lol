/** @jsxImportSource minimal-view */

import { element, view, web } from 'minimal-view'
import { app } from './app'

import type { WavetracerWorkerBytes, WavetracerWorkerCurrentTime, WavetracerWorkerInit, WavetracerWorkerLoopTime, WavetracerWorkerResize, WavetracerWorkerStart, WavetracerWorkerStop } from './wavetracer-worker'

function post<T>(target: MessagePort | Worker, message: T, transfer?: StructuredSerializeOptions) {
  return target.postMessage(message, transfer)
}

let worker: Worker
const getWavetracerPort = () => {
  worker ??= new Worker(
    // @ts-ignore
    new URL('./wavetracer-worker.js', import.meta.url),
    {
      type: 'module',
    }
  )

  return worker
}

export const Wavetracer = web(view('wavetracer',
  class props {
    id!: string
    kind!: 'tracer' | 'scroller'
    running = false
    workerBytes!: Uint8Array
    workerFreqs!: Uint8Array
    width?= 100
    height?= 50
    loopTime?= 1
  },

  class local {
    host = element
    canvas?: HTMLCanvasElement
    worker = getWavetracerPort()
    sentCanvas = false
  },

  function actions({ $, fn, fns }) {
    let stop = () => { }

    let postCurrentTimeIv: any

    return fns(new class actions {
      stop = () => {
        clearInterval(postCurrentTimeIv)
        stop()
      }

      draw = fn((
        {
          id,
          kind,
          sentCanvas,
          worker,
          workerBytes,
          workerFreqs,
          loopTime
        }) => {
        if (!sentCanvas) return () => { }

        stop = () => {
          post<WavetracerWorkerStop>(worker, {
            id,
            stop: true
          })
        }

        post<WavetracerWorkerBytes>(worker, {
          id,
          bytes: workerBytes,
          freqs: workerFreqs
        })

        return () => {
          clearInterval(postCurrentTimeIv)
          postCurrentTimeIv = setInterval(() => {
            post<WavetracerWorkerCurrentTime>(worker, {
              id,
              currentTime: app.audio.$.getTime(),
            })
          }, 1000)
          if (kind === 'tracer') {
            post<WavetracerWorkerStart>(worker, {
              id,
              kind,
              start: true,
              loopTime,
              currentTime: app.audio.$.getTime(),
            })
          } else if (kind === 'scroller') {
            post<WavetracerWorkerStart>(worker, {
              id,
              kind,
              start: true,
            })
          }
        }
      })

    })
  },

  function effects({ $, fx, refs }) {
    $.css = /*css*/`

    & {
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: all;
      z-index: 0;
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
    &([kind=tracer]:hover) {
      opacity: 1 !important;
    }
    `

    const pr = window.devicePixelRatio

    fx.raf(function updateAttrKind({ host, kind }) {
      host.setAttribute('kind', kind)
    })

    fx.raf(function updateAttrRunning({ host, running }) {
      host.toggleAttribute('running', running)
    })

    fx(async function postCanvas({ id, kind, worker, canvas }) {
      const offscreen = (canvas as any).transferControlToOffscreen() as HTMLCanvasElement
      post<WavetracerWorkerInit>(worker, { id, kind, canvas: offscreen }, [offscreen] as any)
      $.sentCanvas = true
      return () => {
        $.stop()
      }
    })

    fx(function postSizes({ id, kind: _k, canvas: _c, width, height, worker, sentCanvas }) {
      if (!sentCanvas) return
      post<WavetracerWorkerResize>(worker, {
        id,
        width,
        height,
        pixelRatio: pr
      })
    })

    fx(function updateLoopTime({ id, running, sentCanvas, worker, loopTime }) {
      if (!sentCanvas || !running) return

      post<WavetracerWorkerLoopTime>(worker, {
        id,
        loopTime,
      })
    })

    fx(function waveStartStop({ running, sentCanvas }) {
      if (!sentCanvas) return
      if (running) {
        $.draw()
      } else {
        $.stop()
      }
    })

    fx(function drawWavetracer({ width, height }) {
      $.view = <canvas ref={refs.canvas} width={width} height={height} />
    })
  })
)
