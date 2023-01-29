export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/[-]+/g, '-').replace(/^-|-$/g, '')
}
