import { reactive } from 'minimal-view'
import { Audio } from './audio'
import { library, Library } from './library'
import { Preview, createPreview } from './preview-service'
import { Skin, skin } from './skin'
import { getSliders } from './util/args'
import { storage } from './util/storage'
import { Waveplot, createWaveplot } from './waveplot'

export const Services = reactive('services',
  class props {
    sampleRate?= storage.sampleRate.get(44100)
    latencyHint?= storage.latencyHint.get(0.04)
    previewSampleRate?= storage.previewSampleRate.get(22050)
  },
  class local {
    username: string = storage.username.get('guest')
    loggedIn = false
    skin?: Skin = skin
    audio?: Audio
    waveplot?: Waveplot
    preview?: Preview
    library: Library = library
    likes: string[] = storage.likes.get([])
  },
  function actions({ $, fn, fns }) {
    return fns(new class actions {
      tryLogin = async () => {
        const res = await fetch(
          'https://gho.devito.test:3030/whoami',
          { credentials: 'include' }
        )

        if (res.ok) {
          $.username = (await res.text()) || 'guest'
        }
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
    })
  },
  function effects({ $, fx }) {
    fx(() => {
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

    fx(() => {
      $.library = Library({})
    })
  }
)
export type Services = typeof Services.State

export const services = Services({})
