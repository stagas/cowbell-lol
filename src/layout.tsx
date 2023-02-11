/** @jsxImportSource minimal-view */

import { Rect } from 'geometrik'
import { element, view, web } from 'minimal-view'
import { observe } from './util/observe'
import { TrackView } from './track-view'
import { services } from './services'

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
      resize = fn(({ host, layout, align }) => () => {
        const [dim, min, max] = align === 'y'
          ? ['height', 'minHeight', 'maxHeight'] as const
          : ['width', 'minWidth', 'maxWidth'] as const
        const rect = new Rect(layout.getBoundingClientRect()).round()

        const w = rect[dim] * (
          typeof $.size === 'string'
            ? parseFloat($.size as string) / 100
            : $.size
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
    services.fx(({ skin }) => {
      $.css = /*css*/`
      ${skin.css}

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
      }

      .fit-width {
        width: 100%;

        > * {
          width: 100%;
          max-width: 100%;
        }
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
        flex: 1;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
      }

      [part=app-players-row] {
        display: flex;
        flex-flow: column nowrap;
        height: 70px;
        width: 100%;

        > * {
          display: flex;
          flex-flow: row nowrap;
          width: 100%;
        }
      }

      .app-player-controls {
        display: flex;
        flex: 1;
        flex-flow: row nowrap;
        align-items: center;
        overflow: hidden;
        > * {
          height: 0;
          min-height: 100%;
        }
      }

      [part=app-player-play] {
        display: flex;
        width: 100%;
        flex: 0;
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

      [part=app-inner] {
        display: flex;
        position: relative;
        flex-flow: row nowrap;
        width: 100%;
        height: 100%;
      }

      [part=app-mixer] {
        width: 100%;
        height: 100%;
        flex: 1;
      }


      [part=app-mixer-sends] {
        display: flex;
        flex-flow: column nowrap;
        width: 100%;
        height: 100%;
        overflow-y: scroll;

        ${TrackView} {
          height: 70px;
        }
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
        background: ${skin.colors.bgLight};
        /* height: 100%; */
        /* overflow-y: scroll; */
        ${TrackView} {
          height: 52.5px;
          ${skin.styles.raised}

          &[active] {
            ${skin.styles.lowered}
          }
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

      [part=app-scroller] {
        position: absolute;
        top: 0;
        left: 0;
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
