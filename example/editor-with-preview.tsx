/** @jsxImportSource minimal-view */

import { CanvyElement, EditorScene } from 'canvy'
import type { Lens, Marker } from 'canvy'

import { Scalar, Matrix, Point, Rect } from 'geometrik'
import { render, effect, dep, web, view, Dep, element, on } from 'minimal-view'
import { MonoNode } from 'mono-worklet'

import { Audio } from '../src/audio'
import { Code } from '../src/code'
import { monoDefaultEditorValue } from '../src/mono'
import { ObjectPool } from '../src/util/pool'
import { areSlidersCompatible, getCodeWithoutArgs } from '../src/util/args'
import { Slider, SliderView } from '../src/slider-view'
import { markerForSlider } from '../src/util/marker'

import { createWaveplot, Preview } from '..'
import type { Waveplot } from '../src/waveplot'
import { createPreview } from '..'
import { EditorBuffer } from '../src/types'
import { classes } from '../src/util/classes'
import { Spacer } from '../src/spacer'
import { WaveplotButton } from '../src/waveplot-button'

const { clamp } = Scalar

// import { DOMRecorder } from 'dom-recorder'
// declare const window: any
// window.recorder = new DOMRecorder()
// document.body.appendChild(window.recorder.el)

// @ts-ignore
// globalThis.DEBUG = ['preview-service', 'waveplot']

// @ts-ignore
// const isDebug = !!globalThis.DEBUG

// if (isDebug) enableDebug(5000)

effect.maxUpdates = 10000

const snareCode = String.raw`\\\ snare \\\
#:2,3;
write_note(x,y)=(
  #=(t,note_to_hz(x),y/127);
  0
);
midi_in(op=0,x=0,y=0)=(
  op==144 && write_note(x,y)
);
play(nt,x,y,
 'eatt[1..500f]=33.115,
 'edec[1..500f]=50.396,
 'datt[1..500f]=500,
 'ddec[1..500f]=72.286,
 'nois[1..1000f]=53.184,
 'filt[1k..5k]=4295.815
)=(
  e=env(nt, eatt, edec);
  d=env(nt, datt, ddec);
  z=noise(nois*d)*d+tri(420+x)*e;
  s=lpf(tanh(z*5)*y, filt, 0.55);
  s*.8+freeverb(s,.85,.35)*.45
);
f()=(
  x=#::play:sum;
  x*.35
)
`

const snareCode2 = String.raw`\\\ snare \\\
#:2,3;
write_note(x,y)=(
  #=(t,note_to_hz(x),y/127);
  0
);
midi_in(op=0,x=0,y=0)=(
  op==144 && write_note(x,y)
);
play(nt,x,y,
 'eatt[1..500f]=500,
 'edec[1..50f]=19.55,
 'datt[1..500f]=500,
 'ddec[1..50f]=11.15,
 'nois[1..1000f]=315.409,
 'decay[20..500f]=43.547,
 'filt[1k..5k]=3815.151,
 'pre[1f..10f]=1.27,
 'post[1f..10f]=5.333
)=(
  e=env(nt, eatt, edec);
  d=env(nt, datt, ddec);
  z=noise(nois*d)*d+tri(420+x)*e;
  s=lpf(tanh(z*5)*y, filt, 0.55);
  s=s*.8+freeverb(s,.85,.35)*.45;
  tanh(s*pre)*post*env(nt,200,decay)
);
f()=(
  x=#::play:sum;
  x*.35
)
`

