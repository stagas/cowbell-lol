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

const checksumId = (value: string) => checksum(value).toString(36)

export function getNewDraftProjectId() {
  return `${randomName(emoji)},${new Date().toISOString()},1`
}

export type ProjectJson = {
  checksum: string,
  isDraft: boolean,
  bpm: number,
  date: string
  title: string
  author: string
  players: Pick<Player['$'], 'vol' | 'sound' | 'patterns'>[],
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

              ;[demo.kick.sound, demo.snare.sound, demo.bass.sound, ...demo.kick.patterns, ...demo.snare.patterns, ...demo.bass.patterns].forEach((value) => {
                localStorage[checksumId(value)] = value
              })

            json = {
              isDraft: true,
              checksum: '1',
              bpm: 120,
              date: new Date().toISOString(),
              title: 'Untitled',
              author: 'guest',
              // sounds: [
              //   { id: 'sound-kick', value: demo.kick.sound },
              //   { id: 'sound-snare', value: demo.snare.sound },
              //   { id: 'sound-bass', value: demo.bass.sound },
              // ],
              // patterns: [
              //   { id: 'pattern-kick-0', value: demo.kick.patterns[0] },
              //   { id: 'pattern-kick-1', value: demo.kick.patterns[1] },

              //   { id: 'pattern-snare-0', value: demo.snare.patterns[0] },
              //   { id: 'pattern-snare-1', value: demo.snare.patterns[1] },

              //   { id: 'pattern-bass-0', value: demo.bass.patterns[0] },
              // ],
              players: [
                {
                  vol: 0.45,
                  sound: checksumId(demo.kick.sound),
                  patterns: [demo.kick.patterns[0], demo.kick.patterns[0], demo.kick.patterns[0], demo.kick.patterns[1]].map(checksumId)
                },

                {
                  vol: 0.3,
                  sound: checksum(demo.snare.sound).toString(36),
                  patterns: [demo.snare.patterns[0], demo.snare.patterns[0], demo.snare.patterns[0], demo.snare.patterns[1]].map(checksumId)
                },

                {
                  vol: 0.52,
                  sound: checksum(demo.bass.sound).toString(36),
                  patterns: [demo.bass.patterns[0]].map(checksumId)
                },
              ],
            }
          }

          this.fromJSON(id, json)

          const off = fx(({ players }) => {
            if (players.length) {
              off()
              resolve()
            }
          })
        })
      })

      save = () => {
        console.time('project save')
        const json = this.toJSON()
        localStorage[$.id] = JSON.stringify(json)
        console.timeEnd('project save')
      }

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
              this.fromJSON(equalItem, JSON.parse(localStorage[equalItem]))
              return { success: true, projects }
            }

            const id = [icon, date, '2', checksum].join(DELIMITERS.SAVE_ID)
            const serialized = decompressUrlSafe(compressed)

            localStorage[id] = serialized

            const json = JSON.parse(serialized)

            console.log('parsed url json:', json)

            projects = [...projects, id]
            this.fromJSON(id, json)
            return { success: true, projects }
          } else if (hash.startsWith('#p=')) {
            const id = decodeURI(hash).split('#p=')[1] ?? ''
            if (!id.length) return { success: false }
            this.fromJSON(id, JSON.parse(localStorage[id]))
            return { success: true, projects }
          } else {
            return { success: false }
          }
        } catch (error) {
          console.warn(error)
          return { success: false, error: error as Error }
        }
      }

      fromJSON = fn(({ players, library }) => (id: string, json: ProjectJson) => {
        cachedProjects.set(id, $.self as any)

        $.id = id
        $.bpm = json.bpm
        $.date = json.date
        $.title = json.title
        $.author = json.author
        $.isDraft = json.isDraft

        const newSounds: EditorBuffer[] = []

        json.players.forEach((player) => {
          // need to get the ids of the sound/patterns somehow?
        })

        library.$.sounds = [...library.$.sounds, ...newSounds]

        const newPatterns: EditorBuffer[] = []

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
      toJSON = fn(({ players, library }) => (): ProjectJson => {

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
