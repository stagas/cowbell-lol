/** @jsxImportSource minimal-view */

import { Point, Rect, Scalar } from 'geometrik'
import { chain, element, on, part, view, web } from 'minimal-view'
import { Layout } from './layout'
import { observe } from './util/observe'
import { spacer } from './util/storage'

const { clamp } = Scalar

// given:   [0, 0.3]
// becomes: [0, 0.7]
function reverseCells(cells: number[]) {
  return [...cells].map((x) => x > 0 ? 1 - x : x)
}

const dims = (align: 'x' | 'y') =>
  align === 'y'
    ? ['height', 'width', 'top', 'ns-resize', 'y', 'column', '', 'innerWidth'] as const
    : ['width', 'height', 'left', 'ew-resize', 'x', 'row', '0 ', 'innerHeight'] as const

export const Spacer = web(view('spacer',
  class props {
    id!: string
    layout?: HTMLElement
    initial!: number[]
    reverse?: boolean = false
    snap?= true
    align: 'x' | 'y' = 'x'
    children?: JSX.Element[]
    shifted?: boolean = false
    minHandlePos?= 0
  },

  class local {
    host = element
    rect?: Rect
    cells!: number[]
    intents!: number[]
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {
      handleDown = fn(({ rect, cells, intents, align, snap }) => (el: HTMLDivElement, e: PointerEvent, index: number) => {
        el.classList.add('dragging')

        const [dim, , , , n] = dims(align)

        const moveTo = (pos: Point) => {
          let posN = pos[n] / rect[dim]
          posN = clamp(0, 1, posN)

          const newCells = [...cells]
          const oldN = cells[index]
          newCells[index] = posN

          const diffN = posN - oldN

          const shift = +$.shifted! ^ +e.shiftKey

          for (const [i, intentN] of intents.entries()) {
            if (i < index) {
              if (shift) {
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
              if (shift) {
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
                const p = new Point()
                p[dim] = rect[dim]
                moveTo(p)
              } else {
                moveTo(getPointerPos(e).gridRound(15))
              }
            }
            $.intents = [...$.cells]
            el.classList.remove('dragging')
          })
        })
      })

      resize = fn(({ host, align, layout }) => () => {
        const [, oppDim] = dims(align)

        const scrollTop = document.documentElement.scrollTop
        $.rect = new Rect(layout.getBoundingClientRect()).translate(0, scrollTop) //.round()
        Object.assign(host.style, {
          ...$.rect.toStyleSize(),
          [oppDim]: '100%'
        })
      })
    })
  },

  function effects({ $, fx, fn }) {
    fx(function spacerCss({ align }) {
      const [dim, opp, pos, cursor, , flow, pad] = dims(align)

      $.css = /*css*/`

      & {
        position: relative;
        display: flex;
        flex-flow: ${flow} nowrap;
      }

      [part=handle] {
        pointer-events: all;
        position: absolute;
        touch-action: none;
        z-index: 999999999;
        ${dim}: 2px;
        padding: ${pad} 4px 0;
        margin-${pos}: -5px;
        ${opp}: 100%;
        cursor: ${cursor};
        background-color: #aaf0;
        background-clip: content-box;
        &.dragging,
        &:hover {
          background-color: #5efa !important;
        }
      }
      `
    })

    fx.once(function createCellsAndIntents({ id, initial, children, reverse }) {
      let cells = spacer.get(id, initial)

      if (reverse) cells = reverseCells(cells)

      const length = children.filter(Boolean).length
      if (initial.length !== length) {
        initial = Array.from({ length }, (_, i) =>
          i / length
        )
      }
      $.cells = $.intents = [...cells]
    })

    fx(({ children, cells }) => {
      const length = children.filter(Boolean).length
      if (cells.length !== length) {
        const cells = Array.from({ length }, (_, i) =>
          i / length
        )
        $.cells = $.intents = cells
      }
    })

    fx(({ cells, reverse }, prev) => {
      if (prev.reverse != null && reverse !== prev.reverse) {
        $.cells = reverseCells(cells)
      }
    })

    fx(({ host }) => {
      if (!($.layout)) {
        $.layout = host.offsetParent as any
      }
    })

    fx(function listenWindowAndHostResize({ layout }) {
      return chain(
        on(window, 'resize')($.resize),
        observe.resize.initial(layout, $.resize),
        observe.intersection(layout, $.resize),
      )
    })

    fx(function updateMachineSpacer({ id, intents, reverse }) {
      if (reverse) intents = reverseCells(intents)
      spacer.set(id, intents)
    })

    const Handles = part((update) => {
      fx(function drawHandles({ cells, align }) {
        const [, , pos] = dims(align)
        update(
          cells.slice(1).map((p, i) =>
            <div
              key={`handle-${i}`}
              part="handle"
              style={{
                [pos]: `min(calc(100% - 2.5px), max(2.5px, ${p * 100}%))`,
                zIndex:
                  70
                  + (p < 0.01 ? i : p > 0.99 ? (cells.length - i) : 0)
              }}
              onpointerdown={function (this: HTMLDivElement, e) {
                e.preventDefault()
                $.handleDown(this, e, i + 1)
              }}
            ></div>
          )
        )
      })
    })

    const Items = part((update) => {
      fx(function drawSpacer({ layout, reverse, children, cells, align }) {
        children = (Array.isArray(children) ? children : [children])

        const keys = Array.from({ length: children.length }, (_, i) => `item-${i + 1}`)

        if (reverse) {
          children = [...children].reverse()
          keys.reverse()
        }

        update(
          children.map((child, i) => {
            const after = (i < children.length - 1 ? cells[i + 1] : 1)
            const size = after - cells[i]
            return <Layout
              key={keys[i]}
              layout={layout}
              size={size}
              align={align}
            >{child}</Layout>
          })
        )
      })
    })

    fx(() => {
      $.view = <>
        <Items />
        <Handles />
      </>
    })
  }))
