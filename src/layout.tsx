/** @jsxImportSource minimal-view */

import { Rect } from 'geometrik'
import { element, view, web } from 'minimal-view'

import { observe } from './util/observe'
import { TrackView } from './app'
// import { Midi } from './midi'

export const Layout = web(view('layout',
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
    $.css = /*css*/`
    & {
      position: relative;
      display: flex;
    }

    > * {
      width: 100%;
      height: 100%;
    }

    [part=editors] {
      display: flex;
      flex-flow: row nowrap;
      /* height: 100%; */
      width: 100%;
      max-width: 100%;
      flex: 1;
      overflow: hidden;
      /* position: relative; */
      /* width: 100%; */
      /* height: calc(100% - 200px); */
    }

    [part=top] {
      display: flex;
      flex-flow: row nowrap;
      > * {
        flex: 1;
      }
    }

    [part=presets] {
      height: 100%;
      overflow-y: scroll;
      ${TrackView} {
        height: 70px;
      }
    }

    [part=canvas] {
      position: absolute;
      box-sizing: border-box;
      image-rendering: pixelated;
      pointer-events: none;
      z-index: 999;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    [part=midi] {
      position: absolute;
      pointer-events: none;
      left: 0;
      top: 0;
      z-index: 999;
      width: 100%;
      height: 100%;
    }

    [part=bottom] {
      height: 100%;
      /* display: flex; */
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
        padding: 15px 15px 0;
        position: relative;
        flex-flow: row nowrap;
      }

      ${TrackView} {
        height: 70px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
      }

      /* &.active {
        background: #fff1;

        ${TrackView}::part(canvas) {
          background-color: #fff2;
        }
      } */
    }
    `

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
