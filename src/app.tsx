/** @jsxImportSource minimal-view */

import { EditorScene } from 'canvy'
import { diffChars } from 'diff'
import { checksum, modWrap } from 'everyday-utils'
import { Matrix, Point, Rect } from 'geometrik'
import memoize from 'memoize-pure'
import { chain, element, on, queue, ValuesOf, view, web } from 'minimal-view'
import { MIDIMessageEvent } from 'webaudio-tools'
import { PianoKeys } from 'x-pianokeys'
import { AudioPlayer } from './audio'
import { Button } from './button'
import * as db from './db'
import { demo } from './demo-code'
import { DoomScroll } from './doom-scroll'
import { Editor } from './editor'
import { EditorBuffer } from './editor-buffer'
import { Hint } from './hint'
import { Player } from './player'
import { PlayerView } from './player-view'
import { getNewDraftProjectId, Project } from './project'
import { ProjectView } from './project-view'
import { services } from './services'
import { Spacer } from './spacer'
import { Toolbar } from './toolbar'
import { TrackView } from './track-view'
import { classes } from './util/classes'
import { delById, get, replaceAtIndex } from './util/list'
import { storage } from './util/storage'
import { Vertical } from './vertical'
import { Wavetracer } from './wavetracer'

export const PROJECT_KINDS = {
  SAVED: '0',
  DRAFT: '1',
  REMOTE: '2',
} as const

export const DELIMITERS = {
  SAVE_ID: ',',
  SHORT_ID: ',',
} as const

export const APP_MODE = {
  NORMAL: 'normal',
  SOLO: 'solo',
  BROWSE: 'browse',
} as const
export type AppMode = ValuesOf<typeof APP_MODE>

// const projectButtonRefs = new Map<string, HTMLElement>()


// function deepObj(o: any) {
//   return Object.assign(o, { equals: isEqual })
// }

// function kindsOf(buffer: EditorBuffer) {
//   if (buffer.$.kind === 'sound') return 'sounds'
//   else if (buffer.$.kind === 'pattern') return 'patterns'
//   else throw new Error('Unreachable: unknown buffer kind: ' + buffer.$.kind)
// }

// function sortPresets(arr: EditorBuffer[]) {
//   return arr.sort((a, b) => {
//     if (a.$.title === b.$.title) {
//       return a.$.createdAt! - b.$.createdAt!
//     }
//     return a.$.title!.localeCompare(b.$.title!)
//   })
// }


export const focusMap = new Map<string, HTMLElement>()

export const cachedRefs = new Map<string, HTMLElement>()

export const cachedRef = memoize((id: string) => ({
  get current() {
    return cachedRefs.get(id)
  },
  set current(el) {
    if (el) {
      cachedRefs.set(id, el)
    }
  }
}))

export type Selected = {
  player: number,
  preset: string
}

export let app: App

export type App = typeof App.State

