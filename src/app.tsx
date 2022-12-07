/** @jsxImportSource minimal-view */

import { Matrix, Point, Rect } from 'geometrik'
import { chain, element, event, Off, on, queue, view, web } from 'minimal-view'

import { BasePresets, PresetsGroupDetail } from 'abstract-presets'
import { EditorScene } from 'canvy'
import { cheapRandomId, MapMap, pick } from 'everyday-utils'
import { IconSvg } from 'icon-svg'
import { List } from 'immutable-list'
import { SchedulerEventGroupNode, SchedulerNode } from 'scheduler-node'
import { compressUrlSafe, decompressUrlSafe } from 'urlsafe-lzma'

import { AppAudioNode, Audio } from './audio'
import { Button } from './button'
import { AudioMachine, Machine, MachineCompileState, MachineDetail, MachineKind, MachineState } from './machine'
import { Mono, MonoMachine } from './mono'
import { MonoGroup } from './mono-group'
import { Preset, PresetsView } from './presets'
import { Scheduler, SchedulerMachine } from './scheduler'
import { ancient, emoji, randomName } from './util/random-name'
import { deserialize, serialize } from './util/serialize'
import { Vertical } from './vertical'
import { SliderScene } from './sliders'
import { classes } from './util/classes'
import { bgForHue } from './util/bg-for-hue'
import { ObjectPool } from './util/pool'
import { MonoNode } from 'mono-worklet'

export interface Save {
  name: string
  date: string
  machines: AppContext['machines']
  isAutoSave?: boolean
}

const DELIMITERS = {
  SAVES: '!',
  SAVE_ID: ','
} as const

function getSaveId(save: Save) {
  return [save.name, save.date].join(DELIMITERS.SAVE_ID)
}

export class AppDetail extends PresetsGroupDetail { }

const windowWidth = window.innerWidth

export const SIZES = {
  app: 45,
  mono: 360,
  scheduler: 150
}

const GOLDEN_RATIO = 1.61803398875

export const SPACERS = {
  mono: [0, 1 / GOLDEN_RATIO, (1 - 45 / windowWidth)],
  scheduler: [0, 1 / GOLDEN_RATIO, (1 - 45 / windowWidth)],
}

const aId = cheapRandomId()

const defaultMachines: Record<'mono' | 'scheduler', MonoMachine | SchedulerMachine> = {
  mono: new MonoMachine({
    id: aId,
    kind: 'mono',
    groupId: 'A',
    state: 'init',
    spacer: SPACERS.mono,
    size: SIZES.mono,
  }),
  scheduler: new SchedulerMachine({
    id: cheapRandomId(),
    kind: 'scheduler',
    groupId: 'A',
    state: 'init',
    spacer: SPACERS.scheduler,
    size: SIZES.scheduler,
    outputs: [aId],
  })
}

export class AppPresets extends BasePresets<AppDetail, Preset<AppDetail>> {
  constructor(data: Partial<AppPresets> = {}) {
    super(data, Preset, AppDetail)
  }
}

export class AppMachine extends Machine<AppPresets>  {
  id = 'app'
  kind: MachineKind = 'app'
  size = SIZES['app']
  align: 'x' | 'y' = 'y'
  presets = new AppPresets()

  constructor(data: Partial<AppMachine> = {}) {
    super(data)
    Object.assign(this, data)
  }

  toJSON(): any {
    return pick(this, [
      'id',
      'kind',
      'size',
      'align',
      'presets',
    ])
  }
}

export type AppContext = typeof AppView.Context

