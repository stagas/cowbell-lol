/** @jsxImportSource minimal-view */

import { web, view, Dep } from 'minimal-view'

export const Editor = web('editor', view(
  class props {
    value!: Dep<string>
  }, class local {
}, ({ $, fx }) => {
  $.css = /*css*/`
    textarea {
      display: block;
      box-sizing: border-box;
      background: #000;
      color: #eee;
      border: none;
      width: 100%;
      height: 88px;
      resize: vertical;
    }
  `

  fx(({ value }) => {
    $.view = <textarea key="text"
      spellcheck="false"
      autocorrect="off"
      oninput={
        function (this: HTMLTextAreaElement) {
          value.value = this.value
        }}>
      {value.value}
    </textarea>
  })
}))
