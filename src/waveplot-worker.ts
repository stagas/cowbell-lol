import { rpc } from 'rpc-mini'

import { hslToRgb, rgbToHsl } from 'everyday-utils'
import { Scalar } from 'geometrik'
import { createRunner } from 'pretty-fast-fft'

import type { WaveplotSetup, WaveplotWorkerSetup } from './waveplot'

const fftSize = 512
const fftStep = 128
const fftAnalyserPromise = createRunner(fftSize, fftStep)

function createWorker({ sampleRate, canvas, width, height, pixelRatio, floats }: WaveplotWorkerSetup): WaveplotWorkerInstance {
  const c = canvas.getContext('2d', {
    alpha: true,
    desynchronized: false
  })!

  /** Device pixel ratio */
  const pr = pixelRatio

  // let floats: Float32Array
  // let freqs: Float32Array

  /** Previous y position */
  let py: number

  // const rgb = [0, 0, 0]
  // const hsl = [0, 0, 0]

  // function setData(_floats: Float32Array, _freqs: Float32Array) {
  //   floats = _floats
  //   freqs = _freqs
  // }

  c.lineWidth = pr / 2

  // width = width //* pr | 0
  // height = height * pr | 0

  py = 0.5 * height

  if (width !== canvas.width || height !== canvas.height) {
    canvas.width = width
    canvas.height = height

    c.clearRect(0, 0, canvas.width, canvas.height)

    c.strokeStyle = '#16e'
    // c.imageSmoothingEnabled = false
  }

  let x: number
  let y: number
  let h: number

  const drawFn = () => {
    y = (height - pr) * h + pr / 2
    c.beginPath()
    c.moveTo(x, py)
    c.lineTo(x, py = y)
    c.closePath()
    c.stroke()
  }

  const coeff = floats.length / width

  const draw = async () => {
    if (!c || !floats) return
    // if (floats[1] === 0 && floats[10] === 0 && floats[20] === 0) return

    c.clearRect(0, 0, width, height)

    const stft_magnitudes = fftAnalyser.processAudio(floats)

    // blue..green..red
    const frequencies = [50, 100, 200, 400, 800, 1600, 3200, 6400]

    let max_value = 0
    let min_value = 10000
    for (let t = 0; t < stft_magnitudes.length; t++) {
      for (let f = 0; f < stft_magnitudes[t].length; f++) {
        stft_magnitudes[t][f] = !stft_magnitudes[t][f] ? 0 : Math.log(stft_magnitudes[t][f])
        max_value = Math.max(stft_magnitudes[t][f], max_value)
        min_value = Math.min(stft_magnitudes[t][f], min_value)
      }
    }

    const scale = max_value - min_value
    const hzPerBin = sampleRate / stft_magnitudes[0].length
    const bins = []

    for (let t = 0; t < stft_magnitudes.length; t++) {
      bins.push(frequencies.map(f => {
        const index = ((f + hzPerBin / 2) / hzPerBin) | 0
        return (stft_magnitudes[t][index] - min_value) / scale
      }))
    }

    const colorStops = bins.map(
      ([bass0, bass1, mid0, mid1, mid2, mid3, high0, high1], i) => [
        i / (frequencies.length - 1),
        `rgb(${(() => {
          const rgb = [
            ((high0 + high1) * 0.5) ** 4, //
            ((mid0 + mid1 + mid2 + mid3) * 0.25) ** 5, //
            ((bass0 + bass1) * 0.5) ** 6,
          ]

          const [h, s, l] = rgbToHsl(rgb as any) as [number, number, number]
          return hslToRgb([h, s ** 0.2, l ** 0.5] as any).map(x => x * 255)
        })()
        }`,
      ]
    ) as [number, string][]

    const gradient = c.createLinearGradient(0, 0, width, 0)
    for (const [pos, rgb] of colorStops) {
      const np = Math.max(
        0,
        Math.min(
          1,
          new Scalar(pos)
            .scaleSelf(width)
            // .transformSelf(viewMatrix!)
            .normalizeSelf(width).x
        )
      )
      gradient.addColorStop(np, rgb)
    }
    c.strokeStyle = gradient

    for (x = 0; x < width; x++) {
      h = floats[x * coeff | 0] * 0.5 + 0.5
      drawFn()
    }
  }

  return {
    draw,
    canvas,
    context: c
  }
}

interface WaveplotWorkerInstance {
  draw: () => Promise<void>
  canvas: OffscreenCanvas
  context: OffscreenCanvasRenderingContext2D
}

type Resolved<T> = T extends Promise<infer U> ? U : T

let fftAnalyser: Resolved<ReturnType<typeof createRunner>>
let setupData: WaveplotSetup
const workers = new Map<string, WaveplotWorkerInstance>()

export interface WaveplotWorker {
  draw(id: string): Promise<false>;
  setup(data: WaveplotSetup): Promise<void>
  create(id: string, canvas: OffscreenCanvas, floats: Float32Array): Promise<void>
  copy(a: string, b: string): Promise<void>
}

export const WaveplotWorker: WaveplotWorker = {
  async draw(id: string) {
    const worker = workers.get(id)!
    await worker.draw()
    // this is part of a tribool (false | void | Error)
    // false because we want the error only to be truthy (if (error) ...)
    return false
  },

  async setup(data: WaveplotSetup) {
    setupData = data
    fftAnalyser = await fftAnalyserPromise
  },

  async create(id, canvas, floats) {
    const worker = createWorker({
      ...setupData, canvas, floats
    })
    workers.set(id, worker)
  },

  async copy(a, b) {
    const wa = workers.get(a)!
    const wb = workers.get(b)!
    if (!wa || !wb) return

    wb.context.clearRect(0, 0, wb.canvas.width, wb.canvas.height)
    wb.context.drawImage(wa.canvas, 0, 0)

  }
}

rpc(self as unknown as MessagePort, WaveplotWorker as any)
