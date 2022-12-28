/** @jsxImportSource minimal-view */

import { Rect } from 'geometrik'
import { element, view, web } from 'minimal-view'
import { observe } from './util/observe'
import { TrackView } from './track-view'

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
      flex-flow: row nowrap;
    }

    > * {
      flex: 1;
      width: 100%;
      height: 100%;
    }

    [part=canvas] {
      position: absolute;
      box-sizing: border-box;
      image-rendering: pixelated;
      pointer-events: none;
      z-index: 10;
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
      z-index: -1;
      width: 100%;
      height: 100%;
    }

    [part=app] {
      height: calc(100% - 70px);
    }

    [part=app-tabs] {
      display: flex;
      flex: 1;
      width: 100%;
      height: 100%;
      z-index: 50;
      > * {
        width: 100%;
        height: 100%;
      }
    }

    [part=app-projects] {
      white-space: nowrap;
      width: 0;
      display: flex;
      flex: 1;
      margin: 0 20px;
      overflow-x: scroll;
    }

    [part=app-drafts] {
      display: flex;
      flex-flow: row nowrap;
    }

    [part=app-players] {
      display: flex;
      flex-flow: row nowrap;
    }

    [part=app-players-mixer] {
      display: flex;
      flex-flow: column nowrap;
      flex: 1;
    }

    [part=app-player-controls] {
      display: flex;
      flex: 1;
      align-items: stretch;
      > * {
        height: 0;
        min-height: 100%;
      }
    }

    [part=app-player-sounds] {
      display: flex;
      flex: 1;
      flex-flow: column nowrap;
      > * {
      }
    }

    [part=button] {
      all: unset;
      color: #444;
      cursor: pointer;
      &:hover {
        color: #888;
      }
    }

    [part=app-player-sound] {
      display: flex;
      flex: 1;
    }

    [part=app-player-patterns] {
      display: flex;
      flex-flow: column nowrap;
      flex: 1;
      > div {
        display: flex;
        flex-flow: row nowrap;
        flex: 1;
        > * {
          display: flex;
          flex: 1;
        }
      }
    }

    [part=app-bpm] {
      flex: 0.2;
    }

    [part=app-inner] {
      display: flex;
      position: relative;
      flex-flow: column nowrap;
    }

    [part=app-mixer] {
      display: flex;
      flex-flow: row nowrap;
      min-height: 55px;
      max-height: 55px;
      align-items: stretch;
      justify-content: space-between;
    }

    [part=app-controls] {
      display: flex;
    }

    [part=app-audio-play] {
      display: flex;
      flex-flow: row nowrap;
      height: 100%;
    }

    [part=app-main-outer] {
      position: relative;
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    [part=app-main] {
      position: relative;
      display: flex;
      flex-flow: column nowrap;
    }

    [part=app-presets] {
      height: 100%;
      overflow-y: scroll;
      ${TrackView} {
        height: 70px;
      }
    }

    [part=app-presets-x] {
      width: 100%;
      overflow-x: scroll;
      display: flex;
      flex-flow: row nowrap;
      height: 70px;
      ${TrackView} {
        min-width: 15%;
        max-width: 15%;
        width: 15%;
      }
    }

    [part=app-editor] {
      flex: 1;
      width: 100%;
      height: 100%;
    }

    [part=app-selected] {
      &:focus-within {
        &::before {
          content: '';
          box-shadow: inset 0 0 0 8px #34f;
          z-index: 9999999;
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          pointer-events: none;
        }
      }
      &[state=errored] {
        &:focus-within {
          &::before {
            box-shadow: inset 0 0 0 8px #f21;
          }
        }
      }
    }

    [part=app-scroller] {
      position: absolute;
      top: 0;
      left: 0;
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
