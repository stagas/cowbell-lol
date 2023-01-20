function animCall(fn: any) { fn() }

let scheduled = false

const animFn = function animRaf() {
  if (animFns.size) {
    requestAnimationFrame(animFn)
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
    requestAnimationFrame(animFn)
  }
}

export function animRemoveSchedule(fn: any) {
  animFns.delete(fn)
}

export const anim = {
  schedule: animSchedule,
  remove: animRemoveSchedule
}
