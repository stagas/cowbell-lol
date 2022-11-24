import { AppDetail } from '../app'
import { MonoDetail } from '../mono'
import { SchedulerDetail } from '../scheduler'

export type ItemDetail = MonoDetail | SchedulerDetail | AppDetail

const isDetailEqual = (a: ItemDetail | undefined, b: ItemDetail | undefined) => {
  if (!a || !b) return false

  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return a.length === b.length
        && a.every((x, i) => {
          const y = b[i]
          return (x === y
            || (
              x && y
              && x[0] === y[0]
              && x[1] === y[1]
              && x[2].equals(y[2])
            )
          )
        })
    }
    return false
  }

  if (Array.isArray(b)) return false

  if (a.editorValue === b.editorValue) return true

  if ('sliders' in a) {
    if ('sliders' in b) {
      return [...a.sliders].every(([key, x]) => {
        const y = b.sliders?.get(key)
        if (!y) return false

        return (
          x.value === y.value
          && x.min === y.min
          && x.max === y.max
          && x.hue === y.hue
          && x.sourceIndex === y.sourceIndex
          && x.source.arg === y.source.arg
        )
      })
    }
  }

  return false
}

export class Detail<T extends ItemDetail = any> {
  data: T

  constructor(data: T | Detail<T>) {
    if (data instanceof Detail) {
      this.data = data.data
    } else {
      this.data = data
    }
  }

  equals(next?: Detail<T>, prev: Detail<T> = this): boolean {
    return isDetailEqual(next?.data, prev?.data)
  }

  satisfies(other: Detail<T>): boolean {
    if (Array.isArray(this.data)) {
      if (Array.isArray(other.data)) {
        const otherData = other.data
        return this.data.every((a) =>
          otherData.some((b) => a[2].equals(b[2]))
        )
      }
    }
    return this.equals(other)
  }

  merge(other: Partial<T>): Detail<T> {
    if (!other) return new Detail(this.data)

    if (other instanceof Detail) {
      other = other.data
    }
    if (Array.isArray(other)) {
      return new Detail(other as T)
    } else {
      return new Detail({ ...this.data, ...other })
    }
  }

  toJSON() {
    return this.data
  }
}
