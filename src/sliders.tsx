/** @jsxImportSource minimal-view */

import { Point, Rect } from 'geometrik'
import { element, view, web } from 'minimal-view'

import { MonoMachine } from './mono'
import { SliderView, Slider } from './slider'
import { observe } from './util/observe'

export type Sliders = Map<string, Slider>

export interface SlidersDetailData {
  sliders: Sliders
}

// TODO: assertEqual
export function areSlidersEqual(a: Sliders, b: Sliders | null | undefined) {
  return [...a].every(([key, x]) => {
    const y = b?.get(key)
    if (!y) {
      console.warn(`Slider ${key} not found.`)
      return false
    }

    const equalValue = x.value.toFixed(3) === y.value.toFixed(3)
    if (!equalValue) {
      console.warn(`value for slider ${key} not equal: ${x.value.toFixed(3)} !== ${y.value.toFixed(3)}`)
      return false
    }

    const equalMin = x.min === y.min
    if (!equalMin) {
      console.warn(`min for slider ${key} not equal: ${x.min} !== ${y.min}`)
      return false
    }

    const equalMax = x.max === y.max
    if (!equalMax) {
      console.warn(`max for slider ${key} not equal: ${x.max} !== ${y.max}`)
      return false
    }

    const equalHue = x.hue === y.hue
    if (!equalHue) {
      console.warn(`hue for slider ${key} not equal: ${x.hue} !== ${y.hue}`)
      return false
    }

    const equalSourceIndex = x.sourceIndex === y.sourceIndex
    if (!equalSourceIndex) {
      console.warn(`sourceIndex for slider ${key} not equal: ${x.sourceIndex} !== ${y.sourceIndex}`)
      return false
    }

    const equalSourceArg = x.source.arg === y.source.arg
    if (!equalSourceArg) {
      console.warn(`source.arg for slider ${key} not equal: ${x.source.arg} !== ${y.source.arg}`)
      return false
    }

    return true
  })
}

export const Sliders = web('sliders', view(
  class props {
    machine!: MonoMachine
    sliders!: Sliders
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

    ${SliderView} {
      margin: 0 -10px;
    }
  }
  `

  fx(({ host }) =>
    observe.resize.initial(host, () => {
      $.size = new Rect(host.getBoundingClientRect()).round().size
    })
  )

  fx.raf(({ host, size, sliders }) => {
    host.toggleAttribute('small', size.width < 90 * sliders.size)
  })

  fx(function drawSliders({ machine, sliders, running }) {
    const vertical = false
    $.view = <>
      <div part="padding-left" />
      {[...sliders.values()].map((slider) =>
        <SliderView
          // TODO: something is going on with this type
          {...slider as any}
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
