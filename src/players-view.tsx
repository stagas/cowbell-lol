/** @jsxImportSource minimal-view */

import { cheapRandomId } from 'everyday-utils'
import { element, view, web } from 'minimal-view'
import { Player } from './player'
import { PlayerEditor } from './player-editor'
import { PlayerView } from './player-view'
import { Project } from './project'
import { SequencerView } from './sequencer-view'
import { services } from './services'
import { TrackViewHandler } from './track-view'
import { cachedRef } from './util/cached-ref'

export const PlayersView = web(view('players',
  class props {
    id?= cheapRandomId()
    project!: Project
    onPlayerSoundSelect!: TrackViewHandler
    onPlayerPatternSelect!: TrackViewHandler
  },

  class local {
    host = element
    players?: Player[]
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
        display: flex;
        flex-flow: column nowrap;
      }

      .players {
        display: flex;
        background: ${skin.colors.bgLight};
        width: 100%;
        height: 100%;
        flex-flow: column nowrap;
      }
      `

      fx(({ id, project }) =>
        project.fx(({ sequencer, players, selectedPlayer, editorVisible }) => {
          $.view = <>
            <SequencerView sequencer={sequencer} project={project} />
            <div class="players">
              {players.flatMap((player, y) => [
                <PlayerView
                  key={player.$.id!}
                  id={player.$.id!}
                  ref={cachedRef(`player-${player.$.id}`)}
                  y={y}
                  player={player}
                  active={editorVisible && selectedPlayer === y}
                  onSoundSelect={$.onPlayerSoundSelect}
                  onPatternSelect={$.onPlayerPatternSelect}
                />,

                selectedPlayer === y &&
                <PlayerEditor
                  key="player-editor"
                  ref={cachedRef(`player-editor-${id}`)}
                  id={id}
                  player={player}
                  editorVisible={editorVisible}
                />
              ].filter(Boolean))}
            </div>
          </>
        })
      )
    })
  }
))
