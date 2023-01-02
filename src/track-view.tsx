/** @jsxImportSource minimal-view */

import { cheapRandomId, checksum } from 'everyday-utils'
import { Rect } from 'geometrik'
import { web, view, element, event, chain, on, queue } from 'minimal-view'
import { app, focusMap } from './app'
import { Audio } from './audio'
import { EditorBuffer } from './editor-buffer'
import { Midi } from './midi'
import { Player } from './player'
import { Sliders } from './sliders'
import { Spacer } from './spacer'
import { Stretchy } from './stretchy'
import { bgForHue } from './util/bg-for-hue'
import { get } from './util/list'
import { observe } from './util/observe'

export type TrackViewHandler = (id: string, meta: any, byClick?: boolean) => void

export const TrackView = web(view('track-view',
  class props {
    id?: string = cheapRandomId()
    audio?: Audio

    active!: boolean
    live?: boolean
    padded?: boolean = false
    sliders?: boolean = false
    autoscroll?: boolean = false
    showLabel?: boolean = true
    leftAlignLabel?: boolean = false
    canFocus?: boolean = false

    player?: Player | false = false
    sound?: EditorBuffer | false
    pattern?: EditorBuffer | false

    xPos?: number = 0

    getTime?: () => number
    clickMeta?: any
    onClick?: TrackViewHandler
    onRightClick?: TrackViewHandler
    onDblClick?: TrackViewHandler
    onCtrlShiftClick?: TrackViewHandler
    onCtrlClick?: TrackViewHandler
    onAltClick?: TrackViewHandler | false
    onRearrange?: TrackViewHandler
  },

  class local {
    host = element
    rect?: Rect
    isDraft: boolean = false
    canvas?: HTMLCanvasElement
    canvasView: JSX.Element = false
    midiView: JSX.Element = false
    buttonView: JSX.Element = false
    slidersView: JSX.Element = false
    labelView: JSX.Element = false
    soundLabel: JSX.Element = false
    patternLabel: JSX.Element = false
    error: Error | false = false
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      handleClick = fn(({ host, clickMeta, onClick }) => (e: PointerEvent) => {
        e.preventDefault()
        e.stopPropagation()
        let fn: TrackViewHandler | false | void
        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
          fn = $.onCtrlShiftClick
        } else if (e.ctrlKey || e.metaKey) {
          fn = $.onCtrlClick
        } else if (e.altKey) {
          fn = $.onAltClick
        } else if (e.buttons & 2) {
          fn = $.onRightClick
        } else {
          fn = onClick
        }
        if (fn) fn(clickMeta.id, clickMeta, true)
        host.focus()
      })

      handleRearrange = fn(({ clickMeta, onRearrange }) => (e: KeyboardEvent, dir: 1 | -1) => {
        e.preventDefault()
        e.stopPropagation()
        onRearrange(clickMeta.id, { ...clickMeta, dir })
      })

      handleDblClick = fn(({ clickMeta, onDblClick }) => (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onDblClick(clickMeta.id, clickMeta, true)
      })

      resize = fn(({ host }) => queue.raf(() => {
        $.rect = new Rect(host.getBoundingClientRect())
      }))
    })
  },

  function effects({ $, fx, refs }) {
    fx(({ leftAlignLabel }) => {
      const alignLabel = leftAlignLabel ? 'flex-start' : 'center'
      $.css = /*css*/`
      & {
        box-sizing: border-box;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #333;
        outline: none;
        outline-offset: -8px;
      }

      &(:focus),
      &(:hover) {
        outline: 8px solid #fff2;
      }

      &([active]) {
        outline: 8px solid #34f;
      }

      &([live]) {
        background: #bcf3;
      }

      &([active][error]) {
        outline: 8px solid #f21;
      }

      &([active]:focus) {
        outline-color: #67f;
      }

      [part=button] {
        all: unset;
      }

      > [part] {
        box-sizing: border-box;
        position: absolute;
        display: flex;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }

      ${Midi} {
        pointer-events: none;
      }

      [part=sliders] {
        pointer-events: none;
        flex-flow: row nowrap;
      }

      [part=canvas] {
        image-rendering: pixelated;
        pointer-events: none;
        box-sizing: border-box;
      }

      &([padded]) {
        [part=canvas] {
          padding: 0 8px;
        }
      }

      [part=button] {
        cursor: pointer;
      }

      [part=label] {
        pointer-events: none;
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        /* justify-content: center; */
        /* flex-flow: column nowrap; */
        font-family: Mono;
        font-size: 20px;
        color: #fff;

        line-height: 40px;
        text-align: center;

        --outline-color: #000;
        --outline-width: 8px;

        svg {
          position: relative;
          z-index: 1;
          display: flex;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
        }

        [part=outline] {
          position: absolute;
          z-index: -1;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          color: var(--outline-color);
          -webkit-text-stroke: var(--outline-width) var(--outline-color);
        }
      }
      `
    })

    fx(({ host, canFocus, clickMeta }) => {
      if (canFocus) {
        host.tabIndex = 0

        const focusLabel = `${clickMeta.kind}${clickMeta.id}`
        focusMap.set(focusLabel, host)

        return chain(
          on(host, 'keydown')((e) => {
            console.log(e.key)
            if (e.key === 'Enter') {
              $.handleClick(e as any)
            }
            else if (e.altKey && e.key.startsWith('Arrow')) {
              const dir = e.key.endsWith('Up') ? -1 : +1

              $.handleRearrange(e, dir)

              setTimeout(() => {
                focusMap.get(focusLabel)?.focus()
              }, 100)
            }
          }),
          () => {
            focusMap.delete(focusLabel)
          }
        )
      }
    })

    fx.raf(({ host, active }) => {
      host.toggleAttribute('active', active)
      if (active) {
        try {
          // @ts-ignore
          host.scrollIntoViewIfNeeded()
        } catch {
          host.scrollIntoView()
        }
      }
    })

    fx.raf(({ host, live }) => {
      host.toggleAttribute('live', live)
    })

    fx.raf(({ host, error }) => {
      host.toggleAttribute('error', Boolean(error))
    })

    fx.raf(({ host, padded }) => {
      host.toggleAttribute('padded', padded)
    })

    fx(function listenHostResize({ host }) {
      return observe.resize.initial(host, $.resize)
    })

    fx(({ host, isDraft, error }) => {
      host.style.cssText = /*css*/`
        background-image: ${isDraft ? bgForHue(error ? 0 :
        checksum(
          ($.sound && $.sound?.$.id)
          || ($.pattern && $.pattern?.$.id)
          || $.id!
        )
      ) : 'transparent'};
        background-size: 90px 90px;
        background-repeat: no-repeat;
        background-position: top right;
      `
    })

    const maybeDraft = ({ isDraft }: any) => {
      $.isDraft =
        ($.pattern && $.pattern?.$.isDraft)
        || ($.sound && $.sound?.$.isDraft)
        || false
    }
    fx(({ pattern }) => pattern && pattern.fx(maybeDraft) || void 0)
    fx(({ sound }) => sound && sound.fx(maybeDraft) || void 0)

    const maybeError = ({ error }: any) => {
      $.error =
        ($.pattern && $.pattern?.$.error)
        || ($.sound && $.sound?.$.error)
        || false
    }
    fx(({ pattern }) => pattern && pattern.fx(maybeError) || void 0)
    fx(({ sound }) => sound && sound.fx(maybeError) || void 0)

    fx(({ getTime, pattern, xPos }) => {
      if (pattern) {
        return fx(({ player }) => {
          if (player) {
            return player.fx(({ patterns }) => {
              const pats = patterns.map((patternId) =>
                get(app.patterns, patternId)!
              ).filter(Boolean)
              return chain(
                pats.map((p) =>
                  p.fx(({ midiEvents: _, numberOfBars: __ }) => {
                    let offset = 0
                    let i = 0
                    for (const pat of pats) {
                      if (i++ === xPos) break
                      offset += pat.$.numberOfBars!
                    }
                    let bars = 0
                    for (const pat of pats) {
                      bars += pat.$.numberOfBars!
                    }
                    return player.fx(({ state }) => {
                      $.midiView = <Midi
                        part="midi"
                        state={state}
                        offset={offset}
                        getTime={getTime}
                        timeBars={bars}
                        midiEvents={pattern.$.midiEvents!}
                        numberOfBars={pattern.$.numberOfBars!}
                      />
                    })
                  })
                )
              )
            })
          } else {
            return pattern.fx(({ midiEvents, numberOfBars }) => {
              $.midiView = <Midi
                part="midi"
                state="init"
                getTime={getTime}
                midiEvents={midiEvents!}
                numberOfBars={numberOfBars!}
              />
            })
          }
        })
      }

      $.midiView = false
    })

    fx(({ audio }) =>
      audio.fx(({ waveplot }) =>
        fx(async ({ id, sound }, prev) => {

          if (prev.sound && (!sound || prev.sound.$.id !== sound.$.id)) {
            prev.sound.$.canvases.delete(id)
          }

          if (!sound) {
            $.canvasView = false
            return
          }

          if (!$.canvas) {
            if (id === sound.$.id) {
              return sound.fx.once(({ canvas }) => {
                $.canvas = canvas
                $.canvasView = <canvas part="canvas" ref={refs.canvas} />
              })
            } else {
              const { canvas } = await waveplot.create(id)
              $.canvas = canvas
            }
          }

          $.canvasView = <canvas part="canvas" ref={refs.canvas} />
          sound.$.canvases.add(id)
          sound.$.copyCanvases()
          sound.$.draw()
        })
      )
    )

    fx(({ sound }) => {
      if (sound) {
        return sound.fx(({ title }) => {
          $.soundLabel = <span>{title}</span>
        })
      }
      $.soundLabel = false
    })

    fx(({ pattern }) => {
      if (pattern) {
        return pattern.fx(({ title }) => {
          $.patternLabel = <span>{title}</span>
        })
      }
      $.patternLabel = false
    })

    fx(({ soundLabel, patternLabel, showLabel }) => {
      const name = [soundLabel, patternLabel]
      // $.labelView = showLabel &&
      //   <div part="label">
      //     <Stretchy width={70} height={40} padding={30}>
      //       {[...name]}
      //       <div part="outline">
      //         {[...name]}
      //       </div>
      //     </Stretchy>
      //   </div>
    })

    fx(({ host, isDraft, active }) => {
      $.buttonView = ($.onClick || $.onDblClick) &&
        <button
          part="button"
          // @ts-ignore
          tabIndex={-1}
          onfocus={() => {
            host.focus()
          }}
          title={isDraft ? [
            $.onDblClick && 'Double click to Save.',
            $.onCtrlShiftClick && (
              'Ctrl+Shift+Click to Delete.' +
              (active ? '\n  (cannot delete the active one,\n  you need to select another first).'
                : '')
            )
          ].filter(Boolean).join('\n') : [
            $.onAltClick && 'Alt+Click to Paste current pattern.',
          ].filter(Boolean).join('\n')}
          onpointerdown={$.handleClick}
          oncontextmenu={prevent}
          ondblclick={$.handleDblClick}
          onpointerenter={() => {
            app.hint = ($.error ? $.error.message : '') || ''
          }} onpointerleave={() => {
            app.hint = ''
          }}
        /> || false
    })

    fx(({ sound, sliders, rect, player }) => {
      if (!player) return

      if (sound && sliders && rect.height > 120) {
        $.slidersView = <Spacer
          key={sound.$.id!}
          id={sound.$.id!}
          part="sliders"
          align="x"
          initial={[0, 0.35]}
        >
          <div></div>
          <Sliders player={player} sound={sound} />
        </Spacer>
      } else {
        $.slidersView = false
      }
    })

    const prevent = event.prevent.stop()

    fx(function drawTrackButton({
      canvasView,
      midiView,
      buttonView,
      slidersView,
      labelView,
    }) {
      $.view = [
        midiView,
        canvasView,
        buttonView,
        slidersView,
        labelView,
      ]
    })
  }
))
