export function getDateTime(input: any = Date.now()) {
  const [date, timeWithMs] = new Date(input).toISOString().split('T')
  const [time] = timeWithMs.split('.')
  return `${date} ${time}`
}
