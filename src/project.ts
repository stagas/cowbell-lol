import { cheapRandomId, filterMap, pick } from 'everyday-utils'
import { chain, queue, reactive } from 'minimal-view'
import { Audio, AudioState } from './audio'
import { AudioPlayer } from './audio-player'
import { demo } from './demo-code'
import { EditorBuffer } from './editor-buffer'
import { Library, toBuffer } from './library'
import { Player, PlayerPage, players } from './player'
import { startTemporaryPresetsSmoothScroll } from './player-editor'
import { cachedProjects, getPlayingProjects, projects } from './projects'
import { Send } from './send'
import { schemas } from './schemas'
import { services } from './services'
import { checksumId } from './util/checksum-id'
import { filterState } from './util/filter-state'
import { getDateTime } from './util/get-datetime'
import { get, getByChecksum, getMany, replaceAtIndex } from './util/list'
import { noneOf, oneOf } from './util/one-of'
import { slugify } from './util/slugify'
import { storage } from './util/storage'
import { shared } from './shared'

export type ProjectJson = {
  checksum: string
  isDraft: boolean
  bpm: number
  date: string
  title: string
  author: string
  players: {
    vol: number
    pan?: number
    sound?: string
    patterns?: string[]
    pages?: PlayerPage[]
    sends?: [number, string, number, number][] | undefined
    routes?: [number, string, number][] | undefined
  }[]
  remixCount: number
  originalRemixCount: number
  originalChecksum: string | false
  originalAuthor: string | false
}

function logAndReturn<T>(x: T): T {
  console.log(x)
  return x
}

export const projectsById = new Map<string, Project>()

export const relatedProjects = new Map<Project, Project[]>()

