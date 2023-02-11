import { queue, reactive } from 'minimal-view'
import { demo } from './demo-code'
import { EditorBuffer } from './editor-buffer'
import { cachedProjects } from './projects'
import { checksumId } from './util/checksum-id'
import { storage } from './util/storage'

export function toBuffer(kind: 'sound' | 'pattern') {
  return (b: [0 | 1, string]) => {
    const checksum = b[1]
    const value = localStorage[checksum]
    const isDraft = !!b[0]
    return EditorBuffer({
      kind,
      value,
      isDraft,
      checksum,
    })
  }
}

function toStorage(value: string) {
  const id = checksumId(value)
  localStorage[id] = value
  return [0, id] as [0 | 1, string]
}

export const Library = reactive('library',
  class props { },

  class local {
    sounds: EditorBuffer[] = storage.sounds.get([
      demo.kick.sound,
      demo.snare.sound,
      demo.bass.sound,
    ].map(toStorage)).map(toBuffer('sound'))

    patterns: EditorBuffer[] = storage.patterns.get([
      ...demo.kick.patterns,
      ...demo.snare.patterns,
      ...demo.bass.patterns,
    ].map(toStorage)).map(toBuffer('pattern'))
  },

  function actions({ $, fn, fns }) {
    const last = {
      sounds: [] as [0 | 1, string][],
      patterns: [] as [0 | 1, string][]
    }

    const saver = (kind: 'sounds' | 'patterns') => () => {
      const next = $[kind].map((b) => b.$.toJSON())

      if (last[kind].join() === next.join()) return

      const nextIds = next.map(([, x]) => x)

      last[kind].forEach(([, x]) => {
        if (!nextIds.includes(x)) {
          delete localStorage[x]
        }
      })

      console.time('save ' + kind)
      storage[kind].set(last[kind] = next)
      console.timeEnd('save ' + kind)
      console.log('saved', kind, next.length)
    }

    return fns(new class actions {
      saveSounds = saver('sounds')
      savePatterns = saver('patterns')

      autoSaveSounds = queue.debounce(1000)(this.saveSounds)
      autoSavePatterns = queue.debounce(1000)(this.savePatterns)

      toJSON = fn(({ sounds, patterns }) => () => {

        const bufferToJson = (buffer: EditorBuffer) => [
          buffer.$.checksum!,
          buffer.$.value
        ] as const

        return {
          sounds: Object.fromEntries(sounds.map(bufferToJson)),
          patterns: Object.fromEntries(patterns.map(bufferToJson)),
          projects: [...cachedProjects.values()].map((project) => ({
            players: project.$.players.map((player) => ({
              vol: player.$.vol,
              sound: player.$.soundBuffer!.$.checksum!,
              patterns: player.$.patternBuffers!.map((p) => p.$.checksum!)
            })
            )
          }))
        }
      })
    })
  },
  function effects({ $, fx }) {
    fx(({ sounds }) => {
      $.autoSaveSounds()
    })

    fx(({ patterns }) => {
      $.autoSavePatterns()
    })
  }
)

export type Library = typeof Library.State

export const library = Library({})
