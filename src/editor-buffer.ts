import { CanvyElement } from 'canvy'
import { cheapRandomId, pick } from 'everyday-utils'
import { queue, reactive } from 'minimal-view'
import { Audio } from './audio'
import { compilePattern } from './pattern'
import { Preview } from './preview-service'
import { Slider } from './slider'
import { Sliders } from './types'
import { areSlidersCompatible } from './util/args'
import { getTitle } from './util/parse'
import { randomName } from './util/random-name'
import { Waveplot } from './waveplot'

export type EditorBuffer = typeof EditorBuffer.State
export const EditorBuffer = reactive('editor-buffer',
  class props {
    audio!: Audio
    kind!: 'sound' | 'pattern'
    id?= cheapRandomId()

    value!: string

    parentId?: string

    createdAt?: number = Date.now()
    isDraft?: boolean = true
    isNew?: boolean = true
    isIntent?: boolean = false
    didPaint?: boolean = false
    fallbackTitle?: string = randomName()

    noDraw?= false
  },

  class local {
    title?: string

    compiledValue?: string

    originalValue?: string

    snapshot?: any

    sliders: Sliders = new Map()

    editor?: CanvyElement | null | undefined
    waveplot?: Waveplot
    preview?: Preview
    canvas?: HTMLCanvasElement
    canvases: Set<string> = new Set()

    midiEvents?: WebMidi.MIDIMessageEvent[]
    numberOfBars?: number

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
            'audio',
            'kind',
            'midiEvents',
            'numberOfBars',
          ]), props)] as const

      draw = fn(({ id, waveplot, preview, canvas: _, canvases, noDraw }) => queue.raf(async () => {
        if (noDraw) return

        if (!$.didPaint && $.parentId) {
          waveplot.copy($.parentId, id)
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

    if ($.kind === 'sound') {
      fx(({ audio }) =>
        audio.fx(({ waveplot, preview }) => {
          $.waveplot = waveplot
          $.preview = preview
        })
      )

      fx(async ({ id, waveplot, noDraw }) => {
        if (!noDraw && !$.canvas) {
          const { canvas } = await waveplot.create(id)
          $.canvas = canvas
          return fx.once(({ canvas: _ }) => {
            $.draw()
          })
        }
      })

      fx(({ audio, value }) => {
        const nextSliders = audio.$.getSliders(value)
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

      fx(({ value }) => {
        $.draw()
      })
    }
    else if ($.kind === 'pattern') {
      fx(async ({ value }) => {
        const result = await compilePattern(
          value,
          $.numberOfBars || 1
        )

        if (result.success) {
          $.midiEvents = result.midiEvents
          $.numberOfBars = result.numberOfBars
          $.error = false
        } else {
          const { error } = result
          console.warn(error)
          $.error = error
        }
      })

    }
  }
)
