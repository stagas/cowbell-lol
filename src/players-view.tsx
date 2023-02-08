/** @jsxImportSource minimal-view */

import { web, view, element, Dep } from 'minimal-view'
import { Selected } from './app'
import { Player } from './player'
import { PlayerView } from './player-view'
import { Focused } from './project-view'
import { services } from './services'
import { TrackView, TrackViewHandler } from './track-view'
import { classes } from './util/classes'
import { storage } from './util/storage'
import { Vertical } from './vertical'

export const PlayersView = web(view('players',
  class props {
    players!: Player[]
    focused!: Focused
    selected!: Selected
    editorEl!: Dep<HTMLElement>
    editorVisible!: boolean
    EditorView!: () => JSX.Element
    SendsView!: () => JSX.Element
    onPlayerSoundSelect!: TrackViewHandler
    onPlayerPatternSelect!: TrackViewHandler
  },

  class local {
    host = element
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
    })
  },

  function effects({ $, fx }) {
    services.fx(({ skin }) => {
      $.css = /*css*/`
      ${skin.css}

      & {
        display: block;
        background: ${skin.colors.bgLight};
        width: 100%;
        height: 100%;
      }

      .player {
        &-routes {
          display: flex;
          flex-flow: row wrap;
          width: 100%;
          height: 69px;
        }
        &-sends {
          display: flex;
          position: relative;
          width: 15%;
          padding-left: 30px;
          ${TrackView} {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 0;
            width: 100%;
            height: 100%;
          }
          &-sliders {
            display: flex;
            flex-flow: row nowrap;
            width: 100%;
            position: relative;
          }
        }
      }
      `

      fx(({ players, editorEl, editorVisible, selected, EditorView, SendsView }) => {
        $.view = players.map((player, y) => <>
          <PlayerView
            key={player.$.id!}
            id={player.$.id!}
            y={y}
            player={player}
            focused={$.focused}
            selected={selected}
            active={editorVisible && selected.player === y}
            onSoundSelect={$.onPlayerSoundSelect}
            onPatternSelect={$.onPlayerPatternSelect}
          />

          {selected.player === y && <div
            ref={editorEl}
            class={classes({
              'player-view': true,
              hidden: !editorVisible
            })}
          >
            <SendsView />
            <EditorView />
            {editorVisible && <Vertical
              align='y'
              id='editor'
              size={storage.vertical.get('editor', 290)}
            />}
          </div>}
        </>)

      })
    })
  }
))
