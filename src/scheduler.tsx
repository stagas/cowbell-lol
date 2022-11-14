/** @jsxImportSource minimal-view */

import { web, view } from 'minimal-view'
import { createSandbox, Sandbox } from 'sandbox-worklet'
import { SchedulerEventGroupNode, SchedulerNode } from 'scheduler-node'
import { Editor } from './editor'

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

export const Scheduler = web('btn', view(
  class props {
    targetNode!: AudioNode
    schedulerNode!: SchedulerNode
    numberOfBars?= 2
    editorValue!: string
  }, class local {
  groupNode?: SchedulerEventGroupNode
  sandbox?: Sandbox
  midiEvents: WebMidi.MIDIMessageEvent[] = []
  editorValue!: string
}, ({ $, fx, deps }) => {
  $.css = /*css*/`
  button {
    font-family: monospace;
    font-weight: bold;
  }
  &([state=active]) {
    button {
      background: teal;
    }
  }
  &([state=inactive]) {
    button {
      background: grey;
    }
  }`

  fx(({ schedulerNode }) => {
    const groupNode = $.groupNode = new SchedulerEventGroupNode(schedulerNode)
    console.log(groupNode)
    return () => {
      groupNode.destroy()
    }
  })

  fx(({ schedulerNode, groupNode, targetNode }) => {
    schedulerNode.connect(targetNode as any)
    groupNode.connect(targetNode as any)
    console.log('connected?')
    return () => {
      console.log('disconnected?')
      schedulerNode.disconnect(targetNode as any)
      groupNode.disconnect(targetNode as any)
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
    console.log('yea?')
  })

  fx(async ({ groupNode, sandbox, editorValue, numberOfBars }) => {
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
          ${editorValue};
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
        $.editorValue = ''
      }
    }

  })

  fx(() => {
    $.view = <>
      <Editor value={deps.editorValue} />
    </>
  })
}))
