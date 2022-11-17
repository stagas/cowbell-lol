/** @jsxImportSource minimal-view */

import { IconSvg } from 'icon-svg'
import { web, view, event } from 'minimal-view'

export const Button = web('btn', view(
  class props {
    onClick!: () => void
    shadow?: false | number = false
    children?: JSX.Element
  }, class local {
}, ({ $, fx }) => {
  $.css = /*css*/`
  button {
    cursor: pointer;
    font-family: monospace;
    font-weight: bold;
    all: unset;
    position: relative;
  }

  ${IconSvg} {
  }

  ${IconSvg}::part(svg) {
    height: 73px;
    stroke-width: 1.25px;
  }

  ${IconSvg}.small::part(svg) {
    height: 56px;
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

  fx(({ onClick, shadow, children }) => {
    $.view = <>
      <button onclick={event.prevent.stop(onClick)}>
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
