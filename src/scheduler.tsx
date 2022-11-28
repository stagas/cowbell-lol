/** @jsxImportSource minimal-view */

import { chain, element, on, view, web } from 'minimal-view'

import { AbstractDetail, BasePresets } from 'abstract-presets'
import { CanvyElement } from 'canvy'
import { pick } from 'everyday-utils'
import { SchedulerEventGroupNode } from 'scheduler-node'

// @ts-ignore TODO: suppressing temporarily
import { createSandbox, Sandbox } from 'sandbox-worklet'

import { AppLocal, HEIGHTS, SPACERS } from './app'
import { Audio } from './audio'
import { Code, EditorDetailData } from './code'
import { AudioMachine, MachineKind, MachineState } from './machine'
import { Midi } from './midi'
import { Preset, PresetsView } from './presets'
import { Spacer } from './spacer'
import { Wavetracer } from './wavetracer'

const schedulerDefaultEditorValue = `\
bars=2
seed=391434
on(1/4,delay(
   1/8,0.39,x=>
  rnd(10)<2?0:[x,
  24+rnd(5)**2,
  rnd(100)*3,0.1]))
`

// let sandbox: Sandbox | null = null
// let sandboxPromise: Promise<Sandbox>
// let sandboxTimeout: any
//   ; (async function create() {
//     sandboxPromise = createSandbox()
//     sandbox = await sandboxPromise
//     sandbox.ondestroy = () => {
//       clearTimeout(sandboxTimeout)
//       sandboxTimeout = setTimeout(create, 3000)
//     }
//   })()

export type SchedulerDetailData = EditorDetailData

export class SchedulerDetail extends AbstractDetail<SchedulerDetailData> {
  merge(other: this | this['data']) {
    return new SchedulerDetail(other)
  }

  equals(other: this | this['data']) {
    if (!other) return false

    if (other === this) return true

    if (other instanceof SchedulerDetail) other = other.data

    return other.editorValue === this.data.editorValue
  }

  satisfies(other: this | this['data']) {
    return this.equals(other)
  }
}

export class SchedulerPresets extends BasePresets<SchedulerDetail, Preset<SchedulerDetail>> {
  constructor(data: Partial<SchedulerPresets> = {}) {
    super(data, Preset, SchedulerDetail)
  }
}

export class SchedulerMachine extends AudioMachine<SchedulerPresets> {
  kind: MachineKind = 'scheduler'
  height = HEIGHTS['scheduler']
  spacer = SPACERS.scheduler
  presets = new SchedulerPresets()

  constructor(data: Partial<SchedulerMachine>) {
    super(data)
    Object.assign(this, data)
  }

  toJSON() {
    return pick(this, [
      'id',
      'kind',
      'height',
      'spacer',
      'presets',
      'outputs',
    ])
  }
}

export class SchedulerProps {
  id!: string
  app!: AppLocal
  audio!: Audio
  machine!: SchedulerMachine
}

