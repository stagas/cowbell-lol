import { reactive } from 'minimal-view'
import { anim } from './anim'
import { Audio, AudioState } from './audio'
import { Player, players } from './player'
import { services } from './services'

export type SeqEvent = typeof SeqEvent.State

export const SeqEvent = reactive('seq-event',
  class props {
    page!: number
    timeOffset!: number
    timeStart!: number
    timeEnd!: number
  },

  class local {
    duration?: number
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      toJSON = (): [number, number, number, number] =>
        [$.page, $.timeStart, $.timeEnd, $.timeOffset]
    })
  },

  function effects({ $, fx, deps, refs }) {
    fx(({ timeStart, timeEnd }) => {
      $.duration = timeEnd - timeStart
    })
  }
)

export type SeqLane = typeof SeqLane.State

export const SeqLane = reactive('seq-lane',
  class props {
    player!: Player | null
    events!: SeqEvent[]
  },

  class local {
    minTimeStart: number = 0
    maxTimeEnd: number = 0
    lastEvent?: SeqEvent
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      findEvent = (time: number) => {
        return this.findEventInRange(time, time + 1 / 4)
      }

      findEventInRange = (timeStart: number, timeEnd: number, ignoreEvent?: SeqEvent) => {
        for (const event of $.events) {
          if (event === ignoreEvent) continue
          if (timeEnd > event.$.timeStart && timeStart < event.$.timeEnd) {
            return event
          }
        }
      }

      findEventsInRange = (timeStart: number, timeEnd: number) => {
        const events: SeqEvent[] = []
        for (const event of $.events) {
          if (timeEnd > event.$.timeStart && timeStart < event.$.timeEnd) {
            events.push(event)
          }
        }
        return events
      }

      findEventsInRangeLoop = (timeStart: number, timeEnd: number, totalTime: number) => {
        const duration = timeEnd - timeStart
        if (!totalTime || timeEnd < totalTime) {
          return this.findEventsInRange(timeStart, timeEnd)
        } else {
          const events = this.findEventsInRange(timeStart, timeEnd)

          let i = 0
          let add = 0
          do {
            timeStart -= totalTime
            timeEnd -= totalTime

            const next = this.findEventsInRange(timeStart, timeEnd)

            add = ++i * totalTime

            // TODO: this is maybe leaking SeqEvent objects we only use temporarily
            // we should dispose() them or jsonify the return type so they're gc'ed.
            // However since we're not storing them they should also be gc'ed on their
            // own? Finalization API can tell us.
            events.push(...next.map((ev) => SeqEvent({
              page: ev.$.page,
              timeStart: ev.$.timeStart + add,
              timeEnd: ev.$.timeEnd + add,
              timeOffset: ev.$.timeOffset
            })))
          } while (add < duration && timeEnd >= 0)

          return events
        }
      }

      toJSON = () =>
        $.events.map((ev) => ev.$.toJSON())
    })
  },

  function effects({ $, fx, deps, refs }) {
    fx(() => () => {
      $.events.forEach((ev) => ev.dispose())
    })
  }
)

export type Sequencer = typeof Sequencer.State

export const Sequencer = reactive('sequencer',
  class props {
    lanes!: SeqLane[]
  },

  class local {
    audio?: Audio | null
    time?: number
    state: AudioState = 'init'
    playbackState?: 'seq' | 'page' = 'seq'
    currentTime = -1
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      updateLanes = () => {
        $.lanes.forEach((lane) => {
          lane.$.events = [...lane.$.events]
            .sort((a, b) => a.$.timeStart - b.$.timeStart)
        })
        $.lanes = [...$.lanes]
        players.forEach((player) => {
          player.$.seqNode?.clear()
        })
      }

      updateTime = fn(({ audio }) => () => {
        const now = audio.$.getTime(audio.$.state === 'running' || audio.$.state === 'preparing')
        $.currentTime = now % $.time!
      })

      setCurrentEventPage = (player: Player, page: number) => {
        const event = player.$.seqLane?.$.findEventsInRangeLoop($.currentTime, $.currentTime + 0.25, $.time!)[0]
        if (event) {
          event.$.page = page
        }
      }

      toJSON = () => $.lanes.map((lane) => lane.$.toJSON())
    })
  },

  function effects({ $, fx, deps, refs }) {
    fx(() => services.fx(({ audio }) => {
      $.audio = audio
    }))

    fx(({ currentTime, time, lanes }) => {
      lanes.forEach((lane) => {
        const nextEvent = lane.$.findEventsInRangeLoop(currentTime + 0.25, currentTime + 0.50, time)[0]
        if (nextEvent) {
          lane.$.player.$.page = nextEvent.$.page
        }
      })
    })

    fx(({ state }) => {
      if (state === 'running') {
        const tick = () => {
          if ($.state === 'running') {
            anim.schedule(tick)
          }
          $.updateTime()
        }
        anim.schedule(tick)
        return () => {
          anim.remove(tick)
        }
      } else {
        $.updateTime()
      }
    })

    fx(({ audio, state }) => audio.fx(({ stopTime: _ }) => {
      if (state !== 'running') {
        $.updateTime()
      }
    }))

    fx(({ lanes }) => {
      const minTimeStart = getLanesMinTimeStart(lanes)

      lanes.forEach((lane) => {
        lane.$.events.forEach((ev) => {
          ev.$.timeStart -= minTimeStart
          ev.$.timeEnd -= minTimeStart
        })
      })

      lanes.forEach((lane) => {
        lane.$.minTimeStart = !lane.$.events.length ? 0 : Math.min(
          ...lane.$.events.map((ev) =>
            ev.$.timeStart)
        )
        lane.$.maxTimeEnd = !lane.$.events.length ? 0 : Math.max(
          ...lane.$.events.map((ev) =>
            ev.$.timeEnd)
        )
      })

      $.time = Math.max(
        ...lanes.flatMap((lane) =>
          lane.$.events.map((ev) =>
            ev.$.timeEnd)
        )
      )
    })
  }
)

export function getLanesMinTimeStart(lanes: SeqLane[]) {
  return Math.min(
    ...lanes.flatMap((lane) =>
      lane.$.events.map((ev) =>
        ev.$.timeStart)
    )
  )
}
