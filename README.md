

<h1>
cowbell-lol <a href="https://npmjs.org/package/cowbell-lol"><img src="https://img.shields.io/badge/npm-v2.0.0-F00.svg?colorA=000"/></a> <a href="src"><img src="https://img.shields.io/badge/loc-5,506-FFF.svg?colorA=000"/></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-F0B.svg?colorA=000"/></a>
</h1>

<p></p>

cowbell.lol

<h4>
<table><tr><td title="Triple click to select and copy paste">
<code>npm i cowbell-lol </code>
</td><td title="Triple click to select and copy paste">
<code>pnpm add cowbell-lol </code>
</td><td title="Triple click to select and copy paste">
<code>yarn add cowbell-lol</code>
</td></tr></table>
</h4>

## Examples

<details id="example$editor-with-preview" title="editor-with-preview" open><summary><span><a href="#example$editor-with-preview">#</a></span>  <code><strong>editor-with-preview</strong></code></summary>  <ul>    <details id="source$editor-with-preview" title="editor-with-preview source code" ><summary><span><a href="#source$editor-with-preview">#</a></span>  <code><strong>view source</strong></code></summary>  <a href="example/editor-with-preview.tsx">example/editor-with-preview.tsx</a>  <p>

```tsx
/** @jsxImportSource minimal-view */

import { CanvyElement, EditorScene } from 'canvy'
import type { Lens, Marker } from 'canvy'

import { Scalar, Matrix, Point, Rect } from 'geometrik'
import { render, effect, dep, web, view, Dep, element, on } from 'minimal-view'
import { MonoNode } from 'mono-worklet'

import { Audio } from 'cowbell-lol/audio'
import { Code } from 'cowbell-lol/code'
import { monoDefaultEditorValue } from 'cowbell-lol/mono'
import { ObjectPool } from 'cowbell-lol/util/pool'
import { areSlidersCompatible, getCodeWithoutArgs } from 'cowbell-lol/util/args'
import { Slider, SliderView } from 'cowbell-lol/slider-view'
import { markerForSlider } from 'cowbell-lol/util/marker'

import { createWaveplot, Preview } from 'cowbell-lol'
import type { Waveplot } from 'cowbell-lol/waveplot'
import { createPreview } from 'cowbell-lol'
import { EditorBuffer } from 'cowbell-lol/types'
import { classes } from 'cowbell-lol/util/classes'
import { Spacer } from 'cowbell-lol/spacer'
import { WaveplotButton } from 'cowbell-lol/waveplot-button'

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
 'eatt[1cowbell-lol500f]=33.115,
 'edec[1cowbell-lol500f]=50.396,
 'datt[1cowbell-lol500f]=500,
 'ddec[1cowbell-lol500f]=72.286,
 'nois[1cowbell-lol1000f]=53.184,
 'filt[1kcowbell-lol5k]=4295.815
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
 'eatt[1cowbell-lol500f]=500,
 'edec[1cowbell-lol50f]=19.55,
 'datt[1cowbell-lol500f]=500,
 'ddec[1cowbell-lol50f]=11.15,
 'nois[1cowbell-lol1000f]=315.409,
 'decay[20cowbell-lol500f]=43.547,
 'filt[1kcowbell-lol5k]=3815.151,
 'pre[1fcowbell-lol10f]=1.27,
 'post[1fcowbell-lol10f]=5.333
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
          $.buffers = new Map([cowbell-lol.$.buffers])
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

            $.buffers = new Map([cowbell-lol.$.buffers])
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
      $.paramMarkers = [cowbell-lol.sliders.values()].map((slider) =>
        markerForSlider(slider)
      )
    })

    fx(function updateMarkers({ paramMarkers, errorMarkers }) {
      $.markers = [cowbell-lol.paramMarkers, cowbell-lol.errorMarkers]
    })

    fx(function updateLenses({ errorLenses }) {
      $.lenses = [cowbell-lol.errorLenses]
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
        {[cowbell-lol.buffers].map(([id, buffer], index) =>
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

          {[cowbell-lol.buffers].map(([ownerId, buffer]) =>
            <div part="track" class={classes({
              active: ownerId === activeId
            })}>
              <div part="sliders">
                {[cowbell-lol.audio.getSliders(buffer.value)].map(([id, slider]) =>
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
```

