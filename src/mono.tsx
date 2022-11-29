/** @jsxImportSource minimal-view */

import { element, queue, State, view, web } from 'minimal-view'

import { AbstractDetail, BasePresets } from 'abstract-presets'
import { CanvyElement } from 'canvy'
import { debugObjectMethods, pick } from 'everyday-utils'
import { Scalar } from 'geometrik'
import { MonoNode } from 'mono-worklet'

import { AppLocal, HEIGHTS, SPACERS } from './app'
import { Audio } from './audio'
import { Code, EditorDetailData } from './code'
import { AudioMachine, MachineKind, MachineState } from './machine'
import { MachineControls } from './machine-controls'
import { Preset, PresetsView } from './presets'
import { Slider, SliderUpdateNormalMap } from './slider'
import { areSlidersEqual, Sliders, SlidersDetailData } from './sliders'
import { Spacer } from './spacer'
import { copySliders, parseArgsRegExp, removeSliderArgsFromCode } from './util/args'
import { checksum } from './util/checksum'
import { markerForSlider } from './util/marker'
import { Wavetracer } from './wavetracer'

const { clamp } = Scalar

export type MonoDetailData = EditorDetailData & Partial<SlidersDetailData>

export class MonoDetail extends AbstractDetail<MonoDetailData> {
  merge(other: MonoDetail | MonoDetail['data']) {
    if (other instanceof MonoDetail) {
      other = other.data
    }

    const data = { ...this.data, ...other }

    if ('sliders' in data) {
      data.sliders = copySliders(data.sliders)
    }

    return new MonoDetail(data)
  }

  equals(other: MonoDetail | MonoDetail['data']) {
    if (other === this) return true

    if (!other || !this) return false

    if (other instanceof MonoDetail) other = other.data

    if (other.editorValue !== this.data.editorValue) return false

    if ('sliders' in other) {
      if ('sliders' in this.data) {
        return areSlidersEqual(other.sliders, this.data.sliders)
      }
      return false
    }

    return true
  }

  satisfies(other: MonoDetail | MonoDetail['data']) {
    return this.equals(other)
  }
}

export class MonoPresets extends BasePresets<MonoDetail, Preset<MonoDetail>> {
  constructor(data: Partial<MonoPresets> = {}) {
    super(data, Preset, MonoDetail)
  }
}

export class MonoMethods {
  declare start: () => void
  declare stop: () => void
  declare compile: (code: string, updateSliders?: boolean) => Promise<void>
  declare updateSliders: () => Sliders | undefined
  declare onWheel: (ev: WheelEvent, sliderId?: string) => void
  declare updateMarkers: (sliders: Sliders) => void
  declare updateSliderNormals: (sliders: Sliders) => void
  declare setSliderNormal: (sliderId: string, newNormal: number) => number
  declare updateEditorValueArgs: (
    editorValue: string,
    targetSliders?: Sliders,
    sourceSliders?: Sliders
  ) => MonoDetail | undefined
  declare reconcilePresets: (
    next: Preset<MonoDetail> | null,
    prev: Preset<MonoDetail> | null,
    nextDetail?: MonoDetail | null,
    prevDetail?: MonoDetail | null,
    byClick?: boolean,
    byGroup?: boolean
  ) => void
  declare compileAndUpdateSliders: (nextPreset: Preset<MonoDetail>) => void

