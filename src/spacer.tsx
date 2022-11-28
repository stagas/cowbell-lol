/** @jsxImportSource minimal-view */

import { Point, Rect, Scalar } from 'geometrik'
import { chain, element, on, queue, view, web } from 'minimal-view'

import { AppLocal } from './app'
import { Layout } from './layout'
import { observe } from './util/observe'

const { clamp } = Scalar

export const Spacer = web('spacer', view(class props {
  app!: AppLocal
  id!: string
  layout!: HTMLElement
  initial!: number[]
  snap?= true
  vertical?= false
  children?: JSX.Element[]
}, class local {
  host = element
  rect?: Rect
  cells!: number[]
  intents!: number[]
  handles?: JSX.Element[]
}, ({ $, fx, fn }) => {
  const dims = (vertical?: boolean) =>
    vertical
      ? ['height', 'width', 'top', 'ns-resize', 'y', 'column'] as const
      : ['width', 'height', 'left', 'ew-resize', 'x', 'row'] as const

  fx(({ vertical }) => {
    const [dim, opp, pos, cursor, , flow] = dims(vertical)

    $.css = /*css*/`
    & {
      display: flex;
      flex-flow: ${flow} nowrap;
    }

    [part=handle] {
      pointer-events: all;
      position: absolute;
      z-index: 10;
      ${dim}: 3px;
      padding: ${vertical ? '' : '0 '} 4px 0 4px;
      margin-${pos}: -5px;
      ${opp}: 100%;
      cursor: ${cursor};
      background-color: #aaa2;
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

  const off = fx(({ initial }) => {
    off()
    $.cells = $.intents = [...initial]
  })

  fx(({ host, layout }) => {
    const resize = queue.raf(() => {
      $.rect = new Rect(layout.getBoundingClientRect()).round()
      Object.assign(host.style, $.rect.toStyle())
    })
    return chain(
      on(window, 'resize')(resize),
      observe.resize.initial(layout, resize)
    )
  })

  const handleDown = fn(({ rect, cells, intents, vertical, snap }) => function spacerHandleDown(el: HTMLDivElement, e: PointerEvent, index: number) {
    el.classList.add('dragging')

    const [dim, , , , n] = dims(vertical)

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
            moveTo(new Point(window.innerWidth, 0))
          } else {
            moveTo(getPointerPos(e).gridRound(15))
          }
        }
        $.intents = [...$.cells]
        el.classList.remove('dragging')
      })
    })
  })

  fx(({ app, id, intents }) => {
    app.methods.setSpacer(id, intents)
  })

  fx(({ cells, vertical }) => {
    const [, , pos] = dims(vertical)
    $.handles = cells.slice(1).map((p, i) =>
      <div
        part="handle"
        style={{ [pos]: p * 100 + '%' }}
        onpointerdown={function (this: HTMLDivElement, e) {
          e.preventDefault()
          handleDown(this, e, i + 1)
        }}
      ></div>
    )
  })

  fx(({ layout, handles, children, cells, vertical }) => {
    $.view = [
      (Array.isArray(children) ? children : [children]).map((child, i) => {
        const after = (i < children.length - 1 ? cells[i + 1] : 1)
        const size = after - cells[i]
        return <Layout layout={layout} size={size} vertical={vertical}>{child}</Layout>
      }),
      handles
    ]
  })
}))
