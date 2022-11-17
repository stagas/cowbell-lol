/** @jsxImportSource minimal-view */

import { web, view, element, on, queue } from 'minimal-view'

import type { EditorScene } from 'canvy'
import type { SchedulerNode } from 'scheduler-node'
import type { App } from './app'

import { MachineKind, MachineData } from './machine-data'

export const Machine = web('machine', view(
  class props {
    app!: App

    audioContext!: AudioContext
    schedulerNode!: SchedulerNode
    editorScene!: EditorScene

    machine!: MachineData
    audioNode!: AudioNode | false
    Machines!: Record<MachineKind, (props: any) => JSX.Element>
    showRemoveButton!: boolean
  }, class local {
  host = element
}, ({ $, fx }) => {
  $.css = /*css*/`
  & {
    box-sizing: border-box;
    display: flex;
    flex-flow: column wrap;
    position: relative;
    max-height: 100%;

    > * {
      flex: 1;
    }
  }
  `

  fx(({ host }) => {
    const resize = queue.raf(() => {
      host.style.width = Math.min(700, window.innerWidth) + 'px'
    })
    resize()
    return on(window, 'resize')(resize)
  })

  fx(({ app, Machines, audioContext, editorScene, schedulerNode, audioNode, machine, showRemoveButton }) => {
    const Kind = Machines[machine.kind]

    $.view = <>
      <Kind
        app={app}

        audioContext={audioContext}
        schedulerNode={schedulerNode}
        editorScene={editorScene}
        audioNode={audioNode}

        {...machine}

        showRemoveButton={showRemoveButton}
      />
    </>
  })
}))
