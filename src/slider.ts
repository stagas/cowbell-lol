import { Scalar } from 'geometrik'
import { reactive } from 'minimal-view/reactive'
import { pick, isEqual, cheapRandomId } from 'everyday-utils'
import type { Marker } from 'canvy'
import { app } from './app'
// import { Dep } from 'minimal-view'
// import { app, Player } from './app'
// import type { EditorBuffer } from './editor-buffer'
// import { get } from './util/list'

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
    hue!: number

    sourceIndex?: number
    source?: {
      arg: string
      id: string
      range: string
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

      toJSON() {
        return pick($, [
          'id',
          'name',
          'value',
          'min',
          'max',
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

    fx(({ value, scale, min }) => {
      $.normal = (value - min) / scale
    })

    fx(({ normal, scale, min }) => {
      $.value = fixed(normal * scale + min)
      app?.$.autoSave()
    })

    //   fx(({ vol, normal }) => {
    //     vol.value = normal
    //   })

    //   fx(({ player }) =>
    //     player.fx(({ sound }) => {
    //       const buffer = get(app.sounds, sound)
    //       if (buffer) $.buffer = buffer
    //     })
    //   )

    //   fx(({ buffer }) =>
    //     buffer.fx(({ editor }) =>
    //       fx.task(({ id, name, hue, source, sourceIndex }) => {
    //         $.marker = {
    //           key: id,
    //           index: sourceIndex,
    //           size: source.arg.length,
    //           kind: 'param',
    //           color: `hsl(${hue}, 60%, 18%)`,
    //           hoverColor: `hsl(${hue}, 60%, 26%)`,
    //           message: name,
    //         }
    //       })
    //     )
    //   )

  }
)


// export class Slider {
//   id!: string
//   name!: string
//   // value!: number
//   min!: number
//   max!: number
//   hue!: number
//   sourceIndex!: number
//   source!: {
//     arg: string
//     id: string
//     range: string
//     default: string
//   }

//   declare value: number
//   declare normal: number
//   declare readonly scale: number

//   #value!: number

//   constructor(data: Partial<Slider>) {
//     defineProperty
//       .enumerable
//       .get(() => this.#value)
//       .set((n) => {
//         this.#value = parseFloat(n.toFixed(3))
//       })
//       (this, 'value')

//     defineProperty
//       .not.enumerable
//       .get(() => this.max - this.min)
//       (this, 'scale')

//     defineProperty
//       .not.enumerable
//       .get(() =>
//         clamp(0, 1,
//           (this.value - this.min) / this.scale
//         )
//       )
//       .set((normal: number) => {
//         this.value = clamp(this.min, this.max,
//           normal * this.scale + this.min
//         )
//       })
//       (this, 'normal')

//     defineProperty
//       .not.enumerable
//       (this, 'equals', isEqual)

//     Object.assign(this, data)
//   }

//   toJSON?() {
//     return {
//       ...this,
//       source: !this.source ? void 0 : {
//         ...this.source
//       }
//     }
//   }
// }
