/** @jsxImportSource minimal-view */

import memoize from 'memoize-pure'
import { chain, element, on, ValuesOf, view, web } from 'minimal-view'
import { lastRunningPlayers } from './audio'
import { Button } from './button'
import { Hint } from './hint'
import { Player, players } from './player'
import { Project, projects, putProjectOnTop } from './project'
import { ProjectView } from './project-view'
import { schemas } from './schemas'
import { services } from './services'
import { Toolbar } from './toolbar'
import { classes } from './util/classes'
import { filterState } from './util/filter-state'
import { groupSort } from './util/group-sort'
import { oneOf } from './util/one-of'
import { storage } from './util/storage'

export const PROJECT_KINDS = {
  SAVED: '0',
  DRAFT: '1',
  REMOTE: '2',
} as const

export const DELIMITERS = {
  SAVE_ID: ',',
  SHORT_ID: ',',
} as const

export const APP_MODE = {
  NORMAL: 'normal',
  SOLO: 'solo',
  BROWSE: 'browse',
  USER_BROWSE: 'userbrowse'
} as const
export type AppMode = ValuesOf<typeof APP_MODE>

const cachedProjects = new Map<string, Project>()

function getOrCreateProject(p: schemas.ProjectResponse | { id: string }) {
  let project = cachedProjects.get(p.id)
  if (!project) {
    if ('title' in p) {
      project = Project({
        checksum: p.id,
        title: p.title,
        bpm: p.bpm,
        author: p.author,
        date: p.updatedAt,
        isDraft: false,
        remoteProject: p,
      })
    } else {
      project = Project({
        checksum: p.id,
      })
    }
  }
  cachedProjects.set(p.id, project)
  return project
}

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

    hint: JSX.Element = false

    // selected: Selected = storage.selected.get({ player: 0, preset: 'sound-kick' })

    // players: Player[] = []
    // player?: Player

    // sounds: EditorBuffer[] = []
    // sound?: EditorBuffer

    // patterns: EditorBuffer[] = []
    // pattern?: EditorBuffer

    // editor?: InstanceType<typeof Editor.Element>
    // editorVisible = storage.editorVisible.get(false)
    // editorEl?: HTMLElement
    // editorBuffer?: EditorBuffer

    project?: Project

    // remoteProjects: string[] = []
    // allProjects: {
    //   drafts: string[],
    //   liked: string[],
    //   recent: string[],
    // } = makeProjects(this.projects, storage.likes.get([]))

    mode: AppMode = 'normal'

    tab: 'drafts' | 'user' | 'recent' | 'liked' | 'playing' = 'user'

    userBrowse: string = 'guest'

    draftProjects: Project[] = []
    userProjects: Project[][] = []
    allProjects: Project[][] = []
    likedProjects: Project[] = []
    playingProjects: Project[] = []

    visibleProjects: Project[] = []
    hiddenProjects: Project[] = []

    presetsScrollEl?: HTMLDivElement

    // playersView: JSX.Element = false
    // editorView: JSX.Element = false
  },

  function actions({ $, fns, fn }) {
    // let lastSaveJson: any = {}

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

      // onProjectSelect = (project: Project) => {
      //   $.project = project
      //   putProjectOnTop(project)
      //   services.$.updateProjects()
      //   $.mode = APP_MODE.NORMAL
      // }

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

        $.playingProjects = [...filterState(projects, 'preparing', 'running')]
          .sort((a, b) =>
            a.$.startedAt - b.$.startedAt
          )
      }
    })
  },

  function effects({ $, fx, deps, refs }) {
    app = $.self

    // routes
    services.fx(({ href }) => {
      const { pathname, searchParams } = new URL(href)

      console.log('Navigated to:', pathname, searchParams)

      const [, username, target] = pathname.split('/')
      if (!username) {
        $.mode = APP_MODE.NORMAL
      } else if (!target) {
        $.userBrowse = username
        $.mode = APP_MODE.USER_BROWSE
      }
    })

    fx(async ({ host }) => {
      host.style.opacity = '0'
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 5000))
      ])
      host.style.opacity = '1'
    })

    fx(({ apiUrl }) => {
      services.$.apiUrl = apiUrl
    })

    fx(({ project }) => {
      project.$.load()
    })

    const off = services.fx(({ library }) =>
      library.fx(({ sounds, patterns }) => {
        if (sounds.length && patterns.length) {
          off()
          const draftIds = storage.projects.get(['x'])
          $.draftProjects = (draftIds.length ? draftIds : ['x'])
            .map((id) =>
              getOrCreateProject({ id })
            )
        }
      })
    )

    services.fx(async ({ apiUrl: _, username }) => {
      const endpoint = `/projects?u=${username}`
      const res = await services.$.apiRequest(endpoint)
      if (!res.ok) {
        console.error(endpoint, res)
        return
      }

      const projects: schemas.ProjectResponse[] = await res.json()
      console.log(endpoint, projects)

      $.userProjects = groupSort(projects)
        .map((group) =>
          group.map(getOrCreateProject)
        )
    })

    services.fx(async ({ apiUrl: _ }) => {
      const endpoint = `/projects`
      const res = await services.$.apiRequest(endpoint)
      if (!res.ok) {
        console.error(endpoint, res)
        return
      }

      const projects: schemas.ProjectResponse[] = await res.json()
      console.log(endpoint, projects)

      $.allProjects = groupSort(projects)
        .map((group) =>
          group.map(getOrCreateProject)
        )
    })

    services.fx.once(async ({ apiUrl: _, likes }) => {
      if (!likes.length) {
        $.likedProjects = []
        return
      }

      // TODO: only load the ones we don't have
      const endpoint = `/projects?ids=${likes}`
      const res = await services.$.apiRequest(endpoint)
      if (!res.ok) {
        console.error(endpoint, res)
        return
      }

      const projects: schemas.ProjectResponse[] = await res.json()
      console.log(endpoint, projects)

      $.likedProjects = projects.map(getOrCreateProject)
    })

    services.fx(({ audio }) =>
      audio.fx.raf(({ state }) => {
        if (state === 'running') {
          return fx(({ tab: _ }) => {
            if (audio.$.state === 'running') {
              $.playingProjects = [...filterState(projects, 'preparing', 'running')]
                .sort((a, b) =>
                  a.$.startedAt - b.$.startedAt
                )
            }
          })
        }
      })
    )

    fx(({ tab, draftProjects, userBrowse, userProjects, allProjects, likedProjects, playingProjects }) => {
      const usedProjects = new Set<string>()

      const first = (g: Project[]) => g[0]
      const add = (p: Project) => !usedProjects.has(p.$.checksum!) && (usedProjects.add(p.$.checksum!), 1)
      const drafts = (p: Project) => !!p.$.isDraft
      const not = (fn: (x: Project) => boolean) =>
        (x: Project) => !fn(x)

      if (tab === 'user' && userBrowse === 'guest') {
        tab = 'recent'
      }

      if (tab === 'playing' && !playingProjects.length) {
        tab = 'recent'
      }

      if (tab === 'drafts') {
        $.visibleProjects = [
          ...draftProjects.filter(drafts).filter(add),
          ...allProjects.map(first).filter(drafts).filter(add),
          ...userProjects.map(first).filter(drafts).filter(add),
          ...likedProjects.filter(drafts).filter(add),
        ]
        $.hiddenProjects = [
          ...draftProjects.filter(not(drafts)).filter(add),
          ...allProjects.map(first).filter(not(drafts)).filter(add),
          ...userProjects.map(first).filter(not(drafts)).filter(add),
          ...likedProjects.filter(not(drafts)).filter(add),
        ]
      } else if (tab === 'user') {
        $.visibleProjects = userProjects.map(first).filter(add)
        $.hiddenProjects = [
          ...draftProjects.filter(drafts).filter(add),
          ...allProjects.map(first).filter(add),
          ...likedProjects.filter(add),
        ]
      } else if (tab === 'recent') {
        $.visibleProjects = allProjects.map(first).filter(add)
        $.hiddenProjects = [
          ...draftProjects.filter(drafts).filter(add),
          ...userProjects.map(first).filter(add),
          ...likedProjects.filter(add),
        ]
      } else if (tab === 'liked') {
        $.visibleProjects = likedProjects.filter(add)
        $.hiddenProjects = [
          ...draftProjects.filter(drafts).filter(add),
          ...allProjects.map(first).filter(add),
          ...userProjects.map(first).filter(add),
        ]
      } else if (tab === 'playing') {
        $.visibleProjects = playingProjects.filter(add)
        $.hiddenProjects = [
          ...draftProjects.filter(drafts).filter(add),
          ...allProjects.map(first).filter(add),
          ...userProjects.map(first).filter(add),
          ...likedProjects.filter(add),
        ]
      }

      $.project ??= $.visibleProjects[0]
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
        pointer-events: none;
      }
      `
    })

    services.fx(({ skin, loggedIn }) =>
      fx.raf(({ distRoot, mode, tab, project, userBrowse, userProjects, likedProjects, visibleProjects, hiddenProjects, playingProjects }) => {
        if (!loggedIn) {
          if (tab === 'user' && userBrowse === 'guest') {
            tab = 'recent'
          }
        } else {
          if (userBrowse === 'guest') {
            userBrowse = services.$.username
          }
        }

        if (tab === 'playing' && !playingProjects.length) {
          tab = 'recent'
        }

        const Controls = ({ project }: { project: Project }) => tab === 'playing' &&
          <Button
            small
            onClick={() => $.onMovePlayers(project)}
          >
            <span class={`i clarity-arrow-line`} />
          </Button>


        $.view = <>
          <Toolbar project={project} />

          <Hint message={deps.hint} />

          <main>
            <nav>
              <div class="tabs">
                <Button tab active={tab === 'drafts'} onClick={() => { $.tab = 'drafts' }}>
                  Drafts
                </Button>

                {!!userProjects.length && <Button tab active={tab === 'user'} onClick={() => { $.tab = 'user' }}>
                  {userBrowse}
                </Button>}

                <Button tab active={tab === 'recent'} onClick={() => { $.tab = 'recent' }}>
                  Recent
                </Button>

                {/* <Button tab active={browseTab === 'popular'} onClick={() => { $.browseTab = 'popular' }}>
                      Popular
                    </Button> */}

                {!!likedProjects.length && <Button tab active={tab === 'liked'} onClick={() => { $.tab = 'liked' }}>
                  Liked
                </Button>}

                {!!playingProjects.length && <Button tab active={tab === 'playing'} onClick={() => { $.tab = 'playing' }} style={`color: ${skin.colors.brightCyan}`}>
                  Playing
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
                mode === APP_MODE.NORMAL
                  || (mode === APP_MODE.USER_BROWSE && $.userBrowse !== services.$.username)
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
                ...visibleProjects.map((p, i) =>
                  <ProjectView
                    key={p.$.id!}
                    id={p.$.id!}
                    ref={cachedRef(p.$.id!)}
                    project={p}
                    primary={project === p}
                    controlsView={i > 0 && <Controls project={p} />}
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
                    controlsView={<Controls project={p} />}
                  />
                )
              ]}
            </div>
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
