/** @jsxImportSource minimal-view */

import { Point, Rect } from 'geometrik'
import { element, view, web } from 'minimal-view'

import { MachineData } from './machine-data'
import { Slider, SliderParam } from './slider'
import { observe } from './util/observe'

export const Sliders = web('sliders', view(
  class props {
    machine!: MachineData
    sliders!: Map<string, SliderParam>
    running!: boolean
  }, class local {
  host = element
  size?: Point
}, ({ $, fx }) => {
  $.css = /*css*/`
  & {
    display: flex;
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 12.5px 0;
    align-items: flex-start;
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
    width: 98.5px;
    min-width: 98.5px;
  }

  &([small]) {
    padding: 0 10%;
    padding-top: 90px;

    [part=padding-left],
    [part=padding-right] {
      display: none;
    }

    ${Slider} {
      margin: 0 -10px;
    }
  }
  `

  fx(({ host }) =>
    observe.resize.initial(host, () => {
      $.size = new Rect(host.getBoundingClientRect()).round().size
    })
  )

  fx.raf(({ host, size }) => {
    host.toggleAttribute('small', size.width < 180)
  })

  fx(({ machine, sliders, running }) => {
    const vertical = false
    $.view = <>
      <div part="padding-left" />
      {[...sliders.values()].map((slider) =>
        <Slider
          {...slider}
          running={running}
          machine={machine}
          vertical={vertical}
          style={{
            '--hue': (Math.round(slider.hue / 25) * 25) % 360,
            '--sat': running ? '85%' : '80%',
            '--lum': running ? '40%' : '30%',
          } as any}
        />
      )}
      <div part="padding-right" />
    </>
  })
}))
