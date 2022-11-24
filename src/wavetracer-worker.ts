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
}

export type WavetracerWorkerMessage =
  | WavetracerWorkerInit
  | WavetracerWorkerResize
  | WavetracerWorkerStart
  | WavetracerWorkerStop
  | WavetracerWorkerBytes

function createWorkerTask(id: string, kind: WavetracerWorkerInit['kind'], canvas: HTMLCanvasElement): Task {
  const c = canvas.getContext('2d')!

  /** Device pixel ratio */
  let pr: number

  let bytes: Uint8Array

  let offsetTime: number
  let width: number
  let height: number

  /** Previous y position */
  let py: number

  let loopTime = 1

  function setTimers(_offsetTime: number, _loopTime: number) {
    offsetTime = _offsetTime
    loopTime = _loopTime
  }

  function setLoopTime(newLoopTime: number) {
    loopTime = newLoopTime
  }

  function setBytes(_bytes: Uint8Array) {
    bytes = _bytes
  }

  function setSizes(pixelRatio: number, newWidth: number, newHeight: number) {
    pr = pixelRatio
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
    c.beginPath()
    c.lineWidth = pr
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
    c.lineWidth = pr
    c.moveTo(width - 1, py)
    c.lineTo(width, y)
    c.closePath()
    c.stroke()
  }

  const draw = () => {
    animSchedule(draw)
    if (!c || !bytes) return

    h = bytes[0] / 256
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
    setBytes
  }
}

interface Task {
  id: string
  setLoopTime: (loopTime: number) => void
  setSizes: (pixelRatio: number, width: number, height: number) => void
  setTimers: (offsetTime: number, loopTime: number) => void
  setBytes: (bytes: Uint8Array) => void
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
  } else if ('start' in e.data) {
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
    task.setBytes(e.data.bytes)
  }
  else {
    console.error(e)
    throw new TypeError('Invalid message received in Wavetracer worker.')
  }
}
