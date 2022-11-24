import { sortCompare } from 'everyday-utils'

export const fitGrid = (width: number, height: number, total: number) => {
  const [w, h] = [width, height]

  if (total === 1) {
    return {
      cols: 1,
      rows: 1,
      vertical: false,
    }
  }

  // const asp = w / h

  type Candidate = {
    aspect: number
    frac: number
    cols: number
    rows: number
    fits: number
    fitsFrac: number
    hanging: number
  }
  let candidates: Candidate[] = []

  const vertical = true //asp < 1

  if (!vertical) {
    for (let i = 1; i <= total; i++) {
      const cols = i
      const rows = total / cols

      const iw = w / cols
      const ih = h / Math.ceil(rows)
      const a = iw / ih

      const frac = rows - (rows | 0)
      const fits = Math.abs(cols / rows - 1)
      const hanging = total - (cols * (rows | 0))

      candidates.push({
        aspect: Math.abs(a - 1),
        frac,
        cols,
        rows,
        fits,
        fitsFrac: fits - (fits | 0),
        hanging,
      })
    }
  } else {
    for (let i = 1; i <= total; i++) {
      const rows = i
      const cols = total / rows

      const iw = w / cols
      const ih = h / rows
      const a = iw / ih

      const frac = cols - (cols | 0)
      const fits = Math.abs(cols / rows - 1)
      const hanging = total - ((cols | 0) * rows)

      candidates.push({
        aspect: Math.abs(a - 1),
        frac,
        cols,
        rows,
        fits,
        fitsFrac: fits - (fits | 0),
        hanging,
      })
    }
  }

  candidates = candidates
    .filter(({ frac }) => frac === 0 || frac <= 0.65)//
    .sort((a, b) =>
      sortCompare(a.aspect, b.aspect))

  const search = (candidates: Candidate[], maxAspect = 0.85) => {
    for (const c of candidates) {
      if ((!c.hanging || !c.fitsFrac) && c.aspect <= maxAspect) {
        return c
      }
    }
  }

  let result
  let attempt

  for (const f of [0.5, 0.25]) {
    attempt = candidates.filter(({ frac }) =>
      frac === 0 || frac % f === 0)

    result = search(attempt, 0.65)
    if (result) {
      // console.log('o')
      break
    }
    // result = search(attempt, 0.65)
    // if (result) {
    //   // console.log('o')
    //   break
    // }
    // result = search(attempt, 0.85)
    // if (result) {
    //   // console.log('o')
    //   break
    // }
  }

  if (!result) {
    attempt = candidates
      .filter(({ aspect, frac }) =>
        aspect < 0.5 && (frac === 0 || frac % 0.0625 === 0))

    result = attempt.sort((a, b) =>
      sortCompare(a.frac, b.frac))[0]

    // if (result) console.log('a')
  }

  if (!result) {
    if (!result) result = candidates[0]
    // if (result) console.log('b')
  }

  if (!result) {
    // console.log('c')
    return {
      cols: 1,
      rows: 1,
      vertical: false,
    }
  }

  const { cols: newCols, rows: newRows } = result

  if (vertical) {
    return {
      cols: Math.ceil(newCols),
      rows: newRows,
      vertical,
    }
  } else {
    return {
      cols: newCols,
      rows: Math.ceil(newRows),
      vertical,
    }
  }
}
