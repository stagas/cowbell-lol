/** @jsxImportSource minimal-view */

import { Point, Rect, Scalar } from 'geometrik'
import { chain, element, on, queue, view, web } from 'minimal-view'

import { AppContext } from './app'
import { Layout } from './layout'
import { observe } from './util/observe'

const { clamp } = Scalar

const dims = (align: 'x' | 'y') =>
  align === 'y'
    ? ['height', 'width', 'top', 'ns-resize', 'y', 'column', '', 'innerWidth'] as const
    : ['width', 'height', 'left', 'ew-resize', 'x', 'row', '0 ', 'innerHeight'] as const

export const Spacer = web('spacer', view(
  class props {
    id!: string
    layout!: HTMLElement
    initial!: number[]
    snap?= true
    align: 'x' | 'y' = 'x'
    children?: JSX.Element[]
    setSpacer?: AppContext['setSpacer']
  },

  class local {
    host = element
    rect?: Rect
    cells!: number[]
    intents!: number[]
    handles?: JSX.Element[]
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {
      handleDown = fn(({ rect, cells, intents, align, snap }) => (el: HTMLDivElement, e: PointerEvent, index: number) => {
        el.classList.add('dragging')

        const [dim, , , , n, , , innerDim] = dims(align)

        const moveTo = (pos: Point) => {
          let posN = pos[n] / rect[dim]
          posN = clamp(0, 1, posN)

          const newCells = [...cells]
          const oldN = cells[index]
          newCells[index] = posN

          const diffN = posN - oldN

          for (const [i, intentN] of intents.entries()) {
            if (i < index) {
              if (e.shiftKey) {
                if (intentN > 0) {
                  const co = (intentN / oldN)
                  newCells[i] = clamp(0, 1, intentN + diffN * (isNaN(co) ? 1 : co))
                }
              } else {
                newCells[i] = intentN

                if (newCells[i] > posN) {
                  newCells[i] = posN
                }
              }
            } else if (i > index) {
              if (e.shiftKey) {
                if (intentN < 1) {
                  const co = (1 - intentN) / (1 - oldN)
                  newCells[i] = clamp(0, 1, intentN + diffN * (isNaN(co) ? 1 : co))
                }
              } else {
                newCells[i] = intentN

                if (newCells[i] < posN) {
                  newCells[i] = posN
                }
              }
            }
          }

          $.cells = newCells
        }

        const getPointerPos = (e: PointerEvent) => {
          return new Point(e.pageX, e.pageY).sub(rect.pos)
        }

        let ended = false
        const off = on(window, 'pointermove').raf(function spacerPointerMove(e) {
          if (ended) return
          moveTo(getPointerPos(e))
        })

        on(window, 'pointerup').once((e) => {
          off()
          ended = true
          requestAnimationFrame(() => {
            if (snap) {
              if (index === $.cells.length - 1 && $.cells.at(-1)! > 0.99) {
                moveTo(new Point(window[innerDim], 0))
              } else {
                moveTo(getPointerPos(e).gridRound(15))
              }
            }
            $.intents = [...$.cells]
            el.classList.remove('dragging')
          })
        })
      })

      resize = fn(({ host, layout }) => queue.raf(() => {
        $.rect = new Rect(layout.getBoundingClientRect()).round()
        Object.assign(host.style, $.rect.toStyle())
      }))

    })
  },

  function effects({ $, fx, fn }) {
    fx(function spacerCss({ align }) {
      const [dim, opp, pos, cursor, , flow, pad] = dims(align)

      $.css = /*css*/`

      & {
        display: flex;
        flex-flow: ${flow} nowrap;
      }

      [part=handle] {
        pointer-events: all;
        position: absolute;
        touch-action: none;
        z-index: 10;
        ${dim}: 2px;
        padding: ${pad} 4px 0;
        margin-${pos}: -5px;
        ${opp}: 100%;
        cursor: ${cursor};
        background-color: #aaf2;
        background-clip: content-box;
        &.dragging,
        &:hover {
          background-color: #5efa !important;
        }
        /* transition:
          left 3.5ms linear
          ; */
      }
      `
    })

    fx.once(function createCellsAndIntents({ initial }) {
      $.cells = $.intents = [...initial]
    })

    fx(function listenWindowAndHostResize({ layout }) {
      return chain(
        on(window, 'resize')($.resize),
        observe.resize.initial(layout, $.resize)
      )
    })

    fx(function updateMachineSpacer({ setSpacer, id, intents }) {
      setSpacer(id, intents)
    })

    fx(function drawHandles({ cells, align }) {
      const [, , pos] = dims(align)
      $.handles = cells.slice(1).map((p, i) =>
        <div
          part="handle"
          style={{ [pos]: p * 100 + '%' }}
          onpointerdown={function (this: HTMLDivElement, e) {
            e.preventDefault()
            $.handleDown(this, e, i + 1)
          }}
        ></div>
      )
    })

    fx(function drawSpacer({ layout, handles, children, cells, align }) {
      $.view = [
        (Array.isArray(children) ? children : [children]).map((child, i) => {
          const after = (i < children.length - 1 ? cells[i + 1] : 1)
          const size = after - cells[i]
          return <Layout layout={layout} size={size} align={align}>{child}</Layout>
        }),
        handles
      ]
    })
  }))