  constructor(state: State<MonoProps & MonoLocal>) {
    const { $, fn } = state

    // function getCodeWithoutSliderArgs(detail: Detail<MonoDetail>) {
    //   return removeSliderArgsFromCode(
    //     detail.data.sliders,
    //     detail.data.editorValue
    //   )
    // }
    function getCodeWithoutArgs(detail: MonoDetail) {
      return detail.data.editorValue.replace(parseArgsRegExp, '')
    }

    function getArgTokens(detail: MonoDetail) {
      return [...detail.data.editorValue.matchAll(parseArgsRegExp)]
    }

    function getSliderNames(detail: MonoDetail) {
      return new Map([...detail.data.sliders!.values()]
        .map((x) => [x.name, x]))
    }

    function argTokensSatisfyDetail(
      argTokens: RegExpMatchArray[],
      detail: MonoDetail,
      sliderNames: Sliders
    ) {
      return !!argTokens.length
        && argTokens.length === detail.data.sliders?.size
        && argTokens.every(([, id]) =>
          sliderNames.has(id)
        )
    }

    function replaceArgTokensInSliders(argTokens: RegExpMatchArray[], detail: MonoDetail) {
      const sliderNames = getSliderNames(detail)

      if (argTokensSatisfyDetail(argTokens, detail, sliderNames)) {
        const nextSliders =
          copySliders(detail.data.sliders!)

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

        return nextSliders
      }
    }

    function doMatchCodeToSliders(nextDetail: MonoDetail, prevDetail: MonoDetail) {
      const argTokens = getArgTokens(nextDetail)
      return replaceArgTokensInSliders(argTokens, prevDetail)
    }

    function updateEditorFromDetailWithSliders(
      nextDetail: MonoDetail | null | undefined,
      prevDetail: MonoDetail | null
    ) {
      try {
        if (
          prevDetail
          && nextDetail
          && !$.methods.updateEditorValueArgs(
            prevDetail.data.editorValue,
            nextDetail.data.sliders,
            prevDetail.data.sliders
          )) {
          return true
        }
      } catch (error) {
        // console.warn('NOT AN ERROR', error)
      }
      return false
    }

    this.compileAndUpdateSliders =
      fn(({ app, id, editor }) => (nextPreset: Preset<MonoDetail>) => {

        $.methods.compile(nextPreset.detail.data.editorValue) // , false ???
          .then(() => {
            const newSliders = $.methods.updateSliders()

            if (
              newSliders
              && editor.value === nextPreset.detail.data.editorValue
            ) {
              $.preset = app.methods.updatePresetById(id, nextPreset.id, {
                detail: nextPreset.detail.merge({
                  ...nextPreset.detail.data,
                  sliders: newSliders
                })
              }) as Preset<MonoDetail>

              $.methods.updateMarkers(newSliders)
            }
          })
      })

    this.reconcilePresets = fn(({ app, id, editor, monoNode, audio: { setParam } }) => function reconcilePresets(
      next,
      prev,
      nextDetail,
      prevDetail,
      byClick,
      byGroup
    ) {
      if (next && prev) {
        const sameCode =
          next.detail.data.editorValue === prev.detail.data.editorValue

        let nextSliders = next.detail.data.sliders

        if (!sameCode) {
          const prevCodeNoArgs = getCodeWithoutArgs(prev.detail)
          const nextCodeNoArgs = getCodeWithoutArgs(next.detail)

          if (prevCodeNoArgs === nextCodeNoArgs) {
            if (updateEditorFromDetailWithSliders(next.detail, prev.detail)) {
              editor.setValue(next.detail.data.editorValue)
            }
            else {
              nextSliders = doMatchCodeToSliders(next.detail, prev.detail)
              if (nextSliders && !areSlidersEqual(nextSliders, next.detail.data.sliders)) {
                queueMicrotask(() => {
                  app.methods.setPresetDetailData(id, {
                    ...next.detail.data, sliders: nextSliders!
                  })
                })
              }
            }
          } else {
            nextSliders = doMatchCodeToSliders(next.detail, prev.detail)
            editor.setValue(next.detail.data.editorValue)
            queueMicrotask(() => {
              $.methods.compileAndUpdateSliders(next)
            })
          }

          if (nextSliders) {
            nextSliders.forEach((slider) => {
              if (monoNode.params.has(slider.id)) {
                const { monoParam, audioParam } = monoNode.params.get(slider.id)!

                setParam(audioParam, monoParam.normalize(slider.value))
              }
            })
            $.methods.updateMarkers(nextSliders)
          }
        }
        // else {
        // }
        if (nextSliders && byGroup) $.methods.updateSliderNormals(nextSliders)

        return
      }

      if (next) $.methods.compileAndUpdateSliders(next)
    })

    let prev: any
    this.compile = fn(({ app, id, monoNode }) => async (monoCode: string) => {
      try {
        // TODO: make task by code and return same promise?
        if (
          monoNode.code
          && (monoCode === monoNode.code
            || ($.preset?.detail.data.sliders
              && (
                (removeSliderArgsFromCode($.preset.detail.data.sliders, monoCode)
                  === removeSliderArgsFromCode($.preset.detail.data.sliders, monoNode.code)
                ))))) return

        prev ??= $.state

        app.methods.setMachineState(id, 'compiling')

        await monoNode.setCode(monoCode)

        localStorage.monoCode = monoCode

        // @ts-ignore $.state might have changed during our await above but TS
        // has narrowed it down to 'compiling' and warns this path will always be true.
        if ($.state !== 'running') {
          if (prev === 'running') {
            $.methods.start()
          } else {
            app.methods.setMachineState(id, 'suspended')
            monoNode.suspend()
          }
        }

        prev = null
      } catch (error) {
        console.log(error)
        app.methods.setMachineState(id, 'errored')
      }
    })

    this.updateEditorValueArgs =
      fn(({ monoNode, audio: { setParam }, editor }) =>
        function updateEditorValueArgs(
          editorValue: string,
          targetSliders?: Map<string, Slider>,
          sourceSliders: Map<string, Slider> | undefined = targetSliders
        ) {
          if (!targetSliders || !sourceSliders) return

          if (targetSliders.size !== sourceSliders.size) {
            return
          }

          // work on a copy of source sliders
          const sliders = copySliders(sourceSliders)

          targetSliders.forEach(function applySliderValueToEditorArg(targetSlider, key) {
            const slider = sliders.get(key)!

            if ('default' in slider.source) {
              const newDefault = `${parseFloat(targetSlider.value.toFixed(3))}`

              if (`${parseFloat(parseFloat(slider.source.default).toFixed(3))}`
                !== newDefault) {
                if (monoNode.params.has(slider.id)) {
                  const { monoParam, audioParam } = monoNode.params.get(slider.id)!

                  const normal = monoParam.normalize(parseFloat(newDefault))
                  setParam(audioParam, normal)
                }

                const argMinusDefault = slider.source.arg.slice(0, -slider.source.default.length)

                const newArg = `${argMinusDefault}${newDefault}`

                const diff = newArg.length - slider.source.arg.length

                const [start, end] = [
                  slider.sourceIndex,
                  slider.sourceIndex + slider.source.arg.length,
                ]

                const newValue = editorValue.slice(0, start)
                  + newArg
                  + editorValue.slice(end)

                editor.replaceChunk({
                  start,
                  end,
                  text: newArg,
                  code: editorValue
                })

                if (editor.value !== newValue) {
                  throw new Error('Not the expected code')
                }

                editorValue = newValue

                slider.source.default = newDefault
                slider.source.arg = newArg

                sliders.forEach((other) => {
                  if (other === targetSlider)
                    return
                  if (other.sourceIndex > start) {
                    other.sourceIndex += diff
                  }
                })
              }
            }
          })

          return new MonoDetail({ editorValue, sliders })
        })

    this.updateSliders = fn(({ monoNode }) => () => {
      if (!monoNode.vmParams) return

      const sliders = new Map(monoNode.vmParams.map((p) => [p.id.toString(), new Slider({
        value: p.defaultValue,
        min: p.minValue,
        max: p.maxValue,
        hue: checksum(p.id) % 360,
        id: p.id.toString(),
        name: p.id.split('/').pop()!,

        source: p.source,
        sourceIndex: p.sourceIndex,
      })]))

      return sliders
    })

    this.updateSliderNormals = (sliders) => {
      sliders.forEach(function updateSliderNormalEach(slider) {
        SliderUpdateNormalMap.get(slider.id)?.(slider.normal)
      })
    }

    this.start = fn(({ id, app, monoNode, gainNode, audio: { analyserNode, setParam } }) => () => {
      setParam(gainNode.gain, 1)
      monoNode.connect(analyserNode)
      monoNode.resume()
      app.methods.setMachineState(id, 'running')
    })

    this.stop = fn(({ id, app, monoNode, gainNode, audio: { analyserNode, setParam } }) => () => {
      if ($.state === 'suspended') return
      setParam(gainNode.gain, 0)
      try {
        monoNode.disconnect(analyserNode)
      } catch (err) { console.warn(err) }
      try {
        monoNode.suspend()
      } catch (err) { console.warn(err) }

      app.methods.setMachineState(id, 'suspended')
    })

    this.updateMarkers = fn(({ editor }) => function updateMarkers(sliders: Map<string, Slider>) {
      const paramMarkers = [...sliders.values()].map(markerForSlider)

      editor.setMarkers([...paramMarkers, ...($.errorMarkers ?? [])])
    })

    this.setSliderNormal = fn(({ id, app, editor }) => function setSliderNormal(sliderId: string, newNormal: number) {
      const machine = app.machines.getById<MonoMachine>(id)

      const preset = machine.presets.selectedPreset ?? $.preset

      if (!preset || !preset.detail.data.sliders) return newNormal

      const newSliders = new Map([...preset.detail.data.sliders].map(([key, slider], i) => {
        if (sliderId === slider.id) {
          return [key, new Slider({
            ...slider.toJSON(),
            value: newNormal * (slider.max - slider.min) + slider.min
          })]
        } else {
          return [key, slider]
        }
      }))

      // NOTE: this was put here because it was solving
      // some inconsistency which seems to be gone now
      // with recent changes, but left here as a reminder
      // if we encounter issues with the markers this would
      // be to be enabled again.
      // it was removed because it was causing perf issues.
      // $.methods.updateMarkers(preset.detail.data.sliders)

      const newDetail =
        $.methods.updateEditorValueArgs(editor.value, newSliders)

      if (newDetail && !newDetail.equals(preset.detail)) {
        $.methods.updateMarkers(newDetail.data.sliders!)
        $.preset = app.methods.setPresetDetailData(id, newDetail.data)
      }

      return newNormal
    })

    this.onWheel = fn(({ app, id, editor }) => function onWheel(ev: WheelEvent, sliderId?: string) {
      if (sliderId || (!sliderId && editor.hoveringMarkerIndex != null)) {
        const machine = app.machines.getById<MonoMachine>(id)
        const preset = machine.presets.selectedPreset ?? $.preset

        if (!preset || !preset.detail.data.sliders) return

        sliderId ??= [...preset.detail.data.sliders.keys()].at(editor.hoveringMarkerIndex as number)

        if (sliderId != null) {
          ev.preventDefault?.()
          ev.stopPropagation?.()

          const slider = preset.detail.data.sliders.get(sliderId)!

          const normal = (slider.value - slider.min) / (slider.max - slider.min)

          const newNormal = clamp(0, 1, (normal ?? 0)
            + Math.sign(ev.deltaY) * (
              0.01
              + 0.10 * Math.abs(ev.deltaY * 0.005) ** 1.05
            )
          )

          SliderUpdateNormalMap.get(slider.id)?.(newNormal)

          return $.methods.setSliderNormal(slider.id, newNormal)
        }
      }
    })

    // debugObjectMethods(this)

    return this
  }
}

