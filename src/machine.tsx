/** @jsxImportSource minimal-view */

import { element, on, queue, view, web } from 'minimal-view'

import type { AppLocal, AppDetail, AppPresets } from './app'
import type { SchedulerDetail, SchedulerPresets } from './scheduler'

import { MonoDetail, MonoPresets } from './mono'
import { Audio } from './audio'
import { cheapRandomId, pick } from 'everyday-utils'

export type MachineKind = 'app' | 'mono' | 'scheduler'

export type MachineState = 'init' | 'idle' | 'ready' | 'errored' | 'compiling' | 'running' | 'suspended'

export type MachineDetail = AppDetail | MonoDetail | SchedulerDetail

export type MachinePresets = AppPresets | MonoPresets | SchedulerPresets

export abstract class Machine<T extends MachinePresets = any> {
  abstract id: string
  abstract kind: MachineKind
  abstract height: number
  abstract presets: T

  state: MachineState = 'init'

  toJSON(): unknown {
    return pick(this, [
      'id',
      'height',
      'presets',
    ])
  }

  equals(other?: this) {
    if (this === other) return true

    return !other
      || (this.id === other.id
        && this.state === other.state
        &&
        (this.presets === other.presets
          || (
            this.presets.constructor === other.presets.constructor
            && this.presets.equals(other.presets as any)
          )))
  }

  copy(): this {
    // @ts-ignore
    return new this.constructor(this.toJSON())
  }

  constructor(data: Partial<Machine<T>> = {}) {
    Object.assign(this, data)
  }
}

export abstract class AudioMachine<T extends MachinePresets> extends Machine<T> {
  id = cheapRandomId()
  groupId!: string
  abstract spacer?: number[]

  declare audio?: Audio
  outputs: string[] = []

  constructor(data: Partial<AudioMachine<T>> = {}) {
    super(data)
    Object.assign(this, data)
  }

  toJSON(): unknown {
    return pick(this, [
      'id',
      'height',
      'groupId',
      'outputs',
      'audio',
      'spacer',
    ])
  }
}

export const MachineView = web('machine', view(
  class props {
    app!: AppLocal
    audio!: Audio
    machine!: Machine
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
    const Kind = app.Machines[machine.kind] as any

    $.view = <Kind
      id={machine.id}
      app={app}
      audio={audio}
      machine={machine}
    />
  })
}))
