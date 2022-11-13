/** @jsxImportSource minimal-view */

import { web, view } from 'minimal-view'
import { MonoNode } from 'mono-worklet'

import { Button, Editor, Waveform } from './components'

export const Mono = web('mono', view(
  class props {
    audioContext!: AudioContext
    editorValue!: string
  }, class local {
  state?: 'idle' | 'error' | 'compiling' | 'running' | 'suspended' = 'idle'
  code!: string
  fftSize = 32
  monoNode?: MonoNode
  analyser?: AnalyserNode
}, ({ $, fx, fn, deps }) => {
  fx(({ editorValue }) => {
    $.code ??= editorValue
  })

  fx(({ audioContext, fftSize }) => {
    $.analyser = new AnalyserNode(audioContext, {
      channelCount: 1,
      fftSize: fftSize,
      smoothingTimeConstant: 0.5
    })
  })

  fx(async ({ audioContext, analyser }) => {
    $.monoNode = await MonoNode.create(audioContext, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      processorOptions: {
        metrics: 0,
      },
    })

    // keep alive
    $.monoNode?.worklet.processMidiEvents()
    $.monoNode?.worklet.setTimeToSuspend(Infinity)
  })

  fx(async ({ audioContext, analyser, monoNode, code }) => {
    try {
      $.state = 'compiling'
      // console.log('compile', code)
      await monoNode.setCode(code)
      monoNode.connect(audioContext.destination)
      monoNode.connect(analyser)
      $.state = 'running'
    } catch (error) {
      console.log(error)
      $.state = 'error'
    }
  })

  const start = fn(({ audioContext, analyser, monoNode }) => () => {
    monoNode.connect(audioContext.destination)
    monoNode.connect(analyser)
    $.monoNode?.worklet.resetTimeAndWakeup()
    $.state = 'running'
  })

  const stop = fn(({ monoNode }) => () => {
    monoNode.disconnect()
    monoNode.worklet.suspend()
    $.state = 'suspended'
  })

  $.css = /*css*/`
  & {
    display: flex;
    flex-flow: row wrap;
    background: brown;
    padding: 10px;
    gap: 10px;

    > * {
      flex: 1;
    }
  }
  `
  fx(({ state, analyser }) => {
    $.view = <>
      <Waveform analyser={analyser} width={100} height={50} />

      <div>
        <Editor key="editor" value={deps.code} />

        <Button onClick={start}>
          start
        </Button>

        <Button onClick={stop}>
          stop
        </Button>

        {state}
      </div>
    </>
  })
}))
