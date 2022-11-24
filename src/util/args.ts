import { SliderParam } from '../slider'

export function removeSliderArgsFromCode(sliders: Map<string, SliderParam> | undefined, code: string | undefined) {
  if (sliders == null) return code
  if (code == null) return

  Array.from(sliders.values()).reverse().forEach((slider) => {
    code = code!.slice(
      0, slider.sourceIndex
    ) + code!.slice(slider.sourceIndex + slider.source.arg.length)
  })

  return code
}

export function copySliders(sliders: Map<string, SliderParam>) {
  return new Map([...sliders].map(
    ([key, slider]) =>
      [key, {
        ...slider,
        source: {
          ...slider.source
        }
      }]
  ))
}
