import { rpc } from 'rpc-mini'
import { debugObjectMethods } from 'everyday-utils'
import { getSharedWorkerPort } from 'monolang'

import { EditorBuffer } from './types'
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
  draw(buffer: EditorBuffer): Promise<void>
}

export function createPreview(ctx: { activeId: string }, waveplot: Waveplot, sampleRate: number): Preview {
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
      const isDirty = await remote(
        'fillPreview',
        buffer.value,
        waveplot.targets.get(buffer.id)!.floats
      )

      if (!isDirty) return

      waveplot.draw(buffer.id).then(() => {
        if (ctx.activeId === buffer.id) {
          waveplot.copy(buffer.id, 'main')
        }
      })
    }),
    // async updateParam(buffer, paramId: string, value: number) {

    // },
    // async setCode(buffer) {
    //   await remote('setCode', buffer.value)
    // },
    // async setParam(buffer: EditorBuffer, paramId, value) {
    //   await this.setCode(buffer)
    //   await remote('setParam', paramId, value)
    // },
    // async reset() {
    //   await remote('reset')
    // },
    // async fill(floats, sampleRate) {
    //   await remote('fill', floats, sampleRate)
    // },
  }, [], {
    before: (key, args) => {
      console.log(key, args)
    },
    after: () => { }
  }, 'preview-service')
}
