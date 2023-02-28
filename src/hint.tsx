/** @jsxImportSource minimal-view */

import { Rect } from 'geometrik'
import { web, view, Dep, element, on, effect } from 'minimal-view'
import { anim } from './anim'
import { services } from './services'

export type Hint = typeof Hint.State

export const Hint = web(view('hint',
  class props {
    message!: Dep<JSX.Element>
  },

  class local {
    host = element
    rect?: Rect
    viewportRect?: Rect
    centerY: number | false = false
  },

  function actions({ $, fns, fn }) {
    let pageX = 0
    let pageY = 0
    let side: 'left' | 'right' = 'left'
    let align: 'top' | 'bottom' = 'top'
    let i = 0
    let visible = true
    return fns(new class actions {
      updatePos = fn(({ host }) => () => {
        if ($.centerY === false) {
          $.centerY = pageY
        }

        const viewportRect = $.viewportRect!

        const newSide = pageX >= viewportRect.width - 150 ? 'right' : 'left'
        const newAlign = pageY >= $.centerY ? 'top' : 'bottom'

        if (newSide !== side || newAlign !== newAlign || (i++ % 30 === 0)) {
          $.rect = new Rect(host.getBoundingClientRect())
          side = newSide
          align = newAlign
        }

        const rect = $.rect!

        rect[align] = pageY + 15 * (align === 'top' ? 1 : -1)
        rect[side] = pageX + 10 * (side === 'left' ? 1 : -1)

        rect
          .containSelf(viewportRect)
          .translateSelf(viewportRect.pos.negate())

        host.style.transform = `translateX(${rect.x}px) translateY(${rect.y}px)`

        if ($.view && !visible) {
          visible = true
          host.style.opacity = '1'
          anim.schedule(this.showFn)
        }
      })

      onMouseMove = (e: PointerEvent) => {
        pageX = e.pageX
        pageY = e.pageY

        if (!$.message.value) {
          $.centerY = false
          return
        }

        this.show()
      }

      show = () => {
        anim.remove(this.hide)
        anim.remove(this.hideFn)
        anim.schedule(this.updatePos)
      }

      showFn = fn(({ host }) => () => {
        if (visible) {
          host.style.transition = 'transform 50ms linear'
        }
      })

      hide = fn(({ host }) => () => {
        anim.remove(this.updatePos)
        anim.remove(this.showFn)
        if (visible) {
          host.style.opacity = '0'
          visible = false
          anim.schedule(this.hideFn)
        }
      })

      hideFn = fn(({ host }) => () => {
        if (!visible) {
          host.style.transition = ''
        }
      })
    })
  },

  function effects({ $, fx }) {
    services.fx(({ skin }) => {
      $.css = /*css*/`
      & {
        z-index: 9999999999;
        position: fixed;
        padding: 10px;
        border: 1px solid #fff;
        background: #000;
        color: #fff;
        font-family: ${skin.fonts.mono};
        white-space: pre-wrap;
        pointer-events: none;
      }
      `
    })

    fx(() => on(window, 'pointermove')($.onMouseMove))
    fx(() => on(window, 'keydown')($.hide))

    fx(({ host }) =>
      on(host, 'contextmenu').prevent.stop()
    )

    fx(({ host, centerY }, prev) => {
      if (prev.centerY === false || !$.viewportRect) {
        $.viewportRect = new Rect(
          document.scrollingElement!.scrollLeft,
          document.scrollingElement!.scrollTop,
          window.visualViewport!.width,
          window.visualViewport!.height
        )

        $.rect = new Rect(host.getBoundingClientRect())
      }
    })

    fx(({ message }) =>
      effect({ message }, ({ message }) => {
        $.view = message
        if (!message) {
          $.hide()
        } else {
          $.show()
        }
      })
    )
  }
))
