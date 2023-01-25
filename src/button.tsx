/** @jsxImportSource minimal-view */

import { element, view, web } from 'minimal-view'
import { services } from './services'

export const Button = web(view('btn',
  class props {
    active?= false
    rounded?= false
    round?= false
    small?= false
    pill?= false
    onClick?: () => void
    children?: JSX.Element
  },
  class local {
    host = element
  },
  function actions({ $, fns, fn }) {
    return fns(new class actions {
      handleClick = (e: PointerEvent) => {
        e.preventDefault()
        e.stopPropagation()
        $.onClick?.()
      }
    })
  },
  function effects({ $, fx, deps, refs }) {
    services.fx(({ skin }) => {
      $.css = /*css*/`
      ${skin.css}

      & {
        --backlight-width: 2.55px;
        --backlight-color: ${skin.colors.brightGreen};
        --backlight-color-trans: ${skin.colors.brightGreen}35;
        pointer-events: none;
      }

      button {
        all: unset;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 42px;
        height: 41px;
        font-size: 25px;
        overflow: hidden;
        pointer-events: all;
      }

      .shades {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        box-shadow:
          inset 0px .84px 2.9px -.2px ${skin.colors.shadeBright}
          ,inset 2.5px 4px 8.5px -4.5px ${skin.colors.shadeBright}
          ,inset 0px -2.95px 1px -2.1px ${skin.colors.shadeDark}
          ;
        border-radius: inherit;
      }

      button {
        color: inherit;
        background: ${skin.colors.bgPale};
        border-radius: 11px;

        box-shadow:
          0px 0px 2px 1.15px ${skin.colors.shadeBlack}
          ,2px 2.5px 3.5px -2.7px ${skin.colors.shadeBlackHalf}
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

      &([rounded]) {
        --backlight-width: 2.3px;

        .shades {
          box-shadow:
            inset 0px .84px 2.9px -.2px ${skin.colors.shadeBright}
            ,inset 1.5px 3px 8px -2px ${skin.colors.shadeBright}
            ,inset 0px -2.95px 1px -2.1px ${skin.colors.shadeDark}
            ;
        }

        button {
          border-radius: 14px;
          width: 38px;
          height: 32px;
          font-size: 23px;
          box-shadow:
            0px 0px 2px 1.15px ${skin.colors.shadeBlack}
            ,2px 2.5px 3.5px -2.7px ${skin.colors.shadeBlackHalf}
            ;
        }
      }

      &([round]) {
        button {
          cursor: pointer;
          border-radius: 100%;
          font-size: 21.5px;

          .la-list {
            font-size: 26.5px;
          }

          .mdi-light-chevron-up {
            font-size: 34px;
            position: relative;
            top: -2.5px;
            left: 1px;
          }
        }
      }

      &([small]) {
        button {
          width: 34px;
          border-radius: 100%;
          height: 27px;
          font-size: 16px !important;
        }
      }

      &([active]) {
        .shades {
          box-shadow:
            inset
              inset 0px -2.95px 1px -2.1px ${skin.colors.shadeDarker}
              ,inset 0px -1px 3.5px -1.5px var(--backlight-color-trans)
              ;
        }
        button {
          text-shadow:
            0px 0px 3px var(--backlight-color)
            ,0px -.75px 2px ${skin.colors.shadeBlack}
            ;
          box-shadow:
            0px .84px 2.9px -.2px ${skin.colors.shadeBright}
            ,0px 0px 1px 1.15px ${skin.colors.shadeBlack}
            ,0px -0px 1.9px var(--backlight-width) var(--backlight-color)
            ;
        }
      }

      &([pill]) {
        button {
          width: auto;
          font-family: ${skin.fonts.sans};
          font-size: 16px;
          padding: 0 15px;

          display: flex;
          flex-flow: row wrap;
          gap: 4px;

          .i {
            position: relative;
            top: 0.5px;
            margin-right: -4px;
            font-size: 37px;
          }
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

    fx.raf(({ host, round }) => {
      host.toggleAttribute('round', round)
    })

    fx.raf(({ host, small }) => {
      host.toggleAttribute('small', small)
    })

    fx.raf(({ host, pill }) => {
      host.toggleAttribute('pill', pill)
    })

    fx(({ children }) => {
      $.view =
        <button onpointerdown={$.handleClick}>
          {children}
          <div class="shades" />
        </button>
    })
  }
))
