/** @jsxImportSource minimal-view */

import { web, view } from 'minimal-view'
import { Knob } from 'x-knob'
import { Button } from './button'
import { ui } from './ui'

export const Toolbar = web(view('toolbar',
  class props {
  },

  class local {
    bar?: HTMLSpanElement
    beat?: HTMLSpanElement
    sixt?: HTMLSpanElement

    mins?: HTMLSpanElement
    secs?: HTMLSpanElement
    mill?: HTMLSpanElement
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
        z-index: 999;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: space-between;
        background: ${skin.colors.bgLight};
        box-shadow: 0 1px 2.5px 1.15px ${skin.colors.shadeBlack};
        color: ${skin.colors.fg};
        padding: 9px 14px;
        box-sizing: border-box;
      }

      .logo {
        padding-right: 40px;
        h1 {
          display: flex;
          flex-flow: row nowrap;
          white-space: nowrap;
          margin: 0;
          font-family: ${skin.fonts.logo};
          font-weight: normal;
          font-size: 22px;
          letter-spacing: 1.185px;
          -webkit-text-stroke: .18px;

          .dot {
            color: ${skin.colors.purple};
            padding-left: 4.85px;
            padding-right: 2.75px;
          }

          .lol {
            display: inline-block;
            transform: scale(1.75) translateY(4px) translateX(10px);
          }

          .l {
            color: ${skin.colors.brightCyan};
            display: inline-block;
            transform: rotate(21deg) scale(1.5) translateY(-2px);
          }

          .o {
            color: ${skin.colors.brightGreen};
            display: inline-block;
            transform: translateX(-0.35px) translateY(-1.5px) scale(1.05);
          }

          .l2 {
            color: ${skin.colors.yellow};
            display: inline-block;
            transform: rotate(-25deg) scale(1.71) translateX(3.5px);
          }
        }

        .motto {
          color: ${skin.colors.purple};
          display: inline-block;
          line-height: 0;
          font-style: italic;
          font-size: 11.5px;
          letter-spacing: 2.51px;
          position: relative;
          top: -4px;
          left: .8px;
          font-family: ${skin.fonts.sans};
        }
      }

      @media (max-width: 800px) {
        .cowbell, .motto {
          display: none !important;
        }

        .lol {
          transform: scale(1.72) translateY(.55px) translateX(12px) !important;
        }
      }


      ${Knob} {
        --white: ${skin.colors.brightGreen};
        position: relative;
        top: 2px;
        left: .5px;
        margin: 0 3px;
        min-width: 21px !important;
        min-height: 24px !important;
        max-width: 21px !important;
        max-height: 24px !important;

        &::part(line),
        &::part(fill-value) {
          stroke: ${skin.colors.brightGreen};
        }
        &::part(fill) {
          stroke: ${skin.colors.brightGreen}40;
        }
      }

      .controls {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        gap: 14px;
      }

      .display {
        font-family: ${skin.fonts.slab};
        background: ${skin.colors.bg};
        border-radius: 8px;
        margin: 10px 0 10px;
        padding: 0px 9px 0 11px;
        box-sizing: border-box;
        height: 32px;
        box-shadow:
          inset 0 0.8px 1.95px -0.35px ${skin.colors.shadeDarker}
          ,0 1px 2.85px -1.9px ${skin.colors.shadeBrighter}
          ;
        top: 2.5px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;

        > div {
          display: flex;
          flex-flow: column nowrap;
          &:not(:first-child) {
            border-left: 2px solid ${skin.colors.bgLight};
            padding-left: 8px;
          }
        }

        .dot {
          color: ${skin.colors.fgPale};
          padding: .8px;
        }

        .value {
          color: ${skin.colors.fg};
          font-size: 25px;
          display: block;
          margin-top: -13px;
          margin-bottom: -2px;
          letter-spacing: -1.25px;
          position: relative;
          z-index: 1;
        }

        .words {
          z-index: 0;
          background: ${skin.colors.bgPale};
          color: ${skin.colors.fgLight};
          box-shadow: 0 0.7px 1.3px -.5px ${skin.colors.shadeBlack};
          line-height: 6px;
          padding: 3.5px 3px 3px;
          display: inline-block;
          position: relative;
          top: -8.9px;
          margin: 0 auto 0 0;
          left: -1.7px;
          letter-spacing: .111px;
          font-size: 14.1px;
        }

        .bpm {
          &-control {
            line-height: 0px;
            font-size: 20px;
            color: ${skin.colors.fgPale};
            -webkit-text-stroke: .225px;
            position: relative;
            top: 4.5px;
            margin: 0 -10px;

            &.dec {
              margin-right: -5px;
            }

            &.inc {
              margin-left: -2.5px;
            }
          }

          .words {
            left: 2.3px;
          }
        }
      }
      `
    })


    fx(({ bar, beat, sixt, mins, secs, mill }) => {
      const start = Date.now()
      let time = new Date()
      const anim = () => {
        // requestAnimationFrame(anim)

        time = new Date(Date.now() - start + 260360)

        mins.textContent = `${time.getMinutes()}`
        secs.textContent = `${time.getSeconds()}`.padStart(2, '0')
        mill.textContent = `${time.getMilliseconds()}`.padStart(3, '0')

        const co = (60 * 4) / 140
        const b = time.getTime() / 1000 / co

        bar.textContent = `${Math.max(1, 1 + b | 0)}`.padStart(3, '0')
        // bar.textContent = `${Math.max(1, 1+(b % 16)|0 )}`.padStart(2, '0')
        beat.textContent = `${Math.max(1, 1 + ((b * 4) % 4) | 0)}`
        sixt.textContent = `${Math.max(1, 1 + ((b * 16) % 16) | 0)}`.padStart(2, '0')
      }
      requestAnimationFrame(anim)
    })

    fx(() => {
      $.view = <>
        <div class="logo">
          <h1>
            <div class="cowbell">
            cowbell
            <span class="dot">.</span>
            </div>
            <div class="lol">
              <span class="l">l</span>
        <Knob
          id="b"
          class="o"
          min={0}
          max={1}
          step={0.01}
          value={0.3 + Math.random() * 0.7}
          theme="ableton"
        />
              {/* <span class="o">o</span> */}
              <span class="l2">l</span>
            </div>
          </h1>
          <span class="motto">needs more</span>
        </div>

        <div class="controls">
          <Button>
            <span class="i la-backward" />
          </Button>
          <Button active>
            <span class="i la-pause" />
          </Button>
          <Button>
            <span class="i la-forward" />
          </Button>
          <Button>
            <span class="i la-stop" />
          </Button>
          <Button>
            <span class="i mdi-light-repeat" />
          </Button>
        </div>

        <div class="display">
          <div class="bpm">
            <span class="words">BPM</span>
            <div class="value">
              <span class="dec bpm-control i mdi-light-chevron-left"></span>
              <span class="amt">125</span>
              <span class="inc bpm-control i mdi-light-chevron-right"></span>
            </div>
          </div>
          <div class="beat">
            <span class="words">BEAT</span>
            <div class="value">
              <span class="bar" ref={refs.bar}>24</span>
              <span class="dot">.</span>
              <span class="beat" ref={refs.beat}>4</span>
              <span class="dot">.</span>
              <span class="sixt" ref={refs.sixt}>16</span>
            </div>
          </div>
          <div class="time">
            <span class="words">TIME</span>
            <div class="value">
              <span class="mins" ref={refs.mins}>2</span>
              <span class="dot">:</span>
              <span class="secs" ref={refs.secs}>34</span>
              <span class="dot">:</span>
              <span class="mill" ref={refs.mill}>567</span>
            </div>
          </div>
        </div>

      </>
    })
  }
))