export const Scheduler = web('scheduler', view(SchedulerProps, class local {
  host = element
  state?: MachineState
  spacer?: number[]
  outputs?: SchedulerMachine['outputs']

  groupNode?: SchedulerEventGroupNode

  editor!: CanvyElement
  errorMarkers?: any[] = []

  preset: Preset<SchedulerDetail> | null = null
  presets?: SchedulerPresets

  sandbox?: Sandbox
  schedulerCode!: string

  numberOfBars = 1
  midiEvents: WebMidi.MIDIMessageEvent[] = []

}, ({ $, fx, deps }) => {
  $.css = /*css*/`
  & {
    display: flex;
    flex-flow: row wrap;
    max-height: 100%;
    max-width: 100%;
  }
  `

  fx(({ machine }) => {
    $.state = machine.state
    $.presets = machine.presets
    $.spacer = machine.spacer
    $.outputs = machine.outputs
  })

  fx(({ app, id, editor, presets }) => {
    const preset = presets.selectedPreset
    if (preset) {
      $.preset = preset
      editor.setValue($.preset.detail.data.editorValue)
    } else {
      if (!$.preset) {
        app.methods.setPresetDetailData(id, {
          editorValue: localStorage.schedulerCode || schedulerDefaultEditorValue
        })
      }
    }
  })

  fx(({ app, id, schedulerCode }) => {
    app.methods.setPresetDetailData(id, { editorValue: schedulerCode })
  })

  fx(({ app, id, groupNode }) =>
    on(groupNode, 'connectchange')(() => {
      app.methods.setMachineState(id,
        groupNode.eventGroup.targets.size
          ? 'running' : 'suspended'
      )
    })
  )

  fx(({ audio: { schedulerNode } }) => {
    const groupNode = $.groupNode
      = new SchedulerEventGroupNode(schedulerNode)
    return () => {
      groupNode.destroy()
    }
  })

  fx(({ app, audio: { schedulerNode }, groupNode, outputs }) =>
    chain(outputs.map((output) =>
      chain(
        app.methods.connectNode(schedulerNode, output),
        app.methods.connectNode(groupNode, output)
      )
    ))
  )


  fx(({ groupNode, numberOfBars }) => {
    groupNode.eventGroup.loopEnd = numberOfBars
    groupNode.eventGroup.loop = true
  })

  fx(async () => {
    // TODO: temporarily disabling sandbox for demo deployments
    $.sandbox = {
      eval(code: string) {
        return new Function(code)()
        // return sandbox?.eval(code)
      },
      destroy() {
        // sandbox?.destroy()
      },
    } as Sandbox

    // ****************************************************************
    // TODO: should enable sandbox in production
    // ****************************************************************
    // $.sandbox = await sandboxPromise.then(() => ({
    //   eval(code: string) {
    //     return sandbox?.eval(code)
    //   },
    //   destroy() {
    //     sandbox?.destroy()
    //   },
    // } as Sandbox))
    // ****************************************************************
  })

  fx(async ({ groupNode, sandbox, schedulerCode, numberOfBars }) => {
    try {
      const setup = `
        let seed = 42;
        const rnd = (amt = 1) => {
          var t = seed += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return (((t ^ t >>> 14) >>> 0) / 4294967296) * amt;
        };

        let rand = rnd;
      `

      const events: any[] = []

      const On = (start: number, end: number) => {
        return (measure: number, fn: (x: number, end: number) => number[]) => {
          const result = []
          let count = 0
          end = bars
          for (let x = start; (x < end) && (++count < 128); x += measure) {
            const events = fn(x, x + measure)
            if (!events) continue
            if (Array.isArray(events[0])) {
              result.push(...events)
            } else {
              result.push(events)
            }
          }
          events.push(...result)
          return result
        }
      }


      /**
       * https://github.com/mkontogiannis/euclidean-rhythms/blob/474ed90a04068b7692fd7f7ff7525aacf853124d/src/index.ts
       *  Returns the calculated pattern of equally distributed pulses in total steps
       *  based on the euclidean rhythms algorithm described by Godfried Toussaint
       *
       *  @method  getPattern
       *  @param {Number} pulses Number of pulses in the pattern
       *  @param {Number} steps  Number of steps in the pattern (pattern length)
       */
      const getEuclideanPattern = (pulses: number, steps: number) => {
        if (pulses < 0 || steps < 0 || steps < pulses) {
          return [];
        }

        // Create the two arrays
        let first = new Array(pulses).fill([1]);
        let second = new Array(steps - pulses).fill([0]);

        let firstLength = first.length;
        let minLength = Math.min(firstLength, second.length);

        let loopThreshold = 0;
        // Loop until at least one array has length gt 2 (1 for first loop)
        while (minLength > loopThreshold) {
          // Allow only loopThreshold to be zero on the first loop
          if (loopThreshold === 0) {
            loopThreshold = 1;
          }

          // For the minimum array loop and concat
          for (let x = 0; x < minLength; x++) {
            first[x] = [...first[x], ...second[x]];
          }

          // if the second was the bigger array, slice the remaining elements/arrays and update
          if (minLength === firstLength) {
            second = second.slice(minLength);
          }
          // Otherwise update the second (smallest array) with the remainders of the first
          // and update the first array to include only the extended sub-arrays
          else {
            second = first.slice(minLength);
            first = first.slice(0, minLength);
          }
          firstLength = first.length;
          minLength = Math.min(firstLength, second.length);
        }

        // Build the final array
        const pattern: number[] = [...first.flat(), ...second.flat()];

        return pattern;
      }

      const Euclidean = (start: number, end: number) => {

        return (measure: number, pulses: number, fn: (x: number, end: number, soft: number) => number[]) => {
          const result = []
          let count = 0
          end = bars

          const pattern = getEuclideanPattern(pulses, Math.floor((end - start) / measure) / bars)

          let i = 0;
          for (let x = start; (x < end) && (++count < 128); x += measure) {
            const events = fn(x, x + measure, pattern[i % pattern.length])
            i++
            if (!events) continue
            if (Array.isArray(events[0])) {
              result.push(...events)
            } else {
              result.push(events)
            }
          }
          events.push(...result)
          return result
        }
      }

      const Delay = (measure: number, decay: number, fn: (x: number) => number[]) => {
        let lastNote: any
        let lastX: any
        let offset: any
        return (start: number, end: number) => {
          const result = []
          let count = 0

          let note = fn(start)
          if (!note) {
            if (!lastNote) return
            note = lastNote
            if (lastX >= end) return
            start = lastX
          }
          else {
            offset = note[0] - start
          }

          let x: any
          for (x = start; (x < end) && (++count < 128); x += measure) {
            note = [...note]
            note[0] = x + offset
            result.push(note)
            note = [...note]
            note[2] *= decay
            lastNote = note
          }
          lastX = x

          return result
        }
      }

      const [notes = [], bars = numberOfBars] = await Promise.race([
        sandbox.eval(`
          let start = 0;
          let end = ${numberOfBars};
          const getEuclideanPattern = ${getEuclideanPattern};
          const on = ${On(0, numberOfBars)};
          const euc = ${Euclidean(0, numberOfBars)}
          const delay = ${Delay};
          const has = () => true;
          const get = (target, key, receiver) => {
            if (key === Symbol.unscopables) return undefined;
            return Reflect.get(target, key, receiver);
          }
          // const sandbox = new Proxy({ Math, on }, { has, get });
          let events = [];
          let bars = ${numberOfBars};
          // with (sandbox) {
            ${setup};
            ${schedulerCode};
          // }
          return [events, bars];
      `) as unknown as Promise<readonly [[number, number, number, number][], number]>,
        new Promise<void>((_, reject) => setTimeout(reject, 10000, 'timeout')),
      ]) || []

      $.midiEvents = groupNode.eventGroup.replaceAllWithNotes(notes)
      $.numberOfBars = bars
      localStorage.schedulerCode = schedulerCode
    } catch (error) {
      console.warn(error)
      if (error === 'timeout') {
        sandbox.destroy()
        // $.schedulerCode = ''
      }
    }
  })

  fx(({ app, id, host, state, audio: { audioContext, workerBytes }, midiEvents, numberOfBars, presets, spacer }) => {
    $.view =
      <Spacer part="spacer" id={id} app={app} layout={host} initial={spacer}>
        <Code
          editorScene={app.editorScene}
          editor={deps.editor}
          value={deps.schedulerCode}
        />
        <div part="overlay">
          <Wavetracer
            part="waveform"
            id={`${id}-tracer`}
            kind="tracer"
            style="position:absolute;bottom:0"
            audioContext={audioContext}
            workerBytes={workerBytes}
            running={state === 'running'}
            loopTime={numberOfBars}
          />
          <Midi
            part="waveform"
            style="position:absolute; bottom:0"
            state={state as any}
            audioContext={audioContext}
            midiEvents={midiEvents}
            numberOfBars={numberOfBars}
          />
        </div>
        <PresetsView
          app={app}
          id={id}
          selectedPresetId={presets.selectedPresetId}
          presets={presets.items}
          style="pointer-events: all"
        />

      </Spacer>
  })
}))
