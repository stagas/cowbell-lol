/** @jsxImportSource minimal-view */

import { web, view, element } from 'minimal-view'

import { EditorScene } from 'canvy'
import { createSandbox, Sandbox } from 'sandbox-worklet'
import { SchedulerEventGroupNode, SchedulerNode, SchedulerTargetNode } from 'scheduler-node'

import { Code, Spacer } from './components'

let sandbox: Sandbox | null = null
let sandboxPromise: Promise<Sandbox>
let sandboxTimeout: any
  ; (async function create() {
    sandboxPromise = createSandbox()
    sandbox = await sandboxPromise
    sandbox.ondestroy = () => {
      clearTimeout(sandboxTimeout)
      sandboxTimeout = setTimeout(create, 3000)
    }
  })()

interface SchedulerDetail {
  editorValue: string
  numberOfBars: number
}

const schedulerDefaultEditorValue = `\
seed=42
on(1/4, x => [x, 20+rnd(20), rnd(127), 0.1])
on(1/4, x => [x+1/8, 20+rnd(20), rnd(17), 0.1])
`

export const Scheduler = web('scheduler', view(
  class props {
    schedulerNode!: SchedulerNode
    editorScene!: EditorScene

    detail!: SchedulerDetail
    outputs!: SchedulerTargetNode[]
  }, class local {
  host = element
  sandbox?: Sandbox

  groupNode?: SchedulerEventGroupNode

  schedulerCode!: string

  numberOfBars?: number

  midiEvents: WebMidi.MIDIMessageEvent[] = []
}, ({ $, fx, deps, refs }) => {
  $.css = /*css*/`
  & {
    display: flex;
    flex-flow: row wrap;
    max-height: 100%;
  }
  `
  // $.css = /*css*/`
  // & {
  //   display: flex;
  //   /* > * {
  //     flex: 1;
  //   } */
  // }

  // ${Code} {
  //   flex: 1;
  // }
  // `

  fx(({ detail }) => {
    $.schedulerCode ??= detail.editorValue ?? schedulerDefaultEditorValue
    $.numberOfBars ??= detail.numberOfBars ?? 2
  })

  fx(({ schedulerNode }) => {
    const groupNode = $.groupNode = new SchedulerEventGroupNode(schedulerNode)
    return () => {
      groupNode.destroy()
    }
  })

  fx(({ schedulerNode, groupNode, outputs }) => {
    outputs.forEach((output) => {
      schedulerNode.connect(output)
      groupNode.connect(output)
      console.log('connect', output)
    })
    return () => {
      outputs.forEach((output) => {
        console.log('disconnect', output)
        schedulerNode.disconnect(output)
        groupNode.disconnect(output)
      })
    }
  })

  fx(async () => {
    $.sandbox = await sandboxPromise.then(() => ({
      eval(code: string) {
        return sandbox?.eval(code)
      },
      destroy() {
        sandbox?.destroy()
      },
    } as Sandbox))
  })

  fx(({ groupNode, numberOfBars }) => {
    groupNode.eventGroup.loopEnd = numberOfBars
    groupNode.eventGroup.loop = true
  })

  fx(async ({ groupNode, sandbox, schedulerCode, numberOfBars }) => {
    try {
      const setup = `
        let seed = 42;
        const rnd = (scale = 1) =>
          (Math.sin(seed++ * 10e7 + 10e8) * 0.5 + 0.5) * scale;
        let rand = rnd;
        let events = []
      `

      const events: any[] = []

      const On = (start: number, end: number) => {
        return (measure: number, fn: (x: number) => number[]) => {
          const result = []
          let count = 0
          for (let x = start; (x < end) && (++count < 128); x += measure)
            result.push(fn(x))
          events.push(...result)
          return result
        }
      }

      const notes = await Promise.race([
        sandbox.eval(`
          let start = 0;
          let end = ${numberOfBars};
          const on = ${On(0, numberOfBars)};
          const has = () => true;
          const get = (target, key, receiver) => {
            if (key === Symbol.unscopables) return undefined;
            return Reflect.get(target, key, receiver);
          }
          const sandbox = new Proxy({ Math, on }, { has, get });
          let events = [];
          with (sandbox) {
            ${setup};
            ${schedulerCode};
          }
          return events;
      `) as unknown as Promise<[number, number, number, number][]>,
        new Promise<void>((_, reject) => setTimeout(reject, 10000, 'timeout')),
      ]) || []

      $.midiEvents = groupNode.eventGroup.replaceAllWithNotes(notes)
    } catch (error) {
      console.warn(error)
      if (error === 'timeout') {
        sandbox.destroy()
        // $.schedulerCode = ''
      }
    }
  })

  fx(({ host, editorScene }) => {
    $.view =
      <Spacer layout={host} initial={[0]}>
        <Code editorScene={editorScene} value={deps.schedulerCode} />
      </Spacer>
  })
}))
