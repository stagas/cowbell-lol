/** @jsxImportSource minimal-view */

import { render, enableDebug, effect } from 'minimal-view'

if (false) enableDebug(5000)
// effect.maxUpdates = 100000

import { App } from '../src'

const css = /*css*/`
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}`

render(<>
  <style>{css}</style>
  <App numberOfItems={1} />
</>, document.body)
