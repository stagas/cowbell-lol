/** @jsxImportSource minimal-view */

import { view, web } from 'minimal-view'
import { EditorBuffer } from './editor-buffer'
import { Player } from './player'
import { SliderView } from './slider-view'

export const Sliders = web(view('sliders',
  class props {
    player!: Player
    sound!: EditorBuffer
  },
  class local { },
  function actions({ $, fns, fn }) {
    return fns(new class actions {

    })
  },
  function effects({ $, fx }) {
    $.css = /*css*/`
    & {
      display: flex;
      pointer-events: none;
      flex-flow: row nowrap;
      box-sizing: border-box;
      padding: 15px 0 15px 15px;
      width: 100%;
      position: absolute;
      bottom: 0;
      opacity: 0.85;
    }

    ${SliderView} {
      pointer-events: all;
    }
    `

    fx(({ player, sound }) =>
      sound.fx(({ sliders }) => {
        $.view = [...sliders].map(([id, slider]) =>
          <SliderView
            key={id}
            id={id}
            slider={slider}
            player={player}
            running={true}
            vertical={false}
            showBg={false}
          />)
      })
    )
  }
))
