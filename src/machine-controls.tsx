/** @jsxImportSource minimal-view */

import { IconSvg } from 'icon-svg'

import { App } from './app'
import { Button } from './button'
import { MachineData } from './machine-data'

export const MachineControls = (
  { app, groupId, state, start, stop }: {
    app: App,
  } & Pick<MachineData, 'groupId' | 'state' | 'start' | 'stop'>
) =>
  <div part="controls">
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
      app.getMachinesInGroup(groupId)
        .flatMap((machine) =>
          machine.presets
        ).length === 0
      && state === 'suspended'
      && <Button
        part="remove"
        shadow={3}
        onClick={() =>
          app.removeMachinesInGroup(groupId)} style={{
            color: '#f30'
          }}>
        <IconSvg
          set="feather"
          icon="x-circle"
        />
      </Button>
    }
  </div>
