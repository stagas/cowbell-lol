/** @jsxImportSource minimal-view */

import { render, enableDebug, effect } from 'minimal-view'

// import { DOMRecorder } from 'dom-recorder'
// declare const window: any
// window.recorder = new DOMRecorder()
// document.body.appendChild(window.recorder.el)

// @ts-ignore
// globalThis.DEBUG = ['editor', 'editor-buffer', 'slider']

// @ts-ignore
const isDebug = !!globalThis.DEBUG

// if (isDebug) enableDebug(5000)

effect.maxUpdates = 100000

// import { AppView } from '..'
import { App } from '..'

// const css = /*css*/`
// .dual {
//   display: flex;
//   flex-flow: row nowrap;
//   max-height: 100%;
// }

// .pane {
//   max-width: 50%;
//   max-height: 100%;
//   overflow-y: scroll;
// }
// `
render(<App />, document.body)
  // <AppView distRoot="/example" apiUrl="https://devito.test" />
  // render(<>
  //   <style>{css}</style>
  //   <div class="dual">
  //     <div class="pane">
  //       <AppView />
  //     </div>
  //     <div class="pane">
  //       <AppView />
  //     </div>
  //   </div>
  // </>, document.body)
