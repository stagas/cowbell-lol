/** @jsxImportSource minimal-view */

import { EditorScene } from 'canvy'
import { modWrap, pick } from 'everyday-utils'
import { Matrix, Point, Rect } from 'geometrik'
import { IconSvg } from 'icon-svg'
import { chain, element, on, queue, view, web } from 'minimal-view'
import { Audio } from './audio'
import { ButtonIcon } from './button-icon'
import { ButtonPlay } from './button-play'
import { beat1_12, beat1_2__1_4, beat1_4, kickCode, snareCode2 } from './demo-code'
import { Editor } from './editor'
import { EditorBuffer } from './editor-buffer'
import { Hint } from './hint'
import { NumberInput } from './number-input'
import { Player } from './player'
import { PlayerView } from './player-view'
import { SliderView, Slider } from './slider-view'
import { Spacer } from './spacer'
import { TrackView } from './track-view'
import { classes } from './util/classes'
import { get, delById } from './util/list'
import { emoji, randomName } from './util/random-name'
import { selected, setSelected } from './util/storage'

// function deepObj(o: any) {
//   return Object.assign(o, { equals: isEqual })
// }

// function kindsOf(buffer: EditorBuffer) {
//   if (buffer.$.kind === 'sound') return 'sounds'
//   else if (buffer.$.kind === 'pattern') return 'patterns'
//   else throw new Error('Unreachable: unknown buffer kind: ' + buffer.$.kind)
// }

export type Selected = { player: number, pattern?: number }

export let app: App

export type App = typeof App.Context

