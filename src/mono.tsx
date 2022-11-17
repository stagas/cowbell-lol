/** @jsxImportSource minimal-view */

import { web, view, element, abort } from 'minimal-view'

import { EditorScene } from 'canvy'
import { MonoNode } from 'mono-worklet'
import { IconSvg } from 'icon-svg'

import { Button, Code, Waveform, Spacer, Presets } from './components'
import { MachineData } from './machine-data'
import type { App } from './app'
import { setParam } from './util/audio'

const monoDefaultEditorValue = `\\\\\\ a track \\\\\\
#:6,3;
write_note(x,y)=(
  #=(t,note_to_hz(x),y/127);
  0
);
midi_in(op=0,x=0,y=0)=(
  op==144 && write_note(x,y)
);
play(nt,x,y)=(
  saw(x/4)*env(nt, 100, 30)*y
);
f()=(
  x=tanh(
    lpf(
      #::play:sum*5,
      400+300*sine(.125),
      0.95
    )*3
  );
  x=x+daverb(x)*0.4;
  x
)
`

export interface MonoDetail {
  editorValue: string
}

export const Mono = web('mono', view(
  class props extends MachineData<MonoDetail> {
    app!: App

    audioContext!: AudioContext
    editorScene!: EditorScene
    audioNode!: AudioNode

    showRemoveButton = false
  }, class local {
  host = element

  state?: 'idle' | 'error' | 'compiling' | 'running' | 'suspended' = 'idle'

  fftSize = 32
  analyser?: AnalyserNode

  monoNode?: MonoNode
  monoCode!: string
  gainNode?: GainNode
}, ({ $, fx, fn, deps }) => {
  $.css = /*css*/`
  & {
    display: flex;
    flex-flow: row wrap;
    max-height: 100%;
    max-width: 100%;
  }

  [part=controls] {
    z-index: 999999;
    font-family: system-ui;
    display: flex;
    flex-flow: row wrap;
    gap: 7px;
    position: absolute;
    margin: 7px;
    top: 0;
    left: 0;

    ${Button} {
      cursor: pointer;
      opacity: 0.35;
      &[part=remove] {
        opacity: 0.7;
      }
      &:hover {
        opacity: 1;
      }
    }
  }

  &([state=running]) [part=controls] ${Button} {
    opacity: 1;
    &:hover {
      color: #fff !important;
    }
  }
  `

  fx.raf(({ host, state }) => {
    host.setAttribute('state', state)
  })

  fx(({ audioNode }) => {
    $.monoNode = audioNode as any
  })

  fx(({ detail }) => {
    $.monoCode = (detail && detail.editorValue) || (localStorage.monoCode || monoDefaultEditorValue)
  })

  fx(({ app, id, monoCode }) => {
    app.onDetailChange(id, { editorValue: monoCode })
  })

  fx(({ audioContext, fftSize }) => {
    $.analyser = new AnalyserNode(audioContext, {
      channelCount: 1,
      fftSize: fftSize,
      smoothingTimeConstant: 0.5
    })
  })

  fx(({ audioContext, analyser, monoNode }) => {
    const gainNode = $.gainNode = new GainNode(audioContext, { channelCount: 1, gain: 0 })
    monoNode.connect(gainNode)
    monoNode.connect(analyser)
    gainNode.connect(audioContext.destination)

    return () => {
      setParam(audioContext, gainNode.gain, 0)
      setTimeout(() => {
        gainNode.disconnect(audioContext.destination)
        monoNode.disconnect(gainNode)
      }, 50)
    }
  })

  let prev: any
  fx.debounce(250)(abort.latest(signal => async ({ app, id, monoNode, monoCode }) => {
    try {
      prev ??= $.state
      $.state = 'compiling'

      await monoNode.setCode(monoCode)
      if (signal.aborted) return

      localStorage.monoCode = monoCode

      // @ts-ignore $.state might have changed during our await above but TS
      // has narrowed it down to 'compiling' and warns this path will always be true.
      if ($.state !== 'running') {
        if (prev === 'suspended' || prev === 'idle') {
          $.state = 'suspended'
          monoNode.suspend()
        } else {
          start()
        }
      }

      prev = null
    } catch (error) {
      console.log(error)
      $.state = 'error'
    }
  }))

  const start = fn(({ audioContext, analyser, monoNode, gainNode }) => () => {
    setParam(audioContext, gainNode.gain, 1)
    monoNode.connect(analyser)
    monoNode.resume()
    $.state = 'running'
  })

  const stop = fn(({ audioContext, analyser, monoNode, gainNode }) => () => {
    if ($.state === 'suspended') return
    setParam(audioContext, gainNode.gain, 0)
    // try {
    //   monoNode.disconnect(audioContext.destination)
    // } catch (err) { console.warn(err) }
    try {
      monoNode.disconnect(analyser)
    } catch (err) { console.warn(err) }
    try {
      monoNode.suspend()
    } catch (err) { console.warn(err) }

    $.state = 'suspended'
  })

  fx(({ app, id, groupId, host, editorScene, state, spacer, analyser, detail, presets, showRemoveButton }) => {
    // console.log('PRRESETS', presets, detail)
    $.view = <>
      <div part="controls">
        <Button shadow={3} onClick={state === 'running' ? stop : start} style={{
          color: {
            ['running']: '#1f3',
            ['compiling']: 'cyan',
            ['error']: 'red',
            ['idle']: '#334',
            ['suspended']: '#667',
          }[state]
        }}>
          <IconSvg set="feather" icon={state === 'running' ? "stop-circle" : "play-circle"} />
        </Button>
        {
          showRemoveButton && state === 'suspended' &&
          <Button part="remove" shadow={3} onClick={() =>
            app.removeMachinesInGroup(groupId)} style={{
              color: '#f30'
            }}>
            <IconSvg set="feather" icon="x-circle" />
          </Button>
        }
      </div>
      <Spacer part="spacer" app={app} id={id} layout={host} initial={spacer}>
        <Waveform
          part="waveform"
          analyser={analyser}
          width={100}
          height={50}
          running={state !== 'suspended'}
        />
        <Code
          style="border-bottom: 2px solid transparent"
          editorScene={editorScene} value={deps.monoCode}
        />
        <Presets
          style="border-bottom: 2px solid transparent"
          app={app}
          id={id}
          detail={detail}
          presets={presets}
        />
      </Spacer>
    </>
  })
}))
