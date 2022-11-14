/** @jsxImportSource minimal-view */

import { web, view, element, enableDebug } from 'minimal-view'
import { MonoNode } from 'mono-worklet'
import { SchedulerNode } from 'scheduler-node'
import { Mono, Scheduler } from './components'

if (false) enableDebug()

const schedulerDefaultEditorValue = `\
on(1/4, x => [x, 20+rnd(20), rnd(127), 0.1])
on(1/4, x => [x+1/8, 20+rnd(20), rnd(17), 0.1])
`

const monoDefaultEditorValue = `


#:6,3;
write_note(x,y)=(
  #=(t,note_to_hz(x),y/127);
  0
);
midi_in(op=0,x=0,y=0)=(
  op==144 && write_note(x,y);drop;
  0
);
play(nt,x,y)=(
  saw(x/4)*env(nt, 10, 30)*y
);
f()=#::play:sum


`

export const App = web('app', view(
  class props {
    numberOfItems = 1
  }, class local {
  host = element

  audioContext = new AudioContext({ sampleRate: 44100, latencyHint: 0.04 })

  items: any[] = []
  itemsView: JSX.Element = false

  startTime?: number
  // glicol?: Glicol

  monoNode?: MonoNode
  monoEditorValue = monoDefaultEditorValue

  schedulerNode?: SchedulerNode
  schedulerEditorValue = schedulerDefaultEditorValue
}, ({ $, fx, deps }) => {
  $.css = /*css*/`
  & {
    display: flex;
    flex-flow: column wrap;
    background: #222;
    padding: 10px;
    gap: 10px;
    transition: transform 100ms ease-out;

    > * {
      flex: 1;
    }
  }
  `
  // fx.raf(({ host, scale }) => {
  //   host.style.transform = `scale(${scale})`
  // })

  // fx(() =>
  //   on(window, 'wheel').not.passive.prevent.stop.raf((ev) => {
  //     $.scale = Math.max(0.01, $.scale + ev.deltaY * 0.001)
  //   })
  // )

  fx(async ({ audioContext }) => {
    $.schedulerNode = await SchedulerNode.create(audioContext)

    $.monoNode = await MonoNode.create(audioContext, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      processorOptions: {
        metrics: 0,
      },
    })

    $.startTime = await $.schedulerNode.start()
  })

  fx(({ audioContext, numberOfItems, monoNode, monoEditorValue, schedulerNode, schedulerEditorValue }) => {
    $.itemsView = Array.from({ length: numberOfItems }, (_, i) =>
      <>
        <Mono monoNode={monoNode} audioContext={audioContext} editorValue={monoEditorValue} />
        <Scheduler
          editorValue={schedulerEditorValue}
          schedulerNode={schedulerNode}
          targetNode={monoNode}
        />
      </>
    )
  })

  fx(({ itemsView }) => {
    $.view = itemsView
  })
}))
