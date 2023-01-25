/** @jsxImportSource minimal-view */

import { element, view, web } from 'minimal-view'
import { Selected } from './app'
import { Button } from './button'
import { Player } from './player'
import { TrackView, TrackViewHandler } from './track-view'
import { services } from './services'
import { get } from './util/list'
import { Volume } from './volume'
import { Focused } from './project-view'

export type PlayerView = typeof PlayerView.State

export const PlayerView = web(view('player-view',
  class props {
    id!: string
    y!: number
    focused!: Focused
    selected!: Selected
    player!: Player
    active!: boolean

    onSoundSelect!: TrackViewHandler
    onPatternSelect!: TrackViewHandler
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
    // fx(({ player }) => {
    //   player.$.view = $.self
    // })

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


    fx(() => services.fx(({ skin }) => {
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
    }))

    fx.raf(({ host, active }) => {
      host.toggleAttribute('active', active)
    })

    fx(() => services.$.library.fx(({ sounds, patterns }) =>
      fx(({ player, y, active, focused, selected, onSoundSelect, onPatternSelect }) =>
        player.fx(({ state, sound, pattern, patterns: _ }) => {
          $.view = <>
            <div class="controls raised" part="controls">
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
                sound={get(sounds, sound)!}
                clickMeta={{ id: sound, y }}
                onClick={onSoundSelect}
              // onDblClick={app.$.onSoundSave}
              />
            </div>

            <div class="patterns">
              {
                player.$.patterns.map((id, x) => {
                  const p = get(patterns, id)!
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
                    onClick={onPatternSelect}
                  // onDblClick={app.$.onPatternSave}
                  // onAltClick={
                  //   (!active || pattern !== x)
                  //   && app.$.onPlayerPatternPaste}
                  // onCtrlAltClick={app.$.onPlayerPatternInsert}
                  // onCtrlShiftClick={app.$.onPlayerPatternDelete}
                  />
                })
              }
            </div>
          </>
        })
      ))
    )
  }
))
