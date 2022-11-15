/** @jsxImportSource minimal-view */

import { web, view, element, enableDebug, on } from 'minimal-view'
import { Matrix, Point, Rect } from 'geometrik'

import { EditorScene } from 'canvy'
import { SchedulerNode } from 'scheduler-node'

import { Vertical, Machine, Mono, Scheduler } from './components'
import { MonoNode } from 'mono-worklet'

if (false) enableDebug()

export const App = web('app', view(
  class props {
    numberOfItems = 1
  }, class local {
  host = element
  rect = new Rect()

  audioContext = new AudioContext({ sampleRate: 44100, latencyHint: 0.04 })
  schedulerNode?: SchedulerNode
  startTime?: number

  audioNodes?: AudioNode[]

  items: any[] = []
  itemsView: JSX.Element = false

  editorScene = new EditorScene({
    layout: {
      viewMatrix: new Matrix,
      state: {
        isIdle: true
      },
      viewFrameNormalRect: new Rect(0, 0, 10000, 10000),
      pos: new Point(0, 0)
    }
  })
}, ({ $, fx, deps }) => {
  $.css = /*css*/`
  & {
    display: flex;
    flex-flow: column wrap;
    background: #000;
    padding: 0px;
    /* overflow: hidden; */

    > * {
      /* flex: 1; */
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


  fx(() => {
    const resize = () => {
      const rect = $.rect.clone()
      rect.width = window.innerWidth
      rect.height = window.innerHeight
      $.rect = rect
    }
    resize()
    return on(window, 'resize')(resize)
  })

  fx(({ host, rect }) => {
    host.style.width = rect.width + 'px'
  })

  fx(async ({ audioContext }) => {

  })

  fx(async ({ audioContext }) => {
    $.schedulerNode = await SchedulerNode.create(audioContext)

    $.startTime = await $.schedulerNode.start()

    const monoNode = await MonoNode.create(audioContext, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      processorOptions: {
        metrics: 0,
      },
    })
    monoNode?.worklet.setTimeToSuspend(Infinity)

    $.audioNodes = [monoNode]
  })

  fx(({ audioContext, audioNodes, schedulerNode, editorScene, numberOfItems }) => {
    $.itemsView = Array.from({ length: numberOfItems }, (_, i) => {
      const Kind = i % 2 === 0 ? Mono : Scheduler
      const audioNode = i % 2 === 0 ? audioNodes[0] : false
      const outputs = i % 2 === 0 ? [] : audioNodes
      // console.log(audioNode, outputs)
      return <><Machine
        Kind={Kind}
        audioContext={audioContext}
        editorScene={editorScene}

        schedulerNode={schedulerNode}
        audioNode={audioNode}
        outputs={outputs}
      />
        <Vertical height={HEIGHTS.get(Kind)!} />
      </>
    }
    )
  })

  fx(({ itemsView }) => {
    $.view = itemsView
  })
}))

const HEIGHTS = new Map<(props: any) => any, number>([
  [Mono, 190],
  [Scheduler, 90],
])
