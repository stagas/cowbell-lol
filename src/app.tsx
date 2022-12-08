/** @jsxImportSource minimal-view */

import { Scalar, Matrix, Point, Rect } from 'geometrik'
import { chain, element, event, Off, on, queue, view, web } from 'minimal-view'

import { BasePresets, PresetsGroupDetail } from 'abstract-presets'
import { EditorScene } from 'canvy'
import { cheapRandomId, MapMap, pick } from 'everyday-utils'
import { IconSvg } from 'icon-svg'
import { List } from '@stagas/immutable-list'
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
import { SliderScene } from './sliders'
import { classes } from './util/classes'
import { bgForHue } from './util/bg-for-hue'
import { ObjectPool } from './util/pool'
import { MonoNode } from 'mono-worklet'
import { Spacer } from './spacer'
import { MixerView } from './mixer'
import { animRemoveSchedule, animSchedule } from './anim'

const { clamp } = Scalar

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
  name = 'main'
  kind: MachineKind = 'app'
  hue = 230
  size = SIZES['app']
  align: 'x' | 'y' = 'y'
  presets = new AppPresets()

  declare methods: AppContext
  declare audio?: Audio

  gainValue = 0.7

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

  equals(other?: this) {
    return !other
      || (this.gainValue === other.gainValue
        && super.equals(other))
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
    schedulerNode?: SchedulerNode
    startTime?: number
    fftSize = 32
    audio?: Audio

    appAudio?: Audio
    gainNode?: GainNode
    gainValue?: number
    analyserNode?: AnalyserNode
    bytes?: Uint8Array
    freqs?: Uint8Array
    workerBytes?: Uint8Array
    workerFreqs?: Uint8Array

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
    headerView?: JSX.Element
    presetsView?: JSX.Element

    // refs
    saveEl?: HTMLDivElement

    // saves/history
    nextSaveEmoji = randomName(emoji)

    // optimizations
    // presetsChecksum?: string
    // machinesChecksum?: string
  },

  function actions({ $, fns, fn }) {
    let tick = () => { }

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

          const json = JSON.parse(serializedSave!)
          const obj = deserialize(json) as Save

          console.log('load:', saveId, obj)

          if (Array.isArray(obj.machines)) {
            obj.machines = new List({ items: obj.machines })
          }

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

        if (!machines.items.length) {
          machines = machines
            .add($.app)
            .add(defaultMachines.mono.copy())
            .add(defaultMachines.scheduler.copy())
        }

        $.machines = machines
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

      start = () => {
        $.machines.items
          .filter((machine) =>
            // @ts-ignore
            machine.kind !== 'app' && 'methods' in machine && 'start' in machine.methods)
          .forEach(({ methods: { start } }: any) => start())
      }

      stop = () => {
        $.machines.items
          .filter((machine) =>
            // @ts-ignore
            machine.kind !== 'app' && 'methods' in machine && 'start' in machine.methods)
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

      setSliderNormal = fn(({ audio }) => (sliderId: string, newNormal: number) => {
        if (sliderId === 'vol') {
          audio.setParam(audio.gainNode.gain, newNormal)
          this.setGainValue('app', newNormal)
        }
        return newNormal
      })

      onWheel = fn(() => (ev: WheelEvent) => {
        ev.preventDefault?.()
        ev.stopPropagation?.()

        const normal = $.app.gainValue

        const newNormal = clamp(0, 1, (normal ?? 0)
          + Math.sign(ev.deltaY) * (
            0.01
            + 0.10 * Math.abs(ev.deltaY * 0.005) ** 1.05
          )
        )

        $.sliderScene.updateNormalMap.get('app', 'vol')?.(newNormal)

        return this.setSliderNormal('vol', newNormal)
      })

      analyseStop = () => {
        animRemoveSchedule(tick)
      }

      analyseStart =
        fn(({ analyserNode, bytes, freqs, workerBytes, workerFreqs }) => {

          tick = () => {
            analyserNode.getByteTimeDomainData(bytes)
            analyserNode.getByteFrequencyData(freqs)
            workerBytes.set(bytes)
            workerFreqs.set(freqs)
            animSchedule(tick)
          }

          return () => {
            animSchedule(tick)
          }
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
        overflow-y: scroll;
      }
      `

      document.head.appendChild(bodyStyle)

      $.css = /*css*/`
      & {
        display: flex;
        flex-flow: ${flow} nowrap;
        align-items: center;
        background: #000;
        max-${dim}: 100%;
        min-${oppDim}: 100%;
        padding-${padDim}: 65${viewportDim};
      }

      [part=header] {
        position: sticky;
        left: 0;
        top: 0;
        z-index: 99999;
        background: #001d;
        ${dim}: 100%;
      }

      ${Spacer} {
        &::part(handle) {
          height: calc(100% - 45px);
        }
      }

      [part=app-side] {
        position: fixed;
        right: 0;
        top: 45px;
        max-height: 1vh;
        bottom: 0;
        z-index: 99999;
        background: #001d;
      }

      [part=app-presets] {
        max-height: 100px !important;
        height: 100px !important;
        min-height: 100px !important;
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

      [part=shorten-url] {
        all: unset;
        width: 72px;
        height: 45px;
        display: inline-flex;
        justify-content: center;
        margin: 0;
        color: #556;
        cursor: pointer;
        &:hover {
          color: #fff;
          background-color: #aaf3;
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

      [part=main-view] {
        display: flex;
        position: relative;
        max-width: 95%;
        width: 100%;
        height: 100%;
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

    fx(function updateAppProps({ app, appAudio }) {
      app.methods = $
      app.audio = appAudio
      $.gainValue = app.gainValue

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

    fx(async function createAudio({ audioContext, fftSize, schedulerNode }) {
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

      const gainNode = $.gainNode = await gainNodePool.acquire()

      gainNode.connect(audioContext.destination)

      $.audio = new Audio({
        audioContext,
        fftSize,
        gainNode,
        schedulerNode,
        gainNodePool,
        monoNodePool,
        groupNodePool,
        analyserNodePool,
      })

      $.audio.setParam(gainNode.gain, $.gainValue ?? 0.7)

      return () => {
        gainNode.disconnect(audioContext.destination)
        gainNodePool.release(gainNode)
      }
    })

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

    fx(function updatePlayingState({ machines }) {
      $.setMachineState('app',
        machines.items.filter((machine) => machine.kind === 'mono' && machine.state === 'running').length
          ? 'running'
          : 'suspended'
      )
    })

    fx(async function createAnalyserNode({ audio }) {
      const analyserNode = $.analyserNode = await audio.analyserNodePool.acquire()

      return () => {
        audio.analyserNodePool.release(analyserNode)
      }
    })

    fx(function createAppAudio({ audio, analyserNode, gainNode, workerBytes, workerFreqs }) {
      gainNode.connect(analyserNode)

      $.appAudio = new Audio({
        ...audio,
        gainNode,
        analyserNode,
        workerBytes,
        workerFreqs,
      })

      return () => {
        gainNode.disconnect(analyserNode)
      }
    })

    fx(function startOrStopAnalyser({ state }) {
      if (state === 'running' || state === 'preview') {
        $.analyseStart()
      } else {
        $.analyseStop()
      }
    })

    fx(function createAnalyserBytes({ analyserNode }) {
      $.bytes = new Uint8Array(analyserNode.fftSize)
      $.freqs = new Uint8Array(analyserNode.frequencyBinCount)
    })

    fx(function createWorkerBytes({ bytes, freqs }) {
      $.workerBytes = new Uint8Array(new SharedArrayBuffer(bytes.byteLength))
        .fill(128) // center it at 128 (0-256)
      $.workerFreqs = new Uint8Array(new SharedArrayBuffer(freqs.byteLength))
    })

    fx(function drawAddButton() {
      $.addButtonView = <div part="add-button">
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

    fx(function drawHeader({ savesView }) {
      $.headerView = <div part="header">
        {savesView}
      </div>
    })

    fx(function drawPresets({ savesView, presets, size, align }) {
      $.presetsView = <PresetsView part="app-presets" app={$} id="app" presets={presets as any} />
    })

    fx(function updateAutoSave({ lastSave }) {
      if (lastSave) {
        $.isAutoSave = lastSave.isAutoSave || false
      }
    })

    fx(function listenOnWindowPopState() {
      return on(window, 'popstate')($.onWindowPopState)
    })

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

        <div style="display: flex">
          <Button part="shorten-url"
            title="Share project"
            onClick={() => {
              $.getShort().then((shortId) => {
                prompt(
                  'Here is your short url:',
                  `https://play.${location.hostname}/${shortId.split('-').pop()}`
                )
              })
            }}>
            <IconSvg class="topbar" set="feather" icon="send" />
          </Button>

          <button
            title={!isAutoSave ? "You need to make some changes to be able to save." : "Click to save.\nMiddle or right click for another icon"}
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
      </div>
    })

    fx(function drawApp({ host, machines, itemsView, headerView, presetsView, state, workerBytes, workerFreqs }) {
      if (state === 'init') return

      // {/* <div>
      //     <Button onClick={() => { }}>
      //       <IconSvg class="small" set="feather" icon="minimize-2" />
      //     </Button>
      //     <Button onClick={() => { }}>
      //       <IconSvg class="small" set="feather" icon="maximize-2" />
      //     </Button>
      //   </div> */}
      $.view = <>
        {headerView}
        <MainView
          part="main-view"
          app={$}
          machines={machines}
          workerBytes={workerBytes}
          workerFreqs={workerFreqs}
          presetsView={presetsView}
          itemsView={itemsView} />
      </>
    })
  })
)

const MainView = web('main-view', view(class props {
  app!: AppContext
  machines!: List<Machine | AudioMachine | MonoMachine>
  workerBytes!: Uint8Array
  workerFreqs!: Uint8Array
  itemsView!: JSX.Element
  presetsView!: JSX.Element
}, class local {
  host = element
}, function actions() { return ({}) }, function effects({ $, fx }) {

  fx(({ host, app, machines, itemsView, presetsView, workerBytes, workerFreqs }) => {
    $.view = <Spacer align="x" initial={[0, 0.35]} layout={host} id="app-spacer" part="app-spacer">
      <SideView
        part="app-side"
        app={app}
        machines={machines}
        workerBytes={workerBytes}
        workerFreqs={workerFreqs}
        presetsView={presetsView}
      />
      {itemsView}
    </Spacer>
  })
}))

const SideView = web('side-view', view(class props {
  app!: AppContext
  machines!: List<Machine | AudioMachine | MonoMachine>
  workerBytes!: Uint8Array
  workerFreqs!: Uint8Array
  presetsView!: JSX.Element
}, class local {
  host = element
}, function actions() { return ({}) }, function effects({ $, fx }) {

  fx(({ host, app, machines, presetsView, workerBytes, workerFreqs }) => {
    $.view = <Spacer align="y" initial={[0, 0.44]} layout={host} id="app-side-spacer">
      <MixerView
        app={app}
        machines={machines}
        workerBytes={workerBytes}
        workerFreqs={workerFreqs}
      />
      {presetsView}
    </Spacer>
  })
}))
