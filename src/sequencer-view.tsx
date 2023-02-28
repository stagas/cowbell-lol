/** @jsxImportSource minimal-view */

import { Scalar, Point, Rect } from 'geometrik'
import { web, view, on, element, part, chain, event, queue } from 'minimal-view'
import { anim } from './anim'
import { app } from './app'
import { Audio } from './audio'
import { EditorBuffer } from './editor-buffer'
import { Midi } from './midi'
import { NumberInput } from './number-input'
import { Player, PlayerPage } from './player'
import { Project } from './project'
import { getLanesMinTimeStart, SeqEvent, SeqLane, Sequencer } from './sequencer'
import { services } from './services'
import { TrackView } from './track-view'
import { allWidth } from './util/all-width'
import { countBars, countTurnBars } from './util/count-bars'
import { get, getMany } from './util/list'
import { nearestPowerOfTwo } from './util/nearest-power-of-two'
import { observe } from './util/observe'

const { clamp } = Scalar

const toBeats = (bars: number) => {
  return `${1 + Math.floor(bars / 4)}`
}

const toBarBeats = (bars: number) => {
  return `${1 + Math.floor(bars / 4)}.${1 + Math.floor(bars % 4)}`
}

export const SeqEventView = web(view('seq-event-view',
  class props {
    event!: SeqEvent
    time!: number
    zoom!: number
    lane!: SeqLane
    rect!: Rect
    handleDown!: (e: PointerEvent) => void
    handleOffset!: (e: PointerEvent, event: SeqEvent) => void
    handleResize!: (e: PointerEvent, event: SeqEvent) => void
  },
  class local {
    player?: Player
    sounds?: EditorBuffer[]
    patterns?: EditorBuffer[]

    oneWidth?: number
    rectWidth?: number
    duration?: number
    timeOffset?: number
    left?: number
    width?: number
    soundBuffer?: EditorBuffer
    patternBuffers?: EditorBuffer[]
    displayTurns?: EditorBuffer[][]
    playerPage?: PlayerPage
    pageTotalBars?: number

    renderUpdate = 0
  },
  function actions({ $, fns, fn }) {
    return fns(new class actions {

    })
  },
  function effects({ $, fx, deps, refs }) {
    fx(({ lane }) => {
      $.player = lane.$.player
    })

    fx(() => services.fx(({ library }) => library.fx(({ sounds, patterns }) => {
      if (sounds.length && patterns.length) {
        $.sounds = sounds
        $.patterns = patterns
      }
    })))

    fx(({ time }) => {
      $.oneWidth = 100 / time
    })

    fx(({ rect }) => {
      $.rectWidth = rect.width
    })

    fx(({ time, event }) =>
      event.fx(({ timeStart, timeOffset, duration }) => {
        $.duration = duration
        $.timeOffset = timeOffset
        $.left = (timeStart / time) * 100
        $.width = ($.duration / time) * 100
      })
    )

    fx(({ player, event }) =>
      player.fx(({ pages }) =>
        event.fx(({ page }) => {
          if (!pages.length) return
          $.playerPage = pages[Math.min(pages.length, page) - 1]
        })
      )
    )

    fx(({ playerPage, sounds, patterns }) => {
      $.soundBuffer = get(sounds, playerPage.sound)!
      $.patternBuffers = getMany(patterns, playerPage.patterns)!
    })

    fx(({ patternBuffers }) =>
      chain(
        patternBuffers.map((p) =>
          p.fx(({ numberOfBars: _n, value: _v }) => {
            $.renderUpdate++
          })
        )
      )
    )

    fx(({ patternBuffers, duration, timeOffset, renderUpdate: _ }) => {
      $.pageTotalBars = countBars(patternBuffers)
      if (!$.pageTotalBars) return

      const displayTurns: EditorBuffer[][] = []

      if (timeOffset < 0 && timeOffset % $.pageTotalBars !== 0) {
        displayTurns.push(patternBuffers)
      }

      while (countTurnBars(displayTurns) < Math.ceil(duration + $.pageTotalBars)) {
        displayTurns.push(patternBuffers)
      }

      $.displayTurns = displayTurns
    })

    const Inner = part((update) => {
      fx(({ player, event: seqEvent, rectWidth, oneWidth, timeOffset, soundBuffer, displayTurns, pageTotalBars, zoom }) => {
        update(
          <>
            <div
              class="event-inner"
              style={allWidth(`${rectWidth}px`)}
            >
              <TrackView
                style={`position: absolute; width: ${10 / zoom}%;`}
                active={false}
                live={false}
                didDisplay={true}
                showIndicator={false}
                player={player}
                sound={soundBuffer}
                pattern={false}
                clickMeta={soundBuffer.$}
              />
              <div
                class="patterns"
                style={`
                  left: ${-(
                    rectWidth * (oneWidth / 100)
                    * (
                      (timeOffset % pageTotalBars) +
                      (timeOffset < 0 && timeOffset % pageTotalBars !== 0
                        ? pageTotalBars
                        : 0
                      )
                    )
                  )}px;
                  ${allWidth(`${rectWidth}px`)}
                `}
              >
                {displayTurns.flatMap((patterns, turn) => {
                  turn += timeOffset > 0
                    ? Math.floor(timeOffset / pageTotalBars)
                    : 0
                  return patterns.map((patternBuffer, index) => {
                    return <Midi
                      key={`${patternBuffer.$.id}-${index}-${turn}`}
                      part="midi"
                      style={allWidth(`${oneWidth * patternBuffer.$.numberOfBars!}%`)}
                      pattern={patternBuffer}
                      turn={turn}
                      showNotes={false}
                      showVels={false}
                    />
                  })
                })}
              </div>
            </div>
            <div class="handle-offset"
              onpointerdown={(e) => {
                if (e.buttons & 2) {
                  $.handleDown(e)
                } else {
                  $.handleOffset(e, seqEvent)
                }
              }}
              oncontextmenu={event.prevent.stop()}
            />
            <div class="handle-resize"
              onpointerdown={(e) => {
                if (e.buttons & 2) {
                  $.handleDown(e)
                } else {
                  $.handleResize(e, seqEvent)
                }
              }}
              oncontextmenu={event.prevent.stop()}
            />
          </>
        )
      })
    })

    fx(({ left, width }) => {
      $.view = <div
        class="event"
        style={`left: ${left}%; width: ${width}%;`}
      >
        <Inner />
      </div>
    })
  }
))

