import { Slider } from '../slider'

export const parseArgsRegExp = /'(?<id>\w+)\s*?\[.+\]\s*?=\s*(?<value>[.0-9kKf]+)/gi

export function removeSliderArgsFromCode(sliders: Map<string, Slider> | undefined, code: string | undefined) {
  if (sliders == null) return code
  if (code == null) return

  Array.from(sliders.values()).reverse().forEach((slider) => {
    code = code!.slice(
      0, slider.sourceIndex
    ) + code!.slice(slider.sourceIndex + slider.source.arg.length)
  })

  return code
}

export function copySliders(sliders: Map<string, Slider>) {
  return new Map([...sliders].map(
    ([key, slider]) =>
      [key, new Slider(slider.toJSON())]
  ))
}
