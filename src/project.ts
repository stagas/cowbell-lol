import { cheapRandomId, pick } from 'everyday-utils'
import { chain, queue, reactive } from 'minimal-view'
import { Audio, AudioState } from './audio'
import { EditorBuffer } from './editor-buffer'
import { Player, PlayerPage } from './player'
import { cachedProjects, services } from './services'
import { get, getByChecksum, getMany } from './util/list'
import { Library, toBuffer } from './library'
import { demo } from './demo-code'
import { checksumId } from './util/checksum-id'
import { schemas } from './schemas'
import { AudioPlayer } from './audio-player'
import { noneOf, oneOf } from './util/one-of'
import { filterState } from './util/filter-state'
import { storage } from './util/storage'
import { getDateTime } from './util/get-datetime'
import { slugify } from './util/slugify'
import { app } from './app'

export type ProjectJson = {
  checksum: string,
  isDraft: boolean,
  bpm: number,
  date: string
  title: string
  author: string
  players: {
    vol: number,
    sound?: string,
    patterns?: string[],
    pages?: PlayerPage[]
  }[],
  remixCount: number,
  originalRemixCount: number
  originalChecksum: string | false,
  originalAuthor: string | false,
}

export const projectsById = new Map<string, Project>()

export const relatedProjects = new Map<Project, Project[]>()

