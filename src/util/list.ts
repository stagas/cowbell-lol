import { Reactive, ReactiveFactory } from 'minimal-view'

export function add<T extends Reactive>(
  items: T[],
  item: T,
  index: number
) {
  const copy = [...items]
  copy.splice(index, 0, item)
  return copy
}

export function del<T extends Reactive>(
  items: T[],
  item: T
) {
  const index = items.indexOf(item)
  if (!~index) return items

  item.dispose()

  const copy = [...items]
  copy.splice(index, 1)
  return copy
}

export function delById<T extends Reactive>(
  items: T[],
  id: string
) {
  const index = items.findIndex((item) => item.$.id === id)
  if (!~index) return items

  items[index].dispose()

  const copy = [...items]
  copy.splice(index, 1)
  return copy
}

export function get<T extends Reactive>(
  items: T[],
  id: string
) {
  return items.find((item) => item.$.id === id)
}

export function findEqual<T extends Reactive<
  string,
  unknown,
  {
    id: string
    equals: (props: Partial<T['$']>) => boolean
  }
>
>(items: T[], id: string, p: T['$']) {
  for (const other of items) {
    if (id === other.$.id) continue
    if (other.$.equals(p)) {
      return other
    }
  }
  return false
}

export function derive<T extends Reactive<
  string,
  unknown,
  {
    derive: (props: Partial<T['$']>) => readonly [
      ReactiveFactory<any, any, any>,
      Partial<T['$']>
    ]
  }
>
>(items: T[], id: string, props: Partial<T['$']>) {
  const item = get(items, id)!
  return item.$.derive(props)
}

// export function derive<T extends Reactive>(items: T[], id: string, props: any, index?: number) {
//   const item = get(items, id)!

//   if (item.$.isDraft) {
//     const [, p] = item.$.derive(props)
//     // Object.assign(item.$, props)

//     if (!p.isIntent) {
//       for (const other of items) {
//         if (id === other.$.id) continue
//         if (other.$.equals(p)) {
//           return [del(items, item), other]
//         }
//       }
//     }

//     // Object.assign(item.$, props)

//     return [items, p]
//   } else {
//     const [ctor, p] = item.$.derive(props)

//     for (const other of items) {
//       if (id === other.$.id) continue
//       // if (other.$.isDraft) continue
//       if (other.$.equals(p)) {
//         return [items, other]
//       }
//     }

//     p.parentId = id

//     const instance = ctor(p)

//     return [
//       add(
//         items,
//         instance,
//         index != null && index < items.length
//           ? index + 1
//           : items.indexOf(item) + 1
//       ),
//       instance
//     ]
//   }
// }
