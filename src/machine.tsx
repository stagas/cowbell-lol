/** @jsxImportSource minimal-view */

import { element, on, queue, view, web } from 'minimal-view'

import type { App } from './app'
import { MachineData } from './machine-data'
import { MonoDetail } from './mono'
import { SchedulerDetail } from './scheduler'

export * from './machine-data'

export type MachineAudio = Pick<MachineData,
  & 'audioContext'
  & 'audioNode'
  & 'analyserNode'
  & 'schedulerNode'
>

export const Machine = web('machine', view(
  class props {
    app!: App
    audio!: MachineAudio
    machine!: MachineData<MonoDetail | SchedulerDetail>
  }, class local {
  host = element
}, ({ $, fx }) => {
  fx(({ machine }) => {
    $.css = /*css*/`
    & {
      box-sizing: border-box;
      display: flex;
      flex-flow: column wrap;
      position: relative;
      max-height: 100%;
      z-index: ${machine.kind === 'scheduler' ? 4 : 3};
      pointer-events: none;

      > * {
        flex: 1;
      }
    }
    `
  })

  fx(({ host, machine }) => {
    host.setAttribute('id', machine.id)
  })

  fx(({ host }) => {
    const resize = queue.raf(() => {
      host.style.width = Math.min(800, window.innerWidth - 50) + 'px'
    })
    resize()
    return on(window, 'resize')(resize)
  })

  fx(({ app, audio, machine }) => {
    const Kind = app.Machines[machine.kind]

    $.view = <Kind
      app={app}
      machine={machine}
      {...audio}
      {...machine}
    />
  })
}))
