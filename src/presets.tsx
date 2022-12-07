/** @jsxImportSource minimal-view */

import { once } from 'everyday-utils'
import { Point, Rect } from 'geometrik'
import { BasePreset } from 'abstract-presets'
import { chain, Deps, element, Off, on, view, web } from 'minimal-view'

import { Stretchy } from './stretchy'
import { classes } from './util/classes'
import { fitGrid } from './util/fit-grid'
import { observe } from './util/observe'
import { randomName } from './util/random-name'
import { MachineDetail } from './machine'
import { AppContext, AppPresets } from './app'
import { MonoPresets } from './mono'
import { SchedulerPresets } from './scheduler'
import { bgForHue } from './util/bg-for-hue'

export class Preset<T extends MachineDetail = MachineDetail> extends BasePreset<T> {
  name = randomName()
  hue = (Math.round((Math.random() * 10e4) / 25) * 25) % 360
  constructor(data: Partial<Preset<T>>) {
    // if (Array.isArray(data)) {
    //   super({})

    //   if (Array.isArray(data)) {
    //     Object.assign(this,
    //       Object.fromEntries(
    //         Object.keys(this).map((key, i) =>
    //           [key, data[i]])
    //       ))
    //   }
    // } else {
    super(data)
    Object.assign(this, data)
    // }
  }

  // toJSON() {
  //   return Object.values(this)
  // }

  equals(other?: Preset<any>) {
    if (this === other) return true

    return !other
      || (this.id === other.id
        && this.name === other.name
        && this.hue === other.hue
        && this.isIntent === other.isIntent
        && this.isDraft === other.isDraft
        && this.isRemoved === other.isRemoved
        && this.detail.equals(other.detail))
  }
}

const removers = new Set<Off>()

const PresetView = view(
  class extends Preset {
    app!: AppContext
    machineId!: string
    width!: string
    height!: string
    isSelected!: boolean
  },

  class local { },

  function actions({ $, fn, fns }) {
    let offEvents: Off
    return fns(new class actions {
      maybeRemove = (e: PointerEvent | KeyboardEvent) => {
        if (!(e.shiftKey && (e.ctrlKey || e.metaKey))) {
          removers.forEach((remove) => remove())
          removers.clear()
          offEvents()
        }
      }

      onPointerDown = fn(({ app, machineId, id }) => (e: PointerEvent) => {
        if ($.isRemoved) return

        if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
          app.updatePresetById(machineId, id, { isRemoved: true })

          const remove = () => {
            app.removePresetById(machineId, id)
            offEvents?.()
          }

          removers.add(remove)

          offEvents = once(chain(
            on(((e.target as HTMLElement).getRootNode() as any).host as HTMLElement, 'pointerleave').once(this.maybeRemove),
            on(window, 'keyup').once(this.maybeRemove)
          ))
        } else if (e.buttons & 4) { // middle button
          app.renamePresetRandom(machineId, id, e.altKey)
        } else {
          app.selectPreset(machineId, id, true)
        }
      })

    })
  },

  function effects({ $, fx }) {

    fx(function drawPreset({ app, name, machineId, id, hue, width, height, isSelected, isDraft, isRemoved }) {
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
        onpointerdown={$.onPointerDown}
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
  }
)

PresetView.onInit = (state) => {
  state.name = 'preset'
}

export const PresetsView = web('presets', view(
  class props {
    app!: AppContext
    id!: string
    presets!: MonoPresets & SchedulerPresets & AppPresets
  },

  class local {
    host = element
    size?: Point
    width?: string
    height?: string
    // presetsChecksum?: string
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {

    })
  },

  function effects({ $, fx }) {
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
      user-select: none;
      touch-action: none;

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

    // fx(function calcPresetsChecksum({ presets }) {
    //   $.presetsChecksum = presets.selectedPresetId + presets.items.map(
    //     ({ id, isRemoved, isDraft, hue, name }) =>
    //       `${id}${hue}${name}${isRemoved ? 1 : 0}${isDraft ? 1 : 0}`
    //   ).join()
    // })

    fx(function drawPresets({ app, id, presets, size }) {
      const [w, h] = size
      const total = presets.items.length
      const { cols, rows } = fitGrid(w, h, total)
      const width = 100 / cols + '%'
      const height = 100 / rows + '%'

      const { selectedPresetId } = presets

      function Preset(preset: Preset) {
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

      $.view = [
        ...presets.items.filter((preset) => !preset.isRemoved),
        ...presets.items.filter((preset) => preset.isRemoved)
      ].map(Preset)
    })
  }
))
