/** @jsxImportSource minimal-view */

import { IconSvg } from 'icon-svg'
import { web, view, event } from 'minimal-view'

export const Button = web('btn', view(
  class props {
    onClick!: () => void
    children?: JSX.Element
  }, class local {
}, ({ $, fx }) => {
  $.css = /*css*/`
  button {
    font-family: monospace;
    font-weight: bold;
    all: unset;
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }
  &([state=active]) {
    button {
      background: teal;
    }
  }
  &([state=inactive]) {
    button {
      background: grey;
    }
  }

  ${IconSvg}::part(svg) {
    height: 28px;
    stroke-width: 1.35px;
  }
  `

  fx(({ onClick, children }) => {
    $.view = <>
      <button onclick={event.prevent.stop(onClick)}>
        {children}
      </button>
    </>
  })
}))
