import memoize from 'memoize-pure'

export const cachedRefs = new Map<string, HTMLElement>()

export const cachedRef = memoize((id: string) => ({
  get current() {
    return cachedRefs.get(id)
  },
  set current(el) {
    if (el) {
      cachedRefs.set(id, el)
    }
  }
}))
