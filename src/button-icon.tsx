/** @jsxImportSource minimal-view */

import { IconSvg } from 'icon-svg'
import { element, view, web } from 'minimal-view'

export const ButtonIcon = web(view('button-icon',
  class props {
    onClick?: (e: MouseEvent) => any
    color?: [string, string] = ['#444', '#888']
    children?: JSX.Element
  },
  class local {
    host = element
  },
  function actions({ $, fns, fn }) {
    return fns(new class actions {
    })
  },
  function effects({ $, fx }) {
    $.css = /*css*/`
  & {
    display: inline-flex;
    height: 45px;
    width: 55px;
    min-height: 100%;
    max-height: 100%;
    text-align: center;
    justify-content: center;
    align-items: center;
  }
  button {
    all: unset;
    display: inline;
    width: 45px;
    height: 45px;
    padding: 0 5px;
    min-height: 100%;
    max-height: 100%;
    text-align: center;
    color: var(--color);
    cursor: pointer;
    &:hover {
      color: var(--hover);
      background: #fff2;
    }
  }

  &(.selected) {
    background: #fff2;
  }

  &(.draft) {
    font-size: 32px;
  }

  &(.save) {
    width: 30px;
  }

  ${IconSvg} {
    width: 100%;
    height: 100%;
  }
  `

    fx(({ host, color }) => {
      host.style.setProperty('--color', color[0])
      host.style.setProperty('--hover', color[1])
    })

    fx(({ onClick, children }) => {
      $.view =
        <button onclick={onClick}>
          {children}
        </button>
    })
  }
))
