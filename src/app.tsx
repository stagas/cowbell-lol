/** @jsxImportSource minimal-view */

import { filterMap, shallowEqualArray } from 'everyday-utils'
import memoize from 'memoize-pure'
import { chain, element, on, view, web } from 'minimal-view'
import { lastRunningPlayers } from './audio'
import { Button } from './button'
import { Hint } from './hint'
import { Player } from './player'
import { Project, projectsById } from './project'
import { ProjectView } from './project-view'
import { cachedProjects, getOrCreateProject, projectsByDate, projectsGroup, services } from './services'
import { Toolbar } from './toolbar'
import { filterState } from './util/filter-state'
import { oneOf } from './util/one-of'
import { storage } from './util/storage'

// const projectButtonRefs = new Map<string, HTMLElement>()


// function deepObj(o: any) {
//   return Object.assign(o, { equals: isEqual })
// }

// function kindsOf(buffer: EditorBuffer) {
//   if (buffer.$.kind === 'sound') return 'sounds'
//   else if (buffer.$.kind === 'pattern') return 'patterns'
//   else throw new Error('Unreachable: unknown buffer kind: ' + buffer.$.kind)
// }

// function sortPresets(arr: EditorBuffer[]) {
//   return arr.sort((a, b) => {
//     if (a.$.title === b.$.title) {
//       return a.$.createdAt! - b.$.createdAt!
//     }
//     return a.$.title!.localeCompare(b.$.title!)
//   })
// }


export const focusMap = new Map<string, HTMLElement>()

export const cachedRefs = new Map<string, HTMLElement>()

export const cachedRef = memoize((id: string) => ({
  get current() {
    return cachedRefs.get(id)
  },
  set current(el) {
    if (el) {
      cachedRefs.set(id, el)
    }
  }
}))

export const projectsCounts = new Map<Project, number>()
export const projectsOlderExpanded = new Set<Project>()

