import { pick, attempt } from 'everyday-utils'
import { reactive } from 'minimal-view'
import { Player } from './player'
import { services } from './services'

export type Route = typeof Route.State

export const Route = reactive('route',
  class props {
    sourcePlayer!: Player
    targetPlayer?: Player
    targetNode?: AudioNode | AudioParam
    targetId!: string
    amount!: number
  },

  class local {
    sourceNode?: AudioNode
    gainNode?: GainNode
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
      toJSON = () => pick($ as Required<typeof $>, [
        'sourcePlayer',
        'targetPlayer',
        'targetId',
        'amount',
      ])
    })
  },

  function effects({ $, fx }) {
    fx(({ targetPlayer, targetId }) => {
      if (targetId === 'vol') {
        return targetPlayer.fx(({ gainNode }) => {
          $.targetNode = gainNode.gain
        })
      } else if (targetId === 'input') {
        return targetPlayer.fx(({ monoNode }) => {
          $.targetNode = monoNode
        })
      } else if (targetId === 'dest') {
        return targetPlayer.fx(({ audioPlayer }) =>
          audioPlayer.fx(({ destNode }) => {
            $.targetNode = destNode
          })
        )
      } else {
        return targetPlayer.fx(({ monoNode, compileState }) => {
          if (compileState === 'compiled') {
            $.targetNode = monoNode.params.get(targetId)!.audioParam
          }
        })
      }
    })

    fx(({ sourcePlayer }) =>
      sourcePlayer.fx(({ gainNode }) => {
        $.sourceNode = gainNode
      })
    )

    fx(() => services.fx(({ audio }) =>
      audio.fx(async ({ gainNodePool }) => {
        const gainNode = $.gainNode = await gainNodePool.acquire()
        gainNode.gain.value = $.amount
        return () => {
          attempt(() => gainNode.disconnect(), true)
          attempt(() => gainNodePool.release(gainNode), true)
        }
      })
    ))

    fx(({ gainNode, amount }) => {
      services.$.audio!.$.setParam(gainNode.gain, amount)
    })

    fx(({ sourceNode, targetNode, gainNode }) => {
      sourceNode.connect(gainNode)
      gainNode.connect(targetNode as AudioNode) // TODO: why doesn't AudioParam overload here?
      return () => {
        attempt(() => sourceNode.disconnect(gainNode), true)
        attempt(() => gainNode.disconnect(targetNode as AudioNode), true)
      }
    })
  }
)
