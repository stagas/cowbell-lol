/** @jsxImportSource minimal-view */

import { EditorScene } from 'canvy'
import { cheapRandomId, checksum, filterMap, modWrap, pick, sortCompare } from 'everyday-utils'
import { Matrix, Point, Rect } from 'geometrik'
import { IconSvg } from 'icon-svg'
import { chain, element, on, queue, view, web } from 'minimal-view'
import { compressUrlSafe, decompressUrlSafe } from 'urlsafe-lzma'
import { PianoKeys } from 'x-pianokeys'
import { Audio } from './audio'
import { ButtonIcon } from './button-icon'
import { ButtonPlay } from './button-play'
import * as db from './db'
import { beat1_12, beat1_2__1_4, beat1_4, kickCode, snareCode2 } from './demo-code'
import { Editor } from './editor'
import { EditorBuffer } from './editor-buffer'
import { Hint } from './hint'
import { NumberInput } from './number-input'
import { Player } from './player'
import { PlayerView } from './player-view'
import { Slider, SliderView } from './slider-view'
import { Spacer } from './spacer'
import { TrackView } from './track-view'
import { classes } from './util/classes'
import { delById, findEqual, get, replaceAtIndex } from './util/list'
import { emoji, randomName } from './util/random-name'
import * as storage from './util/storage'
import { Wavetracer } from './wavetracer'
import { diffChars } from 'diff'

export const PROJECT_KINDS = {
  SAVED: '0',
  DRAFT: '1',
  REMOTE: '2',
} as const

export const DELIMITERS = {
  SAVE_ID: ',',
  SHORT_ID: ',',
} as const

function getNewDraftProjectId() {
  return `${randomName(emoji)},${new Date().toISOString()},1`
}

const projectButtonRefs = new Map<string, HTMLElement>()

// credits: chat-gpt
function unique<T extends { id?: string }>(arr: T[]): T[] {
  const uniqueIds = new Set();

  return arr.reduce((acc, obj) => {
    // Check if the object's id is in the Set of unique ids
    if (!uniqueIds.has(obj.id)) {
      // If it is not, add the object to the accumulator array
      // and add its id to the Set of unique ids
      acc.push(obj);
      uniqueIds.add(obj.id);
    }
    return acc;
  }, [] as T[]);
}

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

export type Selected = { player: number, pattern?: number }

export let app: App

