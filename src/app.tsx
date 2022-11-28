/** @jsxImportSource minimal-view */

import { Matrix, Point, Rect } from 'geometrik'
import { element, on, queue, State, view, web } from 'minimal-view'

import { BasePresets, PresetsGroupDetail } from 'abstract-presets'
import { EditorScene } from 'canvy'
import { cheapRandomId, debugObjectMethods, pick } from 'everyday-utils'
import { IconSvg } from 'icon-svg'
import { List } from 'immutable-list'
import { SchedulerNode } from 'scheduler-node'

import { AppAudioNode, Audio } from './audio'
import { Button } from './button'
import { AudioMachine, Machine, MachineDetail, MachineKind, MachineState } from './machine'
import { Mono, MonoMachine } from './mono'
import { MonoGroup } from './mono-group'
import { Preset, PresetsView } from './presets'
import { Scheduler, SchedulerMachine } from './scheduler'
import { Slider } from './slider'
import { ancient, emoji, randomName } from './util/random-name'
import { deserialize, serialize } from './util/serialize'
import { Vertical } from './vertical'

export class AppDetail extends PresetsGroupDetail { }

const windowWidth = window.innerWidth

export const HEIGHTS = {
  app: 45,
  mono: 360,
  scheduler: 150
}

const GOLDEN_RATIO = 1.61803398875

export const SPACERS = {
  mono: [0, 1 / GOLDEN_RATIO, (1 - 45 / windowWidth)],
  scheduler: [0, 1 / GOLDEN_RATIO, (1 - 45 / windowWidth)],
}

const defaultMachines: Record<'mono' | 'scheduler', MonoMachine | SchedulerMachine> = {
  mono: new MonoMachine({
    id: 'a',
    kind: 'mono',
    groupId: 'A',
    state: 'init',
    spacer: SPACERS.mono,
    height: HEIGHTS.mono,
  }),
  scheduler: new SchedulerMachine({
    id: 'b',
    kind: 'scheduler',
    groupId: 'A',
    state: 'init',
    spacer: SPACERS.scheduler,
    height: HEIGHTS.scheduler,
    outputs: ['a'],
  })
}

export class AppPresets extends BasePresets<AppDetail, Preset<AppDetail>> {
  constructor(data: Partial<AppPresets> = {}) {
    super(data, Preset, AppDetail)
  }
}

export class AppMethods {
  // core
  declare load: () => void
  declare save: () => void

  // audio
  declare connectNode: (sourceNode: AppAudioNode, targetId: string) => void
  declare disconnectNode: (sourceNode: AppAudioNode, targetId: string) => void
  declare startPlaying: () => void
  declare stopPlaying: () => void

  // machines
  declare getMachineSlider: (id: string, sliderId: string) => Slider
  declare getMachinesInGroup: (groupId: string) => (MonoMachine | SchedulerMachine)[]
  declare removeMachinesInGroup: (groupId: string) => void
  declare setMachineState: (id: string, newState: MachineState) => void

  // presets
  declare getPresetByDetail: <T extends MachineDetail>(id: string, detail: T) => Preset<T> | undefined
  declare insertPreset: <T extends MachineDetail>(id: string, index: number, newDetail: T, isIntent?: boolean) => void
  declare updatePresetById: <T extends Preset>(id: string, presetId: string, data: Partial<T>) => void
  declare removePresetById: (id: string, presetId: string, fallbackPresetId?: string | undefined) => void
  declare setPresetDetailData: <T extends MachineDetail>(id: string, newDetailData: T['data'], bySelect?: boolean, byIntent?: boolean) => Preset<T>
  declare selectPreset: <T extends MachineDetail>(id: string, presetId: string | false, byClick?: boolean | undefined, newDetail?: T | undefined, byGroup?: boolean | undefined) => void
  declare renamePresetRandom: (id: string, presetId: string, useEmoji?: boolean | undefined) => void
  declare savePreset: (id: string, presetId: string) => void

  // misc
  declare setSpacer: (id: string, cells: number[]) => void
  declare setVertical: (id: string, height: number) => void

