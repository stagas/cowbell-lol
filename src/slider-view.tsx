/** @jsxImportSource minimal-view */

import { once } from 'everyday-utils'
import { Point, Rect } from 'geometrik'
import { chain, Dep, element, on, queue, view, web } from 'minimal-view'
import { app } from './app'
import { Player } from './player'
import { services } from './services'
import { Slider } from './slider'
import { observe } from './util/observe'

let handling = false

const yDims = ['height', 'minHeight', 'maxHeight'] as const
const xDims = ['width', 'minWidth', 'maxWidth'] as const

export { Slider }

export const SliderView = web(view('slider-view',
  class props {
    id!: string
    slider!: Slider

    running!: boolean
    vertical?= false
    showBg!: boolean

    player?: Player
    vol?: Dep<number>

    children?: JSX.Element
  },

  class local {
    host = element
    rect?: Rect
    fill?: HTMLDivElement
    size?: number
    colorCss = ''
  },

  function actions({ $, fn, fns }) {
    let downSlider = false

    return fns(new class actions {
      handleLeave = () => {
        app.$.hint = ''
      }

      handleDown = fn(({ host, id, vertical }) => (e: PointerEvent) => {
        const leftButtonDown = Boolean(e.buttons & 1)

        if (!leftButtonDown) {
          app.$.hint = `${$.slider.$.name} ${$.slider.$.value.toFixed(3)}`
        }

        if (handling || !leftButtonDown) return

        if (e.type === 'pointerdown') {
          downSlider = true
        } else {
          if (!downSlider) return
          if (e.type === 'pointerenter' && !e.altKey) {
            return
          }
        }

        host.toggleAttribute('drag', true)

        handling = true

        host.classList.add('active')

        app.$.beginOverlay('ns-resize')

        const yDims = ['height', 'minHeight', 'maxHeight', 'y'] as const
        const xDims = ['width', 'minWidth', 'maxWidth', 'x'] as const

        const [[dim, , , n]] = vertical
          ? [xDims, yDims]
          : [yDims, xDims]

        const getPointerPos = (e: PointerEvent) => {
          const scrollTop = 0 //document.documentElement.scrollTop
          return new Point(e.pageX, e.pageY - scrollTop)
        }

        const ownRect = $.rect!

        const moveTo = (pos: Point) => {
          let newSize = (pos[n] - ownRect[n])
          if (!vertical) newSize = ownRect[dim] - newSize

          const size = Math.max(0, Math.min(ownRect[dim], newSize))
          const normal = size / ownRect[dim]

          let slider: Slider | undefined
          if ($.player) {
            slider = $.player.$.onSliderNormal(id, normal)
            if (!slider) {
              finish()
              return
            }
          } else {
            $.slider.$.normal = normal
            slider = $.slider
          }
          requestAnimationFrame(() => {
            app.$.hint = `${slider!.$.name} ${slider!.$.value.toFixed(3)}`
          })
        }

        moveTo(getPointerPos(e))

        const off = on(e.altKey ? host : window, 'pointermove').raf(function verticalPointerMove(e) {
          moveTo(getPointerPos(e))
        })

        const finish = once(() => {
          off()
          app.$.hint = ''
          handling = false
          downSlider = false
          requestAnimationFrame(() => {
            host.classList.remove('active')
            host.toggleAttribute('drag', false)
            app.$.endOverlay()
          })
        })

        on(window, 'pointerup').once.capture(finish)
      })

      processWheel = queue.raf((e: WheelEvent) => {
        const normal = $.slider.$.onWheel(e)
        if ($.player) {
          $.player.$.onSliderNormal($.id, normal)
        } else {
          $.slider.$.normal = normal
        }
        requestAnimationFrame(() => {
          app.$.hint = `${$.slider!.$.name} ${$.slider!.$.value.toFixed(3)}`
        })
      })

      handleWheel = (e: WheelEvent) => {
        e.preventDefault()
        this.processWheel(e)
      }

      resize = fn(({ host }) => queue.raf(() => {
        const scrollTop = document.documentElement.scrollTop
        $.rect = new Rect(host.getBoundingClientRect()).translate(0, scrollTop).round()
        const aspect = $.rect.size.x / $.rect.size.y
        if (aspect < 0.5) {
          $.vertical = false
        } else {
          $.vertical = true
        }
      }))

      intersect = this.resize
    })
  },

  function effect({ $, fx, refs }) {
    services.fx(({ skin }) =>
      fx(function sliderCss({ vertical, showBg }) {
        const [small, big] = ['70%', '95%']

        const [dim, opp, pos, oppPos, line, oppLine] = vertical
          ? ['height', 'width', 'left', 'bottom', 'top', 'left']
          : ['width', 'height', 'bottom', 'left', 'left', 'top']

        $.css = /*css*/`
        ${skin.css}

        & {
          --hue: #f00;
          --sat: 85%;
          --lum: 65%;
          z-index: 1;
          display: flex;
          position: relative;
          box-sizing: border-box;
          width: 100%;
          min-width: 13px;
          max-width: 80px;
          height: 100%;
          /* margin: 0 -17.5px 0 0; */
          pointer-events: none;
          user-select: none;
          touch-action: none;
        }

        [part=name] {
          position: absolute;
          ${vertical ? 'right' : 'bottom'}: 4px;
          color: #fff;
          ${vertical ? 'top' : 'left'}: calc(50% - 10px);
          line-height: 17.25px;
          vertical-align: middle;
          white-space: nowrap;
          ${vertical ? '' : `
          writing-mode: vertical-lr;
          /*text-orientation: upright;*/
          `}
          transform: scaleY(-1) scaleX(-1);
          direction: ltr;
          font-family: ${skin.fonts.sans};
          font-size: 15px;
          text-shadow: -1px 1px #000;
          pointer-events: none;
          user-select: none;
          touch-action: none;
        }

        &:before {
          content: ' ';
          position: absolute;
          ${line}: calc(50% - max(${small}, 12px) / 2);
          ${oppLine}: 0;
          ${dim}: max(${small}, 12px);
          ${opp}: 100%;
          background: ${showBg ? '#aaf2' : '#fff0'};
          user-select: none;
          touch-action: none;
        }

        [part=hoverable] {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          pointer-events: all;
          user-select: none;
          touch-action: none;

          ${line}: calc(50% - max(${small}, 12px) / 2);
          ${oppLine}: 0;
          ${dim}: max(${small}, 12px);
          ${opp}: 100%;

          &:hover {
            ${line}: calc(50% - max(${big}, 20px) / 2);
            ${oppLine}: 0;
            ${dim}: max(${big}, 20px);
            ${opp}: 100%;
          }
        }

        &(:not([drag])) {
          [part=fill] {
            transition:
              height 30ms linear,
              min-height 30ms linear,
              max-height 30ms linear
              ;
          }
        }

        [part=fill] {
          position: absolute;
          ${dim}: 100%;
          ${opp}: auto;
          ${pos}: 0;
          ${oppPos}: auto;
          &:before {
            box-shadow: 5px 5px 0 0px #000;
            content: ' ';
            position: absolute;
            ${line}: calc(50% - max(${small}, 12px) / 2);
            ${oppLine}: 0;
            ${dim}: max(${small}, 12px);
            ${opp}: 100%;
            background: hsl(var(--hue), var(--sat), calc(var(--lum) - 5%));
          }
        }

        &(.active),
        &(:hover) {
          cursor: ns-resize;
          z-index: 2;
          &:before {
            ${line}: calc(50% - max(${big}, 20px) / 2);
            ${oppLine}: 0;
            ${dim}: max(${big}, 20px);
            ${opp}: 100%;
            background: #aaf2;
          }
          [part=fill] {
            &:before {
              ${line}: calc(50% - max(${big}, 20px) / 2);
              ${oppLine}: 0;
              ${dim}: max(${big}, 20px);
              ${opp}: 100%;
              background: hsl(var(--hue), var(--sat), calc(var(--lum) + 5%));
            }
          }
        }

        &([running]:hover) {
          &:before {
            background: #aaf3;
          }
        }
        `
      })
    )

    fx.raf(function updateAttrRunning({ host, running }) {
      host.toggleAttribute('running', running)
    })

    fx(({ slider, vol }) =>
      slider.fx(({ normal }) => {
        vol.value = normal
      })
    )

    fx(({ slider, vertical, fill }) =>
      slider.fx.raf(({ normal }) => {
        const [[dim, dimMin, dimMax], [opp, oppMin, oppMax]] = vertical
          ? [xDims, yDims]
          : [yDims, xDims]

        fill.style[dim] =
          fill.style[dimMin] =
          fill.style[dimMax] = `${normal * 100}%`

        fill.style[opp] =
          fill.style[oppMin] =
          fill.style[oppMax] = '100%'
      })
    )

    fx(({ slider }) =>
      slider.fx(({ hue }) =>
        fx.raf(({ running }) => {
          $.colorCss = /*css*/`
          :host {
            --hue: ${(Math.round(hue / 25) * 25) % 360};
            --sat: ${running ? '85%' : '80%'};
            --lum: ${running ? '40%' : '30%'};
          }
          `
        })
      )
    )

    fx(function listenHostResize({ host }) {
      return chain(
        observe.resize.initial(host, $.resize),
        observe.intersection(host, $.intersect)
      )
    })

    fx(function listenPointerEvents({ host }) {
      return chain(
        on(host, 'pointerdown')($.handleDown),
        on(host, 'pointerenter')($.handleDown),
        on(host, 'pointerleave')($.handleLeave),
        on(host, 'pointercancel')($.handleLeave),
        on(host, 'wheel').not.passive($.handleWheel),
      )
    })

    fx(function drawSlider({ slider, colorCss }) {
      $.view = <>
        <style>{colorCss}</style>
        <div part="hoverable"></div>
        <div part="fill" ref={refs.fill}>
          <span part="name">{slider.$.name}</span>
        </div>
      </>
    })
  })
)
