import { rpc } from 'rpc-mini'

class PseudoPort {
  other!: PseudoPort
  postMessage = (data: any) => {
    this.other.onmessage?.({ data })
  }
  #queue: any[] = []
  #onmessage: (data: any) => void = (data) => {
    this.#queue.push(data)
  }
  get onmessage() {
    return this.#onmessage
  }
  set onmessage(fn) {
    this.#onmessage = fn
    this.#queue.splice(0).forEach((data) => {
      fn(data)
    })
  }
}

class PseudoMessageChannel {
  port1 = new PseudoPort() as unknown as MessagePort
  port2 = new PseudoPort() as unknown as MessagePort
  constructor() {
    (this.port1 as any).other = this.port2;
    (this.port2 as any).other = this.port1;
  }
}

export class PseudoWorker {
  mod: any
  channel = new PseudoMessageChannel()
  constructor(url: string, meta?: any) {
    import(url).then((mod) => {
      this.mod = mod
      if (typeof mod.default === 'function') {
        this.channel.port1.onmessage = mod.default
      } else {
        rpc(this.channel.port1, mod.default)
      }
    })
    // @ts-ignore
    return this.channel.port2
  }
}
