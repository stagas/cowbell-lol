/** @jsxImportSource minimal-view */

import { web, view, element } from 'minimal-view'
import { Skin, skin } from './skin'
import { Button } from './button'
import { classes } from './util/classes'
import { Volume } from './volume'
import { KnobView } from './knob-view'
import * as storage from './util/storage'
import { Project } from './project'
import { services } from './services'
import { Wavetracer } from './wavetracer'
import { Audio } from './audio'
import { observe } from './util/observe'

export let ui: Ui

export function setUi(_ui: any) {
  ui = _ui
}

export type Ui = typeof Ui.State

export const Ui = web(view('ui',
  class props {
    distRoot!: string
    skin!: Skin
  },
  class local { },
  function actions({ $, fns, fn }) {
    return fns(new class actions {
    })
  },
  function effects({ $, fx, deps, refs }) {
    ui = $.self

    fx(({ distRoot, skin }) => {
      const bodyStyle = document.createElement('style')

      bodyStyle.textContent = /*css*/`
      @font-face {
        font-family: icon;
        src: url("${distRoot}/iconfont.woff2") format("woff2");
        font-weight: normal;
        font-style: normal;
      }

      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: ${skin.colors.bg};

        color: ${skin.colors.fg};
        font-size: 13px;
      }
      `

      document.head.appendChild(bodyStyle)
    })

    $.css = /*css*/`
    ${skin.css}

    .players {
      display: flex;
      box-sizing: border-box;
      flex-flow: column nowrap;
      /* gap: 10px; */
      /* margin: 15px 20px; */
      /* height: calc(100% - 64px); */
      /* overflow-y: scroll; */
    }
    `

    fx(() => {
      const projects = storage.projects.get([])
      $.view = <>
        {/* <Toolbar /> */}
        <div class="players">
          <DoomScroll items={projects} factory={(id: string) =>
            <ProjectView id={id} />
          } />
        </div>
      </>
    })
  }
))

const runningProjects: Project[] = []

export const ProjectView = web(view('project-view',
  class props {
    id!: string
  },
  class local {
    host = element

    state?: 'idle' | 'running' = 'idle'

    audio?: Audio

    project?: Project

    mainWaveform: JSX.Element = false
  },
  function actions({ $, fns, fn }) {
    return fns(new class actions {
      handlePlay = fn(({ id, audio, project }) => async () => {
        if (!project.$.players) return

        let count = project.$.players.length

        // audio.$.library = library
        audio.$.bpm = project.$.bpm!
        console.log('bpm?', audio.$.bpm, audio)
        // audio.$.coeff = await audio.$.schedulerNode!.setBpm(project.$.bpm!)

        console.log('will play', id, project)

        let resetTime = false

        if (!runningProjects.includes(project)) {
          resetTime = true

          runningProjects.push(project)

          project.$.audio = audio

          if (runningProjects.length > 1) {
            const oldestProject = runningProjects.shift()!
            oldestProject.$.stop()
            oldestProject.$.audio = void 0 as any
          }
        }

        project.$.players.forEach((player) => {
          const off = player.fx(({ compileState }) => {
            if (compileState === 'compiled') {
              off()
              --count || project.$.toggle(resetTime)
            }
          })
        })
      })
    })
  },
  function effects({ $, fx, deps, refs }) {
    fx(() =>
      services.fx(({ audio }) => {
        $.audio = audio
      })
    )

    // fx(({ audioContext, library }) => {
    //   $.audio = Audio({
    //     vol: 0.5,
    //     bpm: 125,
    //     audioContext,
    //     library
    //   })
    // })

    ui.fx(({ skin }) =>
      fx(({ project }) =>
        project.$.audioPlayer.fx(({ state, workerBytes, workerFreqs }) => {
          $.mainWaveform = <Wavetracer
            part="app-scroller"
            id={`scroller-${project.$.id}`}
            kind="detailed"
            running={state === 'running'}
            width={400}
            colors={{ bg: skin.colors.bg }}
            workerBytes={workerBytes}
            workerFreqs={workerFreqs}
          />
        })
      )
    )

    fx(({ id }) => {
      $.project = Project({ id })
      $.project.fx.once(({ library }) => {
        $.project!.$.fromProjectJSON(id, JSON.parse(localStorage[id]))
      })
    })

    // fx(({ library, project }) =>
    //   project.fx(({ players }) => {
    //     library.$.players = players
    //   })
    // )

    ui.fx(({ skin }) => {
      $.css = /*css*/`
      ${skin.css}

      & {
        background: ${skin.colors.bgLight};
        position: relative;
      }

      .waveform {
        position: absolute;
        display: flex;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;

        > .half {
          position: absolute;
          top: calc(50% - 0.5px);
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.3);
          z-index: 1;
        }
      }

      .project {
        position: relative;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        min-height: 76px;
        overflow: hidden;
        background: transparent;
        ${skin.styles.raised}
        z-index: 2;

        > .controls {
          z-index: 3;
          position: relative;
          display: flex;
          flex-flow: row nowrap;
          gap: 13px;
          align-items: center;
          justify-content: center;

          ${KnobView} {
            position: relative;
            top: 2.1px;
            right: -2px;
          }
        }
      }


      [part=app-scroller] {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
      }
      `
    })

    fx(({ project, mainWaveform }) =>
      project.fx(({ title: name, author, bpm, audioPlayer }) =>
        audioPlayer.fx(({ state }) => {
          $.view = <>
            <div class="waveform">
              {mainWaveform}
              <div class="half" />
            </div>
            <div class="project">
              <div class="song">
                <div class="song-icon">
                  🔊
                </div>
                <div class="song-header">
                  <div
                    class={classes({
                      'song-title': true,
                    })}
                  >
                    {name}
                  </div>
                  <div class="song-author">
                    <span class="by">by</span>
                    <span class="author">{author}</span>
                  </div>
                </div>
                <div class="song-bpm">
                  <span class="amt">{bpm}</span>
                  <span class="bpm">BPM</span>
                </div>
              </div>
              <div class="controls">
                <Button
                  small
                >
                  <span class={`i clarity-arrow-line`} />
                </Button>

                <Volume target={audioPlayer} />

                <Button
                  rounded
                  active={state === 'running'}
                  onClick={$.handlePlay}
                >
                  <span class={`i la-${state === 'running' ? 'pause' : 'play'}`} />
                </Button>
              </div>
            </div>
          </>
        })
      )
    )
  }
))


