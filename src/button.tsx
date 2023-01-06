/** @jsxImportSource minimal-view */

import { element, view, web } from 'minimal-view'
import { ui } from './ui'

export const Button = web(view('btn',
  class props {
    active?= false
    rounded?= false
    children?: JSX.Element
  },
  class local {
    host = element
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
        --backlight-width: 2.55px;
      }

      button {
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 42px;
        height: 41px;
        font-size: 25px;
      }

      button {
        color: inherit;
        background: ${skin.colors.bgPale};
        border-radius: 11px;
        box-shadow:
          inset 0px .84px 2.9px -.2px ${skin.colors.shadeBright}
          ,inset 0px -2.95px 1px -2.1px ${skin.colors.shadeDark}
          ,0px 0px 2px 1.15px ${skin.colors.shadeBlack}
          ;

        .la {
          &-play {
            color: ${skin.colors.brightGreen};
            padding-left: 0.5px;
          }
          &-pause { color: ${skin.colors.brightGreen}; }
          &-stop { color: ${skin.colors.yellow}; }
          &-backward,
          &-forward { color: ${skin.colors.brightCyan}; }
        }

        .mdi-light {
          &-repeat,
          &-repeat-once {
            color: ${skin.colors.brightPurple};
            position: relative;
            top: -.5px;
            transform: scale(1.15);
          }
        }
      }

      &([active]) {
        button {
          text-shadow:
            0px 0px 3px ${skin.colors.brightGreen}
            ,0px -.75px 2px ${skin.colors.shadeBlack}
            ;
          box-shadow:
            inset
              0px .84px 2.9px -.2px ${skin.colors.shadeBright}
              ,inset 0px -2.95px 1px -2.1px ${skin.colors.shadeDarker}
              ,inset 0px -1px 3.5px -1.5px ${skin.colors.brightGreen}35
              ,0px 0px 1px 1.15px ${skin.colors.shadeBlack}
              ,0px -0px 1.9px var(--backlight-width) ${skin.colors.brightGreen}
              ;
        }
      }

      &([rounded]) {
        --backlight-width: 2.3px;
        button {
          border-radius: 14px;
          width: 38px;
          height: 32px;
          font-size: 23px;
        }
      }
      `
    })

    fx.raf(({ host, active }) => {
      host.toggleAttribute('active', active)
    })

    fx.raf(({ host, rounded }) => {
      host.toggleAttribute('rounded', rounded)
    })

    fx(({ children }) => {
      $.view =
        <button>
          {children}
        </button>
    })
  }
))
