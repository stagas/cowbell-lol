import { isEqual } from 'everyday-utils'
import { Slider } from '../slider'
import { Sliders } from '../sliders'

export const parseArgsRegExp = /'(?<name>\w+)\s*?(?<range>\[.+\])\s*?=\s*(?<value>[.0-9kKf]+)/gi

export const parseRangeRegExp = /\[(?<min>.+)\.\.(?<max>.+)\]/g

export const parseFuncsRegExp = /(?<name>^\w+)\(\s*(?<args>[^)]*)/gm

export function removeSliderArgsFromCode(sliders: Sliders | undefined, code: string | undefined) {
  if (sliders == null) return code
  if (code == null) return

  Array.from(sliders.values()).reverse().forEach((slider) => {
    if (!('source' in slider) || !('default' in slider.source)) return

    const argMinusDefaultLength = slider.source.arg.length - slider.source.default.length

    code = code!.slice(
      0, slider.sourceIndex! + argMinusDefaultLength
    ) + code!.slice(slider.sourceIndex! + slider.source.arg.length)
  })

  return code
}

export function copySliders(sliders: Sliders): Sliders {
  return new Map([...sliders].map(
    ([key, slider]) =>
      [key, new Slider(slider.toJSON!() as any)]
  ))
}

export function areSlidersCompatible(prevSliders: Sliders, nextSliders: Sliders) {
  if (!isEqual([...prevSliders.keys()], [...nextSliders.keys()])) {
    return false
  }

  for (const [id, slider] of prevSliders) {
    const other = nextSliders.get(id)!
    if (slider.min !== other.min
      || slider.max !== other.max)
      return false
  }

  return true
}
