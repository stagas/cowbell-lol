// import { queue } from 'event-toolkit'

function animCall(fn: any) { fn() }

let scheduled = false

const anim = function animRaf() {
  if (animFns.size) {
    requestAnimationFrame(anim)
    const fns = [...animFns]
    animFns.clear()
    fns.forEach(animCall)
  } else {
    scheduled = false
  }
}

const animFns = new Set<any>()
export function animSchedule(fn: any) {
  animFns.add(fn)
  if (!scheduled) {
    scheduled = true
    requestAnimationFrame(anim)
  }
}

export function animRemoveSchedule(fn: any) {
  animFns.delete(fn)
}
