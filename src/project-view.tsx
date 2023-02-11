/** @jsxImportSource minimal-view */

import { chain, element, part, view, web } from 'minimal-view'
import { Audio, AudioState } from './audio'
import { Button } from './button'
import { EditorBuffer } from './editor-buffer'
import { Player } from './player'
import { PlayersView } from './players-view'
import { Project, relatedProjects } from './project'
import { Route } from './route'
import { services } from './services'
import { cachedRef } from './util/cached-ref'
import { classes } from './util/classes'
import { timeAgo, toDate } from './util/time-ago'
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
    host = element
    state?: AudioState = 'init'
    audio?: Audio

    isRenamingSong = false
    didExpand = false
    expanded = false
    waveformView: JSX.Element = false
    songTitleEl?: HTMLDivElement

    players: Player[] = []
    player?: Player

    sounds: EditorBuffer[] = []
    patterns: EditorBuffer[] = []
  },
  function actions({ $, fns, fn }) {
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

      onProjectExpand = (e: PointerEvent & { target: Element }) => {
        if ($.isRenamingSong) return

        // TODO: left here for development to catch target classes that
        // didn't work and add them to the list below.
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
          || (e.target.classList.contains('song-title') && !$.project.$.isDraft)
        ) {
          $.expanded = !$.expanded
        }
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

    fx(({ project, players }) =>
      project.fx(({ selectedPlayer }) => {
        $.player = players[selectedPlayer]
      })
    )

    fx(({ browsing, project }) => {
      if (browsing) {
        const sel = new URL(location.href).searchParams.get('sel')
        if (sel) {
          project.$.editorVisible = true
        }
      }
    })

    fx(({ browsing, project }) => {
      if (browsing) {
        $.expanded = true

        return project.fx(({ players }) => {
          if (players.length) {
            const sel = new URL(location.href).searchParams.get('sel')
            if (sel) {
              const [player, pattern] = sel.split('.')
              project.$.selectedPlayer = +player
              if (pattern != null) {
                players[+player].$.pattern = +pattern
                project.$.selectedPreset = players[+player].$.patternBuffers![+pattern]
              } else {
                project.$.selectedPreset = players[+player].$.soundBuffer!
              }
              project.$.editorVisible = true
            }
          }
        })
      }
    })

    fx(({ browsing, project }) => {
      if (browsing) {
        return project.fx(({ players, selectedPlayer, selectedPreset, editorVisible }) => {
          if (!players.length) return

          services.$.go(
            location.pathname,
            !editorVisible ? {} : {
              sel: [
                selectedPlayer,
                selectedPreset.$.kind === 'pattern'
                  ? players[selectedPlayer].$.pattern
                  : null
              ].filter((x) => x != null).join('.')
            },
            true
          )
        })
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

    fx(() => services.fx(({ previewPlayer, previewAudioPlayer }) =>
      fx(({ player, project }) =>
        player.fx(({ routes, sound }) =>
          project.fx(({ selectedPreset }) => {
            // route the preview player with the same routes as the
            // current player.

            previewPlayer.$.audioPlayer = player.$.audioPlayer?.$.audio
              ? player.$.audioPlayer
              : previewAudioPlayer
            previewPlayer.$.routes?.forEach((route) => {
              route.dispose()
            })

            // but only if the player has audio loaded
            if (player.$.audioPlayer?.$.audio) {
              previewPlayer.$.routes = new Map([...routes].map(([id, route]) => [id, Route({
                ...route.$.toJSON(),
                sourcePlayer: previewPlayer
              })]))
            } else {
              // otherwise use default routes directly to audio dest out
              const paramId = `${previewPlayer.$.id}::dest`

              previewPlayer.$.routes = new Map([
                [paramId, Route({
                  sourcePlayer: previewPlayer,
                  targetPlayer: previewPlayer,
                  targetId: 'dest',
                  amount: 1,
                })]
              ])
            }

            if (selectedPreset.$.kind === 'sound') {
              previewPlayer.$.sound = selectedPreset.$.id!
            } else {
              previewPlayer.$.sound = sound
            }
          })
        )
      )
    ))

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
      fx(({ id, project }) => {
        update(
          <PlayersView
            ref={cachedRef(`players-${id}`)}
            project={project}
            onPlayerSoundSelect={project.$.onPlayerSoundSelect}
            onPlayerPatternSelect={project.$.onPlayerPatternSelect}
          />
        )
      })
    })

    const SongView = part((update) => {
      fx(({ project }) => services.fx(({ loggedIn, likes }) => project.fx(({ isDraft, isDeleted, title, author, bpm, date, audioPlayer, originalAuthor, originalChecksum, pathname }) => fx(({ state, controlsView }) => {
        update(
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
                  </>}

                  {project.$.isDraft && <>
                    <span class="dash">&mdash;</span>

                    <a href={`/${originalAuthor}/${project.$.originalChecksum}`} onclick={services.$.linkTo(`/${originalAuthor}/${project.$.originalChecksum}`)}>
                      <span class="original">original</span>
                    </a>

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

              <a class="song-time-ago" title={toDate(date).toLocaleString()} href={pathname} onclick={services.$.linkTo(pathname)}>
                {timeAgo(date, new URL(services.$.href).pathname.split('/').length > 2)}
              </a>
            </div>

            <div class="song-bpm">
              <span class="amt">{bpm}</span>
              <span class="bpm">BPM</span>
            </div>

          </div>
        )
      })))
      )
    })

    fx(({ project, expanded, waveformView }) => {
      $.view = <>
        <div class="project" key={project} onpointerdown={$.onProjectExpand}>
          <div class="waveform">
            {waveformView}
            <div class="waveform-over" />
            <div class="half" />
          </div>

          <SongView />
        </div>

        {$.didExpand
          ? <div class={classes({ none: !expanded })}>
            <Players />
          </div>
          : expanded && <div>
            <Players />
          </div>}
      </>
    })
  }
))
