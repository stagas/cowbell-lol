import { cheapRandomId, checksum, pick } from 'everyday-utils'
import { chain, reactive } from 'minimal-view'
import { Audio, AudioState } from './audio'
import { EditorBuffer } from './editor-buffer'
import { Player } from './player'
import { services } from './services'
import { getByChecksum } from './util/list'
import { Library, mapToBuffer } from './library'
import { demo } from './demo-code'
import { checksumId } from './util/checksum-id'
import { schemas } from './schemas'
import { AudioPlayer } from './audio-player'
import { noneOf, oneOf } from './util/one-of'
import { filterState } from './util/filter-state'
import { storage } from './util/storage'

export type ProjectJson = {
  checksum: string,
  isDraft: boolean,
  bpm: number,
  date: string
  title: string
  author: string
  players: {
    vol: number,
    sound: string,
    patterns: string[]
  }[],
}

export const projects = new Map<string, Project>()

export const Project = reactive('project',
  class props {
    id?= cheapRandomId()
    checksum?: string
    bpm?: number = 120
    title?: string = 'Untitled'
    author?: string = 'guest'
    date?: string = new Date().toISOString()
    isDraft?: boolean = true
    remoteProject?: schemas.ProjectResponse
  },
  class local {
    state: AudioState = 'init'
    audio?: Audio | null
    audioPlayer = AudioPlayer({})
    library?: Library
    players: Player[] = []
  },
  function actions({ $, fx, fn, fns }) {
    let projectLoadPromise: Promise<void>

    return fns(new class actions {
      // Audio
      start = fn(({ audioPlayer }) => async (resetTime = false) => {
        if (oneOf($.state, 'running', 'preparing')) {
          return
        }

        $.state = 'preparing'

        $.audio = services.$.audio!

        filterState(projects, 'running').forEach((p) => {
          p.$.stop()
        })

        await this.load()

        const shouldStartAll = $.players.every((player) => noneOf(player.$.state, 'preparing', 'running'))

        if (shouldStartAll) {
          await Promise.all(
            $.players.map((player) =>
              new Promise<void>((resolve) => player.fx.once.task(async ({ audioPlayer: _ }) => {
                await player.$.start(resetTime, false)
                resolve()
              }))
            )
          )
        }

        await audioPlayer.$.start(resetTime)
      })

      stop = fn(({ audioPlayer, players }) => (resetTime = true) => {
        audioPlayer.$.stop(resetTime)

        players.forEach((player) => {
          player.$.stop(resetTime)
        })

        $.state = 'suspended'
        $.audio = null
      })

      toggle = fn(({ audioPlayer }) => (resetTime = false) => {
        if (audioPlayer.$.state === 'running') {
          this.stop(false)
        } else {
          this.start(resetTime)
        }
      })

      // Storage/JSON

      publish = async () => {
        const payload: schemas.PostPublishRequest = {
          bpm: $.bpm!,
          title: $.title!,
          mixer: $.players.map((player) => ({
            vol: player.$.vol
          })),
          tracks: $.players.map((player) => ({
            sound: player.$.soundBuffer!.$.checksum!,
            patterns: player.$.patternBuffers!.map((p) => p.$.checksum!)
          })),
          buffers: $.players.flatMap((player) => [...new Set([
            player.$.soundBuffer!.$.value,
            ...player.$.patternBuffers!.map((p) => p.$.value)
          ])])
        }

        console.log(payload)

        const res = await services.$.apiRequest('/publish', {
          method: 'POST',
          body: JSON.stringify(payload)
        })

        if (!res.ok) {
          console.error('publish: Something went wrong')
          console.error(res)
          return
        }

        const data: schemas.PublishResponse = await res.json()

        $.isDraft = false
        $.title = data.project.item.title
        $.author = data.project.item.author
        this.save()
      }

      save = () => {
        console.time('saved')
        const json = this.toJSON()
        localStorage[json.checksum] = JSON.stringify(json)
        console.timeEnd('saved')
      }

      load = () => {
        if (projectLoadPromise) {
          return projectLoadPromise
        }

        projectLoadPromise = new Promise<void>((resolve) => {
          const checksum = $.checksum

          fx.once(({ library: _ }) => {
            let json: ProjectJson

            try {
              if (!checksum) {
                throw new Error('No checksum')
              }
              json = JSON.parse(localStorage[checksum])
              if (!json.players.length) {
                throw new Error('Empty project: ' + checksum)
              }
              this.fromJSON(json)
            } catch (error) {
              if (checksum) {
                console.warn('Error loading: ' + checksum)
              }
              console.warn(error)

              if ($.remoteProject) {
                this.loadRemote($.remoteProject)
              } else {
                json = {
                  isDraft: true,
                  checksum: '1',
                  bpm: 120,
                  date: new Date().toISOString(),
                  title: 'Untitled',
                  author: 'guest',
                  players: [
                    {
                      vol: 0.45,
                      sound: checksumId(demo.kick.sound),
                      patterns: [demo.kick.patterns[0], demo.kick.patterns[0], demo.kick.patterns[0], demo.kick.patterns[1]].map(checksumId)
                    },

                    {
                      vol: 0.3,
                      sound: checksumId(demo.snare.sound),
                      patterns: [demo.snare.patterns[0], demo.snare.patterns[0], demo.snare.patterns[0], demo.snare.patterns[1]].map(checksumId)
                    },

                    {
                      vol: 0.52,
                      sound: checksumId(demo.bass.sound),
                      patterns: [demo.bass.patterns[0]].map(checksumId)
                    },
                  ],
                }

                this.fromJSON(json)
              }
            }

            const off = fx(({ players }) => {
              if (players.length) {
                off()
                resolve()
              }
            })
          })
        })
        return projectLoadPromise
      }

      loadRemote = fn(({ library }) => async (p: schemas.ProjectResponse) => {
        // TODO: cache trackIds and only request new ones
        let endpoint = `/tracks?ids=${[...new Set(p.trackIds)]}`
        let res = await services.$.apiRequest(endpoint)
        if (!res.ok) {
          console.error(endpoint, res)
          return
        }

        const tracks: schemas.TrackResponse[] = await res.json()

        const bufferIds = [...new Set(tracks.flatMap((t) => [t.soundId, ...t.patternIds]))]

        endpoint = `/buffers?ids=${bufferIds}`
        res = await services.$.apiRequest(endpoint)
        if (!res.ok) {
          console.error(endpoint, res)
          return
        }

        const buffers: schemas.BufferResponse[] = await res.json()

        buffers.forEach((b) => {
          localStorage[b.id] = b.value
        })

        const newSounds: EditorBuffer[] = []
        const newPatterns: EditorBuffer[] = []

        const players: ProjectJson['players'] = (p.mixer as { vol: number }[]).map(({ vol }, i) => {
          const t: schemas.TrackResponse = tracks.find((t) => t.id === p.trackIds[i])!

          // const getChecksumId = (id: number): string => buffers.find((b) => b.id === id)!.checksum

          // const sound: string = getChecksumId(t.soundId)
          // const patterns: string[] = t.patternIds.map(getChecksumId)

          // console.log(sound, patterns)

          const soundBuffer = getByChecksum(library.$.sounds, t.soundId)

          if (!soundBuffer) {
            newSounds.push(mapToBuffer('sound')([0, t.soundId]))
          }

          t.patternIds.forEach((patternId) => {
            const patternBuffer = getByChecksum(library.$.patterns, patternId)
            if (!patternBuffer) {
              newPatterns.push(mapToBuffer('pattern')([0, patternId]))
            }
          })

          return {
            vol,
            sound: t.soundId,
            patterns: t.patternIds,
          }
        })

        library.$.sounds = [...library.$.sounds, ...newSounds]
        library.$.patterns = [...library.$.patterns, ...newPatterns]

        const json: ProjectJson = {
          isDraft: false,
          checksum: p.id,
          bpm: p.bpm,
          title: p.title,
          author: p.author,
          date: p.updatedAt,
          players,
        }

        localStorage[p.id] = JSON.stringify(json)

        this.fromJSON(json)
      })

      fromJSON = fn(({ players, library }) => (json: ProjectJson) => {
        $.checksum = json.checksum
        $.bpm = json.bpm
        $.date = json.date
        $.title = json.title
        $.author = json.author
        $.isDraft = json.isDraft

        json.players.forEach((player) => {
          player.sound = getByChecksum(library.$.sounds, player.sound)!.$.id!

          player.patterns.forEach((pattern, i) => {
            player.patterns[i] = getByChecksum(library.$.patterns, pattern)!.$.id!
          })
        })

        players?.forEach((player) => {
          player.dispose()
        })

        $.players = json.players.map((player) => Player({
          ...player,
          pattern: 0,
          project: $.self as Project,
        }))
      })

      /**
       * Get a JSON representation of the project.
       */
      toJSON = fn(({ players }) => (): ProjectJson => ({
        ...pick($ as Required<typeof $>, ['checksum', 'date', 'bpm', 'title', 'author', 'isDraft']),
        players: players.map((player) => ({
          vol: player.$.vol,
          sound: player.$.soundBuffer!.$.checksum!,
          patterns: player.$.patternBuffers!.map((p) => p.$.checksum!)
        }))
      }))

    })
  },
  function effects({ $, fx }) {
    fx(({ id }) => {
      projects.set(id, $.self)
      return () => {
        projects.delete(id)
      }
    })

    fx(() =>
      services.fx(({ library }) => {
        $.library = library
      })
    )

    fx(({ audioPlayer }) => {
      audioPlayer.$.project = $.self
    })

    fx.once(({ checksum, audioPlayer }) => {
      audioPlayer.$.vol = storage.vols.get(checksum, 1)
      fx(({ checksum }, prev) => {
        if (prev.checksum) {
          storage.vols.delete(checksum)
        }
        storage.vols.set(checksum, audioPlayer.$.vol!)
        return audioPlayer.fx.raf(({ vol }) => {
          storage.vols.set(checksum, vol)
        })
      })
    })

    fx(({ audio, audioPlayer }) => {
      audioPlayer.$.audio = audio
      return audioPlayer.fx(({ state }) => {
        if (state === 'running') {
          $.state = 'running'
        }
      })
    })

    // fx(({ audio, bpm }) => {
    //   audio.$.bpm = bpm
    // })

    // fx(({ players }) =>
    //   chain(
    //     players.map((player) =>
    //       player.fx(({ state }) => {
    //         if (state === 'running' && !player.$.audio) {
    //           $.audioPlayer.$.audio = services.$.audio!
    //           player.$.audio = services.$.audio!
    //           player.$.audioPlayer = $.audioPlayer
    //         }
    //       })
    //     )
    //   )
    // )

    // fx(({ audio, audioPlayer, players }) => {
    //   players.forEach((player) => {
    //     // player.$.isPreview = true
    //     // player.$.audio = audio
    //     player.$.audioPlayer = audioPlayer
    //   })
    //   return () => {
    //     players.forEach((player) => {
    //       player.$.audio = void 0 as any
    //     })
    //   }
    // })

    fx(({ players }) =>
      chain(
        players.map((player) =>
          player.fx(({ soundBuffer, patternBuffers }) => chain(
            ...[soundBuffer, ...patternBuffers].map((b) => b.fx(({ checksum: _ }) => {

              const trackIds = players.map((p) =>
                checksumId([
                  p.$.soundBuffer?.$.checksum,
                  p.$.patternBuffers?.map((pat) => pat.$.checksum)
                ].join())
              )

              if (trackIds.every((c) => c != null)) {
                $.checksum = checksumId(trackIds.join())
              }
            }))
          ))
        )
      )
    )

    fx(({ checksum: _ }, prev) => {
      if (prev.checksum && !$.isDraft) {
        console.log(_, prev.checksum, $.title)
        $.isDraft = true
      }
    })
  }
)
export type Project = typeof Project.State
