/** @jsxImportSource minimal-view */

import { web, view, element } from 'minimal-view'
import { Point, Rect } from 'geometrik'
import { Knob } from 'x-knob'
import { Skin, skin } from './skin'
import { Toolbar } from './toolbar'
import { observe } from './util/observe'
import { fitGrid } from './util/fit-grid'
import { Button } from './button'

export { skin }

export let ui: Ui

export type Ui = typeof Ui.State

export const Ui = web(view('ui',
  class props {
    distRoot!: string
    skin!: Skin
  },
  class local { },
  function actions({ $, fns, fn }) {
    return fns(new class actions {

    })
  },
  function effects({ $, fx, deps, refs }) {
    ui = $.self

    fx(({ distRoot, skin }) => {
      const bodyStyle = document.createElement('style')

      bodyStyle.textContent = /*css*/`
      @font-face {
        font-family: icon;
        src: url("${distRoot}/iconfont.woff2") format("woff2");
        font-weight: normal;
        font-style: normal;
      }

      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: ${skin.colors.bg};
        overflow: hidden;

        color: ${skin.colors.fg};
        font-size: 13px;
      }
      `

      document.head.appendChild(bodyStyle)
    })

    $.css = /*css*/`
    .players {
      display: flex;
      box-sizing: border-box;
      flex-flow: column nowrap;
      /* gap: 10px; */
      /* margin: 15px 20px; */
      /* height: calc(100% - 64px); */
      /* overflow-y: scroll; */
    }
    `

    fx(() => {
      $.view = <>
        <Toolbar />
        <div class="players">
          <PlayerView knobs={2} />
          <PlayerView knobs={4} />
          <PlayerView knobs={6} />
          <PlayerView knobs={6} />
          <PlayerView knobs={6} />
          <PlayerView knobs={6} />
          <PlayerView knobs={6} />
          <PlayerView knobs={6} />
        </div>
      </>
    })
  }
))

export const PlayerView = web(view('track-view',
  class props {
    knobs?: number = 1
  },
  class local {
    host = element
    knobsEl?: HTMLDivElement
    size?: Point = new Point()
  },
  function actions({ $, fns, fn }) {
    return fns(new class actions {

    })
  },
  function effects({ $, fx, deps, refs }) {
    ui.fx(({ skin }) => {
      $.css = /*css*/`
      ${skin.css}

      & {
        position: relative;
        display: flex;
        flex-flow: row nowrap;
        width: 100%;
        height: 69px;
        overflow: hidden;

        box-sizing: border-box;
        background: ${skin.colors.bg};
      }

      img {
        width: 100%;
        height: 100%;
      }

      .controls {
        background: ${skin.colors.bgLight};
        box-shadow:
          inset 0 2px 1px -1.7px ${skin.colors.shadeBright}
          ,inset 0 -2px 4px -1px ${skin.colors.shadeBlack}
          ;
        min-width: 126px;
        display: flex;
        flex-flow: row nowrap;
        gap: 10.5px;
        align-items: center;
        justify-content: center;
      }

      .knobs {
        box-sizing: border-box;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: center;
        padding: 10px;
        width: 50%;
        height: 100%;
      }

      ${Button} {
        margin-left: 2px;
      }

      `
    })

    fx(({ knobsEl }) =>
      observe.resize.initial(knobsEl, () => {
        $.size = new Rect(knobsEl.getBoundingClientRect()).round().size
      })
    )

    fx(({ knobs, size }) => {
      // const [w, h] = size
      // const total = knobs
      // const { cols, rows } = fitGrid(w, h, total)
      // const width = 100 / cols + '%'
      // const height = 100 / rows + '%'

      const active = Math.random() > .45
      $.view = <>
        <div class="controls">
          {/* <Knob
            id="b"
            min={0}
            max={1}
            step={0.01}
            symmetric
            value={0.5+Math.random()*0.2-0.1}
            theme="cowbell"
          /> */}

          <Knob
            id="b"
            min={0}
            max={1}
            step={0.01}
            value={0.3 + Math.random() * 0.7}
            theme="cowbell"
          />

          <Button rounded active={active}>
            <span class={`i la-${active ? 'pause' : 'play'}`} />
          </Button>

        </div>
        <img src={`${ui.$.distRoot}/waveplot.png`} />
        <img src={`${ui.$.distRoot}/notes.png`} />
        {/* <img src={`${ui.$.distRoot}/notes.png`} /> */}
        {/* <img src={`${ui.$.distRoot}/notes.png`} /> */}
        {/* <img src={`${ui.$.distRoot}/notes.png`} /> */}

        {/* <div class="knobs" ref={refs.knobsEl}>
          {Array.from({ length: knobs }, () =>
            <Knob
              id="b"
              style={`max-width:${width}; max-height: ${height};`}
              min={0}
              max={1}
              step={0.01}
              value={Math.random()}
              theme="cowbell"
            />
          )}
        </div> */}
      </>
    })
  }
))


//////////////////////////////

export const Skeleton = web(view('skeleton',
  class props {

  },
  class local { },
  function actions({ $, fns, fn }) {
    return fns(new class actions {

    })
  },
  function effects({ $, fx, deps, refs }) {
    fx(() => {
      $.view = 'hello'
    })
  }
))
