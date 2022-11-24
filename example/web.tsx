/** @jsxImportSource minimal-view */

import { render, enableDebug, effect } from 'minimal-view'

// import { DOMRecorder } from 'dom-recorder'
// declare const window: any
// window.recorder = new DOMRecorder()
// document.body.appendChild(window.recorder.el)

if (false)
  enableDebug(5000)
effect.maxUpdates = 100000

import { AppView } from '..'

const css = /*css*/`
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
`

render(<>
  <style>{css}</style>
  <AppView />
</>, document.body)
