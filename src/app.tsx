/** @jsxImportSource minimal-view */

import { element, view, web } from 'minimal-view'
import { Avatar } from './avatar'
import { Button } from './button'
import { Hint } from './hint'
import { Project } from './project'
import { ProjectView } from './project-view'
import { projects } from './projects'
import { services } from './services'
import { Toolbar } from './toolbar'
import { cachedRef } from './util/cached-ref'
import { oneOf } from './util/one-of'

export let app: App

export type App = typeof App.State

export const App = web(view('app',
  class props {
    dev?= true
    apiUrl?= location.origin
    distRoot?= '/example'
  },

  class local {
    host = element
    state: 'idle' | 'deleting' = 'idle'
    hint: JSX.Element = false
  },

  function actions({ $, fns, fn }) {
    return fns(new class actions {
    })
  },

  function effects({ $, fx, deps, refs }) {
    app = $.self

    // prevent flash of unstyled content by hiding until the fonts are loaded
    fx(async ({ host }) => {
      host.style.opacity = '0'
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 7000))
      ])
      await new Promise(requestAnimationFrame)
      host.style.opacity = '1'
    })

    fx(({ apiUrl, distRoot }) => {
      services.$.apiUrl = apiUrl
      services.$.distRoot = distRoot
    })

    services.fx(({ skin }) =>
      fx(({ distRoot }) => {
        const bodyStyle = document.createElement('style')
        bodyStyle.textContent = /*css*/`
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }

        @font-face {
          font-family: icon;
          src: url("${distRoot}/iconfont.woff2") format("woff2");
          font-weight: normal;
          font-style: normal;
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background: ${skin.colors.bgDarker};
          color: ${skin.colors.fg};
          font-size: 13px;
        }
        `

        document.head.appendChild(bodyStyle)
      })
    )

    services.fx(({ skin }) => {
      $.css = /*css*/`
      ${skin.css}

      & {
        width: 100%;
        display: flex;
        flex-flow: column nowrap;
      }

      [part=app-scroller] {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
      }

      [part=app-editor] {
        flex: 1;
        width: 100%;
        height: 100%;
      }

      main {
        position: relative;
        max-width: 800px;
        width: 100%;
        align-self: center;

        .light {
          background: ${skin.colors.bg};
          box-shadow: 0 0 24px 10px ${skin.colors.shadeBlack};
        }

        .load-more {
          all: unset;
          display: flex;
          margin: 0 auto;
          padding: 10px 20px;
          font-family: ${skin.fonts.sans};
          font-size: 16px;
          color: ${skin.colors.fgPale};
          letter-spacing: 1px;
          cursor: pointer;
          &:hover {
            color: ${skin.colors.fgLight};
          }
        }
      }

      nav {
        padding: 10px 15px;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: space-between;
        background: ${skin.colors.shadeSofter};

        .tabs {
          flex: 1;
          display: flex;
          flex-flow: row wrap;
          gap: 12px;
        }
      }

      footer {
        position: relative;
        max-width: 800px;
        width: 100%;
        align-self: center;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        min-height: 150px;
        padding-bottom: 70vh;
        pointer-events: none;
      }
      `
    })

    services.fx(({ skin, loggedIn, hasMoreProjects }) => projects.fx(({ mode, tab, project, userBrowse, draftBrowse, draftFocus, projectBrowse, all, user, liked, visible, hidden, playing }) => {
      const Controls = ({ project }: { project: Project }) => <>
        {tab === 'playlist'
          && project !== projects.$.visible[0]
          && <Button
            small
            onClick={() => projects.$.onMovePlayers(project)}
            title="Merge playing into top project"
          >
            <span class={`i clarity-arrow-line`} />
          </Button>}
      </>

      if (tab === 'drafts' && draftBrowse && draftFocus) {
        tab = 'project'
        projectBrowse = draftBrowse
      }
      if (draftBrowse) {
        projectBrowse = draftBrowse
      }

      $.view = <>
        <Toolbar ref={cachedRef('toolbar')} project={project} />

        <Hint message={deps.hint} />

        <main>
          <nav>
            <div class="tabs">
              {userBrowse !== 'guest'
                && !!user.length
                && <Button
                  ref={cachedRef(`avatar-tab-${userBrowse}`)}
                  tab
                  active={tab === 'user'}
                  onClick={services.$.linkTo(`/${userBrowse}`)}
                >
                  <Avatar username={userBrowse} />
                  {userBrowse}
                </Button>}

              {!!all.length && <Button
                tab
                active={tab === 'recent'}
                onClick={services.$.linkTo(`/`)}
              >
                Recent
              </Button>}

              {!!liked.length && <Button
                tab
                active={tab === 'liked'}
                onClick={services.$.linkTo(`/liked`)}
              >
                Liked
              </Button>}

              <Button
                tab
                active={tab === 'drafts'}
                onClick={services.$.linkTo(`/drafts`)}
              >
                Drafts
              </Button>

              {!!playing.length && <Button
                tab
                active={tab === 'playlist'}
                onClick={() =>
                  services.$.go(`/playlist`, project.$.getPlaylistSearchParams())
                }
                style={`color: ${skin.colors.brightCyan}`}
              >
                Playlist
              </Button>}

              {projectBrowse && <Button
                tab
                active={tab === 'project'}
                onClick={() =>
                  projectBrowse && services.$.go(projectBrowse.$.pathname!)
                }
                style={`color: ${skin.colors.brightPurple}`}
              >
                Project
              </Button>}
            </div>

            {!loggedIn && <Button
              pill
              onClick={services.$.loginWithGithub}
              title={"No spam, no email, no messages and no tracking!\nWe only use your username to sign you in and that's it.\nClicking opens in a popup."}
            >
              Login with GitHub <span class="i la-github" />
            </Button>}

            {loggedIn && <Button
              round
              onClick={
                mode === 'normal'
                  || (mode === 'userbrowse' && projects.$.userBrowse !== services.$.username)
                  ? services.$.linkTo(services.$.username)
                  : services.$.linkTo('/')
              }>
              <Avatar username={services.$.username} />
            </Button>}
          </nav>

          <div>{[
            ...visible.map((p) =>
              <ProjectView
                key={p.$.id!}
                id={p.$.id!}
                ref={cachedRef(p.$.id!)}
                project={p}
                primary={project === p}
                browsing={
                  oneOf(tab, 'project', 'playlist')
                  && visible.length === 1
                }
                controlsView={<Controls project={p} />}
              />
            ),
            ...hidden.map((p) =>
              <ProjectView
                key={p.$.id!}
                id={p.$.id!}
                class="hidden"
                ref={cachedRef(p.$.id!)}
                project={p}
                primary={project === p}
                browsing={false}
                controlsView={<Controls project={p} />}
              />
            )
          ]}</div>

          {tab === 'recent' ?
            hasMoreProjects ?
              <button class="load-more" onclick={services.$.loadMoreProjects}>MORE</button>
              : <button class="load-more" style="pointer-events: none">THIS IS THE END</button>
            : false
          }
        </main>

        <footer>🔔</footer>
      </>
    }))
  }
))

////////////////

// export const Skeleton = view('skeleton',
//   class props {

//   },
//   class local { },
//   function actions({ $, fns, fn }) {
//     return fns(new class actions {

//     })
//   },
//   function effects({ $, fx, deps, refs }) {

//   }
// )
// type Skeleton = typeof Skeleton.Hook
