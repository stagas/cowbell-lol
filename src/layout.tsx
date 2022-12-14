/** @jsxImportSource minimal-view */

import { Rect } from 'geometrik'
import { element, view, web } from 'minimal-view'

import { observe } from './util/observe'
import { WaveplotButton } from './waveplot-button'

export const Layout = web('layout', view(
  class props {
    size!: string | number
    align!: 'x' | 'y'
    layout!: HTMLElement
    children?: JSX.Element
  },

  class local {
    host = element
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {
      resize = fn(({ host, layout, size, align }) => () => {
        const [dim, min, max] = align === 'y'
          ? ['height', 'minHeight', 'maxHeight'] as const
          : ['width', 'minWidth', 'maxWidth'] as const
        const rect = new Rect(layout.getBoundingClientRect()).round()

        const w = rect[dim] * (
          typeof size === 'string'
            ? parseFloat(size as string) / 100
            : size
        ) + 'px'

        Object.assign(host.style, {
          [dim]: w,
          [min]: w,
          [max]: w,
        })
      })
    })
  },

  function effects({ $, fx }) {
    // fx(function layoutCss({ align }) {
    // const [dim, wrap] = [
    //   ['width', 'row'] as const,
    //   ['height', 'column'] as const
    // ][+(align === 'y')]

    $.css = /*css*/`
    & {
      position: relative;
      display: flex;
    }

    > * {
      width: 100%;
      height: 100%;
    }

    [part=track] {
      position: relative;
      display: flex;
      flex: 1;
      flex-flow: column nowrap;
      gap: 20px;

      [part=sliders] {
        display: flex;
        flex: 1;
        height: 200px;
        padding: 0 15px;
        position: relative;
        flex-flow: row nowrap;
      }

      ${WaveplotButton} {
        height: 50px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
      }

      &.active {
        background: #fff3;

        ${WaveplotButton}::part(canvas) {
          background-color: #fff3;
        }
      }
    }

    `
    // })

    fx(function listenLayoutResize({ layout }) {
      return observe.resize.initial(layout, $.resize)
    })

    fx(function onSizeUpdate({ size: _ }) {
      $.resize()
    })

    fx(function drawLayout({ children }) {
      $.view = children
    })
  })
)
