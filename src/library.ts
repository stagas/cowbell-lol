import { reactive } from 'minimal-view'
import { EditorBuffer } from './editor-buffer'

export const Library = reactive('library',
  class props { },
  class local {
    sounds: EditorBuffer[] = []
    patterns: EditorBuffer[] = []
  },
  function actions({ $, fn, fns }) {
    return fns(new class actions {
      // TODO: load library from storage
    })
  },
  function effects({ $, fx }) {

  }
)

export type Library = typeof Library.State

export const library = Library({})
