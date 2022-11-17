/** @jsxImportSource minimal-view */

import { web, view, element, on } from 'minimal-view'

import { Point } from 'geometrik'

import { App } from './app'

export const Vertical = web('vertical', view(class props {
  app!: App
  id!: string
  height!: number
  fixed?= false
}, class local {
  host = element
  target?: HTMLElement
}, ({ $, fx, fn }) => {
  $.css = /*css*/`
  & {
    position: relative;
    display: flex;
    height: 2px;
    padding: 3px 0 3px;
    margin-top: -5px;
    margin-bottom: -3px;
    z-index: 10;
    width: 100%;
    background-clip: content-box;
    cursor: ns-resize;
    &([fixed]) {
      padding: 3px 0;
      margin: -3px 0;
      background-color: #aab2;
    }
    &(.dragging),
    &(:hover) {
      background-color: #5efa;
    }
  }
  `

  fx.raf(({ host, fixed }) => {
    host.toggleAttribute('fixed', fixed)
  })

  fx(({ host }) => {
    $.target = host.previousElementSibling as HTMLElement
  })

  fx(({ target, height }) => {
    target.style.height =
      target.style.minHeight =
      target.style.maxHeight =
      height + 'px'
  })

  const handleDown = fn(({ app, fixed, id, host, target }) => function verticalHandleDown(e: PointerEvent) {
    host.classList.add('dragging')
    const targetTop = target.offsetTop

    const getPointerPos = (e: PointerEvent) => {
      const scrollTop = fixed ? 0 : document.body.scrollTop
      return new Point(e.pageX, e.pageY + scrollTop)
    }
    let height: number
    const moveTo = (pos: Point) => {
      height = Math.max(45, pos.y - targetTop)
      target.style.height =
        target.style.minHeight =
        target.style.maxHeight =
        height + 'px'
    }
    let ended = false
    const off = on(window, 'pointermove').raf(function verticalPointerMove(e) {
      if (ended) return
      moveTo(getPointerPos(e))
    })
    on(window, 'pointerup').once((e) => {
      ended = true
      off()
      requestAnimationFrame(() => {
        moveTo(getPointerPos(e)
          .sub(0, targetTop)
          .gridRound(15)
          .translate(0, targetTop)
        )
        host.classList.remove('dragging')
        app.setVertical(id, height)
      })
    })
  })

  fx(({ host }) =>
    on(host, 'pointerdown').prevent(handleDown)
  )
}))
