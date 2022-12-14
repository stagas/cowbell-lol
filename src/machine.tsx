/** @jsxImportSource minimal-view */

import { element, view, web } from 'minimal-view'
import { cheapRandomId, isEqual, pick } from 'everyday-utils'

import type { AppContext, AppDetail, AppPresets } from './app'
import type { SchedulerDetail, SchedulerPresets } from './scheduler'

import { MonoDetail, MonoPresets } from './mono'
import { Audio } from './audio'

export type MachineKind = 'app' | 'mono' | 'scheduler'

export type MachineState = 'init' | 'idle' | 'ready' | 'running' | 'suspended' | 'preview'

export type MachineCompileState = 'init' | 'compiling' | 'compiled' | 'errored'

export type MachineDetail = AppDetail | MonoDetail | SchedulerDetail

export type MachinePresets = AppPresets | MonoPresets | SchedulerPresets

export type AudioMachinePresets = MonoPresets | SchedulerPresets

export abstract class Machine<T extends MachinePresets = any> {
  abstract id: string
  abstract kind: MachineKind

  state: MachineState = 'init'

  toJSON(): unknown {
    return pick(this, [
      'id',
      // 'size',
      // 'presets',
    ])
  }

  equals(other?: this) {
    if (this === other) return true

    return other != null
      && this.id === other.id
      && this.state === other.state

  }

  copy(): this {
    // @ts-ignore
    return new this.constructor(this.toJSON())
  }

  constructor(data: Partial<Machine<T>> = {}) {
    Object.assign(this, data)
  }
}

export abstract class AudioMachine<T extends AudioMachinePresets = AudioMachinePresets> extends Machine<T> {
  id = cheapRandomId()
  groupId!: string

  abstract selectedPreset: T['selectedPreset']

  declare audio?: Audio

  outputs: string[] = []

  constructor(data: Partial<AudioMachine<T>> = {}) {
    super(data)
    Object.assign(this, data)
  }

  equals(other?: this) {
    if (this === other) return true

    return other != null
      && this.id === other.id
      && isEqual(this.outputs, other.outputs)
      && this.selectedPreset
      && other.selectedPreset
      && this.selectedPreset.equals(other.selectedPreset)
      && super.equals(other)
  }

  toJSON(): unknown {
    return pick(this, [
      'id',
      'groupId',
      'outputs',
      'audio',
      'selectedPreset',
    ])
  }
}

export const MachineView = web('machine', view(
  class props {
    app!: AppContext
    audio!: Audio
    machine!: Machine
    presets!: MonoPresets | SchedulerPresets
  },

  class local {
    host = element
    align?: AppContext['align']
    kind?: Machine['kind']
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {

    })
  },

  function effects({ $, fx }) {
    fx(function machineCss({ align, kind }) {
      const [dim, wrap] = [
        ['width', 'row'] as const,
        ['height', 'column'] as const
      ][+(align === 'y')]

      $.css = /*css*/`

      & {
        box-sizing: border-box;
        display: flex;
        flex-flow: ${wrap} wrap;
        position: relative;
        max-${dim}: 100%;
        z-index: ${kind === 'scheduler' ? 3 : 4};
        pointer-events: none;

        > * {
          flex: 1;
        }
      }
      `
    })

    fx(function updateAppAlign({ app }) {
      $.align = app.align
    })

    fx(function updateMachineKind({ machine }) {
      $.kind = machine.kind
    })

    fx(function updateAttrId({ host, machine }) {
      host.setAttribute('id', machine.id)
    })

    // fx(({ host, align }) => {
    //   const [dim, innerDim] = [
    //     ['height', 'innerHeight'] as const,
    //     ['width', 'innerWidth'] as const
    //   ][+(align === 'y')]

    //   const resize = queue.raf(() => {
    //     host.style[dim] = Math.min(800, window[innerDim] - 50) + 'px'
    //   })
    //   resize()
    //   return on(window, 'resize')(resize)
    // })

    fx(function drawMachine({ app, audio, machine, presets }) {
      const Kind = app.Machines[machine.kind] as any

      $.view = <Kind
        id={machine.id}
        app={app}
        audio={audio}
        machine={machine}
        presets={presets}
      />
    })
  }))
