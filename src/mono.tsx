/** @jsxImportSource minimal-view */

import { web, view, element, abort } from 'minimal-view'

import { EditorScene } from 'canvy'
import { MonoNode } from 'mono-worklet'
import { IconSvg } from 'icon-svg'

import { Button, Code, Waveform, Spacer, Presets } from './components'
import { MachineData } from './machine-data'
import type { App } from './app'

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
  }, class local {
  host = element

  state?: 'idle' | 'error' | 'compiling' | 'running' | 'suspended' = 'idle'

  fftSize = 32
  analyser?: AnalyserNode

  monoNode?: MonoNode
  monoCode!: string
}, ({ $, fx, fn, deps }) => {
  $.css = /*css*/`
  & {
    display: flex;
    flex-flow: row wrap;
    max-height: 100%;
    max-width: 100%;
  }

  [part=controls] {
    z-index: 2;
    font-family: system-ui;
    display: flex;
    flex-flow: row wrap;
    gap: 7px;
    position: absolute;
    margin: 7px;
    top: 0;
    left: 0;
  }
  `

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

  let prev: any
  fx.debounce(250)(abort.latest(signal => async ({ app, id, monoNode, monoCode }) => {
    try {
      prev ??= $.state
      $.state = 'compiling'

      await monoNode.setCode(monoCode)
      if (signal.aborted) return

      localStorage.monoCode = monoCode

      if (prev === 'suspended' || prev === 'idle') {
        $.state = 'suspended'
      } else {
        start()
      }

      prev = null
    } catch (error) {
      console.log(error)
      $.state = 'error'
    }
  }))

  const start = fn(({ audioContext, analyser, monoNode }) => () => {
    monoNode.connect(audioContext.destination)
    monoNode.connect(analyser)
    $.state = 'running'
  })

  const stop = fn(({ audioContext, analyser, monoNode }) => () => {
    if ($.state === 'suspended') return
    try {
      monoNode.disconnect(audioContext.destination)
    } catch (err) { console.warn(err) }
    try {
      monoNode.disconnect(analyser)
    } catch (err) { console.warn(err) }
    try {
      monoNode.worklet.suspend()
    } catch (err) { console.warn(err) }
    $.state = 'suspended'
  })

  fx(({ app, id, host, editorScene, state, spacer, analyser, detail, presets, monoCode }) => {
    // console.log('PRRESETS', presets, detail)
    $.view = <>
      <div part="controls">
        <Button onClick={start} style={{
          color: {
            ['running']: 'green',
            ['compiling']: 'cyan',
            ['error']: 'red',
            ['idle']: '#333',
            ['suspended']: '#666',
          }[state]
        }}>
          <IconSvg set="feather" icon="play-circle" />
        </Button>

        <Button onClick={stop} style={{
          color: {
            ['running']: '#fff',
            ['compiling']: '#444',
            ['error']: '#444',
            ['idle']: '#444',
            ['suspended']: '#444',
          }[state]
        }}>
          <IconSvg set="feather" icon="stop-circle" />
        </Button>
      </div>
      <Spacer part="spacer" app={app} id={id} layout={host} initial={spacer}>
        <Waveform
          analyser={analyser}
          width={100}
          height={50}
          running={state !== 'suspended'}
        />
        <Code
          editorScene={editorScene} value={deps.monoCode}
        />
        <Presets
          app={app}
          id={id}
          detail={detail}
          presets={presets}
        />
      </Spacer>
    </>
  })
}))
