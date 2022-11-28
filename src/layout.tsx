/** @jsxImportSource minimal-view */

import { Rect } from 'geometrik'
import { element, view, web } from 'minimal-view'

import { Button } from './button'
import { observe } from './util/observe'

export const Layout = web('layout', view(class props {
  size!: string | number
  layout!: HTMLElement
  vertical?= false
  children?: JSX.Element
}, class local {
  host = element
}, ({ $, fx, fn }) => {
  fx(({ vertical }) => {
    const dim = vertical ? 'height' : 'width'
    $.css = /*css*/`
    & {
      /* width: 100%; */
      /* height: 100%; */
      position: relative;
      display: flex;
      /* transition:
        ${dim} 3.5ms linear,
        min-${dim} 3.5ms linear,
        max-${dim} 3.5ms linear
        ; */
    }

    > *,
    [part=overlay] > * {
      width: 100%;
      height: 100%;
    }

    [part=waveform] {
      z-index: 1;
      pointer-events: none;
      min-height: 88px; /* 90px-2px border */
    }

    [part=editor] {
      pointer-events: none;
      z-index: 2;
    }

    [part=presets] {
      z-index: 3;
      pointer-events: all;
    }

    [part=side] {
      height: calc(100% - 2px);
      pointer-events: all;
    }

    .column {
      display: flex;
      flex-flow: column nowrap;
      height: 100%;
    }

    [part=controls] {
      z-index: 999999;
      pointer-events: all;
      font-family: system-ui;
      display: flex;
      flex-flow: row wrap;
      gap: 7px;
      position: absolute;
      margin: 7px;
      top: 0;
      right: 0;

      ${Button} {
        cursor: pointer;
        opacity: 0.8;
        &[part=remove] {
          opacity: 0.8;
        }
        &:hover {
          opacity: 1;
        }
      }
    }

    &([state=running]) [part=controls] ${Button} {
      opacity: 1;
      &:hover {
        color: #fff !important;
      }
    }
    `
  })

  const resize = fn(({ host, layout, size, vertical }) => () => {
    const [dim, min, max] = vertical
      ? ['height', 'minHeight', 'maxHeight'] as const
      : ['width', 'minWidth', 'maxWidth'] as const
    const rect = new Rect(layout.getBoundingClientRect()).round()

    const w = rect[dim] * (
      typeof size === 'string'
        ? parseFloat(size as string) / 100
        : size
    ) + 'px'

    Object.assign(host.style, {
      [dim]: w,
      [min]: w,
      [max]: w,
    })
  })

  fx(({ layout }) =>
    observe.resize.initial(layout, resize)
  )

  fx(({ size: _ }) => resize())

  fx(({ children }) => {
    $.view = children
  })
}))
