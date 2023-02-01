/** @jsxImportSource minimal-view */

import { element, view, web } from 'minimal-view'
import { services } from './services'
import { hasOffscreenCanvas as hoc } from './util/has-offscreen-canvas'
import { PseudoWorker } from './util/pseudo-worker'

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const hasOffscreenCanvas = isFirefox ? false : hoc

const WorkerImpl = hasOffscreenCanvas
  ? Worker
  : PseudoWorker

import type { WavetracerWorkerBytes, WavetracerWorkerColors, WavetracerWorkerCurrentTime, WavetracerWorkerInit, WavetracerWorkerLoopTime, WavetracerWorkerResize, WavetracerWorkerStart, WavetracerWorkerStop } from './wavetracer-worker'

function post<T>(target: MessagePort | Worker, message: T, transfer?: StructuredSerializeOptions) {
  return target.postMessage(message, transfer)
}

let worker: Worker
const getWavetracerPort = () => {
  // @ts-ignore
  worker ??= new WorkerImpl(
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
    kind!: 'tracer' | 'scroller' | 'detailed'
    running = false
    workerBytes!: Uint8Array
    workerFreqs!: Uint8Array
    colors?: { bg: string }
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
              currentTime: services.$.audio!.$.getTime(),
            })
          }, 1000)
          if (kind === 'tracer') {
            post<WavetracerWorkerStart>(worker, {
              id,
              kind,
              start: true,
              loopTime,
              currentTime: services.$.audio!.$.getTime(),
            })
          } else if (kind === 'scroller' || kind === 'detailed') {
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
      background: transparent;
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
      const offscreen = hasOffscreenCanvas
        ? canvas.transferControlToOffscreen()
        : canvas as any
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

    fx(function postColors({ id, colors, worker, sentCanvas }) {
      if (!sentCanvas) return
      post<WavetracerWorkerColors>(worker, {
        id,
        bg: colors.bg
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