export class MonoMachine extends AudioMachine<MonoPresets> {
  kind: MachineKind = 'mono'
  height = HEIGHTS.mono
  spacer = SPACERS.mono
  presets = new MonoPresets()

  declare methods: MonoMethods

  constructor(data: Partial<MonoMachine>) {
    super(data)
    Object.assign(this, data)
  }

  toJSON() {
    return pick(this, [
      'id',
      'groupId',
      'kind',
      'height',
      'spacer',
      'presets',
      'outputs',
    ])
  }
}

const monoDefaultEditorValue = `\\\\\\ a track \\\\\\
#:6,3;
write_note(x,y)=(
  #=(t,note_to_hz(x),y/127);
  0
);
midi_in(op=0,x=0,y=0)=(
  op==144 && write_note(x,y)
);
play(nt,x,y)=(
  saw(x/4)*env(nt, 100, 30)*y
);
synth(
  'cut[50f..5k]=500,
  'q[.1..0.95]=0.125
)=(
  x=tanh(
    lpf(
      #::play:sum*5,
      cut+300*sine(.125),
      q
    )*3
  );
  x=x+daverb(x)*0.4;
  x
);
f()=synth();
`

export class MonoProps {
  id!: string
  app!: AppLocal
  audio!: Audio
  machine!: MonoMachine
}

