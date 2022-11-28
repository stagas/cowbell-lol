/** @jsxImportSource minimal-view */

import { memoize, once } from 'everyday-utils'
import { Point, Rect } from 'geometrik'
import { BasePreset } from 'abstract-presets'
import { chain, Deps, element, Off, on, view, web } from 'minimal-view'

import { Stretchy } from './stretchy'
import { classes } from './util/classes'
import { fitGrid } from './util/fit-grid'
import { observe } from './util/observe'
import { randomName } from './util/random-name'
import { MachineDetail } from './machine'
import { AppLocal } from './app'

export class Preset<T extends MachineDetail = MachineDetail> extends BasePreset<T> {
  name = randomName()
  hue = (Math.round((Math.random() * 10e4) / 25) * 25) % 360
  constructor(data: Partial<Preset<T>>) {
    super(data)
    Object.assign(this, data)
  }
}

const bgForHue = memoize((hue: number) => {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" preserveAspectRatio="xMidYMid meet">\
  <circle cx="22.5" cy="22.5" r="20" fill="hsl(${(hue + 45) % 360}, 75%, 20%)" />\
  <circle cx="67.5" cy="67.5" r="20" fill="hsl(${(hue + 45) % 360}, 75%, 20%)" />\
  " /></svg>')`
})

const removers = new Set<Off>()

const PresetView = view(class extends Preset {
  app!: AppLocal
  machineId!: string
  width!: string
  height!: string
  isSelected!: boolean
}, class local {
}, ({ $, fx, fn }) => {
  let offEvents: Off

  const maybeRemove = (e: PointerEvent | KeyboardEvent) => {
    if (!(e.shiftKey && (e.ctrlKey || e.metaKey))) {
      removers.forEach((remove) => remove())
      removers.clear()
      offEvents()
    }
  }

  const onPointerDown = fn(({ app, machineId, id }) => function onPresetPointerDown(e: PointerEvent) {
    if ($.isRemoved) return

    if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
      app.methods.updatePresetById(machineId, id, { isRemoved: true })

      const remove = () => {
        app.methods.removePresetById(machineId, id)
        offEvents?.()
      }

      removers.add(remove)

      offEvents = once(chain(
        on(((e.target as HTMLElement).getRootNode() as any).host as HTMLElement, 'pointerleave').once(maybeRemove),
        on(window, 'keyup').once(maybeRemove)
      ))
    } else if (e.buttons & 4) { // middle button
      app.methods.renamePresetRandom(machineId, id, e.altKey)
    } else {
      app.methods.selectPreset(machineId, id, true)
    }
  })

  fx(({ app, name, machineId, id, hue, width, height, isSelected, isDraft, isRemoved }) => {
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
          ['removed']: isRemoved,
          ['draft']: isDraft
        })
      }
      onpointerdown={onPointerDown}
      ondblclick={(e) => {
        // removing so cancel dblclick
        if (e.shiftKey && (e.ctrlKey || e.metaKey)) return
        // renaming so cancel dblclick
        if (e.buttons & 4) return

        app.methods.savePreset(machineId, id)
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

export const PresetsView = web('presets', view(
  class props {
    app!: AppLocal
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
    flex-direction: column;
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

    &.removed {
      visibility: hidden;
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

  // fx(({ presets }) => {
  //   $.presetsLength = presets.length
  // })

  // fx(({ presetsLength, size }) => {
  //   const [w, h] = size
  //   const total = presetsLength
  //   const { cols, rows } = fitGrid(w, h, total)
  //   $.width = 100 / cols + '%'
  //   $.height = 100 / rows + '%'
  // })

  fx(({ app, id, presets, selectedPresetId, size }) => {
    const [w, h] = size
    const total = presets.length
    const { cols, rows } = fitGrid(w, h, total)
    const width = 100 / cols + '%'
    const height = 100 / rows + '%'
    // console.log(cols, rows, width, height)

    const Preset = (preset: Preset) => {
      return <PresetView
        key={preset.id}
        {...preset as Deps<Preset>}
        part="preset"
        app={app}
        width={width}
        height={height}
        machineId={id}
        isSelected={selectedPresetId === preset.id}
      />
    }

    $.view = presets
      .filter((preset) => !preset.isRemoved)
      .concat(presets.filter((preset) => preset.isRemoved))
      .map(Preset)
  })
}))
