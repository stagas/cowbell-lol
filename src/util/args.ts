import { checksum, isEqual } from 'everyday-utils'
import type { Slider } from '../slider'
import type { Sliders } from '../types'

// export const parseArgsRegExp = /'(?<name>\w+)\s*?(?<range>\[.+\])\s*?=\s*(?<value>[.0-9kKbBmsf]+)/gi

export const parseArgsRegExp = /'(?<name>\w+)\s*?(?<range>\[.+\])(?:\*\*(?<slope>[^=]+))?\s*?=\s*(?<value>[.0-9kKbBmsf]+)/gi

export const parseRangeRegExp = /\[(?<min>.+)\.\.(?<max>.+)\]/g

export const parseFuncsRegExp = /(?<name>^\w+)\(\s*(?<args>[^)]*)/gm

export interface ArgContext {
  sampleRate: number
  beatSamples: number
  numberOfBars: number
}

export function argValueToNumber(t: string, { sampleRate, beatSamples, numberOfBars: bars }: ArgContext) {
  const isFloat = t.includes('.') || t.at(-1) == 'f'
  let parsed = parseFloat(`${t}`).toString()

  if (isFloat && !parsed.includes('.')) parsed += '.0'

  const number = parseFloat(parsed)
  const lastTwo = t.slice(-2)
  const lastOne = t.at(-1)

  if (lastTwo === 'ms')
    return number * sampleRate * 0.001
  else if (lastOne === 's')
    return number * sampleRate
  else if (lastOne === 'k')
    return number * 1000
  else if (lastOne === 'K')
    return number * 1024
  else if (lastOne === 'b')
    return number * beatSamples
  else if (lastOne === 'B')
    return number * beatSamples * bars

  return parseFloat(number.toFixed(3))
}

// editor-buffer
// export function removeSliderArgsFromCode(sliders: Sliders | undefined, code: string | undefined) {
//   if (sliders == null) return code
//   if (code == null) return

//   Array.from(sliders.values()).reverse().forEach((slider) => {
//     const { source, sourceIndex } = slider.$
//     if (source == null || sourceIndex == null) return

//     const argMinusDefaultLength = source.arg.length - source.default.length

//     code = code!.slice(
//       0, sourceIndex + argMinusDefaultLength
//     ) + code!.slice(sourceIndex + source.arg.length)
//   })

//   return code
// }

// export function copySliders(sliders: Sliders): Sliders {
//   return new Map([...sliders].map(
//     ([key, slider]) =>
//       [key, Slider(slider.$.toJSON())]
//   ))
// }

export function areSlidersCompatible(prevSliders: Sliders | Map<string, typeof Slider.State['$']>, nextSliders: Map<string, typeof Slider.State['$']>) {
  if (!isEqual([...prevSliders.keys()], [...nextSliders.keys()])) {
    return false
  }

  for (const [id, slider] of prevSliders) {
    const other = nextSliders.get(id)!
    if ('$' in slider) {
      if (!slider.$.isCompatibleWith(other)) return false
    } else {
      if (slider.min !== other.min
        || slider.max !== other.max) return false
    }
  }

  return true
}

export function getSliders(
  code: string,
  argContext: ArgContext,
) {
  const funcs = [...code.matchAll(parseFuncsRegExp)]

  return new Map(
    funcs.flatMap((funcToken) => {
      const [, func, args] = funcToken
      const { index: funcIndex } = funcToken as { index: number }

      const argsWithoutComments = (args ?? '').replace(/\\.*/g, '')

      const argTokens =
        [...argsWithoutComments.matchAll(parseArgsRegExp)]
          .filter((value) => value.length)

      return argTokens.map((argToken) => {
        const [arg, name, range, slope, value] = argToken
        // const { index: argTokenIndex } = argToken as { index: number }
        // const { index: sourceIndex } = argToken as { index: number }

        parseRangeRegExp.lastIndex = -1

        // eslint-disable-next-line no-sparse-arrays
        const [, min, max] = (parseRangeRegExp.exec(range) ?? [, 0, 1]) as string[]

        const exportId = `export/${func}/${name}`

        return [exportId, {
          value: argValueToNumber(value, argContext),
          min: argValueToNumber(min, argContext),
          max: argValueToNumber(max, argContext),
          slope: slope ? argValueToNumber(slope, argContext) : 1,
          hue: checksum(exportId) % 300 + 20,
          id: exportId,
          name,

          source: {
            id: name,
            arg,
            range,
            slope,
            default: value,
          },
          sourceIndex: code.indexOf(arg, funcIndex)
        } as typeof Slider.State['$']]
      })
    }))
}

export function getCodeWithoutArgs(code: string) {
  return code.replace(parseArgsRegExp, '').replace(/\s/gi, '')
}
