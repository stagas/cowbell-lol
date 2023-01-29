/** @jsxImportSource minimal-view */

import { cheapRandomId } from 'everyday-utils'
import { Rect } from 'geometrik'
import { chain, element, event, on, queue, view, web } from 'minimal-view'
import { app, cachedRef, focusMap } from './app'
import { EditorBuffer } from './editor-buffer'
import { Midi } from './midi'
import { Player } from './player'
import { Services } from './services'
import { Sliders } from './sliders'
import { Spacer } from './spacer'
import { services } from './services'
import { observe } from './util/observe'

export type TrackViewHandler = (id: string, meta: any, byClick?: boolean) => void

export const TrackView = web(view('track-view',
  class props {
    id?: string = cheapRandomId()

    services?: Services

    active!: boolean
    hoverable?: boolean = true
    live?: boolean
    padded?: boolean = false
    sliders?: boolean = false
    autoscroll?: boolean = false
    showLabel?: boolean = true
    showNotes?: boolean = false
    canFocus?: boolean = false

    player?: Player | false = false
    sound?: EditorBuffer | false
    pattern?: EditorBuffer | false
    main?: EditorBuffer | false

    xPos?: number = 0

    clickMeta?: any
    onClick?: TrackViewHandler
    onRightClick?: TrackViewHandler
    onDblClick?: TrackViewHandler
    onCtrlShiftClick?: TrackViewHandler
    onCtrlClick?: TrackViewHandler
    onCtrlAltClick?: TrackViewHandler
    onAltClick?: TrackViewHandler | false
    onRearrange?: TrackViewHandler

    didDisplay?= false
  },

  class local {
    host = element
    rect: Rect = new Rect()

    isDraft = false

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
      handleClick = fn(({ host, clickMeta }) => (e: PointerEvent) => {
        e.preventDefault()
        e.stopPropagation()
        let fn: TrackViewHandler | false | void
        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
          fn = $.onCtrlShiftClick
        } else if ((e.ctrlKey || e.metaKey) && e.altKey) {
          fn = $.onCtrlAltClick
        } else if (e.ctrlKey || e.metaKey || (!e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey && (e.buttons & 4))) {
          fn = $.onCtrlClick
        } else if (e.altKey) {
          fn = $.onAltClick
        } else if (e.buttons & 2) {
          fn = $.onRightClick
        } else {
          fn = $.onClick
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

      center = fn(({ host }) => () => {
        if ($.active && host.offsetParent) {
          const diff = (host.offsetParent.clientHeight - host.offsetHeight)
          host.offsetParent.scrollTop = host.offsetTop - diff / 2
        }
      })

      intersects = ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          $.didDisplay = true
        }
      }

      resize = fn(({ host }) => queue.raf(() => {
        $.rect = new Rect(host.getBoundingClientRect())
        this.center()
      }))
    })
  },

  function effects({ $, fx, refs }) {
    fx(({ host, canFocus, clickMeta }) => {
      if (canFocus) {
        host.tabIndex = 0

        const focusLabel = `${clickMeta.kind}${clickMeta.id}`
        focusMap.set(focusLabel, host)

        return chain(
          on(host, 'keydown')((e) => {
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

    fx(({ host, active }) => {
      host.toggleAttribute('active', active)


      if (active) {
        // try {
        //   // @ts-ignore
        //   host.scrollIntoViewIfNeeded(true)
        // } catch {
        $.center()
        requestAnimationFrame(() => {
          $.center()
          requestAnimationFrame($.center)
        })
        // host.scrollIntoView({ block: 'center', behavior: 'smooth' })
        // }
      }
    })

    fx.raf(({ host, hoverable }) => {
      host.toggleAttribute('hoverable', hoverable)
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

    fx.raf(({ host, isDraft }) => {
      host.toggleAttribute('draft', isDraft)
    })

    fx(({ host }) =>
      observe.intersection.root(host.offsetParent)(host, $.intersects)
    )

    fx(({ host }) =>
      observe.resize.initial(host, $.resize)
    )

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

    fx(({ didDisplay, pattern }) => {
      if (didDisplay && pattern) {
        pattern.$.didDisplay = true
      }
    })

    fx(({ didDisplay, sound }) => {
      if (didDisplay && sound) {
        sound.$.didDisplay = true
      }
    })

    fx(({ didDisplay, pattern, xPos, showNotes }) => {
      if (!didDisplay) {
        if (pattern) {
          $.midiView = <Midi
            part="midi"
            pattern={pattern}
            showNotes={showNotes}
          />
        }
        return
      }

      if (pattern) {
        return fx(({ player }) => {
          if (player) {
            $.midiView = <Midi
              part="midi"
              player={player}
              pattern={pattern}
              xPos={xPos}
              showNotes={showNotes}
            />
          } else {
            $.midiView = <Midi
              part="midi"
              pattern={pattern}
              xPos={xPos}
              showNotes={showNotes}
            />
          }
        })
      }

      $.midiView = false
    })

    fx(({ services, didDisplay }) =>
      !didDisplay ? void 0 : services.fx(({ waveplot }) =>
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

    // fx(({ soundLabel, patternLabel, showLabel }) => {
    //   const name = [soundLabel, patternLabel]
    //   // $.labelView = showLabel &&
    //   //   <div part="label">
    //   //     <Stretchy width={70} height={40} padding={30}>
    //   //       {[...name]}
    //   //       <div part="outline">
    //   //         {[...name]}
    //   //       </div>
    //   //     </Stretchy>
    //   //   </div>
    // })

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
            $.onCtrlAltClick && 'Ctrl+Alt+Click to Dupe Right.',
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
            app.$.hint = ($.error ? $.error.message : '') || ''
          }} onpointerleave={() => {
            app.$.hint = ''
          }}
        /> || false
    })

    fx(({ sound, sliders, rect, player }) => {
      if (player && sound && sliders && rect.height > 150 && rect.width > 220) {
        $.slidersView =
          <Spacer
            key={player.$.id!}
            ref={cachedRef(`sliders-outer-${player.$.id}`)}
            id={sound.$.id + 'outer'}
            class="sliders-outer"
            align="y"
            initial={[0, 0.5]}
          >
            <div />
            <Spacer
              ref={cachedRef(`sliders-${player.$.id}`)}
              id={sound.$.id!}
              class="sliders"
              align="x"
              initial={[0, 0.45]}
            >
              <div />
              <Sliders player={player} sound={sound} />
            </Spacer>
          </Spacer>
      } else {
        $.slidersView = false
      }
    })

    const prevent = event.prevent.stop()
    services.fx(({ skin }) => {
      $.css = /*css*/`
      & {
        box-sizing: border-box;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        /* border-bottom: 1px solid #333; */
        outline: none;
        /* outline-offset: -8px; */
      }

      &([hoverable]:focus),
      &([hoverable]:hover) {
        /* outline: 8px solid #fff2; */
        background: ${skin.colors.bgLight};
      }

      &([live]) {
        background: ${skin.colors.bgLight} !important;
        /* background: #bcf3; */
      }

      &([live][hoverable]:focus),
      &([live][hoverable]:hover) {
        /* outline: 8px solid #fff2; */
        background: ${skin.colors.bgLighter} !important;
      }

      &([active]) {
        background: ${skin.colors.bgLighter} !important;
        /* outline: 8px solid #34f; */
      }

      &([error]):before,
      &([draft]):before {
        content: ' ';
        position: absolute;
        right: 5px;
        top: 5px;
        width: 10px;
        height: 10px;
        background: ${skin.colors.brightYellow} !important;
        border-radius: 100%;
        z-index: 9999;
        pointer-events: none;
      }
      &([error]):before {
        background: ${skin.colors.brightRed} !important;
      }

      &([active]:focus) {
        /* outline-color: #67f; */
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
      `
    })

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
