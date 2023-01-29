/** @jsxImportSource minimal-view */

import { web, view, element, chain } from 'minimal-view'
import { PianoKeys } from 'x-pianokeys'
import { cachedRef, projectsCounts, projectsOlderExpanded, Selected } from './app'
import { Audio } from './audio'
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
    state?: 'idle' | 'running' = 'idle'
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
    editorView: JSX.Element = false

    main = EditorBuffer({ id: 'main', kind: 'main', value: demo.main, isDraft: false, isNew: false, isIntent: true })

    players: Player[] = []
    player?: Player

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
        if ($.editorVisible && $.focused === 'sound' && $.selected.player === y) {
          $.editorVisible = false
        } else {
          $.editorVisible = true
          $.selected = { ...$.selected, player: y }
          $.focused = 'sound'
        }
      }

      onPlayerPatternSelect = (id: string, { x, y }: { x: number, y: number }) => {
        const player = $.players[y]

        if ($.editorVisible && $.focused === 'pattern' && $.selected.player === y && player.$.pattern === x) {
          $.editorVisible = false
        } else {
          $.editorVisible = true
          player.$.pattern = x
          $.selected = { ...$.selected, player: y }
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

    fx(({ browsing }) => {
      if (browsing) {
        $.expanded = true
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
        // project.fx(({ title: _t, bpm: _b }) => {
        //   $.autoSave()
        // }),
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

    // fx(({ id }) => {
    //   if (cachedProjects.has(id)) {
    //     $.project = cachedProjects.get(id)!
    //   } else {
    //     $.project = Project({ id })
    //     cachedProjects.set(id, $.project)
    //   }
    // })

    // fx(({ primary, project }) =>
    //   project.fx(({ audioPlayer }) => {
    //     if (primary) {
    //       return audioPlayer.fx.raf(({ vol }) => {
    //         storage.vol.set(vol)
    //       })
    //     }
    //   })
    // )

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

    fx(({ player, sounds, selected, focused }) => {
      $.sound = focused === 'sounds'
        ? get(sounds, selected.preset)!
        : get(sounds, player.$.sound)!
    })

    fx(({ player, patterns, selected, focused }) => {
      if (focused === 'patterns') {
        $.pattern = get(patterns, selected.preset)!
      } else {
        return player.fx(({ pattern, patternBuffers }) => {
          $.pattern = patternBuffers[pattern]
        })
      }
    })

    // fx(({ primary, project }) => {
    //   if (primary) return project.fx(({ players, audioPlayer }) => {
    //     return chain(
    //       players.map((player) =>
    //         player.fx(({ state }) => {
    //           if (state === 'running') {
    //             if (audioPlayer.$.state !== 'running') {
    //               audioPlayer.$.start()
    //             }
    //           } else {
    //             if (audioPlayer.$.state === 'running' && players.every((player) => player.$.state === 'suspended')) {
    //               audioPlayer.$.stop(false)
    //             }
    //           }
    //         })
    //       )
    //     )
    //   })
    // })

    fx(({ focused, sound, pattern, main }) => {
      $.editorBuffer = (
        (focused === 'pattern' || focused === 'patterns')
          ? pattern
          : (focused === 'sound' || focused === 'sounds')
            ? sound
            : main)
        || $.editorBuffer!
    })

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

            const startHalfOctave = !hasRange ? 8 : Math.round(pattern.$.midiRange![0] / 6)

            $.pianoView =
              <PianoKeys
                ref={cachedRef(`piano-${id}`)}
                halfOctaves={halfOctaves}
                startHalfOctave={startHalfOctave}
                audioContext={audioContext}
                onMidiEvent={services.$.onMidiEvent}
                vertical
              />
          })
        )
      )
    ))

    fx(() => services.fx(({ state }) =>
      fx.task(({ id, project, player, main, sounds, sound, patterns, pattern, focused, selected, expanded: _, editorBuffer, pianoView }) => {
        const soundPresets = <div
          key="sounds"
          ref={cachedRef(`sounds-${id}`)}
          part="app-presets"
          class={classes({
            hidden: focused !== 'sound' && focused !== 'sounds'
          })}
        >
          {sounds.map((s) =>
            <TrackView
              key={s.$.id!}
              ref={cachedRef(`sound-${id}-${s.$.id}`)}
              canFocus
              active={
                (focused === 'sound' || focused === 'sounds')
                && s.$.id === sound.$.id
              }
              live={player.$.sound === s.$.id}
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
        </div>

        const patternPresets = <div
          key="patterns"
          ref={cachedRef(`patterns-${id}`)}
          part="app-presets"
          class={classes({
            hidden: focused !== 'pattern' && focused !== 'patterns'
          })}
        >
          {patterns.map((p) =>
            <TrackView
              key={p.$.id!}
              ref={cachedRef(`pattern-${id}-${p.$.id}`)}
              canFocus
              active={
                (focused === 'pattern' || focused === 'patterns')
                && p.$.id === pattern.$.id
              }
              live={player.$.patterns[player.$.pattern] === p.$.id}
              pattern={p}
              clickMeta={p.$}
              onClick={$.onPatternSelect}
              // onDblClick={$.onPatternSave}
              onCtrlClick={$.onPatternUse}
              onCtrlShiftClick={$.onPatternDelete}
              onRearrange={$.onPatternRearrange}
            />
          )}
        </div>

        const readableOnly = (focused === 'sounds' && editorBuffer.$.id !== player.$.sound)
          || (focused === 'patterns' && player.$.patterns[player.$.pattern] !== editorBuffer.$.id!)

        $.editorView = <Spacer
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
          {pianoView}

          <div ref={cachedRef(`presets-${id}`)} style="height:100%; position:relative; overflow-y: scroll; overscroll-behavior: contain;">
            {soundPresets}
            {patternPresets}
          </div>

          <div class="wrapper">
            <TrackView
              key={focused === 'sound' || focused === 'sounds' ? 'sound' : 'pattern'}
              style="max-width:100%"
              active={false}
              hoverable={false}
              showNotes={true}
              sliders
              player={(focused === 'sound' || focused === 'pattern' || (focused === 'sounds' && selected.preset === player.$.sound)) && player}
              services={services}
              main={focused === 'main' && main}
              sound={(focused === 'sound' || focused === 'sounds') && sound}
              pattern={(focused === 'pattern' || focused === 'patterns') && pattern}
              xPos={focused === 'pattern' || focused === 'patterns' ? player.$.pattern : 0}
              clickMeta={editorBuffer.$}
            // onDblClick={$.onBufferSave}
            />

            <div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content:flex-end; padding: 11px 8px; box-sizing: border-box; gap: 9px">
              {readableOnly && <Button small onClick={() => {
                if (focused === 'sounds') {
                  $.onSoundUse(selected.preset)
                } else if (focused === 'patterns') {
                  $.onPatternUse(selected.preset)
                }
              }}>
                <span class="i mdi-light-chevron-up" style="font-size:32px; position: relative; left: 1px; top: -1px;" />
              </Button>}

              {editorBuffer.$.isDraft && <Button small onClick={() => {
                $.onBufferSave(editorBuffer.$.id!, editorBuffer.$)
              }}>
                <span class="i la-check" style="font-size:17px; position: relative; -webkit-text-stroke: .1px;" />
              </Button>}

              {state === 'idle' && <Button small onClick={
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
              </Button>}

              {state === 'deleting' && <Button small onClick={focused === 'sound' ? () => {
                const players = [...project.$.players]
                const index = players.indexOf(player)
                players.splice(index, 1)
                project.$.players = players
                $.editorVisible = false
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
            </div>
          </div>

          <Editor
            ref={refs.editor}
            part="app-editor"
            name="editor"
            player={player}
            buffer={editorBuffer}
            readableOnly={readableOnly}
          />

        </Spacer>
      })
    ))

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
        /* background: ${skin.colors.shadeBright}; */
        z-index: 1;
      }

      &([expanded]) {
        .waveform-over {
          /* background: ${skin.colors.shadeBright}; */
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
            /* text-underline-offset: 4.5px;
            text-decoration: underline;
            text-decoration-thickness: 1.5px;
            text-decoration-color: ${skin.colors.shadeBright}; */
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
                /* text-decoration-color: ${skin.colors.shadeBright}; */
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

    fx(() => services.fx(({ loggedIn, likes }) =>
      fx(({ project }) =>
        project.fx(({ id, isDraft, isDeleted, title, author, bpm, date, audioPlayer, players, originalAuthor, originalChecksum, remixCount, originalRemixCount }) =>
          audioPlayer.fx(({ state }) =>
            // .raf is needed otherwise waveforms have trouble displaying
            fx.raf(({ didExpand, expanded, focused, selected, editorVisible, controlsView, waveformView, editorView }) => {
              const playersView = <PlayersView
                ref={cachedRef(`players-${id}`)}
                players={players}
                focused={focused}
                selected={selected}
                editorEl={deps.editorEl}
                editorView={editorView}
                editorVisible={editorVisible}
                onPlayerSoundSelect={$.onPlayerSoundSelect}
                onPlayerPatternSelect={$.onPlayerPatternSelect}
              />

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
                            class="song-title song-draft"
                            ref={refs.songTitleEl}
                            onclick={$.renameSong}
                          >
                            {title}
                          </div>
                          : <div class="song-title">
                            <a href={project.$.pathname || '/'} onclick={services.$.linkTo(project.$.pathname || '/')}>{title}</a>
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
                      {originalChecksum && originalAuthor && originalAuthor !== author
                        ? <div class="song-author">
                          <a href={`/${originalAuthor}`} onclick={services.$.linkTo(originalAuthor)}>
                            <span class="by">by</span>
                            <span class="author">{originalAuthor}</span>
                          </a>
                          <span class="dash">&mdash;</span>
                          <a href={`/${author}`} onclick={services.$.linkTo(author)}>
                            <span class="remix-by">remix by</span>
                            <span class="author">{author}</span>
                          </a>
                          <span class="dash">&mdash;</span>
                          <a href={`/${originalAuthor}/${project.$.originalChecksum}`} onclick={services.$.linkTo(`/${originalAuthor}/${project.$.originalChecksum}`)}>
                            <span class="original">original</span>
                          </a>
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
                        && <a href={(project.$.pathname || '/') + '?expand=true'} class="song-more" onclick={services.$.linkTo((project.$.pathname || '/') + '?expand=true')}>+{(relatedProjects.get(project)?.length ?? 0)} more</a>
                      }

                      <a class="song-time-ago" title={new Date(`${date} GMT`).toLocaleString()} href={project.$.pathname || '/'} onclick={services.$.linkTo(project.$.pathname || '/')}>
                        {timeAgo(date, new URL(services.$.href).pathname.split('/').length > 2)}
                      </a>
                    </div>

                    <div class="song-bpm">
                      <span class="amt">{bpm}</span>
                      <span class="bpm">BPM</span>
                    </div>

                  </div>

                  {/* <div class="controls-secondary">
                  </div> */}
                </div>

                {didExpand ? <div
                  class={classes({
                    none: !expanded
                  })}
                >
                  {playersView}
                </div>
                  : expanded && playersView}
              </>
            }))
        )
      ))
    )
  }
))
