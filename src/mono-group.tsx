/** @jsxImportSource minimal-view */

import { element, view, web } from 'minimal-view'
import { MonoNode } from 'mono-worklet'
import { SchedulerEventGroupNode } from 'scheduler-node'
// import { PianoKeys } from 'x-pianokeys'
import { animRemoveSchedule, animSchedule } from './anim'

import { AppContext } from './app'
import { Audio } from './audio'
import { MachineState, MachineView } from './machine'
import { MonoMachine } from './mono'
import { SchedulerMachine } from './scheduler'
import { Spacer } from './spacer'
// import { Vertical } from './vertical'

// TODO: make this a machine kind and pass the group's state context to Mono
// so it can fill in the start/stop ?

export const MonoGroup = web('mono-group', view(
  class props {
    groupId!: string
    app!: AppContext
    audio!: Audio
    mono!: MonoMachine
    presets!: AppContext['presets']
    scheduler!: SchedulerMachine
    focused!: boolean
  },

  class local {
    host = element
    align?: AppContext['align']

    state?: MachineState

    monoId?: string
    schedulerId?: string

    monoAudio?: Audio | null
    schedulerAudio?: Audio

    monoNode?: MonoNode | null
    gainNode?: GainNode | null
    groupNode?: SchedulerEventGroupNode
    keysNode?: SchedulerEventGroupNode

    analyserNode?: AnalyserNode | null
    bytes?: Uint8Array
    freqs?: Uint8Array
    workerBytes?: Uint8Array
    workerFreqs?: Uint8Array

    monoView?: JSX.Element
    schedulerView?: JSX.Element
  },

  function actions({ $, fn, fns }) {
    let tick = () => { }

    return fns(new class actions {
      analyseStop = () => {
        animRemoveSchedule(tick)
      }

      analyseStart =
        fn(({ analyserNode, bytes, freqs, workerBytes, workerFreqs }) => {

          tick = () => {
            analyserNode.getByteTimeDomainData(bytes)
            analyserNode.getByteFrequencyData(freqs)
            workerBytes.set(bytes)
            workerFreqs.set(freqs)
            animSchedule(tick)
          }

          return () => {
            animSchedule(tick)
          }
        })
    })
  },

  function effects({ $, fx }) {
    $.css = /*css*/`
    & {
      display: flex;
      height: 100%;
      width: 100%;
    }
    &(:not([focused])) {
      display: none;
    }
    `

    fx(function updateAlign({ app }) {
      $.align = app.align
    })

    fx(function updateMonoId({ mono }) {
      $.monoId = mono.id
    })

    fx(function updateSchedulerId({ scheduler }) {
      $.schedulerId = scheduler.id
    })

    fx(function createAnalyserBytes({ analyserNode }) {
      $.bytes = new Uint8Array(analyserNode.fftSize)
      $.freqs = new Uint8Array(analyserNode.frequencyBinCount)
    })

    fx(function createWorkerBytes({ bytes, freqs }) {
      $.workerBytes = new Uint8Array(new SharedArrayBuffer(bytes.byteLength))
        .fill(128) // center it at 128 (0-256)
      $.workerFreqs = new Uint8Array(new SharedArrayBuffer(freqs.byteLength))
    })

    fx(async function createMonoNode({ audio }) {
      const monoNode = $.monoNode = await audio.monoNodePool.acquire()

      return () => {
        monoNode.suspend()
        monoNode.disconnect()
        audio.monoNodePool.release(monoNode)
      }
    })

    fx(async function createSchedulerEventGroupNode({ audio }) {
      const groupNode = $.groupNode = await audio.groupNodePool.acquire()

      return () => {
        audio.groupNodePool.release(groupNode)
      }
    })

    fx(async function createSchedulerEventGroupNode({ audio }) {
      const keysNode = $.keysNode = await audio.groupNodePool.acquire()

      return () => {
        audio.groupNodePool.release(keysNode)
      }
    })

    fx(({ monoNode, keysNode }) => {
      keysNode.connect(monoNode)
      return () => {
        keysNode.disconnect(monoNode)
      }
    })

    fx(async function createGainNode({ audio }) {
      const gainNode = $.gainNode = await audio.gainNodePool.acquire()

      gainNode.connect(audio.gainNode)

      return () => {
        gainNode.disconnect(audio.gainNode)
        audio.gainNodePool.release(gainNode)
      }
    })

    fx(async function createAnalyserNode({ audio }) {
      const analyserNode = $.analyserNode = await audio.analyserNodePool.acquire()

      return () => {
        audio.analyserNodePool.release(analyserNode)
      }
    })

    fx(function updateRunningState({ mono: { state } }) {
      $.state = $.state === 'running' && state === 'init' ? $.state : state
    })

    fx.raf(function updateAttrState({ host, state }) {
      host.setAttribute('state', state)
    })

    fx.raf(function updateAttrVisibility({ host, focused }) {
      host.toggleAttribute('focused', focused)
    })

    fx(function connectNodes({ audio, state, monoNode, groupNode, gainNode, analyserNode }) {
      if (state === 'running' || state === 'preview') {
        audio.setParam(gainNode.gain, $.mono.gainValue)
        if (state === 'running') {
          groupNode.connect(monoNode)
        }

        monoNode.resume()
        monoNode.connect(gainNode)
        monoNode.connect(analyserNode)
      } else {
        audio.setParam(gainNode.gain, 0)
        try {
          groupNode.disconnect(monoNode)
        } catch (error) { console.warn(error) }
        setTimeout(() => {
          monoNode.suspend()
          try {
            monoNode.disconnect(gainNode)
          } catch (error) {
            // console.warn(error)
          }
          try {
            monoNode.disconnect(analyserNode)
          } catch (error) {
            // console.warn(error)
          }
        }, 50)
      }
    })

    fx(function startOrStopAnalyser({ state, focused }) {
      if (state === 'running' || state === 'preview') {
        $.analyseStart()
      } else {
        $.analyseStop()
      }
    })

    fx(function createMonoAudio({ audio, analyserNode, monoNode, gainNode, workerBytes, workerFreqs }) {
      $.monoAudio = new Audio({
        ...audio,
        audioNode: monoNode,
        gainNode,
        analyserNode,
        workerBytes,
        workerFreqs,
      })
    })

    fx(function createSchedulerAudio({ audio, groupNode, workerBytes, workerFreqs }) {
      $.schedulerAudio = new Audio({
        ...audio,
        audioNode: groupNode,
        workerBytes,
        workerFreqs,
      })
    })

    fx(function drawMonoGroup({ host, app, presets, mono, monoAudio, scheduler, schedulerAudio }) {
      $.view = <Spacer part="spacer" align="x" setSpacer={() => { }} id="items-spacer" layout={host} initial={[0, 0.5]}
      >
        <MachineView
          app={app}
          audio={monoAudio}
          machine={mono}
          presets={presets.mono}
        />

        <MachineView
          app={app}
          audio={schedulerAudio}
          machine={scheduler}
          presets={presets.scheduler}
        />
      </Spacer>
    })
  }))
