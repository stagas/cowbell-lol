/** @jsxImportSource minimal-view */

import { web, view, element, on } from 'minimal-view'

import type { EditorScene } from 'canvy'
import type { SchedulerNode } from 'scheduler-node'
import type { App } from './app'

import { MachineKind, MachineData } from './machine-data'

export const Machine = web('machine', view(
  class props extends MachineData {
    app!: App

    audioContext!: AudioContext
    schedulerNode!: SchedulerNode
    editorScene!: EditorScene

    audioNode!: AudioNode | false
    Machines!: Record<MachineKind, (props: any) => JSX.Element>
  }, class local {
  host = element
}, ({ $, fx }) => {
  $.css = /*css*/`
  & {
    display: flex;
    flex-flow: column wrap;
    position: relative;
    max-height: 100%;

    > * {
      flex: 1;
    }
  }
  `

  fx(({ host }) =>
    on(window, 'resize')(() => {
      host.style.width = window.innerWidth + 'px'
    })
  )

  fx(({ app, id, Machines, audioContext, editorScene, schedulerNode, kind, audioNode, detail, outputs, presets, spacer }) => {
    const Kind = Machines[kind]

    $.view = <>
      <Kind
        app={app}

        id={id}

        audioContext={audioContext}
        schedulerNode={schedulerNode}
        editorScene={editorScene}

        audioNode={audioNode}
        detail={detail}
        outputs={outputs}
        presets={presets}
        spacer={spacer}
      />
    </>
  })
}))
