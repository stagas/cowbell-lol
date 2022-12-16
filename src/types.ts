import { Lens, Marker } from 'canvy'
import { Slider } from './slider-view'

export type Sliders = Map<string, Slider>

export interface EditorBuffer {
  id: string
  parentId?: string

  snapshot?: any

  value: string

  createdAt?: number
  isDraft?: boolean
  isNew?: boolean

  paramMarkers?: Marker[]
  errorMarkers?: Marker[]
  errorLenses?: Lens[]
  sliders?: Sliders

  canvasPromise?: Promise<void>
  canvas?: HTMLCanvasElement
  canvases?: Map<HTMLCanvasElement, string>

  midiEvents?: WebMidi.MIDIMessageEvent[]
  numberOfBars?: number
}

export interface Track {
  id: string
  sound: string
  pattern: string
  vol: number
  focus: 'sound' | 'pattern'
}


