/** @jsxImportSource minimal-view */

import { web, view, element, on } from 'minimal-view'
import { Matrix, Point, Rect } from 'geometrik'

import { EditorScene } from 'canvy'
import { MonoNode } from 'mono-worklet'
import { SchedulerEventGroupNode, SchedulerNode } from 'scheduler-node'

import { Button, Vertical, Machine, Mono, Scheduler, Presets, Preset } from './components'
import { cheapRandomId, isEqual } from 'everyday-utils'
import { randomName } from './util/random-name'
import { MachineData } from './machine-data'

export type AppAudioNode = AudioNode | SchedulerNode | SchedulerEventGroupNode

export interface App {
  // main
  load: () => void
  save: () => void

  // audio
  connectNode: (sourceNode: AppAudioNode, targetId: string) => void
  disconnectNode: (sourceNode: AppAudioNode, targetId: string) => void
  // machines
  addMachine: (data: MachineData) => void
  getMachine: (id: string) => MachineData
  setMachineDetail: (id: string, newDetail: any, byClick?: boolean) => void,
  // presets
  getPresetById: (id: string, presetId: string) => Preset | undefined,
  getPresetByDetail: (id: string, detail: any) => Preset | undefined
  removePresetById: (id: string, presetId: string) => void
  setPresets: (id: string, presets: Preset[], newDetail?: any) => void,
  setPresetDetail: (id: string, presetId: string, newDetail: any) => void,
  selectOrCreatePreset: (id: string, newDetail: any, isIntent?: boolean) => void
  selectPreset: (id: string, presetId: string, byClick?: boolean) => void
  savePreset: (id: string, presetId: string) => void
  onDetailChange: (id: string, newDetail: any, isIntent?: boolean) => void,

  setSpacer: (id: string, cells: number[]) => void
  setVertical: (id: string, height: number) => void
}

const windowWidth = window.innerWidth

const HEIGHTS = {
  app: 45,
  mono: 240,
  scheduler: 150
}

const defaultMachines: Record<'mono' | 'scheduler', MachineData> = {
  mono: {
    id: 'a',
    kind: 'mono',
    spacer: [0, 0.35, (1 - 45 / windowWidth)],
    detail: false,
    height: HEIGHTS['mono'],
    presets: [],
    outputs: []
  },
  scheduler: {
    id: 'b',
    kind: 'scheduler',
    spacer: [0, 0.35, (1 - 45 / windowWidth)],
    detail: false,
    height: HEIGHTS['scheduler'],
    presets: [],
    outputs: ['a']
  }
}