const Editor = web('editor', view(
  class props {
    buffers!: Map<string, EditorBuffer>
    activeId!: string
    markers!: Marker[]
    lenses!: Lens[]
    onEdit!: (id: string, value: string) => void
    onCode!: (prev: string, next: string, editor: CanvyElement) => void
    onWheelMarker!: (e: WheelEvent, bufferId: string, markerId: Marker['key']) => void
  },

  class local {
    editorScene = new EditorScene({
      isValidTarget: (el) => {
        const part = el.getAttribute('part')
        if (part === 'canvas') return true
        return false
      },
      layout: {
        viewMatrix: new Matrix,
        state: {
          isIdle: true
        },
        viewFrameNormalRect: new Rect(0, 0, 10000, 10000),
        pos: new Point(0, 0)
      }
    })
    value = monoDefaultEditorValue
    editor?: CanvyElement
    activeMarker?: Marker | false = false
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      setBuffer = fn(({ editor }) => (buffer: EditorBuffer) => {
        if (buffer.snapshot) {
          editor.setFromSnapshot(buffer.snapshot)
        } else {
          editor.setValue(buffer.value, true, true)
        }
        editor.focus()
      })

      onWheel = fn(({ onWheelMarker }) => (e: WheelEvent) => {
        if ($.activeMarker && $.activeMarker.kind === 'param') {
          onWheelMarker(e, $.activeId, $.activeMarker.key)
        }
      })

      onEnterMarker = ({
        detail: { marker, markerIndex }
      }: { detail: { marker: Marker, markerIndex: number } }) => {
        $.activeMarker = marker
        hint.value = marker?.message
      }
      onLeaveMarker = ({
        detail: { marker }
      }: { detail: { marker: Marker, markerIndex: number } }) => {
        // if (marker === $.activeMarker) {
        $.activeMarker = false
        hint.value = false
        // }
      }
    })
  },

  function effects({ $, fx, deps }) {
    fx(function updateMarkers({ editor, markers }) {
      editor.setMarkers(markers)
    })

    fx(function updateLenses({ editor, lenses }) {
      editor.setLenses(lenses)
    })

    fx(function updateCodeValue({ editor, buffers, activeId, onCode }, prev) {
      const buffer = buffers.get(activeId)!

      if ($.value === buffer.value) return

      const prevCodeValue = $.value
      const nextCodeValue = buffer.value

      $.value = nextCodeValue

      if (prev.activeId) {
        if (activeId !== prev.activeId) {
          editor.$.effect.once(({ snapshot }) => {
            const prevBuffer = buffers.get(prev.activeId)!

            prevBuffer.snapshot = snapshot

            $.setBuffer(buffer)
            // remove snapshot so it can trigger next time
            // TODO: make canvy a proper rpc
            editor.snapshot = null

            if (buffer.snapshot) {
              onCode(buffer.snapshot.value, nextCodeValue, editor)
            }
          })

          editor.worker.postMessage({ call: 'getSnapshotJson' })
        } else {
          onCode(prevCodeValue, nextCodeValue, editor)
        }
      } else {
        $.setBuffer(buffer)
      }
    })

    // NOTE: this needs to be after the above function as the $.value
    // is modified with the new buffer value, otherwise it fires with the new
    // id but with the old value.
    // TODO: should we collect the values in reactive pass so that
    // the effects get the original update value?
    fx(function dispatchOnEdit({ value, activeId, onEdit }) {
      onEdit(activeId, value)
    })

    fx(({ editorScene }) => {
      $.view = <div style="width:100%; height: 100%; display: flex;">
        <Code
          style="width: 100%; height: 100%; flex: 1;"
          font={`${distRoot}/fonts/${monospaceFont}`}
          fontSize={17}
          singleComment="\"
          scene={editorScene}
          editor={deps.editor}
          value={deps.value}
          onWheel={$.onWheel}
          onEnterMarker={$.onEnterMarker}
          onLeaveMarker={$.onLeaveMarker}
        />
      </div>
    })
  }
))

