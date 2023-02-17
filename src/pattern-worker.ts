import { rpc } from 'rpc-mini'
import defineFunction from 'define-function'
import { Deferred } from 'everyday-utils'
import memoize from 'memoize-pure'
import { getMidiEventsForNotes, NoteEvent } from 'scheduler-node/event-util'

// @ts-ignore
const url = new URL('./pattern-processor.js', import.meta.url)

const processorSetupPromise = (async function getSetupSource() {
  const res = await fetch(url)
  const text = await res.text()
  return text
})()

type SandboxFn = (src: string) => readonly [
  NoteEvent[],
  number
]

const sandbox = Deferred<SandboxFn>()
let sandboxTimeout: any
  ; (async function create() {
    const setup = await processorSetupPromise
    const fn = await defineFunction(`
      const [src] = arguments;

      ${setup};

      return new Function(src)();
    `) as any

    fn.ondestroy = () => {
      clearTimeout(sandboxTimeout)
      sandboxTimeout = setTimeout(create, 3000)
    }
    sandbox.resolve(fn)
  })()

export const compilePattern = memoize(async function compilePattern(codeValue: string, numberOfBars: number, turn?: number): Promise<
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
  const fn = await sandbox.promise

  let sandboxCode: string | void

  try {
    sandboxCode = `
      start = 0;
      end = ${numberOfBars};
      events = [];
      bars = ${numberOfBars};
      t = ${turn};

      // used to show correct error lenses/markers
      // DO NOT MOVE THIS OR WRITE BELOW!
      const detectLinePos = 0;

      ${codeValue};

      return [events, bars, seed];
    `

    const [notes = [], bars = numberOfBars] = await Promise.race([
      fn(sandboxCode),
      new Promise<void>((_, reject) => setTimeout(reject, 10000, new Error('timeout'))),
    ]) || []

    const midiEvents = getMidiEventsForNotes(notes, bars)

    return {
      success: true,
      midiEvents,
      numberOfBars: bars,
    }
  } catch (error) {
    return {
      success: false,
      error: error as Error,
      sandboxCode,
    }
  }
})

export interface PatternWorker {
  compilePattern: typeof compilePattern
}

const preview: PatternWorker = {
  async compilePattern(codeValue: string, numberOfBars: number, turn?: number): Promise<
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
    return compilePattern(codeValue, numberOfBars, turn)
  },
}

rpc(self as unknown as MessagePort, preview as any)