export const AppView = web('app', view(
  class props {
    distRoot!: string
    apiUrl!: string
  },

  class local {
    host = element
    rect = new Rect()
    items: any[] = []
    itemsView: JSX.Element = false

    app = new AppMachine()
    state!: AppMachine['state']
    presets!: AppMachine['presets']
    size!: AppMachine['size']
    align: AppMachine['align'] = 'y'

    preset: Preset<AppDetail> | false = false

    // saves
    saves: string[] = []
    lastSave: Save | false = false
    isAutoSave = false
    remoteSaves: string[] = []

    // machines
    machines!: List<Machine | AudioMachine | MonoMachine>

    Machines = {
      app: () => { },
      mono: Mono,
      scheduler: Scheduler,
    }

    // audio
    audioContext = new AudioContext({ sampleRate: 44100, latencyHint: 0.04 })
    // audioNodes = new ImmMap<string, AppAudioNode>()
    // gainNodes = new ImmMap<string, GainNode>()
    // disconnects = new Map<string, Off>()
    // playingNodes = new Map<string, Off>()
    // analyserNodes = new ImmMap<string, AnalyserNode>()
    schedulerNode?: SchedulerNode
    startTime?: number
    fftSize = 32
    audio?: Audio

    playing = 0

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

    sliderScene: SliderScene = {
      updateNormalMap: new MapMap()
    }

    // jsx views
    mainControlsView?: JSX.Element
    addButtonView?: JSX.Element
    savesView?: JSX.Element
    appPresetsView?: JSX.Element

    // refs
    saveEl?: HTMLDivElement

    // saves/history
    nextSaveEmoji = randomName(emoji)

    // optimizations
    // presetsChecksum?: string
    // machinesChecksum?: string
  },

  function actions({ $, fns, fn }) {
    const updateTitle = ({ name, date, isAutoSave }: Save, serializedSave?: string, isFromUrl?: boolean) => {
      const url = new URL(location.href)

      $.nextSaveEmoji = name

      if (!isFromUrl) {
        if (serializedSave) {
          url.hash = `s=${name},${compressUrlSafe(
            serializedSave, { mode: 9, enableEndMark: false }
          )}`
          console.log('url length:', url.toString().length)
        } else {
          // unreachable?
          url.hash = ''
        }

        history.pushState({}, '', url)
      }

      // TODO: change favicon, change save button background
      document.title = `${isAutoSave ? '• ' : ''}${name} - ${new Date(date).toLocaleString()}`
    }

    return fns(new class actions {
      load = (
        saveId = 'lastSave',
        serializedSave?: string
      ) => {
        let machines: AppContext['machines'] = new List();

        try {
          const isFromUrl = serializedSave != null
          serializedSave ??= localStorage[saveId]

          // console.log(saveId, serializedSave)

          const json = JSON.parse(serializedSave!)
          const obj = deserialize(json) as Save

          console.log('load:', saveId, obj)

          if (Array.isArray(obj.machines)) {
            obj.machines = new List({ items: obj.machines })
          }

          // console.log(obj)

          localStorage.lastSave = serializedSave
          $.lastSave = obj

          updateTitle(obj, serializedSave, isFromUrl)
          machines = obj.machines
        } catch (error) {
          console.warn(error)
        }

        try {
          $.saves = localStorage.saves.split(DELIMITERS.SAVES)
            .filter(Boolean)
            .filter((key: string) => key in localStorage)
        } catch (error) {
          console.warn(error)
        }

        // const machineIds = (localStorage.machines ?? '').split(',').filter(Boolean)

        // machineIds.forEach((id: string) => {
        //   try {
        //     const machineJson = JSON.parse(localStorage[`machine_${id}`])
        //     const machine = deserialize(machineJson)
        //     machines.push(machine)
        //     if (id === 'app') {
        //       $.app = machine as AppMachine
        //     }
        //   } catch (error) {
        //     console.warn('Failed to load machine with id', id)
        //     console.warn(error)
        //   }
        // })

        if (!machines.items.length) {
          machines = machines
            .add($.app)
            .add(defaultMachines.mono.copy())
            .add(defaultMachines.scheduler.copy())

          //   $.app,
          //   defaultMachines.mono.copy(),
          //   defaultMachines.scheduler.copy(),
          // )
        }

        $.machines = machines //new List({ items: machines })
        $.app = machines.getById('app')
        this.setMachineState('app', 'ready')
      }

      loadUrl = (
        url: URL | Location
      ) => {
        try {
          if (url.hash.startsWith('#s')) {
            const hash = decodeURIComponent(url.hash).split('#s=')[1] ?? ''
            if (!hash.length) return false

            const [, compressed] = hash.split(',')
            const serializedSave = decompressUrlSafe(compressed)
            this.load(void 0, serializedSave)
            return true
          } else {
            return false
          }
        } catch (error) {
          console.warn(error)
          return false
        }
      }

      save = (
        name?: string
      ) => {
        const date = new Date()

        let isAutoSave

        if (name == null) {
          isAutoSave = true
          name = $.nextSaveEmoji
        }

        const obj: Save = {
          name,
          date: date.toISOString(),
          machines: $.machines
        }

        if (isAutoSave) obj.isAutoSave = true

        const json = serialize(obj)

        if ($.lastSave && (isAutoSave || !$.lastSave.isAutoSave)) {
          const machinesCopy =
            (deserialize(json) as Save).machines

          console.log($.lastSave, machinesCopy)

          if ($.lastSave.machines.equals(machinesCopy)) {
            console.log('there were no changes so nothing was saved')
            return false
          }
        }

        $.lastSave = deserialize(json) as Save

        const serializedSave = JSON.stringify(json)

        localStorage.lastSave = serializedSave

        if (!isAutoSave) {
          const saveId = getSaveId(obj)

          localStorage[saveId] = serializedSave

          $.saves = (localStorage.saves ?? '')
            .split(DELIMITERS.SAVES)
            .concat([saveId])
            .filter(Boolean)
            .filter((key: string) => key in localStorage)

          localStorage.saves = $.saves.join(DELIMITERS.SAVES)

          if (name && document.hasFocus()) {
            navigator.clipboard.writeText(location.href)
          }
        }

        updateTitle(obj, serializedSave)

        if (!isAutoSave) {
          requestAnimationFrame(() => {
            const slurp = document.createElement('audio')
            slurp.src = [
              `${$.distRoot}/slurp-1.ogg`,
              `${$.distRoot}/slurp-2.ogg`,
            ][Math.random() * 2 | 0]
            slurp.play()
          })
        }

        return true
      }

      deleteSave = (
        saveId: string
      ) => {
        console.log('will delete:', saveId)

        $.saves = (localStorage.saves ?? '')
          .split(DELIMITERS.SAVES)
          .filter((key: string) => key !== saveId)

        localStorage.saves = $.saves.join(DELIMITERS.SAVES)
      }

      getShort = async () => {
        const res = await fetch($.apiUrl, {
          method: 'POST',
          body: location.hash,
        })
        const short = await res.text()
        console.log('short', short)
        return short
      }

      getShortList = async () => {
        try {
          const res = await fetch($.apiUrl, {
            method: 'GET',
          })
          const data = await res.json()
          const list = data.keys.map((key: { name: string }) => key.name) as string[]
          console.log('list', list)
          return list
        } catch (error) {
          console.warn(error)
          return []
        }
      }

      // addNode = (
      //   id: string,
      //   audioNode: AppAudioNode
      // ) => {
      //   $.audioNodes = $.audioNodes.set(id, audioNode)
      // }

      // removeNode = (
      //   id: string
      // ) => {
      //   $.audioNodes = $.audioNodes.delete(id)
      // }

      // addGainNode = (
      //   id: string,
      //   gainNode: GainNode
      // ) => {
      //   $.gainNodes = $.gainNodes.set(id, gainNode)
      // }

      // removeGainNode = (
      //   id: string
      // ) => {
      //   $.gainNodes = $.gainNodes.delete(id)
      // }

      // addAnalyserNode = (
      //   id: string,
      //   analyserNode: AnalyserNode
      // ) => {
      //   $.analyserNodes = $.analyserNodes.set(id, analyserNode)
      // }

      // removeAnalyserNode = (
      //   id: string
      // ) => {
      //   $.analyserNodes = $.analyserNodes.delete(id)
      // }

      connectNode = (
        sourceNode: AppAudioNode,
        targetNode: AppAudioNode
      ) => {
        // const targetNode = $.audioNodes.get(targetId)
        // if (!targetNode) {
        //   throw new Error('No target audio node found with id: ' + targetId)
        // }

        const waitForResume = () => {
          on(targetNode, 'resume' as never).once(() => {
            console.log('connect', sourceNode, targetNode)
            sourceNode.connect(targetNode as any)
          })
        }

        const disconnectAndRetry = () => {
          console.log('disconnect', sourceNode, targetNode)
          sourceNode.disconnect(targetNode as any)
          waitForResume()
        }

        let off: Off
        if ('state' in targetNode) {
          // console.log('HAS TARGET STATE')
          off = chain(
            on(targetNode, 'suspend' as never)(disconnectAndRetry),
            on(targetNode, 'disable' as never)(disconnectAndRetry),
          )

          if (targetNode.state !== 'running') {
            waitForResume()
          } else {
            sourceNode.connect(targetNode as any)
          }
        } else {
          // console.log('NO STATE IN TARGET')
          sourceNode.connect(targetNode as any)
        }

        return () => {
          try {
            sourceNode.disconnect(targetNode as any)
          } catch (error) {
            console.warn(error)
          }
          off?.()
        }
      }

      // disconnectNode = (
      //   sourceNode: AppAudioNode,
      //   targetId: string
      // ) => {
      //   const targetNode = $.audioNodes.get(targetId)
      //   if (!targetNode) {
      //     throw new Error('No target audio node found with id: ' + targetId)
      //   }
      //   try {
      //     sourceNode.disconnect(targetNode as any)
      //   } catch (error) {
      //     console.warn(error)
      //   }
      // }

      startPlaying = () => {
        $.machines.items
          .filter((machine) =>
            // @ts-ignore
            'methods' in machine && 'start' in machine.methods)
          .forEach(({ methods: { start } }: any) => start())
      }

      stopPlaying = () => {
        $.machines.items
          .filter((machine) =>
            // @ts-ignore
            'methods' in machine && 'stop' in machine.methods)
          .forEach(({ methods: { stop } }: any) => stop())
      }

      removeMachinesInGroup = (
        groupId: string
      ) => {
        $.machines = new List({
          items: $.machines.items.filter((machine) =>
            !('groupId' in machine) || machine.groupId !== groupId
          )
        })
      }

      getMachinesInGroup = (
        groupId: string
      ) =>
        $.machines.items.filter((machine) =>
          'groupId' in machine && machine.groupId === groupId
        ) as (MonoMachine | SchedulerMachine)[]

      setMachineState = (
        id: string,
        state: MachineState
      ) => {
        // queueMicrotask(() => {
        // TODO: this is needed because the machines update
        // so the scheduler disconnects and fires the onConnectChange
        // before it has time to off()
        if ($.machines.hasId(id)) {
          $.machines = $.machines.updateById(id, { state })
        }
        // })
      }

      setMachineCompileState = (
        id: string,
        compileState: MachineCompileState
      ) => {
        // queueMicrotask(() => {
        $.machines = $.machines.updateById(id, { compileState } as any)
        // })
      }

      getPresetByDetail = (
        id: string,
        detail: MachineDetail
      ) => {
        return $.machines.getById(id).presets.getByDetail(detail)
      }

      updatePresetById = (
        id: string,
        presetId: string,
        data: Partial<Preset>
      ) => {
        let presets = $.machines.getById(id).presets
        presets = presets.updateById(presetId, data)
        $.machines = $.machines.updateById(id, {
          presets
        })
        return presets.getById(presetId)
      }

      renamePresetRandom = (
        id: string,
        presetId: string,
        useEmoji?: boolean
      ) => {
        this.updatePresetById(id, presetId, {
          hue: (Math.round((Math.random() * 10e4) / 25) * 25) % 360,
          name: randomName(useEmoji ? emoji : ancient)
        })
      }

      savePreset = (
        id: string,
        presetId: string
      ) => {
        $.machines = $.machines.updateById(id, {
          presets: $.machines.getById(id)
            .presets.savePreset(presetId)
        })
      }

      removePresetById = (
        id: string,
        presetId: string,
        fallbackPresetId?: string
      ) => {
        const machine = $.machines.getById(id)

        try {
          $.machines = $.machines.updateById(id, {
            presets: machine.presets.removeById(presetId, fallbackPresetId)
          })
        } catch (error) {
          console.warn(error)
        }
      }

      insertPreset = (
        id: string,
        index: number,
        newDetail: MachineDetail,
        isIntent = false
      ) => {
        const machine = $.machines.getById(id)

        const newPreset = machine.presets.createWithDetail(newDetail, { isIntent })

        $.machines = $.machines.updateById(id, {
          presets: machine.presets
            .insertAfterIndex(index, newPreset)
            .selectPreset(newPreset.id)
        })
      }

      selectPreset = (
        id: string,
        presetId: string,
        byClick?: boolean,
        newDetail?: MachineDetail
      ) => {
        const machine = $.machines.getById(id)
        $.machines = $.machines.updateById(id, {
          presets: machine.presets.selectPreset(presetId, byClick, newDetail)
        })
      }

      setPresetDetailData = <T extends MachineDetail>(
        id: string,
        newDetailData: T['data'],
        bySelect?: boolean,
        byIntent?: boolean
      ) => {
        const machine = $.machines.getById(id)

        const presets = machine.presets
          .setDetailData(newDetailData, bySelect, byIntent)

        $.machines = $.machines.updateById(id, {
          presets
        })

        return presets.selectedPreset!
      }

      setSpacer = (
        id: string,
        spacer: number[]
      ) => {
        $.machines = $.machines.updateById(id, { spacer })
      }

      setSize = (
        id: string,
        size: number
      ) => {
        $.machines = $.machines.updateById(id, { size })
      }

      setGainValue = (
        id: string,
        gainValue: number
      ) => {
        $.machines = $.machines.updateById<MonoMachine>(id, { gainValue })
      }

      getSources = (machines = $.machines) => {
        return new Map(machines.items.filter(function filterMachinesNoApp(machine) { return machine.kind !== 'app' }).map(function mapMachinesToSources(machine) { return [machine.id, machine.presets] as const }
        ))
      }

      presetsOnSelect = (
        next: Preset<AppDetail> | null,
        prev: Preset<AppDetail> | null,
        _x: AppDetail | null | undefined,
        _y: AppDetail | null,
        byClick: boolean | undefined
      ) => {
        if (byClick && next) {
          let sources = this.getSources()

          const detail = next.detail.merge({ ...next.detail.data, sources })

          sources = detail.applyData(detail.data) as any

          if (sources && $.preset) {
            let machines = $.machines

            sources.forEach((presets, key) => {
              if (machines.hasId(key)) {
                machines = machines.updateById(key, { presets })
              }
            })

            $.sources = this.getSources(machines)
            $.preset = $.presets.createWithDetailData({ ...next.detail.data, sources: $.sources }, next)
            $.machines = machines
          }
        }
      }

      resize = queue.raf(() => {
        const rect = $.rect.clone()
        rect.width = window.innerWidth
        rect.height = window.innerHeight
        $.rect = rect
      })

      onWindowPopState = () => {
        this.loadUrl(location)
      }

      getCurrentTimeAdjusted = fn(({ audioContext, startTime }) => () => {
        return audioContext.currentTime - startTime
      })
    })
  },

  function effects({ $, fx, refs }) {
    $.css = /*css*/`
    & {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      background: #000;
    }
    `

    fx(function appCss({ align, distRoot }) {
      const [dim, flow, padDim, , , oppDim, , viewportDim, oppFlow, ctrlPos] = [
        ['height', 'row', 'right', 'x', 'y', 'width', 'left', 'vh', 'column', 'top'] as const,
        ['width', 'column', 'bottom', 'y', 'x', 'height', 'top', 'vw', 'row', 'bottom'] as const,
      ][+(align === 'y')]

      const bodyStyle = document.createElement('style')

      bodyStyle.textContent = /*css*/`
      @font-face {
        font-family: CascadiaMono;
        src: url("${distRoot}/CascadiaMono.woff2") format("woff2");
      }
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
      }
      `

      document.head.appendChild(bodyStyle)

      $.css = /*css*/`
      & {
        display: flex;
        flex-flow: ${flow} nowrap;
        align-items: center;
        background: #000;
        /* ${dim}: fit-content; */
        /* min-${dim}: 100%; */
        /* scroll-behavior: smooth; */
        /* min-${dim}: 100%; */
        max-${dim}: 100%;
        min-${oppDim}: 100%;
        /* overflow: hidden; */
        padding-${padDim}: 65${viewportDim};
      }

      [part=header] {
        position: sticky;
        left: 0;
        top: 0;
        z-index: 99999;
        background: #001d;
        ${dim}: 100%;
        /* overflow: hidden; */
        /* display: flex; */
      }

      [part=main-controls] {
        z-index: 99999999999;
        position: fixed;
        ${ctrlPos}: 50px;
        right: 50px;
        display: flex;
        padding: 8px 25px;
        justify-content: space-between;
        background: #112;
        border-radius: 100px;
        border: 4px solid #fff;
        box-shadow: 3px 3px 0 6px #000;
        ${Button} {
          cursor: pointer;
        }
      }

      &([playing]) {
        [part=main-controls] {
          border-color: #1f3;
          color: #4f1;
        }
      }

      [part=items] {
        /* background: red; */
        display: flex;
        /* flex: 1; */
        flex-flow: ${flow} nowrap;
        ${dim}: 100%;
        max-${dim}: min(800px, calc(100% - 80px));
        /* ${oppDim}: 100%; */
        /* align-items: center; */
        /* max-${oppDim}: 100%;
        ${dim}: 100%;
        min-${dim}: 100%; */
        /* max-width: max(900px, calc(1vw - 50px)); */
      }

      [part=item] {
        /* display: flex; */
        min-width: 100%;

        /* flex-flow: ${oppFlow} nowrap; */
        /* max-${oppDim}: 100%; */
        /* flex: 1; */
        /* align-items: center; */
        /* width: 100%; */
        /* position: relative; */
        /* min-${dim}: 100%; */
        /* min-${oppDim}: 100%; */
        /* max-width: max(900px, calc(1vw - 50px)); */
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

      /* [part=saves] {
        display: flex;
        flex-flow: row nowrap;
        overflow-x: scroll;
        overflow-y: hidden;

        button {
          all: unset;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: CascadiaMono;

          height: 45px;
          width: 45px;
          min-width: 45px;


          &:hover {
            background: #aaf4;
            color: #fff;
            text-shadow: 1px 1px #000;
          }
        }
      } */

      [part=saves] {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        button {
          all: unset;
          font-size: 27px;


          cursor: pointer;
          text-align: center;
          min-width: 70px;
          height: 45px;
        }
      }
      .history {
        z-index: 0;

        &-inner {
          display: inline-block;
          height: 100%;
          /* background: repeating-linear-gradient(90deg, rgba(255,0,0,1) 0px, rgba(255,154,0,1) 100px, rgba(208,222,33,1) 200px, rgba(79,220,74,1) 300px, rgba(63,218,216,1) 400px, rgba(47,201,226,1) 500px, rgba(28,127,238,1) 600px, rgba(95,21,242,1) 700px, rgba(186,12,248,1) 800px, rgba(251,7,217,1) 900px, rgba(255,0,0,1) 1000px); */
          /* background-clip: text; */
          /* -webkit-background-clip: text; */
        }

        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-flow: row nowrap;

        white-space: nowrap;
        overflow-x: scroll;

        button {
          all: unset;
          cursor: pointer;
          text-align: center;
          font-family: CascadiaMono;

          height: 45px;
          width: 45px;
          min-width: 45px;

          font-size: 21px;
          -webkit-text-fill-color: transparent;
          line-height: 100%;
          border: none;

          &.named {
            -webkit-text-fill-color: initial;
          }
        }
      }

      [part=saves] {
        button {
          background-repeat: repeat;
          background-size: 30px 30px;
          background-position: center;

          &.big {
            width: 72px;
            min-width: 72px;
          }
          &:hover:not([disabled]):not(.selected) {
            background-color: #aaf3;
          }
          &.selected {
            background: #aaf5;
            cursor: default;
          }
          &[disabled] {
            cursor: not-allowed;
          }
        }
      }

      [part=topbar-controls] {
        display: flex;
        flex-flow: row nowrap;
        font-size: 30px;
        color: #aaf;

        > * {
          cursor: pointer;
          width: 70px;

          text-align: center;
          &:hover {
            background: #aaf3;
          }
        }
      }
      &([playing]) {
        [part=topbar-controls] {
          color: #4f1;
        }
      }
      `
    })

    fx(function boot({ host }) {
      on(document.body, 'pointerdown')(function resumeAudio() {
        if ($.audioContext.state !== 'running') {
          console.log('resuming audio')
          $.audioContext.resume()
        }
      })

      if (!$.loadUrl(location)) {
        $.load()
      }

      $.getShortList().then((list) => {
        $.remoteSaves = list
      })

      // $.methods.setMachineState('app', 'ready')

      // const saveBtn = document.createElement('button')

      // Object.assign(saveBtn.style, {
      //   position: 'fixed',
      //   top: '0',
      //   left: '0',
      //   zIndex: '99999999999'
      // })

      // saveBtn.textContent = 'get short url'

      // saveBtn.onclick = async () => {
      //   const res = await fetch($.apiUrl, {
      //     method: 'POST',
      //     body: location.hash,
      //   })
      //   const short = await res.text()
      //   console.log('short', short)
      // }

      // document.body.appendChild(saveBtn)
    })

    fx(function updateMachines({ machines }) {
      $.sources = $.getSources()
      const app = machines.getById('app') as AppMachine
      if ($.app.state !== 'init') {
        $.isAutoSave = true
      }
      if (!app.equals($.app)) {
        $.app = app
      }
    })

    fx.debounce(15000)(function autoSave({ machines: _ }) {
      $.save()
    })

    fx(function updateAppProps({ app }) {
      $.size = app.size

      // $.align = app.align
      app.align = $.align

      $.state = app.state
      $.presets = app.presets
    })

    fx(function updatePreset({ presets }) {
      const preset = presets.selectedPreset
      if (preset) {
        $.preset = preset
      }
    })

    fx(function updatePresetDetailData({ state, sources }) {
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
      // if ($.preset && $.preset.detail.satisfies(newDetail)) return

      $.preset = $.setPresetDetailData('app', newDetail.data)
    })

    fx(function listenPresetsOnSelect({ presets }) {
      presets.on('select', $.presetsOnSelect)
    })

    fx(function listenOnWindowResize() {
      $.resize()
      return on(window, 'resize')($.resize)
    })

    fx(function applyHostDim({ host, align, rect }) {
      const dim = align === 'x' ? 'height' : 'width'
      host.style[dim] = rect[dim] + 'px'
    })

    fx(async function createAndStartScheduler({ audioContext }) {
      $.schedulerNode = await SchedulerNode.create(audioContext)
      $.startTime = await $.schedulerNode.start()
      // monoNode?.worklet.setTimeToSuspend(Infinity)
    })

    fx(function createAudio({ audioContext, fftSize, schedulerNode }) {
      const gainNodePool = new ObjectPool(() => {
        return new GainNode(audioContext, { channelCount: 1, gain: 0 })
      })

      const monoNodePool = new ObjectPool(async () => {
        return await MonoNode.create(audioContext, {
          numberOfInputs: 0,
          numberOfOutputs: 1,
          processorOptions: {
            metrics: 0,
          }
        })
      })

      const groupNodePool = new ObjectPool(() => {
        return new SchedulerEventGroupNode(schedulerNode)
      })

      const analyserNodePool = new ObjectPool(() => {
        return new AnalyserNode(audioContext, {
          channelCount: 1,
          fftSize,
          smoothingTimeConstant: 0.5
        })
      })

      $.audio = new Audio({
        audioContext,
        fftSize,
        schedulerNode,
        gainNodePool,
        monoNodePool,
        groupNodePool,
        analyserNodePool,
      })
    })

    // fx(function reconcileAudioNodes({ audioNodes, disconnects, machines }) {
    //   // const toDisconnect: string[] = []
    //   const keep = new Set<string>()

    //   for (const machine of machines.items) {
    //     if ('outputs' in machine) {
    //       const sourceNode = audioNodes.get(machine.id)

    //       if (sourceNode) {
    //         for (const outputId of machine.outputs) {
    //           const pairId = `${machine.id}_${outputId}`

    //           const targetNode = audioNodes.get(outputId)

    //           if (disconnects.has(pairId)) {
    //             // if (!targetNode) {
    //             //   toDisconnect.push(pairId)
    //             // } else {
    //             if (targetNode) {
    //               keep.add(pairId)
    //             }
    //           } else {
    //             if (targetNode) {
    //               const off = $.connectNode(sourceNode, targetNode)
    //               disconnects.set(pairId, off)
    //               keep.add(pairId)
    //             }
    //           }
    //         }
    //       }
    //       //  else {
    //       //   for (const pairId of disconnects.keys()) {
    //       //     const [sourceId] = pairId.split('_')
    //       //     if (sourceId === machine.id) {
    //       //       toDisconnect.push(pairId)
    //       //     }
    //       //   }
    //       // }
    //     }
    //   }

    //   for (const [pairId, off] of [...disconnects]) {
    //     if (!keep.has(pairId)) {
    //       off()
    //       disconnects.delete(pairId)
    //     }
    //     // const off = disconnects.get(pairId)!
    //     // disconnects.delete(pairId)
    //     // off()
    //   }
    //   // for (const pairId of toDisconnect) {
    //   //   const off = disconnects.get(pairId)!
    //   //   disconnects.delete(pairId)
    //   //   off()
    //   // }
    // })

    // fx(function reconcilePlayingNodes({ audio, audioNodes, playingNodes, gainNodes, analyserNodes, machines }) {
    //   const keep = new Set<string>()

    //   for (const machine of machines.items) {
    //     if (!('gainValue' in machine)) continue

    //     if (machine.state === 'running') {
    //       keep.add(machine.id)

    //       if (!playingNodes.has(machine.id)) {
    //         const audioNode = audioNodes.get(machine.id) as AudioNode
    //         const gainNode = gainNodes.get(machine.id)
    //         const analyserNode = analyserNodes.get(machine.id)

    //         if (audioNode && gainNode && analyserNode) {
    //           if (audioNode instanceof MonoNode) {
    //             if (machine.state !== 'running') {
    //               audioNode.suspend()
    //               // console.log('should suspend??')
    //             } else {
    //               audioNode.resume()
    //               // console.log('should resume??')
    //             }
    //           }
    //           audio.setParam(gainNode.gain, machine.gainValue)
    //           audioNode.connect(gainNode)
    //           audioNode.connect(analyserNode)

    //           playingNodes.set(machine.id, () => {
    //             audio.setParam(gainNode.gain, 0)
    //             // setTimeout(() => {
    //             try {
    //               if (audioNode instanceof MonoNode) {
    //                 // console.log('should suspend??')
    //                 audioNode.suspend()
    //               }
    //               audioNode.disconnect(gainNode)
    //             } catch (error) {
    //               console.warn(error)
    //             }
    //             try {
    //               audioNode.disconnect(analyserNode)
    //             } catch (error) {
    //               console.warn(error)
    //             }
    //             // }, 50)
    //           })
    //         }
    //       }
    //     } else {
    //       if (!playingNodes.has(machine.id)) {
    //         const audioNode = audioNodes.get(machine.id) as AudioNode
    //         if (audioNode) {
    //           if (audioNode instanceof MonoNode) {
    //             audioNode.suspend()
    //             console.log('should suspend')
    //           }
    //         }
    //       }
    //     }
    //     // else {
    //     //   if (playingNodes.has(machine.id)) {
    //     //     const off = playingNodes.get(machine.id)!
    //     //     playingNodes.delete(machine.id)
    //     //     off()
    //     //   }
    //     // }

    //   }

    //   for (const [id, off] of [...playingNodes]) {
    //     if (!keep.has(id)) {
    //       off()
    //       playingNodes.delete(id)
    //     }
    //   }

    // })

    // fx(function calcMachinesChecksum({ machines }) {
    //   $.machinesChecksum = machines.items.map((m) =>
    //     `${m.size}${m.state}${checksumOfPresets(m.presets)}`
    //   ).join()
    // })

    fx(function drawItemsView({ addButtonView, state, audio, machines }) {
      if (state === 'init') return

      const itemsView: any[] = []

      let mono: MonoMachine | undefined
      let scheduler: SchedulerMachine | undefined

      for (const machine of $.machines.items) {
        if (machine.kind === 'app') continue
        if (machine.kind === 'mono') mono = machine as any
        if (machine.kind === 'scheduler') scheduler = machine as any

        if (mono && scheduler) {
          itemsView.push(
            <MonoGroup
              // key={mono.groupId}
              part="item"
              groupId={mono.groupId}
              app={$}
              audio={audio}
              mono={mono}
              scheduler={scheduler}
            />
          )
          mono = scheduler = void 0
        }
      }

      $.itemsView = <div part="items">{itemsView}{addButtonView}</div>
    })

    fx.raf(function updatePlayingState({ host, machines }) {
      $.playing = machines.items.filter((machine) => machine.kind === 'mono' && machine.state === 'running').length

      host.toggleAttribute('playing', Boolean($.playing))
    })

    fx(function drawMainControls({ playing }) {
      $.mainControlsView = <div part="main-controls">
        <Button onClick={playing ? $.stopPlaying : $.startPlaying}>
          <IconSvg class="normal" set="feather" icon={playing ? 'pause' : 'play'} />
        </Button>

        <Button onClick={() => {
          $.getShort().then((shortId) => {
            prompt(
              'Here is your short url:',
              `https://play.${location.hostname}/${shortId.split('-').pop()}`
            )
          })
        }}>
          <IconSvg class="normal" set="feather" icon="send" />
        </Button>
      </div>
    })

    fx(function drawAddButton() {
      $.addButtonView = <div part="add">
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
          <IconSvg class="normal" set="feather" icon="plus-circle" />
        </Button>
      </div>
    })

    fx(function drawAppPresets({ savesView, presets, size, align }) {
      $.appPresetsView = <div part="header">
        {savesView}
        <PresetsView app={$} id="app" presets={presets as any} />
        <Vertical app={$} id="app" size={size} align={align} minSize={45} />
      </div>
    })

    // function checksumOfPresets(presets: AppPresets | MonoPresets | SchedulerPresets) {
    //   return presets.selectedPresetId + presets.items.map(
    //     ({ id, isRemoved, isDraft, hue, name }) =>
    //       `${id}${hue}${name}${isRemoved ? 1 : 0}${isDraft ? 1 : 0}`
    //   ).join()
    // }

    // fx(function calcPresetsChecksum({ presets }) {
    //   $.presetsChecksum = checksumOfPresets(presets)
    // })

    fx(function updateAutoSave({ lastSave }) {
      if (lastSave) {
        $.isAutoSave = lastSave.isAutoSave || false
      }
    })

    fx(function listenOnWindowPopState() {
      return on(window, 'popstate')($.onWindowPopState)
    })

    // fx(({ saveEl, saves: _ }) => {
    //   saveEl.scrollLeft = Number.MAX_SAFE_INTEGER
    //   requestAnimationFrame(() => {
    //     saveEl.scrollLeft = Number.MAX_SAFE_INTEGER
    //   })
    // })


    fx(function focusSave({ saveEl, lastSave }) {
      const lastSaveId = lastSave && getSaveId(lastSave)

      if (lastSaveId) {
        const targetEl = saveEl.querySelector(`[dataset-id="${lastSaveId}"]`) as HTMLButtonElement | undefined

        if (targetEl) targetEl.focus({ preventScroll: false })
      }
    })

    fx(function drawSaves({ saves, remoteSaves, nextSaveEmoji, lastSave, isAutoSave }) {
      const lastSaveId = lastSave && getSaveId(lastSave)
      $.savesView = <div part="saves" onwheel={event.stop.not.passive()}>
        <div part="topbar-controls">
          {/* <Button style="line-height: 45px;" onClick={() => { }}>
          🔔
        </Button> */}
          <Button
            style="line-height: 45px;"
            title="This is you. Click to become someone else."
            onClick={() => { }}>
            👻
          </Button>
        </div>

        <div
          ref={refs.saveEl}
          class="history"
        ><div class="history-inner">
            {remoteSaves.map(function drawRemoteSave(remoteSaveId) {
              const [, emoji, short] = remoteSaveId.split('-')
              return <button
                dataset-short={short}
                onclick={(e) => {
                  fetch(`${$.apiUrl}/${short}?`).then((res) =>
                    res.text()
                  ).then((hash) => {
                    location.hash = hash
                  })
                }}
                class="named"
                title={short}>{emoji}</button>
            })}
            {
              saves.map(function drawSave(saveId, i) {
                const [name, date] = saveId.split(DELIMITERS.SAVE_ID)
                return <button
                  dataset-id={saveId}
                  onclick={(e) => {
                    if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
                      $.deleteSave(saveId)
                    } else {
                      $.load(saveId)
                    }
                  }}
                  class={classes({
                    named: !!name,
                    selected: !isAutoSave && lastSaveId && saveId === lastSaveId
                  })}
                  title={new Date(date).toLocaleString()}>{name}</button>
              })}
          </div>
        </div>

        <button
          title={!isAutoSave ? "You need to make some changes to be able to save." : "Click to save.\nMiddle or right click for another icon."}
          class="big"
          disabled={!isAutoSave}
          style={
            isAutoSave
              ? `background-image:${bgForHue(Math.round((Math.random() * 360 | 0) * 25) / 25)}`
              : ''
          }
          oncontextmenu={event.prevent.stop()}
          onpointerdown={(e) => {
            if (e.buttons & 1 && isAutoSave) {
              if (!$.save(nextSaveEmoji)) return
              requestAnimationFrame(() => {
                $.saveEl!.scrollLeft = Number.MAX_SAFE_INTEGER
              })
            }
            if ((e.buttons & 2) || (e.buttons & 4)) {
              $.nextSaveEmoji = randomName(emoji)
            }
          }}>{nextSaveEmoji}</button>
      </div>
    })

    fx(function drawApp({ mainControlsView, itemsView, appPresetsView, state }) {
      if (state === 'init') return

      // {/* <div>
      //     <Button onClick={() => { }}>
      //       <IconSvg class="small" set="feather" icon="minimize-2" />
      //     </Button>
      //     <Button onClick={() => { }}>
      //       <IconSvg class="small" set="feather" icon="maximize-2" />
      //     </Button>
      //   </div> */}
      $.view = [
        mainControlsView,
        appPresetsView,
        itemsView,
      ]
    })
  }))