const TabbedEditor = web('tabbed-editor', view(
  class props { },

  class local {
    host = element

    audioContext = new AudioContext({
      sampleRate: 44100, latencyHint: 0.04
    })

    audio = new Audio({
      audioContext: this.audioContext,
      gainNode: new GainNode(this.audioContext, { channelCount: 1, gain: 0.3 }),
      gainNodePool: new ObjectPool(() => {
        return new GainNode(this.audioContext, { channelCount: 1, gain: 0 })
      }),
      monoNodePool: new ObjectPool(async () => {
        return await MonoNode.create(this.audioContext, {
          numberOfInputs: 0,
          numberOfOutputs: 1,
          processorOptions: {
            metrics: 0,
          }
        })
      }),
    })

    buffers = new Map<string, EditorBuffer>([
      ['a', { id: 'a', value: monoDefaultEditorValue }],
      ['b', { id: 'b', value: snareCode }],
      ['c', { id: 'c', value: snareCode2 }],
      // ['a2', { id: 'a2', value: monoDefaultEditorValue }],
      // ['b2', { id: 'b2', value: snareCode }],
      // ['c2', { id: 'c2', value: snareCode2 }],
    ])
    activeId = 'a'
    editor?: InstanceType<typeof Editor.Element>

    markers?: Marker[]
    paramMarkers?: Marker[] = []
    errorMarkers?: Marker[] = []
    lenses?: Lens[]
    errorLenses?: Lens[] = []
    sliders?: Map<string, Slider> = new Map()

    waveplot?: Waveplot
    canvasView: JSX.Element = false
    preview?: Preview
    previewSampleRate = 11025
    previewSamplesLength = 11025 / 2 | 0
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      setActiveId = fn(({ editor }) => (activeId: string) => {
        $.activeId = activeId
        editor.focus()
      })

      onEdit = fn(({ audio }) =>
        (id: string, value: string) => {
          const buffer = $.buffers.get(id)!

          buffer.value = value

          $.sliders = audio.getSliders(value)
          $.buffers = new Map([...$.buffers])
        })

      onCompileSuccess = fn(({ preview }) =>
        (id: string) => {
          if (id === $.activeId) {
            $.errorMarkers = []
            $.errorLenses = []
          }

          preview.draw($.buffers.get(id)!)
        }
      )

      onCompileError = fn(() =>
        (id: string, error: Error, code: string) => {
          console.warn(error)

          if (id !== $.activeId) return

          if ((error as any).cause) {
            const cause = (error as any).cause
            const message = cause.message.split('\n')[0]

            $.errorLenses = [{
              line: cause.line,
              message,
            }]

            $.errorMarkers = [
              {
                key: cause.name,
                index: cause.index,
                size: cause.token?.length ?? 1,
                kind: 'error',
                color: '#a21',
                hoverColor: '#f42',
                message: cause.message,
              },
            ]
          } else {
            const msg = (error as any).message
            const message = msg.includes('lookup failed at: call "f"')
              ? 'f() is missing. This usually happens when a semicolon is missing somewhere.'
              : msg.includes('failed:')
                ? msg.split('failed:').pop()
                : msg.trim()

            $.errorMarkers = []

            $.errorLenses = [{
              line: code.split('\n').length,
              message,
            }]
          }
        }
      )

      onCode = fn(({ audio }) =>
        (prevCodeValue: string, nextCodeValue: string, editor: CanvyElement) => {
          const prevSliders = audio.getSliders(prevCodeValue)
          const nextSliders = audio.getSliders(nextCodeValue)

          if (prevCodeValue !== nextCodeValue) {
            if (areSlidersCompatible(prevSliders, nextSliders)) {
              const prevCodeNoArgs = getCodeWithoutArgs(prevCodeValue)
              const nextCodeNoArgs = getCodeWithoutArgs(nextCodeValue)

              if (prevCodeNoArgs === nextCodeNoArgs) {
                for (const [id, slider] of nextSliders) {
                  const prev = prevSliders.get(id)!

                  if (prev.value !== slider.value) {
                    const nextDefault = `${parseFloat(slider.value.toFixed(3))}`
                    if (`${parseFloat(parseFloat(prev.source.default).toFixed(3))}`
                      !== nextDefault) {
                      const diff = nextDefault.length - prev.source.default.length

                      const end = prev.sourceIndex + prev.source.arg.length
                      const start = end - prev.source.default.length

                      const newCodeValue = prevCodeValue.slice(0, start)
                        + nextDefault
                        + prevCodeValue.slice(end)

                      editor.replaceChunk({
                        start,
                        end,
                        text: nextDefault,
                        code: prevCodeValue
                      })

                      if (editor.value !== newCodeValue) {
                        throw new Error('Not the expected code')
                      }

                      prevCodeValue = newCodeValue

                      prevSliders.forEach((other) => {
                        if (other.sourceIndex > start) {
                          other.sourceIndex += diff
                        }
                      })
                    }
                  }
                }
              } else {
                editor.setValue(nextCodeValue)
              }
            } else {
              editor.setValue(nextCodeValue)
            }
          }
        }
      )

      onWheelSlider = fn(() =>
        (e: WheelEvent, bufferId: string, sliderId: string) => {
          // conditional because the event from the editor is not a real event
          e.preventDefault?.()
          e.stopPropagation?.()

          const buffer = $.buffers.get(bufferId)

          const slider = buffer?.sliders?.get(sliderId)

          if (buffer && slider) {
            const normal = clamp(0, 1,
              (slider.normal ?? 0)
              + Math.sign(e.deltaY) * (
                0.01
                + 0.10 * Math.abs(e.deltaY * 0.0015) ** 1.05
              ))

            return this.onValueSlider(normal, bufferId, sliderId)
          }

          return 0
        })

      onValueSlider = fn(({ audio, preview }) =>
        (normal: number, bufferId: string, sliderId: string) => {
          const buffer = $.buffers.get(bufferId)

          const slider = buffer?.sliders?.get(sliderId)

          if (buffer && slider) {
            slider.value = normal * slider.scale + slider.min

            const end = slider.sourceIndex + slider.source.arg.length
            const start = end - slider.source.default.length

            buffer.value =
              buffer.value.slice(0, start)
              + parseFloat(slider.value.toFixed(3))
              + buffer.value.slice(end)

            buffer.sliders = audio.getSliders(buffer.value)

            preview.draw(buffer)

            $.buffers = new Map([...$.buffers])
          }

          return normal
        })
    })
  },

  function effects({ $, fx, refs }) {
    $.css = /*css*/`
    & {
      display: flex;
      width: 100%;
      height: 100%;
      position: relative;
      flex-flow: column nowrap;
    }
    [part=tracks] {
      display: flex;
      width: 100%;
      height: 200px;
      min-height: 200px;
      max-height: 200px;
      position: relative;
      flex-flow: row nowrap;
    }
    [part=editor] {
      position: relative;
      width: 100%;
      height: calc(100% - 200px);
    }
    canvas {
      position: absolute;
      box-sizing: border-box;
      image-rendering: pixelated;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    `

    fx(function updateParamMarkers({ sliders }) {
      $.paramMarkers = [...sliders.values()].map((slider) =>
        markerForSlider(slider)
      )
    })

    fx(function updateMarkers({ paramMarkers, errorMarkers }) {
      $.markers = [...paramMarkers, ...errorMarkers]
    })

    fx(function updateLenses({ errorLenses }) {
      $.lenses = [...errorLenses]
    })

    fx(function swapBuffers({ buffers, activeId, paramMarkers, errorMarkers, errorLenses, sliders, waveplot }, prev) {
      const buffer = buffers.get(activeId)!
      if (activeId === prev.activeId) {
        buffer.paramMarkers = paramMarkers
        buffer.errorMarkers = errorMarkers
        buffer.errorLenses = errorLenses
        buffer.sliders = sliders
      } else {
        $.paramMarkers = buffer.paramMarkers ?? []
        $.errorMarkers = buffer.errorMarkers ?? []
        $.errorLenses = buffer.errorLenses ?? []
        $.sliders = buffer.sliders ?? new Map()
        requestAnimationFrame(() => {
          waveplot.copy(buffer.id, 'main')
        })
      }
    })

    fx(function fillBufferSliders({ audio, buffers }) {
      buffers.forEach((buffer) => {
        if (!('sliders' in buffer)) {
          buffer.sliders = audio.getSliders(buffer.value)
        }
        if (!('snapshot' in buffer)) {
          buffer.snapshot = {
            value: buffer.value
          }
        }
      })
    })

    fx(async function initWaveplot({ previewSampleRate, previewSamplesLength }) {
      $.waveplot = await createWaveplot({
        width: 250,
        height: 100,
        pixelRatio: window.devicePixelRatio,
        sampleRate: previewSampleRate,
        samplesLength: previewSamplesLength
      })
    })

    fx(async function initPreview({ waveplot, previewSampleRate }) {
      $.preview = createPreview($, waveplot, previewSampleRate)
    })

    fx(async ({ waveplot }) => {
      const { canvas } = await waveplot.create('main')
      $.canvasView =
        <canvas
          ref={{
            get current(): HTMLCanvasElement {
              return canvas
            }
          }}
        />
    })

    fx(function drawTabbedEditor({ host, audio, canvasView, buffers, waveplot, activeId, markers, lenses }) {
      $.view = <>
        {[...buffers].map(([id, buffer], index) =>
          <MonoPlayer
            key={`mono-${index}`}
            id={id}
            audio={audio}
            codeValue={buffer.value}
            gainValue={0.3}
            onCompileSuccess={$.onCompileSuccess}
            onCompileError={$.onCompileError}
          />
        )}

        <Spacer id="tracks" align="x" part="tracks" layout={host} initial={
          Array.from({ length: buffers.size }, (_, i) => i / buffers.size)
        }>

          {[...buffers].map(([ownerId, buffer]) =>
            <div part="track" class={classes({
              active: ownerId === activeId
            })}>
              <div part="sliders">
                {[...audio.getSliders(buffer.value)].map(([id, slider]) =>
                  <SliderView
                    key={`${ownerId}-${id}`}
                    ownerId={ownerId}
                    id={id}
                    slider={slider}
                    onValue={$.onValueSlider}
                    onWheel={$.onWheelSlider}
                    running={true}
                    vertical={false}
                    showBg={false}
                  />
                )}
              </div>

              <WaveplotButton
                id={ownerId}
                waveplot={waveplot}
                buffers={buffers}
                onClick={() => {
                  $.setActiveId(ownerId)
                }}
              >{ownerId}</WaveplotButton>

            </div>
          )}
        </Spacer>

        <div part="editor">
          {canvasView}

          <Editor
            ref={refs.editor}
            buffers={buffers}
            activeId={activeId}
            markers={markers}
            lenses={lenses}
            onEdit={$.onEdit}
            onCode={$.onCode}
            onWheelMarker={$.onWheelSlider}
          />
        </div>
      </>
    })
  }
))

