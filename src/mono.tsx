/** @jsxImportSource minimal-view */

import { EditorScene } from 'canvy'
import { web, view, element } from 'minimal-view'
import { MonoNode } from 'mono-worklet'
import { IconSvg } from 'icon-svg'

import { Button, Code, Waveform, Spacer } from './components'

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
   lpf(#::play:sum*5,
   400+300*sine(.125)),
   0.95);
  x=x+daverb(x)*0.4;
  x
)
`

interface MonoDetail {
  editorValue: string
}

export const Mono = web('mono', view(
  class props {
    audioContext!: AudioContext
    editorScene!: EditorScene

    audioNode!: AudioNode
    outputs!: AudioNode[]
    detail!: MonoDetail
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

  /* [part=spacer] {
    height: 180px;
  } */
  [part=indicator] {
    width: 9px;
    height: 9px;
    margin: 6.2px;
    border-radius: 100%;
  }
  `

  fx(({ audioNode }) => {
    $.monoNode = audioNode as any
  })

  fx(({ detail }) => {
    $.monoCode ??= detail.editorValue ?? (localStorage.monoCode || monoDefaultEditorValue)
  })

  fx(({ audioContext, fftSize }) => {
    $.analyser = new AnalyserNode(audioContext, {
      channelCount: 1,
      fftSize: fftSize,
      smoothingTimeConstant: 0.5
    })
  })

  // fx(async ({ audioContext }) => {
  //   $.monoNode = await MonoNode.create(audioContext, {
  //     numberOfInputs: 0,
  //     numberOfOutputs: 1,
  //     processorOptions: {
  //       metrics: 0,
  //     },
  //   })
  //   $.monoNode?.worklet.setTimeToSuspend(Infinity)
  // })

  fx.debounce(250)(async ({ monoNode, monoCode: code }) => {
    try {
      const prev = $.state
      $.state = 'compiling'

      await monoNode.setCode(code)
      if (prev !== 'running' && prev !== 'compiling' && prev !== 'error') $.state = 'suspended'
      localStorage.monoCode = code
      $.state = 'running'
      // start()
    } catch (error) {
      console.log(error)
      $.state = 'error'
    }
  })

  const start = fn(({ audioContext, analyser, monoNode }) => () => {
    monoNode.connect(audioContext.destination)
    monoNode.connect(analyser)
    // monoNode.worklet.processMidiEvents()
    $.state = 'running'
  })

  const stop = fn(({ audioContext, monoNode }) => () => {
    monoNode.disconnect(audioContext.destination)
    monoNode.worklet.suspend()
    $.state = 'suspended'
  })

  fx(({ host, editorScene, state, analyser, monoCode }) => {
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
      <Spacer part="spacer" layout={host} initial={[0, .5]}>
        <Waveform
          analyser={analyser}
          width={100}
          height={50}
          running={state !== 'suspended'}
        />
        <Code
          editorScene={editorScene} value={deps.monoCode}
        />
      </Spacer>
    </>
  })
}))

// {/* <Scheduler
// editorScene={editorScene}
// editorValue={schedulerEditorValue}
// schedulerNode={schedulerNode}
// targetNode={monoNode}
// /> */}
