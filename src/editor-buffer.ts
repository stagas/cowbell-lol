import { CanvyElement } from 'canvy'
import { cheapRandomId, checksum, pick } from 'everyday-utils'
import { ImmMap } from 'immutable-map-set'
import { queue, reactive } from 'minimal-view'
import { MidiOp } from 'webaudio-tools'
import { services } from './services'
import { compilePattern } from './pattern'
import { Preview } from './preview-service'
import { Slider } from './slider'
import { Sliders } from './types'
import { areSlidersCompatible } from './util/args'
import { getTitle } from './util/parse'
import { randomName } from './util/random-name'
import { Waveplot } from './waveplot'

const MidiOps = new Set(Object.values(MidiOp))

export type EditorBuffer = typeof EditorBuffer.State
export const EditorBuffer = reactive('editor-buffer',
  class props {
    kind!: 'sound' | 'pattern' | 'main'
    id?= cheapRandomId()

    value!: string

    parentId?: string

    createdAt?: number = Date.now()
    isDraft?: boolean = true
    isNew?: boolean = true
    isIntent?: boolean = false
    isImport?: boolean = false
    didPaint?: boolean = false
    fallbackTitle?: string = randomName()

    noDraw?= false
  },

  class local {
    checksum?: number

    title?: string

    didDisplay?: boolean = false

    compiledValue?: string

    originalValue?: string

    snapshot?: any

    sliders: Sliders = new Map()

    editor?: CanvyElement | null | undefined
    waveplot?: Waveplot
    preview?: Preview
    canvas?: HTMLCanvasElement
    canvases: Set<string> = new Set()

    midiEvents = new ImmMap<number, WebMidi.MIDIMessageEvent[]>()
    numberOfBars?: number
    midiRange?: [number, number]
    recompute = false
    turn = 0

    sandboxCode?: string

    error?: Error | false = false
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      equals = (other: Partial<typeof $>) => {
        return $.value === other.value
      }

      derive =
        (props: Partial<typeof $>) =>
          [EditorBuffer, Object.assign(pick($, [
            'value',
            'kind',
            'midiEvents',
            'numberOfBars',
          ]), props)] as const

      draw = fn(({ id, waveplot, preview, canvas: _, canvases: __, noDraw }) => queue.raf(async () => {
        if (noDraw) return

        if (!$.didPaint && $.parentId) {
          waveplot.copy($.parentId!, id)
          this.copyCanvases()
        }

        const error = await preview.draw($.self as any)
        $.error = error || false
        if (error) return error

        $.didPaint = true

        this.copyCanvases()
      }))

      copyCanvases = fn(({ id, waveplot, canvas: _, canvases, noDraw }) => async () => {
        if (noDraw) return

        canvases.forEach((dest) => {
          waveplot.copy(id, dest)
        })
      })

      getCodeNoArgs = () => {
        let code = $.value

        Array.from($.sliders.values()).reverse().forEach((slider) => {
          const { source, sourceIndex } = slider.$
          if (source == null || sourceIndex == null) return

          const argMinusDefaultLength = source.arg.length - source.default.length

          code = code.slice(
            0, sourceIndex + argMinusDefaultLength
          ) + code.slice(sourceIndex + source.arg.length)
        })

        return code
      }

      compilePattern = async (turn: number) => {
        const result = await compilePattern(
          $.value,
          $.numberOfBars || 1,
          turn
        )

        if (result.success) {
          $.numberOfBars = result.numberOfBars
          $.error = false

          const prevEvents = $.midiEvents.get(turn)

          // are events equal?
          if (prevEvents) {
            if (prevEvents.length === result.midiEvents.length) {
              if (prevEvents.every((ev, i) =>
                result.midiEvents[i].receivedTime === ev.receivedTime
                && result.midiEvents[i].data[0] === ev.data[0]
                && result.midiEvents[i].data[1] === ev.data[1]
                && result.midiEvents[i].data[2] === ev.data[2]
              )) {
                return result.midiEvents
              }
            }
          }

          $.midiEvents = $.midiEvents.set(turn, result.midiEvents)

          return result.midiEvents
        } else {
          const { error, sandboxCode } = result
          console.warn(error)
          $.sandboxCode = sandboxCode || ''
          $.error = error
        }
      }
    })
  },

  function effects({ $, fx }) {
    fx.once(({ kind, value }) => {
      if (kind === 'pattern') {
        $.originalValue = value
      }
    })

    fx(({ value, fallbackTitle }) => {
      $.title = getTitle(value) || fallbackTitle
    })

    fx(({ value }) => {
      $.checksum = checksum(value)
    })

    if ($.kind === 'sound') {
      services.fx(({ waveplot, preview }) => {
        $.waveplot = waveplot
        $.preview = preview
      })

      fx(async ({ id, waveplot, noDraw, didDisplay }) => {
        if (didDisplay && !noDraw && !$.canvas) {
          const { canvas } = await waveplot.create(id)
          $.canvas = canvas
        }
      })

      fx(({ value }) => {
        const nextSliders = services.$.getSliders(value)
        const prevSliders = $.sliders

        if (!areSlidersCompatible(prevSliders, nextSliders)) {
          $.sliders = new Map([...nextSliders].map(([id, slider]) => [id, Slider(slider)]))
        } else {
          for (const [id, slider] of nextSliders) {
            const prevSlider = prevSliders.get(id)!
            prevSlider.$.value = slider.value
            prevSlider.$.source = slider.source!
            prevSlider.$.sourceIndex = slider.sourceIndex!
          }
        }
      })

      fx(({ value, error }) => {
        if (!error) {
          $.compiledValue = value
        }
      })

      fx.raf(({ didDisplay, canvas: _, value: __ }) => {
        if (didDisplay) {
          $.draw()
        }
      })
    }
    else if ($.kind === 'pattern') {
      const off = fx(({ didDisplay, value: _ }) => {
        if (didDisplay) {
          off()
          $.compilePattern(0)
        }
      })

      fx(({ midiEvents }) => {
        const events = [...midiEvents.values()]
          .flat()
          .filter(x => MidiOps.has(x.data[0]))

        let notes: number[]

        if (!events.length) {
          notes = [66]
        } else {
          notes = events.map(x => x.data[1])
        }

        // First, sort the notes in ascending order
        notes.sort((a, b) => a - b);

        // Determine the minimum and maximum notes in the range
        let minNote = notes[0];
        let maxNote = notes[notes.length - 1];

        // Determine the lower and upper bounds of the quantized range
        minNote = Math.floor((minNote - 3) / 6) * 6;
        maxNote = Math.ceil((maxNote + 7) / 6) * 6;

        // If the range is less than 3 half-octaves, expand it in both directions
        // such that the included notes are as centered as possible within the range
        if (maxNote - minNote < 17) {
          maxNote += 6
        }

        if (maxNote - minNote < 17) {
          minNote -= 6
        }

        const isExact = ((maxNote - minNote) % 12) === 0
        const isExactStart = (minNote % 12) === 0

        // console.log(minNote, maxNote)
        if (!isExact && !isExactStart) minNote -= 1
        if (!isExact && isExactStart) maxNote -= 1
        if (isExact && !isExactStart) {
          minNote -= 1
          maxNote -= 1
        }
        // maxNote += (isExact ? 0 : -1)

        // if (!isExactStart) maxNote += 2

        if (!$.midiRange || $.midiRange[0] !== minNote || $.midiRange[1] !== maxNote) {
          $.midiRange = [minNote, maxNote]
        }
      })
    }
  }
)