export type SeqLaneView = typeof SeqLaneView.State

export const SeqLaneView = web(view('seq-lane-view',
  class props {
    y!: number
    lane!: SeqLane
    time!: number
    zoom!: number
    sequencerView!: SequencerView
    onEventUpdate!: () => void
  },

  class local {
    host = element
    rect?: Rect

    player?: Player

    pointerPos?: Point
    pointerTime = 0

    hoveringLane: boolean = false

    lastEvent?: SeqEvent | null
    drawingStart: number | null = null
    resizingEvent?: SeqEvent | null
    resizeKind: 'offset' | 'length' = 'length'
    movingEvent?: SeqEvent | null
    movingOffset = 0
    isDeleting = false
  },

  function actions({ $, fns, fn }) {
    // let mouseRounding: 'round' | 'floor' = 'round'

    return fns(new class actions {
      handleOffset = (e: PointerEvent, event: SeqEvent) => {
        $.sequencerView.$.pointerRounding = 'round'
        $.resizingEvent = event
        $.resizeKind = 'offset'
        app.$.beginOverlay('ew-resize')
        this.beginHandling(e)
      }

      handleResize = (e: PointerEvent, event: SeqEvent) => {
        $.sequencerView.$.pointerRounding = 'round'
        $.resizingEvent = event
        $.resizeKind = 'length'
        app.$.beginOverlay('ew-resize')
        this.beginHandling(e)
      }

      handleDown = (e: PointerEvent) => {
        $.sequencerView.$.pointerRounding = 'floor'

        if (e.buttons & 2) {
          app.$.beginOverlay()
          $.sequencerView.$.isDeleting = $.isDeleting = true
          this.beginHandling(e)
          return
        }

        const time = $.sequencerView.$.pointerBar / 4
        const event = $.lane.$.findEvent(time)
        if (event) {
          $.movingEvent = event
          $.movingOffset = time - event.$.timeStart
          app.$.beginOverlay('grabbing')
          this.beginHandling(e)
        } else {
          //  = $.lastEvent || SeqEvent({
          //   page: 1,
          //   timeStart: time,
          //   timeEnd: time + ($.player?.$.totalBars || 1)
          // })
          $.drawingStart = time
          $.sequencerView.$.isDrawing = true
          app.$.beginOverlay()
          this.beginHandling(e)
        }
      }

      beginHandling = (e: PointerEvent) => {
        e.preventDefault()
        e.stopPropagation()

        $.sequencerView.$.isHandling = true

        on(window, 'pointerup').once(() => {
          app.$.hint = ''
          app.$.endOverlay()

          $.drawingStart =
            $.resizingEvent =
            $.movingEvent = null

          $.sequencerView.$.isDeleting =
            $.sequencerView.$.isHandling =
            $.sequencerView.$.isDrawing =
            $.isDeleting = false

          $.sequencerView.$.updateLanes()
        })
      }

      resize = fn(({ host }) => () => {
        const scrollTop = document.documentElement.scrollTop
        $.rect = new Rect(host.getBoundingClientRect()).translate(0, scrollTop)
      })
    })
  },

  function effects({ $, fx, deps, refs }) {
    fx(({ host }) =>
      on(host, 'contextmenu').prevent.stop()
    )

    fx(({ host }) =>
      observe.resize.initial(host, $.resize)
    )

    fx(({ lane }) => {
      $.player = lane.$.player
    })

    fx(({ sequencerView }) =>
      chain(
        sequencerView.fx(({ pointerPos }) => {
          $.pointerPos = pointerPos
        }),
        sequencerView.fx(({ pointerTime }) => {
          $.pointerTime = pointerTime
        }),
      )
    )

    fx(({ rect, pointerPos }) => {
      $.hoveringLane = pointerPos.y >= rect.top && pointerPos.y < rect.bottom
    })

    fx.once(({ lane }) => {
      $.lastEvent = lane.$.events.at(-1)!
    })

    fx(({ lane, lastEvent }) => {
      lane.$.lastEvent = lastEvent
    })

    fx(({ movingEvent }) => {
      $.lastEvent = movingEvent
    })

    fx(({ resizingEvent }) => {
      $.lastEvent = resizingEvent
    })

    fx(({ sequencerView, pointerTime, isDeleting, hoveringLane }) => {
      if (!isDeleting || !hoveringLane) return

      const event = $.lane.$.findEvent(pointerTime)

      if (event) {
        $.lane.$.events.splice($.lane.$.events.indexOf(event), 1)
        $.lane.$.events = [...$.lane.$.events]
        event.dispose()
      }
    })

    fx(({ player, pointerTime, drawingStart }) => {
      const duration = (
        $.lastEvent
          ? $.lastEvent.$.duration
          : player.$.totalBars
      ) || 1

      const timeOffset =
        $.lastEvent
          ? $.lastEvent.$.timeOffset
          : 0

      const page = player.$.page || 1

      const targetStart = pointerTime

      let added = false
      const maybeAddEvent = (timeStart: number, dur = duration) => {
        const timeEnd = timeStart + dur
        if ($.lane.$.findEventInRange(timeStart, timeEnd)) {
          return false
        }

        const event = SeqEvent({
          page,
          timeOffset,
          timeStart,
          timeEnd
        })

        $.lane.$.events.push(event)

        added = true
        return true
      }

      if (targetStart === drawingStart) {
        if (!maybeAddEvent(drawingStart)) {
          for (let dur = duration - 0.25; dur >= 0.25; dur -= 0.25) {
            if (maybeAddEvent(drawingStart, dur)) {
              break
            }
          }
        }
      } else if (targetStart > drawingStart) {
        for (let timeStart = drawingStart; timeStart <= targetStart; timeStart += duration) {
          maybeAddEvent(timeStart)
        }
      } else {
        for (let timeStart = drawingStart; timeStart >= targetStart; timeStart -= duration) {
          maybeAddEvent(timeStart)
        }
      }

      if (added) {
        $.lane.$.events = [...$.lane.$.events]
      }
    })

    fx(({ pointerTime, resizingEvent: event, resizeKind }) => {
      if (resizeKind === 'length') {
        const { timeStart } = event.$

        let timeEnd = Math.max(timeStart + 1 / 4, pointerTime)

        if ($.lane.$.findEventInRange(timeStart, timeEnd, event)) {
          out: {
            while (timeEnd.toFixed(2) !== event.$.timeEnd.toFixed(2)) {
              timeEnd += (1 / 4) * (timeEnd < event.$.timeEnd ? 1 : -1)
              if (!$.lane.$.findEventInRange(timeStart, timeEnd, event)) {
                break out
              }
            }

            return
          }
        }

        if (timeEnd === event.$.timeEnd) return

        event.$.timeEnd = timeEnd

        app.$.hint = `${toBarBeats(timeStart * 4)} ${toBarBeats(timeEnd * 4)} ${toBarBeats(timeEnd * 4 - timeStart * 4)}`
      } else if (resizeKind === 'offset') {
        const { timeEnd } = event.$

        let timeStart = Math.min(timeEnd - 1 / 4, pointerTime)

        if ($.lane.$.findEventInRange(timeStart, timeEnd, event)) {
          out: {
            while (timeStart.toFixed(2) !== event.$.timeStart.toFixed(2)) {
              timeStart += (1 / 4) * (timeStart < event.$.timeStart ? 1 : -1)
              if (!$.lane.$.findEventInRange(timeStart, timeEnd, event)) {
                break out
              }
            }

            return
          }
        }

        if (timeStart === event.$.timeStart) return

        const timeOffset = event.$.timeOffset + (timeStart - event.$.timeStart)

        event.$.timeStart = timeStart
        event.$.timeOffset = timeOffset

        app.$.hint = `${toBarBeats(timeStart * 4)} ${toBarBeats(timeEnd * 4)} ${toBarBeats(timeEnd * 4 - timeStart * 4)}` + (timeOffset ? ` ${timeOffset < 0 ? toBarBeats(timeOffset * 4) : `+${toBarBeats(timeOffset * 4)}`}` : '')
      }
    })

    fx(({ pointerTime, movingEvent, movingOffset }) => {
      const duration = movingEvent.$.timeEnd - movingEvent.$.timeStart

      let timeStart = pointerTime - movingOffset
      let timeEnd = timeStart + duration

      if ($.lane.$.findEventInRange(timeStart, timeEnd, movingEvent)) {
        out: {
          while (timeStart.toFixed(2) !== movingEvent.$.timeStart.toFixed(2)) {
            timeStart += (1 / 4) * (timeStart < movingEvent.$.timeStart ? 1 : -1)
            timeEnd = timeStart + duration
            if (!$.lane.$.findEventInRange(timeStart, timeEnd, movingEvent)) {
              break out
            }
          }

          return
        }
      }

      if (timeStart === movingEvent.$.timeStart) return

      movingEvent.$.timeStart = timeStart
      movingEvent.$.timeEnd = timeEnd
      app.$.hint = `${toBarBeats(timeStart * 4)} ${toBarBeats(timeEnd * 4)} ${toBarBeats(timeEnd * 4 - timeStart * 4)}`
    })

    fx(() => services.fx(({ skin }) => {
      $.css = /*css*/`
      ${skin.css}

      & {
        display: flex;
        width: 100%;
        user-select: none;
        touch-action: none;
      }

      .events {
        display: flex;
        box-sizing: border-box;
        width: 100%;

        ${skin.styles.lowered}
      }

      .event {
        position: absolute;
        display: flex;
        top: 0px;
        height: 100%;
        background: ${skin.colors.bgDarky};
        overflow: hidden;
        user-select: none;
        touch-action: none;
        border-radius: 1.17px;
        box-shadow: 1px 0px 1px ${skin.colors.shadeBlackHalf};

        ${skin.styles.raised}

        &-inner {
          display: flex;
          position: relative;
          width: 100%;
          height: 100%;

          .patterns {
            display: flex;
            position: relative;
            width: 100%;
            height: 100%;
          }
        }
      }

      .boxes {
        position: absolute;
        display: flex;
        flex-flow: row nowrap;
        width: 100%;
        height: 100%;
        z-index: 1;
        user-select: none;
        touch-action: none;
      }

      .box {
        box-sizing: border-box;
        border: 1px solid red;
        flex: 1;
        user-select: none;
        touch-action: none;
        &:hover {
          background: ${skin.colors.shadeSoft};
        }
      }

      .handle-resize,
      .handle-offset {
        position: absolute;
        top: 0;
        width: 5px;
        height: 100%;
        z-index: 5;
        cursor: ew-resize;
        &:hover {
          background: ${skin.colors.shadeSoft};
        }
      }
      .handle-resize {
        right: 0;
      }
      .handle-offset {
        left: 0;
      }

      ${TrackView} {
        pointer-events: none;
        display: flex;
        height: 100%;
      }
      `
    }))

    fx(({ rect, lane, time, zoom }) => lane.fx(({ events }) => {
      // time = Math.ceil(time / 4) * 4

      $.view = <div
        class="events"
        onpointerdown={$.handleDown}
        oncontextmenu={event.prevent.stop()}
      >
        {events.map((event) =>
          <SeqEventView.Fn
            key={event}
            event={event}
            time={time}
            lane={lane}
            rect={rect}
            zoom={zoom}
            handleDown={$.handleDown}
            handleOffset={$.handleOffset}
            handleResize={$.handleResize}
          />
        )}
      </div>
    }))
  }
))

