/** @jsxImportSource minimal-view */

import { web, view } from 'minimal-view'
import { Knob } from 'x-knob'
import { anim } from './anim'
import { Button } from './button'
import { NumberInput } from './number-input'
import { Project } from './project'
import { services } from './services'
import { Volume } from './volume'

export const Toolbar = web(view('toolbar',
  class props {
    project!: Project
  },

  class local {
    volKnob?: InstanceType<typeof Knob.Element>

    bar?: HTMLSpanElement
    beat?: HTMLSpanElement
    sixt?: HTMLSpanElement

    mins?: HTMLSpanElement
    secs?: HTMLSpanElement
    mill?: HTMLSpanElement
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      drawTime = services.fn(({ audio }) => fn(({ mins, secs, mill, bar, beat, sixt }) => () => {
        const elapsed = audio.$.getTime()
        const time = new Date(Math.max(0, elapsed / audio.$.coeff * 1000))

        mins.textContent = `${time.getMinutes()}`
        secs.textContent = `${time.getSeconds()}`.padStart(2, '0')
        mill.textContent = `${time.getMilliseconds()}`.padStart(3, '0')

        const b = elapsed

        bar.textContent = `${Math.max(1, 1 + b | 0)}`.padStart(3, '0')
        // bar.textContent = `${Math.max(1, 1+(b % 16)|0 )}`.padStart(2, '0')
        beat.textContent = `${Math.max(1, 1 + ((b * 4) % 4) | 0)}`
        sixt.textContent = `${Math.max(1, 1 + ((b * 16) % 16) | 0)}`.padStart(2, '0')
      }))
    })
  },

  function effects({ $, fx, deps, refs }) {
    services.fx(({ skin }) => {
      $.css = /*css*/`
      ${skin.css}

      & {
        position: sticky;
        top: 0;
        z-index: 99999;
        background: ${skin.colors.bgLight};
        box-shadow: 0 1px 2.5px 1.15px ${skin.colors.shadeBlack};
        color: ${skin.colors.fg};
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
      }

      .inner {
        padding: 10px;
        box-sizing: border-box;
        max-width: 800px;
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: space-between;
      }

      .logo {
        cursor: pointer;
        user-select: none;
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
            transform: rotate(21deg) scale(1.42) translateY(-2px);
          }

          .o {
            color: ${skin.colors.brightGreen};
            display: inline-block;
            transform: translateX(0.18px) translateY(-1.1px) scale(0.97);
          }

          .l2 {
            color: ${skin.colors.yellow};
            display: inline-block;
            transform: rotate(-25deg) scale(1.67) translateX(2.86px) translateY(-1.1px);
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
          top: -7px;
          left: .8px;
          font-family: ${skin.fonts.sans};
        }
      }

      @media (max-width: 800px) {
        .cowbell, .motto {
          display: none !important;
        }

        .lol {
          transform: scale(1.66) translateY(.7px) translateX(12px) !important;
        }
      }

      ${Knob} {
        --white: ${skin.colors.brightGreen};
        position: relative;
        top: 3px;
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
        &::part(line) {
          stroke-width: 2.6px;
        }
        &::part(fill),
        &::part(fill-value) {
          stroke-width: 2.6px;
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
        /* padding: 0px 9px 0 11px; */
        box-sizing: border-box;
        height: 32px;
        box-shadow:
          inset 0 1.5px 2.25px -0.35px ${skin.colors.shadeBlack}
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
          &:first-child {
            .value {
              padding-left: 14px;
            }
          }
          &:last-child {
            .value {
              padding-right: 11px;
            }
          }
          &:not(:first-child) {
            border-left: 2px solid ${skin.colors.bgLight};
            padding-left: 8px;
          }
        }

        .dot {
          color: ${skin.colors.fgPale};
          padding: .8px;
        }

        .beats {
          margin-left: -18px;
          /* padding-right: 5px; */
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
          border-radius: 8px;
          overflow: hidden;
        }

        .words {
          z-index: 2;
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
            position: relative;
            left: -11px;
            --padding: 14.5px;

            &::part(left),
            &::part(right) {
              width: 18px;
              color: ${skin.colors.fgPale};
              font-size: 20px;
              padding-top: 7px;
            }

            &::part(left) {
              padding-right: var(--padding);
            }

            &::part(right) {
              padding-left: var(--padding);
            }
          }

          .words {
            left: 16.5px;
          }
        }
      }
      `
    })

    fx(() =>
      services.fx(({ audio }) =>
        audio.fx(({ state }) => {
          if (state === 'running') {
            const tick = () => {
              anim.schedule(tick)
              $.drawTime()
            }

            anim.schedule(tick)

            return () => {
              tick()
              anim.remove(tick)
            }
          }
        })
      )
    )

    fx(() =>
      services.fx(({ audio }) =>
        audio.fx(({ state, internalTime: _ }) => {
          // this allows the time display to be reset
          // when clicking stop after pause
          if (state === 'suspended') {
            $.drawTime()
          }
        })
      )
    )

    services.fx(({ skin, audio }) =>
      fx(({ project }) =>
        audio.fx(({ state, repeatState, destPlayer }) => {
          $.view = <>
            <div class="inner">
              <div class="logo" onclick={services.$.linkTo('/')} onwheel={(e) => {
                e.preventDefault()
                e.stopPropagation()
                $.volKnob?.$.onWheel(e)
              }}>
                <h1 key={project}>
                  <div class="cowbell">
                    cowbell
                    <span class="dot">.</span>
                  </div>
                  <div class="lol">
                    <span class="l">l</span>
                    <span class="o">
                      <Volume knobRef={deps.volKnob} target={destPlayer} theme="ableton" bare />
                    </span>
                    {/* <span class="o">o</span> */}
                    <span class="l2">l</span>
                  </div>
                </h1>
                <span class="motto">needs more</span>
              </div>

              <div class="controls">
                <Button onClick={audio.$.stopClick}>
                  <span class="i la-stop" />
                </Button>
                <Button
                  active={state === 'running'}
                  onClick={audio.$.toggle}
                >
                  <span class={`i la-${state === 'running' ? 'pause' : 'play'}`} />
                </Button>
                <Button
                  active={repeatState !== 'none'}
                  onClick={audio.$.toggleRepeat}
                  style={`--backlight-color: ${skin.colors.brightPurple}; --backlight-color-trans: ${skin.colors.brightPurple}35;`}
                >
                  <span class={`i mdi-light-repeat${repeatState === 'bar' ? ''/*'-once'*/ : ''}`} />
                </Button>
                <Button
                  onClick={audio.$.seekTime(-1)}
                >
                  <span class="i la-backward" />
                </Button>
                <Button
                  onClick={audio.$.seekTime(+1)}
                >
                  <span class="i la-forward" />
                </Button>
              </div>

              <div class="display">
                <div class="bpm">
                  <span class="words">BPM</span>
                  <div class="value">
                    <NumberInput
                      style="height:30px"
                      class="bpm-control"
                      min={1}
                      max={666}
                      value={project.deps.bpm}
                      step={1}
                      align="x"
                    />
                    {/*                 <span class="dec bpm-control i mdi-light-chevron-left"></span>
                <span class="amt">125</span>
                <span class="inc bpm-control i mdi-light-chevron-right"></span> */}
                  </div>
                </div>
                <div class="beats">
                  <span class="words">BEAT</span>
                  <div class="value">
                    <span class="bar" ref={refs.bar}>001</span>
                    <span class="dot">.</span>
                    <span class="beat" ref={refs.beat}>1</span>
                    <span class="dot">.</span>
                    <span class="sixt" ref={refs.sixt}>01</span>
                  </div>
                </div>
                <div class="time">
                  <span class="words">TIME</span>
                  <div class="value">
                    <span class="mins" ref={refs.mins}>0</span>
                    <span class="dot">:</span>
                    <span class="secs" ref={refs.secs}>00</span>
                    <span class="dot">:</span>
                    <span class="mill" ref={refs.mill}>000</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        })
      )
    )
  }
))
