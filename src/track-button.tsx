// /** @jsxImportSource minimal-view */

// import { cheapRandomId, checksum } from 'everyday-utils'
// import { element, view, web } from 'minimal-view'
// import { Audio } from './audio'
// import { Midi } from './midi'
// import { compilePattern } from './pattern'
// import { Preview } from './preview-service'
// import { EditorBuffer } from './types'
// import { bgForHue } from './util/bg-for-hue'
// import { getTitle } from './util/parse'
// import { Waveplot } from './waveplot'

// export const TrackButton = web(view('track-button',
//   class props {
//     audio!: Audio

//     active!: boolean

//     preview?: Preview
//     waveplot?: Waveplot

//     soundId?: string
//     soundBuffers?: Map<string, EditorBuffer>

//     patternId?: string
//     patternBuffers?: Map<string, EditorBuffer>

//     onClick!: () => void
//   },

//   class local {
//     host = element
//     canvasView: JSX.Element = false
//     midiView: JSX.Element = false
//   },

//   function actions({ $, fns, fn }) {
//     return fns(new class actions {
//       onPointerDown = fn(({ onClick }) => (e: PointerEvent) => {
//         e.preventDefault()
//         e.stopPropagation()
//         onClick()
//       })
//     })
//   },

//   function effects({ $, fx }) {
//     $.css = /*css*/`
//     & {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       position: relative;
//       background: #000;
//       border-bottom: 1px solid #333;
//     }
//     button {
//       all: unset;
//       z-index: 2;
//       display: flex;
//       flex-flow: column nowrap;
//       align-items: center;
//       justify-content: center;
//       text-align: center;
//       font-family: Mono;
//       font-size: 20px;
//       width: 100%;
//       height: 100%;
//       color: #fff;
//       cursor: pointer;
//       /* text-shadow: 1px 2px #000; */
//       > span {
//         z-index: 2;
//       }
//       .shadow {
//         position: absolute;
//         left: 0;
//         top: 0;
//         width: 100%;
//         height: 100%;
//         display: flex;
//         flex-flow: column nowrap;
//         align-items: center;
//         justify-content: center;
//         -webkit-text-stroke: 6px #000;
//         z-index: 1;
//       }
//     }
//     canvas {
//       position: absolute;
//       left: 0;
//       top: 0;
//       z-index: 0;
//       width: 100%;
//       height: 100%;
//       image-rendering: pixelated;
//       pointer-events: none;
//     }
//     ${Midi} {
//       position: absolute;
//       pointer-events: none;
//       left: 0;
//       top: 0;
//       z-index: 1;
//       width: 100%;
//       height: 100%;
//     }

//     &([active]) {
//       background: #fff2;
//     }
//     `

//     fx.raf(({ host, active }) => {
//       host.toggleAttribute('active', active)
//     })

//     fx(async function drawMidi({ audio, patternId, patternBuffers }) {
//       const buffer = patternBuffers!.get(patternId)!
//       if (!('midiEvents' in buffer)) {
//         const result = await compilePattern(buffer.value, buffer.numberOfBars || 1)
//         if (result.success) {
//           if (!('isDraft' in buffer)) buffer.isDraft = false
//           buffer.midiEvents = result.midiEvents
//           buffer.numberOfBars = result.numberOfBars
//         }
//       }
//       $.midiView = <Midi
//         part="midi"
//         state="idle"
//         style={/*css*/`
//           background: ${buffer.isDraft ? bgForHue(checksum(buffer.id)) : 'transparent'};
//           background-size: 45px 45px;
//           background-position: center 12.5px;
//         `}
//         getTime={audio.getTime}
//         midiEvents={buffer.midiEvents!}
//         numberOfBars={buffer.numberOfBars!}
//       />
//     })

//     fx(async function drawWaveplot({ waveplot, soundId }) {
//       const buffer = $.soundBuffers!.get(soundId)!
//       let canvasEl: HTMLCanvasElement
//       if ('canvasPromise' in buffer) {
//         await buffer.canvasPromise
//       }
//       if (!('canvas' in buffer)) {
//         let resolve!: () => void
//         buffer.canvasPromise = new Promise<void>((r) => { resolve = r })
//         const { canvas } = await waveplot.create(soundId)
//         if (!('isDraft' in buffer)) buffer.isDraft = false
//         buffer.canvas = canvas
//         canvasEl = canvas
//         requestAnimationFrame(resolve)
//       } else {
//         const canvasId = soundId + cheapRandomId()
//         const { canvas } = await waveplot.create(canvasId)
//         canvasEl = canvas
//         if (!('canvases' in buffer)) {
//           buffer.canvases = new Map([[canvas, canvasId]])
//         } else {
//           buffer.canvases.set(canvas, canvasId)
//         }
//         waveplot.copy(soundId, canvasId)
//       }
//       if ($.preview) {
//         $.preview.draw(buffer)
//       }
//       $.canvasView =
//         <canvas
//           part="canvas"
//           ref={{
//             get current(): HTMLCanvasElement {
//               return canvasEl
//             }
//           }}
//         />
//     })

//     fx(function drawTrackButton({ canvasView, midiView }) {
//       const label: JSX.Element = []

//       if ($.soundId) {
//         label.push(<span>{getTitle($.soundBuffers!.get($.soundId)!.value)}</span>)
//       }
//       if ($.patternId) {
//         label.push(<span>{getTitle($.patternBuffers!.get($.patternId)!.value)}</span>)
//       }

//       $.view = <>
//         {canvasView}
//         {midiView}
//         <button onpointerdown={$.onPointerDown}>
//           {[...label]}
//           <div class="shadow">
//             {[...label]}
//           </div>
//         </button>
//       </>
//     })
//   }
// ))

export { }
