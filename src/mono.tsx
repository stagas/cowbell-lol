/** @jsxImportSource minimal-view */

import { web, view, element } from 'minimal-view'
import { MonoNode } from 'mono-worklet'

import { Button, Editor, Waveform } from './components'

export const Mono = web('mono', view(
  class props {
    monoNode!: MonoNode
    audioContext!: AudioContext
    editorValue!: string
  }, class local {
  host = element
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

  fx(({ monoNode }) => {
    monoNode?.worklet.setTimeToSuspend(Infinity)
  })

  fx.debounce(250)(async ({ monoNode, code }) => {
    try {
      const prev = $.state
      $.state = 'compiling'
      // console.log('compile', code)
      await monoNode.setCode(code)
      // monoNode.connect(audioContext.destination)
      // monoNode.connect(analyser)
      if (prev !== 'running') $.state = 'suspended'
      else $.state = 'running'
      start()
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

  $.css = /*css*/`
  & {
    display: flex;
    flex-flow: row wrap;
    background: #444;
    gap: 10px;
    position: relative;

    > * {
      flex: 1;
    }
  }
/*
  ${Waveform} {
    z-index: 0;
    width: 100%;
    height: 100%;
  } */

  ${Editor} {
    z-index: 1;
    display: block;
    /* position: relative; */
    width: 100%;
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
    right: 0;
  }
  `
  fx(({ host, state }) => {
    host.style.background = {
      ['running']: 'green',
      ['compiling']: 'cyan',
      ['error']: 'red',
      ['idle']: '#111',
      ['suspended']: '#444',
    }[state]
  })

  fx(({ state, analyser }) => {
    $.view = <>
      <Waveform
        analyser={analyser}
        width={100}
        height={50}
        running={state !== 'suspended'}
      />
      <Editor key="editor" value={deps.code} rows={15} />
      <div part="controls">
        <Button onClick={start}>
          start
        </Button>

        <Button onClick={stop}>
          stop
        </Button>
      </div>
    </>
  })
}))
