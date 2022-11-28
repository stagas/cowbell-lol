/** @jsxImportSource minimal-view */

import { Point, Rect, Scalar } from 'geometrik'
import { chain, element, on, queue, view, web } from 'minimal-view'

import { MonoMachine } from './mono'
import { observe } from './util/observe'

const { clamp } = Scalar

let downSlider = false

export class Slider {
  id!: string
  name!: string
  value!: number
  min!: number
  max!: number
  hue!: number
  source!: { arg: string; } | { arg: string; id: string; range: string; default: string; }
  sourceIndex!: number

  constructor(data: Partial<Slider>) {
    Object.assign(this, data)
  }

  toJSON() {
    return {
      ...this,
      source: {
        ...this.source
      }
    }
  }
}

export const SliderView = web('slider', view(
  class props extends Slider {
    machine!: MonoMachine
    running!: boolean
    vertical?= true
    children?: JSX.Element
  }, class local {
  host = element
  rect?: Rect
  fill?: HTMLDivElement
  size?: number
}, ({ $, fx, fn, refs }) => {
  fx(({ vertical }) => {
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
    max-width: 100px;
    height: 100%;
    margin: 0 -17.5px 0 0;
    pointer-events: none;
    user-select: none;
    touch-action: none;
  }

  [part=name] {
    position: absolute;
    top: 0px;
    color: #fff;
    left: calc(50% - 10px);
    line-height: 20px;
    vertical-align: middle;
    white-space: nowrap;
    writing-mode: vertical-lr;
    text-orientation: upright;
    direction: ltr;
    font-family: monospace;
    font-weight: bold;
    text-shadow: 1px 1px #000;
  }

  &:before {
    content: ' ';
    position: absolute;
    ${line}: calc(50% - max(45%, 12px) / 2);
    ${oppLine}: 0;
    ${dim}: max(45%, 12px);
    ${opp}: 100%;
    background: #fff0;
  }

  [part=hoverable] {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: all;

    ${line}: calc(50% - max(45%, 12px) / 2);
    ${oppLine}: 0;
    ${dim}: max(45%, 12px);
    ${opp}: 100%;

    &:hover {
      ${line}: calc(50% - max(80%, 20px) / 2);
      ${oppLine}: 0;
      ${dim}: max(80%, 20px);
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
      ${line}: calc(50% - max(45%, 12px) / 2);
      ${oppLine}: 0;
      ${dim}: max(45%, 12px);
      ${opp}: 100%;
      background: hsl(var(--hue), var(--sat), calc(var(--lum) - 5%));
    }
  }

  &(.active),
  &(:hover) {
    cursor: ns-resize;
    z-index: 2;
    &:before {
      ${line}: calc(50% - max(80%, 20px) / 2);
      ${oppLine}: 0;
      ${dim}: max(80%, 20px);
      ${opp}: 100%;
      background: #aaf2;
    }
    [part=fill] {
      &:before {
        ${line}: calc(50% - max(80%, 20px) / 2);
        ${oppLine}: 0;
        ${dim}: max(80%, 20px);
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

  fx.raf(({ host, running }) => {
    host.toggleAttribute('running', running)
  })

  fx(({ host }) => {
    const resize = queue.raf(() => {
      $.rect = new Rect(host.getBoundingClientRect()).round()
    })
    return observe.resize.initial(host, resize)
  })

  const yDims = ['height', 'minHeight', 'maxHeight'] as const
  const xDims = ['width', 'minWidth', 'maxWidth'] as const

  const updateNormal = fn(({ fill, vertical }) => (newNormal) => {

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

  fx.raf(({ fill: _, value, min, max }) => {
    const normal = clamp(0, 1, (value - min) / (max - min))
    updateNormal(normal)
  })

  const setSliderNormal = fn(({ id, machine }) => (value: number) => machine.methods.setSliderNormal(id, value))

  let handling = false
  const handleDown = fn(({ host, vertical }) => (e: PointerEvent) => {
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
      return new Point(e.pageX, e.pageY)
    }

    const ownRect = new Rect(host.getBoundingClientRect())

    const moveTo = (pos: Point) => {
      let newSize = (pos[n] - ownRect[n])
      if (!vertical) newSize = ownRect[dim] - newSize

      const size = Math.max(0, Math.min(ownRect[dim], newSize))
      const normal = size / ownRect[dim]
      setSliderNormal(normal)
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

  const handleWheel = fn(({ host, id }) => function onSliderWheel(ev: WheelEvent) {
    $.machine.methods.onWheel(ev, id)
  })

  fx(({ host }) =>
    chain(
      on(host, 'pointerdown')(handleDown),
      on(host, 'pointerenter')(handleDown),
      on(host, 'wheel').not.passive(handleWheel),
    )
  )

  fx(({ name }) => {

    $.view = <>
      <div part="hoverable"></div>
      <div part="fill" ref={refs.fill}>
        <span part="name">{name}</span>
      </div>
    </>
  })
}))
