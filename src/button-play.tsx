/** @jsxImportSource minimal-view */

import { element, Reactive, view, web } from 'minimal-view'
import { AudioState } from './audio'
import { ButtonIcon } from './button-icon'
import { Slider, SliderView } from './slider-view'

export const ButtonPlay = web(view('button-play',
  class props {
    kind?: string = 'normal'
    target!: Reactive<any, {
      id: string,
      state: AudioState,
      toggle: () => void,
      vol: number
    }, void>
    // TODO: for all states
    running!: JSX.Element
    suspended!: JSX.Element
    onDelete?: () => void
  },

  class local {
    host = element
    volumeView?: JSX.Element
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
    fx(({ target }) => {
      const slider = Slider({
        value: target.$.vol,
        min: 0,
        max: 1,
        hue: 100,
        id: `${target.$.id}`,
        name: '',
      })

      return target.fx(({ state }) => {
        $.volumeView = <SliderView
          id={`${target.$.id}`}
          slider={slider}
          vol={target.deps.vol}
          running={state === 'running'}
          showBg={true}
        />
      })
    })

    fx(({ kind, target, running, suspended, volumeView }) =>
      target.fx(({ state }) => {
        $.view =
          <>
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

            {volumeView}
          </>
      })
    )
  }
))
