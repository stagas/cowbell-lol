import { EditorScene } from 'canvy'
import { filterMap } from 'everyday-utils'
import { Matrix, Point, Rect } from 'geometrik'
import { on, reactive } from 'minimal-view'
import { Audio } from './audio'
import { EditorBuffer } from './editor-buffer'
import { library, Library } from './library'
import { createPreview, Preview } from './preview-service'
import { Project } from './project'
import { cachedProjects, getOrCreateProject, projectsByDate } from './projects'
import { schemas } from './schemas'
import { Skin, skin } from './skin'
import { getSliders } from './util/args'
import { storage } from './util/storage'
import { createWaveplot, Waveplot } from './waveplot'

export type Services = typeof Services.State

export const Services = reactive('services',
  class props {
    apiUrl?: string
    distRoot?= '/example'
    sampleRate?= storage.sampleRate.get(44100)
    latencyHint?= 0.045 //storage.latencyHint.get(0.04)
    previewSampleRate?= storage.previewSampleRate.get(22050)
  },
  class local {
    state: 'idle' | 'deleting' = 'idle'

    skin?: Skin = skin
    audio?: Audio | null
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

    clipboardActive: string | false = false
    clipboardId: string | false = false
    clipboardBuffer: EditorBuffer | false = false
  },
  function actions({ $, fn, fns }) {
    const urlHistory: string[] = [location.href]
    const receivedRemixesOf = new Set<string>()

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

      // auth

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

      loginWithGithub = fn(({ distRoot }) => () => {
        const h = 700
        const w = 500
        const x = window.outerWidth / 2 + window.screenX - (w / 2)
        const y = window.outerHeight / 2 + window.screenY - (h / 2)

        const popup = window.open(
          `${distRoot}/login.html`,
          'oauth',
          `width=${w}, height=${h}, top=${y}, left=${x}`
        )!

        // Hack to detect when login is done so that we can automatically
        // close the window.
        //
        // Since the user navigates away to GitHub we lose communication with
        // the popup. However, we can detect whenever something accesses the
        // localStorage in our domain. The oauth callback page is in our
        // domain and writes to it when it loads, we detect it here and
        // close the popup.
        const off = on(window, 'storage')(() => {
          off()
          popup.close()
          this.tryLogin()
        })
      })

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
            this.onWindowPopState(replace)
          } else {
            if (replace) {
              history.replaceState({}, '', url)
            } else {
              history.pushState({}, '', url)
            }
            this.onWindowPopState(replace)
          }
        }
      }

      linkTo = (pathname: string, searchParams: Record<string, string> = {}) => (e?: PointerEvent | MouseEvent) => {
        e?.preventDefault?.()
        e?.stopPropagation?.()
        this.go(pathname, searchParams)
      }

      onNavigation = (replace = false) => {
        if (replace) {
          urlHistory.pop()
          urlHistory.push(location.href)
        } else {
          if (urlHistory.at(-2) === location.href) {
            urlHistory.pop()
          } else if (urlHistory.at(-1) !== location.href) {
            urlHistory.push(location.href)
          }
        }
        $.href = location.href
      }

      onWindowPopState = (replace?: boolean) => {
        setTimeout(() => {
          this.onNavigation(replace)
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
    })
  },
  function effects({ $, fx }) {
    fx(() =>
      on(window, 'popstate')(() => services.$.onWindowPopState())
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

export const services = Services({})
