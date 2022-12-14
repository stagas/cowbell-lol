/** @jsxImportSource minimal-view */

import { element, view, web, Dep, effect } from 'minimal-view'

import { IconSvg } from 'icon-svg'
import { List } from '@stagas/immutable-list'

import { Button } from './button'
import { AudioMachine, Machine } from './machine'
import { MonoMachine } from './mono'
import { SliderView } from './slider-view'
import { checksum } from './util/checksum'
import { AppContext, AppMachine } from './app'
import { Wavetracer } from './wavetracer'

export const MixerView = web('mixer-view', view(class props {
  app!: AppContext
  focusedTrack!: Dep<string>
  workerBytes!: Uint8Array
  workerFreqs!: Uint8Array
  machines!: List<Machine | AudioMachine | MonoMachine>
}, class local {
  host = element
  focusedTrackView = ''
}, function actions() { return ({}) }, function effects({ $, fx }) {
  $.css = /*css*/`
  & {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }

  [part=track] {
    display: flex;
    flex-flow: column nowrap;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    max-width: 80px;
    gap: 10px;

  }

  [part=track-view] {
    display: flex;
    flex-flow: column nowrap;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }

  [part=vertical-ruler] {
    width: 2px;
    min-width: 2px;
    background-clip: content-box;
    background-color: #aaf2;
    padding: 0 7.5px;
    height: 100%;
  }

  [part=waveform] {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  `

  fx(({ focusedTrack }) =>
    effect({ focusedTrack }, ({ focusedTrack }) => {
      $.focusedTrackView = focusedTrack
    })
  )

  fx(({ app, machines, focusedTrack, focusedTrackView, workerBytes, workerFreqs }) => {
    $.view = <>
      <Wavetracer part="waveform" app={app} id="app-scroller" kind="scroller" running={app.state === 'running'} workerBytes={workerBytes} workerFreqs={workerFreqs} />

      <MixerTrackView part="track" app={app} machine={app.app} />

      <div part="vertical-ruler"></div>

      {(machines.items.filter((machine) => machine.kind === 'mono') as MonoMachine[]).map((machine) =>
        <div part="track">
          {/* <button
            onclick={() => {
              focusedTrack.value = machine.groupId
            }}
            class={classes({
              focused: focusedTrackView === machine.groupId
            })}>{machine.name}
          </button> */}
          <MixerTrackView part="track-view" app={app} machine={machine} />
        </div>
      )}
    </>
  })
}))

const MixerTrackView = web('mixer-track-view', view(class props {
  app!: AppContext
  machine!: AppMachine | MonoMachine
}, class local {
  host = element
}, function actions() { return ({}) }, function effects({ $, fx }) {
  const stateColors = {
    init: [1, '#334'],
    idle: [1, '#334'],
    ready: [1, '#667'],
    running: [0, '#1f3', '#1f3'],
    suspended: [1, '#667', '#fff'],
  } as const

  const compileColors = {
    compiling: [1, 'cyan'],
    errored: [1, 'red'],
  } as const

  $.css = /*css*/`
  & {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  }

  [part=start] {
    padding: 5px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  }

  ${Button} {
    pointer-events: all;
    cursor: pointer;

    &.stop {
      display: none;
    }
  }

  ${Object.entries(stateColors).map(([state, [opacity, color, hoverColor]]) => /*css*/`
    &([state=${state}]) {
      [part=start] {
        ${Button}.start {
          color: ${color};
        }
        ${Button}.stop {
          color: ${hoverColor ?? color};
        }

        &:hover {
          ${Button}.start {
            color: ${hoverColor ?? color};
            display: ${opacity ? 'block' : 'none'};
          }
          ${Button}.stop {
            display: ${opacity ? 'none' : 'block'};
          }
        }
      }
    }
  `).join('\n')}

  ${Object.entries(compileColors).map(([state, [opacity, color]]) => /*css*/`
    &([compileState=${state}]) {
      [part=start] {
        ${Button}.start {
          color: ${color} !important;
        }
        ${Button}.stop {
          color: ${color} !important;
        }

        &:hover {
          ${Button}.start {
            color: ${color} !important;
            display: ${opacity ? 'block' : 'none'};
          }
          ${Button}.stop {
            display: ${opacity ? 'none' : 'block'};
          }
        }
      }
    }
  `).join('\n')}
  `

  fx.raf(function updateAttrs({ host, machine }) {
    host.setAttribute('state', machine.state)
    if ('compileState' in machine) {
      host.setAttribute('compileState', machine.compileState)
    }
  })

  fx(({ app, machine }) => {
    $.view = <>
      <SliderView
        hue={'hue' in machine ? machine.hue : checksum(machine.name) % 360}
        id="vol"
        machine={machine}
        min={0}
        max={1}
        name={machine.name}
        scene={app.sliderScene}
        value={machine.gainValue}
        running={machine.state === 'running'}
        vertical={false}
        showBg={false}
      />

      <div part="start">
        <Button
          class="start"
          shadow={3}
          onClick={() => machine.methods.start()}
        >
          <IconSvg
            class="normal"
            set="feather"
            icon={machine.state === 'running' ? "stop-circle" : "play-circle"}
          />
        </Button>

        <Button
          class="stop"
          shadow={3}
          onClick={() => machine.methods.stop()}
        >
          <IconSvg
            class="normal"
            set="feather"
            icon="stop-circle"
          />
        </Button>
      </div>
    </>
  })
}))
