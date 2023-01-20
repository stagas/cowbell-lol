/** @jsxImportSource minimal-view */

import { element, view, web } from 'minimal-view'
import { app } from './app'
import { Button } from './button'
import { KnobView } from './knob-view'
import { Player } from './player'
import { Services } from './services'
import { TrackView } from './track-view'
import { services } from './services'
import { get } from './util/list'
import { Volume } from './volume'

export type PlayerView = typeof PlayerView.State

export const PlayerView = web(view('player-view',
  class props {
    id!: string
    services!: Services
    player!: Player
    active!: boolean
  },

  class local {
    host = element

    // state?: AudioState
    // sound?: EditorBuffer
    // pattern?: EditorBuffer
    // patterns?: EditorBuffer[]

    // soundValue?: string

  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
    })
  },

  function effects({ $, fx }) {
    fx(({ player }) => {
      player.$.view = $.self
    })

    // fx(({ player }) =>
    //   chain(
    //     player.fx(({ state }) => {
    //       $.state = state
    //     }),
    //     player.fx(({ sound }) => {
    //       $.sound = get(app.$.sounds, sound)!
    //     }),
    //     player.fx(({ pattern, patterns }) => {
    //       $.pattern = get(app.$.patterns, patterns[pattern])!
    //     }),
    //   )
    // )


    services.fx(({ skin }) => {
      $.css = /*css*/`
      ${skin.css}

      & {
        position: relative;
        display: flex;
        flex-flow: row nowrap;
        width: 100%;
        height: 69px;
        overflow: hidden;

        box-sizing: border-box;
      }

      img {
        width: 100%;
        height: 100%;
      }

      .controls {
        background: ${skin.colors.bgLight};
        /* min-width: 126px; */
        width: 25%;
        display: flex;
        flex-flow: row nowrap;
        gap: 10.5px;
        align-items: center;
        justify-content: center;

        ${KnobView} {
          position: relative;
          top: 1.05px;
        }
      }

      &([active]) {
        .controls {
          background: ${skin.colors.bgLighter};
        }
      }

      .knobs {
        box-sizing: border-box;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: center;
        padding: 10px;
        width: 50%;
        height: 100%;
      }

      ${Button} {
        margin-left: 2px;
      }

      .sound {
        display: flex;
        width: 25%;
        height: 100%;
      }

      .patterns {
        display: flex;
        width: 100%;
        height: 100%;
      }

      ${TrackView} {
        flex: 1;

        ${skin.styles.raised}

        &[live],
        &[active] {
          ${skin.styles.lowered}
        }
      }
      `
    })

    fx.raf(({ host, active }) => {
      host.toggleAttribute('active', active)
    })

    fx(({ services, player, active }) =>
      player.fx(({ state, sound, pattern, patterns: _ }) =>
        app.fx(({ focused, selected }) => {
          const y = app.$.players.indexOf(player)
          $.view = <>
            <div class="controls raised">
              <Volume target={player} />

              <Button
                rounded
                active={state === 'running'}
                onClick={player.$.toggle}
              >
                <span class={`i la-${state === 'running' ? 'pause' : 'play'}`} />
              </Button>
            </div>

            <div class="sound">
              <TrackView
                // class={classes({ big: active })}
                sliders
                active={active && (
                  focused === 'sound'
                  || (focused === 'sounds' && selected.preset === sound)
                )}
                live={active && focused === 'sounds'}
                services={services}
                didDisplay={true}
                player={player}
                sound={get(app.$.sounds, sound)!}
                clickMeta={{ id: sound, y }}
                onClick={app.$.onPlayerSoundSelect}
                onDblClick={app.$.onSoundSave}
              />
            </div>

            <div class="patterns">
              {
                player.$.patterns.map((id, x) => {
                  const p = get(app.$.patterns, id)!
                  return <TrackView
                    active={active && pattern === x && (
                      (focused === 'pattern')
                      || (focused === 'patterns' && selected.preset === id)
                    )}
                    live={active && focused === 'patterns' && pattern === x}
                    xPos={x}
                    services={services}
                    player={player}
                    pattern={p}
                    didDisplay={true}
                    clickMeta={{ id, x, y }}
                    onClick={app.$.onPlayerPatternSelect}
                    onDblClick={app.$.onPatternSave}
                    onAltClick={
                      (!active || pattern !== x)
                      && app.$.onPlayerPatternPaste}
                    onCtrlAltClick={app.$.onPlayerPatternInsert}
                    onCtrlShiftClick={app.$.onPlayerPatternDelete}
                  />
                })
              }
            </div>
          </>
        })
      )
    )
  }
))
