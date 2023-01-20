/** @jsxImportSource minimal-view */

import { web, view, element, chain } from 'minimal-view'
import { cachedRef } from './app'
import { Audio } from './audio'
import { Button } from './button'
import { KnobView } from './knob-view'
import { Project } from './project'
import { services } from './services'
import { classes } from './util/classes'
import { storage } from './util/storage'
import { Volume } from './volume'
import { Wavetracer } from './wavetracer'

export const cachedProjects = new Map<string, Project>()

export const ProjectView = web(view('project-view',
  class props {
    id!: string
    project?: Project
    primary!: boolean
    controlsView?: JSX.Element = false
    onSelect?: (project: Project) => void
  },
  class local {
    host = element
    state?: 'idle' | 'running' = 'idle'
    audio?: Audio
    waveformView: JSX.Element = false
    songTitleEl?: HTMLDivElement
  },
  function actions({ $, fns, fn }) {
    return fns(new class actions {
      handleSelect = fn(({ onSelect, project }) => () => {
        onSelect(project)
      })

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

        setTimeout(() => {
          p.onblur = () => {
            p.contentEditable = 'false'
            $.project!.$.title = p.textContent = p.textContent!.trim() || 'Untitled'
            p.onblur = null
          }
        })
      })
    })
  },

  function effects({ $, fx, deps, refs }) {
    fx(({ primary, host }) => {
      host.toggleAttribute('primary', primary)
    })

    fx(() =>
      services.fx(({ audio }) => {
        $.audio = audio
      })
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

    fx(({ id }) => {
      if (cachedProjects.has(id)) {
        $.project = cachedProjects.get(id)!
      } else {
        $.project = Project({ id })
        cachedProjects.set(id, $.project)
      }
      $.project.$.load()
    })

    fx(({ primary, project }) =>
      project.fx(({ audioPlayer }) => {
        if (primary) {
          return audioPlayer.fx.raf(({ vol }) => {
            storage.vol.set(vol)
          })
        }
      })
    )

    fx(({ primary, project }) => {
      if (primary) return project.fx(({ players, audioPlayer }) => {
        return chain(
          players.map((player) =>
            player.fx(({ state }) => {
              if (state === 'running') {
                if (audioPlayer.$.state !== 'running') {
                  audioPlayer.$.start()
                }
              } else {
                if (audioPlayer.$.state === 'running' && players.every((player) => player.$.state === 'suspended')) {
                  audioPlayer.$.stop(false)
                }
              }
            })
          )
        )
      })
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
              colors={{ bg: primary ? skin.colors.bg : skin.colors.bgLight }}
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
        background: ${skin.colors.bgLight};
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
          background: rgba(0,0,0,0.12);
          z-index: 1;
        }
      }

      &([primary]) {
        background: ${skin.colors.bg};

        .project {
          ${skin.styles.lowered}
        }
      }

      &(:not([primary])) {
        .project {
          ${skin.styles.raised}
        }
      }

      .project {
        position: relative;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        min-height: 76px;
        overflow: hidden;
        background: transparent;
        z-index: 2;

        .song {
          position: relative;
          z-index: 2;
          display: flex;
          flex-flow: row wrap;
          align-items: center;
          gap: 15px;

          .reactions {
            color: ${skin.colors.fg};
            display: flex;
            flex-flow: row nowrap;
            gap: 10px;
            align-self: flex-start;
            margin-top: 5.62px;
          }

          &-icon {
            font-size: 32px;
          }
          &-header {
            position: relative;
            top: -2px;
            display: flex;
            flex-flow: column wrap;
          }
          &-title {
            outline: none;
            font-family: Jost;
            position: relative;
            font-size: 26px;
            letter-spacing: 0.2px;
            color: ${skin.colors.fg};
            text-decoration: underline;
            text-underline-offset: 4.5px;
            text-decoration-thickness: 1.5px;
            text-decoration-color: ${skin.colors.shadeBright};
            text-shadow: 2px 2px ${skin.colors.shadeBlack};
            &:focus {
              background: ${skin.colors.shadeSoft};
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
            font-family: Jost;
            font-size: 13px;
            display: flex;
            flex-flow: row nowrap;
            align-items: baseline;
            gap: 0.35em;
            text-shadow: 1px 1px ${skin.colors.shadeBlack};

            .bpm {
              color: ${skin.colors.fgPale};
            }
            .amt {
              color: ${skin.colors.fg};
              font-size: 16px;
            }
          }
          &-author {
            cursor: pointer;
            margin-top: -7.25px;
            font-family: Jost;
            font-size: 13px;
            color: ${skin.colors.fg};
            display: inline-flex;
            width: 0;
            flex-flow: row nowrap;
            gap: 0.32rem;
            align-items: center;
            text-shadow: 1px 1px ${skin.colors.shadeBlack};
            .by {
              position: relative;
              /* top: -0.5px; */
              font-style: italic;
              color: ${skin.colors.fgPale};
            }
            .author {
              font-size: 17.5px;
              color: ${skin.colors.brightCyan};
            }
            &:hover {
              .author {
                text-decoration: underline;
                text-decoration-thickness: 0.85px;
                text-underline-offset: 2.5px;
              }
              /* text-decoration-color: ${skin.colors.shadeBright}; */
            }
          }
        }

        > .controls {
          z-index: 3;
          position: relative;
          display: flex;
          flex-flow: row nowrap;
          gap: 13px;
          align-items: center;
          justify-content: center;

          ${KnobView} {
            position: relative;
            top: 2.1px;
            right: -2px;
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

    fx(({ primary, project, controlsView, waveformView }) =>
      project.fx(({ id, isDraft, title, author, bpm, audioPlayer }) =>
        services.fx(({ loggedIn, likes }) =>
          audioPlayer.fx(({ state }) => {
            $.view = <>
              <div class="waveform">
                {waveformView}
                <div class="half" />
              </div>
              <div class="project" key={project}>
                <div class="song">
                  <div class="song-icon">
                    🔊
                  </div>
                  <div class="song-header">
                    <div
                      class={classes({
                        'song-title': true,
                        'song-draft': isDraft
                      })}
                      ref={refs.songTitleEl}
                      onclick={isDraft && $.renameSong}
                    >
                      {title}
                    </div>
                    <div class="song-author">
                      <span class="by">by</span>
                      <span class="author">{author}</span>
                    </div>
                  </div>

                  {!primary &&
                    <div class="song-bpm">
                      <span class="amt">{bpm}</span>
                      <span class="bpm">BPM</span>
                    </div>
                  }

                  <div class="reactions">
                    <Button rounded small
                      onClick={() => {
                        if (likes.includes(id)) {
                          services.$.likes = likes.filter((projectId) => projectId !== id)
                        } else {
                          services.$.likes = [...new Set([...likes, id])]
                        }
                      }}
                    >
                      <span class={`i la-heart${likes.includes(id) ? '-solid' : ''}`} />
                    </Button>

                    {isDraft && loggedIn &&
                      <Button rounded small>
                        <span class={`i ph-upload-simple-duotone`} />
                      </Button>
                    }

                    {!isDraft && <Button rounded small>
                      <span class={`i la-share`} />
                    </Button>}
                    {/* <Button rounded small>
                    <span class={`i la-comment-dots`} />
                  </Button> */}
                  </div>
                </div>

                <div class="controls">
                  {primary ? controlsView : <>
                    <Button
                      small
                      onClick={$.handleSelect}
                    >
                      <span class={`i clarity-arrow-line`} />
                    </Button>

                    <Volume target={audioPlayer} />

                    <Button
                      small={false}
                      rounded
                      active={state === 'running'}
                      onClick={project.$.toggle}
                    >
                      <span class={`i la-${state === 'running' ? 'pause' : 'play'}`} />
                    </Button>
                  </>}
                </div>
              </div>
            </>
          })
        )
      )
    )
  }
))