export const App = web('app', view(
  class props { }, class local {
  host = element
  rect = new Rect()

  state: 'init' | 'ready' = 'init'

  app?: App

  detail: [string, string, any][] = []
  presets: Preset[] = []
  height = HEIGHTS['app']
  machines: MachineData[] = [
    { ...defaultMachines.mono },
    { ...defaultMachines.scheduler },
  ]

  Machines = {
    app: () => { },
    mono: Mono,
    scheduler: Scheduler,
  }

  audioContext = new AudioContext({ sampleRate: 44100, latencyHint: 0.04 })
  audioNodes = new Map<string, AudioNode>()
  schedulerNode?: SchedulerNode
  startTime?: number

  items: any[] = []
  itemsView: JSX.Element = false

  editorScene = new EditorScene({
    layout: {
      viewMatrix: new Matrix,
      state: {
        isIdle: true
      },
      viewFrameNormalRect: new Rect(0, 0, 10000, 10000),
      pos: new Point(0, 0)
    }
  })
}, ({ $, fx, fn }) => {
  $.css = /*css*/`
  & {
    display: flex;
    flex-flow: column wrap;
    background: #000;
  }
  `

  fx(() => {
    $.app = {
      load: () => {
        const machines: any[] = [];

        try {
          // this assigns { detail, presets }
          Object.assign($, JSON.parse(localStorage.app))
        } catch (error) {
          console.warn('Failed to load app data.')
          console.warn(error)
        }

        (localStorage.machines ?? '').split(',').filter(Boolean).forEach((id: string) => {
          try {
            const m = JSON.parse(localStorage[`machine_${id}`])
            machines.push(m)
          } catch (error) {
            console.warn('Failed to load machine with id', id)
            console.warn(error)
          }
        })

        if (machines.length) {
          $.machines = machines
        }

        $.state = 'ready'
      },

      save: () => {
        localStorage.app = JSON.stringify({
          detail: $.detail,
          presets: $.presets,
          height: $.height,
        })
        localStorage.machines = $.machines.map((x) => x.id!)
        for (const m of $.machines) {
          localStorage[`machine_${m.id}`] = JSON.stringify(m)
        }
      },

      connectNode: fn(({ audioNodes }) => (sourceNode, targetId) => {
        const targetNode = audioNodes.get(targetId)
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
      }),

      disconnectNode: fn(({ audioNodes }) => (sourceNode, targetId) => {
        const targetNode = audioNodes.get(targetId)
        if (!targetNode) {
          throw new Error('No target audio node found with id: ' + targetId)
        }
        try {
          sourceNode.disconnect(targetNode as any)
        } catch (error) {
          console.warn(error)
        }
      }),

      addMachine: fn(() => (machineData) => {
        $.machines = [...$.machines, machineData]
      }),

      getMachine: fn(() => (id) => {
        const machine = id === 'app' ? $ as unknown as MachineData : $.machines.find((machine) => machine.id === id)
        if (!machine) {
          throw new Error('Machine not found with id: ' + id)
        }
        return machine
      }),

      getPresetByDetail: fn(({ app }) => (id, detail) => {
        const machine = app.getMachine(id)
        return machine.presets
          .find((preset) =>
            isEqual(preset.detail, machine.detail))

      }),

      getPresetById: fn(({ app }) => (id, presetId) => {
        const machine = app.getMachine(id)
        return machine.presets
          .find((preset) =>
            preset.id === presetId)

      }),

      savePreset: fn(({ app }) => (id, presetId) => {
        const machine = app.getMachine(id)

        const newPresets = machine.presets.map((preset) => {
          if (preset.id === presetId) {
            return {
              ...preset,
              isDraft: false
            }
          }

          return preset
        })

        app.setPresets(id, newPresets)
      }),

      removePresetById: fn(({ app }) => (id: string, presetId: string) => {
        const machine = app.getMachine(id)

        const newPresets = machine.presets.filter((preset) => {
          if (preset.id === presetId) {
            return false
          }

          return preset
        })

        app.setPresets(id, newPresets)
      }),

      selectPreset: fn(({ app }) => (id, presetId, byClick = false) => {
        const machine = app.getMachine(id)
        const preset = app.getPresetById(id, presetId)

        if (!preset) {
          throw new Error(`Machine "${id}" does not have a preset with id: "${presetId}"`)
        }

        if (byClick) machine.presets.forEach((preset) => {
          preset.isIntent = true
        })

        app.setMachineDetail(id, preset.detail, byClick)
      }),

      selectOrCreatePreset: fn(({ app }) => (id, newDetail, isIntent = true) => {
        const machine = app.getMachine(id)

        const { presets } = machine

        for (const preset of presets) {
          if (isEqual(preset.detail, newDetail)) {
            if (isEqual(machine.detail, newDetail)) return

            for (const preset of presets) {
              if (preset.isDraft && !preset.isIntent) {
                app.removePresetById(id, preset.id)
                break
              }
            }

            app.setMachineDetail(id, newDetail)
            return
          }
        }

        const current = app.getPresetByDetail(id, machine.detail)

        if (current?.isDraft) {
          app.setPresetDetail(id, current.id, newDetail)
          return
        }

        const hue = (Math.round((Math.random() * 10e4) / 25) * 25) % 360
        const newPreset = {
          id: cheapRandomId(),
          name: randomName(),
          hue, //`hsl(${hue}, 85%, 65%)`,
          detail: newDetail,
          isIntent: false,
          isDraft: true
        }

        const index = machine.presets!.indexOf(current!)

        let newPresets: Preset[]

        if (index >= 0) {
          newPresets = [...machine.presets!]
          if (index === newPresets.length - 1) {
            newPresets.push(newPreset)
          } else {
            newPresets.splice(index + 1, 0, newPreset)
          }
        } else {
          newPresets = [...machine.presets!, newPreset]
        }

        app.setPresets(id, newPresets, newDetail)
      }),

      setPresets: fn(({ app }) => (id, newPresets, newDetail?: any) => {
        if (id === 'app') {
          if (newDetail) {
            $.detail = newDetail
          }
          $.presets = newPresets
          return
        }

        app.getMachine(id) // ensure id

        $.machines = $.machines.map((machine) => {
          if (machine.id === id) {
            const detail = newDetail ?? machine.detail
            return {
              ...machine,
              detail,
              presets: newPresets
            }
          }
          return machine
        })
      }),

      setPresetDetail: fn(({ app }) => (id, presetId, newDetail) => {
        const machine = app.getMachine(id)
        const preset = app.getPresetById(id, presetId)
        if (!preset) {
          throw new Error(`Machine "${id}" does not have a preset with id: "${presetId}"`)
        }

        if (preset.detail === newDetail) return

        const newPresets = machine.presets.map((preset) => {
          if (preset.id === presetId) {
            if (preset.detail === newDetail) return preset
            return {
              ...preset,
              detail: newDetail
            }
          }
          return preset
        })

        app.setPresets(id, newPresets, newDetail)
      }),

      setMachineDetail: fn(({ app }) => (id: string, newDetail: any, byClick = false) => {
        const machine = app.getMachine(id)
        if (!byClick && machine.detail === newDetail) return

        if (byClick) {
          newDetail = Array.isArray(newDetail) ? [...newDetail] : { ...newDetail }
        }

        if (id === 'app') {
          $.detail = newDetail
          return
        }

        $.machines = $.machines.map((machine) => {
          if (machine.id === id) {
            if (machine.detail === newDetail) return machine
            return {
              ...machine,
              detail: newDetail
            }
          }
          return machine
        })
      }),

      onDetailChange: fn(({ app }) => (id, detail, isIntent = true) => {
        app.selectOrCreatePreset(id, detail, isIntent)
      }),

      setSpacer: fn(({ app }) => (id, spacer) => {
        $.machines = $.machines.map((machine) => {
          if (machine.id === id) {
            if (machine.spacer.join() === spacer.join()) return machine
            return {
              ...machine,
              spacer,
            }
          }
          return machine
        })
      }),

      setVertical: fn(({ app }) => (id, height) => {
        if (id === 'app') {
          $.height = height
          return
        }

        $.machines = $.machines.map((machine) => {
          if (machine.id === id) {
            if (machine.height === height) return machine
            return {
              ...machine,
              height,
            }
          }
          return machine
        })
      })
    }

    $.app.load()
  })

  fx.debounce(200)(({ app, state, machines, height, presets, detail }) => {
    if (state === 'init') return
    app.save()
    console.log('saved')
  })

  fx(({ app, state, detail }) => {
    if (state === 'init') return
    detail.forEach(([id, , detail]) => {
      app.onDetailChange(id, detail)
    })
  })


  fx(({ app, state, machines }) => {
    if (state === 'init') return
    const detail = machines
      .filter((machine) => machine.detail)
      .map((x) =>
        [x.id, x.kind, x.detail] as const)
    app.onDetailChange('app', detail, false)
  })

  fx(() => {
    const resize = () => {
      const rect = $.rect.clone()
      rect.width = window.innerWidth
      rect.height = window.innerHeight
      $.rect = rect
    }
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

  fx(async ({ app, state, audioContext, schedulerNode, editorScene, Machines, machines, audioNodes }) => {
    if (state === 'init') return

    const itemsView: any[] = []

    for (const machine of machines) {
      let audioNode = audioNodes.get(machine.id!)

      if (!audioNode) {
        if (machine.kind === 'mono') {
          audioNode = await MonoNode.create(audioContext, {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            processorOptions: {
              metrics: 0,
            },
          })
          audioNodes.set(machine.id, audioNode)
        }
      }

      itemsView.push(<>
        <Machine
          app={app}
          {...machine}
          Machines={Machines}
          audioNode={audioNode || false}
          audioContext={audioContext}
          schedulerNode={schedulerNode}
          editorScene={editorScene}
        />
        <Vertical app={app} id={machine.id} height={machine.height ?? HEIGHTS[machine.kind]} />
      </>)
    }

    $.itemsView = itemsView
  })

  fx(({ app, state, itemsView, detail, presets, height }) => {
    if (state === 'init') return
    $.view = <>
      <Presets app={app} id="app" detail={detail} presets={presets} style="position:sticky;top:0;z-index:2;background:#000a" />
      <Vertical app={app} id="app" height={height} />
      {itemsView}
      <Button onClick={() => {
        const a = cheapRandomId()
        const b = cheapRandomId()

        app.addMachine({
          ...defaultMachines.mono,
          id: a
        })

        app.addMachine({
          ...defaultMachines.scheduler,
          id: b,
          outputs: [a]
        })

      }}>Add one</Button>
    </>
  })
}))
