import { rpc } from 'rpc-mini'
import { VM } from 'monolang'
import { areSlidersCompatible, ArgContext, getCodeWithoutArgs, getSliders } from './util/args'

const MAX_TASKS = 6

let argContext: ArgContext

class Task {
  vm = new VM()
  code!: string
  accessTime!: number
  startVmMem?: Float32Array
  resetVmMem?: Float32Array
  isMemDirty?: boolean

  constructor() {
    this.access()
    this.vm.setPort(vmPort)
  }

  access() {
    this.accessTime = performance.now()
    return this
  }

  async compile(code: string) {
    // console.log('compile')

    this.code = code

    if (this.startVmMem) {
      this.vm.floats.set(this.startVmMem)
      this.vm.isReady = false
    } else {
      this.startVmMem = this.vm.floats.slice()
    }

    await this.vm.setCode(!code.trim() ? 'f()=0' : code)

    this.resetVmMem = this.vm.floats.slice()
    this.isMemDirty = false

    return this
  }

  async setParam(id: string, value: number) {
    if (this.isMemDirty) {
      this.reset()
      this.isMemDirty = false
    }
    this.vm.exports[id].value = value
  }

  async reset() {
    this.vm.floats.set(this.resetVmMem!)
  }

  async fill(floats: Float32Array) {
    this.vm.exports.sampleRate.value = argContext.sampleRate
    this.vm.exports.currentTime.value = 1
    // this.vm.exports.fill(0, argContext.sampleRate, 0, 0)
    this.vm.exports.midi_in?.(144, 40, 127)
    for (let i = 0; i < floats.length - 128; i += 128) {
      this.vm.exports.fill(0, argContext.sampleRate + i, 0, 128)
      floats.set(this.vm.outputs[0], i)
    }
    this.isMemDirty = true
  }
}

const tasks: Task[] = []

async function execTask(code: string, floats: Float32Array) {
  const nextSliders = getSliders(code, argContext)
  const nextCodeNoArgs = getCodeWithoutArgs(code)

  let isDirty = false

  for (const task of tasks) {
    if (!task.vm.isReady) continue

    if (code === task.code) {
      task.access()
      task.reset()
      task.fill(floats)
      return true
    }

    const prevSliders = getSliders(task.code, argContext)
    if (areSlidersCompatible(prevSliders, nextSliders)) {
      task.access()

      const prevCodeNoArgs = getCodeWithoutArgs(task.code)

      if (prevCodeNoArgs === nextCodeNoArgs) {
        for (const [id, slider] of nextSliders) {
          const prev = prevSliders.get(id)!
          if (prev.value !== slider.value) {
            // task.setParam(slider.id, slider.value)
            isDirty = true
          }
          task.setParam(slider.id, slider.value)
        }

        if (isDirty) {
          task.code = code
          task.fill(floats)
          return true
        }

        return false
      } else {
        await task.compile(code)
        task.fill(floats)
        return true
      }
    }
  }

  let task: Task

  if (tasks.length < MAX_TASKS) {
    task = new Task()
    tasks.push(task)
  } else {
    tasks.sort((a, b) => a.accessTime - b.accessTime)
    task = tasks[0]
  }

  await task.access().compile(code)
  task.fill(floats)
  return true
}

interface PreviewWorker {
  setPort(port: MessagePort): Promise<void>
  setArgContext(argContext: ArgContext): Promise<void>
  fillPreview(code: string, floats: Float32Array): Promise<boolean>
}

let vmPort: MessagePort

const preview: PreviewWorker = {
  async setPort(port) {
    vmPort = port
  },

  async setArgContext(_argContext: ArgContext) {
    argContext = _argContext
  },

  async fillPreview(code, floats) {
    return execTask(code, floats)
  },
}

rpc(self as unknown as MessagePort, preview as any)
