/** @jsxImportSource minimal-view */

import { web, view, element, on } from 'minimal-view'

import { Point } from 'geometrik'

export const Vertical = web('vertical', view(class props {
  height!: number
}, class local {
  host = element
  target?: HTMLElement
}, ({ $, fx, fn }) => {
  $.css = /*css*/`
  & {
    display: flex;
    height: 10px;
    margin-top: -5.5px;
    margin-bottom: -5.5px;
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

  const handleDown = fn(({ host, target }) => function verticalHandleDown(e: PointerEvent) {
    host.classList.add('dragging')
    const targetTop = target.offsetTop
    // console.log(targetTop)

    const off = on(window, 'pointermove').raf(function verticalPointerMove(e) {
      const scrollTop = document.body.scrollTop
      const pos = new Point(e.pageX, e.pageY + scrollTop)
      target.style.height =
        target.style.minHeight =
        target.style.maxHeight =
        Math.max(30, pos.y - targetTop) + 'px'
    })
    on(window, 'pointerup').once(() => {
      host.classList.remove('dragging')
      off()
    })
  })

  fx(({ host }) =>
    on(host, 'pointerdown').prevent(handleDown)
  )
}))