const MonoPlayer = web('mono-player', view(
  class props {
    id!: string
    audio!: Audio
    codeValue!: string
    gainValue!: number
    onCompileSuccess!: (id: string) => void
    onCompileError!: (id: string, error: Error, code: string) => void
  },

  class local {
    monoNode?: MonoNode
    gainNode?: GainNode
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      compileCode = fn((
        {
          id,
          monoNode,
          onCompileSuccess,
          onCompileError
        }) => {
        let busy = false
        let queue: string | null
        return async (code) => {
          if (busy) {
            queue = code
            return
          }

          busy = true

          const label = `${id} mono compile`

          do {
            try {
              if (queue) {
                code = queue
                queue = null
              }

              console.time(label)
              await monoNode.setCode(code)
              console.timeEnd(label)

              // if (!queue) {
              onCompileSuccess(id)
              // }
            } catch (error) {
              console.timeEnd(label)
              if (!queue) {
                onCompileError(id, error as Error, code)
              }
            }
          } while (queue)

          busy = false
        }
      }
      )
    })
  },

  function effects({ $, fx }) {
    fx(async function createAndConnectNodes({ audio }) {
      const monoNode = $.monoNode = await audio.monoNodePool.acquire()
      const gainNode = $.gainNode = await audio.gainNodePool.acquire()
      monoNode.connect(gainNode)
      gainNode.connect(audio.gainNode)
      return () => {
        audio.setParam(gainNode.gain, 0)
        audio.monoNodePool.release(monoNode)
        audio.gainNodePool.release(gainNode)
        setTimeout(() => {
          audio.disconnect(monoNode, gainNode)
          audio.disconnect(gainNode, audio.gainNode)
        }, 50)
      }
    })

    fx(function updateGainValue({ audio, gainNode, gainValue }) {
      audio.setParam(gainNode.gain, gainValue)
    })

    fx(function updateCodeValue({ audio, codeValue, monoNode }, prev) {
      if (prev.codeValue) {
        const prevSliders = audio.getSliders(prev.codeValue)
        const nextSliders = audio.getSliders(codeValue)

        if (prev.codeValue !== codeValue) {
          if (areSlidersCompatible(prevSliders, nextSliders)) {
            const prevCodeNoArgs = getCodeWithoutArgs(prev.codeValue)
            const nextCodeNoArgs = getCodeWithoutArgs(codeValue)

            if (prevCodeNoArgs === nextCodeNoArgs) {
              for (const [id, slider] of nextSliders) {
                const prev = prevSliders.get(id)!
                if (prev.value !== slider.value) {
                  audio.setParam(
                    monoNode.params.get(slider.id)!.audioParam, slider.normal
                  )
                }
              }
            } else {
              $.compileCode(codeValue)
            }
          } else {
            $.compileCode(codeValue)
          }
        }
      } else {
        $.compileCode(codeValue)
      }
    })
  }
))

