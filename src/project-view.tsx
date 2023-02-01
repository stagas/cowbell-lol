/** @jsxImportSource minimal-view */

import { web, view, element, chain, part } from 'minimal-view'
import { PianoKeys } from 'x-pianokeys'
import { cachedRef, Selected } from './app'
import { Audio, AudioState } from './audio'
import { Button } from './button'
import { demo } from './demo-code'
import { Editor } from './editor'
import { EditorBuffer } from './editor-buffer'
import { Player } from './player'
import { PlayersView } from './players-view'
import { Project, relatedProjects } from './project'
import { services } from './services'
import { Spacer } from './spacer'
import { TrackView } from './track-view'
import { classes } from './util/classes'
import { delById, get, replaceAtIndex } from './util/list'
import { timeAgo } from './util/time-ago'
import { Volume } from './volume'
import { Wavetracer } from './wavetracer'

export type Focused = 'main' | 'sound' | 'sounds' | 'pattern' | 'patterns'

export const ProjectView = web(view('project-view',
  class props {
    id!: string
    project!: Project
    primary!: boolean
    browsing!: boolean
    controlsView?: JSX.Element = false
  },
  class local {
    selected: Selected = { player: 0, preset: '' }
    focused: Focused = 'sound'

    host = element
    state?: AudioState = 'init'
    audio?: Audio

    isRenamingSong = false
    didExpand = false
    expanded = false
    waveformView: JSX.Element = false
    songTitleEl?: HTMLDivElement

    editor?: InstanceType<typeof Editor.Element>
    editorEl?: HTMLElement
    editorBuffer?: EditorBuffer
    editorVisible = false

    main = EditorBuffer({ id: 'main', kind: 'main', value: demo.main, isDraft: false, isNew: false, isIntent: true })

    playersView: JSX.Element = false
    players: Player[] = []
    player?: Player
    // playerPatterns?: string[]

    sounds: EditorBuffer[] = []
    sound?: EditorBuffer

    patterns: EditorBuffer[] = []
    pattern?: EditorBuffer

    presetsScrollEl?: HTMLDivElement

    pianoView: JSX.Element = false
  },
  function actions({ $, fns, fn }) {
    let presetsSmoothScrollTimeout: any

    return fns(new class actions {
      renameSong = fn(({ songTitleEl }) => () => {
        const p = songTitleEl
        p.contentEditable = 'plaintext-only'
        p.spellcheck = false
        p.onkeydown = e => {
          if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            p.blur()
          }
        }
        p.oninput = () => {
          // prevent editing the text out completely
          // that renders it uneditable
          // the nbsp will be trimmed anyway
          const value = p.textContent
          if (value === '') {
            p.innerHTML = '&nbsp;'
          }
        }

        p.focus()

        $.isRenamingSong = true

        setTimeout(() => {
          p.onblur = () => {
            p.contentEditable = 'false'
            $.project!.$.title = p.textContent = p.textContent!.trim() || 'Untitled'
            $.isRenamingSong = false
            p.onblur = null
          }
        })
      })


      // player

      onPlayerSoundSelect = (_: string, { y }: { y: number }) => {
        const player = $.players[y]

        if ($.editorVisible && $.focused === 'sound' && $.selected.player === y) {
          $.editorVisible = false
        } else {
          $.editorVisible = true
          $.selected = {
            ...$.selected,
            player: y,
            preset: player.$.sound
          }
          $.focused = 'sound'
        }
      }

      onPlayerPatternSelect = (id: string, { x, y }: { x: number, y: number }) => {
        const player = $.players[y]

        if ($.editorVisible && $.focused === 'pattern' && $.selected.player === y && player.$.pattern === x) {
          $.editorVisible = false
        } else {
          $.editorVisible = true

          $.selected = {
            ...$.selected,
            player: y,
            preset: player.$.patterns[player.$.pattern = x]
          }
          $.focused = 'pattern'
        }
      }

      onPlayerPatternPaste = (id: string, { x, y }: { x: number, y: number }) => {
        const selectedPlayer = $.players[$.selected.player]

        const p = selectedPlayer.$.pattern

        if (x !== p || y !== $.selected.player) {
          const targetPlayer = $.players[y]

          const pattern = selectedPlayer.$.patterns[p]

          targetPlayer.$.patterns = replaceAtIndex(
            targetPlayer.$.patterns,
            x,
            pattern
          )

          // trigger render
          $.selected = { ...$.selected }
        }
      }

      onPlayerPatternInsert = (id: string, { x, y }: { x: number, y: number }) => {
        const player = $.players[y]
        const patterns = [...player.$.patterns]
        const pattern = patterns[x]
        patterns.splice(x + 1, 0, pattern)
        player.$.patterns = patterns

        // trigger render
        $.selected = { ...$.selected }
      }

      onPlayerPatternDelete = (id: string, { x, y }: { x: number, y: number }) => {
        const player = $.players[y]
        const patterns = player.$.patterns

        if (patterns.length === 1) return

        patterns.splice(x, 1)

        player.$.pattern = Math.min(player.$.pattern, patterns.length - 1)

        // trigger render
        $.selected = { ...$.selected }
      }

      // presets

      onPresetsRearrange = services.fn(({ library }) => (id: string, { dir, kinds }: { dir: 1 | -1, kinds: 'sounds' | 'patterns' }) => {
        const buffers = $[kinds]

        const index = buffers.findIndex((buffer) => buffer.$.id === id)

        const dest = index + dir
        if (dest >= 0 && dest < buffers.length) {
          const bufs = [...buffers]
          const [buffer] = bufs.splice(index, 1)
          bufs.splice(dest, 0, buffer)
          library.$[kinds] = [...bufs]
        }
      })

      startTemporaryPresetsSmoothScroll = () => {
        const el = cachedRef(`presets-${$.id}`)?.current
        if (el) {
          el.style.scrollBehavior = 'smooth'
          clearTimeout(presetsSmoothScrollTimeout)
          presetsSmoothScrollTimeout = setTimeout(() => {
            el.style.scrollBehavior = 'auto'
          }, 100)
        }
      }

      // buffers

      onBufferSave = (id: string, { kind }: { kind: string }) => {
        if (kind === 'sound') {
          this.onSoundSave(id)
        } else if (kind === 'pattern') {
          this.onPatternSave(id)
        }
        // trigger render
        $.selected = { ...$.selected }
      }

      // sound

      onSoundSelect = (id: string, { noPreview }: { noPreview?: boolean } = {}) => {
        this.startTemporaryPresetsSmoothScroll()
        $.focused = 'sounds'
        $.selected = { ...$.selected, preset: id }

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
        queueMicrotask(() => {
          $.focused = 'sound'
        })
      })

      onSoundSave = (id: string) => {
        get($.sounds, id)!.$.isDraft = false
      }

      onSoundDelete = services.fn(({ library }) => (id: string) => {
        const index = $.players.map((player) => player.$.sound).indexOf(id)
        if (!~index) {
          library.$.sounds = delById($.sounds, id)
        }
      })

      onSoundRearrange = (id: string, { dir }: { dir: 1 | -1 }) => {
        this.onPresetsRearrange(id, { dir, kinds: 'sounds' })
      }

      // pattern

      onPatternSelect = (id: string) => {
        this.startTemporaryPresetsSmoothScroll()
        $.focused = 'patterns'
        $.selected = { ...$.selected, preset: id }
      }

      onPatternUse = fn(({ player }) => (id: string) => {
        player.$.patterns = replaceAtIndex(
          player.$.patterns,
          player.$.pattern,
          id
        )

        this.onPatternSelect(id)

        queueMicrotask(() => {
          $.focused = 'pattern'
        })
      })

      onPatternSave = (id: string) => {
        get($.patterns, id)!.$.isDraft = false
      }

      onPatternDelete = services.fn(({ library }) => (id: string) => {
        const index = $.players.flatMap((player) => player.$.patterns).indexOf(id)
        if (!~index) {
          library.$.patterns = delById($.patterns, id)
        }
      })

      onPatternRearrange = (id: string, { dir }: { dir: 1 | -1 }) => {
        this.onPresetsRearrange(id, { dir, kinds: 'patterns' })
      }


      // editor

      focusEditor = fn(({ editor }) => () => {
        editor.$.editor?.focus()
      })

      getFocus = () => {
        const { focused } = $
        return focused === 'sound' || focused === 'sounds'
          ? 'sound'
          : focused === 'pattern' || focused === 'patterns'
            ? 'pattern'
            : 'main'
      }
    })
  },

  function effects({ $, fx, deps, refs }) {
    fx(({ primary, host }) => {
      host.toggleAttribute('primary', primary)
    })

    fx(({ expanded, host }) => {
      host.toggleAttribute('expanded', expanded)
    })

    fx(({ project, host }) =>
      project.fx(({ isDraft }) => {
        host.toggleAttribute('draft', isDraft)
      })
    )

    fx(({ project }) =>
      project.fx(({ audioPlayer }) =>
        audioPlayer.fx(({ state }) => {
          $.state = state
        })
      )
    )

    fx(({ browsing, players }) => {
      if (browsing && players.length) {
        $.expanded = true

        const sel = new URL(location.href).searchParams.get('sel')
        if (sel) {
          const [player, pattern] = sel.split('.')
          $.selected = { player: +player, preset: '' }
          if (pattern != null) {
            $.focused = 'pattern'
            players[+player].$.pattern = +pattern
            $.selected.preset = players[+player].$.patterns[+pattern]
          } else {
            $.focused = 'sound'
            $.selected.preset = players[+player].$.sound
          }
          $.editorVisible = true
        }
      }
    })

    fx(({ browsing, selected, focused, player, editorVisible }) => {
      if (browsing) {
        services.$.go(
          location.pathname,
          !editorVisible ? {} : {
            sel: [
              selected.player,
              focused === 'pattern' || focused === 'patterns'
                ? player.$.pattern : null
            ].filter((x) => x != null).join('.')
          },
          true
        )
      }
    })

    fx(({ expanded }) => {
      if (expanded) {
        $.didExpand = true
      }
    })

    fx(() =>
      services.fx(({ audio }) => {
        $.audio = audio
      })
    )

    fx(() => services.fx(({ library }) =>
      chain(
        library.fx(({ sounds }) => {
          $.sounds = sounds
        }),
        library.fx(({ patterns }) => {
          $.patterns = patterns
        })
      )
    ))

    fx(() => services.fx(({ loggedIn, username }) =>
      fx(({ project }) =>
        project.fx(({ players: _ }) => {
          if (loggedIn) {
            if (project.$.author === 'guest') {
              project.$.author = username
            }
          }
        })
      )
    ))

    fx(({ audio, primary, project }) => {
      if (primary) {
        return project.fx.raf(({ bpm }) => {
          audio.$.bpm = bpm
        })
      }
    })

    const off = fx(({ project, sounds, patterns, expanded }) => {
      if (sounds.length
        && patterns.length
        && (expanded || !project.$.remoteProject)
      ) {
        off()
        fx(({ project }) => {
          project.$.load()
        })
      }
    })

    fx(({ project }) =>
      chain(
        project.fx(({ players }) => {
          $.players = players
        }),
      )
    )

    fx(({ audio, primary, project }, prev) =>
      project.fx(({ players }) => {
        if (primary) {
          if (players.length) {
            project.$.audio = audio
          }
        } else {
          if (prev.primary && project.$.audioPlayer.$.state !== 'running') {
            project.$.audio = void 0 as any
          }
        }
      })
    )

    fx(() => services.fx(({ previewPlayer }) =>
      fx(({ player, selected, focused }) => {
        if (focused === 'sounds') {
          previewPlayer.$.sound = selected.preset
        } else {
          previewPlayer.$.sound = player.$.sound
        }
      })
    ))

    fx(({ players, selected }) => {
      $.player = players[selected.player]
    })

    fx(() => services.fx(({ previewPlayer }) =>
      fx(({ player }) =>
        player.fx(({ vol }) => {
          previewPlayer.$.vol = vol
        })
      )
    ))

    services.fx(({ skin }) =>
      fx(({ primary, project }) =>
        project.fx(({ id, audioPlayer }) =>
          audioPlayer.fx(({ state, workerBytes, workerFreqs }) => {
            $.waveformView = <Wavetracer
              part="app-scroller"
              key={`scroller-${id}`}
              ref={cachedRef(`scroller-${id}`)}
              id={`scroller-${id}`}
              kind="detailed"
              running={state === 'running'}
              width={400}
              colors={{ bg: skin.colors.bgDarker }}
              workerBytes={workerBytes}
              workerFreqs={workerFreqs}
            />
          })
        )
      )
    )

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

    const SoundPresets = part((update) => {
      fx(({ id, focused: _, selected, sounds }) => {
        const focus = $.getFocus()
        const soundId = selected.preset

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
                focus === 'sound'
                && soundId === s.$.id
              }
              live={soundId === s.$.id}
              services={services}
              sound={s}
              clickMeta={s.$}
              onClick={$.onSoundSelect}
              // onDblClick={$.onSoundSave}
              onCtrlClick={$.onSoundUse}
              onCtrlShiftClick={$.onSoundDelete}
              onRearrange={$.onSoundRearrange}
            />
          )}
        </div>)
      })
    })

    const PatternPresets = part((update) => {
      fx(({ id, focused: _, selected, patterns }) => {
        const focus = $.getFocus()
        const patternId = selected.preset

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
                focus === 'pattern'
                && patternId === p.$.id
              }
              live={patternId === p.$.id}
              pattern={p}
              clickMeta={p.$}
              onClick={$.onPatternSelect}
              // onDblClick={$.onPatternSave}
              onCtrlClick={$.onPatternUse}
              onCtrlShiftClick={$.onPatternDelete}
              onRearrange={$.onPatternRearrange}
            />
          )}
        </div>)
      })
    })

    fx(({ players, sounds, patterns, main }) => {
      let prevPlayer: Player
      let prevSound: string
      let prevPattern: string

      if (players.length) return fx(({ selected, focused: _ }) => {
        const player: Player = players[selected.player]!
        return player.fx(({ sound, pattern, patterns: playerPatterns }) => {
          const focus = $.getFocus()

          if (prevPlayer === player) {
            if (prevSound && prevSound !== sound) {
              selected.preset = sound
              $.selected = { ...selected }
            }
            if (prevPattern && prevPattern !== playerPatterns[pattern]) {
              selected.preset = playerPatterns[pattern]
              $.selected = { ...selected }
            }
          }

          prevPlayer = player
          prevSound = sound
          prevPattern = player.$.patterns[pattern]

          if (focus === 'sound') {
            $.sound = get(sounds, selected.preset)!
            $.pattern ??= get(patterns, playerPatterns[pattern])!
          } else if (focus === 'pattern') {
            $.sound ??= get(sounds, sound)!
            $.pattern = get(patterns, selected.preset)!
          }

          $.editorBuffer = (
            focus === 'sound'
              ? $.sound
              : focus === 'pattern'
                ? $.pattern
                : main)
            || $.editorBuffer!
        })
      })
    })

    const TrackViews = part((update) => {
      fx(({ id, project, focused, selected, player, players, sound, pattern, editorBuffer }) => {
        const focus = $.getFocus()

        const playerSoundId = sound.$.id
        const playerPatternId = pattern.$.id

        const readableOnly =
          (focus === 'sound' && player.$.sound !== playerSoundId)
          || (focus === 'pattern' && player.$.patterns[player.$.pattern] !== playerPatternId)

        update(<div class="wrapper">
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
            player={selected.preset === player.$.sound && player}
            services={services}
            main={false}
            sound={sound}
            pattern={false}
            xPos={0}
            clickMeta={editorBuffer.$}
          />

          <TrackView
            key="trackview-pattern"
            class={classes({
              hidden: focus !== 'pattern'
            })}
            ref={cachedRef(`trackview-${id}-pattern`)}
            style="max-width:100%"
            active={false}
            hoverable={false}
            showNotes={true}
            sliders={false}
            player={selected.preset === player.$.patterns[player.$.pattern] && player}
            services={services}
            main={false}
            sound={false}
            pattern={pattern}
            xPos={player.$.pattern}
            clickMeta={editorBuffer.$}
          />

          <div class="track-toolbar">
            <div class="track-toolbar-controls">
              {readableOnly && <Button small onClick={() => {
                if (focused === 'sounds') {
                  $.onSoundUse(selected.preset)
                } else if (focused === 'patterns') {
                  $.onPatternUse(selected.preset)
                }
              }}>
                <span class="i mdi-light-chevron-up" style="font-size:26px; position: relative; left: 0.75px; top: -2.25px;" />
              </Button>}
            </div>

            <div class="track-toolbar-controls">

              {editorBuffer!.$.isDraft && <Button small onClick={() => {
                $.onBufferSave(editorBuffer!.$.id!, editorBuffer!.$)
              }}>
                <span class="i la-check" style="font-size:17px; position: relative; -webkit-text-stroke: .1px;" />
              </Button>}

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
                      if (selected.player >= players.length) {
                        $.selected = { ...$.selected, player: players.length - 1 }
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
                      $.selected = { ...$.selected, player: index - 1 }
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
                      $.selected = { ...$.selected, player: index + 1 }
                    }
                  }
                }}>
                  <span class="i mdi-light-chevron-down" />
                </Button>
              </div>

              <Button small onClick={() => {
                const focus = $.getFocus()
                services.$.clipboardActive = focus
                services.$.clipboardId = focus === 'sound'
                  ? player.$.sound
                  : player.$.patterns[player.$.pattern]
                services.$.clipboardBuffer = (focus === 'sound'
                  ? player.$.soundBuffer
                  : player.$.patternBuffers?.[player.$.pattern]) || false
              }}>
                <span class="i la-copy" style="font-size: 16px" />
              </Button>

              <Button small onClick={
                focused === 'sound' ? () => {
                  const players = [...project.$.players]
                  const index = players.indexOf(player)
                  players.splice(index + 1, 0, Player({
                    ...player.$.derive(),
                    project
                  }))
                  project.$.players = players
                  $.selected = { ...$.selected, player: index + 1 }
                } : () => {
                  const patterns = [...player.$.patterns]
                  patterns.splice(player.$.pattern + 1, 0, pattern.$.id!)
                  player.$.patterns = patterns
                }}>
                <span class={`i fluent-padding-${focused === 'sound' || focused === 'sounds' ? 'down' : 'right'
                  }-24-regular`} style="font-size:17px; position: relative;" />
              </Button>
            </div>
          </div>
        </div>)
      })
    })

    const EditorView = part((update) => {
      fx(({ id, player, sound, pattern, focused: _f, editorBuffer, expanded: _e }) => {
        const focus = $.getFocus()

        const soundPresets = <SoundPresets />
        const patternPresets = <PatternPresets />

        const playerSoundId = sound.$.id
        const playerPatternId = pattern.$.id

        const readableOnly =
          (focus === 'sound' && player.$.sound !== playerSoundId)
          || (focus === 'pattern' && player.$.patterns[player.$.pattern] !== playerPatternId)

        update(<Spacer
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

          <div ref={cachedRef(`presets-${id}`)} style="height:100%; position:relative; overflow-y: scroll; overscroll-behavior: contain;">
            {soundPresets}
            {patternPresets}
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

        </Spacer>)
      })
    })

    fx(() => services.fx(({ skin }) => {
      $.css = /*css*/`
      ${skin.css}

      & {
        display: block;
        position: relative;
      }

      .waveform {
        position: absolute;
        display: flex;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;

        > .half {
          position: absolute;
          top: calc(50% - 0.5px);
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.2);
          z-index: 2;
        }
      }

      .waveform-over {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
      }

      &([expanded]) {
        .waveform-over {
          ${skin.styles.lowered}
        }
      }

      &(:not([expanded])) {
        .waveform-over {
          background: ${skin.colors.shadeSoft};
          ${skin.styles.raised}
        }
      }

      .project {
        font-family: ${skin.fonts.sans};
        position: relative;
        display: flex;
        flex: 1;
        flex-flow: row wrap;
        padding: 0 15px;
        min-height: 76px;
        align-items: center;
        overflow: hidden;
        background: transparent;
        z-index: 3;

        .song {
          position: relative;
          display: flex;
          flex: 1;
          flex-flow: row wrap;
          align-items: center;
          gap: 15px;
          z-index: 4;

          &-note {
            position: absolute;
            right: 0;
            bottom: 8.85px;
            white-space: nowrap;
            color: ${skin.colors.fgPale};
            text-shadow: 1px 1px ${skin.colors.shadeBlack};
            user-select: none;
            display: inline-flex;
            flex-flow: row wrap;
            gap: 10px;
            cursor: default;
          }

          &-time-ago {
            cursor: pointer;

            &:hover {
              text-decoration: underline;
              text-decoration-thickness: 0.85px;
              text-underline-offset: 2.5px;
            }
          }

          &-more {
            color: ${skin.colors.brightCyan};
            cursor: pointer;

            &:hover {
              text-decoration: underline;
              text-decoration-thickness: 0.85px;
              text-underline-offset: 2.5px;
            }
          }

          .reactions {
            color: ${skin.colors.fg};
            display: flex;
            flex-flow: row nowrap;
            gap: 10px;
            align-self: flex-start;
            position: relative;
            top: 4px;
          }

          &-icon {
            font-size: 32px;
          }
          &-header {
            position: relative;
            /* top: -2px; */
            display: flex;
            align-items: flex-start;
            flex-flow: column wrap;
          }
          &-info {
            display: inline-flex;
            flex-flow: row wrap;
            align-items: center;
            justify-content: center;
            gap: 15px;
          }
          &-title {
            outline: none;
            position: relative;
            font-size: 26px;
            top: -1.5px;
            letter-spacing: 0.2px;
            color: ${skin.colors.fg};
            text-shadow: 2px 2px ${skin.colors.shadeBlack};
            &:focus {
              background: ${skin.colors.shadeSoft};
            }
            a {
              cursor: pointer;
              &:hover {
                text-underline-offset: 4.5px;
                text-decoration: underline;
                text-decoration-thickness: 1.5px;
                text-decoration-color: ${skin.colors.shadeBright};
              }
            }
          }
          &-draft {
            margin-right: 10px;
          }
          &-draft:before {
            content: '*';
            position: absolute;
            font-family: inherit;
            color: inherit;
            font-size: 36px;
            top: -12px;
            right: -18px;
          }
          &-bpm {
            position: absolute;
            right: 0;
            top: 4px;
            pointer-events: none;
            font-size: 14px;
            display: flex;
            flex-flow: row nowrap;
            align-items: baseline;
            gap: 0.35em;
            text-shadow: 1px 1px ${skin.colors.shadeBlack};

            .bpm {
              color: ${skin.colors.fgPale};
              /* top: -0.55px; */
              position: relative;
            }
            .amt {
              color: ${skin.colors.fg};
              font-size: 17px;
            }
          }
          &-author {
            position: relative;
            top: -7px;
            display: inline-flex;
            text-shadow: 1px 1px ${skin.colors.shadeBlack};

            .by,
            .remix-by {
              position: relative;
              white-space: nowrap;
              font-style: italic;
              color: ${skin.colors.fgPale};
            }
            .remove-attribution,
            .original,
            .author {
              font-size: 17.5px;
              color: ${skin.colors.brightCyan};
            }
            .original {
              color: ${skin.colors.brightPurple};
            }
            .remove-attribution {
              font-size: 13px;
              color: ${skin.colors.fgPale};
            }
            .dash {
              pointer-events: none;
              font-size: 10px;
              margin: 0 5px;
              position: relative;
              top: 5px;
              color: ${skin.colors.fgPale};
            }
            a {
              font-size: 13px;
              color: ${skin.colors.fg};
              display: inline-flex;
              flex-flow: row nowrap;
              gap: 0.32rem;
              align-items: center;

              cursor: pointer;
              &:hover {
                .remove-attribution,
                .original,
                .author {
                  text-decoration: underline;
                  text-decoration-thickness: 0.85px;
                  text-underline-offset: 2.5px;
                }
              }
            }
          }
        }
      }

      &(:not([draft])) {
        .song {
          &-header {
            cursor: default;
          }
        }
      }

      [part=app-scroller] {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
      }
      `
    }))

    const Players = part((update) => {
      fx(({ id, players, selected, editorVisible }) => {
        update(
          <PlayersView
            ref={cachedRef(`players-${id}`)}
            players={players}
            focused={$.focused}
            selected={selected}
            editorEl={deps.editorEl}
            EditorView={EditorView}
            editorVisible={editorVisible}
            onPlayerSoundSelect={$.onPlayerSoundSelect}
            onPlayerPatternSelect={$.onPlayerPatternSelect}
          />
        )
      })
    })

    fx(() => services.fx(({ loggedIn, likes }) =>
      fx(({ project }) =>
        project.fx(({ isDraft, isDeleted, title, author, bpm, date, audioPlayer, originalAuthor, originalChecksum, pathname }) =>
          fx(({ state, didExpand, expanded, controlsView, waveformView }) => {
            $.view = <>
              <div class="project" key={project} onpointerdown={(e) => {
                if ($.isRenamingSong) return

                console.log(e.target)

                const clickThroughClasses = [
                  'song',
                  'song-header',
                  'project',
                  'half',
                  'controls',
                  'controls-secondary',
                  'waveform-over',
                  'reactions',
                  'song-note',
                  'song-author'
                ]

                if (
                  clickThroughClasses.some((c) => e.target.classList.contains(c))
                  || (e.target.classList.contains('song-title') && !isDraft)
                ) {
                  $.expanded = !$.expanded
                }
              }}>
                <div class="waveform">
                  {waveformView}
                  <div class="waveform-over" />
                  <div class="half" />
                </div>

                <div class="song">
                  <div class="controls">
                    <Volume target={audioPlayer} />

                    <Button
                      small={false}
                      rounded
                      active={state === 'running'}
                      onClick={project.$.toggle}
                    >
                      <span class={`i la-${state === 'running' ? 'pause' : 'play'}`} />
                    </Button>
                  </div>

                  <div class="song-header">
                    <div class="song-info">
                      {isDraft
                        ? <div
                          key="a"
                          ref={refs.songTitleEl}
                          class="song-title song-draft"
                          onclick={$.renameSong}
                        >
                          {title}
                        </div>
                        : <div
                          key="b"
                          class="song-title"
                        >
                          <a href={pathname} onclick={services.$.linkTo(pathname)}>{title}</a>
                        </div>
                      }

                      <div class="reactions">
                        {!isDraft && <Button rounded small
                          onClick={() => {
                            if (likes.includes(project.$.checksum!)) {
                              services.$.likes = likes.filter((projectId) => projectId !== project.$.checksum!)
                            } else {
                              services.$.likes = [...new Set([
                                project.$.checksum!, ...likes
                              ])]
                            }
                          }}
                        >
                          <span class={`i la-heart${likes.includes(project.$.checksum!) ? '-solid' : ''}`} />
                        </Button>}

                        {isDraft && loggedIn &&
                          <Button rounded small onClick={() => {
                            project.$.title = (($.songTitleEl!.textContent || '').trim() || 'Untitled')
                            project.$.publish()
                          }} title="Publish">
                            <span class={`i ph-upload-simple-duotone`} />
                          </Button>
                        }

                        {isDraft && !isDeleted &&
                          <Button rounded small onClick={() => {
                            project.$.delete()
                          }} title="Delete">
                            <span class={`i clarity-trash-line`} />
                          </Button>
                        }

                        {isDraft && isDeleted &&
                          <Button rounded small onClick={() => {
                            project.$.undelete()
                          }} title="Restore">
                            <span class={`i la-share`} style="transform: scaleX(-1)" />
                          </Button>
                        }

                        {controlsView}

                        {/* <Button rounded small>
                    <span class={`i la-comment-dots`} />
                  </Button> */}
                      </div>

                    </div>
                    {originalChecksum && originalAuthor
                      ? <div class="song-author">

                        <a href={`/${originalAuthor}`} onclick={services.$.linkTo(originalAuthor)}>
                          <span class="by">by</span>
                          <span class="author">{originalAuthor}</span>
                        </a>

                        {originalAuthor !== author && <>
                          <span class="dash">&mdash;</span>

                          <a href={`/${author}`} onclick={services.$.linkTo(author)}>
                            <span class="remix-by">remix by</span>
                            <span class="author">{author}</span>
                          </a>

                          <span class="dash">&mdash;</span>

                          <a href={`/${originalAuthor}/${project.$.originalChecksum}`} onclick={services.$.linkTo(`/${originalAuthor}/${project.$.originalChecksum}`)}>
                            <span class="original">original</span>
                          </a>
                        </>}

                        {project.$.isDraft && <>
                          <span class="dash">&mdash;</span>
                          <a href="javascript:;" onclick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            project.$.originalAuthor
                              = project.$.originalChecksum = false
                          }}><span class="remove-attribution">remove attribution</span></a>
                        </>}
                      </div>
                      : <div class="song-author">
                        <a href={`/${author}`} onclick={services.$.linkTo(`/${author}`)}>
                          <span class="by">by</span>
                          <span class="author">{author}</span>
                        </a>
                      </div>}
                  </div>

                  <div class="song-note">
                    {(relatedProjects.get(project)?.length ?? 0) > 0 &&
                      new URL(services.$.href).searchParams.get('expand') !== 'true'
                      && <a href={pathname + '?expand=true'} class="song-more" onclick={services.$.linkTo((pathname) + '?expand=true')}>+{(relatedProjects.get(project)?.length ?? 0)} more</a>
                    }

                    <a class="song-time-ago" title={new Date(`${date} GMT`).toLocaleString()} href={pathname} onclick={services.$.linkTo(pathname)}>
                      {timeAgo(date, new URL(services.$.href).pathname.split('/').length > 2)}
                    </a>
                  </div>

                  <div class="song-bpm">
                    <span class="amt">{bpm}</span>
                    <span class="bpm">BPM</span>
                  </div>

                </div>
              </div>

              {didExpand ? <div
                class={classes({
                  none: !expanded
                })}
              >
                <Players />
              </div>
                : expanded && <Players />}
            </>
          }))
      )
    )
    )
  }
))