  constructor(state: State<AppLocal>) {
    const { $ } = state

    // const migrate = (machine: Machine) => {
    //   for (const preset of machine.presets.items) {
    //     // preset.isRemoved = false
    //     // if (Array.isArray(preset.detail)) {
    //     //   for (const p of preset.detail) {
    //     //     p[2] = new Detail(p[2])
    //     //   }
    //     // }
    //     // preset.detail = new Detail(preset.detail)
    //   }
    //   return machine
    // }

    this.load = () => {
      const machines: any[] = [];

      const machineIds = (localStorage.machines ?? '').split(',').filter(Boolean)

      machineIds.forEach((id: string) => {
        try {
          const machineJson = JSON.parse(localStorage[`machine_${id}`])
          const machine = deserialize(machineJson)
          machines.push(machine)
          if (id === 'app') {
            $.app = machine as AppMachine
          }
        } catch (error) {
          console.warn('Failed to load machine with id', id)
          console.warn(error)
        }
      })

      if (!machines.length) {
        machines.push(
          $.app,
          defaultMachines.mono.copy(),
          defaultMachines.scheduler.copy(),
        )
      }

      $.machines = new List({ items: machines })
    }

    this.save = () => {
      localStorage.machines = $.machines.items.map((x) => x.id!)
      for (const m of $.machines.items) {
        localStorage[`machine_${m.id}`] = JSON.stringify(serialize(m))
      }
    }

    this.connectNode = (sourceNode, targetId) => {
      const targetNode = $.audioNodes.get(targetId)
      if (!targetNode) {
        throw new Error('No target audio node found with id: ' + targetId)
      }
      sourceNode.connect(targetNode as any)
      const off = on(targetNode, 'suspend' as never)(() => {
        sourceNode.disconnect(targetNode as any)
        on(targetNode, 'resume' as never).once(() => {
          sourceNode.connect(targetNode as any)
        })
      })
      return () => {
        try {
          sourceNode.disconnect(targetNode as any)
        } catch (error) {
          console.warn(error)
        }
        off()
      }
    }

    this.disconnectNode = (sourceNode, targetId) => {
      const targetNode = $.audioNodes.get(targetId)
      if (!targetNode) {
        throw new Error('No target audio node found with id: ' + targetId)
      }
      try {
        sourceNode.disconnect(targetNode as any)
      } catch (error) {
        console.warn(error)
      }
    }

    this.startPlaying = () => {
      $.machines.items
        .filter((machine) =>
          // @ts-ignore
          'methods' in machine && 'start' in machine.methods)
        .forEach(({ methods: { start } }: any) => start())
    }

    this.stopPlaying = () => {
      $.machines.items
        .filter((machine) =>
          // @ts-ignore
          'methods' in machine && 'stop' in machine.methods)
        .forEach(({ methods: { stop } }: any) => stop())
    }

    this.getMachineSlider = (id, sliderId) => {
      const machine = $.machines.getById<MonoMachine>(id)
      const preset = machine.presets.selectedPreset
      const slider = preset?.detail.data.sliders?.get(sliderId)

      if (!slider) {
        throw new Error(`Slider not found "${id}" in machine "${id}"`)
      }

      return slider
    }

    this.removeMachinesInGroup = (groupId) => {
      $.machines = new List({
        items: $.machines.items.filter((machine) =>
          'groupId' in machine && machine.groupId !== groupId
        )
      })
    }

    this.getMachinesInGroup = (groupId) =>
      $.machines.items.filter((machine) =>
        'groupId' in machine && machine.groupId === groupId
      ) as (MonoMachine | SchedulerMachine)[]

    this.setMachineState = (id, state) => {
      queueMicrotask(() => {
        $.machines = $.machines.updateById(id, { state })
      })
    }

    this.getPresetByDetail = (id, detail) => {
      return $.machines.getById(id).presets.getByDetail(detail)
    }

    this.updatePresetById = (id, presetId, data) => {
      $.machines = $.machines.updateById(id, {
        presets: $.machines.getById(id)
          .presets.updateById(presetId, data)
      })
    }

    this.renamePresetRandom = (id, presetId, useEmoji) => {
      this.updatePresetById(id, presetId, {
        hue: (Math.round((Math.random() * 10e4) / 25) * 25) % 360,
        name: randomName(useEmoji ? emoji : ancient)
      })
    }

    this.savePreset = (id, presetId) => {
      $.machines = $.machines.updateById(id, {
        presets: $.machines.getById(id)
          .presets.savePreset(presetId)
      })
    }

    this.removePresetById = (id, presetId, fallbackPresetId) => {
      const machine = $.machines.getById(id)

      try {
        $.machines = $.machines.updateById(id, {
          presets: machine.presets.removeById(presetId, fallbackPresetId)
        })
      } catch (error) {
        console.warn(error)
      }
    }

    this.insertPreset = (id, index, newDetail, isIntent = false) => {
      const machine = $.machines.getById(id)

      const newPreset = machine.presets.createWithDetail(newDetail, { isIntent })

      $.machines = $.machines.updateById(id, {
        presets: machine.presets
          .insertAfterIndex(index, newPreset)
          .selectPreset(newPreset.id)
      })
    }

    this.selectPreset = (id, presetId, byClick, newDetail) => {
      const machine = $.machines.getById(id)
      $.machines = $.machines.updateById(id, {
        presets: machine.presets.selectPreset(presetId, byClick, newDetail)
      })
    }

    this.setPresetDetailData = (id, newDetailData, bySelect, byIntent) => {
      const machine = $.machines.getById(id)

      const presets = machine.presets
        .setDetailData(newDetailData, bySelect, byIntent)

      $.machines = $.machines.updateById(id, {
        presets
      })

      return presets.selectedPreset!
    }

    this.setSpacer = (id, spacer) => {
      $.machines = $.machines.updateById(id, { spacer })
    }

    this.setVertical = (id, height) => {
      $.machines = $.machines.updateById(id, { height })
    }

    debugObjectMethods(this)

    return this
  }
}