</p>
</details></ul></details><details id="example$web" title="web" open><summary><span><a href="#example$web">#</a></span>  <code><strong>web</strong></code></summary>  <ul>    <details id="source$web" title="web source code" ><summary><span><a href="#source$web">#</a></span>  <code><strong>view source</strong></code></summary>  <a href="example/web.tsx">example/web.tsx</a>  <p>

```tsx
/** @jsxImportSource minimal-view */

import { render, enableDebug, effect } from 'minimal-view'

// import { DOMRecorder } from 'dom-recorder'
// declare const window: any
// window.recorder = new DOMRecorder()
// document.body.appendChild(window.recorder.el)

// @ts-ignore
// globalThis.DEBUG = ['editor', 'editor-buffer', 'slider']

// @ts-ignore
const isDebug = !!globalThis.DEBUG

// if (isDebug) enableDebug(5000)

effect.maxUpdates = 100000

// import { AppView } from 'cowbell-lol'
import { App } from 'cowbell-lol'

// const css = /*css*/`
// .dual {
//   display: flex;
//   flex-flow: row nowrap;
//   max-height: 100%;
// }

// .pane {
//   max-width: 50%;
//   max-height: 100%;
//   overflow-y: scroll;
// }
// `
render(<App />, document.body)
  // <AppView distRoot="/example" apiUrl="https://devito.test" />
  // render(<>
  //   <style>{css}</style>
  //   <div class="dual">
  //     <div class="pane">
  //       <AppView />
  //     </div>
  //     <div class="pane">
  //       <AppView />
  //     </div>
  //   </div>
  // </>, document.body)
