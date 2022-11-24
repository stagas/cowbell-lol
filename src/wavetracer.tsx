/** @jsxImportSource minimal-view */

import { element, view, web } from 'minimal-view'

import type { WavetracerWorkerBytes, WavetracerWorkerInit, WavetracerWorkerResize, WavetracerWorkerStart, WavetracerWorkerStop } from './wavetracer-worker'

import { getWavetracerPort } from './wavetracer-get-port'

function post<T>(target: MessagePort | Worker, message: T, transfer?: StructuredSerializeOptions) {
  return target.postMessage(message, transfer)
}

export const Wavetracer = web('wavetracer', view(
  class props {
    id!: string
    kind!: 'tracer' | 'scroller'
    running = false
    audioContext!: AudioContext
    workerBytes?: Uint8Array
    width?= 100
    height?= 50
    loopTime?= 1
  }, class local {
  host = element
  canvas?: HTMLCanvasElement
  worker = getWavetracerPort()
  sentCanvas = false
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

  fx(async ({ id, kind, worker, canvas }) => {
    const offscreen = (canvas as any).transferControlToOffscreen() as HTMLCanvasElement
    post<WavetracerWorkerInit>(worker, { id, kind, canvas: offscreen }, [offscreen] as any)
    $.sentCanvas = true
  })

  fx(({ id, kind: _k, canvas: _c, width, height, worker, sentCanvas }) => {
    if (!sentCanvas) return
    post<WavetracerWorkerResize>(worker, {
      id,
      width,
      height,
      pixelRatio: pr
    })
  })

  let stop = () => { }

  const draw = fn(({ id, kind, audioContext, sentCanvas, worker, workerBytes, loopTime }) => {
    if (!sentCanvas) return () => { }

    stop = () => {
      post<WavetracerWorkerStop>(worker, { id, stop: true })
    }

    post<WavetracerWorkerBytes>(worker, { id, bytes: workerBytes })

    return () => {
      if (kind === 'tracer') {
        post<WavetracerWorkerStart>(worker, {
          id,
          kind,
          start: true,
          loopTime,
          currentTime: audioContext.currentTime
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

  fx.raf(({ host, running }) => {
    host.toggleAttribute('running', running)
  })

  fx(function waveStartStop({ running, sentCanvas }) {
    if (!sentCanvas) return
    if (running) {
      draw()
    } else {
      stop()
    }
  })

  fx(({ width, height }) => {
    $.view = <canvas ref={refs.canvas} width={width} height={height} />
  })
})))
