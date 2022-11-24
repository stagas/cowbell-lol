var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// ../../proxy-toolkit/dist/esm/proxy-toolkit.js
var Getter = (cb, target = {}) => new Proxy(target, {
  get: (_, key) => cb(key)
});
var FluentCaptureSymbol = Symbol();

// ../../rpc-mini/dist/esm/rpc-mini.js
var defaultTransferables = [
  typeof OffscreenCanvas !== "undefined" ? OffscreenCanvas : void 0
].filter(Boolean);
var rpc = (port, api = {}, transferables = defaultTransferables) => {
  const xfer = (args, transferables2) => args.reduce((p, n) => {
    if (typeof n === "object") {
      for (const key in n) {
        if (n[key] && transferables2.some((ctor) => n[key] instanceof ctor)) {
          p.push(n[key]);
        }
      }
    }
    return p;
  }, []);
  let callbackId = 0;
  const calls = /* @__PURE__ */ new Map();
  port.onmessage = async ({ data }) => {
    const { cid } = data;
    if (data.method) {
      let result;
      try {
        result = await api[data.method](...data.args);
        port.postMessage({
          cid,
          result
        }, xfer([
          result
        ], transferables));
      } catch (error) {
        port.postMessage({
          cid,
          error
        });
      }
    } else {
      if (!calls.has(cid)) {
        throw new ReferenceError("Callback id not found: " + cid);
      }
      const { resolve, reject } = calls.get(cid);
      calls.delete(data.cid);
      if (data.error)
        reject(data.error);
      else
        resolve(data.result);
    }
  };
  const call = (method, ...args) => {
    const cid = callbackId++;
    const promise = new Promise((resolve, reject) => {
      calls.set(cid, {
        resolve,
        reject
      });
    });
    port.postMessage({
      method,
      args,
      cid
    }, xfer(args, transferables));
    return promise;
  };
  const getter = Getter((key) => call.bind(null, key), call);
  return getter;
};

// ../../sandbox-worklet/dist/esm/sandbox-node.js
var SandboxNode = class extends AudioWorkletNode {
  static async register(context) {
    if (this.hasRegistered)
      return;
    await context.audioWorklet.addModule(new URL("./sandbox-processor.js", import.meta.url).href);
    this.hasRegistered = true;
  }
  static async create(context) {
    await this.register(context);
    return new this(context);
  }
  rpc;
  constructor(context) {
    super(context, "sandbox");
    this.rpc = rpc(this.port);
  }
  eval(code) {
    return this.rpc("eval", code);
  }
};
__publicField(SandboxNode, "hasRegistered", false);

// ../../sandbox-worklet/dist/esm/sandbox-iframe.js
self.onmessage = async (e) => {
  self.onmessage = null;
  const [port2] = e.ports;
  const ctx = new OfflineAudioContext({
    length: 1,
    sampleRate: 3e3
  });
  const node = await SandboxNode.create(ctx);
  node.port.onmessage = ({ data }) => port2.postMessage(data);
  port2.onmessage = ({ data }) => node.port.postMessage(data);
};
