/** @jsxImportSource minimal-view */

import { IconSvg } from 'icon-svg'
import { event, view, web } from 'minimal-view'

export const Button = web('btn', view(
  class props {
    onClick!: () => void
    title?: string
    shadow?: false | number = false
    children?: JSX.Element
  },

  class local { },

  function actions({ fn, fns }) {
    return fns(class actions {
      onClickHandler =
        fn(({ onClick }) => event.prevent.stop(onClick))
    })
  },

  function effects({ $, fx }) {
    $.css = /*css*/`

    button {
      cursor: pointer;
      font-family: monospace;
      font-weight: bold;
      all: unset;
      position: relative;
    }

    ${IconSvg} {
      &::part(svg) {
        stroke-width: 1px;
      }
      &.stretch::part(svg) {
        height: 100%;
      }
      &.normal::part(svg) {
        height: 73px;
      }
      &.small::part(svg) {
        height: 56px;
      }
      &.topbar::part(svg) {
        height: 32px;
        stroke-width: 1.75px;
      }
      &.smaller::part(svg) {
        height: 28px;
      }
    }

    [part=shadow] {
      position: absolute;
      color: #001e;
      z-index: -1;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

      ${IconSvg}::part(svg) {
        stroke-width: var(--shadow-size);
      }
    }
    `

    fx(function drawButton({ shadow, children }) {
      $.view = <>
        <button onclick={$.onClick}>
          {children}
          {shadow &&
            <div part="shadow" style={`--shadow-size:${shadow}px`}>
              {children}
            </div>
          }
        </button>
      </>
    })
  })
)