export type Project = typeof Project.State

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
    library?: Library
    audio?: Audio | null
    audioPlayer = AudioPlayer({})
    allPlayersReady = false
    firstChecksum?: string
    vols?: string
    startedAt: number = 0
    pathname?: string
    players: Player[] = []
    selectedPlayer = 0
    selectedPreset?: EditorBuffer
    editorVisible = false
  },
  function actions({ $, fx, fn, fns }) {
    let projectLoadPromise: Promise<void>
    let lastSavedJson: ProjectJson | undefined
    let lastPlaylistSearchParams = ''
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

        players.forEach((player) => {
          if (
            player.$.isPreview
            || $.players.includes(player)
            || player.$.state === 'running'
          ) return

          player.$.audio = null
          shared.$.lastRunningPlayers.delete(player)
        })
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
            pan: player.$.pan || 0,
            pages: player.$.pages!.map((_, x) =>
              x + $.players.slice(0, y).reduce((p, n) => p + (n.$.pages?.length || 1), 0)
            ),
            sends: player.$.toJSON().sends
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

      getPlaylistSearchParams = (): { p?: string } => {
        let playingProjects: Project[] = getPlayingProjects()
        if (!playingProjects.length) playingProjects = projects.$.playing as Project[]

        let p: string = playingProjects.map((p) => [
          p.$.checksum,
          filterMap(p.$.players, (x, y) => (x.$.state === 'running' || shared.$.lastRunningPlayers.has(x)) && y).join('.')
        ].filter(Boolean).join('-')
        ).join('--')

        if (!p) {
          p = lastPlaylistSearchParams
        }

        if (!p) return {}

        lastPlaylistSearchParams = p

        return { p }
      }

      save = (force?: boolean): void => {
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
                ? this.getPlaylistSearchParams()
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

        // console.log('GET BUFFER IDS', bufferIds, tracks.flatMap(t => [t.soundId, ...t.patternIds]))

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

        // console.log('TRACKS ORDERED', tracksOrdered)
        // console.log('MIXER', p.mixer)

        const players: ProjectJson['players'] = (p.mixer as schemas.ProjectResponse['mixer']).map(({ vol, pan, pages, sends, routes }, i) => {
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
              patterns: [...t.patternIds]
            }
          })

          return {
            vol,
            pan: pan || 0,
            sound: trackPages[0].sound,
            patterns: [...trackPages[0].patterns],
            pages: trackPages,
            sends,
            routes,
          }
        })

        // console.log('NEW SOUNDS', newSounds)
        // console.log('NEW PATTERNS', newPatterns)
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
        // console.log('FROM JSON', json)
        try {
          json.players.forEach((player) => {
            if (!player.pages || player.pages.length === 0) {
              if (!player.sound || !player.patterns) return

              player.pages = [{
                sound: player.sound,
                patterns: player.patterns.slice()
              }]

              player.sound = getByChecksum(library.$.sounds, player.sound, true)!.$.id!
              player.patterns.forEach((pattern, i) => {
                player.patterns![i] = getByChecksum(library.$.patterns, pattern, true)!.$.id!
              })
            }

            player.pages.forEach((page) => {
              page.sound = getByChecksum(library.$.sounds, page.sound, true)!.$.id!
              page.patterns.forEach((pattern, i) => {
                page.patterns[i] = getByChecksum(library.$.patterns, pattern, true)!.$.id!
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
          sends: new Map(),
          pattern: 0,
          project: $.self as Project,
        }))

        json.players.forEach((player, i) => {
          const sourcePlayer = $.players[i]
          const sends = sourcePlayer.$.sends!

          if (player.routes) player.sends = player.routes.map((r) => [...r, 0])

          player.sends = (player.sends ?? []).map((s) => [
            s[0],
            s[1] === 'dest' || s[1] === 'output' ? 'out'
              : s[1] === 'input' ? 'in'
                : s[1],
            s[2],
            s[3]
          ])

          if (player.sends?.length) {
            for (const [targetPlayerIndex, targetId, vol, pan] of player.sends) {
              const targetPlayer = $.players[targetPlayerIndex]

              const paramId = `${targetPlayer.$.id}::${targetId}`

              let send = sends.get(paramId)

              if (send) {
                send.$.vol = vol
                send.$.pan = pan
                continue
              }

              send = Send({
                sourcePlayer,
                targetPlayer,
                targetId,
                vol,
                pan,
              })

              sends.set(paramId, send)
            }
          }

          const paramId = `${sourcePlayer.$.id}::out`
          if (!sends.has(paramId)) {
            const send = Send({
              sourcePlayer,
              targetPlayer: sourcePlayer,
              targetId: 'out',
              vol: 1,
              pan: 0,
            })
            sends.set(paramId, send)
          }
        })
      })

      /**
       * Get a JSON representation of the project.
       */
      toJSON = fn(({ players }) => (): ProjectJson => logAndReturn({
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
        players: players.map((player) =>
          player.$.toJSON()
        ),
      }))

      updateChecksum = fn(({ library }) => queue.task(() => {
        const trackIds = $.players.flatMap((p) =>
          !p.$.pages ? null : p.$.pages.flatMap((page) =>
            checksumId([
              get(library.$.sounds, page.sound)!.$.checksum!,
              ...getMany(library.$.patterns, page.patterns).map((p) => p!.$.checksum!)
            ].join())
          )
        )

        const sends = $.players.flatMap((player) => player.$.toJSON().sends)

        if (trackIds.every((c) => c != null)) {
          const payload = trackIds.join() + sends.join()
          // console.log('CHECKSUM:', payload)
          $.checksum = checksumId(payload)
        }
      }))

      // player

      onPlayerSoundSelect = (_: string, { y }: { y: number }) => {
        const player = $.players[y]

        if ($.editorVisible && $.selectedPreset!.$.kind === 'sound' && $.selectedPlayer === y && $.selectedPreset === player.$.soundBuffer) {
          $.editorVisible = false
        } else {
          if ($.editorVisible && $.selectedPlayer === y && $.selectedPreset!.$.kind === 'sound') {
            startTemporaryPresetsSmoothScroll($.id!)
          }
          $.editorVisible = true
          $.selectedPlayer = y
          $.selectedPreset = player.$.soundBuffer!
        }
      }

      onPlayerPatternSelect = (id: string, { x, y }: { x: number, y: number }) => {
        const player = $.players[y]

        if ($.editorVisible && $.selectedPreset!.$.kind === 'pattern' && $.selectedPlayer === y && player.$.pattern === x && $.selectedPreset === player.$.patternBuffers![player.$.pattern]) {
          $.editorVisible = false
        } else {
          if ($.editorVisible && $.selectedPlayer === y && $.selectedPreset!.$.kind === 'pattern') {
            startTemporaryPresetsSmoothScroll($.id!)
          }
          $.editorVisible = true
          $.selectedPlayer = y
          $.selectedPreset = player.$.patternBuffers![player.$.pattern = x]
        }
      }

      onPlayerPatternPaste = (id: string, { x, y }: { x: number, y: number }) => {
        const selectedPlayer = $.players[$.selectedPlayer!]

        const p = selectedPlayer.$.pattern

        if (x !== p || y !== $.selectedPlayer) {
          const targetPlayer = $.players[y]

          const pattern = selectedPlayer.$.patterns[p]

          targetPlayer.$.patterns = replaceAtIndex(
            targetPlayer.$.patterns,
            x,
            pattern
          )
        }
      }

      onPlayerPatternInsert = (id: string, { x, y }: { x: number, y: number }) => {
        const player = $.players[y]
        const patterns = [...player.$.patterns]
        const pattern = patterns[x]
        patterns.splice(x + 1, 0, pattern)
        player.$.patterns = patterns
      }

      onPlayerPatternDelete = (id: string, { x, y }: { x: number, y: number }) => {
        const player = $.players[y]
        const patterns = player.$.patterns

        if (patterns.length === 1) return

        patterns.splice(x, 1)

        player.$.pattern = Math.min(player.$.pattern, patterns.length - 1)
      }
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

    fx(({ players, library: _ }) =>
      chain(
        players.map((player) =>
          chain(
            player.fx(({ soundBuffer, patternBuffers, pages: _ }) => chain(
              ...[soundBuffer, ...patternBuffers].map((b) => b.fx(({ checksum: _ }) => {
                $.updateChecksum()
              }))
            )),
            // TODO: pans
            // TODO: move to queue.task
            player.fx(({ vol: _ }) => {
              $.vols = players.map((p) => p.$.vol).join()
            }),
            player.fx(({ sends: _ }) => {
              $.autoSave()
            }),
          )
        )
      )
    )

    fx(({ players }) => {
      const updatePlayersReady = queue.task.not.first.not.next.last(() => {
        $.allPlayersReady = players.every((p) => p.$.audioPlayer?.$.inputNode)
      })
      return chain([
        () => {
          $.allPlayersReady = false
        },
        ...players.map((player) =>
          player.fx(({ audioPlayer }) =>
            audioPlayer.fx(({ inputNode: _d }) => {
              updatePlayersReady()
            })
          )
        )
      ])
    })

    fx.once(({ checksum }) => {
      $.firstChecksum = checksum
    })

    // TODO: pans
    fx(({ checksum, bpm: _b, vols: _v }, prev) => {
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

    const off = fx(({ players }) => {
      if (players.length) return players[0].fx(({ soundBuffer }) => {
        $.selectedPreset = soundBuffer
        off()
      })
    })
  }
)
