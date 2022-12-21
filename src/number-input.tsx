/** @jsxImportSource minimal-view */

import { view, web, Dep, effect, on } from 'minimal-view'
import { Scalar } from 'geometrik'
import { theme } from './theme'

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
        display: flex;
        flex-flow: ${align === 'y' ? 'column' : 'row'} nowrap;
        font-family: ${theme['fontFamily']};
        align-items: stretch;
        justify-content: stretch;
        text-align: center;
      }
      button {
        all: unset;
        padding: 10px;
        cursor: pointer;
        &:hover {
          background: #aaf2;
        }
      }
      [part=value] {
        display: inline-flex;
        height: 100%;
        font-size: ${theme['fontSize']};
        flex-flow: ${align === 'y' ? 'column' : 'row'} nowrap;
        align-items: center;
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
          <button onpointerdown={$.onPointerDown($.dec)}>-</button>
          <span part="value">{valueView}</span>
          <button onpointerdown={$.onPointerDown($.inc)}>+</button>
        </>
      }
    })
  })
)