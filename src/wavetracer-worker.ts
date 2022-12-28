// import { hslToRgb, rgbToHsl } from 'everyday-utils'
import { animRemoveSchedule, animSchedule } from './anim'

export interface WavetracerWorkerInit {
  id: string
  kind: 'tracer' | 'scroller'
  canvas: HTMLCanvasElement
}

export interface WavetracerWorkerResize {
  id: string
  pixelRatio: number
  width: number
  height: number
}

export type WavetracerWorkerStart = {
  id: string
  start: boolean
} & ({
  kind: 'tracer'
  loopTime: number
  currentTime: number
} | {
  kind: 'scroller'
})

export interface WavetracerWorkerStop {
  id: string
  stop: boolean
}

export interface WavetracerWorkerBytes {
  id: string
  bytes: Uint8Array
  freqs: Uint8Array
}

export interface WavetracerWorkerLoopTime {
  id: string
  loopTime: number
}

export interface WavetracerWorkerCurrentTime {
  id: string
  currentTime: number
}

export type WavetracerWorkerMessage =
  | WavetracerWorkerInit
  | WavetracerWorkerResize
  | WavetracerWorkerStart
  | WavetracerWorkerStop
  | WavetracerWorkerBytes
  | WavetracerWorkerLoopTime
  | WavetracerWorkerCurrentTime

function createWorkerTask(id: string, kind: WavetracerWorkerInit['kind'], canvas: HTMLCanvasElement): Task {
  const c = canvas.getContext('2d', {
    alpha: false,
    desynchronized: false
  })!

  /** Device pixel ratio */
  let pr: number

  let bytes: Uint8Array
  let freqs: Uint8Array

  let offsetTime: number
  let width: number
  let height: number

  /** Previous y position */
  let py: number

  let loopTime = 1

  const rgb = [0, 0, 0]
  // const hsl = [0, 0, 0]

  function setTimers(_offsetTime: number, _loopTime: number) {
    offsetTime = _offsetTime
    loopTime = _loopTime
  }

  function setOffsetTime(_offsetTime: number) {
    offsetTime = _offsetTime
  }

  function setLoopTime(newLoopTime: number) {
    loopTime = newLoopTime
  }

  function setBytes(_bytes: Uint8Array, _freqs: Uint8Array) {
    bytes = _bytes
    freqs = _freqs
  }

  function setSizes(pixelRatio: number, newWidth: number, newHeight: number) {
    pr = pixelRatio
    c.lineWidth = pr

    width = newWidth //* pr | 0
    height = newHeight * pr | 0

    py = 0.5 * height

    if (width !== canvas.width || height !== canvas.height) {
      canvas.width = width
      canvas.height = height

      c.clearRect(0, 0, canvas.width, canvas.height)

      c.strokeStyle = '#16e'
      c.imageSmoothingEnabled = false
    }
  }

  let x: number
  let y: number
  let h: number

  let drawFn: () => void

  if (kind === 'tracer') drawFn = () => {
    const currentTime = performance.now() * 0.001 + offsetTime
    x = currentTime / loopTime
    x = (x - (x | 0)) * width
    y = (height - pr) * h + pr / 2

    if ((x | 0) === 0) {
      c.globalCompositeOperation = 'darken'
      c.fillStyle = '#0002'
      c.fillRect(0, 0, width, height)
      c.globalCompositeOperation = 'source-over'
    }

    c.beginPath()
    c.moveTo(x, py)
    c.lineTo(x, y)
    c.closePath()
    c.stroke()
  }
  else if (kind === 'scroller') drawFn = () => {
    c.drawImage(canvas, -1, 0, width, height)
    c.fillRect(canvas.width - 1, 0, 1, height)

    y = (height - pr) * h + pr / 2
    c.beginPath()
    c.moveTo(width - 1, py)
    c.lineTo(width, y)
    c.closePath()
    c.stroke()
  }

  const draw = () => {
    animSchedule(draw)
    if (!c || !bytes) return

    h = bytes[0] / 256

    rgb[2] = (freqs[0] + freqs[1] + freqs[2] + freqs[3] + freqs[4] + freqs[5]) / 6 / 256
    rgb[1] = (freqs[6] + freqs[7] + freqs[8] + freqs[9] + freqs[10]) / 5 / 256
    rgb[0] = (freqs[11] + freqs[12] + freqs[13] + freqs[14] + freqs[15]) / 5 / 256

    // hsl = rgbToHsl([rgb[0], rgb[1] ** 0.8, rgb[2]])
    // rgb = hslToRgb([hsl[0], hsl[1] ** 0.1, hsl[2] ** 1])

    c.strokeStyle = `rgb(${rgb[0] ** 0.2 * 255},${rgb[1] ** 0.8 * 255},${rgb[2] ** 1.15 * 255})`

    const normal = 1 - h * 2
    const sign = Math.sign(normal)
    h = ((Math.abs(normal) ** 0.38) * sign * 0.5 + 0.5)
    drawFn()
    py = y
  }

  return {
    id,
    draw,
    setLoopTime,
    setSizes,
    setTimers,
    setOffsetTime,
    setBytes
  }
}

interface Task {
  id: string
  setLoopTime: (loopTime: number) => void
  setSizes: (pixelRatio: number, width: number, height: number) => void
  setTimers: (offsetTime: number, loopTime: number) => void
  setOffsetTime: (offsetTime: number) => void
  setBytes: (bytes: Uint8Array, freqs: Uint8Array) => void
  draw: () => void
}

const tasks = new Map<string, Task>()

self.onmessage = (e: { data: WavetracerWorkerMessage }) => {
  if ('canvas' in e.data) {
    const task = createWorkerTask(e.data.id, e.data.kind, e.data.canvas)
    tasks.set(task.id, task)
    return
  }

  const task = tasks.get(e.data.id)
  if (!task) {
    console.error(e.data)
    throw new Error('No task found with id: ' + e.data.id)
  }

  if ('width' in e.data) {
    task.setSizes(e.data.pixelRatio, e.data.width, e.data.height)
  }
  else if ('start' in e.data) {
    if (e.data.kind === 'tracer') {
      task.setTimers(
        e.data.currentTime - performance.now() * 0.001,
        e.data.loopTime
      )
      animSchedule(task.draw)
    }

    animSchedule(task.draw)
  }
  else if ('stop' in e.data) {
    animRemoveSchedule(task.draw)
  }
  else if ('bytes' in e.data) {
    task.setBytes(e.data.bytes, e.data.freqs)
  }
  else if ('loopTime' in e.data) {
    task.setLoopTime(e.data.loopTime)
  }
  else if ('currentTime' in e.data) {
    task.setOffsetTime(e.data.currentTime - performance.now() * 0.001)
  }
  else {
    console.error(e)
    throw new TypeError('Invalid message received in Wavetracer worker.')
  }
}
