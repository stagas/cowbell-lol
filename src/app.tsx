/** @jsxImportSource minimal-view */

import { Matrix, Point, Rect } from 'geometrik'
import { element, on, queue, State, view, web } from 'minimal-view'

import { EditorScene } from 'canvy'
import { cheapRandomId, isEqual, pick } from 'everyday-utils'
import { IconSvg } from 'icon-svg'
import { deobjectify, objectify } from 'json-objectify'
import { SchedulerEventGroupNode, SchedulerNode } from 'scheduler-node'
import { replacer, reviver } from 'serialize-whatever'

import { Button } from './button'
import { MachineData, MachineKind, MachineState } from './machine-data'
import { Mono, MonoDetail } from './mono'
import { MonoGroup } from './mono-group'
import { Preset, Presets } from './presets'
import { Scheduler, SchedulerDetail } from './scheduler'
import { SliderParam } from './slider'
import { copySliders, removeSliderArgsFromCode } from './util/args'
import { Detail, ItemDetail } from './util/detail'
import { List } from './util/list'
import { ancient, emoji, randomName } from './util/random-name'
import { Vertical } from './vertical'

export interface AppAudio {
  audioContext: AudioContext
  audioNodes: Map<string, AudioNode>
  fftSize: number
  schedulerNode: SchedulerNode
}

const parseArgsRegExp = /'(?<id>\w+)\s*?\[.+\]\s*?=\s*(?<value>[.0-9kKf]+)/gi

export const deserialize = (json: unknown) => {
  const Classes: any[] = [
    List,
    Detail,
  ]

  return deobjectify(json, reviver(Classes))
}

export const serialize = (json: unknown) => objectify(json, replacer(json))

export type AppAudioNode = AudioNode | SchedulerNode | SchedulerEventGroupNode

const windowWidth = window.innerWidth

export const HEIGHTS = {
  app: 45,
  mono: 360,
  scheduler: 150
}

const defaultMachines: Record<'mono' | 'scheduler', MachineData> = {
  mono: new MachineData({
    id: 'a',
    kind: 'mono',
    groupId: 'A',
    state: 'init',
    spacer: [0, 0.35, (1 - 45 / windowWidth)],
    height: HEIGHTS.mono,
  }),
  scheduler: new MachineData({
    id: 'b',
    kind: 'scheduler',
    groupId: 'A',
    state: 'init',
    spacer: [0, 0.35, (1 - 45 / windowWidth)],
    height: HEIGHTS.scheduler,
    outputs: ['a'],
  })
}

export class App {
  // app machine
  appMachine: MachineData<AppDetail> = new MachineData<AppDetail>({
    id: 'app',
    kind: 'app',
    height: HEIGHTS['app']
  })

  // machines
  machines: List<MachineData<ItemDetail>> = new List([
    { ...defaultMachines.mono },
    { ...defaultMachines.scheduler },
  ])

  Machines = {
    app: () => { },
    mono: Mono,
    scheduler: Scheduler,
  }

  // audio
  audioContext = new AudioContext({ sampleRate: 44100, latencyHint: 0.04 })
  audioNodes = new Map<string, AudioNode>()
  analyserNodes = new Map<string, AnalyserNode>()
  schedulerNode?: SchedulerNode
  startTime?: number
  fftSize = 32
  audio?: AppAudio

  // editor
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

  // core
  load: () => void
  save: () => void

  // audio
  connectNode: (sourceNode: AppAudioNode, targetId: string) => void
  disconnectNode: (sourceNode: AppAudioNode, targetId: string) => void
  startPlaying: () => void
  stopPlaying: () => void

  // machines
  getMachineSlider: (id: string, sliderId: string) => SliderParam
  getMachinesInGroup: (groupId: string) => MachineData[]
  removeMachinesInGroup: (groupId: string) => void
  setMachineState: (id: string, newState: MachineState) => void
  setMachineControls: (id: string, controls: Partial<MachineData>) => void

