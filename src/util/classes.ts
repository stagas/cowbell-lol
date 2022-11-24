export function classes(obj: Record<string, any>) {
  return Object.entries(obj).reduce((p, [className, value]) => {
    if (value) p.push(className)
    return p
  }, [] as string[]).join(' ')
}
