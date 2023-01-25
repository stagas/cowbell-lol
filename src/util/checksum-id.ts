import { checksum } from 'everyday-utils'

export function checksumId(value: string) {
  return checksum(value).toString(36)
}
