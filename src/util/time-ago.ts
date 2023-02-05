// https://blog.webdevsimplified.com/2020-07/relative-time-format/
const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto',
})

const DIVISIONS = [
  { amount: 60, name: 'seconds' },
  { amount: 60, name: 'minutes' },
  { amount: 48, name: 'hours' },
  { amount: 7, name: 'days' },
  { amount: 4.34524, name: 'weeks' },
  { amount: 12, name: 'months' },
  { amount: Number.POSITIVE_INFINITY, name: 'years' },
] as const

export function timeAgo(input: any, withTime = false): string {
  let date: Date

  if (typeof input === 'string' && !input.includes('T')) {
    const [d, t] = input.split(' ')
    date = new Date(`${d}T${t}Z`)
  } else {
    date = new Date(input)
  }

  let duration = (date.getTime() - Date.now()) / 1000
  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i]
    if (Math.abs(duration) < division.amount) {
      return `${formatter.format(Math.round(duration), division.name)
        }${!withTime ? '' : `, ${date.toLocaleTimeString().replace(/(\d\d?:\d\d)(:\d\d)/, '$1').toLowerCase()}`}`
    }
    duration /= division.amount
  }

  return date.toLocaleString()
}
