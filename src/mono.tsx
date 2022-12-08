/** @jsxImportSource minimal-view */

import { element, queue, view, web } from 'minimal-view'

import { AbstractDetail, BasePresets } from 'abstract-presets'
import { CanvyElement } from 'canvy'
import { cheapRandomId, pick } from 'everyday-utils'
import { Scalar } from 'geometrik'
import { MonoNode } from 'mono-worklet'

import { AppContext, SIZES, SPACERS } from './app'
import { Audio } from './audio'
import { Code, EditorDetailData } from './code'
import { AudioMachine, MachineCompileState, MachineKind, MachineState } from './machine'
import { MachineControls } from './machine-controls'
import { Preset, PresetsView } from './presets'
import { Slider } from './slider'
import { Sliders } from './sliders'
import { Spacer } from './spacer'
import { areSlidersCompatible, copySliders, parseArgsRegExp, parseFuncsRegExp, parseRangeRegExp } from './util/args'
import { checksum } from './util/checksum'
import { markerForSlider } from './util/marker'
import { Wavetracer } from './wavetracer'

const { clamp } = Scalar

export type MonoDetailData = EditorDetailData

export class MonoDetail extends AbstractDetail<MonoDetailData> {
  constructor(data: MonoDetail['data']) {
    if (data instanceof AbstractDetail) {
      data = data.data
    }
    super(pick(data, ['editorValue']))
    Object.assign(this.data, pick(data, ['editorValue']))
  }

  merge(other: MonoDetail | MonoDetail['data']) {
    if (other instanceof MonoDetail) {
      other = other.data
    }

    const data = { ...this.data, ...other }

    return new MonoDetail(data)
  }

