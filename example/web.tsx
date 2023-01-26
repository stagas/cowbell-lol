/** @jsxImportSource minimal-view */

import { render, enableDebug, effect } from 'minimal-view'

// import { DOMRecorder } from 'dom-recorder'
// declare const window: any
// window.recorder = new DOMRecorder()
// document.body.appendChild(window.recorder.el)

// @ts-ignore
// globalThis.DEBUG = ['player', 'player-view', 'project', 'project-view', 'audio-player', 'audio']

// @ts-ignore
// const isDebug = !!globalThis.DEBUG

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

render(<>
  <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin={"anonymous"} /><link href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed&family=Baumans&family=Geo&family=JetBrains+Mono:ital@0;1&family=Jost:ital@0;1&display=swap" rel="stylesheet" />
  {/* <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin={"anonymous"} /><link href="https://fonts.googleapis.com/css2?family=ABeeZee:ital@0;1&family=Albert+Sans&family=Baloo+2:wght@400;500&family=Baloo+Thambi+2&family=Barlow+Semi+Condensed&family=Baumans&family=Be+Vietnam+Pro:wght@300&family=DM+Mono&family=Gantari:wght@400;500;600&family=Geo&family=JetBrains+Mono:ital@0;1&family=Jost&family=Questrial&family=Share&family=Silkscreen&family=Teko:wght@300&display=swap" rel="stylesheet" /> */}
</>, document.head)

render(<App
  apiUrl="https://api.devito.test:3030"
/>, document.body)
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
