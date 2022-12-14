/** @jsxImportSource minimal-view */

import { MapMap } from 'everyday-utils'
import { Point, Rect } from 'geometrik'
import { element, view, web } from 'minimal-view'

import { MonoMachine } from './mono'
import { SliderView, Slider } from './slider-view'
import { observe } from './util/observe'

export type Sliders = Map<string, Slider>

export interface SliderScene {
  updateNormalMap: MapMap<string, string, (normal: number) => void>
}

export interface SlidersDetailData {
  sliders: Sliders
}

export const Sliders = web('sliders', view(
  class props {
    scene!: SliderScene
    machine!: MonoMachine
    sliders!: Sliders
    running!: boolean
  },

  class local {
    host = element
    size?: Point
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {

    })
  },

  function effects({ $, fx }) {
    $.css = /*css*/`

    & {
      display: flex;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 12.5px 12.5px;
      /* padding-top: 100px; */
      align-items: stretch;
      justify-content: flex-start;
      flex-wrap: nowrap;
      flex-direction: row;
      cursor: default;
      pointer-events: none;
      user-select: none;
      touch-action: none;
    }

    [part=padding-left] {
      width: 7.5px;
      min-width: 7.5px;
    }
    [part=padding-right] {
      width: 7.5px;
      min-width: 7.5px;
      /* width: 57.5px;
      min-width: 57.5px; */
    }

    /* &([small]) { */
    & {
      /* padding: 12.5px 10%; */
      /* padding-top: 90px; */

      /* [part=padding-left], */
      /* [part=padding-right] {
        display: none;
      } */

      ${SliderView} {
        /* margin: 0 -10px; */
      }
    }
    `

    fx(({ host }) =>
      observe.resize.initial(host, () => {
        $.size = new Rect(host.getBoundingClientRect()).round().size
      })
    )

    // fx.raf(({ host, size, sliders }) => {
    //   host.toggleAttribute('small', size.width < 90 * sliders.size)
    // })

    fx(function drawSliders({ scene, machine, sliders, running }) {
      const vertical = false
      $.view = <>
        {/* <div part="padding-left" /> */}
        {[...sliders.values()].map((slider) =>
          <SliderView
            // TODO: something is going on with this type
            key={slider.id}
            {...slider as any}
            scene={scene}
            running={running}
            machine={machine}
            vertical={vertical}
            showBg={false}
          />
        )}
        {/* <div part="padding-right" /> */}
      </>
    })
  }))