export type SequencerView = typeof SequencerView.State

export const SequencerView = web(view('sequencer-view',
  class props {
    project!: Project
    sequencer!: Sequencer
  },

  class local {
    host = element

    audio?: Audio

    rect?: Rect
    outerWidth?: number
    innerWidth?: number
    padding?: number

    zoom = 1
    time: number = 1
    seqTime: number = 1
    coeff: number = 1

    isDrawing: boolean = false
    isDeleting: boolean = false
    isHandling: boolean = false
    isHovering: boolean = false
    isResizing: boolean = false

    pointerPos?: Point
    pointerBar: number = 0
    pointerTime: number = 0
    pointerRounding: 'round' | 'floor' = 'round'

    lanes?: SeqLane[]
    soundBuffers?: EditorBuffer[]

    lastAnim?: Animation

    middle?: HTMLDivElement
    middleScrollLeft = 0

    regionStart = -Infinity
    regionEnd = Infinity
    isHoveringRegion = false
    resizingRegion: 'start' | 'end' | null = null

    wasAhead = false
    ignoreLoop = false

    updateRulerPlayback = 0
    rulerEl?: HTMLDivElement
    rulerPlaybackEl?: HTMLDivElement
    rulerRegionStartEl?: HTMLDivElement
    rulerRegionEndEl?: HTMLDivElement
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      updateLanes = fn(({ audio, sequencer, lanes }) => () => {
        const minTimeStart = getLanesMinTimeStart(lanes)
        $.regionStart -= minTimeStart
        $.regionEnd -= minTimeStart
        if (minTimeStart) {
          if (sequencer.$.currentTime - minTimeStart < 0) {
            audio.$.gotoTime(0)
          } else {
            audio.$.seekTime(-minTimeStart)
          }
          sequencer.$.updateTime()
        }
        sequencer.$.updateLanes()
      })

      onPointerMove = (e: PointerEvent) => {
        this.updateMouseTimePos(e)
      }

      updateMouseTimePos = (e: PointerEvent) => {
        const rect = $.rect!.clone()
        const padding = rect.width * 0.05
        rect.width *= 0.9 // inner
        rect.x += padding
        rect.height -= 20 // scrollbar
        $.pointerPos = new Point(e.pageX, e.pageY)
        $.isHovering = $.pointerPos.withinRect(rect)
      }

      getLeftPos = (timePos: number) => {
        const { innerWidth, middleScrollLeft: scrollLeft, outerWidth, time } = $
        return clamp(
          (scrollLeft >= innerWidth! - 2 ? 0 : Math.ceil(scrollLeft)) + 0.5,
          Math.floor(Math.min(innerWidth!, Math.floor(scrollLeft) + outerWidth!) - 1),
          Math.floor((timePos / (time * 4)) * innerWidth!)
        )
      }

      getInnerLeftPos = (timePos: number) => {
        const { innerWidth, time } = $
        return clamp(
          0,
          Math.floor(innerWidth! - 1),
          (timePos / (time * 4)) * (innerWidth! - 1)
        )
      }

      seekTime = fn(({ audio, sequencer }) => () => {
        $.wasAhead = false

        if (sequencer.$.state === 'running') {
          const diffTime = $.pointerTime
            - Math.ceil(sequencer.$.currentTime * 4) / 4

          if ($.pointerTime === 0 && !$.ignoreLoop) {
            $.ignoreLoop = true
            setTimeout(() => {
              $.ignoreLoop = false
            }, 500)
          }
          audio.$.seekTime(diffTime)
        } else {
          audio.$.gotoTime($.pointerTime)
        }

        sequencer.$.updateTime()
      })

      addOneBefore = fn(({ lanes, project, middle }) => event.stop((e) => {
        const laneY = (e.currentTarget as HTMLElement).dataset.laneY
        if (laneY == null) return

        const y = +laneY
        const lane = lanes[y]
        const player = project.$.players[y]

        const timeEnd = lane.$.minTimeStart || 0
        const timeOffset = lane.$.lastEvent?.$.timeOffset || 0

        const timeStart = timeEnd
          - ((lane.$.lastEvent?.$.duration ?? player?.$.totalBars) || 1)

        const page = player.$.page ?? 1

        const event = SeqEvent({
          page,
          timeOffset,
          timeStart,
          timeEnd
        })

        lane.$.events.push(event)
        this.updateLanes()

        anim.schedule(() => {
          const left = this.getInnerLeftPos(timeStart * 4)
          middle.scrollLeft = left
        })
      }))

      addOneAfter = fn(({ lanes, project, middle }) => event.stop((e) => {
        const laneY = (e.currentTarget as HTMLElement).dataset.laneY
        if (laneY == null) return

        const y = +laneY
        const lane = lanes[y]

        const player = project.$.players[y]
        const timeStart = lane.$.maxTimeEnd!
        const timeEnd = timeStart
          + ((lane.$.lastEvent?.$.duration ?? player?.$.totalBars) || 1)
        const timeOffset = lane.$.lastEvent?.$.timeOffset || 0

        const page = player.$.page ?? 1

        const event = SeqEvent({
          page,
          timeOffset,
          timeStart,
          timeEnd
        })

        lane.$.events.push(event)
        this.updateLanes()

        anim.schedule(() => {
          const left = this.getInnerLeftPos(timeStart * 4)
          middle.scrollLeft = left
        })
      }))

      beginRegion = (e: PointerEvent) => {
        const regionKind = (e.currentTarget as HTMLElement).dataset.regionKind
        if (regionKind == null) return

        $.pointerRounding = 'round'
        $.isResizing = true
        $.resizingRegion = regionKind as 'start' | 'end'
        app.$.beginOverlay('cell-resize')

        const now = performance.now()

        on(window, 'pointerup').once(() => {
          if (performance.now() - now < 300) {
            this.seekTime()
          }
          $.resizingRegion = null
          $.isResizing = false
          app.$.endOverlay()
        })
      }

      handleRegionEnter = () => {
        $.isHoveringRegion = true
      }

      handleRegionLeave = () => {
        $.isHoveringRegion = false
      }

      resize = fn(({ host }) => () => {
        const scrollTop = document.documentElement.scrollTop
        $.rect = new Rect(host.getBoundingClientRect()).translate(0, scrollTop)
      })
    })
  },

  function effects({ $, fx, deps, refs }) {
    fx(({ host }) =>
      on(host, 'contextmenu').prevent.stop()
    )

    fx(({ host }) =>
      observe.resize.initial(host, $.resize)
    )

    fx(() => chain(
      on(window, 'pointermove').raf.capture($.onPointerMove),
      on(window, 'pointerdown').raf.capture($.onPointerMove)
    ))

    fx(() => services.fx(({ audio }) => {
      $.audio = audio
    }))

    let lastZoomTime = 0
    fx(({ zoom }) => {
      lastZoomTime = performance.now()
    })

    fx.raf(({ isHovering, isHandling, isResizing, isDeleting, isDrawing, rulerEl }) => {
      rulerEl.classList.toggle('none', (!isHovering && !isResizing && !isDrawing) && (!isHandling || isDeleting))
    })

    fx(({ pointerBar }) => {
      $.pointerTime = pointerBar / 4
    })

    fx(({ sequencer }) => sequencer.fx(({ lanes, time }) => {
      $.seqTime = time
      $.time = Math.ceil(time * 4) / 4
      $.lanes = lanes
    }))

    fx(({ lanes }) => {
      const updateSoundBuffers = queue.task.not.first.not.next.last(() => {
        $.soundBuffers = lanes.map((lane) => lane.$.player!).map((player) => player.$.soundBuffer!)
      })

      return chain(
        lanes.map((lane) =>
          lane.fx(({ player }) =>
            player.fx(({ soundBuffer: _ }) => {
              updateSoundBuffers()
            })
          )
        )
      )
    })

    fx(() => services.fx(({ audio }) => audio.fx(({ bpm }) => {
      $.coeff = bpm / (60 * 4)
    })))

    fx(({ rect, zoom }) => {
      $.padding = rect.width * 0.05
      $.outerWidth = rect.width * 0.9
      $.innerWidth = Math.floor($.outerWidth * zoom)
    })

    let lastAnimScrollTime = 0
    let lastUserHandleTime = 0
    fx(({ middle }) =>
      on(middle, 'scroll').passive((e) => {
        $.middleScrollLeft = middle.scrollLeft
        const now = performance.now()
        const didZoom = now - lastZoomTime < 500
        const didAnimScroll = now - lastAnimScrollTime < 1000
        if (!didZoom && !didAnimScroll) {
          lastUserHandleTime = performance.now()
        }
      })
    )

    fx(({ pointerBar: _p, isHandling, isResizing, isDrawing, isDeleting }) => {
      if (isResizing || isHandling || isDeleting || isDrawing) {
        lastUserHandleTime = performance.now()
      }
    })

    fx(({ middleScrollLeft, time, innerWidth, isDrawing, isHovering, isHandling, isResizing, isDeleting, pointerPos, padding, rect, pointerRounding }, prev) => {
      if (!isHovering && !isResizing && !isDrawing) {
        if (!isHandling || isDeleting || isDrawing) {
          if (prev.isHovering || prev.isResizing || prev.isDrawing) {
            app.$.hint = ''
          }
          return
        }
      }
      const pos = pointerPos.sub(rect.pos)

      if ((!isResizing && !isHandling && !isDrawing) || isDeleting) {
        if (pos.y >= rect.height - 20) {
          app.$.hint = ''
          return
        }
      }

      const pct = (pos.x - padding + middleScrollLeft) / innerWidth

      $.pointerBar = Math[pointerRounding](pct * time * 4)

      if (!isHandling || isDeleting || isDrawing) {
        app.$.hint = `${toBarBeats($.pointerBar)}`
        app.$.hintEl.$.centerY = rect.top + 35
      }
    })

    fx(({ pointerBar, rulerEl }) => {
      const x = $.getLeftPos(pointerBar)
      rulerEl.style.transform = `translateX(${x}px)`
    })

    fx(({ seqTime, pointerBar, resizingRegion }) => {
      if (resizingRegion === 'start') {
        let regionStart = Math.max(0, pointerBar / 4)
        if (regionStart === 0) regionStart = -Infinity
        $.regionStart = regionStart
      } else if (resizingRegion === 'end') {
        let regionEnd = Math.min(seqTime, pointerBar / 4)
        if (regionEnd === seqTime) regionEnd = Infinity
        $.regionEnd = regionEnd
      }
    })

    fx(({ seqTime, regionStart, regionEnd, lanes: _l, isHandling, isDeleting }) => {
      if (!isHandling && !isDeleting) {
        if (regionStart <= 0) $.regionStart = -Infinity
        if (regionEnd >= seqTime) $.regionEnd = Infinity
      }
    })

    fx(({ seqTime, regionStart, rulerRegionStartEl, lanes: _l, innerWidth: _i, isHandling, isDeleting }) => {
      if (!isHandling && !isDeleting) {
        const x = $.getInnerLeftPos(clamp(0, seqTime * 4, regionStart * 4))
        rulerRegionStartEl.style.transform = `translateX(${x}px)`
      }
    })

    fx(({ seqTime, regionEnd, rulerRegionEndEl, lanes: _l, innerWidth: _i, isHandling, isDeleting }) => {
      if (!isHandling && !isDeleting) {
        const x = $.getInnerLeftPos(clamp(1, seqTime * 4, regionEnd * 4))
        rulerRegionEndEl.style.transform = `translateX(${x}px)`
      }
    })

    let isAnimating = false

    fx(({ innerWidth: _ }) => {
      anim.schedule(() => {
        isAnimating = false
        $.lastAnim?.pause()
      })
    })

    fx(({ audio, sequencer, middle, rulerPlaybackEl, outerWidth, innerWidth }, prevView) => sequencer.fx(({ state, currentTime, time }, prev) => {
      if (state === 'running' && prev.state !== 'running') {
        $.lastAnim?.cancel()
      }

      const timeWithLatency = currentTime
      // + (
      //   state === 'running' ? audio.$.audioContext!.baseLatency : 0
      // )

      if (state === 'suspended') {
        $.wasAhead = false
      } else if (state === 'running' && $.regionEnd >= $.regionStart && $.regionStart >= 0.25 && timeWithLatency >= $.regionEnd - 0.5 && timeWithLatency <= $.regionEnd) {
        $.wasAhead = true
      }

      const regionEndClamped = clamp(0.25, time, $.regionEnd)
      const farAhead = timeWithLatency >= regionEndClamped + 0.29
      const didCross =
        timeWithLatency >= regionEndClamped - (
          regionEndClamped >= time ? 0.09 : 0.04
        )
      const wasRunning = prev.state === 'running' && state === 'suspended'
      const isAtStart = timeWithLatency < Math.max(0, $.regionStart) + 0.25
      const didLoop = $.wasAhead && isAtStart
      const shouldLoop = (didCross && !farAhead) || didLoop || (wasRunning && audio.$.clock.internalTime <= 0.02)

      if (shouldLoop && $.wasAhead) {
        $.wasAhead = false
      }

      if (shouldLoop && !$.ignoreLoop) {
        const diffTime = Math.round(
          (Math.max(0, $.regionStart) - timeWithLatency) * 4
        ) / 4
        audio.$.seekTime(diffTime)
      }

      const now = performance.now()
      const didUserScroll = now - lastUserHandleTime < 3000
      const didAnimScroll = now - lastAnimScrollTime < 500
      const isUserHandling = $.isResizing || $.isHandling || $.isDeleting
      const canAnimScroll = !didUserScroll && !didAnimScroll && !isUserHandling

      if (
        state === 'running'
        && (
          (
            prev.currentTime
            && currentTime < prev.currentTime
          )
          || (
            currentTime > 0
            && (
              !isAnimating
              || (
                prev.currentTime
                && Math.abs(currentTime - prev.currentTime) > 0.03
              )
            )
          )
        )
      ) {
        currentTime = Math.max(0, currentTime)
        isAnimating = true
        anim.schedule(() => {
          const totalBars = $.time / $.coeff
          const x = sequencer.$.currentTime / $.time
          // if (x < 0.01 && !didUserScroll) {
          //   x = 0
          //   middle.scrollLeft = 0
          //   // middle.scrollTo({
          //   //   left: 0
          //   // })
          // }

          if (isAnimating) {
            $.lastAnim?.pause()
          }

          $.lastAnim = rulerPlaybackEl.animate([
            { transform: `translateX(${Math.floor(x * innerWidth - 1)}px)` },
            { transform: `translateX(${Math.floor(innerWidth - 1)}px)` }],
            {
              fill: 'forwards',
              easing: 'linear',
              duration: Math.max(0, ((totalBars - x * totalBars)) * 1000)
            }
          )
        })
      } else if (state === 'running' && canAnimScroll) {
        const halfWidth = outerWidth / 2
        const normalTime = currentTime / $.time
        const centerPos = normalTime * innerWidth - halfWidth
        const currPos = $.middleScrollLeft
        const diff = centerPos - currPos
        const ratio = diff / outerWidth
        const zoomSlope = 0.85
        const threshold = 0.4 + (0.15 / ($.zoom ** zoomSlope))

        const willHaveMovedDistance = (0.5 / $.time) * innerWidth

        if (ratio > threshold || ratio < -0.5) {
          lastAnimScrollTime = performance.now()

          const offsetLeft = ratio > 0 && ratio < 2
            ? -willHaveMovedDistance * (0.4 + 0.12 * (($.zoom ** 1.2) / 64))
            : halfWidth

          const targetLeft = normalTime * innerWidth

          const left = Math.max(
            targetLeft - willHaveMovedDistance * 0.9,
            targetLeft - offsetLeft
          )

          const shouldAnimScroll = (ratio > 0 || !isAtStart)

          if (shouldAnimScroll) {
            middle.scrollTo({ behavior: 'smooth', left })
          } else {
            middle.scrollLeft = left
          }
        }
      } else if (state === 'suspended' || state === 'init') {
        if (isAnimating) {
          isAnimating = false
          $.updateRulerPlayback++
        }

        let x = currentTime / $.time!

        if (x < 0.01) {
          x = 0
        }

        rulerPlaybackEl.style.transform = `translateX(${Math.floor(x * (innerWidth - 1))}px)`

      }
      const didResize = prevView.innerWidth !== innerWidth
      if (state === 'suspended' || state === 'preparing' || didResize) {
        prevView.innerWidth = innerWidth
        anim.schedule(() => {
          const x = (audio.$.getTime() % $.time) / $.time!
          const centerPos = x * innerWidth - outerWidth / 2
          const currPos = $.middleScrollLeft
          const diff = centerPos - currPos
          const ratio = diff / outerWidth

          if (Math.abs(ratio) > 1 || didResize) {
            middle.scrollLeft = centerPos
          }
        })
      }
    }))

    fx(() => services.fx(({ skin }) => {
      $.css = /*css*/`
      ${skin.css}

      & {
        position: relative;
        display: flex;
        flex-flow: row nowrap;
        width: 100%;
        overflow: hidden;
        cursor: default;
        user-select: none;
        touch-action: none;
      }

      .row {
        display: flex;
        position: relative;
        height: 35px;
        min-height: 35px;
      }

      .times {
        display: flex;
        flex: 1;
        flex-flow: row nowrap;
        background: ${skin.colors.bgLight};
        ${skin.styles.raised}

        .t {
          position: absolute;
          box-sizing: border-box;
          padding-bottom: 1px;
          height: 35px;
          font-family: ${skin.fonts.slab};
          font-size: 14.5px;
          letter-spacing: -0.5px;
          line-height: 12.5px;
          display: inline-flex;
          flex-flow: column nowrap;
          justify-content: flex-end;
          flex: 1;
        }
      }

      .middle {
        padding: 0 5%;
        position: relative;
        display: flex;
        flex-flow: column nowrap;
        overflow-x: scroll;

        &::-webkit-scrollbar {
          height: 20px;
        }

        &::-webkit-scrollbar-track {
          background: ${skin.colors.bg};
        }

        &::-webkit-scrollbar-thumb {
          background: ${skin.colors.shadeSofter};
        }
      }

      .inner {
        overflow: hidden;
        transition: width 250ms ease-out;
      }

      .side {
        position: absolute;
        display: inline-flex;
        flex-flow: column nowrap;
        overflow: hidden;
        z-index: 999;
        flex: 1;
        width: 5%;
        min-width: 5%;
        max-width: 5%;
        background: ${skin.colors.shadeDark};

        &.left {
          left: 0;
        }

        &.right {
          right: 0;
        }

        .controls {
          display: flex;
          background: ${skin.colors.bgLighter};
          ${skin.styles.raised}
        }

        .row {
          ${skin.styles.raised}
        }

        button {
          all: unset;
          font-family: ${skin.fonts.slab};
          display: flex;
          flex: 1;
          height: 100%;
          max-width: 100%;
          width: 0;
          overflow: hidden;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          &:hover {
            background: ${skin.colors.shadeSoftest};
          }
        }
      }

      .lanes {
        display: flex;
        flex-flow: column nowrap;
        width: 100%;
        height: 100%;
      }

      .ruler {
        position: absolute;
        height: 100%;
        width: 1px;
        background: #fff;
        z-index: 99;
        pointer-events: none;

        &-region {
          z-index: 8;
          cursor: col-resize;

          &::after {
            pointer-events: all;
            content: ' ';
            cursor: col-resize;
            position: absolute;
            top: 0;
            width: 24px;
            height: 35px;
          }

          &:hover {
            &::after {
              background: ${skin.colors.shadeSoft};
            }
          }

          &-start {
            background: ${skin.colors.brightYellow};
            &::before {
              content: ' ';
              cursor: col-resize;
              position: absolute;
              top: 0;
              left: 0;
              border: 5px solid ${skin.colors.brightYellow};
              border-right-color: transparent;
              border-bottom-color: transparent;
            }
            &::after {
              left: -15px;
            }
          }
          &-end {
            background: ${skin.colors.brightPurple};
            &::before {
              content: ' ';
              cursor: col-resize;
              position: absolute;
              top: 0;
              right: 0;
              border: 5px solid ${skin.colors.brightPurple};
              border-left-color: transparent;
              border-bottom-color: transparent;
            }
            &::after {
              left: -8px;
            }
          }
        }

        &-playback {
          background: ${skin.colors.brightCyan};
          box-shadow: 0 0 2.8px .1px ${skin.colors.brightCyan};
          z-index: 9;
        }
      }

      ${NumberInput} {
        width: 100%;
        height: 100%;

        &::part(value) {
          display: none;
        }

        &::part(minus),
        &::part(plus) {
          font-family: ${skin.fonts.slab};
          font-size: 19px;
          line-height: 0px;
          box-sizing: border-box;
          flex: 1;
          width: 100%;
          height: 50%;
        }

        &::part(plus) {
          padding-bottom: 3px;
        }
      }

      .add-one {
        position: relative;
        cursor: cell !important;

        ${TrackView} {
          position: absolute;
          left: 0;
          pointer-events: none;

          ${allWidth(`75px`)}
          height: 100%;
        }
      }
      `
    }))

    const RulerPlayback = part((update) => {
      fx(({ updateRulerPlayback: _ }) => {
        refs.rulerPlaybackEl.current = document.createElement('div')
        update(
          <div ref={refs.rulerPlaybackEl} class="ruler ruler-playback" />
        )
      })
    })

    const PlaybackControl = part((update) => {
      fx(({ project }) => project.fx(({ playbackState }) => {
        update(
          <button onclick={() => {
            if (playbackState === 'seq') {
              project.$.playbackState = 'page'
            } else {
              project.$.playbackState = 'seq'
            }
          }}
          >{playbackState === 'seq' ? 'S' : 'P'}</button>
        )
      }))
    })

    fx(({ lanes, soundBuffers, time, coeff, zoom, outerWidth, innerWidth }) => {
      const beats = time * 4

      // find a power of two greater division
      const beatsPowerOfTwo = nearestPowerOfTwo(beats)
      const co = beatsPowerOfTwo / beats

      const innerScaled = innerWidth * co
      const timeScaled = time * co

      let timesLength = Math.min(
        beatsPowerOfTwo / 4,
        nearestPowerOfTwo(
          innerScaled / ((outerWidth * co) / (16 / (zoom ** 0.2)))
        )
      )

      const oneWidth = innerScaled / timesLength

      // don't display more than necessary
      timesLength = Math.ceil(innerWidth / oneWidth)

      $.view = <>
        <div class="side left">
          <div class="row controls">
            <PlaybackControl />
          </div>

          {lanes.map((lane, y) =>
            <div class="row" key={lane}>
              <button class="add-one" data-lane-y={y} onclick={$.addOneBefore}>
                <TrackView
                  active={false}
                  live={false}
                  didDisplay={true}
                  showIndicator={false}
                  player={lane.$.player}
                  sound={soundBuffers[y]}
                  pattern={false}
                  clickMeta={soundBuffers[y].$}
                />
              </button>
            </div>
          )}
        </div>

        <div
          ref={refs.middle}
          onref={(el) => {
            el.scrollLeft = $.middleScrollLeft
          }}
          class="middle"
          style={`width:${outerWidth}px`}
          oncontextmenu={event.prevent.stop()}
        >
          <div
            class="inner"
            style={allWidth(`${innerWidth}px`)}
            oncontextmenu={event.prevent.stop()}
          >
            <div ref={refs.rulerEl} class="ruler" />
            <div ref={refs.rulerRegionStartEl} class="ruler ruler-region ruler-region-start" data-region-kind="start" onpointerdown={$.beginRegion} onpointerenter={$.handleRegionEnter} onpointerleave={$.handleRegionLeave} />
            <div ref={refs.rulerRegionEndEl} class="ruler ruler-region ruler-region-end" data-region-kind="end" onpointerdown={$.beginRegion} onpointerenter={$.handleRegionEnter} onpointerleave={$.handleRegionLeave} />
            <RulerPlayback />

            <div class="row">
              <div class="times" onpointerdown={$.seekTime}>
                {Array.from({ length: timesLength }, (_, i) => {
                  const left = i * oneWidth
                  const t = (left / innerScaled) * timeScaled
                  const ms = ((t * 1000) / coeff)
                  const beats = toBeats(t * 4)
                  const timeText = new Date(ms).toISOString()
                    .split('T')[1]
                    .split(':')
                    .slice(1, 3)
                    .map((x, i) =>
                      !i
                        ? parseFloat(x)
                        : x.split('.')[0]
                    )
                    .join(':')

                  return <div class="t" style={`left: ${left}px`}>
                    <span class="time">{timeText}</span>
                    <span class="beat">{beats}</span>
                  </div>
                })}
              </div>
            </div>

            {lanes.map((lane, y) =>
              <div class="row" oncontextmenu={event.prevent.stop()} key={lane}>
                <SeqLaneView
                  y={y}
                  lane={lane}
                  time={time}
                  zoom={zoom}
                  sequencerView={$.self}
                  onEventUpdate={$.updateLanes}
                />
              </div>
            )}
          </div>
        </div>

        <div class="side right">
          <div class="row controls">
            <NumberInput
              class="resize"
              align="y"
              min={1}
              max={64}
              step={1}
              value={deps.zoom}
            />
          </div>

          {lanes.map((lane, y) =>
            <div class="row" key={lane}>
              <button class="add-one" data-lane-y={y} onclick={$.addOneAfter}>
                <TrackView
                  active={false}
                  live={false}
                  didDisplay={true}
                  showIndicator={false}
                  player={lane.$.player}
                  sound={soundBuffers[y]}
                  pattern={false}
                  clickMeta={soundBuffers[y].$}
                />
              </button>
            </div>
          )}
        </div>
      </>
    })
  }
))
