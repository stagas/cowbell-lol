/** @jsxImportSource minimal-view */

import { web, view, element } from 'minimal-view'
import { services } from './services'
import { observe } from './util/observe'

export const DoomScroll = web(view('doom-scroll',
  class props {
    items!: any[]
    factory!: (item: any) => JSX.Element
    prompt?= false
    initial?= 10
    size?= 7000
  },

  class local {
    host = element
    lastEl?: HTMLDivElement | null
    rangeEnd?: number
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      intersects = fn(({ items, rangeEnd, size }) => ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          $.lastEl = null
          $.rangeEnd = Math.min(items.length, rangeEnd + size)
        }
      })
    })
  },

  function effects({ $, fx, deps, refs }) {
    services.fx(({ skin }) => {
      $.css = /*css*/`
      & {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        width: 100%;
      }
      .items {
        background: ${skin.colors.bgLight};
        flex: 1;
        width: 100%;
      }
      .load-more {
        all: unset;
        margin: 0 auto;
        margin-bottom: -40px;
        padding: 10px 20px;
        font-family: Jost;
        font-size: 16px;
        color: ${skin.colors.fgPale};
        letter-spacing: 1px;
        cursor: pointer;
        &:hover {
          color: ${skin.colors.fgLight};
        }
      }
      `
    })

    fx.once(({ initial }) => {
      $.rangeEnd = 10000 //initial
    })

    fx(({ prompt, lastEl }) => {
      if (!prompt) {
        return observe.intersection(lastEl, $.intersects)
      }
    })

    fx(({ items, factory, rangeEnd, size, prompt }) => {
      $.view = <>
        {items.slice(0, rangeEnd).map((x, i, arr) => <div class="items" ref={!prompt && i === Math.max(0, arr.length - 6) ? refs.lastEl : null}>
          {factory(x)}
        </div>
        )}
        {prompt && rangeEnd < items.length && <button class="load-more" onclick={() => {
          $.rangeEnd = Math.min(items.length, rangeEnd + size)
        }}>MORE</button>}
      </>
    })
  }
))
