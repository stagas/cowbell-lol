declare namespace JSX {
  interface IntrinsicAttributes {
    theme?: string
  }
}

declare class MIDIMessageEvent extends Event implements WebMidi.MIDIMessageEvent {
  data: Uint8Array
  receivedTime: number
  constructor(kind: string, payload?: { data: Uint8Array })
}
