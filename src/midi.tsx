/** @jsxImportSource minimal-view */

import { modWrap } from 'everyday-utils'
import { Rect } from 'geometrik'
import { element, view, web } from 'minimal-view'
import { MidiOp } from 'webaudio-tools'
import { EditorBuffer } from './editor-buffer'
import { Player } from './player'
import { services } from './services'
import { classes } from './util/classes'

const MidiOps = new Set(Object.values(MidiOp))

// chatgpt
function midiToPitchClass(midi: number): string {
  const pitchClasses = 'c c# d d# e f f# g g# a a# b'.split(' ')
  const octave = Math.floor(midi / 12) - 1;
  return pitchClasses[midi % 12] + octave;
}

type MidiRect = readonly [Rect, [WebMidi.MIDIMessageEvent, WebMidi.MIDIMessageEvent | undefined]]

export const Midi = web(view('midi',
  class props {
    player?: Player
    pattern!: EditorBuffer
    xPos?: number
    showNotes = false
  },

  class local {
    host = element
    turn = 0
    rects: MidiRect[] = []
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {

    })
  },

  function effects({ $, fx }) {
    services.fx(({ skin }) => {
      $.css = /*css*/`
      & {
        --note-color: ${skin.colors.brightGreen};
        contain: size layout style paint;
        pointer-events: none;
        font-family: ${skin.fonts.cond};

        font-size: 13px;
        /* &(:not([state=running])) {
          --note-color: #666c;
        } */
      }

      .notes {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
      }

      &([padded]) {
        .notes {
          left: 2px;
        }
      }

      &(:not([padded])) {
        .vol {
          opacity: 0.5;
        }
      }

      .rows {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-flow: column nowrap;
        align-items: stretch;
        justify-content: stretch;
      }

      .row {
        flex: 1;
        &:not(.black) {
          background: ${skin.colors.shadeSoftest};
        }
      }

      .note {
        z-index: 1;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--note-color);
        text-shadow: 1px 1px #000;

        box-sizing: border-box;
        border: 1px solid #fff7;
        border-bottom-color: #0003;
        border-right-color: #0003;
        border-radius: 1.17px;
        box-shadow: 1px 0px 1px ${skin.colors.shadeBlackHalf};

        &.lit {
          background-color: #03f;
        }

        span {
          position: absolute;
          top: -20px;
          white-space: nowrap;
          word-wrap: nowrap;
        }
      }

      .vol {
        position: absolute;
        background-color: ${skin.colors.shadeSoft};
        z-index: 0;
      }
      `
    })

    fx.raf(({ host, showNotes }) => {
      host.toggleAttribute('padded', showNotes)
    })

    fx(({ pattern }) =>
      pattern.fx(({ midiRange, midiEvents, numberOfBars }) =>
        fx(({ turn }) => {
          const events: WebMidi.MIDIMessageEvent[] =
            (midiEvents.get(turn) ?? midiEvents.get(0) ?? [])
              ?.filter(x =>
                MidiOps.has(x.data[0]) && x.receivedTime < numberOfBars * 1000
              )

          const [minNote, maxNote] = midiRange

          const heightScale = (maxNote - minNote)

          const fullTime = numberOfBars * 1000

          const width = 1 / numberOfBars
          const height = 1 / heightScale

          const noteOns = events.filter(x => x.data[0] === MidiOp.NoteOn)
          const noteOffs = events.filter(x => x.data[0] === MidiOp.NoteOff)

          const rects = noteOns
            .map((noteOn): MidiRect => {
              const noteOff = noteOffs.find(y => noteOn.data[1] === y.data[1] && (y.receivedTime >= noteOn.receivedTime))

              if (noteOff) noteOffs.splice(noteOffs.indexOf(noteOff), 1)

              return [
                new Rect(
                  (noteOn.receivedTime / 1000) * width,
                  (heightScale - (noteOn.data[1] - minNote) - 1) * height,
                  (((noteOff?.receivedTime ?? fullTime) - noteOn.receivedTime) / 1000) * width,
                  height
                ),
                [noteOn, noteOff],
              ]
            })

          $.rects = rects
        })
      )
    )

    const notesMap = new Map<SVGRectElement, MidiRect>()

    fx(({ player, pattern, xPos }) =>
      player.fx(({ patternOffsets, patternBuffers, currentTime, turn }) => {
        if (!patternBuffers.includes(pattern)) return

        $.turn = turn

        const offset = patternOffsets[xPos]
        const time = currentTime - offset * 1000

        for (const [el, [, [noteOn, noteOff]]] of notesMap) {
          if (!noteOn || !noteOff) continue

          if (time >= noteOn.receivedTime
            && time < noteOff.receivedTime) {
            el.classList.add('lit')
          } else {
            el.classList.remove('lit')
          }
        }
      })
    )

    const blacks = new Set([1, 3, 6, 8, 10])

    fx(({ pattern, rects, showNotes }) =>
      pattern.fx(({ midiRange }) => {
        // const midiRange = pattern.$.midiRange!

        $.view = <div class="notes">
          {showNotes && <div class="rows">
            {Array.from({ length: midiRange[1] - midiRange[0] }, (_, i) => {
              const note = modWrap(midiRange[0] + i, 12)
              return <div class={classes({
                row: true,
                black: blacks.has(note),
                octave: note === 0
              })} />
            }).reverse()}
          </div>}

          {rects.map((item, i) => {
            const [rect, [{ data: [, note, vel] }]] = item
            const volHeight = vel / 127
            const volRect = new Rect(rect.x, 1 - volHeight, rect.width + 0.0001, volHeight)

            return <>
              <div
                onref={el => {
                  notesMap.set(el, item)
                }}
                onunref={el => {
                  notesMap.delete(el)
                }}
                class="note"
                style={{
                  ...rect.toStylePct(),
                  opacity: `${((vel / 127) ** 0.3) * 0.9 + 0.1}`,
                  zIndex: `${999 - i}`
                }}
              >
                {showNotes && <span>{
                  midiToPitchClass(note).toUpperCase()
                }</span>}
              </div>

              <div
                class="vol"
                style={{
                  ...volRect.toStylePct(),
                }}
              />
            </>
          })}
        </div>
      }))
  })
)
