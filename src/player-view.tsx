/** @jsxImportSource minimal-view */

import { chain, element, view, web } from 'minimal-view'
import { anim } from './anim'
import { Button } from './button'
import { NumberInput } from './number-input'
import { Player } from './player'
import { services } from './services'
import { TrackView, TrackViewHandler } from './track-view'
import { get } from './util/list'
import { observe } from './util/observe'
import { Volume } from './volume'

export type PlayerView = typeof PlayerView.State

export const PlayerView = web(view('player-view',
  class props {
    id!: string
    y!: number
    player!: Player
    active!: boolean
    onSoundSelect!: TrackViewHandler
    onPatternSelect!: TrackViewHandler
  },

  class local {
    host = element
    patternsEl?: HTMLDivElement
    patternsWidth?: number
    rulerEl?: HTMLDivElement
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      resize = fn(({ patternsEl }) => () => {
        $.patternsWidth = patternsEl.getBoundingClientRect().width
      })
    })
  },

  function effects({ $, fx, deps, refs }) {
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
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
      }

      .ruler {
        position: absolute;
        height: 100%;
        width: 1px;
        background: ${skin.colors.brightCyan};
        box-shadow: 0 0 2.8px .1px ${skin.colors.brightCyan};
        z-index: 9;
      }

      ${TrackView} {
        flex: 1;

        ${skin.styles.raised}

        &[live],
        &[active] {
          ${skin.styles.lowered}
        }
      }

      .page-select {
        font-family: ${skin.fonts.slab};
        font-size: 48px;
        letter-spacing: -2.5px;
        background: ${skin.colors.bg};

        ${skin.styles.raised};

        position: relative;
        --padding: 12px;

        &::part(left),
        &::part(right) {
          width: 30px;
          color: ${skin.colors.fgPale};
          font-size: 32px;
          padding-top: 8px;
        }

        &::part(left) {
          padding-right: var(--padding);
        }

        &::part(right) {
          padding-left: var(--padding);
        }

        &::part(value) {
          top: -2px;
          left: -1px;
        }
      }
      `
    }))

    fx.raf(({ host, active }) => {
      host.toggleAttribute('active', active)
    })

    fx(({ patternsEl }) =>
      observe.resize.initial(patternsEl, $.resize)
    )

    let lastAnimTurn: number
    let lastAnim: Animation
    fx(({ player, rulerEl, patternsWidth }) =>
      chain(
        () => {
          lastAnimTurn = -1
        },
        player.fx(({ state, totalBars, currentTime, turn }, prev) => {
          if (currentTime && currentTime < 0) {
            lastAnimTurn = -1
            lastAnim?.cancel()
            anim.schedule(() => {
              rulerEl.style.transform = 'translateX(0)'
            })
          }
          if (state === 'running' && (lastAnimTurn !== turn || (prev.currentTime && Math.abs(currentTime - prev.currentTime) > 100)) && currentTime > 0) {
            lastAnimTurn = turn
            anim.schedule(() => {
              const x = (currentTime * 0.001) / totalBars
              lastAnim?.pause()
              lastAnim = rulerEl.animate([
                { transform: `translateX(${x * patternsWidth}px)` },
                { transform: `translateX(${patternsWidth}px)` }],
                {
                  fill: 'forwards',
                  easing: 'linear',
                  duration: ((totalBars - x * totalBars) / services.$.audio!.$.clock.coeff) * 1000
                }
              )
            })
          } else if (state === 'suspended') {
            lastAnimTurn = -1
            lastAnim?.pause()
          }
        })
      )
    )

    fx(() => services.$.library.fx(({ sounds, patterns }) =>
      fx(({ player, y, active, onSoundSelect, onPatternSelect }) =>
        player.fx(({ project, state, sound, pattern, patterns: _ }) =>
          project.fx(({ selectedPreset }) => {
            const focus = selectedPreset.$.kind
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
                  sliders
                  active={
                    active
                    && focus === 'sound'
                    && selectedPreset.$.id === sound
                  }
                  live={
                    active
                    && focus === 'sound'
                    && selectedPreset.$.id !== sound
                  }
                  didDisplay={true}
                  player={player}
                  sound={get(sounds, sound)!}
                  pattern={false}
                  clickMeta={{ id: sound, y }}
                  onClick={onSoundSelect}
                />
              </div>

              <div class="patterns" ref={refs.patternsEl}>
                <div class="ruler" ref={refs.rulerEl} />
                {
                  player.$.patterns.map((id, x) => {
                    const p = get(patterns, id)!
                    return <TrackView
                      active={
                        active
                        && pattern === x
                        && focus === 'pattern'
                        && selectedPreset.$.id === id
                      }
                      live={
                        active
                        && focus === 'pattern'
                        && pattern === x
                        && selectedPreset.$.id !== id
                      }
                      xPos={x}
                      player={player}
                      sound={false}
                      pattern={p}
                      didDisplay={true}
                      clickMeta={{ id, x, y }}
                      onClick={onPatternSelect}
                    />
                  })
                }
              </div>

              <NumberInput
                class="page-select"
                align="x"
                min={1}
                max={99}
                step={1}
                value={player.deps.page}
              />
            </>
          }))
      ))
    )
  }
))
