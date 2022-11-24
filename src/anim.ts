import { queue } from 'event-toolkit'

function animCall(fn: any) { fn() }

const anim = queue.raf(function animRaf() {
  if (animFns.size) {
    anim()
    const fns = [...animFns]
    animFns.clear()
    fns.forEach(animCall)
  }
})

const animFns = new Set<any>()
export function animSchedule(fn: any) {
  animFns.add(fn)
  anim()
}
export function animRemoveSchedule(fn: any) {
  animFns.delete(fn)
}
