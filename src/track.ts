import { cheapRandomId, pick } from 'everyday-utils'
import { reactive } from 'minimal-view'
import { app } from './app'
import { EditorBuffer } from './editor-buffer'
import { get } from './util/list'

export type Track = typeof Track.State
export const Track = reactive('track',
  class props {
    id?: string = cheapRandomId()
    sound!: string
    pattern!: string
    focus?: 'sound' | 'pattern'

    parentId?: string

    createdAt?: number = Date.now()
    isDraft?: boolean = true
    isIntent?: boolean = false
  },

  class local {
    buffers?: {
      sound: EditorBuffer | void
      pattern: EditorBuffer | void
    }
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      equals = (other: Partial<typeof $>) => {
        return (
          $.sound === other.sound
          && $.pattern === other.pattern
        )
      }

      derive =
        (props: Partial<typeof $>) =>
          [Track, Object.assign(pick($, [
            'sound',
            'pattern',
            'focus',
          ]), props)] as const
    })
  },

  function effects({ $, fx }) {
    fx(({ sound, pattern }) => {
      $.buffers = {
        sound: get(app.sounds, sound),
        pattern: get(app.patterns, pattern),
      }
    })
  }
)
