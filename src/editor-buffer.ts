import { CanvyElement } from 'canvy'
import { cheapRandomId, pick } from 'everyday-utils'
import { queue, reactive } from 'minimal-view'
import { MidiOp } from 'webaudio-tools'
import { compilePattern } from './pattern-service'
import { Preview } from './preview-service'
import { services } from './services'
import { Slider } from './slider'
import { Sliders } from './types'
import { areSlidersCompatible, getCodeWithoutArgs } from './util/args'
import { checksumId } from './util/checksum-id'
import { areMidiEventsEqual } from './util/midi-events-equal'
import { getTitle } from './util/parse'
import { randomName } from './util/random-name'
import { Waveplot } from './waveplot'

const MidiOps = new Set(Object.values(MidiOp))

const cleanupErrorRegExp = /<\w+\d+>/gm

export type EditorBuffer = typeof EditorBuffer.State

export const EditorBuffer = reactive('editor-buffer',
  class props {
    kind!: 'sound' | 'pattern'
    id?= cheapRandomId()
    checksum?: string
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
    title?: string
    didDisplay = false
    didCompile = false
    didSave = false
    compiledValue?: string
    originalValue?: string
    snapshot?: any
    sliders: Sliders = new Map()
    editor?: CanvyElement | null | undefined
    waveplot?: Waveplot
    preview?: Preview
    canvas?: HTMLCanvasElement
    canvases: Set<string> = new Set()
    inputChannels = 0
    outputChannels = 1
    midiEvents = new Map<number, WebMidi.MIDIMessageEvent[]>()
    numberOfBars?: number
    midiRange?: [number, number]
    recompute = false
    turn = 0
    turns = 0
    sandboxCode?: string
    error?: Error | false = false
  },

  function actions({ $, fx, fns, fn }) {
    let lastSavedChecksum: string

    fx(({ checksum: _ }) => {
      $.didSave = false
    })

    return fns(new class actions {
      toJSON = () => {
        if (!$.didSave) {
          if (lastSavedChecksum && $.isDraft) {
            delete localStorage[lastSavedChecksum]
          }
          localStorage[lastSavedChecksum = $.checksum!] = $.value
          $.didSave = true
        }
        return [$.isDraft ? 1 : 0, $.checksum] as [0 | 1, string]
      }

      equals = (other: Partial<typeof $>) => {
        return $.value === other.value
      }

      derive =
        (props: Partial<typeof $>) =>
          [EditorBuffer, Object.assign(pick($, [
            'kind',
            'value',
            'compiledValue',
            'didCompile',
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
        if (!$.error) {
          $.compiledValue = $.value
        }

        this.copyCanvases()
      }))

      copyCanvases = fn(({ id, waveplot, canvas: _, canvases, noDraw }) => () => {
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

      compilePattern = async (turn: number): Promise<WebMidi.MIDIMessageEvent[] | undefined> => {
        const result = await compilePattern(
          $.value,
          $.numberOfBars || 1,
          turn
        )

        if (result.success) {
          $.compiledValue = $.value
          $.numberOfBars = result.numberOfBars
          $.error = false

          const prevEvents = $.midiEvents.get(turn)

          if (areMidiEventsEqual(prevEvents, result.midiEvents)) {
            return prevEvents
          }

          $.midiEvents.set(turn, result.midiEvents)
          $.turns++

          return result.midiEvents
        } else {
          const { error, sandboxCode } = result

          $.sandboxCode = sandboxCode || ''
          if (
            !$.error
            || `${$.error.stack}`.replace(cleanupErrorRegExp, '')
            !== `${error.stack}`.replace(cleanupErrorRegExp, '')
          ) {
            $.error = error

            if ($.value !== $.compiledValue && $.compiledValue) {
              const result = await compilePattern(
                $.compiledValue,
                $.numberOfBars || 1,
                turn
              )
              if (result.success) {
                $.midiEvents.set(turn, result.midiEvents)
                $.turns++
                return result.midiEvents
              } else {
                const { error: secondError } = result
                console.info(error.message, secondError.message)
              }
            }
          }
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
      $.checksum = checksumId(value)
    })

    fx(({ kind, isDraft }, prev) => {
      if (prev.isDraft && !isDraft) {
        $.didSave = false
        if (kind === 'sound') {
          services.$.library.$.autoSaveSounds()
        } else {
          services.$.library.$.autoSavePatterns()
        }
      }
    })

    fx(({ kind, checksum: _ }) => {
      if (kind === 'sound') {
        services.$.library.$.autoSaveSounds()
      } else {
        services.$.library.$.autoSavePatterns()
      }
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

      fx(({ value, error, didCompile }) => {
        // TODO: a not very good way to get the initial compiled value
        if (!didCompile && !error && value) {
          $.compiledValue = value
          $.didCompile = true
        }
      })

      fx(({ value }, prev) => {
        const prevCodeNoArgs = getCodeWithoutArgs(prev.value || '')
        const nextCodeNoArgs = getCodeWithoutArgs(value)

        const nextSliders = services.$.getSliders(value)
        const prevSliders = $.sliders

        if (prevCodeNoArgs !== nextCodeNoArgs || !areSlidersCompatible(prevSliders, nextSliders)) {
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

      fx(({ midiEvents, turns: _ }) => {
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

        if (!isExact && !isExactStart) minNote -= 1
        if (!isExact && isExactStart) maxNote -= 1
        if (isExact && !isExactStart) {
          minNote -= 1
          maxNote -= 1
        }

        minNote = Math.max(0, minNote)
        maxNote = Math.max(0, maxNote)

        if (!$.midiRange || $.midiRange[0] !== minNote || $.midiRange[1] !== maxNote) {
          $.midiRange = [minNote, maxNote]
        }
      })
    }
  }
)
