import { wait } from 'everyday-utils'
import { reactive } from 'minimal-view'
import { AudioPlayer } from './audio-player'
import { Player } from './player'

export type Shared = typeof Shared.State

export const Shared = reactive('shared',
  class props { },

  class local {
    lastRunningPlayers = new Set<Player>()
    previewAudioPlayer?: AudioPlayer
    previewPlayer?: Player
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {

      sendTestNote = fn(({ previewPlayer }) => async () => {
        const preview = previewPlayer.$.preview

        await previewPlayer.$.startPreview()

        if (!preview) await wait(50)

        this.onMidiEvent(new MIDIMessageEvent('message', {
          data: new Uint8Array([144, 32, 127])
        }))
      })

      // midi

      onMidiEvent = fn(({ previewPlayer }) => async (e: WebMidi.MIDIMessageEvent) => {
        await previewPlayer.$.startPreview()
        previewPlayer.$.monoNode?.processMidiEvent(
          Object.assign(e, { receivedTime: -1 })
        )
        previewPlayer.$.stopPreview()
      })

    })
  },
  function effects({ $, fx }) {
    fx(() => {
      $.previewAudioPlayer = AudioPlayer({})
      $.previewPlayer = Player({
        vol: 0.45,
        sound: 'sk',
        pattern: 0,
        patterns: ['k'],
        isPreview: true,
      })
    })
  }
)

export const shared = Shared({})
