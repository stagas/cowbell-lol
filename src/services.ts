import { EditorScene } from 'canvy'
import { filterMap } from 'everyday-utils'
import { Matrix, Point, Rect } from 'geometrik'
import { on, reactive } from 'minimal-view'
import { Audio } from './audio'
import { AudioPlayer } from './audio-player'
import { library, Library } from './library'
import { Player } from './player'
import { Preview, createPreview } from './preview-service'
import { Project } from './project'
import { schemas } from './schemas'
import { Skin, skin } from './skin'
import { getSliders } from './util/args'
import { storage } from './util/storage'
import { Waveplot, createWaveplot } from './waveplot'

export const cachedProjects = new Map<string, Project>()

const receivedRemixesOf = new Set<string>()

export function projectsByDate(a: Project, b: Project) {
  return new Date(b.$.date!).getTime() - new Date(a.$.date!).getTime()
}

export function projectsRelated(a: Project, b: Project) {
  return new Date(b.$.date!).getTime() - new Date(a.$.date!).getTime()
}

export function projectsGroup(acc: Project[][], curr: Project) {
  const group = acc.find((g) =>
    g[0].$.originalChecksum === curr.$.checksum
    || curr.$.originalChecksum === g[0].$.checksum
    || (g[0].$.originalChecksum && g[0].$.originalChecksum === curr.$.originalChecksum)
    || (g[0].$.title === curr.$.title && g[0].$.author === curr.$.author)
  )

  if (group) {
    group.push(curr)
  } else {
    acc.push([curr])
  }

  return acc
}


export function getOrCreateProject(p: schemas.ProjectResponse | { id: string }) {
  let project = cachedProjects.get(p.id)
  if (!project) {
    if ('title' in p) {
      project = Project({
        checksum: p.id,
        title: p.title,
        bpm: p.bpm,
        author: p.author,
        date: p.updatedAt,
        isDraft: false,
        remoteProject: p,
        remixCount: p.remixCount || 0,
        originalRemixCount: p.originalRemixCount || 0,
        originalChecksum: p.originalId || false,
        originalAuthor: p.originalAuthor || false,
      })
    } else {
      project = Project({
        checksum: p.id,
      })
    }
  }
  cachedProjects.set(p.id, project)
  return project
}