export const Project = reactive('project',
  class props {
    id?= cheapRandomId()
    checksum?: string
    bpm?: number
    title?: string = 'Untitled'
    author?: string = 'guest'
    date?: string = getDateTime()
    isDraft?: boolean = true
    isDeleted?: boolean = false
    remoteProject?: schemas.ProjectResponse
    remixCount?: number = 0
    originalRemixCount?: number = 0
    originalChecksum?: string | false = false
    originalAuthor?: string | false = false
  },
  class local {
    state: AudioState = 'init'
    firstChecksum?: string
    vols?: string
    startedAt: number = 0
    pathname?: string
    audio?: Audio | null
    audioPlayer = AudioPlayer({})
    library?: Library
    players: Player[] = []
  },
  function actions({ $, fx, fn, fns }) {
    let projectLoadPromise: Promise<void>
    let lastSavedJson: ProjectJson | undefined
    let resetStateTimeout: any
    return fns(new class actions {
      // Audio
      start = fn(({ audioPlayer }) => async (resetTime = false) => {
        if (oneOf($.state, 'running', 'preparing')) {
          return
        }

        $.state = 'preparing'

        clearTimeout(resetStateTimeout)
        resetStateTimeout = setTimeout(() => {
          if ($.state === 'preparing') {
            $.state = 'suspended'
          }
        }, 5000)

        $.audio = services.$.audio!

        filterState(cachedProjects, 'running').forEach((p) => {
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

      publish = fn(({ library }) => async () => {
        const payload: schemas.PostPublishRequest = {
          originalId: $.originalChecksum || undefined,
          bpm: $.bpm!,
          title: $.title!,
          mixer: $.players.map((player, y) => ({
            vol: player.$.vol,
            pages: player.$.pages!.map((_, x) =>
              x + $.players.slice(0, y).reduce((p, n) => p + (n.$.pages?.length || 1), 0)
            )
          })),
          tracks: $.players.flatMap((player) => player.$.pages!.map((page) => ({
            sound: get(library.$.sounds, page.sound)!.$.checksum!,
            patterns: getMany(library.$.patterns, page.patterns).map((p) => p!.$.checksum!)
          }))),
          buffers: $.players.flatMap((player) => [...new Set([
            ...player.$.pages!.flatMap((page) => [
              get(library.$.sounds, page.sound)!.$.value!,
              ...getMany(library.$.patterns, page.patterns).map((p) => p!.$.value!)
            ])
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
        $.firstChecksum = data.project.item.originalId || data.project.item.id
        $.title = data.project.item.title
        $.author = data.project.item.author
        this.save(true)
      })

      save = (force?: boolean) => {
        if (!force && !lastSavedJson && !$.players.length) return

        if (force
          || (
            lastSavedJson?.checksum !== $.checksum
            || lastSavedJson?.bpm !== $.bpm
            || lastSavedJson?.title !== $.title
            || lastSavedJson?.players?.map((p) => p.vol).join() !== $.players.map((p) => p.$.vol).join()
          )
        ) {
          console.time('saved')
          const json = this.toJSON()

          let lastChecksum: string | void
          if (lastSavedJson) {
            delete localStorage[lastSavedJson.checksum]
            lastChecksum = lastSavedJson.checksum
            cachedProjects.delete(lastChecksum)
          }

          localStorage[json.checksum] = JSON.stringify(lastSavedJson = json)

          cachedProjects.set(json.checksum, $.self as Project)

          services.$.refreshProjects()

          if (lastChecksum && services.$.href.includes(lastChecksum)) {
            const isPlaylist = location.pathname.startsWith('/playlist')
            services.$.go(
              location.pathname.replace(lastChecksum, json.checksum)
              + (
                isPlaylist
                  ? ''
                  : location.search.replace(lastChecksum, json.checksum)
              ),
              isPlaylist
                ? app.$.getPlaylistSearchParams()
                : {},
              true
            )
          }

          console.timeEnd('saved')
        }
      }

      autoSave = queue.debounce(1000)(this.save)

      delete = () => {
        $.isDeleted = true
        delete localStorage[$.checksum!]
      }

      undelete = () => {
        $.isDeleted = false
        this.save(true)
      }

      load = () => {
        if (projectLoadPromise) {
          return projectLoadPromise
        }

        projectLoadPromise = new Promise<void>((resolve) => {
          const checksum = $.checksum

          fx.once(async ({ library: _ }) => {
            let json: ProjectJson

            queueMicrotask(() => {
              const off = fx(({ players }) => {
                if (players.length) {
                  off()
                  resolve()
                }
              })
            })

            try {
              if (!checksum) {
                throw new Error('No checksum')
              }
              json = JSON.parse(localStorage[checksum])
              lastSavedJson = json
              console.log('loaded', checksum, json)
              if (!json.players.length) {
                throw new Error('Empty project: ' + checksum)
              }
              this.fromJSON(json)
            } catch (error) {
              // if (checksum) {
              //   console.warn('Error loading: ' + checksum)
              // }
              // console.warn(error)

              if ($.remoteProject) {
                this.loadRemote($.remoteProject)
                return
              } else if (checksum && checksum !== 'x') {
                const endpoint = `/projects?id=${checksum}`
                try {
                  const res = await services.$.apiRequest(endpoint)
                  if (!res.ok) {
                    throw new Error(res.statusText)
                  }

                  const p: schemas.ProjectResponse = await res.json()
                  console.groupCollapsed(endpoint)
                  console.log(p)
                  console.groupEnd()
                  this.loadRemote(p)
                  return
                } catch (error) {
                  console.warn(endpoint, error)
                }
              }

              json = {
                isDraft: true,
                checksum: 'x',
                bpm: 120,
                date: new Date().toISOString(),
                title: 'Untitled',
                author: 'guest',
                players: [
                  {
                    vol: 0.45,
                    pages: [{
                      sound: checksumId(demo.kick.sound),
                      patterns: [demo.kick.patterns[0], demo.kick.patterns[0], demo.kick.patterns[0], demo.kick.patterns[1]].map(checksumId)
                    }]
                  },

                  {
                    vol: 0.3,
                    pages: [{
                      sound: checksumId(demo.snare.sound),
                      patterns: [demo.snare.patterns[0], demo.snare.patterns[0], demo.snare.patterns[0], demo.snare.patterns[1]].map(checksumId)
                    }]
                  },

                  {
                    vol: 0.52,
                    pages: [{
                      sound: checksumId(demo.bass.sound),
                      patterns: [demo.bass.patterns[0]].map(checksumId)
                    }]
                  },
                ],
                remixCount: 0,
                originalRemixCount: 0,
                originalChecksum: false,
                originalAuthor: false,
              }

              this.fromJSON(json)
            }
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
        console.groupCollapsed(endpoint)
        console.log(tracks)
        console.groupEnd()

        const bufferIds = [...new Set(tracks.flatMap((t) => [t.soundId, ...t.patternIds]))]

        endpoint = `/buffers?ids=${bufferIds}`
        res = await services.$.apiRequest(endpoint)
        if (!res.ok) {
          console.error(endpoint, res)
          return
        }

        const buffers: schemas.BufferResponse[] = await res.json()
        console.groupCollapsed(endpoint)
        console.log(buffers)
        console.groupEnd()

        buffers.forEach((b) => {
          localStorage[b.id] = b.value
        })

        const newSounds: EditorBuffer[] = []
        const newPatterns: EditorBuffer[] = []

        const tracksOrdered = p.trackIds.map((trackId) =>
          tracks.find((t) => t.id === trackId)!
        )

        const players: ProjectJson['players'] = (p.mixer as { vol: number, pages?: number[] }[]).map(({ vol, pages }, i) => {
          if (!pages || pages.length === 0) {
            pages = [i]
          }

          const trackPages = pages.map((trackIndex) => {
            const t: schemas.TrackResponse = tracksOrdered[trackIndex]

            const soundBuffer = getByChecksum(library.$.sounds, t.soundId)

            if (!soundBuffer) {
              newSounds.push(toBuffer('sound')([0, t.soundId]))
            }

            t.patternIds.forEach((patternId) => {
              const patternBuffer = getByChecksum(library.$.patterns, patternId)
              if (!patternBuffer) {
                newPatterns.push(toBuffer('pattern')([0, patternId]))
              }
            })

            return {
              sound: t.soundId,
              patterns: t.patternIds
            }
          })

          return {
            vol,
            sound: trackPages[0].sound,
            patterns: [...trackPages[0].patterns],
            pages: trackPages
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
          remixCount: p.remixCount || 0,
          originalRemixCount: p.originalRemixCount || 0,
          originalChecksum: p.originalId || false,
          originalAuthor: p.originalAuthor || false,
        }

        localStorage[p.id] = JSON.stringify(lastSavedJson = json)

        this.fromJSON(json)
      })

      fromJSON = fn(({ players, library }) => (json: ProjectJson) => {
        try {
          json.players.forEach((player) => {
            if (!player.pages || player.pages.length === 0) {
              if (!player.sound || !player.patterns) return

              player.pages = [{
                sound: player.sound,
                patterns: player.patterns.slice()
              }]

              player.sound = getByChecksum(library.$.sounds, player.sound)!.$.id!
              player.patterns.forEach((pattern, i) => {
                player.patterns![i] = getByChecksum(library.$.patterns, pattern)!.$.id!
              })
            }

            player.pages.forEach((page) => {
              page.sound = getByChecksum(library.$.sounds, page.sound)!.$.id!
              page.patterns.forEach((pattern, i) => {
                page.patterns[i] = getByChecksum(library.$.patterns, pattern)!.$.id!
              })
            })
          })
        } catch (error) {
          console.warn(error)
          return
        }

        $.checksum = json.checksum
        $.bpm = json.bpm
        $.date = json.date
        $.title = json.title
        $.author = json.author
        $.isDraft = json.isDraft
        $.remixCount = json.remixCount || 0
        $.originalRemixCount = json.originalRemixCount || 0
        $.originalChecksum = json.originalChecksum || false
        $.originalAuthor = json.originalAuthor || false

        players?.forEach((player) => {
          player.dispose()
        })

        $.players = json.players.map((player) => Player({
          ...player,
          ...player.pages![0],
          pattern: 0,
          project: $.self as Project,
        }))
      })

      /**
       * Get a JSON representation of the project.
       */
      toJSON = fn(({ players, library }) => (): ProjectJson => ({
        ...pick($ as Required<typeof $>, [
          'checksum',
          'bpm',
          'date',
          'title',
          'author',
          'isDraft',
          'remixCount',
          'originalAuthor',
          'originalChecksum',
          'originalRemixCount',
        ]),
        players: players.map((player) => ({
          vol: player.$.vol,
          sound: player.$.soundBuffer!.$.checksum!,
          patterns: player.$.patternBuffers!.map((p) => p.$.checksum!),
          pages: player.$.pages!.map((page) => ({
            sound: get(library.$.sounds, page.sound)!.$.checksum!,
            patterns: getMany(library.$.patterns, page.patterns).map((p) => p!.$.checksum!)
          }))
        }))
      }))

      updateChecksum = fn(({ library }) => () => {
        const trackIds = $.players.map((p) =>
          checksumId(
            p.$.pages!.flatMap((page) => [
              get(library.$.sounds, page.sound)!.$.checksum!,
              ...getMany(library.$.patterns, page.patterns).map((p) => p!.$.checksum!)
            ]).join()
          )
        )

        if (trackIds.every((c) => c != null)) {
          $.checksum = checksumId(trackIds.join())
        }
      })
    })
  },
  function effects({ $, fx }) {
    fx(({ id }) => {
      projectsById.set(id, $.self)
      return () => {
        projectsById.delete(id)
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
      audioPlayer.$.vol = storage.vols.get(checksum, 0.5)

      let lastSavedChecksum: string

      const updateStorageVol = queue.debounce(1000)(() => {
        if (lastSavedChecksum) {
          storage.vols.delete(lastSavedChecksum)
        }
        storage.vols.set(lastSavedChecksum = $.checksum!, audioPlayer.$.vol!)
      })

      updateStorageVol()

      fx(() => chain(
        fx(({ checksum: _ }) => {
          updateStorageVol()
        }),
        audioPlayer.fx(({ vol: _ }) => {
          updateStorageVol()
        })
      ))
    })

    fx(({ audio, audioPlayer }) => {
      audioPlayer.$.audio = audio
      return audioPlayer.fx(({ state }) => {
        if (state === 'running') {
          $.state = 'running'
        }
      })
    })

    fx(({ players, library }) =>
      chain(
        players.map((player) =>
          chain(
            player.fx(({ soundBuffer, patternBuffers, pages }) => chain(
              ...[soundBuffer, ...patternBuffers].map((b) => b.fx(({ checksum: _ }) => {
                $.updateChecksum()
              }))
            )),
            player.fx(({ vol }) => {
              $.vols = players.map((p) => p.$.vol).join()
            })
          )
        )
      )
    )

    fx.once(({ checksum }) => {
      $.firstChecksum = checksum
    })
    fx(({ checksum, bpm: _b, vols }, prev) => {
      if (prev.checksum && !$.isDraft) {
        $.isDraft = true
        $.originalChecksum = $.originalChecksum || $.firstChecksum || false
        $.originalAuthor = $.originalAuthor || $.author!
        $.author = services.$.username
        $.date = getDateTime()
        if ($.originalChecksum) {
          cachedProjects.delete($.originalChecksum)
          cachedProjects.set(checksum, $.self)
        }
      }
      $.autoSave()
    })

    fx(({ isDeleted }, prev) => {
      if (prev.isDeleted != null && isDeleted !== prev.isDeleted) {
        services.$.refreshProjects()
      }
    })

    fx(({ author, checksum, title, isDraft }) => {
      if (isDraft) {
        $.pathname = `/drafts/${checksum}`
      } else {
        $.pathname = `/${author}/${checksum}/${slugify(title)}`
      }
      $.autoSave()
    })

    fx(() =>
      services.fx(({ projects }) => {
        // TODO: move related to its own util
        const related = projects.filter((p) =>
          p.$.checksum !== $.checksum
          && (
            p.$.originalChecksum === $.checksum
            || $.originalChecksum === p.$.checksum
            || (p.$.originalChecksum && p.$.originalChecksum === $.originalChecksum)
            || (p.$.title === $.title && $.author === p.$.author)
          )
        )

        relatedProjects.set($.self, related)
      })
    )
  }
)
export type Project = typeof Project.State
