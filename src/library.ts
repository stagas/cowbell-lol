import { reactive } from 'minimal-view'
import { EditorBuffer } from './editor-buffer'
import { cachedProjects } from './project-view'

export const Library = reactive('library',
  class props { },
  class local {
    sounds: EditorBuffer[] = []
    patterns: EditorBuffer[] = []
  },
  function actions({ $, fn, fns }) {
    return fns(new class actions {
      // TODO: load library from storage
    })
  },
  function effects({ $, fx }) {
    fx(({ sounds, patterns }) => {
      const bufferToJson = (buffer: EditorBuffer) => [
        buffer.$.checksum!.toString(36),
        buffer.$.value
      ]

      setTimeout(() => {
        console.log({
          sounds: Object.fromEntries(sounds.map(bufferToJson)),
          patterns: Object.fromEntries(patterns.map(bufferToJson)),
          projects: [...cachedProjects.values()].map((project) => ({
            players: project.$.players.map((player) => ({
              vol: player.$.vol,
              sound: player.$.soundBuffer!.$.checksum!.toString(36),
              patterns: player.$.patternBuffers!.map((p) => p.$.checksum!.toString(36))
            })
            )
          }))
        })
      }, 1000)
    })
  }
)

export type Library = typeof Library.State

export const library = Library({})
