import { reactive } from 'minimal-view'
import { Player } from './player'

export type Shared = typeof Shared.State

export const Shared = reactive('shared',
  class props { },

  class local {
    lastRunningPlayers = new Set<Player>()
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {
    })
  },
  function effects({ $, fx }) {
  }
)

export const shared = Shared({})
