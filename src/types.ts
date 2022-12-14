import { Lens, Marker } from 'canvy'
import { Slider } from './slider-view'

export interface EditorBuffer {
  id: string
  value: string
  snapshot?: any
  paramMarkers?: Marker[]
  errorMarkers?: Marker[]
  errorLenses?: Lens[]
  sliders?: Map<string, Slider>
  canvas?: HTMLCanvasElement
}
