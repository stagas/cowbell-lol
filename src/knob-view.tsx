/** @jsxImportSource minimal-view */

import { cheapRandomId } from 'everyday-utils'
import { Rect } from 'geometrik'
import { chain, Dep, element, view, web } from 'minimal-view'
import { Knob } from 'x-knob'
import { Player } from './player'
import { Slider } from './slider'
import { services } from './services'

export { Slider }

export const KnobView = web(view('slider-view',
  class props {
    id?= cheapRandomId()
    theme?: string = 'cowbell'
    slider!: Slider

    running!: boolean

    player?: Player
    vol?: Dep<number>

    children?: JSX.Element
  },

  class local {
    host = element
    rect?: Rect

    size?: number
    colorCss = ''

    knob?: InstanceType<typeof Knob.Element>
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {
      // handleDown = fn(({ host, id }) => (e: PointerEvent) => {
      //   if (handling || !(e.buttons & 1)) return

      //   if (e.type === 'pointerdown') {
      //     downSlider = true
      //   } else {
      //     if (!downSlider) return
      //     if (e.type === 'pointerenter' && !e.altKey) {
      //       return
      //     }
      //   }

      //   host.toggleAttribute('drag', true)

      //   handling = true

      //   host.classList.add('active')

      //   const yDims = ['height', 'minHeight', 'maxHeight', 'y'] as const
      //   const xDims = ['width', 'minWidth', 'maxWidth', 'x'] as const

      //   const [[dim, , , n]] = vertical
      //     ? [xDims, yDims]
      //     : [yDims, xDims]

      //   const getPointerPos = (e: PointerEvent) => {
      //     const scrollTop = document.documentElement.scrollTop
      //     return new Point(e.pageX, e.pageY - scrollTop)
      //   }

      //   const ownRect = $.rect!

      //   const moveTo = (pos: Point) => {
      //     let newSize = (pos[n] - ownRect[n])
      //     if (!vertical) newSize = ownRect[dim] - newSize

      //     const size = Math.max(0, Math.min(ownRect[dim], newSize))
      //     const normal = size / ownRect[dim]
      //     if ($.player) {
      //       $.player.$.onSliderNormal(id, normal)
      //     } else {
      //       $.slider.$.normal = normal
      //     }
      //   }

      //   moveTo(getPointerPos(e))

      //   const off = on(e.altKey ? host : window, 'pointermove').raf(function verticalPointerMove(e) {
      //     moveTo(getPointerPos(e))
      //   })

      //   on(window, 'pointerup').once((e) => {
      //     off()
      //     handling = false
      //     downSlider = false
      //     requestAnimationFrame(() => {
      //       host.classList.remove('active')
      //       host.toggleAttribute('drag', false)
      //     })
      //   })
      // })

      // handleWheel = (e: WheelEvent) => {
      //   const normal = $.slider.$.onWheel(e)
      //   if ($.player) {
      //     $.player.$.onSliderNormal($.id, normal)
      //   } else {
      //     $.slider.$.normal = normal
      //   }
      // }

      // // resize = fn(({ host }): ResizeObserverCallback => queue.raf((entries) => {
      // //   $.rect = new Rect(host.getBoundingClientRect()).round()
      // //   const aspect = $.rect.size.x / $.rect.size.y
      // //   if (aspect < 0.5) {
      // //     $.vertical = false
      // //   } else {
      // //     $.vertical = true
      // //   }
      // // }))
    })
  },

  function effect({ $, fx, refs }) {
    // fx.raf(({ host, running }) => {
    //   host.toggleAttribute('running', running)
    // })

    fx(({ slider, vol }) =>
      slider.fx(({ normal }) => {
        vol.value = normal
      })
    )

    fx(({ slider, knob }) =>
      chain(
        // slider.fx.raf(({ value }) => {
        //   knob.$.value = value
        // }),
        knob.$.self.fx(({ normal }) => {
          if ($.player) {
            $.player.$.onSliderNormal($.id!, normal)
          } else {
            slider.$.normal = normal
          }
        })
      )
    )

    fx(({ slider }) =>
      slider.fx(({ hue }) =>
        fx.raf(({ running }) => {
          $.colorCss = /*css*/`
          :host {
            --hue: ${(Math.round(hue / 25) * 25) % 360};
            --sat: ${running ? '85%' : '80%'};
            --lum: ${running ? '40%' : '30%'};
          }
          `
        })
      )
    )

    services.fx(({ skin }) => {
      if ($.theme !== 'ableton') {
        $.css = /*css*/`
        ${skin.css}
        `
      }
    })

    fx(({ theme, slider, colorCss }) =>
      slider.fx(({ id, min, max, scale }) => {
        $.view = <>
          <style>{colorCss}</style>
          <Knob
            ref={refs.knob}
            id={id}
            min={min}
            max={max}
            step={scale / 127}
            value={slider.$.value}
            theme={theme}
          />
        </>
      })
    )
  })
)
