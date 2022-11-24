/** @jsxImportSource minimal-view */

import { memoize } from 'everyday-utils'
import { Point, Rect } from 'geometrik'
import { element, view, web } from 'minimal-view'

import { App } from './app'
import { Stretchy } from './stretchy'
import { classes } from './util/classes'
import { Detail, ItemDetail } from './util/detail'
import { fitGrid } from './util/fit-grid'
import { observe } from './util/observe'

export class Preset<T extends ItemDetail = ItemDetail> {
  id!: string
  name!: string
  hue!: number
  detail!: Detail<T>
  isIntent?: boolean
  isDraft?: boolean
}

const bgForHue = memoize((hue: number) => {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" preserveAspectRatio="xMidYMid meet">\
  <circle cx="22.5" cy="22.5" r="20" fill="hsl(${(hue + 45) % 360}, 75%, 20%)" />\
  <circle cx="67.5" cy="67.5" r="20" fill="hsl(${(hue + 45) % 360}, 75%, 20%)" />\
  " /></svg>')`
})

const PresetView = view(class extends Preset {
  app!: App
  machineId!: string
  width!: string
  height!: string
  isSelected!: boolean
}, class local {
}, ({ $, fx }) => {
  fx(({ app, name, machineId, id, hue, width, height, isSelected, isDraft }) => {
    $.view = <div
      id={id}
      part="preset"
      style={{
        '--hue': hue,
        width,
        height,
      } as any}
      class={
        classes({
          ['selected']: isSelected,
          ['draft']: isDraft
        })
      }
      onpointerdown={(e) => {
        if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
          app.removePresetById(machineId, id)
        } else if (e.buttons & 4) { // middle button
          app.renamePresetRandom(machineId, id, e.altKey)
        } else {
          app.selectPreset(machineId, id, true)
        }
      }}
      ondblclick={(e) => {
        // removing so cancel dblclick
        if (e.shiftKey && (e.ctrlKey || e.metaKey)) return
        // renaming so cancel dblclick
        if (e.buttons & 4) return

        app.savePreset(machineId, id)
      }}
    >
      <div part="overlay"></div>
      <div part="draft" style={isDraft ? `background-image: ${bgForHue(hue)}` : ''}></div>
      <Stretchy width={30} height={30}>
        {name}
        <div part="shadow">
          {name}
        </div>
        <div part="outline">
          {name}
        </div>
      </Stretchy>
    </div>
  })
})

export const Presets = web('presets', view(
  class props {
    app!: App
    id!: string
    presets!: Preset[]
    selectedPresetId!: string | false
  }, class local {
  host = element
  size?: Point
  width?: string
  height?: string
  presetsLength?: number
}, ({ $, fx }) => {
  $.css = /*css*/`
  & {
    --cols: 1;
    --rows: 1;
    box-sizing: border-box;
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
    color: hsl(var(--hue), 85%, 65%);
    font-family: Helvetica, 'Helvetica Neue', 'Open Sans', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-size: 22px;
    line-height: 30px;
    text-align: center;

    --shadow-color: #001e;
    --shadow-width: 3px;

    --outline-color: #0000;
    --outline-width: 3px;

    svg {
      position: relative;
      z-index: 1;
      display: flex;
      width: 100%;
      height: 100%;
    }

    [part=outline],
    [part=shadow] {
      display: none;
      position: absolute;
      z-index: -1;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    [part=shadow] {
      color: var(--shadow-color);
      -webkit-text-stroke: var(--shadow-width) var(--shadow-color);
    }

    [part=outline] {
      z-index: -2;
      color: var(--outline-color);
      -webkit-text-stroke: var(--outline-width) var(--outline-color);
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
      background-position: center;
    }

    &.draft {
      [part=shadow] {
        display: block;
      }
    }

    &:hover,
    &.selected {
      --shadow-color: hsl(var(--hue), 85%, 65%);
      --shadow-width: 3.5px;
      --outline-color: hsl(calc(var(--hue) + 45), 75%, 20%);
      --outline-width: calc(var(--shadow-width) + 3px);

      svg {
        color: hsl(calc(var(--hue) + 45), 75%, 20%); !important;
      }

      [part=outline],
      [part=shadow] {
        display: block;
      }

      [part=overlay] {
        opacity: 1;
      }

      [part=draft] {
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

  fx(({ presets }) => {
    $.presetsLength = presets.length
  })

  fx(({ presetsLength, size }) => {
    const [w, h] = size
    const total = presetsLength
    const { cols, rows } = fitGrid(w, h, total)
    $.width = 100 / cols + '%'
    $.height = 100 / rows + '%'
  })

  fx(({ app, id, presets, selectedPresetId, width, height }) => {
    $.view = presets.map((preset) =>
      <PresetView
        {...preset}
        part="preset"
        app={app}
        width={width}
        height={height}
        machineId={id}
        isSelected={selectedPresetId === preset.id}
      />
    )
  })
}))
