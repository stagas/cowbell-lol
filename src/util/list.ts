import { entries, isEqual } from 'everyday-utils'

export function createOrReturn<T, R>(
  ctor: { new(list: T[]): R },
  object: R,
  list: T[],
  otherList: T[]
): R {
  // TODO: Shallow compare?
  if (list === otherList) return object
  return new ctor(otherList)
}

export class List<T extends object & { id: string }> {
  constructor(public items: T[] = []) { }
  add(item: T) {
    return new List([...this.items, item])
  }
  getById(itemId: string | false) {
    return getItemInListById(this.items, itemId)
  }
  setById(itemId: string, newItem: T): List<T> {
    return createOrReturn(List, this, this.items, setItemInListById(this.items, itemId, newItem))
  }
  hasId(itemId: string) {
    return this.items.some((item) => item.id === itemId)
  }
  updateById(itemId: string, updateData: Partial<T>): List<T> {
    return createOrReturn(List, this, this.items, updateItemInListById(this.items, itemId, updateData))
  }
  mergeEach(data: Partial<T>): List<T> {
    return new List(this.items.map((item) => updateOrReturn(item, data)))
  }
  removeById(itemId: string) {
    return createOrReturn(List, this, this.items, removeItemInListById(this.items, itemId))
  }
  insertAfterIndex(index: number, newItem: T) {
    return new List(insertItemInListAfterIndex(this.items, index, newItem))
  }
  toJSON() {
    return this.items
  }
}

export function updateOrReturn<T extends object>(target: T, updateData: Partial<T>) {
  if (entries(updateData).every(([key, value]) => key in target && isEqual(target[key], value)
  )) {
    return target
  }

  return {
    ...target,
    ...updateData
  }
}

export function updateItemInListById<T extends Item>(list: T[], itemId: string, updateData: Partial<T>) {
  let found = false
  let equal = false

  const newList = list.map((item) => {
    if (item.id === itemId) {
      const newItem = updateOrReturn(item, updateData)
      found = true
      if (newItem === item)
        equal = true
      return newItem
    }

    return item
  })

  if (!found) {
    throw new Error('Item not found with id: ' + itemId)
  }

  if (equal) {
    return list
  }

  return newList
}

export function getItemInListById<T extends Item>(list: T[], itemId: string | false) {
  const item = list.find((item) => item.id === itemId)

  if (!item) {
    throw new Error(`Item not found in list with id: "${itemId}"`)
  }

  return item
}

type Item = object & { id: string }
export function removeItemInListById<T extends Item>(list: T[], itemId: string) {
  getItemInListById(list, itemId) // ensure
  return list.filter((item) => item.id !== itemId)
}

export function setItemInListById<T extends Item>(list: T[], itemId: string, newItem: T) {
  const oldItem = getItemInListById(list, itemId)
  // TODO: deep equal?
  if (oldItem === newItem) return list

  return list.map((item) => {
    if (item === oldItem) {
      return newItem
    }
    return item
  })
}

export function insertItemInListAfterIndex<T extends Item>(list: T[], index: number, newItem: T) {
  if (index > list.length - 1) {
    throw new Error(`Insert index ${index} out of bounds in list with length ${list.length}`)
  }

  let newList: T[]

  if (index >= 0) {
    newList = [...list]
    if (index === newList.length - 1) {
      newList.push(newItem)
    } else {
      newList.splice(index + 1, 0, newItem)
    }
  } else {
    newList = [...list, newItem]
  }

  return newList
}
