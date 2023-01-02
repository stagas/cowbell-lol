/** @jsxImportSource minimal-view */

import { Rect } from 'geometrik'
import { ImmMap } from 'immutable-map-set'
import { element, view, web } from 'minimal-view'
import { MidiOp } from 'webaudio-tools'
import { AudioState } from './audio'
// import { AppContext } from './app'

const MidiOps = new Set(Object.values(MidiOp))

export const Midi = web(view('midi',
  class props {
    // app!: AppContext
    getTime!: () => number
    offset?: number = 0
    state!: AudioState
    midiEvents = new ImmMap<number, WebMidi.MIDIMessageEvent[]>()
    numberOfBars: number = 1
    timeBars?: number = 1
  },

  class local {
    host = element
    rects?: (readonly [Rect, [WebMidi.MIDIMessageEvent, WebMidi.MIDIMessageEvent]])[]
    currentTime?: number
    turn = 0
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {

    })
  },

  function effects({ $, fx }) {
    $.css = /*css*/`
    & {
      --note-color: #c30;
      contain: size layout style paint;
      display: inline-flex;
      pointer-events: none;

      /* &(:not([state=running])) {
        --note-color: #666c;
      } */
    }

    [part=svg] {
      z-index: -1;
      width: 100%;
      height: 100%;
      shape-rendering: optimizeSpeed;
    }

    [part=note] {
      shape-rendering: optimizeSpeed;
      fill: var(--note-color);
      /* stroke: #000; */
      /* stroke-width: 1px; */
      &.lit {
        fill: #03f;
      }
    }
    `

    // fx.raf(function updateAttrState({ host, state }) {
    //   host.setAttribute('state', state)
    // })

    fx(function updateRects({ midiEvents, numberOfBars, turn }) {
      const events: WebMidi.MIDIMessageEvent[] = midiEvents.get(turn)?.filter(x => MidiOps.has(x.data[0]) && x.receivedTime < numberOfBars * 1000) ?? []

      const minNote = Math.floor(
        (Math.min(...events.map(x => x.data[1])) - 1)
        / 12
      ) * 12
      const maxNote = Math.ceil(
        (Math.max(...events.map(x => x.data[1])) + 1)
        / 12
      ) * 12

      const heightScale = (maxNote - minNote)
      const fullTime = numberOfBars * 1000

      const width = 100 / numberOfBars
      const height = 100 / (heightScale + 1)

      const noteOns = events.filter(x => x.data[0] === MidiOp.NoteOn)
      const noteOffs = events.filter(x => x.data[0] === MidiOp.NoteOff)

      const rects = noteOns.map(noteOn => {
        const noteOff = noteOffs.find(y => noteOn.data[1] === y.data[1] && (y.receivedTime >= noteOn.receivedTime))
        if (noteOff) noteOffs.splice(noteOffs.indexOf(noteOff), 1)
        return [
          new Rect(
            (noteOn.receivedTime / 1000) * width,
            (heightScale - (noteOn.data[1] - minNote)) * height,
            (((noteOff?.receivedTime ?? fullTime) - noteOn.receivedTime) / 1000) * width,
            height
          ),
          [noteOn, noteOff],
        ] as readonly [Rect, [WebMidi.MIDIMessageEvent, WebMidi.MIDIMessageEvent]]
      })

      $.rects = rects
    })

    const notesMap = new Map<SVGRectElement, readonly [Rect, [WebMidi.MIDIMessageEvent, WebMidi.MIDIMessageEvent]]>()

    fx(function updateTimer({ state, getTime, timeBars }) {
      if (state === 'running') {
        const iv = setInterval(() => {
          const now = getTime()
          $.currentTime = (now % timeBars) * 1000
          $.turn = (now / timeBars) | 0
        }, 12)
        return () => {
          clearInterval(iv)
        }
      }
    })

    fx.raf(function updateLitNotes({ currentTime, offset }) {
      currentTime -= offset * 1000
      for (const [
        el, [, [noteOnEvent, noteOffEvent]]
      ] of notesMap) {
        if (!noteOnEvent || !noteOffEvent) continue
        if (currentTime >= noteOnEvent.receivedTime
          && currentTime < noteOffEvent.receivedTime) {
          el.classList.add('lit')
        } else {
          el.classList.remove('lit')
        }
      }
    })

    fx(function drawMidi({ rects }) {
      $.view =
        <svg part="svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          {rects.map((item) => {
            const [rect, [{ data: [, , vel] }]] = item
            return <rect
              onref={el => {
                notesMap.set(el, item)
              }}
              onunref={el => {
                notesMap.delete(el)
              }}
              part="note"
              {...rect.toJSON()}
              opacity={((vel / 127) ** 0.3) * 0.9 + 0.1}
            />
          })}
        </svg>
    })
  })
)
