import { cheapRandomId, checksum, pick, sortCompare } from 'everyday-utils'
import { reactive } from 'minimal-view'
import { compressUrlSafe, decompressUrlSafe } from 'urlsafe-lzma'
import { DELIMITERS, PROJECT_KINDS } from './app'
import { Audio, AudioPlayer } from './audio'
import { EditorBuffer } from './editor-buffer'
import { Player } from './player'
import { services } from './services'
import { findEqual } from './util/list'
import { randomName, emoji } from './util/random-name'
import { unique } from './util/unique'
import * as db from './db'
import { Library } from './library'
import { cachedProjects } from './project-view'
import { demo } from './demo-code'

export function getNewDraftProjectId() {
  return `${randomName(emoji)},${new Date().toISOString()},1`
}

export type ProjectJson = {
  checksum: number,
  isDraft: boolean,
  bpm: number,
  date: string
  title: string
  author: string
  players: Pick<Player['$'], 'vol' | 'sound' | 'patterns'>[],
  sounds: Pick<EditorBuffer['$'], 'id' | 'value' | 'fallbackTitle'>[],
  patterns: Pick<EditorBuffer['$'], 'id' | 'value' | 'fallbackTitle'>[]
}

const runningProjects: any[] = []

export const Project = reactive('project',
  class props {
    id = getNewDraftProjectId()
    isDraft?: boolean = true
    short?: string = 'untitled'
    date?: string = new Date().toISOString()
    title?: string = 'Untitled'
    author?: string = 'Guest'
    bpm?: number = 120

    audio?: Audio
  },
  class local {
    audioPlayer = AudioPlayer({})
    players: Player[] = []
    library?: Library
  },
  function actions({ $, fx, fn, fns }) {
    return fns(new class actions {
      // Audio
      start = fn(({ audioPlayer, players }) => async (resetTime = false) => {
        await this.load()

        const audio = services.$.audio!

        if (!runningProjects.includes($)) {
          resetTime = true

          runningProjects.push($)

          $.audio = audio

          if (runningProjects.length > 1) {
            const oldestProject = runningProjects.shift()!
            oldestProject.$.stop()
            oldestProject.$.audio = void 0 as any
          }
        }

        let count = players.length

        await new Promise<void>((resolve) => {
          players.forEach((player) => {
            const off = player.fx(({ compileState }) => {
              if (compileState === 'compiled') {
                off()
                --count || resolve()
              }
            })
          })
        })

        audio.$.bpm = $.bpm!

        const shouldStartAll = players.every((player) => player.$.state !== 'running')

        if (shouldStartAll) {
          await Promise.all(
            players.map((player) =>
              player.$.start(resetTime)
            )
          )
        }

        // else {
        await audioPlayer.$.start(resetTime)
        // }
      })

      stop = fn(({ audioPlayer, players }) => (resetTime = true) => {
        audioPlayer.$.stop(resetTime)

        players.forEach((player) => {
          player.$.stop()
        })
      })

      toggle = fn(({ audioPlayer }) => (resetTime = false) => {
        if (audioPlayer.$.state === 'running') {
          this.stop(false)
        } else {
          this.start(resetTime)
        }
      })

      // Storage/JSON

      load = () => new Promise<void>((resolve) => {
        if ($.players.length) return resolve()

        const id = $.id

        fx.once(({ library: _ }) => {
          let json: ProjectJson

          try {
            json = JSON.parse(localStorage[id])
            if (!json.players.length) {
              throw new Error('Empty project: ' + id)
            }
          } catch (error) {
            console.warn('Error loading: ' + id)
            console.warn(error)

            json = {
              checksum: 1,
              isDraft: true,
              bpm: 120,
              date: new Date().toISOString(),
              title: 'Untitled',
              author: 'Guest',
              sounds: [
                { id: 'sound-kick', value: demo.kick.sound },
                { id: 'sound-snare', value: demo.snare.sound },
                { id: 'sound-bass', value: demo.bass.sound },
              ],
              patterns: [
                { id: 'pattern-kick-0', value: demo.kick.patterns[0] },
                { id: 'pattern-kick-1', value: demo.kick.patterns[1] },

                { id: 'pattern-snare-0', value: demo.snare.patterns[0] },
                { id: 'pattern-snare-1', value: demo.snare.patterns[1] },

                { id: 'pattern-bass-0', value: demo.bass.patterns[0] },
              ],
              players: [
                { vol: 0.45, sound: 'sound-kick', patterns: ['pattern-kick-0', 'pattern-kick-0', 'pattern-kick-0', 'pattern-kick-1'] },

                { vol: 0.3, sound: 'sound-snare', patterns: ['pattern-snare-0', 'pattern-snare-0', 'pattern-snare-0', 'pattern-snare-1'] },

                { vol: 0.52, sound: 'sound-bass', patterns: ['pattern-bass-0'] },
              ],
            }
          }

          this.fromProjectJSON(id, json)

          const off = fx(({ players }) => {
            if (players.length) {
              off()
              resolve()
            }
          })
        })
      })

      publishCurrent = () => {
        this.publish(localStorage[$.id])
      }

      // publish
      publish = (serialized: string) => {
        const hash = this.toURL(serialized)
        if (hash != null) {
          db.createShort($.id, hash).then((short) => {
            prompt(
              'Here is your short url:\n(copy it and store it, click Ok when you\'re done)',
              `https://play.${location.hostname}/v2/${short.split(DELIMITERS.SHORT_ID)[3]}`
            )
          })
        }
      }

      toURL = (
        serialized: string,
        isFromUrl?: boolean
      ) => {
        const url = new URL(location.href)

        const [icon, date, , checksum] = $.id.split(DELIMITERS.SAVE_ID)

        let hash: string | void

        if (!isFromUrl) {
          if (serialized) {
            const compressed = compressUrlSafe(
              serialized, { mode: 9, enableEndMark: false }
            )
            hash = `s=${[icon, date, checksum, compressed].join(DELIMITERS.SAVE_ID)}`
            url.hash = hash
            console.log('hash length:', hash.length)
          } else {
            // unreachable?
            url.hash = ''
          }

          history.pushState({}, '', url)
        }

        // TODO: change favicon, change save button background
        document.title = `${icon} - ${new Date(date).toLocaleString()}`

        return hash
      }

      fromURL = (url: URL | Location, projects: string[]): {
        success: true, projects: string[]
      } | { success: false, error?: Error } => {
        try {
          let hash = url.hash
          if (!hash.startsWith('#')) hash = '#' + hash

          if (hash.startsWith('#s=')) {
            hash = decodeURI(hash).split('#s=')[1] ?? ''
            if (!hash.length) return { success: false }

            const [icon, date, checksum, compressed] = hash.split(DELIMITERS.SAVE_ID)

            const equalItem = projects.find((id) =>
              id.split(',').at(-1) === checksum
            )

            if (equalItem) {
              console.log('found project from url in our own projects: ' + equalItem)
              this.fromProjectJSON(equalItem, JSON.parse(localStorage[equalItem]))
              return { success: true, projects }
            }

            const id = [icon, date, '2', checksum].join(DELIMITERS.SAVE_ID)
            const serialized = decompressUrlSafe(compressed)

            localStorage[id] = serialized

            const json = JSON.parse(serialized)

            console.log('parsed url json:', json)

            projects = [...projects, id]
            this.fromProjectJSON(id, json)
            return { success: true, projects }
          } else if (hash.startsWith('#p=')) {
            const id = decodeURI(hash).split('#p=')[1] ?? ''
            if (!id.length) return { success: false }
            this.fromProjectJSON(id, JSON.parse(localStorage[id]))
            return { success: true, projects }
          } else {
            return { success: false }
          }
        } catch (error) {
          console.warn(error)
          return { success: false, error: error as Error }
        }
      }

      fromProjectJSON = fn(({ players, library }) => (id: string, json: ProjectJson) => {
        const [icon, date, kind] = id.split(DELIMITERS.SAVE_ID)

        $.id = id
        $.bpm = json.bpm
        $.date = json.date || date
        $.title = json.title || icon
        $.author = json.author || services.$.username || 'unknown'

        $.isDraft = kind === PROJECT_KINDS.DRAFT
        // denormalize ids by making them all unique

        cachedProjects.set(id, $.self as any)

        const idsMap = new Map<string, string>()

        for (const sound of json.sounds) {
          const newId = cheapRandomId()
          idsMap.set(`sound-${sound.id}`, newId)
          sound.id = newId
        }
        for (const pattern of json.patterns) {
          const newId = cheapRandomId()
          idsMap.set(`pattern-${pattern.id}`, newId)
          pattern.id = newId
        }

        // let y = 0
        for (const player of json.players) {

          // TODO: disabled temporarily until we resolve memory overlap
          // issues in monolang
          // if (y < $.players.length) {
          //   // @ts-ignore
          //   player.id = $.players[y].$.id!
          //   y++
          // }

          player.sound = idsMap.get(`sound-${player.sound}`) ?? json.sounds[0].id!
          player.patterns = player.patterns.map((p) =>
            idsMap.get(`pattern-${p}`) ?? json.patterns[0].id!
          )
        }

        const newSounds: EditorBuffer[] = []

        // if the sound exists in our own collection, use that and
        // replace the id with our own sound id,
        // otherwise add the sound with `isImport=true`
        for (const sound of unique(json.sounds)) {
          // TODO: use checksum to determine equality
          const equalItem = findEqual(library.$.sounds, '-', sound as EditorBuffer['$'])
          if (equalItem) {
            for (const player of json.players) {
              if (player.sound === sound.id) {
                player.sound = equalItem.$.id!
              }
            }
          } else {
            delete sound.fallbackTitle
            newSounds.push(EditorBuffer({
              ...sound,
              kind: 'sound',
              isNew: false,
              isDraft: false,
              isIntent: true,
              isImport: true
            }))
          }
        }

        library.$.sounds = [...library.$.sounds, ...newSounds]

        const newPatterns: EditorBuffer[] = []

        // if the pattern exists in our own collection, use that and
        // replace the id with our own pattern id,
        // otherwise add the pattern with `isImport=true`
        for (const pattern of unique(json.patterns)) {
          const equalItem = findEqual(library.$.patterns, '-', pattern as EditorBuffer['$'])
          if (equalItem) {
            for (const player of json.players) {
              player.patterns = player.patterns
                .join(',')
                .replaceAll(pattern.id!, equalItem.$.id!)
                .split(',')
            }
          } else {
            delete pattern.fallbackTitle
            newPatterns.push(EditorBuffer({
              ...pattern,
              kind: 'pattern',
              isNew: false,
              isDraft: false,
              isIntent: true,
              isImport: true
            }))
          }
        }

        library.$.patterns = [...library.$.patterns, ...newPatterns]

        players?.forEach((player) => {
          player.dispose()
        })

        $.players = json.players.map((player) => Player({
          ...player,
          pattern: 0,
        }))
      })

      /**
       * Get a JSON representation of the project.
       */
      toProjectJSON = fn(({ players, library }) => (): ProjectJson => {
        const usedSounds = new Set(
          players.map((player) =>
            player.$.sound
          )
        )

        const usedPatterns = new Set(
          players.flatMap((player) =>
            player.$.patterns
          )
        )

        const soundsJson = library.$.sounds.filter((sound) => usedSounds.has(sound.$.id!)).map((sound) =>
          pick(sound.$, [
            'id',
            'value',
            'checksum',
            // 'fallbackTitle',
          ])
        )

        const patternsJson = library.$.patterns.filter((pattern) => usedPatterns.has(pattern.$.id!)).map((pattern) =>
          pick(pattern.$, [
            'id',
            'value',
            'checksum',
            // 'fallbackTitle',
          ])
        )

        const playersJson = $.players!.map((player) =>
          pick(player.$, [
            'vol',
            'sound',
            'patterns',
          ])
        )

        // Normalize ids by their value checksum so that the overall
        // project checksum computes the same for every same project.
        // By normalizing the ids on save and denormalizing/assigning unique
        // when loading, we avoid conflicts, and the checksum computes
        // the same.
        const idsMap = new Map<string, string>()

        for (const sound of soundsJson) {
          const newId = `${sound.checksum}`
          idsMap.set(`sound-${sound.id}`, newId)
          sound.id = newId
          delete sound.checksum
        }
        for (const pattern of patternsJson) {
          const newId = `${pattern.checksum}`
          idsMap.set(`pattern-${pattern.id}`, newId)
          pattern.id = newId
          delete pattern.checksum
        }

        // we sort buffers by their new checksum id so that it's consistent
        // because we might have used buffers we already have so they will
        // not be in the same order (as new buffers go to the bottom)
        soundsJson.sort((a, b) => sortCompare(a.id!, b.id!))

        patternsJson.sort((a, b) => sortCompare(a.id!, b.id!))

        let chk = [$.title, $.author, $.bpm].join('')

        for (const player of playersJson) {
          player.sound = idsMap.get(`sound-${player.sound}`)!
          player.patterns = player.patterns.map((p) =>
            idsMap.get(`pattern-${p}`)!
          )
          chk += [player.vol, player.sound, ...player.patterns].join('')
        }

        return {
          checksum: checksum(chk),
          isDraft: $.isDraft!,
          bpm: $.bpm!,
          date: $.date!,
          title: $.title!,
          author: $.author!,
          players: playersJson,
          sounds: soundsJson,
          patterns: patternsJson,
        }
      })
    })
  },
  function effects({ $, fx }) {
    fx(() =>
      services.fx(({ library }) => {
        $.library = library
      })
    )

    fx(({ audio, audioPlayer }) => {
      audioPlayer.$.audio = audio
    })

    fx(({ audio, bpm }) => {
      audio.$.bpm = bpm
    })

    fx(({ audio, audioPlayer, players }) => {
      players.forEach((player) => {
        player.$.isPreview = true
        player.$.audio = audio
        player.$.audioPlayer = audioPlayer
      })
      return () => {
        players.forEach((player) => {
          player.$.audio = void 0 as any
        })
      }
    })
  }
)
export type Project = typeof Project.State
