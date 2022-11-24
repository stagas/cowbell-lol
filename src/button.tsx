/** @jsxImportSource minimal-view */

import { IconSvg } from 'icon-svg'
import { event, view, web } from 'minimal-view'

export const Button = web('btn', view(
  class props {
    onClick!: () => void
    shadow?: false | number = false
    children?: JSX.Element
  }, class local {
}, ({ $, fx, fn }) => {
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
      height: 73px;
      stroke-width: 1.25px;
    }
    &.small::part(svg) {
      height: 56px;
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

  const onClick = fn(({ onClick }) => event.prevent.stop(onClick))

  fx(({ shadow, children }) => {
    $.view = <>
      <button onclick={onClick}>
        {children}
        {shadow &&
          <div part="shadow" style={`--shadow-size:${shadow}px`}>
            {children}
          </div>
        }
      </button>
    </>
  })
}))
