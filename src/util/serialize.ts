// import { PresetsGroupDetail } from 'abstract-presets'
// import { cheapRandomId, deepMutate, isEqual } from 'everyday-utils'
// import { List } from '@stagas/immutable-list'
// import { deobjectify, objectify } from 'json-objectify'
// import { createContext, Ptr } from 'serialize-whatever'

// import { AppDetail, AppMachine, AppPresets } from '../app'
// import { MonoDetail, MonoMachine, MonoPresets } from '../mono'
// import { Preset } from '../presets'
// import { SchedulerDetail, SchedulerMachine, SchedulerPresets } from '../scheduler'
// import { Slider } from '../slider-view'

// const refs = new Map<object, Ptr>()
// const { replacer, reviver } = createContext([], {
//   get(key) {
//     for (const [obj, ref] of refs) {
//       if (obj === key || isEqual(obj, key)) {
//         return ref
//       }
//     }
//   },
//   has(key) {
//     for (const obj of refs.keys()) {
//       if (obj === key || isEqual(obj, key)) return true
//     }
//     return false
//   },
//   set(obj, ref) {
//     return refs.set(obj, ref)
//   },
//   clear() {
//     return refs.clear()
//   }
// } as Map<object, Ptr>)

// function getClasses() {
//   return [
//     List,

//     AppMachine,
//     MonoMachine,
//     SchedulerMachine,

//     AppDetail,
//     MonoDetail,
//     SchedulerDetail,

//     Preset,
//     PresetsGroupDetail,

//     AppPresets,
//     MonoPresets,
//     SchedulerPresets,

//     Slider
//   ]
// }

// export function deserialize(json: unknown) {
//   const Classes: any[] = getClasses()
//   refs.clear()
//   return deobjectify(json, reviver(Classes))
// }

// export const deserializeUnique = (json: unknown) => {
//   const Classes: any[] = getClasses()

//   const idsMap = new Map()

//   json = JSON.parse(JSON.stringify(json))

//   json = deepMutate(json, (key, value) => {
//     if (key.toLowerCase().endsWith('id')) {
//       if (!idsMap.has(value)) {
//         const id = cheapRandomId()
//         idsMap.set(id, id)
//         idsMap.set(value, id)
//         value = id
//       } else {
//         value = idsMap.get(value)
//       }
//     }
//     // if ((key === 'plugs' || key === 'detail' || key === 'arrows' || key === 'plugValues') && Array.isArray(value.$v)) {
//     //   for (const item of value.$v) {
//     //     // console.log(item.$v)
//     //     if (!item.$v) continue
//     //     const k = item.$v[0]
//     //     if (idsMap.has(k)) {
//     //       item.$v[0] = idsMap.get(k)
//     //     } else {
//     //       const id = cheapRandomId()
//     //       idsMap.set(id, id)
//     //       idsMap.set(k, id)
//     //       item.$v[0] = id
//     //     }
//     //   }
//     // }
//     return [key, value]
//   })

//   return deobjectify(json, reviver(Classes))
// }

// export function serialize(json: unknown) {
//   refs.clear()
//   return objectify(json, replacer(json))
// }

export { }
