export function checksum(s: string) {
  return s.split('').reduce((p, n) =>
    (p << 1) + n.charCodeAt(0),
    0
  )
}
