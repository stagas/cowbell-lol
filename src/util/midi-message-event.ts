export class MIDIMessageEvent extends Event {
  data!: Uint8Array
  receivedTime!: number
  constructor(kind: string, payload: { data: Uint8Array }) {
    super(kind)
    this.data = payload.data
  }
}
