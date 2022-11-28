import { PresetsGroupDetail } from 'abstract-presets'
import { List } from 'immutable-list'
import { deobjectify, objectify } from 'json-objectify'
import { replacer, reviver } from 'serialize-whatever'

import { AppDetail, AppMachine, AppPresets } from '../app'
import { MonoDetail, MonoMachine, MonoPresets } from '../mono'
import { Preset } from '../presets'
import { SchedulerDetail, SchedulerMachine, SchedulerPresets } from '../scheduler'
import { Slider } from '../slider'

export function deserialize(json: unknown) {
  const Classes: any[] = [
    List,

    AppMachine,
    MonoMachine,
    SchedulerMachine,
    AppDetail,
    MonoDetail,
    SchedulerDetail,

    Preset,
    PresetsGroupDetail,

    AppPresets,
    MonoPresets,
    SchedulerPresets,

    Slider
  ]

  return deobjectify(json, reviver(Classes))
}

export function serialize(json: unknown) {
  return objectify(json, replacer(json))
}
