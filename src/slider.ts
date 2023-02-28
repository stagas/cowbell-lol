import { Scalar } from 'geometrik'
import { reactive } from 'minimal-view/reactive'
import { pick, isEqual, cheapRandomId } from 'everyday-utils'
import type { Marker } from 'canvy'

const { clamp } = Scalar

export const fixed = (value: number) => {
  return parseFloat(value.toFixed(3))
}

export const markerForSlider = (slider: Slider): Marker => ({
  key: slider.$.id!,
  index: slider.$.sourceIndex!,
  size: slider.$.source!.arg.length,
  kind: 'param',
  color: `hsl(${slider.$.hue}, 60%, 18%)`,
  hoverColor: `hsl(${slider.$.hue}, 60%, 26%)`,
  message: slider.$.name,
  // @ts-ignore
  normal: slider.$.normal,
})

export type Slider = typeof Slider.State
export const Slider = reactive('slider',
  class props {
    id?: string = cheapRandomId()
    name!: string
    value!: number
    min!: number
    max!: number
    slope!: number
    hue!: number

    sourceIndex?: number
    source?: {
      arg: string
      id: string
      range: string
      slope: string
      default: string
    }
  },

  class local {
    scale?: number
    normal?: number
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      equals = (other: Partial<typeof $>) => {
        return isEqual(this.toJSON(), other)
      }

      isCompatibleWith = (other: Partial<typeof $>) => {
        return $.min === other.min
          && $.max === other.max
      }

      onWheel = (e: WheelEvent, normal?: number) => {
        // conditional because the wheel event from the editor is a fake
        // event with just the e.deltaY info and no methods, it has been
        // prevented/stopped at the editor's event handler.
        e.preventDefault?.()
        e.stopPropagation?.()

        return clamp(0, 1,
          (normal ?? $.normal ?? 0)
          + Math.sign(e.deltaY) * (
            0.01
            + 0.10 * Math.abs(e.deltaY * 0.0015) ** 1.05
          ))
      }

      toJSON = () => {
        return pick($, [
          'id',
          'name',
          'value',
          'min',
          'max',
          'slope',
          'hue',
        ])
      }
    })
  },

  function effects({ $, fx }) {
    fx(({ min }) => {
      $.min = fixed(min)
    })

    fx(({ max }) => {
      $.max = fixed(max)
    })

    fx(({ min, max }) => {
      $.scale = fixed(max - min)
    })

    fx(({ value, min, max }) => {
      $.value = fixed(clamp(min, max, fixed(value)))
    })

    fx(({ value, scale, min, slope }) => {
      $.normal = ((value - min) / scale) ** (1 / slope)
    })

    fx(({ normal, scale, min, slope }) => {
      $.value = fixed((normal ** slope) * scale + min)
    })
  }
)