  // presets
  getPresetByDetail: (id: string, detail: Detail<ItemDetail>) => Preset<any> | undefined
  insertPreset: (id: string, index: number, newDetail: Detail<ItemDetail>, isIntent?: boolean) => void
  updatePresetById: (id: string, presetId: string, data: Partial<Preset>) => void
  removePresetById: (id: string, presetId: string, fallbackPresetId?: string | undefined) => void
  setPresetDetailData: (id: string, newDetailData: Partial<Detail<ItemDetail>['data']>, bySelect?: boolean | undefined, byGroup?: boolean | undefined) => void
  selectPreset: (id: string, presetId: string | false, byClick?: boolean | undefined, newDetail?: Detail<ItemDetail> | undefined, byGroup?: boolean | undefined) => void
  renamePresetRandom: (id: string, presetId: string, useEmoji?: boolean | undefined) => void
  savePreset: (id: string, presetId: string) => void

  // misc
  setSpacer: (id: string, cells: number[]) => void
  setVertical: (id: string, height: number) => void

  constructor(state: State<App>) {
    const { $ } = state

    const migrate = <T extends ItemDetail>(machine: MachineData<T>) => {
      for (const preset of machine.presets.items) {
        preset.isRemoved = false
        if (Array.isArray(preset.detail)) {
          for (const p of preset.detail) {
            p[2] = new Detail(p[2])
          }
        }
        preset.detail = new Detail(preset.detail)
      }
      return machine
    }

    this.load = () => {
      const machines: any[] = [];

      try {
        const json = JSON.parse(localStorage.app)
        const app = new MachineData<AppDetail>({
          id: 'app',
          kind: 'app',
          ...deserialize(json) as any
        })
        $.appMachine = migrate(app)
      } catch (error) {
        console.warn('Failed to load app data.')
        console.warn(error)
      }

      // let gid = 0;

      (localStorage.machines ?? '').split(',').filter(Boolean).forEach((id: string) => {
        try {
          const m = JSON.parse(localStorage[`machine_${id}`])
          machines.push(migrate(new MachineData(deserialize(m) as MachineData)))
        } catch (error) {
          console.warn('Failed to load machine with id', id)
          console.warn(error)
        }
      })

      if (machines.length) {
        $.machines = new List(machines)
      }
    }

    this.save = () => {
      localStorage.app = JSON.stringify(serialize(
        pick($.appMachine, [
          'id',
          'kind',
          'presets',
          'selectedPresetId',
          'height',
        ])
      ))

      localStorage.machines = $.machines.items.map((x) => x.id!).filter((id) => id !== 'app')

      for (const m of $.machines.items) {
        if (m.id === 'app') continue

        localStorage[`machine_${m.id}`] = JSON.stringify(
          serialize(
            Object.assign(pick(m, [
              'id',
              'groupId',
              'kind',
              'state',
              'outputs',
              'presets',
              'selectedPresetId',
              'spacer',
              'height',
            ])))
        )
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
      $.machines.items.forEach(({ start }) => start?.())
    }

    this.stopPlaying = () => {
      $.machines.items.forEach(({ stop }) => stop?.())
    }

    this.getMachineSlider = (id, sliderId) => {
      const machine = $.machines.getById(id) as MachineData<MonoDetail>

      const preset = machine.presets.getById(machine.selectedPresetId)

      const slider = preset.detail.data.sliders?.get(sliderId)

      if (!slider) {
        throw new Error(`Slider not found "${id}" in machine "${id}"`)
      }

      return slider
    }

    this.removeMachinesInGroup = (groupId) => {
      $.machines = new List($.machines.items.filter((machine) =>
        machine.groupId !== groupId
      ))
    }

    this.getMachinesInGroup = (groupId) =>
      $.machines.items.filter((machine) =>
        machine.groupId === groupId
      )

    this.setMachineState = (id, state) => {
      $.machines = $.machines.updateById(id, { state })
    }

    this.setMachineControls = (id, controls) => {
      Object.assign($.machines.getById(id), controls)
      $.machines = $.machines.updateById(id, controls)
    }

    this.getPresetByDetail = (id, detail) => {
      const candidates = $.machines.getById(id)
        .presets.items.filter((preset) =>
          preset.detail.satisfies(detail))

      const nonDraft = candidates.find((preset) => !preset.isDraft)

      return nonDraft ?? candidates[0]
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
      this.updatePresetById(id, presetId, {
        isDraft: false
      })
    }

    // TODO: not using fallback
    this.removePresetById = (id, presetId, fallbackPresetId) => {
      const machine = $.machines.getById(id)

      try {
        const preset = machine.presets.getById(presetId)
        const index = machine.presets.items.indexOf(preset)
        setDraft(id, { index, preset })

        $.machines = $.machines.updateById(id, {
          selectedPresetId:
            // if the one we are deleting is the one that is selected
            machine.selectedPresetId === presetId
              // deselect all since it's indeterminate where to go
              // as the user might want to recover the preset by
              // doing a tweak
              ? false
              // otherwise stay on the currently selected preset
              : machine.selectedPresetId,
          presets: machine.presets.removeById(presetId)
        })
      } catch (error) {
        console.warn(error)
      }
    }

    this.insertPreset = (id, index, newDetail, isIntent = false) => {
      const machine = $.machines.getById(id)

      const hue = (Math.round((Math.random() * 10e4) / 25) * 25) % 360
      const newPreset = {
        id: cheapRandomId(),
        name: randomName(),
        hue, //`hsl(${hue}, 85%, 65%)`,
        detail: newDetail,
        isIntent,
        isDraft: true
      }

      setDraft(id, { index, preset: newPreset })

      $.machines = $.machines.updateById(id, {
        selectedPresetId: newPreset.id,
        presets: machine.presets.insertAfterIndex(index, newPreset)
      })

      this.selectPreset(id, newPreset.id)
    }

    const drafts = new Map<string, { index: number, preset: Preset }>()

    this.selectPreset = (id, nextPresetId, byClick = false, newDetail, byGroup) => {
      if (byClick) drafts.delete(id)

      const machine = $.machines.getById(id)

      const prev = !nextPresetId || !machine.selectedPresetId ? false : machine.presets.getById(machine.selectedPresetId)

      const next = !nextPresetId ? false : machine.presets.getById(nextPresetId)

      const isArray = Array.isArray(newDetail?.data)
      if (
        prev
        && prev === next
        && newDetail
        && (isArray || ('editorValue' in newDetail.data && 'editorValue' in prev.detail.data && newDetail.data.editorValue !== prev.detail.data.editorValue)
        )
      ) {
        if (machine.kind === 'mono' && !('sliders' in newDetail.data)) {
          const prevDetail = prev.detail as Detail<MonoDetail>
          const nextDetail = newDetail as Detail<MonoDetail>

          const prevCodeNoArgs = removeSliderArgsFromCode(
            prevDetail.data.sliders,
            prevDetail.data.editorValue
          )

          const nextCode = nextDetail.data.editorValue
          const nextCodeNoArgs = nextCode.replace(parseArgsRegExp, '')
          if (nextCodeNoArgs === prevCodeNoArgs && prevDetail.data.sliders) {
            const argTokens =
              [...nextDetail.data.editorValue.matchAll(parseArgsRegExp)]

            const sliderNames = new Map([...prevDetail.data.sliders.values()]
              .map((x) => [x.name, x]))

            if (
              argTokens.length
              && argTokens.length === prevDetail.data.sliders.size
              && argTokens.every(([, id]) =>
                sliderNames.has(id)
              )) {
              const nextSliders = copySliders(prevDetail.data.sliders)

              argTokens.forEach((match) => {
                const [arg, id, value] = match
                const { index } = match

                const slider =
                  nextSliders.get(sliderNames.get(id)!.id)!

                slider.value = parseFloat(value)
                slider.source.arg = arg
                // @ts-ignore
                slider.source.default = value
                slider.sourceIndex = index!
              })

              $.machines = $.machines.updateById(id, {
                presets: machine.presets.updateById(nextPresetId as string, {
                  detail: newDetail.merge({ sliders: nextSliders })
                })
              })

              machine.updateMarkers!(nextSliders)
              return
            }
          }

          machine.compile!(nextCode, false)
            .then(() => {
              const newSliders = machine.updateSliders?.()
              if (newSliders && machine.editor!.value === nextCode) {
                $.machines = $.machines.updateById(id, {
                  presets: machine.presets.updateById(nextPresetId as string, {
                    detail: newDetail.merge({ sliders: newSliders })
                  })
                })

                machine.updateMarkers!(newSliders)
              }
            })
        } else {
          const nextDetail = next.detail.merge(newDetail.data)

          $.machines = $.machines.updateById(id, {
            presets: machine.presets.updateById(nextPresetId as string, {
              detail: nextDetail
            })
          })

          if (byGroup) {
            let sliders: any

            if (!machine.updateEditorValueArgs!(
              (prev.detail as Detail<MonoDetail>).data.editorValue,
              (nextDetail as Detail<MonoDetail>).data.sliders,
              (prev.detail as Detail<MonoDetail>).data.sliders
            )) {
              const code = (nextDetail as Detail<MonoDetail>).data.editorValue!

              sliders = (nextDetail as Detail<MonoDetail>).data.sliders

              machine.editor!.setValue(code)

              if (sliders) machine.updateMarkers!(sliders)

              machine.compile!(code).then(() => {
                // nothing to do
              })
            }
            else {
              const sliders = (nextDetail as Detail<MonoDetail>).data.sliders
              if (sliders) machine.updateMarkers!(sliders)
            }
          }
        }

        return
      }

      const nextDetail = newDetail
        ? newDetail.merge((next && next.detail || {}).data!)
        : (next && next.detail)

      if (byClick) {
        $.machines = $.machines.updateById(id, {
          presets: machine.presets.mergeEach({ isIntent: true })
        })
      }

      let isInitial = false
      let promise: Promise<any> | undefined
      if (nextPresetId && machine.kind === 'mono') {
        const nextMonoDetail = nextDetail as Detail<MonoDetail>

        const prevDetail = !prev ? false : prev.detail as Detail<MonoDetail>

        const prevCodeNoArgs = !prevDetail || !prevDetail.data.sliders ? false : removeSliderArgsFromCode(
          prevDetail.data.sliders,
          prevDetail.data.editorValue
        )

        const nextCodeNoArgs = !next || !nextMonoDetail || !nextMonoDetail.data.sliders ? null : removeSliderArgsFromCode(
          nextMonoDetail.data.sliders,
          nextMonoDetail.data.editorValue
        )

        const sameCodeNoArgs = prevCodeNoArgs ? prevCodeNoArgs === nextCodeNoArgs : false

        if (nextDetail && (machine.state === 'init' || !sameCodeNoArgs)) {
          isInitial = !prev || machine.state === 'init'
          machine.editor!.setValue(nextMonoDetail.data.editorValue)
          promise = machine.compile!(nextMonoDetail.data.editorValue, isInitial)
        } else {
          if (prev && prevDetail && prevDetail.data.sliders && nextDetail && machine.editor && nextMonoDetail.data.sliders) {
            if (byClick && !sameCodeNoArgs) {
              machine.editor.setValue(nextMonoDetail.data.editorValue)
            } else if (nextMonoDetail.data.editorValue !== machine.editor.value) {
              try {
                machine.updateEditorValueArgs!(
                  prevDetail.data.editorValue,
                  nextMonoDetail.data.sliders,
                  prevDetail.data.sliders
                )
              } catch (error) {
                console.warn(error)
                machine.editor.setValue(nextMonoDetail.data.editorValue)
              }
            }

            machine.updateMarkers!(nextMonoDetail.data.sliders)
          }
        }
      }

      if (byClick && machine.kind === 'app' && next) {
        nextDetail && Array.isArray(nextDetail.data) && nextDetail.data.forEach(function applyAppPresetDetail([id, , detail]) {
          if ($.machines.hasId(id)) {
            drafts.delete(id)
            $.setPresetDetailData(id, detail.data, false, true)
          }
          // TODO: what should happen when the machine id is missing?
          //  create?
        })
      }

      $.machines = $.machines.updateById(id, {
        selectedPresetId: nextPresetId
      })

      if (isInitial && machine.kind === 'mono' && nextDetail) {
        promise?.then(() => {
          const sliders = machine.updateSliders?.()

          // update the preset sliders if after the compile the editor hasn't diverged
          if (sliders && machine.editor!.value === (nextDetail as Detail<MonoDetail>).data.editorValue) {
            this.setPresetDetailData(id, { sliders })
          }
        })
      }
    }

    function setDraft(id: string, draft: { index: number; preset: Preset }) {
      drafts.set(id, draft)
    }

    function restoreDraft(id: string, newDetail: any) {
      const machine = $.machines.getById(id)

      // go to the last draft if there is one
      const draft = drafts.get(id)
      if (draft && !draft.preset.isIntent) {
        if (draft.preset.isDraft) {
          // mutate old draft with new detail as we jump to it
          Object.assign(draft.preset.detail, newDetail)

          if (machine.presets.hasId(draft.preset.id)) {
            $.machines = $.machines.updateById(id, {
              selectedPresetId: draft.preset.id
            })
          } else {
            $.machines = $.machines.updateById(id, {
              selectedPresetId: draft.preset.id,
              presets: machine.presets.insertAfterIndex(draft.index - 1, draft.preset)
            })
          }

          return true
        }
      }
    }

    this.setPresetDetailData = (id, newDetailData, bySelect = true, byGroup) => {
      const newDetail = new Detail(newDetailData as ItemDetail)
      const machine = $.machines.getById(id)

      // if no selected preset yet, create one
      if (!machine.selectedPresetId) {
        if (restoreDraft(id, newDetail)) return

        this.insertPreset(id, -1, newDetail, byGroup)
        return
      }

      // get selected preset
      const current = machine.presets.getById(machine.selectedPresetId)

      // merge current preset detail with our incoming new detail patch
      const mergedDetail = current.detail.merge(newDetail.data)

      // search presets for the new detail
      const preset = this.getPresetByDetail(id, mergedDetail)

      if (preset && !mergedDetail.equals(preset.detail)) {
        preset.detail = mergedDetail
      }

      // if there is a preset
      if (preset && !(current.isDraft && !current.isIntent && preset.isDraft)) {
        // and it's not the currently selected
        if (bySelect || machine.selectedPresetId !== preset.id) {
          this.selectPreset(id, preset.id)

          // remove unintentional drafts that were not interacted with
          if (!byGroup) for (const [index, p] of machine.presets.items.entries()) {
            if (p !== preset && p.isDraft && !p.isIntent) {
              setDraft(id, { index, preset: p })
              $.machines = $.machines.updateById(id, {
                presets: machine.presets.removeById(p.id)
              })
            }
          } else {
            $.machines = $.machines.updateById(id, {
              presets: machine.presets.mergeEach({ isIntent: true })
            })
          }

          return
        }

        // if it's selected but a draft, do nothing because same details
        if (preset.isDraft) {
          setDraft(id, { index: machine.presets!.items.indexOf(preset), preset })
          return
        }
      }

      if (preset?.detail.equals(current.detail)) return

      // otherwise insert a new preset after the selected one
      const index = machine.presets!.items.indexOf(current!)

      // if it's a draft, update it and return
      if (current.isDraft) {
        setDraft(id, { index, preset: current })
        this.selectPreset(id, current.id, false, newDetail, byGroup)
        // machine.updateMarkers!(newDetail.data.sliders)
        return
      }


      if (restoreDraft(id, newDetail)) return

      this.insertPreset(id, index, mergedDetail, byGroup)
    }

    this.setSpacer = (id, spacer) => {
      $.machines = $.machines.updateById(id, { spacer })
    }

    this.setVertical = (id, height) => {
      $.machines = $.machines.updateById(id, { height })
    }
  }
}

export type AppDetail = (readonly [string, MachineKind, Detail<MonoDetail | SchedulerDetail>])[]

export const AppView = web('app', view(
  class props { }, class local extends App {
  host = element
  rect = new Rect()
  detail?: Detail<AppDetail> | false
  items: any[] = []
  itemsView: JSX.Element = false
}, ({ $, fx, fn }) => {
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

  fx(() => {
    on(document.body, 'pointerdown').once(function resumeAudio() {
      console.log('resuming audio')
      $.audioContext.resume()
    })

    $.load()
    // NOTE: enabling this and disabling the above (load) will start new storage.
    // $.state = 'ready'
    $.machines = $.machines.add($.appMachine)

    $.setMachineState('app', 'ready')

    const saveBtn = document.createElement('button')
    Object.assign(saveBtn.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '99999999999'
    })
    saveBtn.textContent = 'save'
    saveBtn.onclick = () => {
      $.save()
      console.log('saved')
    }
    document.body.appendChild(saveBtn)
  })

  fx(({ machines }) => {
    const app = machines.getById('app') as MachineData<AppDetail>
    if (!isEqual(app, $.appMachine)) {
      $.appMachine = app
    }
  })

  fx(({ appMachine: { selectedPresetId, presets } }) => {
    if (selectedPresetId) {
      const preset = presets.getById(selectedPresetId)
      $.detail = preset.detail
    }
  })

  fx(({ $: app, appMachine: { state, selectedPresetId }, machines }) => {
    if (state === 'init') return

    const newDetail = new Detail<AppDetail>(
      (machines.items
        .filter((machine) =>
          machine.kind !== 'app' && machine.selectedPresetId) as MachineData<MonoDetail | SchedulerDetail>[])
        .map((machine) =>
          [machine, machine.presets.getById(machine.selectedPresetId)] as const)
        .map(([machine, preset]) =>
          [machine.id, machine.kind, preset.detail] as const)
    )

    if (!selectedPresetId && $.detail && $.detail.satisfies(newDetail)) return

    const latest = ($.machines.getById('app') as MachineData<AppDetail>)
    if (!latest.presets.getById(latest.selectedPresetId).detail.satisfies(newDetail)) {
      app.setPresetDetailData('app', newDetail.data)
    }
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
    $.audio = {
      audioContext,
      audioNodes,
      fftSize,
      schedulerNode,
    }
  })

  fx(({ $: app, appMachine: { state }, audio, machines }) => {
    if (state === 'init') return

    const itemsView: any[] = []

    let mono: MachineData<MonoDetail> | undefined
    let scheduler: MachineData<SchedulerDetail> | undefined

    for (const machine of machines.items) {
      if (machine.kind === 'app') continue
      if (machine.kind === 'mono') mono = machine as any
      if (machine.kind === 'scheduler') scheduler = machine as any

      if (mono && scheduler) {
        itemsView.push(
          <MonoGroup
            part="item"
            // key={mono.groupId}
            app={app}
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

  fx(({ $: app, machines, itemsView, appMachine: { state, presets, selectedPresetId, height } }) => {
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
        <Button onClick={playing ? app.stopPlaying : app.startPlaying}>
          <IconSvg class="small" set="feather" icon={playing ? 'pause' : 'play'} />
        </Button>
        <Button onClick={() => { }}>
          <IconSvg class="small" set="feather" icon="more-vertical" />
        </Button>
      </div>

      <div part="header">
        <Presets app={app} id="app" presets={presets.items} selectedPresetId={selectedPresetId} />
        <Vertical app={app} id="app" height={height} fixed minHeight={45} />
      </div>
      <div part="items">
        {itemsView}
      </div>
      <div part="add">
        <Button onClick={() => {
          const a = cheapRandomId()
          const b = cheapRandomId()
          const groupId = cheapRandomId()

          $.machines = $.machines.add({
            ...defaultMachines.mono,
            id: a,
            groupId
          })

          $.machines = $.machines.add({
            ...defaultMachines.scheduler,
            id: b,
            groupId,
            outputs: [a]
          })

        }}>
          <IconSvg class="small" set="feather" icon="plus-circle" />
        </Button>
      </div>
    </>
  })
}))
