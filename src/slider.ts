import { Scalar } from 'geometrik'
import { defineProperty } from 'everyday-utils'

const { clamp } = Scalar

export class Slider {
  id!: string
  name!: string
  value!: number
  min!: number
  max!: number
  hue!: number
  sourceIndex!: number
  source!: {
    arg: string
    id: string
    range: string
    default: string
  }

  declare readonly normal: number
  declare readonly scale: number

  constructor(data: Partial<Slider>) {
    Object.assign(this, data)

    defineProperty
      .not.enumerable
      .get(() => this.max - this.min)
      (this, 'scale')

    defineProperty
      .not.enumerable
      .get(() =>
        clamp(0, 1,
          (this.value - this.min) / this.scale
        )
      )
      (this, 'normal')
  }

  toJSON?() {
    return {
      ...this,
      source: !this.source ? void 0 : {
        ...this.source
      }
    }
  }
}
