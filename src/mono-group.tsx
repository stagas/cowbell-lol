/** @jsxImportSource minimal-view */

import { element, view, web } from 'minimal-view'
import { MonoNode } from 'mono-worklet'
import { animRemoveSchedule, animSchedule } from './anim'

import { AppLocal, HEIGHTS } from './app'
import { Audio } from './audio'
import { MachineView } from './machine'
import { MonoMachine } from './mono'
import { SchedulerMachine } from './scheduler'
import { Vertical } from './vertical'

// TODO: make this a machine kind and pass the group's state context to Mono
// so it can fill in the start/stop ?

export const MonoGroup = web('mono-group', view(
  class props {
    app!: AppLocal
    audio!: Audio
    mono!: MonoMachine
    scheduler!: SchedulerMachine
  }, class local {
  host = element

  monoId?: string

  monoAudio?: Audio
  schedulerAudio?: Audio

  monoNode?: AudioNode
  analyserNode?: AnalyserNode

  running = false
  bytes?: Uint8Array
  workerBytes?: Uint8Array

  monoView?: JSX.Element
  schedulerView?: JSX.Element
}, ({ $, fx, fn }) => {
  fx(({ mono }) => {
    $.monoId = mono.id
  })

  fx(({ analyserNode }) => {
    $.bytes = new Uint8Array(analyserNode.fftSize)
  })

  fx(({ bytes }) => {
    $.workerBytes = new Uint8Array(new SharedArrayBuffer(bytes.byteLength))
  })

  fx(async ({ audio, monoId }) => {
    const monoNode = $.monoNode = await MonoNode.create(audio.audioContext, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      processorOptions: {
        metrics: 0,
      }
    })
    audio.audioNodes.set(monoId, monoNode)

    const analyserNode = $.analyserNode = new AnalyserNode(audio.audioContext, {
      channelCount: 1,
      fftSize: audio.fftSize,
      smoothingTimeConstant: 0.5
    })

    return () => {
      monoNode.disconnect()
      analyserNode.disconnect()
    }
  })

  let analyseStop = () => { }
  const analyseStart = fn(({ analyserNode, bytes, workerBytes }) => {
    analyseStop = () => {
      animRemoveSchedule(tick)
    }

    function tick() {
      analyserNode.getByteTimeDomainData(bytes)
      workerBytes.set(bytes)
      animSchedule(tick)
    }

    return () => {
      animSchedule(tick)
    }
  })

  fx(({ mono: { state } }) => {
    $.running = state === 'running'
  })

  fx(({ running }) => {
    if (running) {
      analyseStart()
    } else {
      analyseStop()
    }
  })

  fx(({ audio, analyserNode, monoNode, workerBytes }) => {
    $.monoAudio = new Audio({
      ...audio, audioNode: monoNode, workerBytes, analyserNode
    })
    $.schedulerAudio = new Audio({ ...audio, workerBytes })
  })

  fx(function drawSchedulerView({ app, schedulerAudio, scheduler }) {
    $.schedulerView = <>
      <MachineView
        app={app}
        audio={schedulerAudio}
        machine={scheduler}
      />

      <Vertical app={app} id={scheduler.id} height={scheduler.height ?? HEIGHTS[scheduler.kind]} />
    </>
  })

  fx.task(function drawMonoView({ app, monoAudio, mono }) {
    $.monoView = <>
      <MachineView
        app={app}
        audio={monoAudio}
        machine={mono}
      />
      <Vertical app={app} id={mono.id} height={mono.height ?? HEIGHTS[mono.kind]} />
    </>
  })

  fx.task(function drawMonoGroup({ monoView, schedulerView }) {
    $.view = [monoView, schedulerView]
  })
}))
