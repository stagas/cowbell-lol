/** @jsxImportSource minimal-view */

import { Dep, view } from 'minimal-view'
import { Knob } from 'x-knob'
import { AudioPlayer } from './audio-player'
import { KnobView } from './knob-view'
import { Player } from './player'
import { Slider } from './slider'

export const Volume = view('volume',
  class props {
    target!: AudioPlayer | Player
    bare?: boolean = false
    theme?: string = 'cowbell'
    knobRef?: Dep<InstanceType<typeof Knob.Element>>
  },
  class local { },
  function actions({ $, fns, fn }) {
    return fns(new class actions {

    })
  },
  function effects({ $, fx, deps, refs }) {
    fx(({ target, bare, theme }) => {
      const slider = Slider({
        id: target.$.id!,
        value: target.$.vol!,
        min: 0,
        max: 1,
        hue: 100,
        name: '',
      })
      return target.fx(({ state }) => {
        const Fn = bare ? KnobView.Fn : KnobView
        $.view = <Fn
          id={slider.$.id!}
          knobRef={$.knobRef!}
          slider={slider}
          vol={target.deps.vol}
          theme={theme}
          running={state === 'running'}
        />
      })
    })
  }
)
