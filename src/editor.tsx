/** @jsxImportSource minimal-view */

import { Marker, CanvyElement, Lens } from 'canvy'
import { filterMap } from 'everyday-utils'
import { web, view, element, chain } from 'minimal-view'
import { app } from './app'
import { services } from './services'
import { Code } from './code'
import { EditorBuffer } from './editor-buffer'
import { Player } from './player'
import { markerForSlider } from './slider'
import { getCodeWithoutArgs } from './util/args'
import { getErrorInputLine, getErrorToken } from './util/parse'

export const Editor = web(view('editor',
  class props {
    name!: string
    player!: Player | false
    buffer!: EditorBuffer
    readableOnly?= false
    initialFontSize?= window.innerHeight > 900 ? 15.5 : 14
  },

  class local {
    host = element
    state: 'init' | 'compiled' | 'errored' = 'init'
    editor?: CanvyElement
    editorBuffer?: EditorBuffer
    hoveringMarker?: Marker | false = false
    fontSize?: number

    markers: Marker[] = []
    lenses: Lens[] = []
    paramMarkers: Marker[] = []
    errorMarkers: Marker[] = []
    errorLenses: Lens[] = []
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      onWheel = (e: WheelEvent) => {
        if ($.hoveringMarker && $.hoveringMarker.kind === 'param') {
          const sliderId = $.hoveringMarker.key
          const slider = $.buffer.$.sliders.get(sliderId)
          if (!slider) return

          const normal = slider.$.onWheel(e, slider.$.normal)
          if ($.player) {
            $.player.$.onSliderNormal(sliderId, normal)
          }
        }
      }

      onMarkerEnter = ({ detail: { marker, markerIndex } }: { detail: { marker: Marker, markerIndex: number } }) => {
        $.hoveringMarker = marker
        app.$.hint = marker?.message
      }

      onMarkerLeave = ({ detail: { marker } }: { detail: { marker: Marker, markerIndex: number } }) => {
        // if (marker === $.activeMarker) {
        $.hoveringMarker = false
        app.$.hint = false
        // }
      }
    })
  },

  function effects({ $, fx, deps }) {
    $.css = /*css*/`
    & {
      padding: 8px 8px 8px 6px;
      box-sizing: border-box;
    }
    ${Code} {
      /* z-index: 0; */
    }
    `

    fx.raf(({ host, state }) => {
      host.setAttribute('state', state)

      // TODO: better way to react on state from parent
      const parent = ((host.getRootNode() as ShadowRoot).host.getRootNode() as ShadowRoot).host
      parent?.setAttribute('state', state)
    })

    // have a local copy of buffer's properties so we can
    // manage the transitions precisely.
    fx.once(({ name, buffer }) => {
      $.editorBuffer = EditorBuffer(
        buffer.$.derive({
          id: `editor-${name}`,
          noDraw: true
        })[1]
      )
    })

    fx(({ editor, readableOnly }) => {
      editor.setReadableOnly(readableOnly)
    })

    let prevCodeNoArgs: string

    fx(({ editor, editorBuffer, buffer }, prev) =>
      chain(
        buffer.fx(() => {
          prevCodeNoArgs = buffer.$.getCodeNoArgs()

          const areValuesCompatible = editorBuffer.$.getCodeNoArgs() === prevCodeNoArgs

          $.paramMarkers = []
          $.errorMarkers = []
          $.errorLenses = []

          if (prev.buffer) {
            prev.buffer.$.editor = null
          }

          buffer.$.editor = editor

          editorBuffer.$.value = buffer.$.value
          editorBuffer.$.kind = buffer.$.kind

          if (buffer.$.snapshot) {
            editor.setFromSnapshot(buffer.$.snapshot)
          } else {
            if (buffer.$.originalValue) {
              editor.setValue(buffer.$.originalValue!, true, !areValuesCompatible)
              queueMicrotask(() => {
                editor.setValue(buffer.$.value)
              })
            } else {
              editor.setValue(buffer.$.value, true, !areValuesCompatible)
            }
          }
        }),
        buffer.fx(({ error }) => {
          $.state = error ? 'errored' : 'compiled'
        }),
        buffer.fx(({ kind }) => {
          if (kind === 'sound') {
            return chain(
              buffer.fx(({ sliders }) => {
                $.paramMarkers = filterMap(
                  [...sliders.values()],
                  markerForSlider
                )
              }),

              fx(({ paramMarkers, errorMarkers }) => {
                $.markers = [...paramMarkers, ...errorMarkers]
              }),

              fx(({ errorLenses }) => {
                $.lenses = [...errorLenses]
              }),

              buffer.fx(({ value, error }) => {
                if (!error) {
                  $.errorMarkers = []
                  $.errorLenses = []
                } else {
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
          } else if (kind === 'pattern') {
            return chain(
              fx(({ errorMarkers }) => {
                $.markers = [...errorMarkers]
              }),

              fx(({ errorLenses }) => {
                $.lenses = [...errorLenses]
              }),

              buffer.fx(({ error }) => {
                if (!error) {
                  $.errorMarkers = []
                  $.errorLenses = []
                } else {
                  const value = buffer.$.value
                  const message = error.message
                  const key = message.split(':')[0]

                  const sandboxCode = buffer.$.sandboxCode || ''
                  const lineOffset = sandboxCode.slice(0, sandboxCode.indexOf('detectLinePos')).split('\n').length + 4
                  const line = Math.max(0, getErrorInputLine(error) - lineOffset)

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
            )
          }
        }),
        buffer.fx(({ value }, prev) => {
          const codeNoArgs = getCodeWithoutArgs(value)
          const prevCodeNoArgs = getCodeWithoutArgs(prev.value ?? '')
          if (codeNoArgs !== prevCodeNoArgs) {
            editor.setValue(value)
          }
        }),
      )
    )

    fx(({ editorBuffer, buffer, player }) =>
      editorBuffer.fx(({ kind, value }) => {
        if (value === buffer.$.value) return

        if (kind === 'sound') {
          if (player.$.onSoundValue(value)) {
            buffer.$.value = value
          }
        } else if (kind === 'pattern') {
          if (player.$.onPatternValue(value)) {
            buffer.$.value = value
          }
        }
      })
    )

    fx.once(({ initialFontSize }) => {
      $.fontSize = initialFontSize
    })

    fx(function $view({ name, editorBuffer, fontSize }) {
      $.view = <div style="width:100%; height: 100%; display: flex;">
        <Code
          style="width: 100%; height: 100%; flex: 1;"
          name={name}
          font={`${app.$.distRoot}/fonts/JetBrainsMono-Light.ttf`}
          // fontName="JetBrains Mono"
          fontSize={fontSize}
          singleComment="\"
          scene={services.$.editorScene}
          editor={deps.editor}
          value={editorBuffer.deps.value}
          markers={deps.markers}
          lenses={deps.lenses}
          onWheel={$.onWheel}
          onMarkerEnter={$.onMarkerEnter}
          onMarkerLeave={$.onMarkerLeave}
        />
      </div>
    })
  }
))
