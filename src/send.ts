import { pick } from 'everyday-utils'
import { chain, reactive } from 'minimal-view'
import { Audio, AudioState } from './audio'
import { Player } from './player'
import { services } from './services'
import { oneOf } from './util/one-of'

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
    audio!: Audio
    state?: AudioState
    sourceNode?: AudioNode
    inputNode?: AudioNode
    outputNode?: AudioNode

    gainNode?: GainNode
    panNode?: StereoPannerNode
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
    fx(() => services.fx(({ audio }) => {
      $.audio = audio
    }))

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

    fx(({ audio }) =>
      audio.fx(({ gainNodePool, panNodePool }) => fx(async ({ targetNode }) => {
        if (targetNode instanceof AudioParam) {
          const gainNode = $.gainNode = await gainNodePool.acquire({ channelCount: 1 })
          gainNode.gain.value = $.vol
          $.inputNode = gainNode
          $.outputNode = gainNode
          return () => {
            gainNode.disconnect()
            // gainNodePool.release(gainNode)
          }
        } else {
          const gainNode = $.gainNode = await gainNodePool.acquire({ channelCount: 2 })
          gainNode.gain.value = $.vol
          const panNode = $.panNode = await panNodePool.acquire()
          panNode.pan.value = $.pan
          // gainNode.connect(panNode)
          $.inputNode = gainNode
          $.outputNode = panNode
          return () => {
            gainNode.disconnect()
            panNode.disconnect()
            // gainNodePool.release(gainNode)
            // panNodePool.release(panNode)
          }
        }
      }))
    )

    fx(({ audio, state, gainNode, sourceNode, targetNode, inputNode, outputNode }) => {
      if (oneOf(state, 'preparing', 'running')) {
        if (!(targetNode instanceof AudioParam)) {
          gainNode.connect($.panNode!)
        }
        sourceNode.connect(inputNode)
        outputNode.connect(targetNode as AudioNode)
        return () => {
          if (!(targetNode instanceof AudioParam)) {
            audio.$.disconnect(gainNode, $.panNode!)
          }
          audio.$.disconnect(sourceNode, inputNode)
          audio.$.disconnect(outputNode, targetNode as AudioNode)
        }
      }
    })
  }
)
