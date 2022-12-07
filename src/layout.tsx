/** @jsxImportSource minimal-view */

import { Rect } from 'geometrik'
import { element, view, web } from 'minimal-view'

import { Button } from './button'
import { observe } from './util/observe'

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
    fx(function layoutCss({ align }) {
      const [dim, wrap] = [
        ['width', 'row'] as const,
        ['height', 'column'] as const
      ][+(align === 'y')]

      $.css = /*css*/`

      & {
        /* width: 100%; */
        /* height: 100%; */
        position: relative;
        display: flex;
        /* transition:
          ${dim} 3.5ms linear,
          min-${dim} 3.5ms linear,
          max-${dim} 3.5ms linear
          ; */
      }

      > *,
      [part=overlay] > * {
        width: 100%;
        height: 100%;
      }

      [part=waveform] {
        z-index: 1;
        pointer-events: all;
        min-height: 88px; /* 90px-2px border */
      }

      [part=midi] {
        pointer-events: none;
        z-index: 2;
      }

      [part=editor] {
        pointer-events: none;
        z-index: 2;
      }

      [part=presets] {
        z-index: 3;
        pointer-events: all;
      }

      [part=side] {
        /* ${dim}: calc(100% - 2px); */
        pointer-events: all;
      }

      .column {
        display: flex;
        flex-flow: ${wrap} nowrap;
        ${dim}: 100%;
      }

      &([state=running]) [part=controls] ${Button} {
        opacity: 1;
        &:hover {
          color: #fff !important;
        }
      }
      `
    })

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
