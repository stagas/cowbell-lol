/** @jsxImportSource minimal-view */

import { web, view, element } from 'minimal-view'
import { Rect } from 'geometrik'

import { MidiOp } from 'webaudio-tools'

const MidiOps = new Set(Object.values(MidiOp))

export const Midi = web('midi', view(
  class props {
    state!: 'idle' | 'running' | 'suspended'
    audioContext!: AudioContext
    midiEvents: WebMidi.MIDIMessageEvent[] = []
    numberOfBars: number = 1
  }, class local {
  host = element
  rects?: (readonly [Rect, [WebMidi.MIDIMessageEvent, WebMidi.MIDIMessageEvent]])[]
  currentTime!: number
}, ({ $, fx }) => {
  $.css = /*css*/`
  & {
    contain: size layout style paint;
    --note-color: #d64;
    display: inline-flex;

    &(:not([state=running])) {
      --note-color: #6665;
    }
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
    &.lit {
      fill: #03f;
      opacity: 1;
    }
  }
  `

  fx.raf(({ host, state }) => {
    host.setAttribute('state', state)
  })

  fx(({ midiEvents, numberOfBars }) => {
    const events: WebMidi.MIDIMessageEvent[] = midiEvents.filter(x => MidiOps.has(x.data[0]))
    const minNote = Math.min(...midiEvents.map(x => x.data[1]))
    const maxNote = Math.max(...midiEvents.map(x => x.data[1]))

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

  fx(({ state, audioContext, numberOfBars }) => {
    if (state === 'running') {
      const iv = setInterval(() => {
        $.currentTime = (audioContext.currentTime % numberOfBars) * 1000
      }, 10)
      return () => {
        clearInterval(iv)
      }
    }
  })

  fx.raf(({ currentTime }) => {
    for (const [
      el, [, [noteOnEvent, noteOffEvent]]
    ] of notesMap) {
      if (currentTime >= noteOnEvent.receivedTime
        && currentTime < noteOffEvent.receivedTime) {
        el.classList.add('lit')
      } else {
        el.classList.remove('lit')
      }
    }
  })

  fx(({ rects }) => {
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
}))
