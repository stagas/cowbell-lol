// import { hslToRgb, rgbToHsl } from 'everyday-utils'
import { anim } from './anim'
import { hasOffscreenCanvas } from './util/has-offscreen-canvas'

export interface WavetracerWorkerInit {
  id: string
  kind: 'tracer' | 'scroller' | 'detailed'
  canvas: HTMLCanvasElement
}

export interface WavetracerWorkerResize {
  id: string
  pixelRatio: number
  width: number
  height: number
}

export interface WavetracerWorkerColors {
  id: string
  bg: string
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
} | {
  kind: 'detailed'
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
  | WavetracerWorkerColors

function createWorkerTask(id: string, kind: WavetracerWorkerInit['kind'], canvas: HTMLCanvasElement): Task {
  const c = canvas.getContext('2d', {
    alpha: true,
    desynchronized: false
  })!

  /** Device pixel ratio */
  let pr: number

  let bytes: Uint8Array
  let freqs: Uint8Array

  let offsetTime: number
  let width: number
  let height: number

  // colors
  let bg = '#181522'

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

  let didPaintBg = false
  function setColors(_bg: string) {
    bg = _bg

    if (!didPaintBg) {
      didPaintBg = true
      c.globalCompositeOperation = 'source-over'
    }
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

      didPaintBg = false
      setColors(bg)
      c.imageSmoothingEnabled = false
    }
  }

  let x: number
  let y: number
  let h: number

  let drawFn: (start: number, end: number) => void

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
    c.fillStyle = bg
    c.fillRect(canvas.width - 1, 0, 1, height)

    y = (height - pr) * h + pr / 2
    if (y - py !== 0) {
      c.beginPath()
      c.moveTo(width - 1, py)
      c.lineTo(width, y)
      c.closePath()
      c.stroke()
    }
  }
  else if (kind === 'detailed') drawFn = (start: number, end: number) => {
    let top = 0, bottom = 0, s
    for (let i = start; i < end; i++) {
      s = bytes[i] / 256
      if (s > 0.5) {
        s = (((s - 0.5) * 2) ** 0.8)
        if (s > bottom) bottom = s
      } else if (s < 0.5) {
        s = 0.5 - s
        s = ((s * 2) ** 0.8)
        if (s > top) top = s
      }
    }
    top = 1 - top
    bottom += 1
    const h = (bottom - top) / 2 * height
    const y = top / 2 * height
    if (h <= 0.35) return

    const gradient = c.createLinearGradient(0, y, 0, y + h)
    gradient.addColorStop(0, 'rgba(20, 225, 255, 0.1)')
    gradient.addColorStop(0.5, 'rgba(20, 225, 255, 1)')
    gradient.addColorStop(1, 'rgba(20, 225, 255, 0.1)')
    c.fillStyle = gradient
    c.fillRect(width - 1, y, 1, h)
  }

  const draw = () => {
    anim.schedule(draw)
    if (!c || !bytes) return

    if (kind === 'detailed') {
      c.globalCompositeOperation = 'source-over'
      c.drawImage(canvas, -1, 0, width, height)
      c.fillStyle = bg
      c.fillRect(width - 1, 0, 1, height)

      const chunks = 8
      const chunk = bytes.length / chunks | 0

      drawFn(0, chunk)
      c.globalCompositeOperation = 'lighten'
      for (let i = 1; i < chunks; i++)
        drawFn(i * chunk, i * chunk + chunk)

    } else {
      h = bytes[0] / 256

      rgb[2] = (freqs[0] + freqs[1] + freqs[2] + freqs[3] + freqs[4] + freqs[5]) / 6 / 256
      rgb[1] = (freqs[6] + freqs[7] + freqs[8] + freqs[9] + freqs[10]) / 5 / 256
      rgb[0] = (freqs[11] + freqs[12] + freqs[13] + freqs[14] + freqs[15]) / 5 / 256

      c.strokeStyle = '#b9ff'

      const normal = 1 - h * 2
      const sign = Math.sign(normal)
      h = ((Math.abs(normal) ** 0.38) * sign * 0.5 + 0.5)
      drawFn(0, 0)
      py = y
    }
  }

  return {
    id,
    draw,
    setLoopTime,
    setSizes,
    setTimers,
    setOffsetTime,
    setBytes,
    setColors,
  }
}

interface Task {
  id: string
  setLoopTime: (loopTime: number) => void
  setSizes: (pixelRatio: number, width: number, height: number) => void
  setTimers: (offsetTime: number, loopTime: number) => void
  setOffsetTime: (offsetTime: number) => void
  setBytes: (bytes: Uint8Array, freqs: Uint8Array) => void
  setColors: (bg: string) => void
  draw: () => void
}

const tasks = new Map<string, Task>()

export default function handler(e: { data: WavetracerWorkerMessage }) {
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
      anim.schedule(task.draw)
    }

    anim.schedule(task.draw)
  }
  else if ('stop' in e.data) {
    anim.remove(task.draw)
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
  else if ('bg' in e.data) {
    task.setColors(e.data.bg)
  }
  else {
    console.error(e)
    throw new TypeError('Invalid message received in Wavetracer worker.')
  }
}

if (hasOffscreenCanvas) {
  self.onmessage = handler
}
