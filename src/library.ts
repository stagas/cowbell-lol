import { queue, reactive } from 'minimal-view'
import { demo } from './demo-code'
import { EditorBuffer } from './editor-buffer'
import { checksumId } from './util/checksum-id'
import { storage } from './util/storage'

export function mapToBuffer(kind: 'sound' | 'pattern') {
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

function mapToStorage(value: string) {
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
    ].map(mapToStorage)).map(mapToBuffer('sound'))

    patterns: EditorBuffer[] = storage.patterns.get([
      ...demo.kick.patterns,
      ...demo.snare.patterns,
      ...demo.bass.patterns,
    ].map(mapToStorage)).map(mapToBuffer('pattern'))
  },
  function actions({ $, fn, fns }) {
    const last = {
      sounds: [] as string[],
      patterns: [] as string[]
    }

    const saver = (kind: 'sounds' | 'patterns') => () => {
      const next = $[kind].map((b) => b.$.toJSON())

      const nextIds = next.map(([, x]) => x)

      last[kind].forEach((x) => {
        if (!nextIds.includes(x)) {
          delete localStorage[x]
        }
      })

      storage[kind].set(next)
    }

    return fns(new class actions {
      saveSounds = saver('sounds')
      savePatterns = saver('patterns')

      autoSaveSounds = queue.debounce(500)(this.saveSounds)
      autoSavePatterns = queue.debounce(500)(this.savePatterns)
    })
  },
  function effects({ $, fx }) {
    fx(({ sounds }) => {
      $.autoSaveSounds()
    })

    fx(({ patterns }) => {
      $.autoSavePatterns()
    })

    // fx(({ sounds, patterns }) => {
    //   const bufferToJson = (buffer: EditorBuffer) => [
    //     buffer.$.checksum!.toString(36),
    //     buffer.$.value
    //   ]

    //   setTimeout(() => {
    //     console.log({
    //       sounds: Object.fromEntries(sounds.map(bufferToJson)),
    //       patterns: Object.fromEntries(patterns.map(bufferToJson)),
    //       projects: [...cachedProjects.values()].map((project) => ({
    //         players: project.$.players.map((player) => ({
    //           vol: player.$.vol,
    //           sound: player.$.soundBuffer!.$.checksum!.toString(36),
    //           patterns: player.$.patternBuffers!.map((p) => p.$.checksum!.toString(36))
    //         })
    //         )
    //       }))
    //     })
    //   }, 1000)
    // })
  }
)

export type Library = typeof Library.State

export const library = Library({})