export const App = web(view('app',
  class props {
    dev?= true
    apiUrl?= location.origin
    distRoot?= '/example'
    monospaceFont?= 'Brass.woff2'
  },

  class local {
    host = element

    state: 'idle' | 'deleting' = 'idle'

    hint: JSX.Element = false

    selected: Selected = { player: 0, preset: 'sound-kick' }

    focused: 'main' | 'sound' | 'sounds' | 'pattern' | 'patterns' = 'sound'

    players: Player[] = []
    player?: Player

    previewAudioPlayer = AudioPlayer({})
    previewPlayer = Player({
      vol: 0.45,
      sound: 'sk',
      pattern: 0,
      patterns: ['k'],
      isPreview: true,
      audioPlayer: this.previewAudioPlayer
    })

    sounds: EditorBuffer[] = []
    sound?: EditorBuffer

    patterns: EditorBuffer[] = []
    pattern?: EditorBuffer

    main = EditorBuffer({ id: 'main', kind: 'main', value: demo.main, isDraft: false, isNew: false, isIntent: true })

    editor?: InstanceType<typeof Editor.Element>
    editorVisible = false
    editorEl?: HTMLElement
    editorBuffer?: EditorBuffer
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

    project: Project = Project({ id: storage.project.get(getNewDraftProjectId()) })
    projects: string[] = storage.projects.get([this.project.$.id])
    remoteProjects: string[] = []
    allProjects: {
      drafts: string[],
      liked: string[],
      recent: string[],
    } = makeProjects(this.projects, storage.likes.get([]))


    mode: AppMode = 'normal' //storage.mode.get('normal')

    presetsScrollEl?: HTMLDivElement

    playersView: JSX.Element = false
    editorView: JSX.Element = false
    pianoView: JSX.Element = false
  },

  function actions({ $, fns, fn }) {
    // let lastSaveJson: any = {}

    let presetsSmoothScrollTimeout: any

    return fns(new class actions {
      fromRemoteProject = async (short: string, long: string) => {
        // const [icon, date, id, checksum] = short.split(DELIMITERS.SHORT_ID)

        let hash = await db.getHash(short, long)
        if (!hash) {
          console.warn('hash not found for short: ', short)
          return
        }

        if (hash[0] === '#') hash = hash.slice(1)

        console.log('hash is:', hash)

        location.hash = hash
        // const url = new URL(location.toString())
        // url.hash = hash
        // this.fromURL(url)
      }

      onWindowPopState = () => {
        const result = $.project.$.fromURL(location, $.projects)
        if (result.success) {
          $.projects = result.projects
        }
      }

      // working state
      save = () => {
        if ($.mode === APP_MODE.NORMAL) {
          try {
            console.time('Autosave')
            // const json = this.toJSON(true)
            // if (!isEqual(json, lastSaveJson)) {
            //   lastSaveJson = json
            //   const res = JSON.stringify(json)
            //   localStorage.autoSave = res
            //   console.log('Autosave:', res.length) //, json)
            // } else {
            //   console.log('Did not autosave as no changes were made.')
            // }
            console.timeEnd('Autosave')
          } catch (error) {
            console.warn('Error while saving.')
            console.warn(error)
          }

          this.onProjectSave(true)
        }
      }

      autoSave = queue.debounce(5000)(this.save)

      // fromJSON = (json: ReturnType<typeof this.toJSON>) => {
      //   // Object.assign($.audio.$, json.audio)

      //   // TODO: disposable(arr, x => x.dispose())
      //   $.players.forEach((player) => {
      //     player.dispose()
      //   })
      //   // TODO: this is temporarily set to return 'any' because of TS infinite loop
      //   $.players = json.players.map((player: any) => Player({
      //     ...player,
      //     audio: $.audio,
      //     state: $.audio.$.state
      //   }))

      //   $.library.$.sounds = unique(json.sounds).map((props) => EditorBuffer({ ...props, kind: 'sound', services: $.services, isNew: false, isIntent: true }))

      //   $.library.$.patterns = unique(json.patterns).map((props) => EditorBuffer({ ...props, kind: 'pattern', services: $.services, isNew: false, isIntent: true }))
      // }

      // TODO: this is temporarily set to return 'any' because of TS infinite loop
      // toJSON = (compact?: boolean) => {
      //   const bufferKeys: (keyof EditorBuffer['$'])[] = [
      //     'id',
      //     'value',
      //     'isDraft',
      //     // 'createdAt',
      //     'fallbackTitle',
      //     ...(compact ? [] : ['snapshot'] as const)
      //   ]

      //   return {
      //     audio: $.audio.$.toJSON(),

      //     players: $.players.map((player) =>
      //       pick(player.$, [
      //         'vol',
      //         'sound',
      //         'pattern',
      //         'patterns',
      //       ])
      //     ),

      //     sounds: $.sounds.map((sound) =>
      //       pick(sound.$, bufferKeys)
      //     ),

      //     patterns: $.patterns.map((pattern) =>
      //       pick(pattern.$, [
      //         ...bufferKeys,
      //         'numberOfBars'
      //       ])
      //     ),
      //   } as {
      //     audio: ReturnType<Audio['$']['toJSON']>,
      //     players: Pick<Player['$'], 'vol' | 'sound' | 'pattern' | 'patterns'>[],
      //     sounds: Pick<EditorBuffer['$'], 'id' | 'value' | 'isDraft' | 'fallbackTitle'>[],
      //     patterns: Pick<EditorBuffer['$'], 'id' | 'value' | 'isDraft' | 'fallbackTitle'>[],
      //   }
      // }

      // projects

      // There are 3 cases saving a project.
      // - user has selected a project and made changes to it
      //   -> create draft and autosave
      // - user has made changes to draft
      //   -> autosave existing draft
      // - user explicitly saves a draft
      //   -> draft becomes not a draft and is saved in projects
      onProjectSave = (fromAutoSave?: boolean) => {
        try {
          // console.time('save')

          // eslint-disable-next-line prefer-const
          let [icon, date, kind] = $.project.$.id.split(DELIMITERS.SAVE_ID)

          const draft = kind == PROJECT_KINDS.DRAFT

          const json = $.project.$.toProjectJSON()
          // const res = JSON.stringify(json)

          const chk = json.checksum // checksum(res).toString()
          console.log('checksum:', chk) //, $.projects)

          //   if (fromAutoSave && $.projects.some((project) =>
          //     project.split(',').at(-1) === chk
          //   )) {
          //     console.timeEnd('save')
          //     console.warn('Did not save as it already exists. Make some changes first.')
          //     return
          //   }

          //   // NOTE: uncomment to debug why a save occured, to see what changed
          //   if (!draft) {
          //     const result = diffChars(localStorage[$.project.$.id], res)
          //     console.log(result)
          //   }

          //   let id: string

          //   if (!draft) {
          //     id = `${getNewDraftProjectId()},${chk}`
          //   } else {
          //     id = `${icon},${date},${!fromAutoSave ? '0' : '1'},${chk}`
          //   }

          //   localStorage[id] = res
          //   console.timeEnd('save')
          //   console.log('save:', id, res.length, json)

          //   // on explicit save
          //   if (!fromAutoSave) {
          //     if (draft) {
          //       const prevId = $.project.$.id
          //       // add to our projects
          //       $.projects = [
          //         // removing the draft id
          //         ...$.projects.filter((id) => id !== prevId),
          //         // and pushing the new saved project's id
          //         id
          //       ]
          //       // this.publish(id, res)
          //     } else {
          //       // TODO: unreachable?
          //       $.projects = [...$.projects, id]
          //     }

          //     // then select it
          //     $.project.$.id = id
          //     $.project.$.publish(res)
          //   }
          //   // on autosave
          //   else {
          //     // if it's a draft, replace the id
          //     if (draft) {
          //       if (id !== $.project.$.id) {
          //         const index = $.projects.indexOf($.project.$.id)
          //         $.projects.splice(index, 1, id)
          //         $.projects = [...$.projects]
          //         $.project.$.id = id
          //       }
          //     } else {
          //       $.projects = [...$.projects, id]
          //       $.project.$.id = id
          //     }
          //   }
        } catch (error) {
          console.warn('Error while saving project')
          console.warn(error)
        }
      }


      // buffers

      onBufferSave = (id: string, { kind }: { kind: string }) => {
        if (kind === 'sound') {
          this.onSoundSave(id)
        } else if (kind === 'pattern') {
          this.onPatternSave(id)
        }
        // trigger render
        $.selected = { ...$.selected }
      }

      // player

      onPlayerSoundSelect = (_: string, { y }: { y: number }) => {
        if ($.editorVisible && $.focused === 'sound' && $.selected.player === y) {
          $.editorVisible = false
        } else {
          $.editorVisible = true
          $.selected = { ...$.selected, player: y }
          $.focused = 'sound'
        }
      }

      onPlayerPatternSelect = (id: string, { x, y }: { x: number, y: number }) => {
        const player = $.players[y]

        if ($.editorVisible && $.focused === 'pattern' && $.selected.player === y && player.$.pattern === x) {
          $.editorVisible = false
        } else {
          $.editorVisible = true
          player.$.pattern = x
          $.selected = { ...$.selected, player: y }
          $.focused = 'pattern'
        }
      }

      onPlayerPatternPaste = (id: string, { x, y }: { x: number, y: number }) => {
        const selectedPlayer = $.players[$.selected.player]

        const p = selectedPlayer.$.pattern

        if (x !== p || y !== $.selected.player) {
          const targetPlayer = $.players[y]

          const pattern = selectedPlayer.$.patterns[p]

          targetPlayer.$.patterns = replaceAtIndex(
            targetPlayer.$.patterns,
            x,
            pattern
          )

          // trigger render
          $.selected = { ...$.selected }
        }
      }

      onPlayerPatternInsert = (id: string, { x, y }: { x: number, y: number }) => {
        const player = $.players[y]
        const patterns = [...player.$.patterns]
        const pattern = patterns[x]
        patterns.splice(x + 1, 0, pattern)
        player.$.patterns = patterns

        // trigger render
        $.selected = { ...$.selected }
      }

      onPlayerPatternDelete = (id: string, { x, y }: { x: number, y: number }) => {
        const player = $.players[y]
        const patterns = player.$.patterns

        if (patterns.length === 1) return

        patterns.splice(x, 1)

        player.$.pattern = Math.min(player.$.pattern, patterns.length - 1)

        // trigger render
        $.selected = { ...$.selected }
      }

      // presets

      onPresetsRearrange = services.fn(({ library }) => (id: string, { dir, kinds }: { dir: 1 | -1, kinds: 'sounds' | 'patterns' }) => {
        const buffers = $[kinds]

        const index = buffers.findIndex((buffer) => buffer.$.id === id)

        const dest = index + dir
        if (dest >= 0 && dest < buffers.length) {
          const bufs = [...buffers]
          const [buffer] = bufs.splice(index, 1)
          bufs.splice(dest, 0, buffer)
          library.$[kinds] = [...bufs]
        }
      })

      // sound

      sendTestNote = () => {
        let delay = 0

        if (!$.previewPlayer.$.preview) delay = 50

        const off = $.previewPlayer.fx(({ compileState, preview }) => {
          if (compileState === 'compiled' && preview) {
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
        $.previewPlayer.$.startPreview()
      }

      startTemporaryPresetsSmoothScroll = () => {
        if ($.presetsScrollEl) {
          $.presetsScrollEl.style.scrollBehavior = 'smooth'
          clearTimeout(presetsSmoothScrollTimeout)
          presetsSmoothScrollTimeout = setTimeout(() => {
            $.presetsScrollEl!.style.scrollBehavior = 'auto'
          }, 100)
        }
      }

      onSoundSelect = (id: string, { noPreview }: { noPreview?: boolean } = {}) => {
        this.startTemporaryPresetsSmoothScroll()
        $.focused = 'sounds'
        $.selected = { ...$.selected, preset: id }

        if (noPreview) return

        if (id !== $.previewPlayer.$.sound) {
          queueMicrotask(() => {
            this.sendTestNote()
          })
        } else {
          this.sendTestNote()
        }
      }

      onSoundUse = fn(({ player }) => (id: string) => {
        player.$.sound = id
        this.onSoundSelect(id, { noPreview: true })
        queueMicrotask(() => {
          $.focused = 'sound'
        })
      })

      onSoundSave = (id: string) => {
        get($.sounds, id)!.$.isDraft = false
      }

      onSoundDelete = services.fn(({ library }) => (id: string) => {
        const index = $.players.map((player) => player.$.sound).indexOf(id)
        if (!~index) {
          library.$.sounds = delById($.sounds, id)
        }
      })

      onSoundRearrange = (id: string, { dir }: { dir: 1 | -1 }) => {
        this.onPresetsRearrange(id, { dir, kinds: 'sounds' })
      }

      // pattern

      onPatternSelect = (id: string) => {
        this.startTemporaryPresetsSmoothScroll()
        $.focused = 'patterns'
        $.selected = { ...$.selected, preset: id }
      }

      onPatternUse = fn(({ player }) => (id: string) => {
        player.$.patterns = replaceAtIndex(
          player.$.patterns,
          player.$.pattern,
          id
        )

        this.onPatternSelect(id)

        queueMicrotask(() => {
          $.focused = 'pattern'
        })
      })

      onPatternSave = (id: string) => {
        get($.patterns, id)!.$.isDraft = false
      }

      onPatternDelete = services.fn(({ library }) => (id: string) => {
        const index = $.players.flatMap((player) => player.$.patterns).indexOf(id)
        if (!~index) {
          library.$.patterns = delById($.patterns, id)
        }
      })

      onPatternRearrange = (id: string, { dir }: { dir: 1 | -1 }) => {
        this.onPresetsRearrange(id, { dir, kinds: 'patterns' })
      }

      // editor

      focusEditor = fn(({ editor }) => () => {
        editor.$.editor?.focus()
      })

      // midi

      onMidiEvent = (e: WebMidi.MIDIMessageEvent) => {
        $.previewPlayer.$.startPreview()
        $.previewPlayer.$.monoNode!.processMidiEvent(e)
      }

      // song

      onKeyDown = fn(({ player }) => (e: KeyboardEvent) => {
        const cmd = (e.ctrlKey || e.metaKey)

        if (cmd && e.shiftKey) {
          $.state = 'deleting'
        } else {
          $.state = 'idle'
        }

        if (cmd && e.code === 'Backquote') {
          e.preventDefault()
          e.stopPropagation()

          const dir = e.shiftKey ? -1 : 1

          if ($.focused === 'pattern') {
            let x = player.$.pattern
            x = modWrap(x + dir, player.$.patterns.length)
            player.$.pattern = x
            // trigger render
            $.selected = { ...$.selected }
          } else {
            let y = $.selected.player
            y = modWrap(y + dir, $.players.length)
            $.selected = { ...$.selected, player: y }
          }
        }
        else if (cmd && (e.key === ';' || e.key === ':')) {
          e.preventDefault()
          e.stopPropagation()

          const order = ['main', 'sound', 'sounds', 'pattern', 'patterns'] as const
          const dir = e.shiftKey ? -1 : 1

          let z = order.indexOf($.focused)
          z = modWrap(z + dir, order.length)
          $.focused = order[z]

          this.focusEditor()
        }
      })

      onKeyUp = (e: KeyboardEvent) => {
        const cmd = (e.ctrlKey || e.metaKey)

        if (cmd && e.shiftKey) {
          $.state = 'deleting'
        } else {
          $.state = 'idle'
        }
      }

      onProjectSelect = (project: Project) => {
        $.project = project
        $.mode = APP_MODE.NORMAL
      }
    })
  },

  function effects({ $, fx, deps, refs }) {
    app = $.self

    services.fx(({ library }) =>
      chain(
        library.fx(({ sounds }) => {
          $.sounds = sounds
        }),
        library.fx(({ patterns }) => {
          $.patterns = patterns
        })
      )
    )

    let didInit = false
    fx(() => {
      if (didInit) return

      didInit = true

      let didLoad = false

      // try {
      //   $.fromJSON(JSON.parse(localStorage.autoSave))
      // } catch (error) {
      //   console.warn('autoload failed:')
      //   console.warn(error)
      // }

      try {
        $.save()
      } catch (error) {
        console.warn('initial autosave failed:')
        console.warn(error)
      }

      try {
        const result = $.project.$.fromURL(location, $.projects)
        if (result.success) {
          $.projects = result.projects
          didLoad = true
        } else {
          throw (result.error ?? new Error('Could not load URL'))
        }
      } catch (error) {
        console.warn('load url failed:')
        console.warn(error)
      }

      db.getShortList().then((result) => {
        $.remoteProjects = result.sort((a, b) => {
          const [, , aDate] = a.split(',')
          const [, , bDate] = b.split(',')
          const aTime = new Date(aDate).getTime()
          const bTime = new Date(bDate).getTime()
          return aTime - bTime
        })
      })
    })

    fx(() =>
      chain(
        on(window, 'keydown')($.onKeyDown),
        on(window, 'keyup')($.onKeyUp),
        on(window, 'popstate')($.onWindowPopState),
      )
    )

    fx(({ project }) => {
      project.$.load()
    })

    fx(({ project }) =>
      project.fx(({ players }) => {
        $.players = players
      })
    )

    fx(({ players, selected }) => {
      $.player = players[selected.player]
    })

    services.fx(({ audio }) =>
      fx(({ previewPlayer }) => {
        previewPlayer.$.audio = audio
        previewPlayer.$.audioPlayer!.$.audio = audio
      })
    )

    fx(({ previewPlayer, player, selected, focused }) => {
      if (focused === 'sounds') {
        previewPlayer.$.sound = selected.preset
      } else {
        previewPlayer.$.sound = player.$.sound
      }
    })

    fx(({ player, previewPlayer }) =>
      player.fx(({ vol }) => {
        previewPlayer.$.vol = vol
      })
    )

    fx(({ player, sounds, selected, focused }) => {
      $.sound = focused === 'sounds'
        ? get(sounds, selected.preset)!
        : get(sounds, player.$.sound)!
    })

    fx(({ player, patterns, selected, focused }) => {
      if (focused === 'patterns') {
        $.pattern = get(patterns, selected.preset)!
      } else {
        return player.fx(({ pattern, patternBuffers }) => {
          $.pattern = patternBuffers[pattern]
        })
      }
    })

    fx(({ selected }) => {
      storage.selected.set(selected)
    })

    fx(({ projects }) => {
      storage.projects.set(projects)
    })

    fx(({ project }) =>
      project.fx(({ id }) => {
        storage.project.set(id)
      })
    )

    // fx(({ mode }) => {
    //   storage.mode.set(mode)
    // })

    // fx(({ audio }) =>
    //   audio.fx(({ bpm: _ }) => {
    //     $.autoSave()
    //   })
    // )

    fx(({ focused, sound, pattern, main }) => {
      $.editorBuffer = (
        (focused === 'pattern' || focused === 'patterns')
          ? pattern
          : (focused === 'sound' || focused === 'sounds')
            ? sound
            : main)
        || $.editorBuffer!
    })

    fx(() =>
      services.fx(({ audio }) =>
        audio.fx(({ audioContext }) =>
          fx(({ pattern }) =>
            pattern.fx(({ midiRange }) => {
              const hasRange = isFinite(midiRange[0]) && isFinite(midiRange[1])
              const halfOctaves = !hasRange
                ? 3
                : Math.round(
                  (midiRange[1] - midiRange[0]) / 6
                )

              const startHalfOctave = !hasRange ? 8 : Math.round(pattern.$.midiRange![0] / 6)

              $.pianoView =
                <PianoKeys
                  halfOctaves={halfOctaves}
                  startHalfOctave={startHalfOctave}
                  audioContext={audioContext}
                  onMidiEvent={$.onMidiEvent}
                  vertical
                />
            })
          )
        )
      )
    )

    services.fx(({ skin }) =>
      fx(({ distRoot, monospaceFont }) => {
        const bodyStyle = document.createElement('style')
        bodyStyle.textContent = /*css*/`
        @font-face {
          font-family: Mono;
          src: url("${distRoot}/fonts/${monospaceFont}") format("woff2");
        }
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }

        @font-face {
          font-family: icon;
          src: url("${distRoot}/iconfont.woff2") format("woff2");
          font-weight: normal;
          font-style: normal;
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background: ${skin.colors.bgDarker};
          color: ${skin.colors.fg};
          font-size: 13px;
        }
        `

        document.head.appendChild(bodyStyle)
      })
    )

    services.fx(({ skin }) => {
      $.css = /*css*/`
      ${skin.css}

      & {
        width: 100%;
        display: flex;
        flex-flow: column nowrap;
      }

      [part=app-scroller] {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
      }

      [part=app-editor] {
        flex: 1;
        width: 100%;
        height: 100%;
      }

      [part=app-selected] {
        position: relative;
        height: 290px;
        background: ${skin.colors.bgDarky};

        &:before {
          content: ' ';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: calc(100% + 1px);
          z-index: 999;
          pointer-events: none;
          ${skin.styles.deep}
        }

        &:focus-within {
        }

        &[state=errored] {
          &:focus-within {
            &::before {
              box-shadow: inset 0 0 0 8px #f21;
            }
          }
        }
      }

      main {
        position: relative;
        max-width: 800px;
        width: 100%;
        align-self: center;

        .light {
          background: ${skin.colors.bg};
          box-shadow: 0 0 24px 10px ${skin.colors.shadeBlack};
        }
      }

      footer {
        position: relative;
        max-width: 800px;
        width: 100%;
        align-self: center;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        min-height: 150px;
        pointer-events: none;
      }

      h2 {
        font-family: Jost;
        font-weight: normal;
        font-size: 36px;
      }
      `
    })

    fx(({ player, main, sounds, sound, patterns, pattern, focused, selected, editorBuffer, pianoView }) => {
      const soundPresets = <div key="sounds" part="app-presets" ref={cachedRef('sounds')} style={focused !== 'sound' && focused !== 'sounds' && 'display:none'}>
        {sounds.map((s) =>
          <TrackView
            key={s.$.id!}
            ref={cachedRef(`sound-${s.$.id}`)}
            canFocus
            active={
              (focused === 'sound' || focused === 'sounds')
              && s.$.id === sound.$.id
            }
            live={player.$.sound === s.$.id}
            services={services}
            sound={s}
            clickMeta={s.$}
            onClick={$.onSoundSelect}
            // onDblClick={$.onSoundSave}
            onCtrlClick={$.onSoundUse}
            onCtrlShiftClick={$.onSoundDelete}
            onRearrange={$.onSoundRearrange}
          />
        )}
      </div>

      const patternPresets = <div key="presets" part="app-presets" ref={cachedRef('presets')} style={focused !== 'pattern' && focused !== 'patterns' && 'display:none'}>
        {patterns.map((p) =>
          <TrackView
            key={p.$.id!}
            ref={cachedRef(`pattern-${p.$.id}`)}
            canFocus
            active={
              (focused === 'pattern' || focused === 'patterns')
              && p.$.id === pattern.$.id
            }
            live={player.$.patterns[player.$.pattern] === p.$.id}
            pattern={p}
            clickMeta={p.$}
            onClick={$.onPatternSelect}
            // onDblClick={$.onPatternSave}
            onCtrlClick={$.onPatternUse}
            onCtrlShiftClick={$.onPatternDelete}
            onRearrange={$.onPatternRearrange}
          />
        )}
      </div>

      const readableOnly = (focused === 'sounds' && editorBuffer.$.id !== player.$.sound)
        || (focused === 'patterns' && player.$.patterns[player.$.pattern] !== editorBuffer.$.id!)

      $.editorView = <Spacer
        id="app-selected"
        part="app-selected"
        align="x"
        initial={[
          0,
          .0825,
          .225,
          .60
        ]}
      >
        {pianoView}

        <div ref={refs.presetsScrollEl} style="height:100%; position:relative; overflow-y: scroll; overscroll-behavior: contain;">
          {soundPresets}
          {patternPresets}
        </div>

        <div class="wrapper">
          <TrackView
            active={false}
            hoverable={false}
            showNotes={true}
            sliders
            player={(focused === 'sound' || focused === 'pattern' || (focused === 'sounds' && selected.preset === player.$.sound)) && player}
            services={services}
            main={focused === 'main' && main}
            sound={(focused === 'sound' || focused === 'sounds') && sound}
            pattern={(focused === 'pattern' || focused === 'patterns') && pattern}
            xPos={focused === 'pattern' || focused === 'patterns' ? player.$.pattern : 0}
            clickMeta={editorBuffer.$}
          // onDblClick={$.onBufferSave}
          />

          {(readableOnly || editorBuffer.$.isDraft) && <div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content:center; padding: 15px 0; box-sizing: border-box; gap: 9px">
            {readableOnly && <Button rounded onClick={() => {
              if (focused === 'sounds') {
                $.onSoundUse(selected.preset)
              } else if (focused === 'patterns') {
                $.onPatternUse(selected.preset)
              }
            }}>
              <span class="i mdi-light-chevron-up" style="font-size:32px; position: relative; left: 1px; top: -1px;" />
            </Button>}

            {editorBuffer.$.isDraft && <Button rounded onClick={() => {
              $.onBufferSave(editorBuffer.$.id!, editorBuffer.$)
            }}>
              <span class="i la-save" style="font-size:23px; position: relative; left: 0.5px; top: -1px;" />
            </Button>}
          </div>}
        </div>

        <Editor
          ref={refs.editor}
          part="app-editor"
          name="editor"
          player={player}
          buffer={editorBuffer}
          readableOnly={readableOnly}
        />

      </Spacer>
    })

    fx(({ players, editorVisible, selected, editorView }) => {
      $.playersView = players.map((player, y) => <>
        <PlayerView
          key={player.$.id!}
          id={player.$.id!}
          services={services}
          player={player}
          active={editorVisible && selected.player === y}
        />

        {selected.player === y && <div
          ref={refs.editorEl}
          class={classes({
            // TODO: this should work with 'none'
            // but something isn't playing well
            hidden: !editorVisible
          })}
        >
          {editorView}
          {editorView && <Vertical
            align='y'
            id='editor'
            size={290}
          />}
        </div>}
      </>)
    })

    services.fx(({ likes, loggedIn }) =>
      fx(({ mode, project, projects, allProjects, playersView }) => {
        $.autoSave()

        function notCurrentProject(id: string) {
          return id !== project.$.id
        }

        $.view = <>
          <Toolbar project={project} />

          <Hint message={deps.hint} />

          <main>
            <ProjectView
              key={project.$.id}
              id={project.$.id}
              primary={true}
              project={project}
              controlsView={<>
                {!loggedIn && <Button
                  pill
                  onClick={() => {
                    const h = 700
                    const w = 500
                    const x = window.outerWidth / 2 + window.screenX - (w / 2)
                    const y = window.outerHeight / 2 + window.screenY - (h / 2)

                    const popup = window.open('/example/login.html', 'oauth', `width=${w}, height=${h}, top=${y}, left=${x}`)!

                    const off = on(window, 'storage')(() => {
                      off()
                      popup.close()
                      services.$.tryLogin()
                    })
                  }}
                  title={"No spam, no email, no messages and no tracking!\nWe only use your username to sign you in and that's it.\nClicking opens in a popup."}
                >
                  Login with GitHub <span class="i la-github" />
                </Button>}
                {loggedIn && <Button round onClick={() => { }}>
                  <img crossorigin={'anonymous'} src={`https://avatars.githubusercontent.com/${services.$.username}?s=42&v=4`} />
                </Button>}
                <Button round onClick={() => {
                  if ($.mode === APP_MODE.NORMAL) {
                    $.mode = APP_MODE.BROWSE
                    $.allProjects = makeProjects(projects, likes)
                  } else {
                    $.mode = APP_MODE.NORMAL
                  }
                }}>
                  <span class={`i ${$.mode === APP_MODE.NORMAL
                    ? 'la-list'
                    : 'mdi-light-chevron-up'
                    }`} />
                </Button>
              </>}
            />

            <div class={classes(({ light: true, hidden: mode !== 'normal' }))}>
              {playersView}
            </div>

            <div class={classes(({ hidden: mode !== 'browse' }))}>
              <DoomScroll prompt initial={3} items={allProjects.drafts.filter(notCurrentProject)} factory={(id: string) =>
                <ProjectView
                  key={id}
                  id={id}
                  primary={false}
                  onSelect={$.onProjectSelect}
                />
              } />

              <h2>Liked:</h2>

              <DoomScroll prompt initial={3} items={allProjects.liked.filter(notCurrentProject)} factory={(id: string) =>
                <ProjectView
                  key={id}
                  id={id}
                  primary={false}
                  onSelect={$.onProjectSelect}
                />
              } />

              <h2>Latest:</h2>

              <DoomScroll prompt initial={3} items={allProjects.recent.filter(notCurrentProject)} factory={(id: string) =>
                <ProjectView
                  key={id}
                  id={id}
                  primary={false}
                  onSelect={$.onProjectSelect}
                />
              } />
            </div>
          </main>

          <footer>🔔</footer>
        </>
      }))
  }
))

function isDraft(id: string) {
  const [, , kind] = id.split(DELIMITERS.SAVE_ID)
  return kind === PROJECT_KINDS.DRAFT
}

function getDateTime(id: string) {
  const [, date] = id.split(DELIMITERS.SAVE_ID)
  return new Date(date).getTime()
}

function byDateDescending(a: string, b: string) {
  return getDateTime(b) - getDateTime(a)
}

function makeProjects(projects: string[], likes: string[]) {
  return {
    drafts: projects.filter((id) => isDraft(id)).sort(byDateDescending),
    liked: projects.filter((id) => !isDraft(id) && likes.includes(id)).sort(byDateDescending),
    recent: projects.filter((id) => !isDraft(id) && !likes.includes(id)).sort(byDateDescending)
  }
}
////////////////

// export const Skeleton = view('skeleton',
//   class props {

//   },
//   class local { },
//   function actions({ $, fns, fn }) {
//     return fns(new class actions {

//     })
//   },
//   function effects({ $, fx, deps, refs }) {

//   }
// )
// type Skeleton = typeof Skeleton.Hook
