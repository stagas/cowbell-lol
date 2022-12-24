export const parseTitleRegExp = /(\\\\\\|\/\/\/)\s*(?<title>.*)\s*(\\\\\\|\/\/\/)/

export function getTitle(code: string) {
  const match = parseTitleRegExp.exec(code || '')
  if (match) {
    return match[2]
  }
}

export const parseErrorInputLineRegExp = /<input>:(?<line>\d+)/g

export function getErrorInputLine(error: Error) {
  const match = [...(error.message ?? '').matchAll(parseErrorInputLineRegExp)]
  if (match) {
    return parseInt(match.at(-1)![1])
  } else {
    return 0
  }
}

export const parseErrorTokenRegExp = /'(?<token>.*)'/

export function getErrorToken(error: Error) {
  const match = parseErrorTokenRegExp.exec(error.message || '')
  if (match) {
    return match[1]
  } else {
    return ''
  }
}
