import { CanvyElement } from 'canvy'
import { SchedulerNode } from 'scheduler-node'

import { MonoDetail } from './mono'
import { Preset } from './presets'
import { SliderParam } from './slider'
import { Detail, ItemDetail } from './util/detail'
import { List } from './util/list'

export type MachineKind = 'app' | 'mono' | 'scheduler'

export type MachineState = 'init' | 'idle' | 'ready' | 'errored' | 'compiling' | 'running' | 'suspended'

export class MachineData<T extends ItemDetail = ItemDetail> {
  // persisted
  id!: string
  groupId!: string
  kind!: MachineKind
  state: MachineState = 'init'
  outputs!: string[]
  presets = new List<Preset<T>>()
  selectedPresetId: string | false = false
  spacer!: number[]
  height!: number

  // exposed controls
  declare start?: () => void
  declare stop?: () => void
  declare compile?: (code: string, updateSliders?: boolean) => Promise<void>
  declare editor?: CanvyElement
  declare updateSliders?: () => Map<string, SliderParam> | undefined
  declare onWheel?: (ev: WheelEvent, sliderId?: string) => void
  declare updateMarkers?: (sliders: Map<string, SliderParam>) => void
  declare setSliderNormal?: (sliderId: string, newNormal: number) => void
  declare updateEditorValueArgs?: (
    editorValue: string,
    targetSliders?: Map<string, SliderParam>,
    sourceSliders?: Map<string, SliderParam>
  ) => Detail<MonoDetail> | undefined

  declare audioContext?: AudioContext
  declare audioNode?: AudioNode
  declare analyserNode?: AnalyserNode
  declare schedulerNode?: SchedulerNode
  declare workerBytes?: Uint8Array

  equals?(other: MachineData) {
    return this.id === other.id
      && this.state === other.state
      && this.selectedPresetId === other.selectedPresetId
  }

  constructor(data: Partial<MachineData<T>> = {}) {
    Object.assign(this, data)
  }
}
