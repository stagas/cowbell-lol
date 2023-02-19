import { pick } from 'everyday-utils'
import { chain, reactive } from 'minimal-view'
import { Audio, AudioState } from './audio'
import { Player } from './player'

export type Send = typeof Send.State

export const Send = reactive('send',
  class props {
    sourcePlayer!: Player
    targetPlayer?: Player
    targetNode?: AudioNode | AudioParam
    targetId!: string
    vol!: number
    pan!: number
  },

  class local {
    audio?: Audio | null
    state?: AudioState
    sourceNode?: AudioNode

    inputNode?: AudioNode | null
    outputNode?: AudioNode | null

    gainNode?: GainNode | null
    panNode?: StereoPannerNode | null
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      toJSON = () => pick($ as Required<typeof $>, [
        'sourcePlayer',
        'targetPlayer',
        'targetId',
        'vol',
        'pan',
      ])
    })
  },

  function effects({ $, fx }) {
    fx(({ audio, gainNode, vol }) => {
      audio.$.setParam(gainNode.gain, vol)
    })

    fx(({ audio, panNode, pan }) => {
      audio.$.setParam(panNode.pan, pan)
    })

    fx(({ targetPlayer, targetId }) => {
      if (targetId === 'vol') {
        return targetPlayer.fx(({ gainNode }) => {
          $.targetNode = gainNode.gain
        })
      } else if (targetId === 'pan') {
        return targetPlayer.fx(({ panNode }) => {
          $.targetNode = panNode.pan
        })
      } else if (targetId === 'in') {
        return targetPlayer.fx(({ inputNode }) => {
          $.targetNode = inputNode
        })
      } else if (targetId === 'out') {
        return targetPlayer.fx(({ audioPlayer }) => audioPlayer.fx(({ inputNode }) => {
          $.targetNode = inputNode
        }))
      } else {
        return targetPlayer.fx(({ monoNode, compileState }) => {
          if (compileState === 'compiled') {
            const targetParam = monoNode.params.get(targetId)
            if (targetParam) {
              $.targetNode = targetParam.audioParam
            }
          }
        })
      }
    })

    fx(({ sourcePlayer }) =>
      chain(
        sourcePlayer.fx(({ outputNode }) => {
          $.sourceNode = outputNode
        }),
        sourcePlayer.fx(({ state, preview }) => {
          $.state = preview ? 'running' : state
        }),
      )
    )

    fx(({ audio, targetNode }) =>
      audio.fx(async ({ gainNodePool, panNodePool }) => {
        if (targetNode instanceof AudioParam) {
          const gainNode = $.gainNode = await gainNodePool.acquire({ channelCount: 1 })
          gainNode.gain.value = $.vol
          $.inputNode = gainNode
          $.outputNode = gainNode
        } else {
          const gainNode = $.gainNode = await gainNodePool.acquire({ channelCount: 2 })
          gainNode.gain.value = $.vol
          const panNode = $.panNode = await panNodePool.acquire()
          panNode.pan.value = $.pan
          $.inputNode = gainNode
          $.outputNode = panNode
        }
      })
    )

    fx(({ gainNode }) => () => {
      gainNode.disconnect()
    })

    fx(({ panNode }) => () => {
      panNode.disconnect()
    })

    fx(({ audio }) => () => {
      audio.$.gainNodePool!.dispose($.gainNode!)
      audio.$.panNodePool!.dispose($.panNode!)
      $.inputNode = $.outputNode = $.gainNode = $.panNode = null
    })

    fx(({ audio, gainNode, panNode }) => {
      gainNode.connect(panNode)
      return () => {
        audio.$.disconnect(gainNode, panNode)
      }
    })

    fx(({ audio, sourceNode, targetNode, inputNode, outputNode }) => {
      sourceNode.connect(inputNode)
      outputNode.connect(targetNode as AudioNode)
      return () => {
        audio.$.disconnect(sourceNode, inputNode)
        audio.$.disconnect(outputNode, targetNode as AudioNode)
      }
    })
  }
)
