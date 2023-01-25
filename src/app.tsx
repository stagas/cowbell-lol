/** @jsxImportSource minimal-view */

import { cheapRandomId } from 'everyday-utils'
import memoize from 'memoize-pure'
import { chain, element, on, queue, ValuesOf, view, web } from 'minimal-view'
import { Button } from './button'
import { Hint } from './hint'
import { Project } from './project'
import { ProjectView } from './project-view'
import { schemas } from './schemas'
import { services } from './services'
import { Toolbar } from './toolbar'
import { groupSort } from './util/group-sort'
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

    project: Project = Project({ checksum: storage.project.get(cheapRandomId()) })
    projects: string[] = storage.projects.get([this.project.$.checksum!])

    // remoteProjects: string[] = []
    // allProjects: {
    //   drafts: string[],
    //   liked: string[],
    //   recent: string[],
    // } = makeProjects(this.projects, storage.likes.get([]))

    mode: AppMode = 'normal'
    userBrowse?: string
    userProjects: Project[][] = []

    presetsScrollEl?: HTMLDivElement

    // playersView: JSX.Element = false
    // editorView: JSX.Element = false
  },

  function actions({ $, fns, fn }) {
    // let lastSaveJson: any = {}

    return fns(new class actions {
      // working state

      save = () => {
        $.project.$.save()
      }

      autoSave = queue.debounce(1000)(this.save)

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

      onProjectSelect = (project: Project) => {
        $.project = project
        $.mode = APP_MODE.NORMAL
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
      await document.fonts.ready
      host.style.opacity = '1'
    })

    fx(({ apiUrl }) => {
      services.$.apiUrl = apiUrl
    })

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
          group.map((p) =>
            Project({
              checksum: p.id,
              title: p.title,
              bpm: p.bpm,
              author: p.author,
              date: p.updatedAt,
              isDraft: false,
              remoteProject: p,
            })
          )
        )

      console.log($.userProjects)
    })

    fx(() =>
      chain(
        // on(window, 'keydown')($.onKeyDown),
        // on(window, 'keyup')($.onKeyUp),
      )
    )


    // fx(({ selected }) => {
    //   storage.selected.set(selected)
    // })

    // fx(({ focused }) => {
    //   storage.focused.set(focused)
    // })

    // fx(({ editorVisible }) => {
    //   storage.editorVisible.set(editorVisible)
    // })

    fx(({ projects }) => {
      storage.projects.set(projects)
    })

    fx(({ project }) =>
      project.fx(({ checksum }) => {
        storage.project.set(checksum)
      })
    )

    // fx(({ mode }) => {
    //   storage.mode.set(mode)
    // })

    // fx(({ audio }) =>
    //   audio.fx(({ bpm: _ }) => {
    //     $.autoSave()
    //   })
    // )


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

      h2 {
        font-family: Jost;
        font-weight: normal;
        font-size: 36px;
      }
      `
    })


    // fx(({ players, editorVisible, selected, editorView }) => {
    //   $.playersView = <PlayersView
    //     players={players}
    //     selected={selected}
    //     editorEl={deps.editorEl}
    //     editorView={editorView}
    //     editorVisible={editorVisible}
    //   />

    //   // players.map((player, y) => <>
    //   //   <PlayerView
    //   //     key={player.$.id!}
    //   //     id={player.$.id!}
    //   //     services={services}
    //   //     player={player}
    //   //     active={editorVisible && selected.player === y}
    //   //   />

    //   //   {selected.player === y && <div
    //   //     ref={refs.editorEl}
    //   //     class={classes({
    //   //       'player-view': true,
    //   //       // TODO: this should work with 'none'
    //   //       // but something isn't playing well
    //   //       hidden: !editorVisible
    //   //     })}
    //   //   >
    //   //     {editorView}
    //   //     {editorView && <Vertical
    //   //       align='y'
    //   //       id='editor'
    //   //       size={290}
    //   //     />}
    //   //   </div>}
    //   // </>)
    // })

    services.fx(({ likes, loggedIn }) =>
      fx(({ distRoot, mode, project, projects, userProjects }) => {
        $.autoSave()

        $.view = <>
          <Toolbar project={project} />

          <Hint message={deps.hint} />

          <main>
            <ProjectView
              key={project.$.id!}
              id={project.$.id!}
              ref={cachedRef(project.$.id!)}
              primary={true}
              project={project}
              controlsView={<>
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
                  <img crossorigin={'anonymous'} src={`https://avatars.githubusercontent.com/${services.$.username}?s=42&v=4`} />
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
              </>}
            />

            {userProjects.map((p) =>
              p.length && p[0] !== project && <ProjectView
                key={p[0].$.id!}
                id={p[0].$.id!}
                ref={cachedRef(p[0].$.id!)}
                project={p[0]}
                primary={false}
                onSelect={$.onProjectSelect}
              />
            )}

            {/*
            <div class={classes(({ light: true, hidden: mode !== APP_MODE.NORMAL }))}>
              {playersView}
            </div> */}

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