export class AppMachine extends Machine<AppPresets>  {
  id = 'app'
  kind: MachineKind = 'app'
  height = HEIGHTS['app']
  presets = new AppPresets()

  methods!: AppMethods

  constructor(data: Partial<AppMachine> = {}) {
    super(data)
    Object.assign(this, data)
  }

  toJSON(): any {
    return pick(this, [
      'id',
      'kind',
      'height',
      'presets',
    ])
  }
}

export class AppLocal {
  host = element
  rect = new Rect()
  items: any[] = []
  itemsView: JSX.Element = false

  app = new AppMachine()
  state!: AppMachine['state']
  presets!: AppMachine['presets']
  height!: AppMachine['height']
  methods!: AppMethods

  preset: Preset<AppDetail> | false = false

  // machines
  machines!: List<Machine | AudioMachine<any>>

  Machines = {
    app: () => { },
    mono: Mono,
    scheduler: Scheduler,
  }

  // audio
  audioContext = new AudioContext({ sampleRate: 44100, latencyHint: 0.04 })
  audioNodes = new Map<string, AppAudioNode>()
  analyserNodes = new Map<string, AnalyserNode>()
  schedulerNode?: SchedulerNode
  startTime?: number
  fftSize = 32
  audio?: Audio

  sources?: any

  // editor
  editorScene: EditorScene = new EditorScene({
    layout: {
      viewMatrix: new Matrix,
      state: {
        isIdle: true
      },
      viewFrameNormalRect: new Rect(0, 0, 10000, 10000),
      pos: new Point(0, 0)
    }
  })
}

