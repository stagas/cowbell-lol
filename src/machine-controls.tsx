/** @jsxImportSource minimal-view */

import { IconSvg } from 'icon-svg'
import { view } from 'minimal-view'

import { AppLocal } from './app'
import { Button } from './button'
import { Machine } from './machine'
import { MonoMachine } from './mono'

export const MachineControls = view(class props {
  app!: AppLocal
  groupId!: MonoMachine['groupId']
  state!: Machine['state']
  methods!: MonoMachine['methods']
}, ({ $, fx }) => {
  fx(({ app, groupId, state, methods: { start, stop } }) => {
    $.view = <div part="controls">
      <Button
        shadow={3}
        onClick={
          (state === 'running' ? stop : start)
          ?? (() => { })
        } style={{
          color: {
            ['running']: '#1f3',
            ['compiling']: 'cyan',
            ['errored']: 'red',
            ['idle']: '#334',
            ['init']: '#334',
            ['ready']: '#667',
            ['suspended']: '#667',
          }[state]
        }}>
        <IconSvg
          set="feather"
          icon={state === 'running' ? "stop-circle" : "play-circle"}
        />
      </Button>
      {
        app.methods.getMachinesInGroup(groupId)
          .flatMap((machine) =>
            machine.presets
          ).length === 0
        && state === 'suspended'
        && <Button
          part="remove"
          shadow={3}
          onClick={() =>
            app.methods.removeMachinesInGroup(groupId)} style={{
              color: '#f30'
            }}>
          <IconSvg
            set="feather"
            icon="x-circle"
          />
        </Button>
      }
    </div>
  })
})
