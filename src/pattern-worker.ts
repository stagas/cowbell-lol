import { rpc } from 'rpc-mini'
import defineFunction from 'define-function'
import { Deferred } from 'everyday-utils'
import memoize from 'memoize-pure'
import { getMidiEventsForNotes, NoteEvent } from 'scheduler-node/event-util'
import { checksumId } from './util/checksum-id'

// @ts-ignore
const url = new URL('./pattern-processor.js', import.meta.url)

const processorSetupPromise = (async function getSetupSource() {
  const res = await fetch(url)
  const text = await res.text()
  return text
})()

type SandboxFn = {
  ctx: ReturnType<typeof defineFunction.context>,
}

const sandbox = Deferred<SandboxFn>()

async function create() {
  const ctx = await defineFunction.context()
  sandbox.resolve({ ctx })
}

create()

type PatternFn = (start: number, end: number, bars: number, t: number) => readonly [
  NoteEvent[],
  number
]

const fnsDeferred = new Map<string, Deferred<PatternFn>>()

const compileFn = async function (sandboxCode: string) {
  const id = checksumId(sandboxCode)

  let deferred = fnsDeferred.get(id)
  if (deferred) return deferred.promise

  deferred = Deferred()
  fnsDeferred.set(id, deferred)

  const { ctx } = await sandbox.promise

  try {
    const fn = await ctx.def(sandboxCode) as PatternFn
    deferred.resolve(fn)
  } catch (error) {
    deferred.reject(error as Error)
  }

  return deferred.promise
}

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
  const setup = await processorSetupPromise

  const sandboxCode = `
    ${setup};

    i = 0
    start = arguments[0]
    end = arguments[1]
    bars = arguments[2]
    t = arguments[3]
    events = []
    seed = 42

    // used to show correct error lenses/markers
    // DO NOT MOVE THIS OR WRITE BELOW!
    const detectLinePos = 0;

    ${codeValue};

    return [events, bars, seed];
  `

  try {
    const fn = await compileFn(sandboxCode)

    const [notes = [], bars = numberOfBars] = await Promise.race([
      fn(0, numberOfBars, numberOfBars, turn || 0),
      new Promise<void>((_, reject) => setTimeout(reject, 10000, new Error('timeout'))),
    ]) || []

    const midiEvents = getMidiEventsForNotes(
      notes.filter((note) =>
        Array.isArray(note)
        && (note.length === 3 || note.length === 4)
        && note.every((n) =>
          typeof n === 'number' && isFinite(n)
        )
        && note[0] < bars
      ),
      bars
    )

    return {
      success: true,
      midiEvents,
      numberOfBars: bars,
    }
  } catch (error) {
    console.error(error)
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

const patternWorker: PatternWorker = {
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
    codeValue = codeValue.replaceAll('let i=0', 'i=0')
    return compilePattern(codeValue, numberOfBars, turn)
  },
}

rpc(self as unknown as MessagePort, patternWorker as any)
