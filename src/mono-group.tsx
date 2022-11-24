/** @jsxImportSource minimal-view */

import { element, view, web } from 'minimal-view'
import { MonoNode } from 'mono-worklet'
import { animRemoveSchedule, animSchedule } from './anim'

import { App, AppAudio, HEIGHTS } from './app'
import { Machine, MachineAudio } from './machine'
import { MachineData } from './machine-data'
import { MonoDetail } from './mono'
import { SchedulerDetail } from './scheduler'
import { Vertical } from './vertical'

export const MonoGroup = web('mono-group', view(
  class props {
    app!: App
    audio!: AppAudio
    mono!: MachineData<MonoDetail>
    scheduler!: MachineData<SchedulerDetail>
  }, class local {
  host = element

  monoId?: string

  monoNode?: AudioNode
  analyserNode?: AnalyserNode

  running = false
  bytes?: Uint8Array
  workerBytes?: Uint8Array

  monoAudio?: MachineAudio
  schedulerAudio?: MachineAudio

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

  fx(({ audio, monoNode, workerBytes, analyserNode }) => {
    $.monoAudio = { ...audio, audioNode: monoNode, workerBytes, analyserNode }
    $.schedulerAudio = { ...audio, workerBytes }
  })

  fx(({ app, audio, schedulerAudio, scheduler }) => {
    $.schedulerView = <>
      <Machine
        app={app}
        audio={schedulerAudio}
        machine={scheduler}
        {...audio}
        {...scheduler}
      />

      <Vertical app={app} id={scheduler.id} height={scheduler.height ?? HEIGHTS[scheduler.kind]} />
    </>
  })

  fx(({ app, audio, mono, monoAudio }) => {
    $.monoView = <>
      <Machine
        app={app}
        audio={monoAudio}
        machine={mono}
        {...audio}
        {...mono}
      />
      <Vertical app={app} id={mono.id} height={mono.height ?? HEIGHTS[mono.kind]} />
    </>
  })

  fx(({ monoView, schedulerView }) => {
    $.view = [monoView, schedulerView]
  })
}))
