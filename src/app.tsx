/** @jsxImportSource minimal-view */

import { CanvyElement, EditorScene, Lens, Marker } from 'canvy'
import { attempt, cheapRandomId, checksum, pick } from 'everyday-utils'
import { Matrix, Point, Rect } from 'geometrik'
import { Dep, effect, element, on, reactive, view, web } from 'minimal-view'
import { MonoNode } from 'mono-worklet'
import { SchedulerEventGroupNode, SchedulerNode } from 'scheduler-node'
import { Code } from './code'
import { monoDefaultEditorValue, patternDefaultCode, patternDefaultCode2, snareCode2 } from './demo-code'
import { Midi } from './midi'
import { compilePattern } from './pattern'
import { createPreview, Preview } from './preview-service'
import { Spacer } from './spacer'

import { Sliders } from './types'
import { getSliders } from './util/args'
import { bgForHue } from './util/bg-for-hue'
import { markerForSlider } from './util/marker'
import { getErrorInputLine, getErrorToken, getTitle } from './util/parse'
import { ObjectPool } from './util/pool'
import { createWaveplot, Waveplot } from './waveplot'

// function add<T extends Reactive>(
//   map: Map<string, T>,
//   item: T
// ) {
//   const copy = new Map(map)
//   copy.set(item.$.id, item)
//   return copy
// }

// function pop<T extends Reactive>(map: Map<string, T>) {
//   if (!map.size) return map

//   const items = [...map]
//   const [, last] = items.pop()!
//   last.dispose()
//   return new Map(items)
// }

