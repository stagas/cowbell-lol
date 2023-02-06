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
    tab?= false
    half?= false
    up?= false
    down?= false
    back?= false
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

      button:active:hover {
        top: 0.75px;
        box-shadow:
          0px 0px 2px 1.15px ${skin.colors.shadeBlack}
          ,2px 1px 2.5px -3.5px ${skin.colors.shadeBlackHalf}
          ;

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

          &:active:hover {
            box-shadow:
              0px 0px 2px 1.15px ${skin.colors.shadeBlack}
              ,2px 1px 2.5px -3.5px ${skin.colors.shadeBlackHalf}
              ;
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

      &([half]) {
        button {
          height: 13.5px;
          border-radius: 0;
        }
      }

      &([up]) {
        button {
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
        }
      }

      &([down]) {
        button {
          border-radius: 0 0 50% 50% / 0 0 100% 100%;
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
        button,
        button:active:hover {
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

      &([tab]) {
        button {
          all: unset;
          border-radius: 5px;
          overflow: hidden;
          position: relative;
          width: auto;
          font-family: ${skin.fonts.sans};
          font-size: 18px;
          padding: 5px 15px;
          cursor: pointer;
          box-sizing: border-box;
          pointer-events: all;

          display: flex;
          flex-flow: row wrap;
          align-items: center;
          gap: 7px;

          line-height: 26px;

          img {
            border-radius: 100%;
            width: 26px;
            height: 26px;
          }
        }

        button,
        button:active:hover {
          box-shadow: none;
          text-shadow: none;

          .shades {
            display: none;
            border-radius: inherit;
          }
        }
      }
      &([tab]:hover),
      &([active][tab]) {
        button,
        button:active:hover {
          background: ${skin.colors.shadeSoft};
        }
      }

      &([round]) {
        button {
          width: 40px;
          height: 39.5px;
          cursor: pointer;
          border-radius: 100% !important;
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

      &([back]) {
        .shades {
          display: none;
        }
        button,
        button:active:hover {
          background: ${skin.colors.bgLighter};
          box-shadow: none;
        }
      }
      &([back]:hover) {
        button,
        button:active:hover {
          background: ${skin.colors.bgPale};
        }
      }
      `
    })

    fx(({ host, active }) => {
      host.toggleAttribute('active', active)
    })

    fx(({ host, rounded }) => {
      host.toggleAttribute('rounded', rounded)
    })

    fx(({ host, round }) => {
      host.toggleAttribute('round', round)
    })

    fx(({ host, small }) => {
      host.toggleAttribute('small', small)
    })

    fx(({ host, pill }) => {
      host.toggleAttribute('pill', pill)
    })

    fx(({ host, tab }) => {
      host.toggleAttribute('tab', tab)
    })

    fx(({ host, half }) => {
      host.toggleAttribute('half', half)
    })

    fx(({ host, up }) => {
      host.toggleAttribute('up', up)
    })

    fx(({ host, down }) => {
      host.toggleAttribute('down', down)
    })

    fx(({ host, back }) => {
      host.toggleAttribute('back', back)
    })

    fx(({ children }) => {
      $.view =
        <button part="btn" onpointerdown={$.handleClick}>
          {children}
          <div part="shades" class="shades" />
        </button>
    })
  }
))
