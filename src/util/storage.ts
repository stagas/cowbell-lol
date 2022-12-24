import { Selected } from '../app'

export function spacer(name: string, fallback: number[]) {
  // return fallback
  const cells: number[] = (localStorage[`spacer-${name}`] ?? '')
    .split(',')
    .filter((s: string) => s !== '')
    .map(parseFloat)
  if (!cells.length) return fallback
  return cells
}

export function selected(fallback: Selected): Selected {
  try {
    return JSON.parse(localStorage.selected)
  } catch {
    return fallback
  }
}

export function setSelected(selected: Selected) {
  localStorage.selected = JSON.stringify(selected)
}
