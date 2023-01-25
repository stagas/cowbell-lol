export function oneOf<T>(value: T, ...args: T[]) {
  return args.includes(value)
}

export function noneOf<T>(value: T, ...args: T[]) {
  return !oneOf(value, ...args)
}
