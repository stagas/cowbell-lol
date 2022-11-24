/** @jsxImportSource minimal-view */

import { Dep, element, view, web } from 'minimal-view'

import { Canvy, CanvyElement, EditorScene } from 'canvy'

export const Code = web('code', view(
  class props {
    editorScene!: EditorScene
    value!: Dep<string>
    editor?: Dep<CanvyElement>
    onWheel?: (ev: WheelEvent) => void = () => { }
    onEnterMarker?: (ev: { detail: { marker: unknown, markerIndex: number } }) => void = () => { }
    onLeaveMarker?: (ev: { detail: { marker: unknown, markerIndex: number } }) => void = () => { }
  }, class local {
  host = element
  waitingEditor?: CanvyElement
}, ({ $, fx, fn, refs }) => {
  $.css = /*css*/`
  & {
    box-sizing: border-box;
    max-width: 100%;
    flex: 1;
  }
  `

  const off = fx(({ editor, waitingEditor }) =>
    waitingEditor.$.effect(({ ready }) => {
      if (ready) {
        off()
        editor.current = waitingEditor
      }
    })
  )

  const onCodeChange = fn(({ value }) => function onCodeChange(this: CanvyElement) {
    if (this.ready && this.value != null) {
      value.value = this.value
    }
  })

  const onEvent = fn(({ onWheel }) => function onCodeEvent(this: CanvyElement, { detail: ev }) {
    if (ev.name === 'mousewheel') {
      onWheel(ev.data)
    }
  })

  fx(({ editorScene, onEnterMarker, onLeaveMarker }) => {
    $.view = <Canvy
      key="text"
      ref={refs.waitingEditor}
      part="canvy"
      scene={editorScene}
      font="/example/CascadiaMono.woff2"
      fontSize={17}
      onevent={onEvent}
      onentermarker={onEnterMarker}
      onleavemarker={onLeaveMarker}
      onchange={onCodeChange}
      onedit={onCodeChange}
    />
  })
}))
