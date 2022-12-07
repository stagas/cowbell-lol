/** @jsxImportSource minimal-view */

import { render, enableDebug, effect } from 'minimal-view'

// import { DOMRecorder } from 'dom-recorder'
// declare const window: any
// window.recorder = new DOMRecorder()
// document.body.appendChild(window.recorder.el)

// @ts-ignore
// globalThis.DEBUG = ['app', 'mono', 'scheduler', 'mono-group', 'wavetracer']

// @ts-ignore
const isDebug = !!globalThis.DEBUG

// if (isDebug) enableDebug(5000)

effect.maxUpdates = 10000

import { AppView } from '..'

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
render(<>
  <AppView distRoot="/example" apiUrl="https://devito.test" />
</>, document.body)
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
