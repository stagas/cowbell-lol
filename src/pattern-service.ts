import { rpc } from 'rpc-mini'

const worker = new Worker(
  // @ts-ignore
  new URL('./pattern-worker.js', import.meta.url),
  { type: 'module' }
)

const remote = rpc(worker as unknown as MessagePort)

export function compilePattern(codeValue: string, numberOfBars: number, turn?: number): Promise<
  {
    success: false,
    error: Error,
    sandboxCode: string | void,
  }
  | {
    success: true,
    midiEvents: WebMidi.MIDIMessageEvent[],
    numberOfBars: number
  }
> {
  return remote('compilePattern', codeValue, numberOfBars, turn)
}
