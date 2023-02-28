export function areMidiEventsEqual(
  a: WebMidi.MIDIMessageEvent[] | undefined,
  b: WebMidi.MIDIMessageEvent[]
) {
  if (a) {
    if (a.length === b.length) {
      if (a.every((ev, i) =>
        b[i].receivedTime === ev.receivedTime
        && b[i].data[0] === ev.data[0]
        && b[i].data[1] === ev.data[1]
        && b[i].data[2] === ev.data[2]
      )) {
        return true
      }
    }
  }
  return false
}
