/** @jsxImportSource minimal-view */

import { filterMap } from 'everyday-utils'
import { chain, part, view, web } from 'minimal-view'
import { PianoKeys } from 'x-pianokeys'
import { Button } from './button'
import { Editor } from './editor'
import { EditorBuffer } from './editor-buffer'
import { Player } from './player'
import { Project } from './project'
import { services } from './services'
import { SliderView } from './slider-view'
import { Spacer } from './spacer'
import { TrackView } from './track-view'
import { cachedRef } from './util/cached-ref'
import { classes } from './util/classes'
import { delById, get, replaceAtIndex } from './util/list'
import { storage } from './util/storage'
import { Vertical } from './vertical'

let presetsSmoothScrollTimeout: any

export function startTemporaryPresetsSmoothScroll(id: string) {
  const el = cachedRef(`presets-${id}`)?.current
  if (el) {
    el.style.scrollBehavior = 'smooth'
    clearTimeout(presetsSmoothScrollTimeout)
    presetsSmoothScrollTimeout = setTimeout(() => {
      el.style.scrollBehavior = 'auto'
    }, 100)
  }
}

export type PlayerEditor = typeof PlayerEditor.State

export const PlayerEditor = web(view('player-editor',
  class props {
    id!: string
    player!: Player
    editorVisible = false
  },
  class local {
    project?: Project
    players: Player[] = []

    editor?: InstanceType<typeof Editor.Element>
    editorEl?: HTMLElement
    editorBuffer?: EditorBuffer

    selectedPreset?: EditorBuffer

    sounds?: EditorBuffer[]
    sound?: EditorBuffer
    patterns?: EditorBuffer[]
    pattern?: EditorBuffer

    focus?: 'sound' | 'pattern'
    focusedSound?: EditorBuffer
    focusedPattern?: EditorBuffer
    soundId?: string
    patternId?: string
    readableOnly?: boolean
  },
  function actions({ $, fns, fn }) {

    return fns(new class actions {
      // editor

      focusEditor = fn(({ editor }) => () => {
        editor.$.editor?.focus()
      })

      // buffers

      onBufferSave = (id: string, { kind }: { kind: string }) => {
        if (kind === 'sound') {
          this.onSoundSave(id)
        } else if (kind === 'pattern') {
          this.onPatternSave(id)
        }
      }

      // presets

      onPresetsRearrange = (id: string, { dir, kinds }: { dir: 1 | -1, kinds: 'sounds' | 'patterns' }) => {
        const buffers = services.$.library.$[kinds]

        const index = buffers.findIndex((buffer) => buffer.$.id === id)

        const dest = index + dir
        if (dest >= 0 && dest < buffers.length) {
          const bufs = [...buffers]
          const [buffer] = bufs.splice(index, 1)
          bufs.splice(dest, 0, buffer)
          services.$.library.$[kinds] = [...bufs]
        }
      }

      // sound

      onSoundSelect = (id: string, { noPreview }: { noPreview?: boolean } = {}) => {
        startTemporaryPresetsSmoothScroll($.project!.$.id!)

        $.project!.$.selectedPreset = get(services.$.library.$.sounds, id)!

        if (noPreview) return

        if (id !== services.$.previewPlayer!.$.sound) {
          queueMicrotask(() => {
            services.$.sendTestNote()
          })
        } else {
          services.$.sendTestNote()
        }
      }

      onSoundUse = fn(({ player }) => (id: string) => {
        player.$.sound = id
        this.onSoundSelect(id, { noPreview: true })
      })

      onSoundSave = (id: string) => {
        get(services.$.library.$.sounds, id)!.$.isDraft = false
      }

      onSoundDelete = (id: string) => {
        const index = $.players.map((player) => player.$.sound).indexOf(id)
        if (!~index) {
          services.$.library.$.sounds = delById(services.$.library.$.sounds, id)
        }
      }

      onSoundRearrange = (id: string, { dir }: { dir: 1 | -1 }) => {
        this.onPresetsRearrange(id, { dir, kinds: 'sounds' })
      }

      // pattern

      onPatternSelect = (id: string) => {
        startTemporaryPresetsSmoothScroll($.project!.$.id!)
        $.project!.$.selectedPreset = get(services.$.library.$.patterns, id)!
      }

      onPatternUse = fn(({ player }) => (id: string) => {
        player.$.patterns = replaceAtIndex(
          player.$.patterns,
          player.$.pattern,
          id
        )

        this.onPatternSelect(id)
      })

      onPatternSave = (id: string) => {
        get(services.$.library.$.patterns, id)!.$.isDraft = false
      }

      onPatternDelete = (id: string) => {
        const index = $.players.flatMap((player) => player.$.patterns).indexOf(id)
        if (!~index) {
          services.$.library.$.patterns = delById(services.$.library.$.patterns, id)
        }
      }

      onPatternRearrange = (id: string, { dir }: { dir: 1 | -1 }) => {
        this.onPresetsRearrange(id, { dir, kinds: 'patterns' })
      }
    })
  },
  function effects({ $, fx, deps, refs }) {
    fx(() => services.fx(({ library }) =>
      chain(
        library.fx(({ sounds }) => {
          $.sounds = sounds
        }),
        library.fx(({ patterns }) => {
          $.patterns = patterns
        }),
      )
    ))

    fx(({ player }) =>
      chain(
        player.fx(({ project }) => {
          $.project = project
        }),
        player.fx(({ soundBuffer }) => {
          $.sound = soundBuffer
        }),
        player.fx(({ patternBuffer }) => {
          $.pattern = patternBuffer
        }),
      )
    )

    fx(({ project }) =>
      chain(
        project.fx(({ players }) => {
          $.players = players
        }),
        project.fx(({ players, selectedPlayer }) => {
          $.player = players[selectedPlayer]
        }),
        project.fx(({ selectedPreset }) => {
          $.selectedPreset = selectedPreset
        }),
      )
    )

    fx(({ selectedPreset }) => {
      $.editorBuffer = selectedPreset
    })

    fx(({ editorBuffer }) => {
      $.focus = editorBuffer.$.kind
    })

    fx(({ sound, pattern, focus, editorBuffer }) => {
      $.focusedSound = focus === 'sound' ? editorBuffer : sound
      $.focusedPattern = focus === 'pattern' ? editorBuffer : pattern
    })

    fx(({ focusedSound, focusedPattern }) => {
      $.soundId = focusedSound.$.id!
      $.patternId = focusedPattern.$.id!
    })

    fx(({ player, focus, soundId, patternId }) => player.fx(({ sound, patterns, pattern }) => {
      $.readableOnly =
        (focus === 'sound' && sound !== soundId)
        || (focus === 'pattern' && patterns[pattern] !== patternId)
    }))

    const TrackViews = part((update) => {
      fx(({ id, project, player, players, focusedSound, focusedPattern, editorBuffer, focus, readableOnly }) => editorBuffer.fx(({ isDraft }) => {
        update(<div ref={cachedRef(`trackviews-${id}`)} class="trackviews wrapper">
          <TrackView
            key="trackview-sound"
            ref={cachedRef(`trackview-${id}-sound`)}
            class={classes({
              hidden: focus !== 'sound'
            })}
            style="max-width:100%"
            active={false}
            hoverable={false}
            showNotes={false}
            sliders={!readableOnly}
            player={editorBuffer.$.id === player.$.sound && player}
            main={false}
            sound={focusedSound}
            pattern={false}
            xPos={0}
            clickMeta={editorBuffer.$}
          />

          <TrackView
            key="trackview-pattern"
            ref={cachedRef(`trackview-${id}-pattern`)}
            class={classes({
              hidden: focus !== 'pattern'
            })}
            style="max-width:100%"
            active={false}
            hoverable={false}
            showNotes={true}
            sliders={false}
            player={editorBuffer.$.id === player.$.patterns[player.$.pattern] && player}
            main={false}
            sound={false}
            pattern={focusedPattern}
            xPos={player.$.pattern}
            clickMeta={editorBuffer.$}
          />

          <div class="track-toolbar">
            <div class="track-toolbar-controls">
              {readableOnly && <Button small onClick={() => {
                if (focus === 'sound') {
                  $.onSoundUse(editorBuffer.$.id!)
                } else if (focus === 'pattern') {
                  $.onPatternUse(editorBuffer.$.id!)
                }
              }}>
                <span class="i mdi-light-chevron-up" style="font-size:26px; position: relative; left: 0.75px; top: -2.25px;" />
              </Button>}
            </div>

            <div class="track-toolbar-controls">
              {isDraft && <>
                <Button small onClick={() => {
                  player.$.monoNode!.setCode(focusedSound.$.value, true)
                }}>
                  <span class="i la-redo-alt" />
                </Button>

                <Button small onClick={() => {
                  $.onBufferSave(editorBuffer!.$.id!, editorBuffer!.$)
                }}>
                  <span class="i la-check" style="font-size:17px; position: relative; -webkit-text-stroke: .1px;" />
                </Button>
              </>}

              {(focus === 'sound'
                ? players.length > 1
                : focus === 'pattern'
                  ? player.$.patterns.length > 1
                  : false) && <Button small onClick={focus === 'sound' ? () => {
                    const players = [...project.$.players]
                    if (players.length > 1) {
                      const index = players.indexOf(player)
                      players.splice(index, 1)
                      project.$.players = players
                      if (index >= players.length) {
                        project.$.selectedPlayer = players.length - 1
                      }
                    }
                  } : () => {
                    const patterns = [...player.$.patterns]
                    if (patterns.length > 1) {
                      patterns.splice(player.$.pattern, 1)
                      player.$.patterns = patterns
                      player.$.pattern = Math.min(patterns.length - 1, player.$.pattern)
                    }
                  }}>
                  <span class={`i clarity-trash-line`} style="font-size:17px; position: relative;" />
                </Button>}

              <div style="display: flex; flex-flow: column nowrap">
                <Button small half up onClick={() => {
                  const players = [...project.$.players]
                  if (players.length > 1) {
                    const index = players.indexOf(player)
                    if (index >= 1) {
                      players.splice(index, 1)
                      players.splice(index - 1, 0, player)
                      project.$.players = players
                      project.$.selectedPlayer = index - 1
                    }
                  }
                }}>
                  <span class="i mdi-light-chevron-up" />
                </Button>
                <Button small half down onClick={() => {
                  const players = [...project.$.players]
                  if (players.length > 1) {
                    const index = players.indexOf(player)
                    if (index <= players.length - 2) {
                      players.splice(index, 1)
                      players.splice(index + 1, 0, player)
                      project.$.players = players
                      project.$.selectedPlayer = index + 1
                    }
                  }
                }}>
                  <span class="i mdi-light-chevron-down" />
                </Button>
              </div>

              <Button small onClick={() => {
                services.$.clipboardActive = focus
                services.$.clipboardId = editorBuffer.$.id!
                services.$.clipboardBuffer = editorBuffer
              }}>
                <span class="i la-copy" style="font-size: 16px" />
              </Button>

              <Button small onClick={
                focus === 'sound' ? () => {
                  const players = [...project.$.players]
                  const index = players.indexOf(player)
                  players.splice(index + 1, 0, Player({
                    ...player.$.derive(),
                    project
                  }))
                  project.$.players = players
                  project.$.selectedPlayer = index + 1
                } : () => {
                  const patterns = [...player.$.patterns]
                  patterns.splice(player.$.pattern + 1, 0, focusedPattern.$.id!)
                  player.$.patterns = patterns
                }}>
                <span class={`i fluent-padding-${focus === 'sound' ? 'down' : 'right'
                  }-24-regular`} style="font-size:17px; position: relative;" />
              </Button>
            </div>
          </div>
        </div>)
      }))
    })

    const SoundPresets = part((update) => {
      fx(({ id, focus, sounds, selectedPreset, editorVisible }) => {
        update(<div
          key="sounds"
          ref={cachedRef(`sounds-${id}`)}
          part="app-presets"
          class={classes({
            hidden: focus !== 'sound'
          })}
        >
          {sounds.map((s) =>
            <TrackView
              key={s.$.id!}
              ref={cachedRef(`sound-${id}-${s.$.id}`)}
              canFocus
              active={
                editorVisible
                && selectedPreset === s
              }
              sound={s}
              clickMeta={s.$}
              onClick={$.onSoundSelect}
              onCtrlClick={$.onSoundUse}
              onCtrlShiftClick={$.onSoundDelete}
              onRearrange={$.onSoundRearrange}
            />
          )}
        </div>)
      })
    })

    const PatternPresets = part((update) => {
      fx(({ id, focus, patterns, selectedPreset, editorVisible }) => {
        update(<div
          key="patterns"
          ref={cachedRef(`patterns-${id}`)}
          part="app-presets"
          class={classes({
            hidden: focus !== 'pattern'
          })}
        >
          {patterns.map((p) =>
            <TrackView
              key={p.$.id!}
              ref={cachedRef(`pattern-${id}-${p.$.id}`)}
              canFocus
              active={
                editorVisible
                && selectedPreset === p
              }
              pattern={p}
              clickMeta={p.$}
              onClick={$.onPatternSelect}
              onCtrlClick={$.onPatternUse}
              onCtrlShiftClick={$.onPatternDelete}
              onRearrange={$.onPatternRearrange}
            />
          )}
        </div>)
      })
    })

    const PianoView = part((update) => {
      fx(() => services.fx(({ audio }) =>
        audio.fx(({ audioContext }) =>
          fx(({ id, pattern }) =>
            pattern.fx(({ midiRange }) => {
              const hasRange = isFinite(midiRange[0]) && isFinite(midiRange[1])
              const halfOctaves = !hasRange
                ? 3
                : Math.round(
                  (midiRange[1] - midiRange[0]) / 6
                )

              const startHalfOctave = !hasRange ? 8 : Math.round(midiRange[0] / 6)

              update(
                <PianoKeys
                  ref={cachedRef(`piano-${id}`)}
                  halfOctaves={halfOctaves}
                  startHalfOctave={startHalfOctave}
                  audioContext={audioContext}
                  onMidiEvent={services.$.onMidiEvent}
                  vertical
                />
              )
            })
          )
        )
      ))
    })

    const EditorView = part((update) => {
      fx(({ id, project, player, readableOnly, editorBuffer }) => {

        update(
          <Spacer
            ref={cachedRef(`spacer-${id}`)}
            id="app-selected"
            part="app-selected"
            align="x"
            initial={[
              0,
              .0825,
              .225,
              .60
            ]}
          >
            <PianoView />

            <div ref={cachedRef(`presets-${project.$.id}`)} style="height:100%; position:relative; overflow-y: scroll; overscroll-behavior: contain;">
              <SoundPresets />
              <PatternPresets />
            </div>

            <TrackViews />

            <Editor
              ref={refs.editor}
              part="app-editor"
              name="editor"
              player={player}
              buffer={editorBuffer}
              readableOnly={readableOnly}
            />

          </Spacer>
        )
      })
    })

    const SendsView = part((update) => {
      fx(({ player }) =>
        player.fx(({ sendSliders }) =>
          fx(({ players }) => {
            const playerSliders = filterMap(
              [...sendSliders],
              ([playerId, sliders]) => {
                const player = players.find((p) => p.$.id === playerId)
                if (!player) return
                return [player, sliders] as const
              }
            )

            return chain(
              playerSliders.map(([player]) => player.fx(({ soundBuffer: _ }) => {
                update(<div class="player-routes">
                  <div class="player-sends">
                    <div class="player-sends-sliders">
                      {[...sendSliders.get('dest')!].map(([paramId, slider]) =>
                        <SliderView
                          key={paramId}
                          id={paramId}
                          slider={slider}
                          vertical={false}
                          running={true}
                          showBg={true}
                        />
                      )}
                    </div>
                  </div>
                  {playerSliders.map(([player, sliders]) =>
                    <div class="player-sends">
                      <TrackView
                        player={player}
                        sound={player.$.soundBuffer!}
                        active={false}
                        pattern={false}
                      />
                      <div class="player-sends-sliders">
                        {[...sliders].map(([paramId, slider]) =>
                          <SliderView
                            key={paramId}
                            id={paramId}
                            slider={slider}
                            vertical={false}
                            running={true}
                            showBg={true}
                          />
                        )}
                      </div>
                    </div>
                  )}</div>)
              }))
            )
          })
        )
      )
    })

    services.fx(({ skin }) => {
      $.css = /*css*/`
      ${skin.css}

      & {
        display: flex;
        width: 100%;
      }

      .player {
        &-view {
          display: flex;
          width: 100%;
          flex-flow: column nowrap;
        }
        &-routes {
          display: flex;
          flex-flow: row wrap;
          width: 100%;
          height: 69px;
          gap: 10px;
        }
        &-sends {
          display: flex;
          position: relative;
          flex: 1;
          &:first-child {
            width: 100px;
            flex: 0;
            padding: 0 10px;
          }
          ${TrackView} {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 0;
            width: 100%;
            height: 100%;
          }
          &-sliders {
            display: flex;
            flex-flow: row nowrap;
            width: 100%;
            position: relative;
          }
        }
      }
      `
    })

    fx(({ editorVisible }) => {
      $.view =
        <div
          class={classes({
            'player-view': true,
            hidden: !editorVisible
          })}
        >
          <EditorView />
          {editorVisible && <Vertical
            align='y'
            id='editor'
            size={storage.vertical.get('editor', 290)}
          />}
          <SendsView />
        </div>
    })

  }
))