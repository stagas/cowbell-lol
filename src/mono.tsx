/** @jsxImportSource minimal-view */

import { element, view, web } from 'minimal-view'

import { CanvyElement } from 'canvy'
import { Scalar } from 'geometrik'
import { MonoNode } from 'mono-worklet'

import { App } from './app'
import { Code } from './code'
import { MachineControls } from './machine-controls'
import { MachineData } from './machine-data'
import { Preset, Presets } from './presets'
import { SliderParam } from './slider'
import { Sliders } from './sliders'
import { Spacer } from './spacer'
import { copySliders, removeSliderArgsFromCode } from './util/args'
import { setParam } from './util/audio'
import { checksum } from './util/checksum'
import { Detail } from './util/detail'
import { markerForSlider } from './util/marker'
import { Wavetracer } from './wavetracer'

const { clamp } = Scalar

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

export interface MonoDetail {
  editorValue: string
  sliders?: Map<string, SliderParam>
}

export const Mono = web('mono', view(
  class props extends MachineData<MonoDetail> {
    app!: App
    machine!: MachineData<MonoDetail>
  }, class local {
  host = element

  monoNode?: MonoNode
  monoCode!: string
  gainNode?: GainNode

  editor!: CanvyElement
  errorMarkers?: any[] = []

  sliders?: InstanceType<typeof Sliders.Element>
  detail?: Detail<MonoDetail>
}, ({ $, fx, fn, deps, refs }) => {
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

  fx.raf(({ host, state }) => {
    host.setAttribute('state', state)
  })

  fx(({ audioNode }) => {
    $.monoNode = audioNode as any
  })

  fx(({ audioContext, analyserNode, monoNode }) => {
    const gainNode = $.gainNode = new GainNode(audioContext, { channelCount: 1, gain: 0 })
    monoNode.connect(gainNode)
    monoNode.connect(analyserNode)
    gainNode.connect(audioContext.destination)

    return () => {
      setParam(audioContext, gainNode.gain, 0)
      setTimeout(() => {
        gainNode.disconnect(audioContext.destination)
        monoNode.disconnect(gainNode)
      }, 50)
    }
  })

  let prev: any
  const compile = fn(({ app, id, monoNode }) => async (monoCode: string) => {
    try {
      // TODO: make task by code and return same promise?
      if (
        monoNode.code
        && (monoCode === monoNode.code
          || ($.detail?.data.sliders
            && (
              (removeSliderArgsFromCode($.detail.data.sliders, monoCode)
                === removeSliderArgsFromCode($.detail.data.sliders, monoNode.code)
              ))))) return

      prev ??= $.state

      app.setMachineState(id, 'compiling')

      await monoNode.setCode(monoCode)

      localStorage.monoCode = monoCode

      // @ts-ignore $.state might have changed during our await above but TS
      // has narrowed it down to 'compiling' and warns this path will always be true.
      if ($.state !== 'running') {
        if (prev === 'running') {
          start()
        } else {
          app.setMachineState(id, 'suspended')
          monoNode.suspend()
        }
      }

      prev = null
    } catch (error) {
      console.log(error)
      app.setMachineState(id, 'errored')
    }
  })

  const updateEditorValueArgs =
    fn(({ audioContext, editor, monoNode }) =>
      function updateEditorValueArgs(
        editorValue: string,
        targetSliders?: Map<string, SliderParam>,
        sourceSliders: Map<string, SliderParam> | undefined = targetSliders
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

              const { monoParam, audioParam } = monoNode.params.get(slider.id)!

              setParam(
                audioContext,
                audioParam,
                monoParam.normalize(parseFloat(newDefault))
              )

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

        return new Detail<MonoDetail>({ editorValue, sliders })
      })

  const updateSliders = fn(({ app, id, editor, monoNode }) => () => {
    if (!monoNode.vmParams) return

    const sliders = new Map(monoNode.vmParams.map((p) => [p.id.toString(), {
      value: p.defaultValue,
      min: p.minValue,
      max: p.maxValue,
      hue: checksum(p.id) % 360,
      id: p.id.toString(),
      name: p.id.split('/').pop()!,

      source: p.source,
      sourceIndex: p.sourceIndex,
    }]))

    return sliders
  })

  const start = fn(({ id, app, audioContext, analyserNode, monoNode, gainNode }) => () => {
    setParam(audioContext, gainNode.gain, 1)
    monoNode.connect(analyserNode)
    monoNode.resume()
    app.setMachineState(id, 'running')
  })

  const stop = fn(({ id, app, audioContext, analyserNode, monoNode, gainNode }) => () => {
    if ($.state === 'suspended') return
    setParam(audioContext, gainNode.gain, 0)
    try {
      monoNode.disconnect(analyserNode)
    } catch (err) { console.warn(err) }
    try {
      monoNode.suspend()
    } catch (err) { console.warn(err) }

    app.setMachineState(id, 'suspended')
  })

  fx(({ id, app, editor, selectedPresetId }) => {
    if (!selectedPresetId) return

    const machine = app.machines.getById(id) as MachineData<MonoDetail>
    if (!machine.presets.hasId(selectedPresetId)) return

    const { detail } = machine.presets.getById(selectedPresetId)
    if (!detail.data.sliders) return

    let editorValue = editor.value
    if (editorValue !== detail.data.editorValue) {
      editor.setValue(editorValue = detail.data.editorValue)

      app.setPresetDetailData(id, { editorValue })
    }

    const errorMarkers = $.errorMarkers ?? []

    let paramMarkers = [...detail.data.sliders.values()].map(markerForSlider)

    editor.setMarkers([...errorMarkers, ...paramMarkers])

    const newDetail = updateEditorValueArgs(editorValue, detail.data.sliders)

    if (newDetail && !newDetail.equals(detail)) {
      paramMarkers = [...newDetail.data.sliders!.values()].map(markerForSlider)

      editor.setMarkers([...errorMarkers, ...paramMarkers])

      $.detail = newDetail
      app.setPresetDetailData(id, newDetail.data, true)
    }
  })

  const setSliderNormal = fn(({ id, app, editor, errorMarkers }) => function setSliderNormal(sliderId: string, newNormal: number) {
    const machine = app.machines.getById(id)

    const preset = machine.selectedPresetId && machine.presets.getById(machine.selectedPresetId) as Preset<MonoDetail>

    const detail = preset ? preset.detail : $.detail!
    if (!detail.data.sliders) return newNormal

    const newSliders = new Map([...detail.data.sliders].map(([key, slider], i) => {
      if (sliderId === slider.id) {
        return [key, {
          ...slider,
          value: newNormal * (slider.max - slider.min) + slider.min
        }]
      } else {
        return [key, slider]
      }
    }))

    let paramMarkers = [...detail.data.sliders.values()].map(markerForSlider)

    editor.setMarkers([...errorMarkers, ...paramMarkers])

    const newDetail = updateEditorValueArgs(editor.value, newSliders)

    if (newDetail && !newDetail.equals(detail)) {
      paramMarkers = [...newDetail.data.sliders!.values()].map(markerForSlider)

      editor.setMarkers([...errorMarkers, ...paramMarkers])

      $.detail = newDetail
      app.setPresetDetailData(id, newDetail.data)

    }

    return newNormal
  })

  const onWheel = fn(({ app, id, editor }) => function onWheel(ev: WheelEvent, sliderId?: string) {
    if (sliderId || (!sliderId && editor.hoveringMarkerIndex != null)) {
      const machine = app.machines.getById(id)
      const preset = machine.selectedPresetId && machine.presets.getById(machine.selectedPresetId) as Preset<MonoDetail>

      const detail = preset ? preset.detail : $.detail!

      if (!detail.data.sliders) return

      sliderId ??= [...detail.data.sliders.keys()].at(editor.hoveringMarkerIndex as number)

      if (sliderId != null) {
        ev.preventDefault?.()
        ev.stopPropagation?.()

        const slider = detail.data.sliders.get(sliderId)!

        const normal = (slider.value - slider.min) / (slider.max - slider.min)

        const newNormal = clamp(0, 1, (normal ?? 0)
          + Math.sign(ev.deltaY) * (
            0.01
            + 0.10 * Math.abs(ev.deltaY * 0.005) ** 1.05
          )
        )

        return setSliderNormal(slider.id, newNormal)
      }
    }
  })

  fx(({ app, id, editor }) => {
    app.setMachineControls(id, { start, stop, compile, editor, updateSliders, onWheel, setSliderNormal, updateEditorValueArgs })
  })

  let initial = true
  fx(({ editor, detail, monoNode }) => {
    if (initial && (!editor.value || $.state !== 'init') && detail && detail.data.editorValue) {
      initial = false
      editor.setValue(detail.data.editorValue)
      if ($.state === 'suspended') {
        monoNode.suspend()
      }
      compile(detail.data.editorValue)
    }
  })

  fx(({ app, id, editor: _, selectedPresetId, presets }) => {
    if (selectedPresetId) {
      const preset = presets.getById(selectedPresetId)
      $.detail = preset.detail
    } else {
      if (!$.detail) {
        app.setPresetDetailData(id, {
          editorValue: localStorage.monoCode || monoDefaultEditorValue
        })
      }
    }
  })

  fx(({ app, id, editor, monoCode }) => {
    if (editor.value !== monoCode) {
      app.setPresetDetailData(id, { editorValue: monoCode })
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

  fx(({ app, audioContext, workerBytes, id, host, state, presets, selectedPresetId, spacer }) => {
    $.view = <>
      <Spacer part="spacer" app={app} id={id} layout={host} initial={spacer}>

        <Code
          part="editor"
          style="border-bottom: 2px solid transparent;"
          editorScene={app.editorScene}
          onWheel={onWheel}
          onEnterMarker={onEnterMarker}
          onLeaveMarker={onLeaveMarker}
          editor={deps.editor}
          value={deps.monoCode}
        />

        <div part="side">
          <MachineControls app={app} {...$.machine} />

          <Sliders
            ref={refs.sliders}
            part="sliders"
            machine={$.machine}
            sliders={$.detail && $.detail.data.sliders ? $.detail.data.sliders : new Map()}
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

        <Presets
          part="presets"
          style="border-bottom: 2px solid transparent;"
          app={app}
          id={id}
          presets={presets.items}
          selectedPresetId={selectedPresetId}
        />

      </Spacer>
    </>
  })
}))
