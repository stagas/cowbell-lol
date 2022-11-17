/** @jsxImportSource minimal-view */

import { Rect } from 'geometrik'
import { web, view, element } from 'minimal-view'

import { observe } from './util/observe'

export const Layout = web('layout', view(class props {
  width!: string | number
  layout!: HTMLElement
  children?: JSX.Element
}, class local {
  host = element
}, ({ $, fx, fn }) => {
  $.css = /*css*/`
  & {
    position: relative;
    display: flex;
    transition:
      width 3.5ms linear,
      min-width 3.5ms linear,
      max-width 3.5ms linear
      ;
  }

  > * {
    width: 100%;
    height: 100%;
  }

  [part=waveform] {
    min-height: 88px; /* 90px-2px border */
  }
  `

  const resize = fn(({ host, layout, width }) => () => {
    const rect = new Rect(layout.getBoundingClientRect()).round()
    const w = rect.width * (
      typeof width === 'string'
        ? parseFloat(width as string) / 100
        : width
    ) + 'px'
    Object.assign(host.style, {
      width: w,
      minWidth: w,
      maxWidth: w,
    })
  })

  fx(({ layout }) =>
    observe.resize.initial(layout, resize)
  )

  fx(({ width: _ }) => resize())

  fx(({ children }) => {
    $.view = children
  })
}))
