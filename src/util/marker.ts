import type { Marker } from 'canvy'

import { Slider } from '../slider-view'

export function markerForSlider(slider: Slider): Marker {
  return ({
    key: slider.id,
    index: slider.sourceIndex!,
    size: slider.source!.arg.length,
    kind: 'param',
    color: `hsl(${slider.hue}, 60%, 18%)`,
    hoverColor: `hsl(${slider.hue}, 60%, 26%)`,
    message: slider.name,
  })
}
