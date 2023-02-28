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

export const vols = {
  get: (id: string, fallbackVol: number) => {
    const vol = localStorage[`vol-${id}`]
    if (vol == null) {
      return fallbackVol
    }

    return parseFloat(vol)
  },
  set: (id: string, vol: number) => {
    localStorage[`vol-${id}`] = `${vol}`
  },
  delete: (id: string) => {
    delete localStorage[`vol-${id}`]
  }
}

export const vertical = {
  get: (id: string, fallbackSize: number) => {
    const size = localStorage[`vert-${id}`]
    if (size == null) {
      return fallbackSize
    }

    return parseFloat(size)
  },
  set: (id: string, size: number) => {
    localStorage[`vert-${id}`] = `${size}`
  },
  delete: (id: string) => {
    delete localStorage[`vert-${id}`]
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

export interface BufferStorage<T> {
  get: (fallback: T[]) => T[]
  set: (data: T[]) => void
}

function bufferStorage<T>(key: string): BufferStorage<T> {
  return {
    get: (fallback: T[]): T[] => {
      try {
        const b: string[] = localStorage[key].split('!')
        return b.map((x) => {
          const [isDraft, checksum] = x.split(',')
          return [parseInt(isDraft), checksum] as unknown as T
        })
      } catch {
        return fallback
      }
    },
    set: (data: T[]) => {
      localStorage[key] = data.join('!')
    }
  }
}

export const focused = kvStorage<string>('focused')
export const editorVisible = kvStorage<boolean>('editorVisible')
export const username = kvStorage<string>('username')
export const project = kvStorage<string>('project')
export const projects = kvStorage<string[]>('projects')
export const sounds = bufferStorage<[0 | 1, string]>('sounds')
export const patterns = bufferStorage<[0 | 1, string]>('patterns')
export const likes = kvStorage<string[]>('likes')
export const bpm = kvStorage<number>('bpm')
export const sampleRate = kvStorage<number>('sampleRate')
export const previewSampleRate = kvStorage<number>('previewSampleRate')
export const latencyHint = kvStorage<number>('latencyHint')

export const storage = {
  spacer,
  focused,
  editorVisible,
  username,
  project,
  projects,
  sounds,
  patterns,
  likes,
  bpm,
  vols,
  sampleRate,
  latencyHint,
  previewSampleRate,
  vertical
}