```

</p>
</details></ul></details>


## API

<p>  <details id="Preview$66" title="Interface" ><summary><span><a href="#Preview$66">#</a></span>  <code><strong>Preview</strong></code>    </summary>  <a href=""></a>  <ul>        <p>  <details id="draw$67" title="Method" ><summary><span><a href="#draw$67">#</a></span>  <code><strong>draw</strong></code><em>(buffer)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="buffer$69" title="Parameter" ><summary><span><a href="#buffer$69">#</a></span>  <code><strong>buffer</strong></code>    </summary>    <ul><p><span>Reactive</span>&lt;<code>"editor-buffer"</code>, <span>props</span>, <span>local</span> &amp; <span>actions</span>&gt;</p>        </ul></details>  <p><strong>draw</strong><em>(buffer)</em>  &nbsp;=&gt;  <ul><span>Promise</span>&lt;<code>false</code> | void | <span>Error</span>&gt;</ul></p></p>    </ul></details></p></ul></details><details id="Waveplot$45" title="Interface" ><summary><span><a href="#Waveplot$45">#</a></span>  <code><strong>Waveplot</strong></code>    </summary>  <a href=""></a>  <ul>        <p>  <details id="copy$55" title="Property" ><summary><span><a href="#copy$55">#</a></span>  <code><strong>copy</strong></code>    </summary>  <a href=""></a>  <ul><p><details id="__type$56" title="Function" ><summary><span><a href="#__type$56">#</a></span>  <em>(a, b)</em>    </summary>    <ul>    <p>    <details id="a$58" title="Parameter" ><summary><span><a href="#a$58">#</a></span>  <code><strong>a</strong></code>    </summary>    <ul><p>string</p>        </ul></details><details id="b$59" title="Parameter" ><summary><span><a href="#b$59">#</a></span>  <code><strong>b</strong></code>    </summary>    <ul><p>string</p>        </ul></details>  <p><strong></strong><em>(a, b)</em>  &nbsp;=&gt;  <ul><span>Promise</span>&lt;void&gt;</ul></p></p>    </ul></details></p>        </ul></details><details id="create$51" title="Property" ><summary><span><a href="#create$51">#</a></span>  <code><strong>create</strong></code>    </summary>  <a href=""></a>  <ul><p><details id="__type$52" title="Function" ><summary><span><a href="#__type$52">#</a></span>  <em>(id)</em>    </summary>    <ul>    <p>    <details id="id$54" title="Parameter" ><summary><span><a href="#id$54">#</a></span>  <code><strong>id</strong></code>    </summary>    <ul><p>string</p>        </ul></details>  <p><strong></strong><em>(id)</em>  &nbsp;=&gt;  <ul><span>Promise</span>&lt;<a href="#WaveplotTarget$42">WaveplotTarget</a>&gt;</ul></p></p>    </ul></details></p>        </ul></details><details id="draw$47" title="Property" ><summary><span><a href="#draw$47">#</a></span>  <code><strong>draw</strong></code>    </summary>  <a href=""></a>  <ul><p><details id="__type$48" title="Function" ><summary><span><a href="#__type$48">#</a></span>  <em>(id)</em>    </summary>    <ul>    <p>    <details id="id$50" title="Parameter" ><summary><span><a href="#id$50">#</a></span>  <code><strong>id</strong></code>    </summary>    <ul><p>string</p>        </ul></details>  <p><strong></strong><em>(id)</em>  &nbsp;=&gt;  <ul><span>Promise</span>&lt;<code>false</code>&gt;</ul></p></p>    </ul></details></p>        </ul></details><details id="targets$46" title="Property" ><summary><span><a href="#targets$46">#</a></span>  <code><strong>targets</strong></code>    </summary>  <a href=""></a>  <ul><p><span>Map</span>&lt;string, <a href="#WaveplotTarget$42">WaveplotTarget</a>&gt;</p>        </ul></details></p></ul></details><details id="WaveplotSetup$28" title="Interface" ><summary><span><a href="#WaveplotSetup$28">#</a></span>  <code><strong>WaveplotSetup</strong></code>    </summary>  <a href=""></a>  <ul>        <p>  <details id="height$32" title="Property" ><summary><span><a href="#height$32">#</a></span>  <code><strong>height</strong></code>    </summary>  <a href=""></a>  <ul><p>number</p>        </ul></details><details id="pixelRatio$33" title="Property" ><summary><span><a href="#pixelRatio$33">#</a></span>  <code><strong>pixelRatio</strong></code>    </summary>  <a href=""></a>  <ul><p>number</p>        </ul></details><details id="sampleRate$29" title="Property" ><summary><span><a href="#sampleRate$29">#</a></span>  <code><strong>sampleRate</strong></code>    </summary>  <a href=""></a>  <ul><p>number</p>        </ul></details><details id="samplesLength$30" title="Property" ><summary><span><a href="#samplesLength$30">#</a></span>  <code><strong>samplesLength</strong></code>    </summary>  <a href=""></a>  <ul><p>number</p>        </ul></details><details id="width$31" title="Property" ><summary><span><a href="#width$31">#</a></span>  <code><strong>width</strong></code>    </summary>  <a href=""></a>  <ul><p>number</p>        </ul></details></p></ul></details><details id="WaveplotTarget$42" title="Interface" ><summary><span><a href="#WaveplotTarget$42">#</a></span>  <code><strong>WaveplotTarget</strong></code>    </summary>  <a href=""></a>  <ul>        <p>  <details id="canvas$43" title="Property" ><summary><span><a href="#canvas$43">#</a></span>  <code><strong>canvas</strong></code>    </summary>  <a href=""></a>  <ul><p><span>HTMLCanvasElement</span></p>        </ul></details><details id="floats$44" title="Property" ><summary><span><a href="#floats$44">#</a></span>  <code><strong>floats</strong></code>    </summary>  <a href=""></a>  <ul><p><span>Float32Array</span></p>        </ul></details></p></ul></details><details id="WaveplotWorkerSetup$34" title="Interface" ><summary><span><a href="#WaveplotWorkerSetup$34">#</a></span>  <code><strong>WaveplotWorkerSetup</strong></code>    </summary>  <a href=""></a>  <ul>        <p>  <details id="canvas$35" title="Property" ><summary><span><a href="#canvas$35">#</a></span>  <code><strong>canvas</strong></code>    </summary>  <a href=""></a>  <ul><p><span>OffscreenCanvas</span></p>        </ul></details><details id="floats$36" title="Property" ><summary><span><a href="#floats$36">#</a></span>  <code><strong>floats</strong></code>    </summary>  <a href=""></a>  <ul><p><span>Float32Array</span></p>        </ul></details><details id="height$40" title="Property" ><summary><span><a href="#height$40">#</a></span>  <code><strong>height</strong></code>    </summary>  <a href=""></a>  <ul><p>number</p>        </ul></details><details id="pixelRatio$41" title="Property" ><summary><span><a href="#pixelRatio$41">#</a></span>  <code><strong>pixelRatio</strong></code>    </summary>  <a href=""></a>  <ul><p>number</p>        </ul></details><details id="sampleRate$37" title="Property" ><summary><span><a href="#sampleRate$37">#</a></span>  <code><strong>sampleRate</strong></code>    </summary>  <a href=""></a>  <ul><p>number</p>        </ul></details><details id="samplesLength$38" title="Property" ><summary><span><a href="#samplesLength$38">#</a></span>  <code><strong>samplesLength</strong></code>    </summary>  <a href=""></a>  <ul><p>number</p>        </ul></details><details id="width$39" title="Property" ><summary><span><a href="#width$39">#</a></span>  <code><strong>width</strong></code>    </summary>  <a href=""></a>  <ul><p>number</p>        </ul></details></p></ul></details><details id="App$19" title="TypeAlias" ><summary><span><a href="#App$19">#</a></span>  <code><strong>App</strong></code>    </summary>  <a href=""></a>  <ul><p>typeof   <span>App.Context</span></p>        </ul></details><details id="Selected$11" title="TypeAlias" ><summary><span><a href="#Selected$11">#</a></span>  <code><strong>Selected</strong></code>    </summary>  <a href=""></a>  <ul><p>{<p>  <details id="pattern$14" title="Property" ><summary><span><a href="#pattern$14">#</a></span>  <code><strong>pattern</strong></code>    </summary>  <a href=""></a>  <ul><p>number</p>        </ul></details><details id="player$13" title="Property" ><summary><span><a href="#player$13">#</a></span>  <code><strong>player</strong></code>    </summary>  <a href=""></a>  <ul><p>number</p>        </ul></details></p>}</p>        </ul></details><details id="DELIMITERS$6" title="Variable" ><summary><span><a href="#DELIMITERS$6">#</a></span>  <code><strong>DELIMITERS</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p>{<p>  <details id="SAVE_ID$8" title="Property" ><summary><span><a href="#SAVE_ID$8">#</a></span>  <code><strong>SAVE_ID</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>','</code></span>  </summary>  <a href=""></a>  <ul><p><code>","</code></p>        </ul></details><details id="SHORT_ID$9" title="Property" ><summary><span><a href="#SHORT_ID$9">#</a></span>  <code><strong>SHORT_ID</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>','</code></span>  </summary>  <a href=""></a>  <ul><p><code>","</code></p>        </ul></details></p>}</p>        </ul></details><details id="PROJECT_KINDS$1" title="Variable" ><summary><span><a href="#PROJECT_KINDS$1">#</a></span>  <code><strong>PROJECT_KINDS</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p>{<p>  <details id="DRAFT$4" title="Property" ><summary><span><a href="#DRAFT$4">#</a></span>  <code><strong>DRAFT</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>'1'</code></span>  </summary>  <a href=""></a>  <ul><p><code>"1"</code></p>        </ul></details><details id="REMOTE$5" title="Property" ><summary><span><a href="#REMOTE$5">#</a></span>  <code><strong>REMOTE</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>'2'</code></span>  </summary>  <a href=""></a>  <ul><p><code>"2"</code></p>        </ul></details><details id="SAVED$3" title="Property" ><summary><span><a href="#SAVED$3">#</a></span>  <code><strong>SAVED</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>'0'</code></span>  </summary>  <a href=""></a>  <ul><p><code>"0"</code></p>        </ul></details></p>}</p>        </ul></details><details id="app$15" title="Variable" ><summary><span><a href="#app$15">#</a></span>  <code><strong>app</strong></code>    </summary>  <a href=""></a>  <ul><p><a href="#App$16">App</a></p>        </ul></details><details id="focusMap$10" title="Variable" ><summary><span><a href="#focusMap$10">#</a></span>  <code><strong>focusMap</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p><span>Map</span>&lt;string, <span>HTMLElement</span>&gt;</p>        </ul></details><details id="App$16" title="Function" ><summary><span><a href="#App$16">#</a></span>  <code><strong>App</strong></code><em>(props)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="props$18" title="Parameter" ><summary><span><a href="#props$18">#</a></span>  <code><strong>props</strong></code>    </summary>    <ul><p><span>props</span></p>        </ul></details>  <p><strong>App</strong><em>(props)</em>  &nbsp;=&gt;  <ul><span>VKid</span></ul></p></p>    </ul></details><details id="Skeleton$20" title="Function" ><summary><span><a href="#Skeleton$20">#</a></span>  <code><strong>Skeleton</strong></code><em>(props)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="props$22" title="Parameter" ><summary><span><a href="#props$22">#</a></span>  <code><strong>props</strong></code>    </summary>    <ul><p><span>props</span></p>        </ul></details>  <p><strong>Skeleton</strong><em>(props)</em>  &nbsp;=&gt;  <ul><span>VKid</span></ul></p></p>    </ul></details><details id="createPreview$62" title="Function" ><summary><span><a href="#createPreview$62">#</a></span>  <code><strong>createPreview</strong></code><em>(waveplot, sampleRate)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="waveplot$64" title="Parameter" ><summary><span><a href="#waveplot$64">#</a></span>  <code><strong>waveplot</strong></code>    </summary>    <ul><p><a href="#Waveplot$45">Waveplot</a></p>        </ul></details><details id="sampleRate$65" title="Parameter" ><summary><span><a href="#sampleRate$65">#</a></span>  <code><strong>sampleRate</strong></code>    </summary>    <ul><p>number</p>        </ul></details>  <p><strong>createPreview</strong><em>(waveplot, sampleRate)</em>  &nbsp;=&gt;  <ul><a href="#Preview$66">Preview</a></ul></p></p>    </ul></details><details id="createWaveplot$25" title="Function" ><summary><span><a href="#createWaveplot$25">#</a></span>  <code><strong>createWaveplot</strong></code><em>(setup)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="setup$27" title="Parameter" ><summary><span><a href="#setup$27">#</a></span>  <code><strong>setup</strong></code>    </summary>    <ul><p><a href="#WaveplotSetup$28">WaveplotSetup</a></p>        </ul></details>  <p><strong>createWaveplot</strong><em>(setup)</em>  &nbsp;=&gt;  <ul><span>Promise</span>&lt;<a href="#Waveplot$45">Waveplot</a>&gt;</ul></p></p>    </ul></details><details id="getPreviewPort$60" title="Function" ><summary><span><a href="#getPreviewPort$60">#</a></span>  <code><strong>getPreviewPort</strong></code><em>()</em>    </summary>  <a href=""></a>  <ul>    <p>      <p><strong>getPreviewPort</strong><em>()</em>  &nbsp;=&gt;  <ul><span>Worker</span></ul></p></p>    </ul></details><details id="getWaveplotPort$23" title="Function" ><summary><span><a href="#getWaveplotPort$23">#</a></span>  <code><strong>getWaveplotPort</strong></code><em>()</em>    </summary>  <a href=""></a>  <ul>    <p>      <p><strong>getWaveplotPort</strong><em>()</em>  &nbsp;=&gt;  <ul><span>Worker</span></ul></p></p>    </ul></details></p>

## Credits
- [canvy](https://npmjs.org/package/canvy) by [stagas](https://github.com/stagas) &ndash; efficient html canvas-based code text editor
- [define-function](https://npmjs.org/package/define-function) by [taowen](https://github.com/taowen) 
- [diff](https://npmjs.org/package/diff) by [kpdecker](https://github.com/kpdecker) &ndash; A javascript text diff implementation.
- [event-toolkit](https://npmjs.org/package/event-toolkit) by [stagas](https://github.com/stagas) &ndash; Toolkit for DOM events.
- [everyday-utils](https://npmjs.org/package/everyday-utils) by [stagas](https://github.com/stagas) &ndash; Everyday utilities
- [geometrik](https://npmjs.org/package/geometrik) by [stagas](https://github.com/stagas) &ndash; Geometry classes and utils.
- [get-element-offset](https://npmjs.org/package/get-element-offset) by [stagas](https://github.com/stagas) &ndash; Get accurate DOM element offset.
- [icon-svg](https://npmjs.org/package/icon-svg) by [stagas](https://github.com/stagas) &ndash; Memoized fetch SVG icons from many popular icon sets with editor autocomplete and a Web Component ready to use
- [immutable-map-set](https://npmjs.org/package/immutable-map-set) by [stagas](https://github.com/stagas) &ndash; Immutable Map and Set objects
- [json-objectify](https://npmjs.org/package/json-objectify) by [stagas](https://github.com/stagas) &ndash; Like JSON.stringify but without the stringify part.
- [minimal-view](https://npmjs.org/package/minimal-view) by [stagas](https://github.com/stagas) &ndash; Minimal reactive component view library.
- [mono-worklet](https://npmjs.org/package/mono-worklet) by [stagas](https://github.com/stagas) &ndash; mono lang AudioWorkletNode
- [monolang](https://npmjs.org/package/monolang) by [stagas](https://github.com/stagas) &ndash; mono is a low level language for audio expressions that compiles to wasm
- [pretty-fast-fft](https://npmjs.org/package/pretty-fast-fft) by [stagas](https://github.com/stagas) &ndash; WebAssembly build of a small, pretty fast FFT library (PFFFT).
- [rpc-mini](https://npmjs.org/package/rpc-mini) by [stagas](https://github.com/stagas) &ndash; A mini RPC for MessagePort interfaces.
- [scheduler-node](https://npmjs.org/package/scheduler-node) by [stagas](https://github.com/stagas) &ndash; Sample perfect Audioworklet MIDI Scheduler Node
- [serialize-whatever](https://npmjs.org/package/serialize-whatever) by [stagas](https://github.com/stagas) &ndash; Serialize and deserialize whatever.
- [to-fluent](https://npmjs.org/package/to-fluent) by [stagas](https://github.com/stagas) &ndash; Convert a function with a settings object to fluent API.
- [urlsafe-lzma](https://npmjs.org/package/urlsafe-lzma) by [adamrutter](https://github.com/adamrutter) &ndash; URL-safe LZMA compression
- [webaudio-tools](https://npmjs.org/package/webaudio-tools) by [stagas](https://github.com/stagas) &ndash; Useful tools for WebAudio.
- [x-pianokeys](https://npmjs.org/package/x-pianokeys) by [stagas](https://github.com/stagas) &ndash; Web Component MIDI ready piano keys.

## Contributing

[Fork](https://github.com/stagas/cowbell-lol/fork) or [edit](https://github.dev/stagas/cowbell-lol) and submit a PR.

All contributions are welcome!

## License

<a href="LICENSE">MIT</a> &copy; 2022 [stagas](https://github.com/stagas)
