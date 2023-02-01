import { debugObjectMethods } from 'everyday-utils'
import { rpc } from 'rpc-mini'
// import { hasOffscreenCanvas } from './util/has-offscreen-canvas'
import { PseudoWorker } from './util/pseudo-worker'
import { WaveplotWorker } from './waveplot-worker'

const hasOffscreenCanvas = false

const WorkerImpl = hasOffscreenCanvas
  ? Worker
  : PseudoWorker

let worker: Worker
export function getWaveplotPort() {
  // @ts-ignore
  worker ??= new WorkerImpl(
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
      const offscreen = hasOffscreenCanvas
        ? canvas.transferControlToOffscreen()
        : canvas

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
      return await remote('draw', id)
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