export type Selected = {
  player: number,
  preset: string
}

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
    mode: 'normal' | 'solo' | 'browse' | 'userbrowse' = 'normal'
    tab?: 'drafts' | 'user' | 'recent' | 'liked' | 'playlist' | 'project'

    hint: JSX.Element = false

    project?: Project
    projects: Project[] = []

    userBrowse: string = 'guest'
    draftBrowse: Project | false = false
    draftFocus = false
    projectBrowse: Project | false = false
    projectExpand = false

    userProjects: Project[] = []
    draftProjects: Project[] = []
    allProjects: Project[] = []
    likedProjects: Project[] = []
    playingProjects: Project[] = []

    visibleProjects: Project[] = []
    hiddenProjects: Project[] = []
  },

  function actions({ $, fns, fn }) {
    let lastPlaylistSearchParams = ''

    return fns(new class actions {
      // working state

      // song

      // onKeyDown = fn(({ player }) => (e: KeyboardEvent) => {
      //   const cmd = (e.ctrlKey || e.metaKey)

      //   if (cmd && e.shiftKey) {
      //     $.state = 'deleting'
      //   } else {
      //     $.state = 'idle'
      //   }

      //   // if (cmd && e.code === 'Backquote') {
      //   //   e.preventDefault()
      //   //   e.stopPropagation()

      //   //   const dir = e.shiftKey ? -1 : 1

      //   //   if ($.focused === 'pattern') {
      //   //     let x = player.$.pattern
      //   //     x = modWrap(x + dir, player.$.patterns.length)
      //   //     player.$.pattern = x
      //   //     // trigger render
      //   //     $.selected = { ...$.selected }
      //   //   } else {
      //   //     let y = $.selected.player
      //   //     y = modWrap(y + dir, $.players.length)
      //   //     $.selected = { ...$.selected, player: y }
      //   //   }
      //   // }
      //   // else if (cmd && (e.key === ';' || e.key === ':')) {
      //   //   e.preventDefault()
      //   //   e.stopPropagation()

      //   //   const order = ['main', 'sound', 'sounds', 'pattern', 'patterns'] as const
      //   //   const dir = e.shiftKey ? -1 : 1

      //   //   let z = order.indexOf($.focused)
      //   //   z = modWrap(z + dir, order.length)
      //   //   $.focused = order[z]

      //   //   this.focusEditor()
      //   // }
      // })

      // onKeyUp = (e: KeyboardEvent) => {
      //   const cmd = (e.ctrlKey || e.metaKey)

      //   if (cmd && e.shiftKey) {
      //     $.state = 'deleting'
      //   } else {
      //     $.state = 'idle'
      //   }
      // }

      getPlayingProjects = () => {
        return [...filterState(cachedProjects, 'preparing', 'running')]
          .sort((a, b) =>
            a.$.startedAt - b.$.startedAt
          )
      }

      getPlaylistSearchParams = () => {
        let playingProjects = this.getPlayingProjects()
        if (!playingProjects.length) playingProjects = $.playingProjects

        let p = playingProjects.map((p) => [
          p.$.checksum,
          filterMap(p.$.players, (x, y) => (x.$.state === 'running' || lastRunningPlayers.has(x)) && y).join('.')
        ].filter(Boolean).join('-')
        ).join('--')

        if (!p) {
          p = lastPlaylistSearchParams
        }

        if (!p) return {}

        lastPlaylistSearchParams = p

        return { p }
      }

      onMovePlayers = async (project: Project) => {
        const playersToMove = project.$.players.filter((player) => lastRunningPlayers?.has(player) || player.$.state === 'running')
          .map((player) => Player({
            ...player.$.derive(),
            audioPlayer: $.project!.$.audioPlayer!,
            project: $.project!
          }))

        if (!playersToMove.length) return

        // the player .start() method is created in the next tick
        await Promise.resolve()

        playersToMove.forEach((player) => {
          player.$.start()
        })

        $.project!.$.players = [...$.project!.$.players, ...playersToMove]

        project.$.stop()

        $.playingProjects = [...filterState(cachedProjects, 'preparing', 'running')]
          .sort((a, b) =>
            a.$.startedAt - b.$.startedAt
          )
      }
    })
  },

  function effects({ $, fx, deps, refs }) {
    app = $.self

    let initial = true
    // routes
    services.fx(async ({ apiUrl: _, audio, href }) => {
      const { pathname, searchParams } = new URL(href)

      console.log('Navigated to:', pathname, searchParams)

      const [, top, sub] = pathname.split('/')

      try {
        if (top) {
          if (top === 'liked') {
            if (initial) {
              await services.$.fetchProjects({ ids: services.$.likes })
              services.$.refreshProjects()
              await Promise.resolve()
            }
            $.tab = 'liked'
            return
          } else if (top === 'drafts') {
            if (!sub) {
              $.draftFocus = false
              if (initial) {
                // drafts
                const draftIds = storage.projects.get(['x'])
                const ids = (draftIds.length ? draftIds : ['x'])
                ids.forEach((id) =>
                  getOrCreateProject({ id })
                )
                services.$.refreshProjects()
                await Promise.resolve()
              }
            } else {
              if (initial) {
                getOrCreateProject({ id: sub })
                services.$.refreshProjects()
                await Promise.resolve()
              }
              $.draftFocus = true
              $.draftBrowse = cachedProjects.get(sub) || false
              if ($.draftBrowse) {
                $.projectExpand = searchParams.get('expand') === 'true'
              }
            }
            $.tab = 'drafts'
            return
          } else if (top === 'playlist') {
            if (initial) {
              const p = decodeURIComponent(searchParams.get('p') || '')
              if (p) {
                const parts = p.split('--')
                lastRunningPlayers.clear()
                await Promise.resolve()
                const projectResults = await Promise.allSettled(
                  parts.map(async (x) => {
                    const [id, playersYs] = x.split('-')
                    const project = getOrCreateProject({ id })
                    await Promise.race([
                      project.$.load(),
                      new Promise((_, reject) => setTimeout(reject, 10000, new Error('Timeout loading')))
                    ])
                    await Promise.resolve()
                    const ys = playersYs.split('.').map(parseFloat)
                    const players = project.$.players
                    players.forEach((player, y) => {
                      if (ys.includes(y)) {
                        lastRunningPlayers.add(player)
                      }
                    })
                    return project
                  })
                )
                const playingProjects: Project[] = []
                for (const projectResult of projectResults) {
                  if (projectResult.status === 'fulfilled') {
                    playingProjects.push(projectResult.value)
                  }
                }
                $.playingProjects = playingProjects
              }
            }
            $.tab = 'playlist'
            return
          }

          if (!sub) {
            // /username
            if (top === 'guest') {
              services.$.go('/')
              return
            }

            $.userBrowse = top
            await services.$.fetchProjects({ username: $.userBrowse })
            $.tab = 'user'
            return
          }

          $.projectExpand = searchParams.get('expand') === 'true'
          $.draftBrowse = false

          if (cachedProjects.has(sub)) {
            $.projectBrowse = cachedProjects.get(sub)!
            if (audio.$.state !== 'running') {
              $.project = $.projectBrowse
            }
            $.tab = 'project'
            return
          } else {
            const project = getOrCreateProject({ id: sub })
            await project.$.load()
            $.projectBrowse = project
            if (audio.$.state !== 'running') {
              $.project = project
            }
            $.tab = 'project'
            return
          }
        }
      } catch (error) {
        console.warn(error)
      } finally {
        initial = false
      }

      if (pathname !== '/') {
        services.$.go('/', {})
      }

      $.mode = 'normal'
      $.tab = 'recent'
    })

    fx(({ tab, userBrowse, projectBrowse, draftBrowse }) => {
      let title = ''
      if (tab === 'drafts') {
        title = `Drafts${!draftBrowse ? '' : ` - ${draftBrowse.$.title}`}`
      } else if (tab === 'liked') {
        title = 'Liked'
      } else if (tab === 'user' && userBrowse !== 'guest') {
        title = userBrowse
      } else if (tab === 'project' && projectBrowse) {
        title = `${projectBrowse.$.author ?? 'guest'} - ${projectBrowse.$.title ?? 'Untitled'}`
      } else if (tab === 'playlist') {
        title = 'Playlist'
      }
      document.title = ['cowbell.lol', title].filter(Boolean).join(' - ')
    })

    fx(async ({ host }) => {
      host.style.opacity = '0'
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 7000))
      ])
      await new Promise(requestAnimationFrame)
      host.style.opacity = '1'
    })

    fx(({ apiUrl }) => {
      services.$.apiUrl = apiUrl
    })

    fx(({ project }) => {
      project.$.load()
    })

    services.fx(({ audio }) =>
      audio.fx.raf(({ state }) => {
        if (state === 'running') {
          return fx(({ tab: _ }) => {
            if (audio.$.state === 'running') {
              $.playingProjects = $.getPlayingProjects()
            }
          })
        }
      })
    )

    services.fx(({ projects }) => {
      if (!shallowEqualArray($.projects, projects)) {
        $.projects = projects
      }
    })

    fx(({ tab }) => {
      services.$.refreshProjects()
    })

    fx(({ projects, tab, userBrowse, projectBrowse, draftBrowse, draftFocus, projectExpand, playingProjects }, prev) => {
      // NOTE: when we edit a project and it becomes a draft remix under
      // our own username, it changes lists/tab, but we don't want
      // to trigger the change right away because the ui will jump
      // and/or project will change to another tab. So we create
      // exclusion heuristics to prevent that, though they need
      // to be maintained as they might conflict with other rules.
      if (
        tab !== 'playlist'
        && (prev.tab === tab && prev.userBrowse === userBrowse)
        && prev.projects && projects.length - prev.projects.length <= 1
        && prev.projectBrowse === projectBrowse
        && prev.projectExpand === projectExpand
        && prev.draftBrowse === draftBrowse
        && prev.draftFocus === draftFocus
      ) return

      function first(g: Project[]) {
        return g[0]
      }

      const prevVisibleProjects = $.visibleProjects
      const prevHiddenProjects = $.hiddenProjects

      $.draftProjects = draftFocus && draftBrowse ? [draftBrowse] : projects.filter((p) => p.$.isDraft)

      $.allProjects = projects.reduce(projectsGroup, []).map(first)

      $.userProjects = projects.filter((p) =>
        p.$.author === userBrowse
        || (p.$.originalAuthor === userBrowse && p.$.isDraft)
      )

      $.likedProjects = projects.filter((p) => services.$.likes.includes(p.$.checksum!)).sort(projectsByDate)

      $.visibleProjects = $.allProjects

      if (tab === 'drafts') {
        if (projectExpand && draftBrowse && draftFocus) {
          const related = projects.filter((p) =>
            p !== draftBrowse
            && (
              p.$.originalChecksum === draftBrowse.$.checksum
              || draftBrowse.$.originalChecksum === p.$.checksum
              || (p.$.originalChecksum && p.$.originalChecksum === draftBrowse.$.originalChecksum)
              || (p.$.title === draftBrowse.$.title && draftBrowse.$.author === p.$.author)
            )
          )

          $.visibleProjects = [
            draftBrowse,
            ...related
          ]
        } else {
          $.visibleProjects = $.draftProjects
        }
      } else if (tab === 'user') {
        $.visibleProjects = $.userProjects.reduce(projectsGroup, []).map(first)
      } else if (tab === 'liked') {
        $.visibleProjects = $.likedProjects
      } else if (tab === 'playlist') {
        $.visibleProjects = playingProjects
      } else if (tab === 'project' && projectBrowse) {
        if (projectExpand) {
          // TODO: the related needs to be its own util maintained centrally.
          const related = projects.filter((p) =>
            p !== projectBrowse
            && (
              p.$.originalChecksum === projectBrowse.$.checksum
              || projectBrowse.$.originalChecksum === p.$.checksum
              || (p.$.originalChecksum && p.$.originalChecksum === projectBrowse.$.originalChecksum)
              || (p.$.title === projectBrowse.$.title && projectBrowse.$.author === p.$.author)
            )
          )

          $.visibleProjects = [
            projectBrowse,
            ...related
          ]
        } else {
          $.visibleProjects = [projectBrowse]
        }

        services.$.fetchProjects({ remixesOfId: projectBrowse.$.checksum! })
        if (projectBrowse.$.originalChecksum) {
          services.$.fetchProjects({ remixesOfId: projectBrowse.$.originalChecksum })
        }
      }

      $.hiddenProjects = projects.filter((p) => !$.visibleProjects.includes(p))

      if (!$.visibleProjects.length) {
        if (!prevVisibleProjects.length) {
          services.$.go('/')
        } else {
          $.visibleProjects = prevVisibleProjects
          $.hiddenProjects = prevHiddenProjects
        }
      }

      $.project ??= $.visibleProjects[0]

      if (prev.tab !== tab || prev.projectBrowse !== projectBrowse || (tab === 'project' && !projectExpand)) {
        requestAnimationFrame(() => {
          window.scrollTo(0, 0)
        })
      }
    })

    fx(() =>
      chain(
        // on(window, 'keydown')($.onKeyDown),
        // on(window, 'keyup')($.onKeyUp),
      )
    )

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

    services.fx(({ skin, loggedIn, hasMoreProjects }) =>
      fx(({ distRoot, mode, tab, project, userBrowse, draftBrowse, draftFocus, projectBrowse, projectExpand, allProjects, userProjects, likedProjects, visibleProjects, hiddenProjects, playingProjects }) => {
        const Controls = ({ project }: { project: Project }) => <>
          {tab === 'playlist'
            && project !== $.visibleProjects[0]
            && <Button
              small
              onClick={() => $.onMovePlayers(project)}
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
          <Toolbar project={project} />

          <Hint message={deps.hint} />

          <main>
            <nav>
              <div class="tabs">
                {userBrowse !== 'guest' && !!userProjects.length && <Button ref={cachedRef(`avatar-tab-${userBrowse}`)} tab active={tab === 'user'} onClick={services.$.linkTo(`/${userBrowse}`)}>
                  <img crossorigin={'anonymous'} src={`https://avatars.githubusercontent.com/${userBrowse}?s=40&v=4`} />
                  {userBrowse}
                </Button>}

                {!!allProjects.length && <Button tab active={tab === 'recent'} onClick={services.$.linkTo(`/`)}>
                  Recent
                </Button>}

                {/* <Button tab active={browseTab === 'popular'} onClick={() => { $.browseTab = 'popular' }}>
                      Popular
                    </Button> */}

                {!!likedProjects.length && <Button tab active={tab === 'liked'} onClick={services.$.linkTo(`/liked`)}>
                  Liked
                </Button>}

                <Button tab active={tab === 'drafts'} onClick={services.$.linkTo(`/drafts`)}>
                  Drafts
                </Button>

                {!!playingProjects.length && <Button tab active={tab === 'playlist'} onClick={() => services.$.go(`/playlist`, $.getPlaylistSearchParams())} style={`color: ${skin.colors.brightCyan}`}>
                  Playlist
                </Button>}

                {projectBrowse && <Button tab active={tab === 'project'} onClick={() => projectBrowse && services.$.go(projectBrowse.$.pathname!)} style={`color: ${skin.colors.brightPurple}`}>
                  Project
                </Button>}
              </div>

              {!loggedIn && <Button
                pill
                onClick={() => {
                  const h = 700
                  const w = 500
                  const x = window.outerWidth / 2 + window.screenX - (w / 2)
                  const y = window.outerHeight / 2 + window.screenY - (h / 2)

                  const popup = window.open(`${distRoot}/login.html`, 'oauth', `width=${w}, height=${h}, top=${y}, left=${x}`)!

                  const off = on(window, 'storage')(() => {
                    off()
                    popup.close()
                    services.$.tryLogin()
                  })
                }}
                title={"No spam, no email, no messages and no tracking!\nWe only use your username to sign you in and that's it.\nClicking opens in a popup."}
              >
                Login with GitHub <span class="i la-github" />
              </Button>}

              {loggedIn && <Button round onClick={
                mode === 'normal'
                  || (mode === 'userbrowse' && $.userBrowse !== services.$.username)
                  ? services.$.linkTo(services.$.username)
                  : services.$.linkTo('/')
              }>
                <img crossorigin={'anonymous'} src={`https://avatars.githubusercontent.com/${services.$.username}?s=40&v=4`} />
              </Button>}

              {/*
                <Button round onClick={
                  mode === APP_MODE.NORMAL
                    ? services.$.linkTo('/browse')
                    : services.$.linkTo('/')
                }>
                  <span class={`i ${mode === APP_MODE.NORMAL
                    ? 'la-list'
                    : 'mdi-light-chevron-up'
                    }`}
                  />
                </Button> */}
            </nav>

            <div>
              {[
                ...visibleProjects.map((p) =>
                  <ProjectView
                    key={p.$.id!}
                    id={p.$.id!}
                    ref={cachedRef(p.$.id!)}
                    project={p}
                    primary={project === p}
                    browsing={oneOf(tab, 'project', 'playlist') && visibleProjects.length === 1}
                    controlsView={<Controls project={p} />}
                  />
                ),
                ...hiddenProjects.map((p) =>
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
              ]}
            </div>

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
