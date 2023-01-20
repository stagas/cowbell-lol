import type { AppMode, Selected } from '../app'

export const spacer = {
  get: (id: string, fallbackSizes: number[]) => {
    // return fallbackSizes
    const cells: number[] = (localStorage[`spacer-${id}`] ?? '')
      .split(',')
      .filter((s: string) => s !== '')
      .map(parseFloat)
    if (!cells.length) return fallbackSizes
    return cells
  },
  set: (id: string, sizes: number[]) => {
    localStorage[`spacer-${id}`] = sizes
  }
}

export interface KvStorage<T> {
  get: (fallback: T) => T
  set: (data: T) => void
}

function kvStorage<T>(key: string): KvStorage<T> {
  return {
    get: (fallback: T): T => {
      try {
        return JSON.parse(localStorage[key])
      } catch {
        return fallback
      }
    },
    set: (data: T) => {
      localStorage[key] = JSON.stringify(data)
    }
  }
}

export const selected = kvStorage<Selected>('selected')
export const username = kvStorage<string>('username')
export const project = kvStorage<string>('project')
export const projects = kvStorage<string[]>('projects')
export const likes = kvStorage<string[]>('likes')
export const mode = kvStorage<AppMode>('mode')
export const bpm = kvStorage<number>('bpm')
export const vol = kvStorage<number>('vol')
export const sampleRate = kvStorage<number>('sampleRate')
export const previewSampleRate = kvStorage<number>('previewSampleRate')
export const latencyHint = kvStorage<number>('latencyHint')

export const storage = {
  spacer,
  selected,
  username,
  project,
  projects,
  likes,
  mode,
  bpm,
  vol,
  sampleRate,
  latencyHint,
  previewSampleRate
}