const Audio = reactive('audio',
  class props {
    audioContext!: AudioContext
    bpm!: number
  },
  class local {
    schedulerNode?: SchedulerNode
    gainNode?: GainNode

    gainNodePool?: ObjectPool<GainNode>
    monoNodePool?: ObjectPool<MonoNode>
    testNodePool?: ObjectPool<MonoNode>
    groupNodePool?: ObjectPool<SchedulerEventGroupNode>
    analyserNodePool?: ObjectPool<AnalyserNode>

    startTime = 0

    waveplot?: Waveplot
    preview?: Preview
    previewSampleRate = 11025
    previewSamplesLength = 11025 / 2 | 0
  },
  function actions({ $, fns, fn }) {
    return fns(new class actions {
      getTime = fn(({ audioContext }) => () => {
        return audioContext.currentTime - $.startTime
      })

      getSliders = fn(({ audioContext }) => (code: string) => getSliders(code, {
        sampleRate: audioContext.sampleRate,
        beatSamples: audioContext.sampleRate,
        numberOfBars: 1
      }))

      setParam = fn(({ audioContext }) => (param: AudioParam, targetValue: number, slope = 0.015) => {
        attempt(() => {
          param.setTargetAtTime(targetValue, audioContext.currentTime, slope)
        })
      })

      disconnect = (sourceNode: AudioNode, targetNode: AudioNode) => {
        attempt(() => {
          sourceNode.disconnect(targetNode)
        })
      }

    })
  },
  function effects({ $, fx, deps, refs }) {
    fx(() =>
      on(document.body, 'pointerdown')(function resumeAudio() {
        if ($.audioContext.state !== 'running') {
          console.log('resuming audio')
          $.audioContext.resume()
        }
      })
    )

    fx(async ({ audioContext }) => {
      $.schedulerNode = await SchedulerNode.create(audioContext)
    })

    fx(({ schedulerNode, bpm }) => {
      schedulerNode.setBpm(bpm)
    })

    fx(({ audioContext, schedulerNode }) => {
      $.gainNode = new GainNode(audioContext, { channelCount: 1, gain: 0.3 })
      $.gainNodePool = new ObjectPool(() => {
        return new GainNode(audioContext, { channelCount: 1, gain: 0 })
      })

      $.monoNodePool = new ObjectPool(async () => {
        return await MonoNode.create(audioContext, {
          numberOfInputs: 0,
          numberOfOutputs: 1,
          processorOptions: {
            metrics: 0,
          }
        })
      })

      $.groupNodePool = new ObjectPool(() => {
        return new SchedulerEventGroupNode(schedulerNode)
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
      $.preview = createPreview(waveplot, previewSampleRate)
    })
  }
)

export type EditorBuffer = typeof EditorBuffer.State
export const EditorBuffer = reactive('editor-buffer',
  class props {
    audio!: typeof Audio.State
    kind!: 'sound' | 'pattern'
    id?= cheapRandomId()

    value!: string

    parentId?: string

    createdAt?: number = Date.now()
    isDraft?: boolean = true
    isNew?: boolean = true
  },
  class local {
    snapshot?: any

    markers: Marker[] = []
    lenses: Lens[] = []

    paramMarkers?: Marker[] = []
    errorMarkers?: Marker[] = []
    errorLenses?: Lens[]
    sliders?: Sliders

    canvas?: HTMLCanvasElement
    canvases: Map<HTMLCanvasElement, string> = new Map()

    midiEvents?: WebMidi.MIDIMessageEvent[]
    numberOfBars?: number

    error?: Error | false = false
  },
  function actions({ $, fns, fn }) {
    return fns(new class actions {
      derive = () => {
        return pick($, [
          'value',
          'audio',
          'kind',
          'snapshot',
        ])
      }
    })
  },
  function effects({ $, fx }) {
    if ($.kind === 'sound') {
      fx(({ audio, value }) => {
        $.sliders = audio.$.getSliders(value)
      })

      fx(({ sliders }) => {
        $.paramMarkers = [...sliders.values()].map((slider) =>
          markerForSlider(slider)
        )
      })

      fx(({ paramMarkers, errorMarkers }) => {
        $.markers = [...paramMarkers, ...errorMarkers]
      })

      fx(({ errorLenses }) => {
        $.lenses = [...errorLenses]
      })

      fx(({ audio }) =>
        audio.fx(({ preview }) =>
          fx(async ({ value }) => {
            const error = await preview.draw($.self)

            if (!error) {
              $.errorMarkers = []
              $.errorLenses = []
              $.error = false
            } else {
              console.warn(error)

              $.error = error

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
                  line: value.split('\n').length,
                  message,
                }]
              }
            }
          })
        )
      )
    }
    else if ($.kind === 'pattern') {
      fx(({ errorMarkers }) => {
        $.markers = [...errorMarkers]
      })

      fx(({ errorLenses }) => {
        $.lenses = [...errorLenses]
      })

      fx(async ({ value }) => {
        const result = await compilePattern(
          value,
          $.numberOfBars || 1
        )

        if (result.success) {
          $.midiEvents = result.midiEvents
          $.numberOfBars = result.numberOfBars
          $.errorMarkers = []
          $.errorLenses = []
          $.error = false
        } else {
          const { error } = result

          console.warn(error)

          $.error = error

          const message = error.message
          const key = message.split(':')[0]
          const line = Math.max(0, getErrorInputLine(error) - 155)
          let token = getErrorToken(error)

          const lines = value.split('\n')

          let col = -1

          if (token.length) {
            col = lines.at(line)?.lastIndexOf(token) ?? -1
          }

          if (col === -1) {
            token = lines.at(line) ?? ''
          }

          const index = Math.max(0, Math.min(
            lines.slice(0, line).join('\n').length
            + (line > 0 ? 1 : 0) + (col >= 0 ? col : 0),
            value.length
          ))

          $.errorLenses = [{
            line: Math.min(lines.length, line + (value[index] === '\n' ? 0 : 1)),
            message: message.split('\n')[0].slice(message.indexOf(':') + 1).split('   at')[0],
          }]

          $.errorMarkers = [
            {
              key,
              index,
              size: Math.max(1, token.length),
              kind: 'error',
              color: '#a21',
              hoverColor: '#f42',
              message,
            },
          ]
        }
      })
    }
  }
)

