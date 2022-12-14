/** @jsxImportSource minimal-view */

import { IconSvg } from 'icon-svg'
import { element, view, web } from 'minimal-view'

import { AppContext } from './app'
import { Button } from './button'
import { Machine } from './machine'
import { MonoMachine } from './mono'
import { SliderView } from './slider-view'

export const MachineControls = web('machine-controls', view(
  class props {
    app!: AppContext
    machine!: MonoMachine
    groupId!: MonoMachine['groupId']
    state!: Machine['state']
    compileState!: MonoMachine['compileState']
    methods!: MonoMachine['methods']
    showDeleteButton!: boolean
  },

  class local {
    host = element
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {

    })
  },

  function effects({ $, fx }) {
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
      position: relative;
      z-index: 999999;
      pointer-events: none;
      font-family: system-ui;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 7.5px;
      right: 7.5px;
      width: 100%;
      height: 74px;
      box-sizing: border-box;
    }

    ${Button} {
      pointer-events: all;
      cursor: pointer;

      &.stop {
        display: none;
      }
    }

    ${SliderView} {
      position: relative;
      margin: 15px;
      height: 35px;
      /* width: 100px; */
      /* height: 100px; */
      /* background: red; */
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

    fx.raf(function updateAttrState({ host, state }) {
      host.setAttribute('state', state)
    })

    fx.raf(function updateAttrCompileState({ host, compileState }) {
      host.setAttribute('compileState', compileState)
    })

    fx(function registerVolumeUpdateNormal({ app, machine }) {
      app.sliderScene.updateNormalMap.set(machine.id, 'vol', (normal: number) => {
        // console.log(normal)
      })
    })

    fx(function drawMachineControls({ app, machine, groupId, showDeleteButton, methods: { start, stop } }) {
      $.view = <>
        <SliderView
          hue={10}
          id="vol"
          machine={machine}
          min={0}
          max={1}
          name="vol"
          scene={app.sliderScene}
          value={machine.gainValue}
          running={$.state === 'running'}
          vertical={true}
          showBg={true}
        />

        <div part="start">
          <Button
            class="start"
            shadow={3}
            onClick={start}
          >
            <IconSvg
              class="normal"
              set="feather"
              icon={$.state === 'running' ? "stop-circle" : "play-circle"}
            />
          </Button>

          <Button
            class="stop"
            shadow={3}
            onClick={stop}
          >
            <IconSvg
              class="normal"
              set="feather"
              icon="stop-circle"
            />
          </Button>
        </div>

        <div part="delete">
          {
            showDeleteButton
            // true
            && <Button
              part="remove"
              shadow={3}
              onClick={() =>
                app.removeMachinesInGroup(groupId)}
              style={{
                color: '#f30'
              }}>
              <IconSvg
                class="normal"
                set="feather"
                icon="x-circle"
              />
            </Button>
          }
        </div>
      </>
    })
  })
)