export type App = typeof App.Context

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

    audio = Audio({
      vol: 0.5,
      bpm: 120,
      audioContext: new AudioContext({
        sampleRate: 44100, latencyHint: 0.04
      }),
    })

    hint: JSX.Element = false

    players: Player[] = [
      Player({
        id: 'a', vol: 0.5, sound: 'b', pattern: 0, patterns: [
          'b', 'b', 'b', 'c',
          // 'b', 'b', 'b', 'c',
        ], audio: this.audio
      }),
      Player({
        id: 'b', vol: 0.5, sound: 'a', pattern: 0, patterns: [
          'a', 'a', 'a', 'a',
          // 'a', 'a', 'a', 'a',
        ], audio: this.audio
      }),
      // Player({ vol: 0.5, sound: 'b', pattern: 0, patterns: ['b', 'b', 'b', 'b'], audio: this.audio }),
      // Player({ vol: 0.5, sound: 'a', pattern: 0, patterns: ['a', 'a', 'a', 'a'], audio: this.audio }),
      // Player({ vol: 0.5, sound: 'b', pattern: 0, patterns: ['b', 'b', 'b', 'b'], audio: this.audio }),
      // Player({ vol: 0.5, sound: 'a', pattern: 0, patterns: ['a', 'a', 'a', 'a'], audio: this.audio }),
    ]

    selected: Selected = { player: 0 }

    player: Player = this.players[this.selected.player]

    sounds: EditorBuffer[] = [
      EditorBuffer({ id: 'b', kind: 'sound', value: kickCode, audio: this.audio, isDraft: false, isNew: false, isIntent: true }),
      EditorBuffer({ id: 'a', kind: 'sound', value: snareCode2, audio: this.audio, isDraft: false, isNew: false, isIntent: true }),
    ]

    patterns: EditorBuffer[] = [
      EditorBuffer({ id: 'b', kind: 'pattern', value: beat1_4, audio: this.audio, isDraft: false, isNew: false, isIntent: true }),
      EditorBuffer({ id: 'c', kind: 'pattern', value: beat1_12, audio: this.audio, isDraft: false, isNew: false, isIntent: true }),
      EditorBuffer({ id: 'a', kind: 'pattern', value: beat1_2__1_4, audio: this.audio, isDraft: false, isNew: false, isIntent: true }),
    ]

    editor?: InstanceType<typeof Editor.Element>
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

    project = storage.project.get(getNewDraftProjectId())
    projects: string[] = storage.projects.get([this.project])
    remoteProjects: string[] = []

    mainWaveform: JSX.Element = false
  },

  function actions({ $, fns, fn }) {
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

      toURL = (
        id: string,
        serialized: string,
        isFromUrl?: boolean
      ) => {
        const url = new URL(location.href)

        const [icon, date, , checksum] = id.split(DELIMITERS.SAVE_ID)

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

      fromURL = (
        url: URL | Location
      ) => {
        try {
          let hash = url.hash
          if (!hash.startsWith('#')) hash = '#' + hash

          if (hash.startsWith('#s=')) {
            hash = decodeURI(hash).split('#s=')[1] ?? ''
            if (!hash.length) return false

            const [icon, date, checksum, compressed] = hash.split(DELIMITERS.SAVE_ID)

            const equalItem = $.projects.find((project) =>
              project.split(',').at(-1) === checksum
            )

            if (equalItem) {
              console.log('found project from url in our own projects: ' + equalItem)
              this.fromProjectJSON(equalItem, JSON.parse(localStorage[equalItem]))
              return true
            }

            const id = [icon, date, '2', checksum].join(DELIMITERS.SAVE_ID)
            const serialized = decompressUrlSafe(compressed)

            localStorage[id] = serialized

            const json = JSON.parse(serialized)

            console.log('parsed url json:', json)

            $.projects = [...$.projects, id]
            this.fromProjectJSON(id, json)
            return true
          } else if (hash.startsWith('#p=')) {
            const id = decodeURI(hash).split('#p=')[1] ?? ''
            if (!id.length) return false
            this.fromProjectJSON(id, JSON.parse(localStorage[id]))
            return true
          } else {
            return false
          }
        } catch (error) {
          console.warn(error)
          return false
        }
      }

      onWindowPopState = () => {
        this.fromURL(location)
      }

      // working state
      save = () => {
        try {
          console.time('save')
          const json = this.toJSON(true)
          const res = JSON.stringify(json)
          localStorage.autoSave = res
          console.timeEnd('save')
          console.log('save:', res.length, json)
        } catch (error) {
          console.warn('Error while saving')
          console.warn(error)
        }

        this.onProjectSave(true)
      }

      autoSave = queue.debounce(5000)(this.save)

      fromJSON = (json: ReturnType<typeof this.toJSON>) => {
        Object.assign($.audio.$, json.audio)

        $.players = json.players.map((player) => Player({
          ...player,
          audio: $.audio,
          state: $.audio.$.state
        }))

        $.sounds = unique<EditorBuffer['$']>(json.sounds).map((props) => EditorBuffer({ ...props, kind: 'sound', audio: $.audio, isNew: false, isIntent: true }))

        $.patterns = unique<EditorBuffer['$']>(json.patterns).map((props) => EditorBuffer({ ...props, kind: 'pattern', audio: $.audio, isNew: false, isIntent: true }))
      }

      toJSON = (compact?: boolean) => {
        const bufferKeys: (keyof EditorBuffer['$'])[] = [
          'id',
          'value',
          'isDraft',
          // 'createdAt',
          'fallbackTitle',
          ...(compact ? [] : ['snapshot'] as const)
        ]

        return {
          audio: $.audio.$.toJSON(),

          players: $.players.map((player) =>
            pick(player.$, [
              'vol',
              'sound',
              'pattern',
              'patterns',
            ])
          ),

          sounds: $.sounds.map((sound) =>
            pick(sound.$, bufferKeys)
          ),

          patterns: $.patterns.map((pattern) =>
            pick(pattern.$, [
              ...bufferKeys,
              'numberOfBars'
            ])
          ),
        }
      }

      // projects

      publishCurrent = () => {
        this.publish($.project, localStorage[$.project])
      }

      // publish
      publish = (id: string, serialized: string) => {
        const hash = this.toURL(id, serialized)
        if (hash != null) {
          db.createShort(id, hash).then((short) => {
            prompt(
              'Here is your short url:\n(copy it and store it, click Ok when you\'re done)',
              `https://play.${location.hostname}/v2/${short.split(DELIMITERS.SHORT_ID)[3]}`
            )
          })
        }
      }

      // There are 3 cases saving a project.
      // - user has selected a project and made changes to it
      //   -> create draft and autosave
      // - user has made changes to draft
      //   -> autosave existing draft
      // - user explicitly saves a draft
      //   -> draft becomes not a draft and is saved in projects
      onProjectSave = (fromAutoSave?: boolean) => {
        try {
          console.time('save')

          // eslint-disable-next-line prefer-const
          let [icon, date, kind] = $.project.split(DELIMITERS.SAVE_ID)

          const draft = kind == PROJECT_KINDS.DRAFT

          const json = this.toProjectJSON()
          const res = JSON.stringify(json)

          const chk = checksum(res).toString()
          console.log('checksum:', chk, $.projects)

          if (fromAutoSave && $.projects.some((project) =>
            project.split(',').at(-1) === chk
          )) {
            console.timeEnd('save')
            console.warn('Did not save as it already exists. Make some changes first.')
            return
          }

          // NOTE: uncomment to debug why a save occured, what changed
          if (!draft) {
            const result = diffChars(localStorage[$.project], res)
            console.log(result)
          }

          let id: string

          if (!draft) {
            id = `${getNewDraftProjectId()},${chk}`
          } else {
            id = `${icon},${date},${!fromAutoSave ? '0' : '1'},${chk}`
          }

          localStorage[id] = res
          console.timeEnd('save')
          console.log('save:', id, res.length, json)

          // on explicit save
          if (!fromAutoSave) {
            if (draft) {
              // add to our projects
              $.projects = [
                // removing the draft id
                ...$.projects.filter((id) => id !== $.project),
                // and pushing the new saved project's id
                id
              ]
              this.publish(id, res)
            } else {
              // TODO: unreachable?
              $.projects = [...$.projects, id]
            }

            // then select it
            $.project = id
          }
          // on autosave
          else {
            // if it's a draft, replace the id
            if (draft) {
              if (id !== $.project) {
                const index = $.projects.indexOf($.project)
                $.projects.splice(index, 1, id)
                $.projects = [...$.projects]
                $.project = id
              }
            } else {
              $.projects = [...$.projects, id]
              $.project = id
            }
          }
        } catch (error) {
          console.warn('Error while saving project')
          console.warn(error)
        }
      }

      fromProjectJSON = (id: string, json: ReturnType<this['toProjectJSON']>) => {
        $.project = id

        $.selected = { player: 0 }

        $.audio.$.bpm = json.bpm

        // denormalize ids by making them all unique

        const idsMap = new Map<string, string>()

        for (const sound of json.sounds) {
          const newId = cheapRandomId()
          idsMap.set(`sound-${sound.id}`, newId)
          sound.id = newId
        }
        for (const pattern of json.patterns) {
          const newId = cheapRandomId()
          idsMap.set(`pattern-${pattern.id}`, newId)
          pattern.id = newId
        }

        // let y = 0
        for (const player of json.players) {

          // TODO: disabled temporarily until we resolve memory overlap
          // issues in monolang
          // if (y < $.players.length) {
          //   // @ts-ignore
          //   player.id = $.players[y].$.id!
          //   y++
          // }

          player.sound = idsMap.get(`sound-${player.sound}`) ?? json.sounds[0].id!
          player.patterns = player.patterns.map((p) =>
            idsMap.get(`pattern-${p}`) ?? json.patterns[0].id!
          )
        }

        const newSounds: EditorBuffer[] = []

        // if the sound exists in our own collection, use that and
        // replace the id with our own sound id,
        // otherwise add the sound with `isImport=true`
        for (const sound of unique(json.sounds)) {
          const equalItem = findEqual($.sounds, '-', sound)
          if (equalItem) {
            for (const player of json.players) {
              if (player.sound === sound.id) {
                player.sound = equalItem.$.id!
              }
            }
          } else {
            delete sound.fallbackTitle
            newSounds.push(EditorBuffer({
              ...sound,
              kind: 'sound',
              audio: $.audio,
              isNew: false,
              isDraft: false,
              isIntent: true,
              isImport: true
            }))
          }
        }

        $.sounds = [...$.sounds, ...newSounds]

        const newPatterns: EditorBuffer[] = []

        // if the pattern exists in our own collection, use that and
        // replace the id with our own pattern id,
        // otherwise add the pattern with `isImport=true`
        for (const pattern of unique(json.patterns)) {
          const equalItem = findEqual($.patterns, '-', pattern)
          if (equalItem) {
            for (const player of json.players) {
              player.patterns = player.patterns
                .join(',')
                .replaceAll(pattern.id!, equalItem.$.id!)
                .split(',')
            }
          } else {
            delete pattern.fallbackTitle
            newPatterns.push(EditorBuffer({
              ...pattern,
              kind: 'pattern',
              audio: $.audio,
              isNew: false,
              isDraft: false,
              isIntent: true,
              isImport: true
            }))
          }
        }

        $.patterns = [...$.patterns, ...newPatterns]

        $.players = json.players.map((player) => Player({
          ...player,
          pattern: 0,
          audio: $.audio,
          state: $.audio.$.state
        }))
      }

      toProjectJSON = () => {
        const bufferKeys: (keyof EditorBuffer['$'])[] = [
          'id',
          'value',
          // 'fallbackTitle',
        ]

        const usedSounds = new Set(
          $.players
            .map((player) =>
              player.$.sound)
        )

        const usedPatterns = new Set(
          $.players
            .flatMap((player) =>
              player.$.patterns)
        )

        const sounds = $.sounds.filter((sound) => usedSounds.has(sound.$.id!)).map((sound) =>
          pick(sound.$, bufferKeys)
        )

        const patterns = $.patterns.filter((pattern) => usedPatterns.has(pattern.$.id!)).map((pattern) =>
          pick(pattern.$, bufferKeys)
        )

        const players = $.players.map((player) =>
          pick(player.$, [
            'vol',
            'sound',
            'patterns',
          ])
        )

        // Normalize ids by their value checksum so that the overall
        // project checksum computes the same for every same project.
        // By normalizing the ids on save and denormalizing/assigning unique
        // when loading, we avoid conflicts, and the checksum computes
        // the same.
        const idsMap = new Map<string, string>()

        for (const sound of sounds) {
          const newId = `${checksum(sound.value)}`
          idsMap.set(`sound-${sound.id}`, newId)
          sound.id = newId
        }
        for (const pattern of patterns) {
          const newId = `${checksum(pattern.value)}`
          idsMap.set(`pattern-${pattern.id}`, newId)
          pattern.id = newId
        }

        // we sort buffers by their checksum id so that it's consistent
        // because we might have used buffers we already have so they will
        // not be in the same order (as new buffers go to the bottom)
        sounds.sort((a, b) => sortCompare(a.id!, b.id!))

        patterns.sort((a, b) => sortCompare(a.id!, b.id!))

        for (const player of players) {
          player.sound = idsMap.get(`sound-${player.sound}`)!
          player.patterns = player.patterns.map((p) =>
            idsMap.get(`pattern-${p}`)!
          )
        }

        return {
          bpm: $.audio.$.bpm,
          players,
          sounds,
          patterns,
        }
      }

      // buffers

      onBufferSave = (id: string, { kind }: { kind: string }) => {
        if (kind === 'sound') {
          this.onSoundSave(id)
        } else if (kind === 'pattern') {
          this.onPatternSave(id)
        }
      }

      // player

      onPlayerSoundSelect = (_: string, { y }: { y: number }) => {
        $.selected = { player: y }
      }

      onPlayerPatternSelect = (id: string, { x, y }: { x: number, y: number }) => {
        const player = $.players[y]
        player.$.pattern = x
        $.selected = { player: y, pattern: x }
      }

      onPlayerPatternPaste = (id: string, { x, y }: { x: number, y: number }) => {
        const p = $.selected.pattern
        if (p != null && x !== p) {
          const player = $.players[y]
          const pattern = player.$.patterns[p]
          player.$.patterns = replaceAtIndex(player.$.patterns, x, pattern)
          $.selected = { ...$.selected }
        }
      }

      // presets

      onPresetsRearrange = (id: string, { dir, kinds }: { dir: 1 | -1, kinds: 'sounds' | 'patterns' }) => {
        const buffers = $[kinds]

        const index = buffers.findIndex((buffer) => buffer.$.id === id)

        const dest = index + dir
        if (dest >= 0 && dest < buffers.length) {
          const bufs = [...buffers]
          const [buffer] = bufs.splice(index, 1)
          bufs.splice(dest, 0, buffer)
          $[kinds] = [...bufs]
        }
      }

      // sound

      onSoundSelect = (id: string) => {
        $.player.$.sound = id
        delete $.selected.pattern
        $.selected = { ...$.selected }
      }

      onSoundSave = (id: string) => {
        get($.sounds, id)!.$.isDraft = false
      }

      onSoundDelete = (id: string) => {
        const index = $.players.map((player) => player.$.sound).indexOf(id)
        if (!~index) {
          $.sounds = delById($.sounds, id)
        }
      }

      onSoundRearrange = (id: string, { dir }: { dir: 1 | -1 }) => {
        this.onPresetsRearrange(id, { dir, kinds: 'sounds' })
      }

      // pattern

      onPatternSelect = (id: string) => {
        const sel = $.selected
        const patterns = [...$.player.$.patterns]
        if (sel.pattern != null) {
          patterns[sel.pattern] = id
        } else {
          const index = $.player.$.pattern
          patterns[index] = id
          sel.pattern = index
        }
        $.player.$.patterns = patterns
        $.selected = { ...sel }
      }

      onPatternSave = (id: string) => {
        get($.patterns, id)!.$.isDraft = false
      }

      onPatternDelete = (id: string) => {
        const index = $.players.flatMap((player) => player.$.patterns).indexOf(id)
        if (!~index) {
          $.patterns = delById($.patterns, id)
        }
      }

      onPatternRearrange = (id: string, { dir }: { dir: 1 | -1 }) => {
        this.onPresetsRearrange(id, { dir, kinds: 'patterns' })
      }

      // editor

      focusEditor = fn(({ editor }) => () => {
        editor.$.editor?.focus()
      })
    })
  },

  function effects({ $, fx, deps, refs }) {
    app = $

    $.css = /*css*/`
    & {
      width: 100%;
      height: 100%;
      display: flex;
    }
    `

    try {
      $.fromJSON(JSON.parse(localStorage.autoSave))
    } catch (error) {
      console.warn('autoload failed:')
      console.warn(error)
    }

    try {
      $.save()
    } catch (error) {
      console.warn('initial autosave failed:')
      console.warn(error)
    }

    try {
      $.fromURL(location)
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
        background: #000;
        overflow: hidden;
      }
      `

      document.head.appendChild(bodyStyle)
    })

    fx(({ host }) =>
      chain(
        on(window, 'keydown')((e) => {
          const cmd = (e.ctrlKey || e.metaKey)

          if (cmd && e.shiftKey) {
            $.state = 'deleting'
          } else {
            $.state = 'idle'
          }

          if (cmd && e.code === 'Backquote') {
            e.preventDefault()
            e.stopPropagation()

            const sel = $.selected
            const player = $.players[sel.player]

            const dir = (e.shiftKey ? -1 : 1)

            if (sel.pattern != null) {
              let x = sel.pattern
              x = modWrap(x + dir, player.$.patterns.length)
              player.$.pattern = x
              $.selected = { player: sel.player, pattern: x }

            } else {
              let y = sel.player
              y = modWrap(y + dir, $.players.length)
              $.selected = { player: y }
            }
          }
          else if (cmd && e.key === ';') {
            $.focusEditor()

            const sel = $.selected
            const player = $.players[sel.player]

            if (sel.pattern == null) {
              sel.pattern = player.$.pattern
            } else {
              delete sel.pattern
            }
            $.selected = { ...sel }
          }
        }),
        on(window, 'keyup')((e) => {
          const cmd = (e.ctrlKey || e.metaKey)

          if (cmd && e.shiftKey) {
            $.state = 'deleting'
          } else {
            $.state = 'idle'
          }
        }),
        on(window, 'popstate')($.onWindowPopState),
      )
    )

    fx(({ players, selected }) => {
      $.player = players[selected.player]
    })

    fx(({ selected }) => {
      storage.selected.set(selected)
    })

    fx(({ projects }) => {
      storage.projects.set(projects)
    })

    fx(({ project }) => {
      storage.project.set(project)
    })

    fx(({ audio }) =>
      audio.fx(({ bpm: _ }) => {
        $.autoSave()
      })
    )

    fx(({ player, selected, sounds, patterns }) =>
      player.fx(({ sound, patterns: patternIds }) => {
        $.editorBuffer = selected.pattern != null
          ? get(patterns, patternIds[selected.pattern!])!
          : get(sounds, sound)!
      })
    )

    const VolSlider = (
      { id, running }: { id: string | number, running: boolean }
    ) => {
      const target = isFinite(+id)
        ? $.players[+id]
        : $.audio

      const slider = Slider({
        value: target.$.vol!,
        min: 0,
        max: 1,
        hue: 100,
        id: `${id}`,
        name: '',
      })

      return <SliderView
        id={`${id}`}
        slider={slider}
        vol={target.deps.vol}
        running={running}
        showBg={true}
      />
    }

    const iconPlay = <IconSvg
      set="feather"
      icon="play-circle"
    />

    const iconStop = <IconSvg
      set="feather"
      icon="stop-circle"
    />

    const iconDelete = <IconSvg
      style="color:#f21;"
      set="feather"
      icon="x-circle"
    />

    const maybeFocusProjectButton = (refs: Map<string, HTMLElement>) => {
      const el = refs.get($.project)
      if (el) {
        el.scrollIntoView()
      }
    }

    fx(({ project }) => {
      setTimeout(() => {
        maybeFocusProjectButton(projectButtonRefs)
      }, 100)
    })

    fx(({ player }) =>
      player.fx(({ view }) =>
        view.self.fx(({ workerBytes, workerFreqs }) =>
          player.fx(({ state, preview }) => {
            $.mainWaveform = <Wavetracer
              part="app-scroller"
              id="app-scroller"
              kind="scroller"
              running={state === 'running' || preview}
              workerBytes={workerBytes}
              workerFreqs={workerFreqs}
            />
          })
        )
      )
    )

    fx.task(({ state, project, projects, remoteProjects, audio, players, selected, sounds, patterns, editorBuffer, mainWaveform }) => {
      $.autoSave()

      const player = players[selected.player]

      const soundId = selected.pattern == null ? player.$.sound : null
      const patternId = selected.pattern != null ? player.$.patterns[selected.pattern] : null

      const sound = soundId ? get(sounds, soundId)! : false
      const pattern = patternId ? get(patterns, patternId)! : false

      const mixerMain =
        <div part="app-mixer">

          <div style="display: flex; flex-flow: row nowrap; width: 35%;">
            <ButtonPlay
              part="app-mixer-button"
              target={audio as any}
              running={iconStop}
              suspended={iconPlay}
            />

            <ButtonIcon part="app-mixer-button" onClick={() => {
              $.players.push(Player(player.$.derive()))
              $.players = [...$.players]
            }}>
              <IconSvg
                set="feather"
                icon="plus-circle"
              />
            </ButtonIcon>

            <VolSlider id="main" running={
              audio.$.state === 'running'
            } />

            <NumberInput
              part="app-bpm"
              min={1}
              max={666}
              value={audio.deps.bpm}
              step={1}
              align="x"
            />
          </div>

          <div part="app-projects">
            {filterMap(remoteProjects, (long) => {
              const [, icon, date, short, checksum] = long.split(DELIMITERS.SHORT_ID)
              const [pIcon, pDate, , pChecksum] = project.split(DELIMITERS.SAVE_ID)
              const a = [icon, date, checksum].join()
              const b = [pIcon, pDate, pChecksum].join()
              return <ButtonIcon
                key={long}
                part="app-mixer-button"
                onref={el => {
                  projectButtonRefs.set(long, el)
                }}
                title={[
                  `Click to Open ${icon}.`,
                  `Saved on: ${new Date(date).toLocaleString()}`,
                ].filter(Boolean).join('\n')}
                class={classes({
                  save: true,
                  selected: a === b
                })}
                onClick={() => {
                  $.fromRemoteProject(short, long)
                }}
              >
                {icon}
              </ButtonIcon>
            })}
          </div>

          <div part="app-projects">
            {filterMap(projects, (p) => {
              const [icon, date, kind] = p.split(DELIMITERS.SAVE_ID)
              if (kind != PROJECT_KINDS.SAVED) return

              return <ButtonIcon
                key={p}
                part="app-mixer-button"
                onref={el => {
                  projectButtonRefs.set(p, el)
                }}
                title={[
                  `Click to Open ${icon}.`,
                  `Saved on: ${new Date(date).toLocaleString()}`,
                  'Ctrl+Shift+Click to Delete.',
                ].filter(Boolean).join('\n')}
                class={classes({
                  save: true,
                  selected: p === project
                })}
                onClick={() => {
                  $.fromProjectJSON(p, JSON.parse(localStorage[p]))
                  location.hash = `p=${p}`
                }}
                onCtrlShiftClick={() => {
                  $.projects = $.projects.filter((id) => id !== p)
                }}
              >
                {icon}
              </ButtonIcon>
            })}
          </div>

          <div part="app-drafts">
            {filterMap(projects, (p) => {
              const [icon, , isDraft] = p.split(DELIMITERS.SAVE_ID)
              if (isDraft != '1') return

              return <ButtonIcon
                key={p}
                part="app-mixer-button"
                onref={el => {
                  projectButtonRefs.set(p, el)
                }}
                title={[
                  p === project && 'Double click to Save.',
                  p !== project && 'Ctrl+Shift+Click to Delete.',
                ].filter(Boolean).join('\n')}
                class={classes({
                  draft: true,
                  selected: p === project
                })}
                onClick={p !== project && (() => {
                  $.fromProjectJSON(p, JSON.parse(localStorage[p]))
                  location.hash = `p=${p}`
                })}
                onDblClick={p === project && (() => {
                  $.onProjectSave()
                })}
                onCtrlShiftClick={p !== project && (() => {
                  $.projects = $.projects.filter((id) => id !== p)
                })}
              >
                {icon}
              </ButtonIcon>
            })}
          </div>

          <ButtonIcon
            key="share"
            part="app-mixer-button"
            title="Get short URL to Share"
            onClick={$.publishCurrent}
          >
            <IconSvg set="feather" icon="send" />
          </ButtonIcon>
        </div>

      const soundPresets = <div part="app-presets">
        {sounds.map((sound) =>
          <TrackView
            key={sound.$.id!}
            canFocus
            active={sound.$.id === soundId}
            audio={audio}
            sound={sound}
            clickMeta={sound.$}
            onClick={$.onSoundSelect}
            onDblClick={$.onSoundSave}
            onCtrlShiftClick={$.onSoundDelete}
            onRearrange={$.onSoundRearrange}
          />
        )}
      </div>

      const patternPresets = <div part="app-presets">
        {patterns.map((pattern) =>
          <TrackView
            key={pattern.$.id!}
            canFocus
            active={pattern.$.id === patternId}
            getTime={audio.$.getTime}
            pattern={pattern}
            clickMeta={pattern.$}
            onClick={$.onPatternSelect}
            onDblClick={$.onPatternSave}
            onCtrlShiftClick={$.onPatternDelete}
            onRearrange={$.onPatternRearrange}
          />
        )}
      </div>

      const playersView =
        <Spacer
          id="app-players"
          part="app-players"
          align="x"
          initial={[0, 0.15, 0.5]}
        >
          <div part="app-players-mixer">
            {players.map((player, y) =>
              <div part="app-player-controls">
                <ButtonPlay
                  part="app-player-play"
                  target={player as any}
                  running={state === 'deleting' ? iconDelete : iconStop}
                  suspended={state === 'deleting' ? iconDelete : iconPlay}
                  onDelete={() => {
                    if ($.players.length > 1 && $.selected.player !== y) {
                      if ($.selected.player > y) $.selected.player--
                      $.players.splice(y, 1)
                      $.players = [...$.players]
                      $.selected = { ...$.selected }
                    }
                  }}
                />
                <VolSlider id={y} running={
                  player.$.state === 'running'
                } />
              </div>
            )}
          </div>

          <div part="app-player-sounds">
            {players.map((player, y) => {
              return <TrackView
                part="app-player-sound"
                leftAlignLabel
                sliders
                active={selected.player === y && player.$.sound === soundId}
                audio={audio}
                player={player}
                sound={get(sounds, player.$.sound)!}
                clickMeta={{ id: player.$.sound, y }}
                onClick={$.onPlayerSoundSelect}
                onDblClick={$.onSoundSave}
              />
            })}
          </div>

          <div part="app-player-patterns">
            {players.map((player, y) => {
              return <div style="height:0">
                {
                  player.$.patterns.map((id, x) => {
                    const pattern = get(patterns, id)!
                    return <TrackView
                      part="app-player-pattern"
                      active={selected.player === y && selected.pattern === x && id === patternId}
                      live={player.$.pattern === x}
                      xPos={x}
                      audio={audio}
                      getTime={audio.$.getTime}
                      player={player}
                      pattern={pattern}
                      clickMeta={{ id, x, y }}
                      onClick={$.onPlayerPatternSelect}
                      onDblClick={$.onPatternSave}
                      onAltClick={selected.pattern != null && player.$.pattern !== x && $.onPlayerPatternPaste}
                    />
                  })
                }
              </div>
            })}
          </div>
        </Spacer>

      $.view = <>
        <Hint message={deps.hint} />

        {players.map((player, y) =>
          <PlayerView
            key={player.$.id!}
            id={player.$.id!}
            audio={$.audio}
            player={player}
          />
        )}

        <Spacer
          id="app"
          part="app"
          align="x"
          initial={[0, 0.1, 0.9]}
        >
          {soundPresets}

          <div part="app-inner">
            {mixerMain}

            <div part="app-main-outer">
              <Spacer
                id="app-main"
                part="app-main"
                align="y"
                initial={[0, 0.5]}
              >
                {playersView}

                <div>
                  {mainWaveform}

                  <Spacer
                    id="app-selected"
                    part="app-selected"
                    align="x"
                    reverse={true}
                    initial={[0, 0.5]}
                  >
                    <Editor
                      ref={refs.editor}
                      part="app-editor"
                      name="editor"
                      player={player}
                      buffer={editorBuffer}
                    />

                    <TrackView
                      active={false}
                      // showLabel={false}
                      padded
                      leftAlignLabel={selected.pattern == null}
                      sliders
                      player={player}
                      audio={audio}
                      sound={sound}
                      pattern={pattern}
                      getTime={audio.$.getTime}
                      clickMeta={editorBuffer.$}
                      onDblClick={$.onBufferSave}
                    />

                  </Spacer>
                </div>

              </Spacer>
            </div>

            <PianoKeys
              invertColors
              halfOctaves={7}
              startOctave={2}
              audioContext={audio.$.audioContext}
              onmidimessage={e => {
                if (!$.player.$.preview) {
                  $.player.$.startPreview()
                }
                $.player.$.view?.monoNode?.processMidiEvent(e)
              }}
              style="max-height: 100px; pointer-events: all"
            />
          </div>

          {patternPresets}

        </Spacer>

      </>
    })
  }
))

////////////////

export const Skeleton = view('skeleton',
  class props {

  },
  class local { },
  function actions({ $, fns, fn }) {
    return fns(new class actions {

    })
  },
  function effects({ $, fx, deps, refs }) {

  }
)
type Skeleton = typeof Skeleton.Hook
