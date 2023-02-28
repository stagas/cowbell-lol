/** @jsxImportSource minimal-view */

import { view, web, Dep, effect, on } from 'minimal-view'
import { Scalar } from 'geometrik'
import { services } from './services'

const { clamp } = Scalar

export const NumberInput = web(view('number-input',
  class props {
    value!: Dep<number>
    min = 0
    max = 100
    step = 0.1
    align: 'x' | 'y' = 'y'
    onInput?: (value: number) => void
  },

  class local {
    valueView?: JSX.Element
  },

  function actions({ $, fn, fns }) {
    let iv: any
    let timeout: any

    let activeFn: () => any

    return fns(new class actions {
      inc = fn(({ min, max, step, value }) => () => {
        value.value = +clamp(min, max, (value.value ?? 0) + step).toFixed(1)
        $.onInput?.($.value.value!)
      })

      dec = fn(({ min, max, step, value }) => () => {
        value.value = +clamp(min, max, (value.value ?? 0) - step).toFixed(1)
        $.onInput?.($.value.value!)
      })

      onPointerEnter = (valueFn: any) => (e: PointerEvent) => {
        if (e.buttons & 1) {
          activeFn = valueFn
        }
      }

      onPointerDown = (valueFn: any) => (e: PointerEvent) => {
        e.preventDefault()
        e.stopPropagation()

        valueFn()
        activeFn = valueFn

        clearTimeout(timeout)
        clearInterval(iv)

        timeout = setTimeout(() => {
          iv = setInterval(() => {
            activeFn()
          }, 40)
        }, 200)

        on(window, 'pointerup').once(() => {
          clearTimeout(timeout)
          clearInterval(iv)
        })
      }
    })
  },

  function effects({ $, fx }) {
    services.fx(({ skin }) =>
      fx(({ align }) => {
        $.css = /*css*/`
        ${skin.css}

        & {
          position: relative;
          display: flex;
          flex-flow: ${align === 'y' ? 'column' : 'row'} nowrap;
          align-items: center;
          justify-content: center;
          text-align: center;
          user-select: none;
          cursor: default;
        }

        button {
          all: unset;
          width: 25px;
          height: 100%;
          cursor: pointer;

          &:hover {
            background: ${skin.colors.shadeSofter};
          }
        }

        [part=left] {
          padding-right: 12.5px;
        }

        [part=right] {
          padding-left: 12.5px;
        }

        [part=value] {
          position: absolute;
          left: 0;
          width: 100%;
          height: 100%;
          display: inline-flex;
          pointer-events: none;
          flex: 1;
          flex-flow: ${align === 'y' ? 'column' : 'row'} nowrap;
          align-items: center;
          justify-content: center;
        }
        `
      })
    )

    fx(({ value }) =>
      effect({ value }, function updateValue({ value }) {
        $.valueView = value
      })
    )

    fx(function drawNumberInput({ align, valueView }) {
      if (align === 'y') {
        $.view = <>
          <button
            part="minus"
            onpointerdown={$.onPointerDown($.dec)}
            onpointerenter={$.onPointerEnter($.dec)}
          >
            -
          </button>
          <span part="value">{valueView}</span>
          <button
            part="plus"
            onpointerdown={$.onPointerDown($.inc)}
            onpointerenter={$.onPointerEnter($.inc)}
          >
            +
          </button>
        </>
      } else {
        $.view = <>
          <button
            part="left"
            onpointerdown={$.onPointerDown($.dec)}
            onpointerenter={$.onPointerEnter($.dec)}
          >
            <span class="dec bpm-control i mdi-light-chevron-left"></span>
          </button>
          <span part="value">{valueView}</span>
          <button
            part="right"
            onpointerdown={$.onPointerDown($.inc)}
            onpointerenter={$.onPointerEnter($.inc)}
          >
            <span class="inc bpm-control i mdi-light-chevron-right"></span>
          </button>
        </>
      }
    })
  })
)
