/** @jsxImportSource minimal-view */

import { cheapRandomId } from 'everyday-utils'
import { Rect } from 'geometrik'
import { chain, Dep, element, view, web } from 'minimal-view'
import { Knob } from 'x-knob'
import { Player } from './player'
import { Slider } from './slider'
import { services } from './services'

export { Slider }

export const KnobView = web(view('knob-view',
  class props {
    id?= cheapRandomId()
    theme?: string = 'cowbell'
    slider!: Slider

    running!: boolean

    symmetric?: boolean = false

    player?: Player
    vol?: Dep<number>

    knobRef?: Dep<InstanceType<typeof Knob.Element>>

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
    })
  },

  function effect({ $, fx, refs }) {
    fx(({ slider, vol }) =>
      slider.fx(({ normal }) => {
        vol.value = normal
      })
    )

    fx(({ slider, knob }) =>
      chain(
        knob.$.self.fx(({ normal }) => {
          if ($.player) {
            $.player.$.onSliderNormal($.id!, normal)
          } else {
            slider.$.normal = normal
          }
        })
      )
    )

    fx(({ knob, knobRef }) => {
      knobRef.value = knob
    })

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

        & {
          pointer-events: none;
        }
        `
      }
    })

    fx(({ theme, slider, colorCss, symmetric }) =>
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
            symmetric={symmetric}
            theme={theme}
          />
        </>
      })
    )
  })
)
