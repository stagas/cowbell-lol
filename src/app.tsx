/** @jsxImportSource minimal-view */

import { web, view, element, enableDebug } from 'minimal-view'

if (false) enableDebug()

import { Mono } from './components'

const monoDefaultEditorValue = `beat()=(-t*2)%1;
f()=(
x=tanh(wsaw(40)
*
env(t+beat(),10,8)*4);
freeverb(
x
,0.75,0.5)
+x*0.5
)`
// const monoDefaultEditorValue = `beat()=(-t*2)%1;
// f()=(
// x=tanh(wsine(100)
// *
// env(t+beat(),10,8)*4);
// freeverb(
// x
// ,0.75,0.5)
// +x*0.5
// )`
// const monoDefaultEditorValue = `beat()=(-t*2)%1;
// f()=
// wsine(200)
// *
// env(t+beat(),10,4)
// `
// const monoDefaultEditorValue = `f()=sine(3)`
// const monoDefaultEditorValue = `f()=
// diode(
//   saw(50
//   +saw(1)*45
// ),
// 2500+sin(4)*1000,
// 1.35,
// 44670,
// 6.05)
// `

export const App = web('app', view(
  class props {
    numberOfItems = 1
  }, class local {
  audioContext = new AudioContext({ sampleRate: 44100, latencyHint: 0.01 })
  host = element
  isActive = true
  items: any[] = []
  itemsView: JSX.Element = false
  editorValue = monoDefaultEditorValue
}, ({ $, fx, deps }) => {
  $.css = /*css*/`
  & {
    display: flex;
    flex-flow: row wrap;
    background: brown;
    padding: 10px;
    gap: 10px;
    transition: transform 100ms ease-out;

    > * {
      flex: 1;
    }
  }
  canvas {
    background: #000;
    display: block;
  }`

  // fx.raf(({ host, scale }) => {
  //   host.style.transform = `scale(${scale})`
  // })

  // fx(() =>
  //   on(window, 'wheel').not.passive.prevent.stop.raf((ev) => {
  //     $.scale = Math.max(0.01, $.scale + ev.deltaY * 0.001)
  //   })
  // )

  fx(({ audioContext, numberOfItems, editorValue }) => {
    $.itemsView = Array.from({ length: numberOfItems }, (_, i) =>
      <>
        <Mono audioContext={audioContext} editorValue={editorValue} />
      </>
    )
  })

  fx(({ itemsView }) => {
    $.view = itemsView
  })
}))
