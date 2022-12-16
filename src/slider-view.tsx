/** @jsxImportSource minimal-view */

import { Point, Rect, Scalar } from 'geometrik'
import { chain, element, on, queue, view, web } from 'minimal-view'
import { Slider } from './slider'

import { observe } from './util/observe'

const { clamp } = Scalar

let downSlider = false

export { Slider }

export const SliderView = web(view('slider',
  class props {
    ownerId!: string
    id!: string
    slider!: Slider

    onValue!: (value: number, ownerId: string, sliderId: string) => void
    onWheel!: (e: WheelEvent, ownerId: string, sliderId: string) => number

    running!: boolean
    vertical!: boolean
    showBg!: boolean

    children?: JSX.Element
  },

  class local extends Slider {
    host = element
    rect?: Rect
    fill?: HTMLDivElement
    size?: number
    colorCss = ''
  },

  function actions({ $, fn, fns }) {
    const yDims = ['height', 'minHeight', 'maxHeight'] as const
    const xDims = ['width', 'minWidth', 'maxWidth'] as const

    let currentNormal = -1

    let handling = false

    return fns(new class actions {
      updateNormal = fn(({ fill, vertical }) => (newNormal) => {
        if (currentNormal === newNormal) return
        currentNormal = newNormal

        const [[dim, dimMin, dimMax], [opp, oppMin, oppMax]] = vertical
          ? [xDims, yDims]
          : [yDims, xDims]

        fill.style[dim] =
          fill.style[dimMin] =
          fill.style[dimMax] =
          newNormal * 100 + '%'

        fill.style[opp] =
          fill.style[oppMin] =
          fill.style[oppMax] = '100%'
      })

      // setSliderNormal =
      //   fn(({ ownerId, id }) =>
      //     (value: number) =>
      //       $.machine.methods.setSliderNormal(id, value))

      handleDown = fn(({ host, ownerId, id, onValue, vertical }) => (e: PointerEvent) => {
        if (handling || !(e.buttons & 1)) return

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

        const yDims = ['height', 'minHeight', 'maxHeight', 'y'] as const
        const xDims = ['width', 'minWidth', 'maxWidth', 'x'] as const

        const [[dim, , , n]] = vertical
          ? [xDims, yDims]
          : [yDims, xDims]

        const getPointerPos = (e: PointerEvent) => {
          const scrollTop = document.documentElement.scrollTop
          return new Point(e.pageX, e.pageY - scrollTop)
        }

        const ownRect = new Rect(host.getBoundingClientRect())

        const moveTo = (pos: Point) => {
          let newSize = (pos[n] - ownRect[n])
          if (!vertical) newSize = ownRect[dim] - newSize

          const size = Math.max(0, Math.min(ownRect[dim], newSize))
          const normal = size / ownRect[dim]
          this.updateNormal(normal)
          onValue(normal, ownerId, id)
        }

        moveTo(getPointerPos(e))

        const off = on(e.altKey ? host : window, 'pointermove').raf(function verticalPointerMove(e) {
          moveTo(getPointerPos(e))
        })

        on(window, 'pointerup').once((e) => {
          off()
          handling = false
          downSlider = false
          requestAnimationFrame(() => {
            host.classList.remove('active')
            host.toggleAttribute('drag', false)
          })
        })
      })

      handleWheel =
        fn(({ ownerId, id, onWheel }) =>
          (e: WheelEvent) => {
            onWheel(e, ownerId, id)
            // update normal here?
          })

      resize = fn(({ host }) => queue.raf(() => {
        $.rect = new Rect(host.getBoundingClientRect()).round()
      }))

    })
  },

  function effect({ $, fx, refs }) {
    fx(function sliderCss({ vertical, showBg }) {
      const [small, big] = ['70%', '95%']

      const [dim, opp, pos, oppPos, line, oppLine] = vertical
        ? ['height', 'width', 'left', 'bottom', 'top', 'left']
        : ['width', 'height', 'bottom', 'left', 'left', 'top']

      $.css = /*css*/`

      & {
        --hue: #f00;
        --sat: 85%;
        --lum: 65%;
        z-index: 1;
        display: flex;
        position: relative;
        box-sizing: border-box;
        width: 100%;
        /* max-width: 80px; */
        height: 100%;
        /* margin: 0 -17.5px 0 0; */
        pointer-events: none;
        user-select: none;
        touch-action: none;
      }

      [part=name] {
        position: absolute;
        ${vertical ? 'right' : 'top'}: 0px;
        color: #fff;
        ${vertical ? 'top' : 'left'}: calc(50% - 10px);
        line-height: 20px;
        vertical-align: middle;
        white-space: nowrap;
        ${vertical ? '' : `
        writing-mode: vertical-lr;
        text-orientation: upright;
        `}
        direction: ltr;
        font-family: monospace;
        font-weight: bold;
        text-shadow: 1px 1px #000;
      }

      &:before {
        content: ' ';
        position: absolute;
        ${line}: calc(50% - max(${small}, 12px) / 2);
        ${oppLine}: 0;
        ${dim}: max(${small}, 12px);
        ${opp}: 100%;
        background: ${showBg ? '#aaf2' : '#fff0'};
      }

      [part=hoverable] {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        pointer-events: all;

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

    fx.raf(function updateAttrRunning({ host, running }) {
      host.toggleAttribute('running', running)
    })

    fx(({ slider }) => {
      Object.assign($, slider)
    })

    fx.raf(function onValueChange({ fill: _, value, min, max }) {
      const normal = clamp(0, 1, (value - min) / (max - min))
      $.updateNormal(normal)
    })

    fx(function updateColorCss({ hue, running }) {

      $.colorCss = /*css*/`

      :host {
        --hue: ${(Math.round(hue / 25) * 25) % 360};
        --sat: ${running ? '85%' : '80%'};
        --lum: ${running ? '40%' : '30%'};
      }
      `
    })

    fx(function listenHostResize({ host }) {
      return observe.resize.initial(host, $.resize)
    })


    // fx(function registerSliderUpdateNormal({ id, scene }) {
    //   scene.updateNormalMap.set($.machine.id, id, $.updateNormal)
    // })

    fx(function listenPointerEvents({ host }) {
      return chain(
        on(host, 'pointerdown')($.handleDown),
        on(host, 'pointerenter')($.handleDown),
        on(host, 'wheel').not.passive($.handleWheel),
      )
    })

    fx(function drawSlider({ name, colorCss }) {
      $.view = <>
        <style>{colorCss}</style>
        <div part="hoverable"></div>
        <div part="fill" ref={refs.fill}>
          <span part="name">{name}</span>
        </div>
      </>
    })
  })
)
