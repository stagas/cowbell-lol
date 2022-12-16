import { debugObjectMethods } from 'everyday-utils'
import { rpc } from 'rpc-mini'
import { WaveplotWorker } from './waveplot-worker'

let worker: Worker
export function getWaveplotPort() {
  worker ??= new Worker(
    // @ts-ignore
    new URL('./waveplot-worker.js', import.meta.url),
    { type: 'module' }
  )

  return worker
}

export interface WaveplotSetup {
  sampleRate: number
  samplesLength: number
  width: number
  height: number
  pixelRatio: number
}

export interface WaveplotWorkerSetup extends WaveplotSetup {
  canvas: OffscreenCanvas
  floats: Float32Array
  // freqs: Float32Array
}

export interface WaveplotTarget {
  canvas: HTMLCanvasElement
  floats: Float32Array
}

export interface Waveplot {
  targets: Map<string, WaveplotTarget>
  draw: WaveplotWorker['draw']
  create: (id: string) => Promise<WaveplotTarget>
  copy: (a: string, b: string) => Promise<void>
}

export async function createWaveplot(setup: WaveplotSetup): Promise<Waveplot> {
  const worker = getWaveplotPort()
  const remote = rpc(worker as unknown as MessagePort)

  await remote('setup', setup)

  const targets: Waveplot['targets'] = new Map()

  return debugObjectMethods({
    targets,

    async create(id) {
      const canvas = document.createElement('canvas')
      canvas.id = id
      canvas.width = setup.width
      canvas.height = setup.height
      const offscreen = canvas.transferControlToOffscreen()

      const floats = new Float32Array(
        new SharedArrayBuffer(setup.samplesLength * Float32Array.BYTES_PER_ELEMENT)
      )

      const target = {
        canvas,
        floats
      }

      targets.set(id, target)

      await remote('create', id, offscreen, floats)

      return target
    },
    draw: async (id) => {
      await remote('draw', id)
    },
    async copy(a, b) {
      await remote('copy', a, b)
    }
  }, [], {
    before: (key, args) => {
      console.log(key, args)
    },
    after: () => { }
  }, 'waveplot')
}
// export const Waveplot = web('waveplot', view(
//   class props {
//     id!: string

//     floats!: Float32Array
//     freqs!: Float32Array
//     workerFloats!: Float32Array
//     workerFreqs!: Float32Array

//     width?= 100
//     height?= 50
//   },

//   class local {
//     host = element
//     canvas?: HTMLCanvasElement
//     worker = getWaveplotPort()
//     sentCanvas = false
//   },

//   function actions({ $, fn, fns }) {
//     return fns(new class actions {
//       draw = fn((
//         {
//           id,
//           sentCanvas,
//           worker,
//           workerFloats,
//           workerFreqs
//         }) => {
//         if (!sentCanvas) return () => { }

//         post<WaveplotWorkerData>(worker, {
//           id,
//           floats: workerFloats,
//           freqs: workerFreqs
//         })

//         return (floats: Float32Array, freqs: Float32Array) => {
//           workerFloats.set(floats)
//           workerFreqs.set(freqs)
//           post<WaveplotWorkerDraw>(worker, { id })
//         }
//       })

//     })
//   },

//   function effects({ $, fx, refs }) {
//     $.css = /*css*/`

//     & {
//       display: block;
//       width: 100%;
//       height: 100%;
//       pointer-events: all;
//       z-index: 9999;
//     }
//     canvas {
//       background: #000;
//       display: flex;
//       image-rendering: pixelated;
//       height: 0;
//       min-height: 100%;
//       width: 100%;
//     }
//     &(:not([running])) {
//       opacity: 0.2;
//     }
//     &([kind=tracer]:hover) {
//       opacity: 1 !important;
//     }
//     `

//     const pr = window.devicePixelRatio

//     fx(async function postCanvas({ id, worker, canvas }) {
//       const offscreen = (canvas as any).transferControlToOffscreen() as HTMLCanvasElement
//       post<WaveplotWorkerInit>(worker, { id, canvas: offscreen }, [offscreen] as any)
//       $.sentCanvas = true
//     })

//     fx(function postSizes({ id, canvas: _c, width, height, worker, sentCanvas }) {
//       if (!sentCanvas) return
//       post<WaveplotWorkerResize>(worker, {
//         id,
//         width,
//         height,
//         pixelRatio: pr
//       })
//     })

//     fx(function waveDraw({ floats, freqs, sentCanvas }) {
//       if (!sentCanvas) return
//       $.draw(floats, freqs)
//     })

//     fx(function drawWaveplot({ width, height }) {
//       $.view = <canvas ref={refs.canvas} width={width} height={height} />
//     })
//   })
// )
