/** @jsxImportSource minimal-view */

import { element, Reactive, view, web } from 'minimal-view'
import { AudioState } from './audio'
import { ButtonIcon } from './button-icon'

export const ButtonPlay = web(view('button-play',
  class props {
    kind?: string = 'normal'
    target!: Reactive<any, { state: AudioState, toggle: () => void }, void>
    // TODO: for all states
    running!: JSX.Element
    suspended!: JSX.Element
    onDelete?: () => void
  },

  class local {
    host = element
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      handleClick = (e: MouseEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
          $.onDelete?.()
        } else {
          return $.target.$.toggle()
        }
      }
    })
  },

  function effects({ $, fx }) {
    fx(({ kind, target, running, suspended }) =>
      target.fx(({ state }) => {
        $.view =
          <ButtonIcon
            class={kind}
            onTap={$.handleClick}
            onCtrlShiftClick={$.handleClick}
            color={state === 'running'
              ? ['#0f0', '#0f0']
              : ['#444', '#888']
            }>
            {state === 'running' ? running : suspended}
          </ButtonIcon>
      })
    )
  }
))
