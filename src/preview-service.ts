import { rpc } from 'rpc-mini'
import { debugObjectMethods } from 'everyday-utils'
import { getSharedWorkerPort } from 'monolang'
import { EditorBuffer } from './editor-buffer'
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
  draw(buffer: EditorBuffer): Promise<Error | void | false>
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

  return debugObjectMethods({
    draw: queue.atomic(async (buffer) => {
      const id = buffer.$.id!

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

      return waveplot.draw(id)
    }),
  }, [], {
    before: (key, args) => {
      console.log(key, args)
    },
    after: () => { }
  }, 'preview-service')
}
