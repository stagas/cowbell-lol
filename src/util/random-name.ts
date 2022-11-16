
const unicode = (a: number, b: number) => String.fromCodePoint(Math.round(a + Math.random() * (b - a)))

// tribal / ancient
const pages = [
  [0x10a9, 0x10c5],
  [0x0250, 0x02af],
  [0x2d32, 0x2d66],
  [0x10280, 0x1029c],
  [0x102a0, 0x102d0],
  [0x1d200, 0x1d23c],
  [0x22c7, 0x22d7],
  [0x223b, 0x2253],
  [0x13a3, 0x13f3],
  [0x07c0, 0x07e7],
  [0x0531, 0x0556],
  [0x0561, 0x0587],
] as readonly [number, number][]

// emoji
// const pages = [
//   [0x1f300, 0x1f5ff],
//   [0x1f600, 0x1f64f],
//   [0x1f680, 0x1f6c5],
// ] as readonly [number, number][]

export const randomName = () => unicode(...pages[Math.random() * pages.length | 0])

