import { rpc } from 'rpc-mini'
import { debugObjectMethods } from 'everyday-utils'
import { getSharedWorkerPort } from 'monolang'

import { EditorBuffer } from './app'
import { Waveplot } from './waveplot'
import { queue } from 'minimal-view'

let worker: Worker
export function getPreviewPort() {
  worker ??= new Worker(
    // @ts-ignore
    new URL('./preview-worker.js', import.meta.url),
    { type: 'module' }
  )
  return worker
}

export interface Preview {
  setActiveId(id: string): void
  draw(buffer: EditorBuffer): Promise<Error | void>
}

export function createPreview(waveplot: Waveplot, sampleRate: number): Preview {
  const worker = getPreviewPort()
  const remote = rpc(worker as unknown as MessagePort)

  remote('setPort', getSharedWorkerPort())
  remote('setArgContext', {
    sampleRate,
    beatSamples: sampleRate,
    numberOfBars: 1
  })

  let activeId: string
  return debugObjectMethods({
    setActiveId: (id) => {
      activeId = id
    },
    draw: queue.atomic(async (buffer) => {
      const id = buffer.$.id!

      if (!waveplot.targets.has(id)) {
        const { canvas } = await waveplot.create(id)
        buffer.$.canvas = canvas
      }

      try {
        const isDirty = await remote(
          'fillPreview',
          buffer.$.value,
          waveplot.targets.get(id)!.floats
        )

        if (!isDirty) return
      } catch (error) {
        return error as Error
      }

      waveplot.draw(id).then(() => {
        if (activeId === id) {
          waveplot.copy(id, 'main')
        }
        buffer.$.canvases?.forEach((key) => {
          waveplot.copy(id, key)
        })
      })
    }),
  }, [], {
    before: (key, args) => {
      console.log(key, args)
    },
    after: () => { }
  }, 'preview-service')
}