type Track = typeof Track.State
const Track = reactive('track',
  class props {
    id!: string
    sound!: string
    pattern!: string
    vol?: number = 0.5
    focus?: 'sound' | 'pattern'
    isDraft?: boolean = true
  },
  class local {
  },
  function actions({ $, fns, fn }) {
    return fns(new class actions {

    })
  },
  function effects({ $, fx }) {

  }
)

export const App = web(view('app',
  class props {
    distRoot?= '/example'
    monospaceFont?= 'Brass.woff2'
  },

  class local {
    host = element

    audio = Audio({
      bpm: 120,
      audioContext: new AudioContext({
        sampleRate: 44100, latencyHint: 0.04
      }),
    })

    hint: JSX.Element = false

    track?: Track
    trackActiveId = 'a'
    tracksLive = ['a', 'b']
    tracks: Map<string, Track> = new Map([
      ['a', Track({ id: 'a', sound: 'a', pattern: 'a', isDraft: false })],
      ['b', Track({ id: 'b', sound: 'b', pattern: 'b', isDraft: false })],
    ])

    soundEditor?: typeof Editor.Element
    sound?: EditorBuffer
    sounds: Map<string, EditorBuffer> = new Map([
      ['a', EditorBuffer({ id: 'a', kind: 'sound', value: snareCode2, audio: this.audio, isDraft: false, isNew: false })],
      ['b', EditorBuffer({ id: 'b', kind: 'sound', value: monoDefaultEditorValue, audio: this.audio, isDraft: false, isNew: false })],
    ])

    patternEditor?: typeof Editor.Element
    pattern?: EditorBuffer
    patterns: Map<string, EditorBuffer> = new Map([
      ['a', EditorBuffer({ id: 'a', kind: 'pattern', value: patternDefaultCode, audio: this.audio, isDraft: false, isNew: false })],
      ['b', EditorBuffer({ id: 'b', kind: 'pattern', value: patternDefaultCode2, audio: this.audio, isDraft: false, isNew: false })],
    ])

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
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {

    })
  },

  function effects({ $, fx, deps, refs }) {
    $.css = /*css*/`
    & {
      width: 100%;
      height: 100%;
      display: flex;
    }
    `

    fx(({ distRoot, monospaceFont }) => {
      const bodyStyle = document.createElement('style')
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
        background: #000;
        overflow: hidden;
      }
      `

      document.head.appendChild(bodyStyle)
    })

    fx(({ trackActiveId, tracks }) => {
      $.track = tracks.get(trackActiveId)!
    })

    fx(({ track, patterns }) =>
      track.fx(({ pattern }) => {
        $.pattern = patterns.get(pattern)!
      })
    )

    fx(({ track, sounds }) =>
      track.fx(({ sound }) => {
        $.sound = sounds.get(sound)!
      })
    )

    fx(({ audio }) =>
      audio.fx(({ preview }) =>
        fx(({ sound }) => {
          preview.setActiveId(sound.$.id!)
        })
      )
    )

    fx(({ audio, track, tracks, tracksLive, sound, sounds, pattern, patterns, editorScene }) => {
      $.view = <>
        <Hint message={deps.hint} />

        <Spacer id="app-spacer" align="y" initial={[0, 0.3]}>
          <Spacer id="app-top" align="x" part="top" initial={
            Array.from({ length: tracks.size }, (_, i) => i / tracks.size)
          }>
            {tracksLive.map((id) =>
              <TrackView
                key={id}
                audio={audio}
                getTime={audio.$.getTime}
                active={id === track.$.id}
                sound={sounds.get(tracks.get(id)!.$.sound)!}
                pattern={patterns.get(tracks.get(id)!.$.pattern)!}
                onClick={() => {
                  $.trackActiveId = id
                }}
              />
            )}
          </Spacer>

          <Spacer id="app-bottom" align="x" part="bottom" initial={[
            0,
            0.5,
            0.5 + 0.5 / 3,
            0.5 + 0.5 / 3 * 2,
          ]}>

            <div>
              <TrackView.Fn
                id="main"
                active={false}
                audio={audio}
                getTime={audio.$.getTime}
                sound={sound}
                pattern={pattern}
              />

              <Spacer id="editors" align="x" initial={[0, 0.5]}>
                <Editor
                  ref={refs.patternEditor}
                  key="pattern"
                  app={$}
                  scene={editorScene}
                  buffers={patterns}
                  activeId={track.$.pattern}
                  onEdit={(id, value) => {
                    const pattern = patterns.get(id)!
                    // if (pattern.$.isDraft) {
                    pattern.$.value = value
                    // } else {
                    //   $.patterns = add(patterns, EditorBuffer(pattern.$.derive()))
                    // }
                  }}
                  onCode={() => { }}
                  onWheelMarker={() => { }}
                />

                <Editor
                  ref={refs.soundEditor}
                  key="sound"
                  app={$}
                  scene={editorScene}
                  buffers={sounds}
                  activeId={track.$.sound}
                  onEdit={(id, value) => {
                    // if (sound.$.isDraft) {
                    sounds.get(id)!.$.value = value
                    // }
                  }}
                  onCode={() => { }}
                  onWheelMarker={() => { }}
                />
              </Spacer>
            </div>

            <div part="presets">
              {[...patterns].map(([id, pattern]) =>
                <TrackView
                  active={id === track.$.pattern}
                  getTime={audio.$.getTime}
                  pattern={pattern}
                  onClick={() => {
                    // if (track.$.isDraft) {
                    track.$.pattern = id
                    // }
                  }}
                />
              )}
            </div>

            <div part="presets">
              {[...sounds].map(([id, sound]) =>
                <TrackView
                  audio={audio}
                  active={id === track.$.sound}
                  sound={sound}
                  onClick={() => {
                    track.$.sound = id
                  }}
                />
              )}
            </div>

            <div part="presets">
              {[...tracks].map(([id, t]) =>
                <TrackView
                  active={id === track.$.id}
                  audio={audio}
                  getTime={audio.$.getTime}
                  sound={sounds.get(t.$.sound)!}
                  pattern={patterns.get(t.$.pattern)!}
                  onClick={() => {
                    track.$.sound = t.$.sound
                    track.$.pattern = t.$.pattern
                  }}
                />
              )}
            </div>

          </Spacer>
        </Spacer>
      </>
    })
  }
))

const Editor = web(view('editor',
  class props {
    app!: typeof App.Context
    scene!: EditorScene
    buffers!: Map<string, EditorBuffer>
    activeId!: string
    markers?: Marker[] = []
    lenses?: Lens[] = []
    onEdit!: (id: string, value: string) => void
    onCode!: (id: string, prev: string, next: string, editor: CanvyElement) => void
    onWheelMarker!: (e: WheelEvent, bufferId: string, markerId: Marker['key']) => void
  },

  class local {
    host = element
    value?: string
    editor?: CanvyElement
    activeMarker?: Marker | false = false
    buffer?: EditorBuffer
    state: 'init' | 'compiled' | 'errored' = 'init'
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      setBuffer = fn(({ editor }) => (buffer: EditorBuffer) => {
        if (buffer.$.snapshot) {
          editor.setFromSnapshot(buffer.$.snapshot)
        } else {
          editor.setValue(buffer.$.value, true, true)
        }
        // editor.focus()
      })

      onWheel = fn(({ onWheelMarker }) => (e: WheelEvent) => {
        if ($.activeMarker && $.activeMarker.kind === 'param') {
          onWheelMarker(e, $.activeId, $.activeMarker.key)
        }
      })

      onEnterMarker = fn(({ app }) => ({
        detail: { marker, markerIndex }
      }: { detail: { marker: Marker, markerIndex: number } }) => {
        $.activeMarker = marker
        app.hint = marker?.message
      })

      onLeaveMarker = fn(({ app }) => ({
        detail: { marker }
      }: { detail: { marker: Marker, markerIndex: number } }) => {
        // if (marker === $.activeMarker) {
        $.activeMarker = false
        app.hint = false
        // }
      })
    })
  },

  function effects({ $, fx, deps }) {
    $.css = /*css*/`
    [part=state] {
      width: 10px;
      height: 10px;
      position: absolute;
      right: 10px;
      top: 10px;
      border-radius: 100%;
      background: #333;
      z-index: 999999;
    }
    &([state=compiled]) {
      [part=state] {
        background: #29f;
      }
    }
    &([state=errored]) {
      [part=state] {
        background: #f21;
      }
    }
    ${Code} {
      /* z-index: 0; */
    }
    `

    fx.raf(({ host, state }) => {
      host.setAttribute('state', state)
    })

    fx(({ buffers, activeId }) => {
      $.buffer = buffers.get(activeId)!
    })

    fx(({ buffer }) =>
      buffer.fx(({ markers }) => {
        $.markers = markers
      })
    )

    fx(({ buffer }) =>
      buffer.fx(({ lenses }) => {
        $.lenses = lenses
      })
    )

    fx(({ buffer }) =>
      buffer.fx(({ error }) => {
        $.state = error ? 'errored' : 'compiled'
      })
    )

    fx(function updateCodeValue({ editor, buffers, activeId, onCode }, prev) {
      const buffer = buffers.get(activeId)!

      if ($.value == null) {
        $.value = buffer.$.value
        $.setBuffer(buffer)
        return
      }

      const prevCodeValue = $.value
      const nextCodeValue = buffer.$.value

      if (prevCodeValue === nextCodeValue) {
        buffer.$.isNew = false
        return
      }

      $.value = nextCodeValue

      if (prev.activeId) {
        if (activeId !== prev.activeId) {
          const prevBuffer = buffers.get(prev.activeId)!
          const nextBuffer = buffer

          if (nextBuffer.$.isNew) {
            if (nextBuffer.$.parentId !== prevBuffer.$.id) {
              throw new Error('Invalid buffer')
            }
            nextBuffer.$.isNew = false
            // onCode(buffer.id, prevCodeValue, nextCodeValue, editor)
          } else {
            // editor.$.effect.once(({ snapshot }) => {
            //   // if (buffer.snapshot) {
            //   //   onCode(buffer.id, buffer.snapshot.value, nextCodeValue, editor)
            //   // }
            // })

            const snapshot = editor.editor.getSnapshotJson()

            const prevBuffer = buffers.get(prev.activeId)!

            prevBuffer.$.snapshot = snapshot

            $.setBuffer(buffer)
          }
        } else {
          onCode(buffer.$.id!, prevCodeValue, nextCodeValue, editor)
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
    fx(function dispatchOnEdit({ value, activeId, onEdit }, prev) {
      if (prev.activeId === activeId) {
        onEdit(activeId, value)
      }
    })

    const initialFontSize = window.innerWidth > 800 ? 20 : 18
    fx(({ app, scene, markers, lenses }) => {
      $.view = <div style="width:100%; height: 100%; display: flex;">
        <div part="state" onpointerenter={() => {
          app.hint = ($.buffer?.$.error ? $.buffer.$.error.message : '') || ''
        }} onpointerleave={() => {
          app.hint = ''
        }}></div>
        <Code
          style="width: 100%; height: 100%; flex: 1;"
          font={`${app.distRoot}/fonts/${app.monospaceFont}`}
          fontSize={initialFontSize}
          singleComment="\"
          scene={scene}
          editor={deps.editor}
          value={deps.value}
          markers={markers}
          lenses={lenses}
          onWheel={$.onWheel}
          onEnterMarker={$.onEnterMarker}
          onLeaveMarker={$.onLeaveMarker}
        />
      </div>
    })
  }
))

const Hint = web(view('hint',
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
      z-index: 9999999999;
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


export const TrackView = web(view('track-view',
  class props {
    id?: string = cheapRandomId()
    audio?: typeof Audio.State
    active!: boolean
    sound?: EditorBuffer
    pattern?: EditorBuffer
    getTime?: () => number
    onClick?: () => void
  },

  class local {
    host = element
    canvas?: HTMLCanvasElement
    canvasView: JSX.Element = false
    midiView: JSX.Element = false
    soundLabel: JSX.Element = false
    patternLabel: JSX.Element = false
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      onPointerDown = fn(({ onClick }) => (e: PointerEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      })
    })
  },

  function effects({ $, fx, refs }) {
    $.css = /*css*/`
    & {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: #000;
      border-bottom: 1px solid #333;
    }
    button {
      all: unset;
      z-index: 2;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-family: Mono;
      font-size: 20px;
      width: 100%;
      height: 100%;
      color: #fff;
      cursor: pointer;
      /* text-shadow: 1px 2px #000; */
      > span {
        z-index: 2;
      }
      .shadow {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;
        -webkit-text-stroke: 6px #000;
        z-index: 1;
      }
    }
    canvas {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      image-rendering: pixelated;
      pointer-events: none;
    }
    ${Midi} {
      position: absolute;
      pointer-events: none;
      left: 0;
      top: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
    }

    &([active]) {
      background: #fff2;
    }
    `

    fx.raf(({ host, active }) => {
      host.toggleAttribute('active', active)
    })

    fx(({ getTime, pattern }) =>
      pattern.fx(({ id, isDraft, midiEvents, numberOfBars }) => {
        $.midiView = <Midi
          part="midi"
          state="idle"
          style={/*css*/`
            background: ${isDraft ? bgForHue(checksum(id)) : 'transparent'};
            background-size: 45px 45px;
            background-position: center 12.5px;
          `}
          getTime={getTime}
          midiEvents={midiEvents!}
          numberOfBars={numberOfBars!}
        />
      })
    )

    fx(({ id, audio }) =>
      audio.fx(async ({ waveplot }) => {
        if (!$.canvas) {
          const { canvas } = await waveplot.create(id)
          $.canvas = canvas
          $.canvasView = <canvas part="canvas" ref={refs.canvas} />
        }
        if (id !== 'main') {
          return fx.raf(({ active }) => {
            if (active) {
              waveplot.copy(id, 'main')
            }
          })
        }
      })
    )

    fx(({ sound, canvas }, prev) => {
      if (prev.sound && prev.sound.$.id !== sound.$.id) {
        prev.sound.$.canvases.delete(canvas)
      }
      sound.$.canvases.set(canvas, canvas.id)
    })

    fx(({ id, audio }) => audio.fx(({ waveplot }) =>
      fx(({ sound }) =>
        sound.fx(({ id: soundId, canvas: _ }) =>
          fx.raf(({ canvas: _ }) => {
            waveplot.copy(soundId, id)
          })
        )
      )
    ))


    fx(({ sound }) =>
      sound.fx(({ value }) => {
        $.soundLabel = <span>{getTitle(value)}</span>
      })
    )

    fx(({ pattern }) =>
      pattern.fx(({ value }) => {
        $.patternLabel = <span>{getTitle(value)}</span>
      })
    )

    fx(function drawTrackButton({ canvasView, midiView, soundLabel, patternLabel }) {
      $.view = <>
        {canvasView}
        {midiView}
        {$.onClick &&
          <button onpointerdown={$.onPointerDown}>
            {[soundLabel, patternLabel]}
            <div class="shadow">
              {[soundLabel, patternLabel]}
            </div>
          </button>
        }
      </>
    })
  }
))

////////////////

export const Skeleton = view('skeleton',
  class props {

  },
  class local { },
  function actions({ $, fns, fn }) {
    return fns(new class actions {

    })
  },
  function effects({ $, fx, deps, refs }) {

  }
)
type Skeleton = typeof Skeleton.Hook