// export const PlayerView = web(view('track-view',
//   class props {
//     knobs?: number = 1
//   },
//   class local {
//     host = element
//     knobsEl?: HTMLDivElement
//     size?: Point = new Point()
//   },
//   function actions({ $, fns, fn }) {
//     return fns(new class actions {

//     })
//   },
//   function effects({ $, fx, deps, refs }) {
//     ui.fx(({ skin }) => {
//       $.css = /*css*/`
//       ${skin.css}

//       & {
//         position: relative;
//         display: flex;
//         flex-flow: row nowrap;
//         width: 100%;
//         height: 69px;
//         overflow: hidden;

//         box-sizing: border-box;
//         background: ${skin.colors.bg};
//       }

//       img {
//         width: 100%;
//         height: 100%;
//       }

//       .controls {
//         background: ${skin.colors.bgLight};
//         box-shadow:
//           inset 0 2px 1px -1.7px ${skin.colors.shadeBright}
//           ,inset 0 -2px 4px -1px ${skin.colors.shadeBlack}
//           ;
//         min-width: 126px;
//         display: flex;
//         flex-flow: row nowrap;
//         gap: 10.5px;
//         align-items: center;
//         justify-content: center;
//       }

//       .knobs {
//         box-sizing: border-box;
//         display: flex;
//         flex-flow: row wrap;
//         align-items: center;
//         justify-content: center;
//         padding: 10px;
//         width: 50%;
//         height: 100%;
//       }

//       ${Button} {
//         margin-left: 2px;
//       }

//       `
//     })

//     fx(({ knobsEl }) =>
//       observe.resize.initial(knobsEl, () => {
//         $.size = new Rect(knobsEl.getBoundingClientRect()).round().size
//       })
//     )

//     fx(({ knobs, size }) => {
//       // const [w, h] = size
//       // const total = knobs
//       // const { cols, rows } = fitGrid(w, h, total)
//       // const width = 100 / cols + '%'
//       // const height = 100 / rows + '%'

//       const active = Math.random() > .45
//       $.view = <>
//         <div class="controls">
//           {/* <Knob
//             id="b"
//             min={0}
//             max={1}
//             step={0.01}
//             symmetric
//             value={0.5+Math.random()*0.2-0.1}
//             theme="cowbell"
//           /> */}

//           <Knob
//             id="b"
//             min={0}
//             max={1}
//             step={0.01}
//             value={0.3 + Math.random() * 0.7}
//             theme="cowbell"
//           />

//           <Button rounded active={active}>
//             <span class={`i la-${active ? 'pause' : 'play'}`} />
//           </Button>

//         </div>
//         <img src={`${ui.$.distRoot}/waveplot.png`} />
//         <img src={`${ui.$.distRoot}/notes.png`} />
//         {/* <img src={`${ui.$.distRoot}/notes.png`} /> */}
//         {/* <img src={`${ui.$.distRoot}/notes.png`} /> */}
//         {/* <img src={`${ui.$.distRoot}/notes.png`} /> */}

//         {/* <div class="knobs" ref={refs.knobsEl}>
//           {Array.from({ length: knobs }, () =>
//             <Knob
//               id="b"
//               style={`max-width:${width}; max-height: ${height};`}
//               min={0}
//               max={1}
//               step={0.01}
//               value={Math.random()}
//               theme="cowbell"
//             />
//           )}
//         </div> */}
//       </>
//     })
//   }
// ))


// {
//   projects.slice(0, 10).map((id) =>
//     <ProjectView id={id} />
//   )
// }
//////////////////////////////

export const DoomScroll = web(view('doom-scroll',
  class props {
    items!: any[]
    factory!: (item: any) => JSX.Element
    rangeEnd?= 10
    size?= 7
  },
  class local {
    host = element
    lastEl?: HTMLDivElement | null
  },
  function actions({ $, fns, fn }) {
    return fns(new class actions {
      intersects = fn(({ items, rangeEnd, size }) => ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          $.lastEl = null
          $.rangeEnd = Math.min(items.length, $.rangeEnd! + size)
        }
      })
    })
  },
  function effects({ $, fx, deps, refs }) {
    fx(({ lastEl }) =>
      observe.intersection(lastEl, $.intersects)
    )

    fx(({ items, factory, rangeEnd }) => {
      $.view = items.slice(0, rangeEnd).map((x, i, arr) =>
        <div ref={i === arr.length - 6 ? refs.lastEl : null}>
          {factory(x)}
        </div>
      )
    })
  }
))

export const Skeleton = web(view('skeleton',
  class props {

  },
  class local { },
  function actions({ $, fns, fn }) {
    return fns(new class actions {

    })
  },
  function effects({ $, fx, deps, refs }) {
    fx(() => {
      $.view = 'hello'
    })
  }
))
