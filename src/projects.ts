import { shallowEqualArray } from 'everyday-utils'
import { reactive } from 'minimal-view'
import { lastRunningPlayers } from './audio'
import { Player } from './player'
import { Project } from './project'
import { schemas } from './schemas'
import { services } from './services'
import { filterState } from './util/filter-state'
import { storage } from './util/storage'

export const cachedProjects = new Map<string, Project>()

export function getPlayingProjects(): Project[] {
  return [...filterState(cachedProjects, 'preparing', 'running')]
    .sort((a, b) =>
      a.$.startedAt - b.$.startedAt
    )
}

export function projectsByDate(a: Project, b: Project) {
  return new Date(b.$.date!).getTime() - new Date(a.$.date!).getTime()
}

export function projectsRelated(a: Project, b: Project) {
  return new Date(b.$.date!).getTime() - new Date(a.$.date!).getTime()
}

export function projectsGroup(acc: Project[][], curr: Project) {
  const group = acc.find((g) =>
    g[0].$.originalChecksum === curr.$.checksum
    || curr.$.originalChecksum === g[0].$.checksum
    || (g[0].$.originalChecksum && g[0].$.originalChecksum === curr.$.originalChecksum)
    || (g[0].$.title === curr.$.title && g[0].$.author === curr.$.author)
  )

  if (group) {
    group.push(curr)
  } else {
    acc.push([curr])
  }

  return acc
}

export function getOrCreateProject(p: schemas.ProjectResponse | { id: string }) {
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
        remixCount: p.remixCount || 0,
        originalRemixCount: p.originalRemixCount || 0,
        originalChecksum: p.originalId || false,
        originalAuthor: p.originalAuthor || false,
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

export type Projects = typeof Projects.State

export const Projects = reactive('projects',
  class props {
  },
  class local {
    mode: 'normal' | 'solo' | 'browse' | 'userbrowse' = 'normal'
    tab?: 'drafts' | 'user' | 'recent' | 'liked' | 'playlist' | 'project'
    userBrowse: string = 'guest'
    draftBrowse: Project | false = false
    draftFocus = false
    projectBrowse: Project | false = false
    projectExpand = false

    project?: Project
    projects: Project[] = []

    user: Project[] = []
    draft: Project[] = []
    all: Project[] = []
    liked: Project[] = []
    playing: Project[] = []

    visible: Project[] = []
    hidden: Project[] = []
  },
  function actions({ $, fns, fn }) {

    return fns(new class actions {
      onMovePlayers = async (project: Project): Promise<void> => {
        const playersToMove: Player[] = project.$.players.filter((player: Player) => lastRunningPlayers?.has(player) || player.$.state === 'running')
          .map((player: Player) => Player({
            ...player.$.derive(),
            project: $.project!
          }))

        if (!playersToMove.length) return

        $.project!.$.players = [...$.project!.$.players, ...playersToMove]

        await Promise.resolve()

        playersToMove.forEach((player) => {
          player.$.start()
        })

        project.$.stop()
      }
    })
  },
  function effects({ $, fx, deps, refs }) {
    services.fx(({ projects }) => {
      if (!shallowEqualArray($.projects, projects)) {
        $.projects = projects
      }
    })

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
                    const project: Project = getOrCreateProject({ id })
                    await Promise.race([
                      project.$.load(),
                      new Promise((_, reject) => setTimeout(reject, 10000, new Error('Timeout loading')))
                    ])
                    await Promise.resolve()
                    const ys = playersYs.split('.').map(parseFloat)
                    const players: Player[] = project.$.players
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
                $.playing = playingProjects
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
          } else {
            const project: Project = getOrCreateProject({ id: sub })
            await project.$.load()
            $.projectBrowse = project
            if (audio.$.state !== 'running') {
              $.project = project
            }
          }

          $.tab = 'project'
          return
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

    fx(({ project }) => {
      project.$.load()
    })

    fx(({ tab }) => {
      services.$.refreshProjects()
    })

    services.fx(({ audio }) =>
      audio.fx.raf(({ state }) => {
        if (state === 'running') {
          return fx(({ tab: _ }) => {
            if (audio.$.state === 'running') {
              $.playing = getPlayingProjects()
            }
          })
        }
      })
    )

    fx(({ projects, tab, userBrowse, projectBrowse, draftBrowse, draftFocus, projectExpand, playing }, prev) => {
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

      const prevVisibleProjects = $.visible
      const prevHiddenProjects = $.hidden

      $.draft = draftFocus && draftBrowse ? [draftBrowse] : projects.filter((p) => p.$.isDraft)

      $.all = projects.reduce(projectsGroup, []).map(first)

      $.user = projects.filter((p) =>
        p.$.author === userBrowse
        || (p.$.originalAuthor === userBrowse && p.$.isDraft)
      )

      $.liked = projects.filter((p) => services.$.likes.includes(p.$.checksum!)).sort(projectsByDate)

      $.visible = $.all

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

          $.visible = [
            draftBrowse,
            ...related
          ]
        } else {
          $.visible = $.draft
        }
      } else if (tab === 'user') {
        $.visible = $.user.reduce(projectsGroup, []).map(first)
      } else if (tab === 'liked') {
        $.visible = $.liked
      } else if (tab === 'playlist') {
        $.visible = playing
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

          $.visible = [
            projectBrowse,
            ...related
          ]
        } else {
          $.visible = [projectBrowse]
        }

        services.$.fetchProjects({ remixesOfId: projectBrowse.$.checksum! })
        if (projectBrowse.$.originalChecksum) {
          services.$.fetchProjects({ remixesOfId: projectBrowse.$.originalChecksum })
        }
      }

      $.hidden = projects.filter((p) => !$.visible.includes(p))

      if (!$.visible.length) {
        if (!prevVisibleProjects.length) {
          services.$.go('/')
        } else {
          $.visible = prevVisibleProjects
          $.hidden = prevHiddenProjects
        }
      }

      $.project ??= $.visible[0]

      if (prev.tab !== tab || prev.projectBrowse !== projectBrowse || (tab === 'project' && !projectExpand)) {
        requestAnimationFrame(() => {
          window.scrollTo(0, 0)
        })
      }
    })

  }
)

export const projects = Projects({})
