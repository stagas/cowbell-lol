/** @jsxImportSource minimal-view */

import { Dep, effect, element, on, view, web } from 'minimal-view'

import { Canvy, CanvyElement, EditorScene, Lens, Marker } from 'canvy'

export interface EditorDetailData {
  editorValue: string
}

export const Code = web(view('code',
  class props {
    name!: string
    font?: string
    fontName?: string
    fontSize!: number
    scene!: EditorScene
    value!: Dep<string>
    editor!: Dep<CanvyElement>
    singleComment!: string
    markers!: Dep<Marker[]>
    lenses!: Dep<Lens[]>
    onWheel?: (ev: WheelEvent) => void = () => { }
    onMarkerEnter?: (ev: { detail: { marker: Marker, markerIndex: number } }) => void = () => { }
    onMarkerLeave?: (ev: { detail: { marker: Marker, markerIndex: number } }) => void = () => { }
  },

  class local {
    host = element
    waitingEditor?: CanvyElement
    canvy?: CanvyElement
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {
      onCodeChange =
        fn(({ value }) => function onCodeChange(this: CanvyElement) {
          if (this.editor.hasFocus) {
            // fixes a bug where we lose focus sometimes
            requestAnimationFrame(() => {
              this.focus()
            })
          }
          if (this.ready && this.value != null) {
            value.value = this.value
          }
        })

      onEvent =
        fn(({ onWheel }) => function onCodeEvent(this: CanvyElement, { detail: ev }) {
          if (ev.name === 'mousewheel') {
            onWheel(ev.data)
          }
        })
    })
  },

  function effects({ $, fx, fn, refs }) {
    $.css = /*css*/`
    & {
      box-sizing: border-box;
      max-width: 100%;
      flex: 1;
    }
    `

    const off = fx(function waitForEditor({ editor, waitingEditor }) {
      return waitingEditor.$.effect(({ ready }) => {
        if (ready) {
          off()
          $.canvy = editor.value = waitingEditor
        }
      })
    })

    fx(({ host, canvy }) => {
      host.tabIndex = 0
      return on(host, 'focus')(() => {
        canvy.focus()
      })
    })

    fx(({ name, canvy }) => canvy.$.effect(({ fontSize }) => {
      localStorage[`editor-fontSize-${name}`] = `${fontSize}`
    }))

    fx(({ canvy, markers }) =>
      effect({ markers }, ({ markers }) => {
        canvy.setMarkers(markers)
      })
    )

    fx(({ canvy, lenses }) =>
      effect({ lenses }, ({ lenses }) => {
        canvy.setLenses(lenses)
      })
    )

    fx(function drawCode({ name, value, fontSize, scene, onMarkerEnter, onMarkerLeave }) {
      $.view = <Canvy
        key="text"
        ref={refs.waitingEditor}
        part="canvy"
        scene={scene}
        font={$.font}
        fontName={$.fontName}
        fontSize={fontSize} //+localStorage[`editor-fontSize-${name}`] || fontSize}
        // padding={0}
        onevent={$.onEvent}
        onentermarker={onMarkerEnter}
        onleavemarker={onMarkerLeave}
        onchange={$.onCodeChange}
        onedit={$.onCodeChange}
        initialValue={value.value as string}
      />
    })
  }))