const Hint = web('hint', view(
  class props {
    message!: Dep<JSX.Element>
  },

  class local {
    host = element
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      onMouseMove = fn(({ host }) => (e: PointerEvent) => {
        const viewportRect = new Rect(
          document.scrollingElement!.scrollLeft,
          document.scrollingElement!.scrollTop,
          window.visualViewport!.width,
          window.visualViewport!.height
        )

        const rect = new Rect(host.getBoundingClientRect())
        rect.bottom = e.pageY - 25
        rect.left = e.pageX + 10
        rect.containSelf(viewportRect)

        Object.assign(host.style, rect.toStylePosition())

        this.show()
      })

      show = fn(({ host }) => () => {
        if ($.view) {
          host.style.opacity = '1'
        }
      })

      hide = fn(({ host }) => () => {
        host.style.opacity = '0'
      })
    })
  },

  function effects({ $, fx }) {
    $.css = /*css*/`
    & {
      z-index: 999999;
      position: fixed;
      padding: 10px;
      border: 1px solid #fff;
      background: #000;
      color: #fff;
      font-family: monospace;
      white-space: pre-wrap;
    }
    `
    fx(() => on(window, 'pointermove')($.onMouseMove))
    fx(() => on(window, 'keydown')($.hide))

    fx(({ message }) =>
      effect({ message }, ({ message }) => {
        $.view = message
        if (!message) {
          $.hide()
        } else {
          requestAnimationFrame($.show)
        }
      })
    )
  }
))

const hint = dep<JSX.Element>(false)

const bodyStyle = document.createElement('style')
const distRoot = '/example'
const monospaceFont = 'Brass.woff2'
bodyStyle.textContent = /*css*/`
@font-face {
  font-family: Mono;
  src: url("${distRoot}/fonts/${monospaceFont}") format("woff2");
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

render(<>
  <Hint message={hint} />
  <TabbedEditor />
</>, document.body)
