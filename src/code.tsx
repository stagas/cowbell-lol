/** @jsxImportSource minimal-view */

import { web, view, Dep, effect, element } from 'minimal-view'

import { Canvy, CanvyElement, EditorScene } from 'canvy'

export const Code = web('code', view(
  class props {
    editorScene!: EditorScene
    value!: Dep<string>
  }, class local {
  host = element
  editor?: CanvyElement
}, ({ $, fx, refs }) => {
  $.css = /*css*/`
  & {
    box-sizing: border-box;
    max-width: 100%;
    flex: 1;
  }
  `

  fx(({ value }) =>
    fx(({ editor }) =>
      editor.$.effect(({ files, ready }) => {
        if (ready) {
          return effect({ value }, ({ value }) => {
            if (value !== files[0].value) {
              files[0].value = value
              files[0].setData(files[0])
            }
          })
        }
      })
    )
  )

  fx(({ editorScene, value }) => {
    $.view = <Canvy key="text"
      ref={refs.editor}
      part="canvy"
      scene={editorScene}
      font="/example/CascadiaMono.woff2"
      fontSize={14}
      onchange={
        function (this: CanvyElement) {
          if (this.ready) {
            value.value = this.value
          }
        }} />
  })
}))
