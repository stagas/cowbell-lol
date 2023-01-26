import { EditorScene } from 'canvy'
import { Matrix, Point, Rect } from 'geometrik'
import { on, reactive } from 'minimal-view'
import { Audio } from './audio'
import { AudioPlayer } from './audio-player'
import { library, Library } from './library'
import { Player } from './player'
import { Preview, createPreview } from './preview-service'
import { Project, projects } from './project'
import { Skin, skin } from './skin'
import { getSliders } from './util/args'
import { storage } from './util/storage'
import { Waveplot, createWaveplot } from './waveplot'

export const Services = reactive('services',
  class props {
    apiUrl?: string
    sampleRate?= storage.sampleRate.get(44100)
    latencyHint?= storage.latencyHint.get(0.04)
    previewSampleRate?= storage.previewSampleRate.get(22050)
  },
  class local {
    state: 'idle' | 'deleting' = 'idle'

    href: string = location.href
    username: string = storage.username.get('guest')
    loggedIn = false
    skin?: Skin = skin
    audio?: Audio
    waveplot?: Waveplot
    preview?: Preview
    library: Library = library
    likes: string[] = storage.likes.get([])
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

    previewAudioPlayer?: AudioPlayer // = AudioPlayer({})
    previewPlayer?: Player
    //  = Player({
    //   vol: 0.45,
    //   sound: 'sk',
    //   pattern: 0,
    //   patterns: ['k'],
    //   isPreview: true,
    //   audioPlayer: this.previewAudioPlayer
    // })

    projects?: Project[]
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

      go = (pathname: string, searchParams: Record<string, string>) => {
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
            history.pushState({}, '', url)
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

      updateProjects = () => {
        const projectsChecksums: string[] = [
          ...new Set<string>(
            [...projects.values()]
              .filter((x) => x.$.isDraft && !x.$.isDeleted)
              .map((x: Project) =>
                x.$.checksum as string)
          )
        ]

        storage.projects.set(projectsChecksums)
      }

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
  }
)
export type Services = typeof Services.State

export const services = Services({})
