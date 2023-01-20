/** @jsxImportSource minimal-view */

import { render, effect } from 'minimal-view'

effect.maxUpdates = 100000

import { Ui, skin } from '..'

render(<>
  <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin={"anonymous"} /><link href="https://fonts.googleapis.com/css2?family=ABeeZee:ital@0;1&family=Albert+Sans&family=Baloo+2:wght@400;500&family=Baloo+Thambi+2&family=Barlow+Semi+Condensed&family=Baumans&family=Be+Vietnam+Pro:wght@300&family=DM+Mono&family=Gantari:wght@400;500;600&family=Geo&family=JetBrains+Mono:ital@0;1&family=Jost&family=Questrial&family=Share&family=Silkscreen&family=Teko:wght@300&display=swap" rel="stylesheet" />
</>, document.head)

render(<Ui distRoot="/example" skin={skin} />, document.body)
