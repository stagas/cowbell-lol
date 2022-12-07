import { memoize } from 'everyday-utils'

export const bgForHue = memoize((hue: number) => {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" preserveAspectRatio="xMidYMid meet">\
  <circle cx="22.5" cy="22.5" r="20" fill="hsl(${(hue + 45) % 360}, 75%, 20%)" />\
  <circle cx="67.5" cy="67.5" r="20" fill="hsl(${(hue + 45) % 360}, 75%, 20%)" />\
  " /></svg>')`
})
