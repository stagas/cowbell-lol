import { cheapRandomId } from 'everyday-utils'
import { app, DELIMITERS } from './app'

export async function getHash(short: string, long: string) {
  if (app.dev) {
    try {
      const res = await fetch(`${location.origin}/store?key=${long}`, {
        method: 'GET'
      })
      const hash = await res.text()
      return hash
    } catch (error) {
      console.warn(error)
    }
  } else {
    const res = await fetch(`${app.apiUrl!}/v2/${short}?`, {
      method: 'GET',
    })
    const hash = await res.text()
    return hash
  }
}

export async function createShort(id: string, body: string = location.hash) {
  const [icon, date, , checksum] = id.split(DELIMITERS.SAVE_ID)

  if (app.dev) {
    const short = ['v2', icon, date, cheapRandomId(), checksum].join(DELIMITERS.SHORT_ID)
    await fetch(`${location.origin}/store?key=${short}`, {
      method: 'POST',
      body,
    })
    try {
      const res = await fetch(`${location.origin}/store?key=short-list`, {
        method: 'GET'
      })
      let list: string[] = []
      try {
        list = await res.json() as string[]
      } catch (error) {
        console.warn(error)
      }
      list.push(short)
      await fetch(`${location.origin}/store?key=short-list`, {
        method: 'POST',
        body: JSON.stringify(list)
      })
    } catch (error) {
      console.warn(error)
    }

    console.log('short', short)
    return short
  } else {
    const res = await fetch(`${app.apiUrl!}/v2`, {
      method: 'POST',
      body: JSON.stringify({ icon, date, checksum, body }),
    })
    const short = await res.text()
    console.log('short', short)
    return short
  }
}

export async function getShortList() {
  if (app.dev) {
    try {
      const res = await fetch(`${location.origin}/store?key=short-list`, {
        method: 'GET'
      })
      const list = await res.json() as string[]
      return list
    } catch (error) {
      console.warn(error)
      return []
    }
  }
  try {
    const res = await fetch(`${app.apiUrl!}/v2`, {
      method: 'GET',
    })
    const data = await res.json()
    const list = data.keys.map((key: { name: string }) => key.name) as string[]
    console.log('list', list)
    return list
  } catch (error) {
    console.warn(error)
    return []
  }
}
