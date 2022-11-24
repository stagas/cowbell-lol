/** @jsxImportSource minimal-view */

import { Point } from 'geometrik'
import { getElementOffset } from 'get-element-offset'
import { element, on, queue, view, web } from 'minimal-view'

import { App } from './app'

function selectorsToNode(selectors: string[], rootNode = document as any) {
  // let rootNode = document as Document | ShadowRoot | Element | null

  let current, el

  for (const sel of selectors) {
    if (sel === 'window') {
      return window
    }

    el = rootNode?.querySelector(sel)
    if (!el) return current

    current = el

    rootNode = (el as Element)?.shadowRoot
    if (!rootNode) break
  }
  return current
}

export const Vertical = web('vertical', view(class props {
  app!: App
  id!: string
  height!: number
  minHeight?= 90
  collapseSibling?= false
  fixed?= false
}, class local {
  host = element
  target?: HTMLElement
  sibling?: HTMLElement | false = false
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
    }
    background-color: #aab2;
    &([small]) {
      pointer-events: none;
      background-color: transparent;
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

  fx(({ host, collapseSibling }) => {
    $.target = host.previousElementSibling as HTMLElement

    if (collapseSibling) {
      $.sibling = host
        .parentElement!
        .previousElementSibling!
        .firstElementChild!
        .nextElementSibling! as HTMLElement
    }
  })

  fx.raf(({ target, height }) => {
    // if ($.sibling) {
    //   // hides middle vertical when collapsing together
    //   $.sibling.nextElementSibling!.toggleAttribute('small', height <= 45 && $.sibling?.getBoundingClientRect().height < 90)
    // }
    target.style.height =
      target.style.minHeight =
      target.style.maxHeight =
      height + 'px'
  })

  const handleDown = fn(({ app, fixed, minHeight, id, host, target, sibling }) => function verticalHandleDown(e: PointerEvent) {
    host.classList.add('dragging')

    const getPointerPos = (e: PointerEvent) => {
      const scrollTop = fixed ? document.documentElement.scrollTop : 0
      return new Point(e.pageX, e.pageY - scrollTop)
    }

    let moveTo: (pos: Point, force?: boolean) => void

    let height: number
    let heightSibling: number

    if (sibling) {
      height = Math.floor(target.getBoundingClientRect().height ?? 0)

      const midi = selectorsToNode(['x-scheduler', 'x-spacer', 'x-layout', 'x-midi'], target.shadowRoot)

      let siblingTop: number
      if (sibling) {
        heightSibling = sibling?.getBoundingClientRect().height ?? 0
        siblingTop = getElementOffset(sibling).y
      }

      moveTo = (pos, force) => {
        if (ended && !force) return

        const targetTop = getElementOffset(target).y

        const h = pos.y - targetTop
        if (height > 90 || h > 90 || heightSibling > 90) {
          setHeight(target, height = Math.max(height < 90 ? 45 : 90, h))
          setHeight(sibling, heightSibling = Math.max(90, pos.y - siblingTop - height))
        } else if (height > 45) {
          if (h < 45 || (height < 90 && h > 60)) {
            setHeight(target, height = Math.max(45, h))
          }
        } else {

          if (heightSibling >= 45 && heightSibling <= 90 && (h < 15 && heightSibling === 90 || heightSibling < 90)) {
            setHeight(sibling, heightSibling = Math.max(45, Math.min(90, pos.y - siblingTop - height)))
            if (heightSibling === 90) {
              height = Math.max(45, h)
              setHeight(target, height)
            }
          }
        }

        // const otherVertical = sibling.nextElementSibling! as HTMLElement
        // if (heightSibling < 90) {
        //   const clipElement = selectorsToNode([
        //     'x-mono', 'x-spacer', 'x-layout'
        //   ], sibling.shadowRoot!)
        //   otherVertical.style.width = `calc(100% - ${clipElement.style.width})`
        //   otherVertical.style.left = clipElement.style.width
        // } else {
        //   otherVertical.style.width = '100%'
        //   otherVertical.style.left = '0'
        // }

        if (height === 45 && heightSibling >= 90) {
          midi.style.height =
            midi.style.minHeight =
            midi.style.maxHeight = '43px'
        } else {
          midi.style.height =
            midi.style.minHeight =
            midi.style.maxHeight = ''
        }

        // // hides middle vertical when collapsing together
        // sibling.nextElementSibling!.toggleAttribute('small', height <= 45 && heightSibling < 90)
      }
    } else {
      let prevHeight = Math.floor(target.getBoundingClientRect().height ?? 0)

      moveTo = (pos, force) => {
        if (ended && !force) return

        const targetTop = fixed ? 0 : getElementOffset(target).y
        const h = pos.y - targetTop
        setHeight(target, height = Math.max(prevHeight < minHeight ? 45 : minHeight, h))
        if (height > minHeight) {
          prevHeight = height
          host.style.width = '100%'
          host.style.left = '0'
        }
      }
    }

    const setHeight = queue.raf((el: HTMLElement, height: number) => {
      el.style.height =
        el.style.minHeight =
        el.style.maxHeight =
        height + 'px'
    })

    let ended = false
    const off = on(window, 'pointermove')(function verticalPointerMove(e) {
      if (ended) return
      moveTo(getPointerPos(e))
    })

    on(window, 'pointerup').once((e) => {
      ended = true
      off()
      requestAnimationFrame(() => {
        const targetTop = fixed ? 0 : getElementOffset(target).y

        moveTo(getPointerPos(e)
          .sub(0, targetTop)
          .gridRound(15)
          .translate(0, targetTop),
          true
        )

        host.classList.remove('dragging')
        app.setVertical(id, height)

        if (sibling && heightSibling) {
          app.setVertical(sibling.id, heightSibling)
        }
      })
    })
  })

  fx(({ host }) =>
    on(host, 'pointerdown').prevent(handleDown)
  )
}))
