/** @jsxImportSource minimal-view */

import { web, view, element, on } from 'minimal-view'

import { Point } from 'geometrik'

import { App } from './app'

export const Vertical = web('vertical', view(class props {
  app!: App
  id!: string
  height!: number
}, class local {
  host = element
  target?: HTMLElement
}, ({ $, fx, fn }) => {
  $.css = /*css*/`
  & {
    display: flex;
    height: 10px;
    margin-top: -5px;
    margin-bottom: -5px;
    z-index: 10;
    width: 100%;
    cursor: ns-resize;
  }
  &(.dragging),
  &(:hover) {
    background: #f94a;
  }
  `

  fx(({ host }) => {
    $.target = host.previousElementSibling as HTMLElement
  })

  fx(({ target, height }) => {
    target.style.height =
      target.style.minHeight =
      target.style.maxHeight =
      height + 'px'
  })

  const handleDown = fn(({ app, id, host, target }) => function verticalHandleDown(e: PointerEvent) {
    host.classList.add('dragging')
    const targetTop = target.offsetTop
    // console.log(targetTop)

    const getPointerPos = (e: PointerEvent) => {
      const scrollTop = document.body.scrollTop
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
        moveTo(getPointerPos(e).gridRound(15))
        host.classList.remove('dragging')
        app.setVertical(id, height)
      })
    })
  })

  fx(({ host }) =>
    on(host, 'pointerdown').prevent(handleDown)
  )
}))