export const AppView = web('app', view(class props { }, AppLocal, ({ $, fx, fn }) => {
  $.css = /*css*/`
  & {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    background: #000;
    min-height: 100%;
    padding-bottom: 65vh;
  }

  [part=header] {
    position: sticky;
    top: 0;
    z-index: 99999;
    background: #001d;
    width: 100%;
  }

  [part=main-controls] {
    z-index: 99999999999;
    position: fixed;
    bottom: 50px;
    right: 50px;
    display: flex;
    padding: 8px 25px;
    justify-content: space-between;
    background: #112;
    border-radius: 100px;
    border: 3px solid #fff;
    box-shadow: 3px 3px 0 6px #000;
    ${Button} {
      cursor: pointer;
    }
  }

  [part=items] {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    max-width: max(900px, calc(1vw - 50px));
  }

  [part=item] {
    position: relative;
    max-width: max(900px, calc(1vw - 50px));
  }

  [part=add] {
    margin: 7px;
    display: flex;
    justify-content: center;
    ${Button} {
      cursor: pointer;
      opacity: 0.35;
      color: #667;
      &:hover {
        opacity: 1;
      }
    }
  }
  `

  $.methods = new AppMethods($.self)

  fx(() => {
    on(document.body, 'pointerdown')(function resumeAudio() {
      if ($.audioContext.state !== 'running') {
        console.log('resuming audio')
        $.audioContext.resume()
      }
    })

    $.methods.load()

    $.methods.setMachineState('app', 'ready')

    const saveBtn = document.createElement('button')

    Object.assign(saveBtn.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '99999999999'
    })

    saveBtn.textContent = 'save'

    saveBtn.onclick = () => {
      $.methods.save()
      console.log('saved')
    }

    document.body.appendChild(saveBtn)
  })

  fx(({ machines }) => {
    $.sources = getSources()
    const app = machines.getById('app') as AppMachine
    if (!app.equals($.app)) {
      $.app = app
    }
  })

  fx(({ app }) => {
    app.methods = $.methods
    $.state = app.state
    $.height = app.height
    $.presets = app.presets
  })

  fx(({ presets }) => {
    const preset = presets.selectedPreset
    if (preset) {
      $.preset = preset
    }
  })

  const getSources = () => {
    return new Map($.machines.items.filter((machine) => machine.kind !== 'app').map((machine) =>
      [machine.id, machine.presets] as const
    ))
  }

  fx(({ state, sources }) => {
    if (state === 'init') return

    if (!$.preset) {
      $.preset = new Preset({
        detail: new AppDetail({
          sources,
          details: []
        })
      })
    }

    const newDetail = $.preset.detail.collectData($.sources)

    if ($.preset && newDetail.equals($.preset.detail)) return

    $.preset = $.methods.setPresetDetailData('app', newDetail.data)
  })

  const offPresetsFx = fx(({ presets }) => {
    offPresetsFx()
    presets.on('select', (
      next,
      prev,
      _x,
      _y,
      byClick
    ) => {
      if (byClick && next) {
        let sources = getSources()

        const detail = next.detail.merge({ ...next.detail.data, sources })

        sources = detail.applyData(detail.data) as any

        if (sources && $.preset) {
          let machines = $.machines

          sources.forEach((presets, key) => {
            if (machines.hasId(key)) {
              machines = machines.updateById(key, { presets })
            }
          })

          $.sources = getSources()
          $.preset = presets.createWithDetailData(({ ...next.detail.data, sources: $.sources }))
          $.machines = machines
        }
      }
    })
  })

  fx(() => {
    const resize = queue.raf(() => {
      const rect = $.rect.clone()
      rect.width = window.innerWidth
      rect.height = window.innerHeight
      $.rect = rect
    })
    resize()
    return on(window, 'resize')(resize)
  })

  fx(({ host, rect }) => {
    host.style.width = rect.width + 'px'
  })

  fx(async ({ audioContext }) => {
    $.schedulerNode = await SchedulerNode.create(audioContext)
    $.startTime = await $.schedulerNode.start()
    // monoNode?.worklet.setTimeToSuspend(Infinity)
  })

  fx(({ audioContext, audioNodes, fftSize, schedulerNode }) => {
    $.audio = new Audio({
      audioContext,
      audioNodes,
      fftSize,
      schedulerNode,
    })
  })

  fx(({ state, audio, machines }) => {
    if (state === 'init') return

    const itemsView: any[] = []

    let mono: MonoMachine | undefined
    let scheduler: SchedulerMachine | undefined

    for (const machine of machines.items) {
      if (machine.kind === 'app') continue
      if (machine.kind === 'mono') mono = machine as any
      if (machine.kind === 'scheduler') scheduler = machine as any

      if (mono && scheduler) {
        itemsView.push(
          <MonoGroup
            part="item"
            // key={mono.groupId}
            app={$}
            audio={audio}
            mono={mono}
            scheduler={scheduler}
          />
        )
        mono = scheduler = void 0
      }
    }

    $.itemsView = itemsView
  })

  fx(({ machines, itemsView, state, presets, height }) => {
    if (state === 'init') return

    const playing = machines.items.filter((machine) => machine.kind === 'mono' && machine.state === 'running').length

    // {/* <div>
    //     <Button onClick={() => { }}>
    //       <IconSvg class="small" set="feather" icon="minimize-2" />
    //     </Button>
    //     <Button onClick={() => { }}>
    //       <IconSvg class="small" set="feather" icon="maximize-2" />
    //     </Button>
    //   </div> */}
    $.view = <>
      <div part="main-controls">
        <Button onClick={playing ? $.methods.stopPlaying : $.methods.startPlaying}>
          <IconSvg class="small" set="feather" icon={playing ? 'pause' : 'play'} />
        </Button>
        <Button onClick={() => { }}>
          <IconSvg class="small" set="feather" icon="more-vertical" />
        </Button>
      </div>

      <div part="header">
        <PresetsView app={$} id="app" presets={presets.items as Preset<AppDetail>[]} selectedPresetId={presets.selectedPresetId} />
        <Vertical app={$} id="app" height={height} fixed minHeight={45} />
      </div>
      <div part="items">
        {itemsView}
      </div>
      <div part="add">
        <Button onClick={() => {
          const a = cheapRandomId()
          const b = cheapRandomId()
          const groupId = cheapRandomId()

          $.machines = $.machines
            .add(new MonoMachine({
              ...defaultMachines.mono,
              id: a,
              groupId
            }))
            .add(new SchedulerMachine({
              ...defaultMachines.scheduler,
              id: b,
              groupId,
              outputs: [a]
            }))
        }}>
          <IconSvg class="small" set="feather" icon="plus-circle" />
        </Button>
      </div>
    </>
  })
}))
