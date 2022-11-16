/** @jsxImportSource minimal-view */

import { web, view, element } from 'minimal-view'
import { Point, Rect } from 'geometrik'
import { isEqual } from 'everyday-utils'

import { fitGrid } from './util/fit-grid'
import { observe } from './util/observe'
import { Stretchy } from './components'
import { App } from './app'

// eslint-disable-next-line @typescript-eslint/ban-types
export interface Preset<T = any> {
  id: string
  name: string
  hue: number
  detail: T
  isIntent?: boolean
  isDraft?: boolean
}

export const Presets = web('presets', view(
  class props {
    app!: App

    id!: string
    presets!: Preset[]
    detail!: any
  }, class local {
  host = element
  selected: string | false = false

  size?: Point
}, ({ $, fx }) => {
  $.css = /*css*/`
  & {
    --cols: 1;
    --rows: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    cursor: default;
    user-select: none;
    touch-action: none;
  }

  [part=preset] {
    position: relative;
    /* width: calc(100% / var(--cols)); */
    /* height: calc(100% / var(--rows)); */
    color: hsl(var(--hue), 85%, 65%);
    font-family: Helvetica, 'Helvetica Neue', 'Open Sans', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-size: 22px;
    text-align: center;

    svg {
      position: relative;
      z-index: 1;
      display: flex;
      width: 100%;
      height: 100%;
    }

    [part=overlay] {
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: hsl(var(--hue), 85%, 65%);
      opacity: 0;
    }

    [part=draft] {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-repeat: repeat;
      background-size: 30px 30px;
    }

    &:hover,
    &.selected {
      & svg {
        color: black !important;
      }
      & [part=overlay] {
        opacity: 1;
      }
    }
  }
  `

  fx(({ host }) =>
    observe.resize.initial(host, () => {
      $.size = new Rect(host.getBoundingClientRect()).round().size
    })
  )

  fx(({ app, id, presets, size, detail }) => {
    const [w, h] = size
    const total = presets.length
    const { cols, rows } = fitGrid(w, h, total)
    $.view = presets.map((preset) =>
      <div
        key={preset.id}
        id={preset.id}
        part="preset"
        style={{
          '--hue': preset.hue,
          width: 100 / cols + '%',
          height: 100 / rows + '%',
        } as any}
        class={isEqual(preset.detail, detail) ? 'selected' : ''}
        onpointerdown={(e) => {
          if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
            app.removePresetById(id, preset.id)
          } else {
            app.selectPreset(id, preset.id, true)
          }
        }}
        ondblclick={() => {
          app.savePreset(id, preset.id)
        }}
      >
        <div part="overlay"></div>
        <div part="draft" style={preset.isDraft ? {
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" preserveAspectRatio="xMidYMid meet">\
          <circle cx="22.5" cy="22.5" r="20" fill="hsl(${(preset.hue + 180) % 360}, 75%, 20%)" />\
          <circle cx="67.5" cy="67.5" r="20" fill="hsl(${(preset.hue + 180) % 360}, 75%, 20%)" />\
          " /></svg>')` } : {}}></div>
        <Stretchy width={30} height={27}>
          {preset.name}
        </Stretchy>
      </div>
    )
  })
}))
