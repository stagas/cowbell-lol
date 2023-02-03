/** @jsxImportSource minimal-view */

import { Point } from 'geometrik'
import { getElementOffset } from 'get-element-offset'
import { element, on, view, web } from 'minimal-view'
import { storage } from './util/storage'

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

export const Vertical = web(view('vertical',
  class props {
    id!: string
    align!: 'x' | 'y'
    size!: number
    minSize?= 90
  },

  class local {
    host = element
    target?: HTMLElement
    sibling?: HTMLElement | false = false
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {
      handleDown = fn(({
        align,
        minSize,
        id,
        host,
        target,
        sibling
      }) =>
        (e: PointerEvent) => {
          console.log('yea??')
          host.classList.add('dragging')

          const getPointerPos = (e: PointerEvent) => {
            return new Point(e.pageX, e.pageY)
          }
          let moveTo: (pos: Point, force?: boolean) => void

          const [dim, min, max, posDim, otherDim, otherSide] = [
            ['height', 'minHeight', 'maxHeight', 'y', 'width', 'left'] as const,
            ['width', 'minWidth', 'minHeight', 'x', 'height', 'top'] as const
          ][+(align === 'x')]

          let size: number
          let sizeSibling: number

          if (sibling) {
            size = Math.floor(target.getBoundingClientRect()[dim] ?? 0)

            const midi = selectorsToNode(['x-scheduler', 'x-spacer', 'x-layout', 'x-midi'], target.shadowRoot)

            let siblingTop: number
            if (sibling) {
              sizeSibling = sibling?.getBoundingClientRect()[dim] ?? 0
              siblingTop = getElementOffset(sibling)[posDim]
            }

            moveTo = (pos, force) => {
              if (ended && !force) return

              const targetTop = getElementOffset(target)[posDim]

              const h = pos[posDim] - targetTop
              if (size > 90 || h > 90 || sizeSibling > 90) {
                setSize(target, size = Math.max(size < 90 ? 45 : 90, h))
                setSize(sibling, sizeSibling = Math.max(90, pos[posDim] - siblingTop - size))
              } else if (size > 45) {
                if (h < 45 || (size < 90 && h > 60)) {
                  setSize(target, size = Math.max(45, h))
                }
              } else {

                if (sizeSibling >= 45 && sizeSibling <= 90 && (h < 15 && sizeSibling === 90 || sizeSibling < 90)) {
                  setSize(sibling, sizeSibling = Math.max(45, Math.min(90, pos[posDim] - siblingTop - size)))
                  if (sizeSibling === 90) {
                    size = Math.max(45, h)
                    setSize(target, size)
                  }
                }
              }

              if (size === 45 && sizeSibling >= 90) {
                midi.style[dim] =
                  midi.style[min] =
                  midi.style[max] = '43px'
              } else {
                midi.style[dim] =
                  midi.style[min] =
                  midi.style[max] = ''
              }
            }
          } else {
            let prevSize = Math.floor(target.getBoundingClientRect()[dim] ?? 0)

            moveTo = (pos, force) => {
              if (ended && !force) return

              const targetTop = getElementOffset(target)[posDim]
              const h = pos[posDim] - targetTop
              setSize(target, size = Math.max(prevSize < minSize ? 45 : minSize, h))
              if (size > minSize) {
                prevSize = size
                host.style[otherDim] = '100%'
                host.style[otherSide] = '0'
              }
            }
          }

          const setSize = (el: HTMLElement, size: number) => {
            el.style[dim] =
              el.style[min] =
              el.style[max] =
              size + 'px'
          }

          let ended = false
          // NOTE: this cannot be in a .raf because when resizing
          // a sticky while scrolled it flickers and messes it up
          const off = on(window, 'pointermove')(function verticalPointerMove(e) {
            if (ended) return
            moveTo(getPointerPos(e))
          })

          on(window, 'pointerup').once((e) => {
            ended = true
            off()
            requestAnimationFrame(() => {
              const targetTop = getElementOffset(target)[posDim]

              moveTo(getPointerPos(e)
                .sub(0, targetTop)
                .gridRound(15)
                .translate(0, targetTop),
                true
              )

              host.classList.remove('dragging')

              storage.vertical.set($.id, size)
            })
          })
        }
      )
    })
  },

  function effects({ $, fx }) {
    fx(function verticalCss({ align }) {
      const [dim, pad, top, bottom, oppDim] = [
        ['width', '0 ', 'left', 'right', 'height'] as const,
        ['height', '', 'top', 'bottom', 'width'] as const,
      ][+(align === 'y')]

      $.css = /*css*/`
      & {
        position: relative;
        display: flex;
        ${dim}: 2px;
        padding: ${pad} 3px 0 3px;
        margin-${top}: -3px;
        margin-${bottom}: -3px;
        z-index: 10;
        ${oppDim}: 100%;
        background-clip: content-box;
        cursor: ns-resize;
        &([fixed]) {
          padding: ${pad} 3px 0;
          margin: ${pad} -3px 0;
        }
        background-color: #aaf0;
        /* background-color: #f005; */
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
    })

    fx(function updateTargetElement({ host }) {
      $.target = host.previousElementSibling as HTMLElement
    })

    fx.raf(function updateTargetSize({ align, target, size }) {
      const [dim, min, max] = [
        ['height', 'minHeight', 'maxHeight'] as const,
        ['width', 'minWidth', 'minHeight'] as const
      ][+(align === 'x')]

      target.style[dim] =
        target.style[min] =
        target.style[max] =
        size + 'px'
    })

    fx(function listenHostPointerDown({ host }) {
      return on(host, 'pointerdown').prevent($.handleDown)
    })
  }))