  equals(other: MonoDetail | MonoDetail['data']) {
    if (!other) return false
    if (other === this) return true
    if (other instanceof MonoDetail) other = other.data
    if (other.editorValue === this.data.editorValue) return true
    return false
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

export class MonoMachine extends AudioMachine<MonoPresets> {
  kind: MachineKind = 'mono'
  size = SIZES.mono
  spacer = SPACERS.mono
  presets = new MonoPresets()

  gainValue = 0.7

  compileState: MachineCompileState = 'init'

  declare methods: typeof Mono.Context

  constructor(data: Partial<MonoMachine>) {
    super(data)
    Object.assign(this, data)
  }

  equals(other?: this) {
    return !other
      || (this.id === other.id
        && this.gainValue === other.gainValue
        && this.compileState === other.compileState
        && super.equals(other))
  }

  toJSON() {
    return pick(this, [
      'id',
      'groupId',
      'kind',
      'size',
      'spacer',
      'presets',
      'outputs',
      'gainValue',
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

export const Mono = web('mono', view(
  class props {
    id!: string
    app!: AppContext
    audio!: Audio
    machine!: MonoMachine
  },

  class local {
    instanceId = cheapRandomId()

    host = element

    state?: MachineState
    compileState?: MachineCompileState

    groupId?: string
    sliders?: InstanceType<typeof Sliders.Element>
    presetSliders: Sliders = new Map()

    monoNode?: MonoNode
    gainNode?: GainNode
    gainValue?: number

    preset: Preset<MonoDetail> | null = null
    presets?: MonoPresets

    editor?: CanvyElement
    errorMarkers?: any[] = []

    spacer?: number[]

    monoCode!: string

    showDeleteButton = false
    // presetsChecksum?: string
    // slidersChecksum = ''
  },

  function actions({ $, fn, fns }) {
    const sampleRate = 44100
    const beatSamples = 44100
    const bars = 4
    function argValueToNumber(t: string) {
      const isFloat = t.includes('.') || t.at(-1) == 'f'
      let parsed = parseFloat(`${t}`).toString()

      if (isFloat && !parsed.includes('.')) parsed += '.0'

      const number = parseFloat(parsed)
      const lastTwo = t.slice(-2)
      const lastOne = t.at(-1)

      if (lastTwo === 'ms')
        return number * sampleRate * 0.001
      else if (lastOne === 's')
        return number * sampleRate
      else if (lastOne === 'k')
        return number * 1000
      else if (lastOne === 'K')
        return number * 1024
      else if (lastOne === 'b')
        return number * beatSamples
      else if (lastOne === 'B')
        return number * beatSamples * bars

      return number
    }

    return fns(new class actions {
      getCodeWithoutArgs = (detail: MonoDetail) => {
        return detail.data.editorValue.replace(parseArgsRegExp, '')
      }

      getArgTokens = (detail: MonoDetail) => {
        return [...detail.data.editorValue.matchAll(parseArgsRegExp)]
      }

      getSliders = (detail: MonoDetail) => {
        const { editorValue } = detail.data

        const funcs = [...editorValue.matchAll(parseFuncsRegExp)]

        return new Map(
          funcs.flatMap((funcToken) => {
            const [, func, args] = funcToken
            const { index: funcIndex } = funcToken as { index: number }

            const argsWithoutComments = (args ?? '').replace(/\\.*/g, '')

            const argTokens =
              [...argsWithoutComments.matchAll(parseArgsRegExp)]
                .filter((value) => value.length)

            return argTokens.map((argToken) => {
              const [arg, name, range, value] = argToken
              // const { index: argTokenIndex } = argToken as { index: number }
              // const { index: sourceIndex } = argToken as { index: number }

              parseRangeRegExp.lastIndex = -1

              // eslint-disable-next-line no-sparse-arrays
              const [, min, max] = (parseRangeRegExp.exec(range) ?? [, 0, 1]) as string[]

              const exportId = `export/${func}/${name}`

              return [exportId, new Slider({
                value: argValueToNumber(value),
                min: argValueToNumber(min),
                max: argValueToNumber(max),
                hue: checksum(exportId) % 360,
                id: exportId,
                name,
                source: {
                  id: name,
                  arg,
                  range,
                  default: value,
                },
                sourceIndex: editorValue.indexOf(arg, funcIndex)
              })]
            })
          }))
      }

      updateEditorFromDetail = (
        nextDetail: MonoDetail | null | undefined,
        prevDetail: MonoDetail | null
      ) => {
        try {
          if (
            prevDetail
            && nextDetail
            && !this.updateEditorValueArgs(
              prevDetail.data.editorValue,
              this.getSliders(nextDetail),
              this.getSliders(prevDetail)
            )) {
            return true
          }
        } catch (error) {
          // console.warn('NOT AN ERROR', error)
        }
        return false
      }

      reconcilePresets = fn(({ app, id, editor, monoNode, audio: { setParam } }) => (
        next: Preset<MonoDetail> | null,
        prev: Preset<MonoDetail> | null,
        nextDetail?: MonoDetail | null,
        prevDetail?: MonoDetail | null,
        byClick?: boolean,
        byGroup?: boolean
      ) => {
        if ($.compileState === 'compiled' && next && prev && nextDetail && prevDetail) {
          const sameCode =
            next.detail.data.editorValue === prev.detail.data.editorValue

          const prevSliders = this.getSliders(prevDetail)
          const nextSliders = this.getSliders(nextDetail)

          if (!sameCode) {
            if (areSlidersCompatible(prevSliders, nextSliders)) {
              const prevCodeNoArgs = this.getCodeWithoutArgs(prev.detail)
              const nextCodeNoArgs = this.getCodeWithoutArgs(next.detail)
              if (prevCodeNoArgs === nextCodeNoArgs) {
                this.updateEditorFromDetail(nextDetail, prevDetail)
              } else {
                editor.setValue(nextDetail.data.editorValue)
                this.compile(next)
              }
            } else {
              editor.setValue(nextDetail.data.editorValue)
              this.compile(next)
            }
          }
        } else if (next) {
          this.compile(next)
        }
      })

      compile = fn(({ app, id, monoNode }) => async (
        preset: Preset<MonoDetail>
      ) => {
        const monoCode = preset.detail.data.editorValue

        try {
          app.setMachineCompileState(id, 'compiling')
          await monoNode.setCode(monoCode)
          app.setMachineCompileState(id, 'compiled')
          localStorage.monoCode = monoCode
        } catch (error) {
          console.log(error)
          app.setMachineCompileState(id, 'errored')
        }

        if ($.state === 'init') {
          app.setMachineState(id, 'suspended')
        }
      })

      updateEditorValueArgs =
        fn(({ monoNode, audio: { setParam }, editor }) => (
          editorValue: string,
          targetSliders?: Sliders,
          sourceSliders: Sliders | undefined = targetSliders
        ) => {
          if (!targetSliders || !sourceSliders) return

          if (targetSliders.size !== sourceSliders.size) {
            return
          }

          // TODO: most likely this is not necessary anymore
          // because we are always going to be deriving the sliders
          // from the editor's source directly so we don't need
          // to keep updating the Sliders map with the new values.
          //
          // work on a copy of source sliders
          const sliders = copySliders(sourceSliders)

          targetSliders.forEach((targetSlider, key) => {
            const slider = sliders.get(key)!

            if ('default' in slider.source!) {
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
                  slider.sourceIndex!,
                  slider.sourceIndex! + slider.source.arg.length,
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
                  if (other.sourceIndex! > start) {
                    other.sourceIndex! += diff
                  }
                })
              }
            }
          })

          return new MonoDetail({ editorValue })
        })

      updateSliders = fn(({ monoNode }) => () => {
        if (!monoNode.vmParams) return

        const sliders = new Map(monoNode.vmParams.map((p) => [p.id.toString(), new Slider({
          value: p.defaultValue,
          min: p.minValue,
          max: p.maxValue,
          hue: checksum(p.id) % 360,
          id: p.id.toString(),
          name: p.id.split('/').pop()!,
          sourceIndex: p.sourceIndex,
          source: {
            ...p.source
          },
        })]))

        return sliders
      })

      updateSliderNormals = fn(({ id }) => (sliders: Sliders) => {
        sliders.forEach(function updateSliderNormalEach(slider) {
          $.app.sliderScene.updateNormalMap.get(id, slider.id)?.(slider.normal!)
        })
      })

      start = fn(({ id, app }) => () => {
        app.setMachineState(id, 'running')
      })

      preview = fn(({ id, app }) => () => {
        app.setMachineState(id, 'preview')
        this.stopPreview()
      })

      stopPreview = queue.debounce(3000)(() => {
        this.stop()
      })

      stop = fn(({ id, app }) => () => {
        app.setMachineState(id, 'suspended')
      })

      updateMarkers = fn(({ editor }) => function updateMarkers(sliders: Sliders) {
        const paramMarkers = [...sliders.values()].map(markerForSlider)

        editor.setMarkers([...paramMarkers, ...($.errorMarkers ?? [])])
      })

      setSliderNormal = fn(({ id, app, editor, gainNode, audio: { setParam } }) => (sliderId: string, newNormal: number) => {
        if (sliderId === 'vol') {
          setParam(gainNode.gain, newNormal)
          app.sliderScene.updateNormalMap.get(id, sliderId)?.(newNormal)
          app.setGainValue(id, newNormal)
          return newNormal
        }

        const preset = $.preset

        if (!preset) return newNormal

        const newSliders = this.getSliders(preset.detail)
        const slider = newSliders.get(sliderId)
        if (!slider) {
          console.warn(`Slider with id "${sliderId}" not found.`)
          return newNormal
        }

        slider.value = newNormal * (slider.max - slider.min) + slider.min

        const newDetail =
          this.updateEditorValueArgs(editor.value, newSliders)

        if (newDetail && !newDetail.equals(preset.detail)) {
          $.preset = app.setPresetDetailData(id, newDetail.data)
        }

        return newNormal
      })

      onWheel = fn(({ app, id, editor }) => (ev: WheelEvent, sliderId?: string) => {
        if (sliderId === 'vol') {
          ev.preventDefault?.()
          ev.stopPropagation?.()

          const machine = app.machines.getById<MonoMachine>(id)

          const normal = machine.gainValue

          const newNormal = clamp(0, 1, (normal ?? 0)
            + Math.sign(ev.deltaY) * (
              0.01
              + 0.10 * Math.abs(ev.deltaY * 0.005) ** 1.05
            )
          )

          return this.setSliderNormal('vol', newNormal)
        }

        if (sliderId || (!sliderId && editor.hoveringMarkerIndex != null)) {
          sliderId ??= [...($.presetSliders?.keys() ?? [])].at(editor.hoveringMarkerIndex as number)

          if (sliderId != null) {
            ev.preventDefault?.()
            ev.stopPropagation?.()

            const slider = $.presetSliders!.get(sliderId)!

            const normal = (slider.value - slider.min) / (slider.max - slider.min)

            const newNormal = clamp(0, 1, (normal ?? 0)
              + Math.sign(ev.deltaY) * (
                0.01
                + 0.10 * Math.abs(ev.deltaY * 0.005) ** 1.05
              )
            )

            $.app.sliderScene.updateNormalMap.get(id, slider.id)?.(newNormal)

            return this.setSliderNormal(slider.id, newNormal)
          }
        }
      })

      enterSlider = fn(({ sliders }) => (sliderIndex: number) => {
        sliders.shadowRoot!.querySelector('.active')?.classList.remove('active')
        sliders.shadowRoot!.querySelectorAll('x-slider')[sliderIndex]?.classList.add('active')
      })

      leaveSlider = fn(({ sliders }) => (sliderIndex: number) => {
        sliders.shadowRoot!.querySelectorAll('x-slider')[sliderIndex]?.classList.remove('active')
      })

      onEnterMarker = (ev: any) => {
        const { detail: { markerIndex } } = ev as any
        this.enterSlider(markerIndex)
      }

      onLeaveMarker = (ev: any) => {
        const { detail: { markerIndex } } = ev as any
        this.leaveSlider(markerIndex)
      }
    })
  },

  function effects({ $, fx, fn, deps, refs }) {
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

    fx.raf(function updateAttrState({ host, state }) {
      host.setAttribute('state', state)
    })

    // fx(function calcPresetsChecksum({ presets }) {
    //   $.presetsChecksum = presets.selectedPresetId + presets.items.map(
    //     ({ id, isRemoved, isDraft, hue, name }) =>
    //       `${id}${hue}${name}${isRemoved ? 1 : 0}${isDraft ? 1 : 0}`
    //   ).join()
    // })

    fx(function updateNodes({ audio: { audioNode, gainNode } }) {
      $.monoNode = audioNode as MonoNode
      $.gainNode = gainNode
    })

    // fx(function updateAudio({ audio }) {
    //   $.audioContext = audio.audioContext
    // })

    // fx(function createGainNode({ audioContext }) {
    //   console.log('connectNodes CREATE GAIN??')
    //   const gainNode = $.gainNode = new GainNode(audioContext, { channelCount: 1, gain: 0 })

    //   gainNode.connect(audioContext.destination)

    //   return () => {
    //     console.log('connectNodes DISCONNECT')
    //     // try {
    //     //   gainNode.disconnect(audioContext.destination)
    //     // } catch { }
    //   }
    // })

    // fx(function connectNodes({ monoNode, gainNode, audio }) {
    //   monoNode.connect(gainNode)
    //   monoNode.connect(audio.analyserNode)
    //   // gainNode.connect(audio.audioContext.destination)

    //   // gainNode.connect(audio.audioContext.destination)

    //   return () => {
    //     // try {
    //     //   monoNode.disconnect(gainNode)
    //     // } catch { }
    //     // audio.setParam(gainNode.gain, 0)
    //     // setTimeout(() => {
    //     // try {
    //     //   gainNode.disconnect(audio.audioContext.destination)
    //     // } catch { }
    //     // }, 50)
    //   }
    // })

    fx(function updateMachineProps({ machine }) {
      machine.methods = $

      machine.presets.on('select', $.reconcilePresets)

      $.presets = machine.presets
      $.spacer = machine.spacer
      $.groupId = machine.groupId
      $.gainValue = machine.gainValue

      // console.log('STATES', machine.state, $.state)

      if (machine.state === 'init' && $.state === 'running') {
        //   //   // app.setMachineState(machine.id, 'running')
        //   queueMicrotask(() => {
        machine.methods.start()
        //   })
      } else {
        //   //   if ($.state !== 'running' && machine.state === 'running') {
        //   //     // the microtask so that gainValue and others have time to update
        //   //     queueMicrotask(() => {
        //   //       machine.methods.start()
        //   //     })
        //   //   }

        $.state = machine.state
      }

      $.compileState = machine.compileState
    })

    fx(function onInitialPreset({ editor, preset, gainNode, audio }) {
      if (
        ($.state === 'init' || !editor.value)
        && preset
        && preset.detail?.data.editorValue
      ) {
        console.log('mono: INITIAL')

        // monoNode.suspend()

        audio.setParam(gainNode.gain, $.gainValue!)
        editor.setValue(preset.detail.data.editorValue, true)
        $.compile(preset)
      }
      else {
        // when we load another project we should end up here
        if (preset.detail.data.editorValue !== editor.value) {
          audio.setParam(gainNode.gain, $.gainValue!)
          editor.setValue(preset.detail.data.editorValue)
          $.compile(preset)
        }
      }
    })

    // fx(() => () => {
    //   $.state = 'init'
    // })

    fx(function updatePreset({ app, id, editor: _, presets }) {
      const preset = presets.selectedPreset

      if (preset) {
        $.preset = preset
      } else {
        if (!$.preset) {
          app.setPresetDetailData(id, {
            editorValue: localStorage.monoCode || monoDefaultEditorValue,
          })
        }
      }
    })

    fx(function updatePresetWithCode({ app, id, monoCode }) {
      if (!$.preset || $.preset.detail.data.editorValue !== monoCode) {
        app.setPresetDetailData(id, {
          editorValue: monoCode
        })
      }
    })

    // fx(({ preset: { detail } }) => {
    //   if (!detail) {
    //     $.slidersChecksum = 'invalid'
    //     return
    //   }
    //   const { data: { sliders } } = detail
    //   $.slidersChecksum = [...(sliders ?? []).values()].map((slider) => slider.id).join()
    // })

    fx(function updateShowDeleteButton({ app, machine, state }) {
      $.showDeleteButton = app.getMachinesInGroup(machine.groupId)
        .flatMap((machine) =>
          machine.presets.items
        ).length === 0
        && state === 'suspended'
    })

    fx(function updatePresetSliders({ preset }) {
      $.presetSliders = $.getSliders(preset.detail)
    })

    fx(function updateMarkers({ presetSliders }) {
      $.updateMarkers(presetSliders)
    })

    fx(function drawMono({
      host,
      app,
      id,
      instanceId,
      groupId,
      machine,
      state,
      compileState,
      spacer,
      presets,
      presetSliders,
      showDeleteButton,
      audio: {
        audioContext,
        workerBytes,
        workerFreqs
      },
    }) {
      console.log('mono state:', state)
      $.view = <>
        <Spacer part="spacer" align={app.align === 'x' ? 'y' : 'x'} setSpacer={app.setSpacer} id={id} layout={host} initial={spacer ?? [0, 0.2, 0.55]}>

          <Code
            part="editor"
            distRoot={app.distRoot}
            editorScene={app.editorScene}
            onWheel={$.onWheel}
            onEnterMarker={$.onEnterMarker}
            onLeaveMarker={$.onLeaveMarker}
            editor={deps.editor}
            value={deps.monoCode}
          />


          <div part="side">
            <Sliders
              ref={refs.sliders}
              part="sliders"
              scene={app.sliderScene}
              machine={$.machine}
              sliders={presetSliders}
              running={state !== 'suspended'}
            />

            {/* <Waveform
            part="waveform"
            // id={`${id}-scroller`}
            // kind="scroller"
            // audioContext={audioContext}
            analyserNode={analyserNode}
            width={100}
            height={50}
            running={state !== 'suspended'}
          /> */}
            <Wavetracer
              key={`${instanceId}-scroller`}
              id={`${instanceId}-scroller`}
              part="waveform"
              kind="scroller"
              app={app}
              workerBytes={workerBytes}
              workerFreqs={workerFreqs}
              width={100}
              height={50}
              running={state !== 'suspended'}
            />

            <MachineControls
              app={app}
              machine={machine}
              groupId={groupId}
              state={state}
              compileState={compileState}
              methods={$}
              showDeleteButton={showDeleteButton}
            />

          </div>

          <PresetsView
            part="presets"
            app={app}
            id={id}
            presets={presets as any}
          />

        </Spacer>
      </>
    })
  }))
