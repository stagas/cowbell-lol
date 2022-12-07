import { Slider } from '../slider'
import { checksum } from './checksum'

export function markerForSlider(slider: Slider) {
  return ({
    key: slider.id,
    index: slider.sourceIndex!,
    size: slider.source!.arg.length,
    kind: 'param',
    color: `hsl(${checksum(slider.id) % 360}, 55%, 25%)`,
    hoverColor: `hsl(${checksum(slider.id) % 360}, 55%, 35%)`,
  })
}
