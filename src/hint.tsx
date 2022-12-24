/** @jsxImportSource minimal-view */

import { Rect } from 'geometrik'
import { web, view, Dep, element, on, effect } from 'minimal-view'

export const Hint = web(view('hint',
  class props {
    message!: Dep<JSX.Element>
  },

  class local {
    host = element
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      onMouseMove = fn(({ host, message }) => (e: PointerEvent) => {
        if (!message.value) {
          return
        }

        const viewportRect = new Rect(
          document.scrollingElement!.scrollLeft,
          document.scrollingElement!.scrollTop,
          window.visualViewport!.width,
          window.visualViewport!.height
        )

        const rect = new Rect(host.getBoundingClientRect())
        rect.bottom = e.pageY - 25
        rect.left = e.pageX + 10
        rect.containSelf(viewportRect)

        Object.assign(host.style, rect.toStylePosition())

        this.show()
      })

      show = fn(({ host }) => () => {
        if ($.view) {
          host.style.opacity = '1'
        }
      })

      hide = fn(({ host }) => () => {
        host.style.opacity = '0'
      })
    })
  },

  function effects({ $, fx }) {
    $.css = /*css*/`
    & {
      z-index: 9999999999;
      position: fixed;
      padding: 10px;
      border: 1px solid #fff;
      background: #000;
      color: #fff;
      font-family: monospace;
      white-space: pre-wrap;
    }
    `
    fx(() => on(window, 'pointermove')($.onMouseMove))
    fx(() => on(window, 'keydown')($.hide))

    fx(({ message }) =>
      effect({ message }, ({ message }) => {
        $.view = message
        if (!message) {
          $.hide()
        } else {
          requestAnimationFrame($.show)
        }
      })
    )
  }
))