export const Services = reactive('services',
  class props {
    apiUrl?: string
    sampleRate?= storage.sampleRate.get(44100)
    latencyHint?= storage.latencyHint.get(0.04)
    previewSampleRate?= storage.previewSampleRate.get(22050)
  },
  class local {
    state: 'idle' | 'deleting' = 'idle'

    skin?: Skin = skin
    audio?: Audio
    waveplot?: Waveplot
    preview?: Preview

    href: string = location.href
    username: string = storage.username.get('guest')
    loggedIn = false

    library: Library = library
    likes: string[] = storage.likes.get([])
    projects?: Project[]
    projectsPage = 0
    hasMoreProjects = true

    editorScene = new EditorScene({
      isValidTarget: (el) => {
        const part = el.getAttribute('part')
        if (part === 'canvas') return true
        return false
      },
      layout: {
        viewMatrix: new Matrix,
        state: {
          isIdle: true
        },
        viewFrameNormalRect: new Rect(0, 0, 10000, 10000),
        pos: new Point(0, 0)
      }
    })

    previewAudioPlayer?: AudioPlayer
    previewPlayer?: Player
  },
  function actions({ $, fn, fns }) {
    const urlHistory: string[] = [location.href]

    return fns(new class actions {
      // backend

      apiRequest = fn(({ apiUrl }) => (endpoint: string, init?: RequestInit) =>
        fetch(
          `${apiUrl}${endpoint}`,
          { credentials: 'include', ...init }
        )
      )

      loadMoreProjects = async () => {
        $.projectsPage++
        const results = await this.fetchProjects({ page: $.projectsPage })
        if (!results || !results.length) {
          $.hasMoreProjects = false
        }
      }

      fetchProjects = async ({ username, ids, page, remixesOfId }: { username?: string, ids?: string[], page?: number, remixesOfId?: string } = {}) => {
        if (username === 'guest') return
        if (remixesOfId) {
          if (receivedRemixesOf.has(remixesOfId)) {
            return
          }
          receivedRemixesOf.add(remixesOfId)
        }

        try {
          let endpoint = `/projects${!page ? '' : `?p=${page}`}`

          if (ids) {
            ids = ids.filter((id) => !cachedProjects.has(id))
            // ids = ids.filter((id) => {
            //   if (id in localStorage) {
            //     getOrCreateProject({ id })
            //     return false
            //   }
            //   return true
            // })
            if (ids.length) {
              endpoint = `/projects?ids=${ids}`
            } else {
              return
            }
          }

          if (remixesOfId) {
            endpoint = `/projects?id=${remixesOfId}&remixes=true`
          }

          if (username) {
            endpoint = `/projects?u=${username}`
          }

          try {
            const res = await this.apiRequest(endpoint)

            if (!res.ok) {
              throw new Error(res.statusText)
            }

            const projects: schemas.ProjectResponse[] = await res.json()
            console.groupCollapsed(endpoint)
            console.log(projects)
            console.groupEnd()

            projects.forEach(getOrCreateProject)
            return projects
          } catch (error) {
            console.warn(endpoint, error)
          }
        } finally {
          this.refreshProjects()
        }
      }

      refreshProjects = () => {
        $.projects = [...cachedProjects.values()].sort(projectsByDate)
      }

      tryLogin = async () => {
        try {
          const res = await this.apiRequest('/whoami')

          if (res.ok) {
            const username = await res.text()
            $.username = username.length < 25 && username || 'guest'
          }
        } catch (error) {
          $.username = 'guest'
        }
      }

      // navigation

      go = (pathname: string, searchParams: Record<string, string> = {}, replace = false) => {
        if (!pathname.startsWith('.') && !pathname.startsWith('/')) {
          pathname = '/' + pathname
        }

        const url = new URL(pathname, location.origin)

        Object.entries(searchParams).forEach(([key, value]) => {
          url.searchParams.set(key, value)
        })

        if (url.href !== location.href) {
          if (urlHistory.at(-2) === url.href) {
            history.back()
            this.onWindowPopState()
          } else {
            if (replace) {
              history.replaceState({}, '', url)
            } else {
              history.pushState({}, '', url)
            }
            this.onWindowPopState()
          }
        }
      }

      linkTo = (pathname: string, searchParams: Record<string, string> = {}) => (e?: PointerEvent | MouseEvent) => {
        e?.preventDefault?.()
        e?.stopPropagation?.()
        this.go(pathname, searchParams)
      }

      onNavigation = () => {
        if (urlHistory.at(-2) === location.href) {
          urlHistory.pop()
        } else if (urlHistory.at(-1) !== location.href) {
          urlHistory.push(location.href)
        }
        $.href = location.href
      }

      onWindowPopState = () => {
        setTimeout(() => {
          this.onNavigation()
        })
      }

      // misc

      getSliders = fn(({ sampleRate }) =>
        (code: string) =>
          getSliders(code, {
            sampleRate,
            // TODO: beatSamples need to be sampleRate * coeff
            // but because we're not yet passing that to the
            // mono player, we fix it to 1 second.
            beatSamples: sampleRate,
            numberOfBars: 1
          })
      )

      sendTestNote = fn(({ previewPlayer }) => () => {
        let delay = 0

        if (!previewPlayer.$.preview) delay = 50

        const off = previewPlayer.fx(({ compileState, connectedState, preview }) => {
          if (compileState === 'compiled' && connectedState === 'connected' && preview) {
            setTimeout(() => {
              this.onMidiEvent(Object.assign(
                new MIDIMessageEvent('message', {
                  data: new Uint8Array([144, 40, 127])
                }),
                { receivedTime: 0 }
              ) as any)
            }, delay)
            off()
          }
        })
        previewPlayer.$.startPreview()
      })

      // midi

      onMidiEvent = fn(({ previewPlayer }) => (e: WebMidi.MIDIMessageEvent) => {
        previewPlayer.$.startPreview()
        previewPlayer.$.monoNode!.processMidiEvent(e)
      })
    })
  },
  function effects({ $, fx }) {
    fx(() =>
      on(window, 'popstate')(services.$.onWindowPopState)
    )

    fx(({ apiUrl: _ }) => {
      $.tryLogin()
    })

    fx(({ username }) => {
      $.loggedIn = username !== 'guest'
    })

    fx(({ username }) => {
      storage.username.set(username)
    })

    fx(({ sampleRate, latencyHint }) => {
      $.audio = Audio({
        sampleRate,
        latencyHint,
      })
    })

    fx(({ audio }) => {
      $.previewAudioPlayer = AudioPlayer({})
      $.previewPlayer = Player({
        vol: 0.45,
        sound: 'sk',
        pattern: 0,
        patterns: ['k'],
        isPreview: true,
        audioPlayer: $.previewAudioPlayer
      })
      $.previewPlayer.$.audio = audio
      $.previewPlayer.$.audioPlayer!.$.audio = audio
    })

    fx(({ likes }) => {
      storage.likes.set(likes)
    })

    fx.once(async ({ apiUrl: _, likes }) => {
      // drafts
      const draftIds = storage.projects.get(['x'])
      const ids = (draftIds.length ? draftIds : ['x'])
      ids.forEach((id) =>
        getOrCreateProject({ id })
      )

      // likes
      $.fetchProjects({ ids: likes })

      // recent
      await $.fetchProjects()
    })

    fx(async function initWaveplot({ previewSampleRate }) {
      const previewSamplesLength = previewSampleRate / 4 | 0

      $.waveplot = await createWaveplot({
        width: 250,
        height: 100,
        pixelRatio: window.devicePixelRatio,
        sampleRate: previewSampleRate,
        samplesLength: previewSamplesLength
      })
    })

    fx(async function initPreview({ waveplot, previewSampleRate }) {
      $.preview = createPreview(waveplot, previewSampleRate)
    })

    fx(({ projects }) => {
      const projectsChecksums = filterMap(
        projects, (p) =>
        p.$.isDraft && !p.$.isDeleted && p.$.checksum
      )

      storage.projects.set(projectsChecksums)
    })
  }
)
export type Services = typeof Services.State

export const services = Services({})
