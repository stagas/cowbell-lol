import { cheapRandomId, pick } from 'everyday-utils'
import { Scalar } from 'geometrik'
import { queue, reactive } from 'minimal-view'
import { app } from './app'
import { Audio, AudioState } from './audio'
import { PlayerView } from './player-view'
import { markerForSlider, fixed } from './slider'
import { add, del, derive, findEqual, get } from './util/list'
import { spacer } from './util/storage'

const { clamp } = Scalar

export const Player = reactive('player',
  class props {
    id?: string = cheapRandomId()

    audio!: Audio
    state?: AudioState = 'init'

    sound!: string
    pattern!: number
    patterns!: string[]

    vol: number = 0.5

    view?: PlayerView
  },
  class local {
    preview = false
  },
  function actions({ $, fns, fn }) {
    return fns(new class actions {
      derive = () =>
        Object.assign(
          pick($, ['audio', 'sound', 'pattern', 'vol']),
          { patterns: [...$.patterns] }
        )

      start = () => {
        if ($.state === 'running') return

        $.state = 'running'

        $.audio.$.start()
      }

      stop = () => {
        if ($.state === 'suspended') return

        $.state = 'suspended'

        const shouldStop = app.players.every((player) => player.$.state !== 'running')

        if (shouldStop) {
          $.audio.$.stop()
        }
      }

      toggle = () => {
        if ($.state === 'running') {
          this.stop()
        } else {
          this.start()
        }
      }

      startPreview = () => {
        $.preview = true
      }

      stopPreview = queue.debounce(3000)(() => {
        $.preview = false
      })

      onBufferValue = (newBufferValue: string, kind: 'sound' | 'pattern') => {
        let bufferId

        const kinds = kind === 'sound' ? app.sounds : app.patterns

        if (kind === 'sound') {
          bufferId = $.sound
        } else if (kind === 'pattern') {
          bufferId = $.patterns[app.selected.pattern!]
        }
        if (!bufferId) return

        const buffer = get(kinds, bufferId)
        if (!buffer) return

        const editor = buffer.$.editor

        const [ctor, newBufferData] = derive(kinds as any, bufferId, { value: newBufferValue } as any)

        const equalItem = findEqual(kinds as any, bufferId, newBufferData as any)

        if (!buffer.$.isDraft) {
          const newBuffer = ctor(newBufferData)
          newBuffer.$.originalValue = buffer.$.value

          if (editor) {
            newBuffer.$.snapshot = editor.editor.getSnapshotJson(true)
          }
          newBuffer.$.parentId = bufferId

          const index = kinds.indexOf(buffer)
          const newKinds = add(kinds, newBuffer, index + 1)

          if (kind === 'sound') {
            spacer.set(newBuffer.$.id!, spacer.get(bufferId, [0, 0.35]))
            app.sounds = newKinds as any
            $.sound = newBuffer.$.id!
          } else {
            app.patterns = newKinds as any
            $.patterns[app.selected.pattern!] = newBuffer.$.id!
            $.patterns = [...$.patterns]
          }
        } else {
          // @ts-ignore
          if (equalItem && !equalItem.$.isDraft) {
            if (editor) {
              const snapshot = editor.editor.getSnapshotJson(true)
              // @ts-ignore
              equalItem.$.snapshot = snapshot
            }

            if (kind === 'sound') {
              app.sounds = del(app.sounds, buffer)
              $.sound = equalItem.$.id!
            } else {
              app.patterns = del(app.patterns, buffer)
              $.patterns[app.selected.pattern!] = equalItem.$.id!
              $.patterns = [...$.patterns]
            }
          } else {
            return true
          }
        }
      }

      onPatternValue = (newBufferValue: string) => {
        return this.onBufferValue(newBufferValue, 'pattern')
      }

      onSoundValue = (newBufferValue: string, noMarkers?: boolean) => {
        if (!noMarkers) {
          const bufferId = $.sound

          const buffer = get(app.sounds, bufferId)
          if (!buffer) return

          const editor = buffer.$.editor

          if (editor) {
            queueMicrotask(() => {
              const markers = [...buffer.$.sliders.values()].map(markerForSlider)
              editor.setMarkers(markers)
            })
          }
        }
        return this.onBufferValue(newBufferValue, 'sound')
      }

      onSliderNormal = (sliderId: string, normal: number) => {

        const bufferId = $.sound

        const buffer = get(app.sounds, bufferId)
        if (!buffer) return

        const slider = buffer.$.sliders.get(sliderId)
        if (!slider) return

        const source = slider.$.source!
        const sourceIndex = slider.$.sourceIndex!

        const { min, max, scale } = slider.$
        let sliderValue = fixed(normal * scale! + min)
        sliderValue = fixed(clamp(min, max, fixed(sliderValue)))

        const end = sourceIndex + source.arg.length
        const start = end - source.default.length

        const nextDefault = `${sliderValue}`
        if (nextDefault === source.default) return

        const before = buffer.$.value.slice(0, start)
        const after = buffer.$.value.slice(end)
        const newBufferValue = `${before}${sliderValue}${after}`

        if (this.onSoundValue(newBufferValue, true)) {
          const editor = buffer.$.editor

          const diff = nextDefault.length - source.default.length

          source.arg = source.arg.slice(0, -source.default.length) + `${sliderValue}`
          source.default = nextDefault

          slider.$.normal = normal

          const sliders = buffer.$.sliders
          sliders.forEach((other) => {
            if (other.$.id === sliderId) return
            if (other.$.sourceIndex! > start) {
              other.$.sourceIndex! += diff
            }
          })

          const markers = [...sliders.values()].map(markerForSlider)

          if (editor) {
            editor.replaceChunk({
              start,
              end,
              text: nextDefault,
              code: buffer.$.value,
              markers
            })
            buffer.$.value = newBufferValue
          } else {
            buffer.$.value = newBufferValue
          }

        }
      }
    })
  },
  function effects({ $, fx, deps, refs }) {

  }
)
export type Player = typeof Player.State
