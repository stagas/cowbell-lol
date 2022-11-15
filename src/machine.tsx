/** @jsxImportSource minimal-view */

import { web, view, element, on } from 'minimal-view'

import { EditorScene } from 'canvy'
import { SchedulerNode } from 'scheduler-node'

export const Machine = web('machine', view(
  class props {
    audioContext!: AudioContext
    schedulerNode!: SchedulerNode
    editorScene!: EditorScene

    Kind!: (props: any) => JSX.Element
    audioNode!: AudioNode | false
    outputs!: AudioNode[]
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
  fx(({ host }) => {
    on(window, 'resize')(() => {
      host.style.width = window.innerWidth + 'px'
    })
  })

  fx(({ audioContext, editorScene, Kind, schedulerNode, audioNode, outputs }) => {
    $.view = <>
      <Kind
        audioContext={audioContext}
        schedulerNode={schedulerNode}
        editorScene={editorScene}

        audioNode={audioNode}
        outputs={outputs}
        detail={{}}
      />
    </>
  })
}))
