import { Preset } from './presets'

export type MachineKind = 'app' | 'mono' | 'scheduler'

export class MachineData<T = any> {
  id!: string
  groupId!: string
  kind!: MachineKind
  detail!: T | false
  spacer!: number[]
  height!: number
  outputs!: string[]
  presets!: Preset<T>[]
}