export class MonoLocal {
  host = element

  methods!: MonoMethods

  state?: MachineState
  groupId?: string
  sliders?: InstanceType<typeof Sliders.Element>

  monoNode?: MonoNode
  gainNode?: GainNode

  preset: Preset<MonoDetail> | null = null
  presets?: MonoPresets

  editor?: CanvyElement
  errorMarkers?: any[] = []

  spacer?: number[]

  monoCode!: string

  presetsChecksum?: string
}

export const Mono = web('mono', view(MonoProps, MonoLocal, ({ $, fx, fn, deps, refs }) => {
  $.css = /*css*/`
  & {
    position: relative;
    display: flex;
    flex-flow: row wrap;
    height: 100%;
    width: 100%;
    max-height: 100%;
    max-width: 100%;
  }
  `

  $.methods = new MonoMethods($.self)

  fx.raf(({ host, state }) => {
    host.setAttribute('state', state)
  })

  fx(function calcPresetsChecksum({ presets }) {
    $.presetsChecksum = presets.selectedPresetId + presets.items.map(
      ({ id, isRemoved, isDraft, hue, name }) =>
        `${id}${hue}${name}${isRemoved ? 1 : 0}${isDraft ? 1 : 0}`
    ).join()
  })

  fx(({ id, audio: { audioContext, audioNode } }) => {
    $.monoNode = audioNode as MonoNode
    $.gainNode = new GainNode(audioContext, { channelCount: 1, gain: 0 })
  })


  fx(({ monoNode, gainNode, audio }) => {
    monoNode.connect(gainNode)
    monoNode.connect(audio.analyserNode)

    gainNode.connect(audio.audioContext.destination)

    return () => {
      audio.setParam(gainNode.gain, 0)
      setTimeout(() => {
        gainNode.disconnect(audio.audioContext.destination)
        monoNode.disconnect(gainNode)
      }, 50)
    }
  })

  fx(function updateMachineProps({ machine }) {
    machine.methods = $.methods
    $.presets = machine.presets
    $.spacer = machine.spacer
    $.state = machine.state
    $.groupId = machine.groupId
  })

  const offPresetsFx = fx(({ presets }) => {
    offPresetsFx()

    // TODO: fork eventemitter and have it use Set, so we can readd the
    // listener whenever "presets" change
    presets.on('select', $.methods.reconcilePresets as any)
  })

  let initial = true
  fx(({ editor, preset, monoNode, methods }) => {
    if (
      initial
      && (!editor.value || $.state !== 'init')
      && preset
      && preset.detail.data.editorValue
    ) {
      initial = false
      if ($.state === 'suspended') {
        monoNode.suspend()
      }

      editor.setValue(preset.detail.data.editorValue)

      if (preset.detail.data.sliders) {
        methods.updateMarkers(preset.detail.data.sliders)
      }

      methods.compileAndUpdateSliders(preset)
    }
  })

  fx(({ app, id, editor: _, presets }) => {
    const preset = presets.selectedPreset

    if (preset) {
      $.preset = preset
    } else {
      if (!$.preset) {
        $.preset = app.methods.setPresetDetailData(id, {
          editorValue: localStorage.monoCode || monoDefaultEditorValue
        })
      }
    }
  })

  fx(({ app, id, monoCode }) => {
    const preset =
      app.machines.getById<MonoMachine>(id).presets.selectedPreset

    if (!preset || preset.detail.data.editorValue !== monoCode) {
      const prev = $.preset
      $.preset = app.methods.setPresetDetailData(id, { editorValue: monoCode })
      $.methods.reconcilePresets($.preset, prev)
    }
  })

  const enterSlider = fn(({ sliders }) => (sliderIndex: number) => {
    sliders.shadowRoot!.querySelector('.active')?.classList.remove('active')
    sliders.shadowRoot!.querySelectorAll('x-slider')[sliderIndex].classList.add('active')
  })

  const leaveSlider = fn(({ sliders }) => (sliderIndex: number) => {
    sliders.shadowRoot!.querySelectorAll('x-slider')[sliderIndex].classList.remove('active')
  })

  const onEnterMarker = (ev: any) => {
    const { detail: { markerIndex } } = ev as any
    enterSlider(markerIndex)
  }

  const onLeaveMarker = (ev: any) => {
    const { detail: { markerIndex } } = ev as any
    leaveSlider(markerIndex)
  }

  fx(function drawMono({ app, audio: { audioContext, workerBytes }, id, groupId, methods, host, state, presetsChecksum: _, spacer }) {
    $.view = <>
      <Spacer part="spacer" setSpacer={app.methods.setSpacer} id={id} layout={host} initial={spacer}>

        <Code
          part="editor"
          style="border-bottom: 2px solid transparent;"
          editorScene={app.editorScene}
          onWheel={$.methods.onWheel}
          onEnterMarker={onEnterMarker}
          onLeaveMarker={onLeaveMarker}
          editor={deps.editor}
          value={deps.monoCode}
        />

        <div part="side">
          <MachineControls app={app} groupId={groupId} state={state} methods={methods} />

          <Sliders
            ref={refs.sliders}
            part="sliders"
            machine={$.machine}
            sliders={$.preset && $.preset.detail.data.sliders
              ? $.preset.detail.data.sliders
              : new Map()
            }
            running={state !== 'suspended'}
          />

          <Wavetracer
            part="waveform"
            id={`${id}-scroller`}
            kind="scroller"
            audioContext={audioContext}
            workerBytes={workerBytes}
            width={100}
            height={50}
            running={state !== 'suspended'}
          />
        </div>

        <PresetsView
          part="presets"
          style="border-bottom: 2px solid transparent;"
          app={app}
          id={id}
          presets={$.presets as any}
        />

      </Spacer>
    </>
  })
}))
