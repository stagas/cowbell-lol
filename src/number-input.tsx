/** @jsxImportSource minimal-view */

import { view, web, Dep, effect, on } from 'minimal-view'
import { Scalar } from 'geometrik'

const { clamp } = Scalar

export const NumberInput = web(view('number-input',
  class props {
    value!: Dep<number>
    min = 0
    max = 100
    step = 0.1
    align: 'x' | 'y' = 'y'
  },

  class local {
    valueView?: JSX.Element
  },

  function actions({ fn, fns }) {
    return fns(new class actions {
      inc = fn(({ min, max, step, value }) => () => {
        value.value = +clamp(min, max, (value.value ?? 0) + step).toFixed(1)
      })

      dec = fn(({ min, max, step, value }) => () => {
        value.value = +clamp(min, max, (value.value ?? 0) - step).toFixed(1)
      })

      onPointerDown = (fn: () => void) => (e: PointerEvent) => {
        e.preventDefault()
        e.stopPropagation()
        fn()
        let iv: any
        const timeout = setTimeout(() => {
          iv = setInterval(fn, 50)
        }, 300)
        on(window, 'pointerup').once(() => {
          clearTimeout(timeout)
          clearInterval(iv)
        })
      }
    })
  },

  function effects({ $, fx }) {
    fx(({ align }) => {
      $.css = /*css*/`
      & {
        position: relative;
        display: flex;
        flex-flow: ${align === 'y' ? 'column' : 'row'} nowrap;
        font-family: Mono;
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
          background: #aaf2;
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
        font-size: 18px;
        flex-flow: ${align === 'y' ? 'column' : 'row'} nowrap;
        align-items: center;
        justify-content: center;
      }
      `
    })

    fx(({ value }) =>
      effect({ value }, function updateValue({ value }) {
        $.valueView = value
      })
    )

    fx(function drawNumberInput({ align, valueView }) {
      if (align === 'y') {
        $.view = <>
          <button onpointerdown={$.onPointerDown($.inc)}>+</button>
          <span part="value">{valueView}</span>
          <button onpointerdown={$.onPointerDown($.dec)}>-</button>
        </>
      } else {
        $.view = <>
          <button onpointerdown={$.onPointerDown($.dec)} part="left">-</button>
          <span part="value">{valueView}</span>
          <button onpointerdown={$.onPointerDown($.inc)} part="right">+</button>
        </>
      }
    })
  })
)
