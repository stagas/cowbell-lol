/** @jsxImportSource minimal-view */

import { Point, Rect, Scalar } from 'geometrik'
import { web, view, element, on, chain, queue } from 'minimal-view'

import { App } from './app'
import { Layout } from './components'
import { observe } from './util/observe'

const { clamp } = Scalar

export const Spacer = web('spacer', view(class props {
  app!: App
  id!: string
  layout!: HTMLElement
  initial!: number[]
  children?: JSX.Element[]
}, class local {
  host = element
  rect?: Rect
  cells!: number[]
  intents!: number[]
  handles?: JSX.Element[]
}, ({ $, fx, fn }) => {
  $.css = /*css*/`
  & {
    display: flex;
    /* overflow: hidden; */
  }

  > * {
    width: 100%;
    height: 100%;
  }

  [part=handle] {
    position: absolute;
    z-index: 10;
    width: 2px;
    padding: 0 4px 0 4px;
    margin-left: -5px;
    height: 100%;
    cursor: ew-resize;
    &.dragging,
    &:hover {
      background: #5efa;
      background-clip: content-box;
    }
    transition:
      left 3.5ms linear
      ;
  }
  `

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

  const handleDown = fn(({ rect, cells, intents }) => function spacerHandleDown(el: HTMLDivElement, e: PointerEvent, index: number) {
    el.classList.add('dragging')

    const moveTo = (pos: Point) => {
      let posN = pos.x / rect.width
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
    const off = on(window, 'pointermove')(function spacerPointerMove(e) {
      if (ended) return
      moveTo(getPointerPos(e))
    })

    on(window, 'pointerup').once((e) => {
      off()
      ended = true
      requestAnimationFrame(() => {
        if (index === $.cells.length - 1 && $.cells.at(-1)! > 0.99) {
          moveTo(new Point(window.innerWidth, 0))
        } else {
          moveTo(getPointerPos(e)
            .gridRound(15)
            // .translate(-(15 - (rect.width % 15)), 0)
          )
        }
        $.intents = [...$.cells]
        el.classList.remove('dragging')
      })
    })
  })

  fx(({ app, id, intents }) => {
    app.setSpacer(id, intents)
  })

  fx(({ cells }) => {
    $.handles = cells.slice(1).map((left, i) =>
      <div
        part="handle"
        style={{ left: left * 100 + '%' }}
        onpointerdown={function (this: HTMLDivElement, e) {
          e.preventDefault()
          handleDown(this, e, i + 1)
        }}
      ></div>
    )
  })

  fx(({ layout, handles, children, cells }) => {
    $.view = [
      (Array.isArray(children) ? children : [children]).map((child, i) => {
        const after = (i < children.length - 1 ? cells[i + 1] : 1)
        const width = after - cells[i]
        return <Layout layout={layout} width={width}>{child}</Layout>
      }),
      handles
    ]
  })
}))
