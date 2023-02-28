import { EditorBuffer } from '../editor-buffer'

function sumBars(p: number, n: EditorBuffer) {
  return p + (n.$.numberOfBars || 1)
}

export function countBars(patterns: EditorBuffer[]) {
  return patterns.reduce(sumBars, 0)
}

function sumTurns(p: number, n: EditorBuffer[]) {
  return p + countBars(n)
}

export function countTurnBars(turns: EditorBuffer[][]) {
  return turns.reduce(sumTurns, 0)
}
