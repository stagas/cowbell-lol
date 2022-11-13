/** @jsxImportSource minimal-view */

import { web, view } from 'minimal-view'

export const Button = web('btn', view(
  class props {
    onClick!: () => void
    children?: JSX.Element
  }, class local {
}, ({ $, fx }) => {
  // $.css = /*css*/`
  // &([state=active]) {
  //   button {
  //     background: teal;
  //   }
  // }
  // &([state=inactive]) {
  //   button {
  //     background: grey;
  //   }
  // }`

  fx(({ onClick, children }) => {
    $.view = <>
      <button onclick={onClick}>
        {children}
      </button>
    </>
  })
}))
