/** @jsxImportSource minimal-view */

import { IconSvg } from 'icon-svg'
import { element, view, web } from 'minimal-view'

export type ClickHandler = (e: MouseEvent, meta?: any) => void

export const ButtonIcon = web(view('button-icon',
  class props {
    onClick?: ClickHandler | false
    onTap?: ClickHandler | false
    onShiftTap?: ClickHandler | false
    onDblClick?: ClickHandler | false = false
    onCtrlShiftClick?: ClickHandler | false | null = false
    clickMeta?: any
    color?: [string, string] = ['#444', '#888']
    children?: JSX.Element
  },
  class local {
    host = element
  },
  function actions({ $, fns, fn }) {
    return fns(new class actions {
      handleClick = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        let fn: ClickHandler | false | void

        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
          fn = $.onCtrlShiftClick
        } else {
          fn = $.onClick
        }

        if (fn) fn(e, $.clickMeta)
      }

      handleDown = (e: PointerEvent) => {
        e.preventDefault()
        e.stopPropagation()

        let fn: ClickHandler | false | void

        if (e.shiftKey) {
          fn = $.onShiftTap
        } else {
          fn = $.onTap
        }

        if (fn) fn(e, $.clickMeta)
      }

      handleDblClick = fn(({ onDblClick }) => (e: MouseEvent) => {
        if (!onDblClick) return

        e.preventDefault()
        e.stopPropagation()

        onDblClick($.clickMeta)
      })
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
      width: 100%;
      max-width: 55px;
      height: 45px;
      padding: 0 5px;
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

    &(.big) {
      width: 100%;
      height: 60px;
      min-height: 100%;
      max-height: 100%;

      button {
        width: 100%;
        height: 100%;
      }
    }

    ${IconSvg} {
      width: 100%;
      height: 100%;
    }
    `

    fx.raf(({ host, color }) => {
      host.style.setProperty('--color', color[0])
      host.style.setProperty('--hover', color[1])
    })

    fx(({ children }) => {
      $.view =
        <button
          onclick={$.handleClick}
          onpointerdown={$.handleDown}
          ondblclick={$.handleDblClick}
        >
          {children}
        </button>
    })
  }
))
