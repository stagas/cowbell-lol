/** @jsxImportSource minimal-view */

import { web, view, Dep } from 'minimal-view'

export const Editor = web('editor', view(
  class props {
    value!: Dep<string>
    rows?: number = 10
  }, class local {
}, ({ $, fx }) => {
  $.css = /*css*/`
    textarea {
      display: block;
      box-sizing: border-box;
      background: #000;
      color: #fff;
      border: none;
      width: 100%;
      resize: vertical;
    }
  `

  fx(({ value, rows }) => {
    $.view = <textarea key="text"
      spellcheck="false"
      autocorrect="off"
      rows={rows}
      oninput={
        function (this: HTMLTextAreaElement) {
          value.value = this.value
        }}>
      {value.value}
    </textarea>
  })
}))