export const App = web(view('app',
  class props {
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
        vol: 0.5, sound: 'b', pattern: 0, patterns: [
          'b', 'b', 'b', 'c',
          // 'b', 'b', 'b', 'c',
        ], audio: this.audio
      }),
      Player({
        vol: 0.5, sound: 'a', pattern: 0, patterns: [
          'a', 'a', 'a', 'a',
          // 'a', 'a', 'a', 'a',
        ], audio: this.audio
      }),
      // Player({ vol: 0.5, sound: 'b', pattern: 0, patterns: ['b', 'b', 'b', 'b'], audio: this.audio }),
      // Player({ vol: 0.5, sound: 'a', pattern: 0, patterns: ['a', 'a', 'a', 'a'], audio: this.audio }),
      // Player({ vol: 0.5, sound: 'b', pattern: 0, patterns: ['b', 'b', 'b', 'b'], audio: this.audio }),
      // Player({ vol: 0.5, sound: 'a', pattern: 0, patterns: ['a', 'a', 'a', 'a'], audio: this.audio }),
    ]

    selected: Selected = selected({ player: 0 })

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

    drafts = [randomName(emoji), randomName(emoji), randomName(emoji)]
    draft = this.drafts[0]
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      fromJSON = (json: ReturnType<typeof this.toJSON>) => {
        Object.assign($.audio.$, json.audio)

        $.players = json.players.map((player) => Player({
          ...player,
          audio: $.audio,
          state: $.audio.$.state
        }))

        $.sounds = json.sounds.map((props) => EditorBuffer({ ...props, kind: 'sound', audio: $.audio, isNew: false, isIntent: true }))

        $.patterns = json.patterns.map((props) => EditorBuffer({ ...props, kind: 'pattern', audio: $.audio, isNew: false, isIntent: true }))
      }

      toJSON = (compact?: boolean) => {
        const bufferKeys: (keyof EditorBuffer['$'])[] = [
          'id',
          'value',
          'isDraft',
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

      autoSave = queue.debounce(850)(() => {
        const json = this.toJSON(true)
        try {
          console.time('autosave')
          const res = JSON.stringify(json)
          localStorage.autoSave = res
          console.timeEnd('autosave')
          console.log('autosave:', res.length, json)
        } catch (error) {
          console.warn('Error saving')
          console.warn(error)
        }
      })

      setSpacer = (id: string, sizes: number[]) => {
        localStorage[`spacer-${id}`] = sizes
      }

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

      // pattern

      onPatternSelect = (id: string) => {
        const sel = $.selected
        if (sel.pattern != null) {
          $.player.$.patterns[sel.pattern] = id
        } else {
          const index = $.player.$.pattern
          $.player.$.patterns[index] = id
          sel.pattern = index
        }
        $.player.$.patterns = [...$.player.$.patterns]
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
        })
      )
    )

    fx(({ players, selected }) => {
      $.player = players[selected.player]
    })

    fx(({ selected }) => {
      setSelected(selected)
    })

    fx(({ player, selected, sounds, patterns }) =>
      player.fx(({ sound, patterns: patternIds }) => {
        $.editorBuffer = selected.pattern != null
          ? get(patterns, patternIds[selected.pattern!])!
          : get(sounds, sound)!
      })
    )

    const VolSlider = (
      { id, vertical, running }: { id: string | number, vertical?: boolean, running: boolean }
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

    fx.task(({ state, draft, drafts, audio, players, selected, sounds, patterns, editorBuffer }) => {
      $.autoSave()

      const player = players[selected.player]

      const soundId = selected.pattern == null ? player.$.sound : null
      const patternId = selected.pattern != null ? player.$.patterns[selected.pattern] : null

      const sound = soundId ? get(sounds, soundId)! : false
      const pattern = patternId ? get(patterns, patternId)! : false

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

      const soundPresets = <div part="app-presets">
        {sounds.map((sound) =>
          <TrackView
            key={sound.$.id!}
            active={sound.$.id === soundId}
            audio={audio}
            sound={sound}
            clickMeta={sound.$}
            onClick={$.onSoundSelect}
            onDblClick={$.onSoundSave}
            onCtrlShiftClick={$.onSoundDelete}
          />
        )}
      </div>

      const patternPresets = <div part="app-presets">
        {patterns.map((pattern) =>
          <TrackView
            key={pattern.$.id!}
            active={pattern.$.id === patternId}
            getTime={audio.$.getTime}
            pattern={pattern}
            clickMeta={pattern.$}
            onClick={$.onPatternSelect}
            onDblClick={$.onPatternSave}
            onCtrlShiftClick={$.onPatternDelete}
          />
        )}
      </div>

      const playersView =
        <Spacer
          id="app-players"
          part="app-players"
          align="x"
          initial={[0, 0.15, 0.5]}
          setSpacer={$.setSpacer}
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
                onCtrlShiftClick={$.onSoundDelete}
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
                      onCtrlShiftClick={$.onPatternDelete}
                    />
                  })
                }
              </div>
            })}
          </div>
        </Spacer>

      const mixerMain =
        <div part="app-mixer">
          <div style="display: flex; flex-flow: row nowrap; width: 50%;">

            <ButtonIcon part="app-mixer-button" onClick={() => {
              $.players.push(Player(player.$.derive()))
              $.players = [...$.players]
            }}>
              <IconSvg
                set="feather"
                icon="plus-circle"
              />
            </ButtonIcon>

            <ButtonPlay
              part="app-mixer-button"
              target={audio as any}
              running={iconStop}
              suspended={iconPlay}
            />

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
            {Array.from({ length: 25 }, () =>
              <ButtonIcon part="app-mixer-button" class="save" onClick={() => {
                //
              }}>
                {randomName(emoji)}
              </ButtonIcon>
            )}
          </div>

          <div part="app-drafts">
            {drafts.map((icon) =>
              <ButtonIcon part="app-mixer-button" class={classes({
                draft: true,
                selected: icon === draft
              })} onClick={() => {
              }}>
                {icon}
              </ButtonIcon>
            )}
          </div>

        </div>

      $.view = <>
        <Hint message={deps.hint} />

        {players.map((player, y) =>
          <PlayerView
            key={player}
            audio={audio}
            player={player}
          />
        )}

        <Spacer
          id="app"
          part="app"
          align="x"
          initial={[0, 0.1, 0.9]}
          setSpacer={$.setSpacer}
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
                setSpacer={$.setSpacer}
              >
                {playersView}

                <Spacer
                  id="app-selected"
                  part="app-selected"
                  align="x"
                  reverse={true}
                  initial={[0, 0.25]}
                  setSpacer={$.setSpacer}
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
                    // padded
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

              </Spacer>
            </div>
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
