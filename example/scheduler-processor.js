var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../../.fastpm/-/eventemitter-strict@1.0.1/lib/index.js
var require_lib = __commonJS({
  "../../../../.fastpm/-/eventemitter-strict@1.0.1/lib/index.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventEmitter = void 0;
    var EventEmitter = function() {
      function EventEmitter2() {
        this.listeners = {};
      }
      EventEmitter2.prototype.emit = function(eventName) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
        }
        if (this.listeners[eventName]) {
          try {
            this.listeners[eventName].forEach(function(item) {
              if (typeof item.callback === "function") {
                item.callback.apply(item, __spreadArray([], __read(args), false));
              }
              if (item.once === true) {
                _this.off(eventName, item.callback);
              }
            });
          } catch (e) {
          }
        }
        return this;
      };
      EventEmitter2.prototype.on = function(eventName, callback, options) {
        if (!this.listeners[eventName]) {
          this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(__assign(__assign({}, options), { callback }));
        return this;
      };
      EventEmitter2.prototype.off = function(eventName, callback) {
        if (!this.listeners[eventName]) {
          return;
        }
        var index = this.listeners[eventName].findIndex(function(item) {
          return item.callback === callback;
        });
        if (index >= 0) {
          this.listeners[eventName].splice(index, 1);
        }
        if (this.listeners[eventName].length === 0) {
          delete this.listeners[eventName];
        }
        return this;
      };
      EventEmitter2.prototype.once = function(eventName, callback) {
        this.on(eventName, callback, { once: true });
        return this;
      };
      EventEmitter2.onceSymbol = Symbol("once");
      return EventEmitter2;
    }();
    exports.EventEmitter = EventEmitter;
  }
});

// ../../alice-bob/dist/esm/util.js
var pop = (map, key) => {
  const value = map.get(key);
  map.delete(key);
  return value;
};

// ../../alice-bob/dist/esm/alice-bob.js
var AliceBob = class {
  id = -1;
  callbacks = /* @__PURE__ */ new Map();
  local;
  remote;
  send;
  receive;
  serializer = (data) => data;
  deserializer = (data) => data;
  constructor(send) {
    this.send = ({ id, method, args }) => {
      if (this.local.debug) {
        this.local.log(" \u251C> SEND \u251C>", `${id} ${this.local.name}`.padEnd(12), "\u2502", method, args);
      }
      return this.local.send({
        id,
        method,
        args: this.local.serializer(args)
      });
    };
    this.receive = async ({ id, method, args }) => {
      if (this.local.debug) {
        this.local.log("<\u2524  RECV \u2502", `${this.remote.name} ${id}`.padStart(12), "<\u2524", method, args);
      }
      let error;
      let result;
      const fn = this.local[method] ?? this.local.target?.[method];
      if (typeof fn !== "function") {
        throw new TypeError(`Agent method "${method.toString()}" is not a function. Instead found: ${typeof fn}`);
      }
      const hasCallback = typeof method === "string" && method[0] !== "_";
      try {
        result = await fn.apply(this.local.target, this.local.deserializer(args));
        if (hasCallback) {
          await this.send({
            id: ++this.id,
            method: "__resolve__",
            args: [
              id,
              result
            ]
          });
        }
      } catch (e) {
        error = e;
        if (hasCallback) {
          await this.send({
            id: ++this.id,
            method: "__reject__",
            args: [
              id,
              error
            ]
          });
        }
      } finally {
        if (error && this.local.debug)
          this.local.log(error);
      }
      return result;
    };
    this.local = {
      debug: false,
      name: "local",
      send: send ?? ((data) => {
        if (this.local.deferredSend)
          return this.local.deferredSend()(data);
        else {
          throw new TypeError(`${this.local.name}.send(payload) method must be provided.`);
        }
      }),
      receive: this.receive,
      serializer: this.serializer,
      deserializer: this.deserializer,
      log: (...args) => console.log(this.local.name.padStart(10) + ":", ...args),
      __resolve__: (id, result) => pop(this.callbacks, id).resolve(result),
      __reject__: (id, error) => pop(this.callbacks, id).reject(error)
    };
    this.remote = new Proxy({
      name: "remote"
    }, {
      get: (target, prop) => {
        if (prop in target)
          return target[prop];
        else {
          const method = prop;
          return async (...args) => {
            const id = ++this.id;
            const promise = new Promise((resolve, reject) => this.callbacks.set(id, {
              resolve,
              reject
            }));
            await this.send({
              id,
              method,
              args
            });
            const result = await promise;
            return result;
          };
        }
      },
      set: (target, prop, value) => {
        target[prop] = value;
        return true;
      }
    });
  }
  agents(local, remote) {
    Object.assign(this.local, local);
    Object.assign(this.remote, remote);
    return [
      this.local,
      this.remote
    ];
  }
};
var Bob = class extends AliceBob {
  constructor(send, target) {
    super(send);
    this.local.name = "bob";
    this.local.target = target || this.local;
    this.remote.name = "alice";
  }
};

// ../../pick-omit/dist/esm/pick-omit.js
var filter = (obj, fn) => Object.fromEntries(Object.entries(obj).filter(fn));
var pick = (obj, props) => props.reduce((p, n) => {
  if (n in obj)
    p[n] = obj[n];
  return p;
}, {});
var omit = (obj, props) => filter(obj, includesKey(props, true));
var includesKey = (props, invert = false) => ([key]) => invert ^ props.includes(key);

// ../../to-fluent/dist/esm/to-fluent.js
var bool = Symbol.for("to-fluent-bool");
var toFluent = (Schema, cb) => {
  const bools = Object.entries(new Schema()).filter(([, x]) => x === bool || typeof x === "boolean");
  const flags = bools.map(([key]) => key);
  const omitted = bools.filter(([, x]) => x === bool).map(([key]) => key);
  const settings = omit(new Schema(), omitted);
  let not = false;
  const bind = (settings2) => new Proxy(cb, {
    get(_, key, receiver) {
      if (key === "not") {
        not = true;
        return receiver;
      } else if (flags.includes(key)) {
        const value = not ? false : true;
        not = false;
        return bind({
          ...settings2,
          [key]: value
        });
      } else {
        return (value) => {
          return bind({
            ...settings2,
            [key]: value
          });
        };
      }
    },
    construct(_, args) {
      const ctor = cb.call(self, {
        ...settings2
      });
      return new ctor(...args);
    },
    apply: (_, self1, args) => cb.call(self1, {
      ...settings2
    }).apply(self1, args)
  });
  return bind(settings);
};

// ../../event-toolkit/dist/esm/abort.js
var AbortOptions = class {
  throw = bool;
  latest = bool;
  timeout;
};
var abort = toFluent(AbortOptions, (options) => (fn) => {
  let ctrl;
  const wrap = Object.assign(async function wrap2(...args) {
    if (options.latest && ctrl)
      ctrl.abort();
    ctrl = new AbortController();
    if (options.timeout != null) {
      const timeoutError = new Error("Timed out");
      try {
        return await Promise.race([
          new Promise((_, reject) => setTimeout(reject, options.timeout, timeoutError)),
          fn(ctrl.signal).apply(this, args)
        ]);
      } catch (error) {
        if (error === timeoutError) {
          ctrl.abort();
          if (options.throw)
            throw error;
          else {
          }
        } else {
          if (options.throw)
            throw error;
          else {
          }
        }
      }
    } else {
      return fn(ctrl.signal).apply(this, args);
    }
  }, {
    fn: fn()
  });
  return wrap;
});

// ../../event-toolkit/dist/esm/dispatch.js
var DispatchOptions = class {
  bubbles = bool;
  cancelable = bool;
  composed = bool;
};
var dispatchEvent = (el, nameOrEvent, detail, init, options) => el.dispatchEvent(nameOrEvent instanceof Event ? nameOrEvent : new CustomEvent(nameOrEvent, {
  detail,
  ...init,
  ...options
}));
var dispatch = toFluent(DispatchOptions, (options) => (el, nameOrEvent, detail, init) => dispatchEvent(el, nameOrEvent, detail, init, options));

// ../../everyday-utils/dist/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  Deferred: () => Deferred,
  KeyedCache: () => KeyedCache,
  MapFactory: () => MapFactory,
  MapMap: () => MapMap,
  MapMapSet: () => MapMapSet,
  MapSet: () => MapSet,
  WeakMapFactory: () => WeakMapFactory,
  WeakMapSet: () => WeakMapSet,
  accessors: () => accessors,
  asyncFilter: () => asyncFilter,
  asyncSerialMap: () => asyncSerialMap,
  asyncSerialReduce: () => asyncSerialReduce,
  bindAll: () => bindAll,
  bool: () => bool,
  chainSync: () => chainSync,
  cheapRandomId: () => cheapRandomId,
  chunk: () => chunk,
  colorHash: () => colorHash,
  colorOf: () => colorOf,
  deepMutate: () => deepMutate,
  defineProperty: () => defineProperty,
  entries: () => entries,
  filter: () => filter2,
  filterMap: () => filterMap,
  fromEntries: () => fromEntries,
  getOwnProperty: () => getOwnProperty,
  getStringLength: () => getStringLength,
  includesAny: () => includesAny,
  includesKey: () => includesKey2,
  isEqual: () => is_equal_default,
  kebab: () => kebab,
  keys: () => keys,
  memoize: () => memoize,
  mutable: () => mutable,
  nonNull: () => nonNull,
  omit: () => omit2,
  once: () => once,
  padCenter: () => padCenter,
  padStart: () => padStart,
  pick: () => pick2,
  promisify: () => promisify,
  removeFromArray: () => removeFromArray,
  repeatString: () => repeatString,
  shallowEqual: () => shallowEqual,
  shuffle: () => shuffle,
  sortCompare: () => sortCompare,
  sortCompareKeys: () => sortCompareKeys,
  sortObjectInPlace: () => sortObjectInPlace,
  splitAt: () => splitAt,
  stripAnsi: () => stripAnsi,
  styleToCss: () => styleToCss,
  tick: () => tick,
  toFluent: () => toFluent,
  wait: () => wait
});

// ../../everyday-utils/dist/esm/everyday-utils.js
var everyday_utils_exports = {};
__export(everyday_utils_exports, {
  Deferred: () => Deferred,
  KeyedCache: () => KeyedCache,
  MapFactory: () => MapFactory,
  MapMap: () => MapMap,
  MapMapSet: () => MapMapSet,
  MapSet: () => MapSet,
  WeakMapFactory: () => WeakMapFactory,
  WeakMapSet: () => WeakMapSet,
  accessors: () => accessors,
  asyncFilter: () => asyncFilter,
  asyncSerialMap: () => asyncSerialMap,
  asyncSerialReduce: () => asyncSerialReduce,
  bindAll: () => bindAll,
  bool: () => bool,
  chainSync: () => chainSync,
  cheapRandomId: () => cheapRandomId,
  chunk: () => chunk,
  colorHash: () => colorHash,
  colorOf: () => colorOf,
  deepMutate: () => deepMutate,
  defineProperty: () => defineProperty,
  entries: () => entries,
  filter: () => filter2,
  filterMap: () => filterMap,
  fromEntries: () => fromEntries,
  getOwnProperty: () => getOwnProperty,
  getStringLength: () => getStringLength,
  includesAny: () => includesAny,
  includesKey: () => includesKey2,
  isEqual: () => is_equal_default,
  kebab: () => kebab,
  keys: () => keys,
  memoize: () => memoize,
  mutable: () => mutable,
  nonNull: () => nonNull,
  omit: () => omit2,
  once: () => once,
  padCenter: () => padCenter,
  padStart: () => padStart,
  pick: () => pick2,
  promisify: () => promisify,
  removeFromArray: () => removeFromArray,
  repeatString: () => repeatString,
  shallowEqual: () => shallowEqual,
  shuffle: () => shuffle,
  sortCompare: () => sortCompare,
  sortCompareKeys: () => sortCompareKeys,
  sortObjectInPlace: () => sortObjectInPlace,
  splitAt: () => splitAt,
  stripAnsi: () => stripAnsi,
  styleToCss: () => styleToCss,
  tick: () => tick,
  toFluent: () => toFluent,
  wait: () => wait
});
__reExport(everyday_utils_exports, __toESM(require_lib(), 1));

// ../../../../.fastpm/-/deep-mutate-object@1.0.1/dist/esm/deep-mutate-object.js
var deepMutate = (obj, walkFn) => Object.entries(obj).reduce((p, [k, v]) => {
  const [key, value] = walkFn(k, v, obj);
  p[key] = typeof value === "object" && value !== null ? deepMutate(value, walkFn) : value;
  return p;
}, Array.isArray(obj) ? [] : {});

// ../../../../.fastpm/-/pick-omit@2.0.1/dist/esm/pick-omit.js
var filter2 = (obj, fn) => Object.fromEntries(Object.entries(obj).filter(fn));
var nonNull = (obj) => filter2(obj, ([, value]) => value != null);
var pick2 = (obj, props) => props.reduce((p, n) => {
  if (n in obj)
    p[n] = obj[n];
  return p;
}, {});
var omit2 = (obj, props) => filter2(obj, includesKey2(props, true));
var includesKey2 = (props, invert = false) => ([key]) => invert ^ props.includes(key);

// ../../everyday-utils/dist/esm/is-equal.js
var getKeys = Object.keys;
var isArray = Array.isArray;
var isEqual = (x, y) => {
  if (x === y)
    return true;
  if (typeof x === "object" && typeof y === "object" && x !== null && y !== null) {
    if (x.constructor !== y.constructor)
      return false;
    if (x instanceof Map || x instanceof Set)
      x = [
        ...x
      ];
    if (y instanceof Map || y instanceof Set)
      y = [
        ...y
      ];
    if (isArray(x)) {
      if (isArray(y)) {
        let xLength = x.length;
        const yLength = y.length;
        if (xLength !== yLength)
          return false;
        while (xLength--) {
          if (!isEqual(x[xLength], y[xLength]))
            return false;
        }
        return true;
      }
      return false;
    } else if (isArray(y)) {
      return false;
    } else {
      const xKeys = getKeys(x);
      let xLength1 = xKeys.length;
      const yKeys = getKeys(y);
      const yLength1 = yKeys.length;
      if (xLength1 !== yLength1)
        return false;
      while (xLength1--) {
        const key = xKeys[xLength1];
        const xValue = x[key];
        const yValue = y[key];
        if (!isEqual(xValue, yValue))
          return false;
        if (yValue === void 0 && !Object.hasOwn(y, key))
          return false;
      }
    }
    return true;
  }
  return x !== x && y !== y;
};
var is_equal_default = isEqual;

// ../../everyday-utils/dist/esm/everyday-utils.js
var chunk = (arr, size) => {
  return Array.from({
    length: Math.ceil(arr.length / size) | 0
  }, (_, i) => {
    const pos = i * size;
    return arr.slice(pos, pos + size);
  });
};
function entries(obj) {
  return Object.entries(obj);
}
function keys(obj) {
  return Object.keys(obj);
}
var fromEntries = (entries2) => Object.fromEntries(entries2);
var cheapRandomId = () => `${String.fromCharCode(97 + Math.random() * 25)}${(Math.random() * 1e8 | 0).toString(36)}`;
var accessors = (target, source, fn, filter3 = () => true) => {
  const prevDesc = /* @__PURE__ */ new Map();
  Object.defineProperties(target, Object.fromEntries(entries(source).filter(([key]) => typeof key === "string").filter(([key, value]) => filter3(key, value)).map(([key, value]) => {
    const next = fn(key, value);
    const prev = Object.getOwnPropertyDescriptor(target, key);
    prevDesc.set(key, prev);
    if (prev && prev.get && prev.set) {
      const { get, set } = next;
      next.get = () => {
        const top = get?.();
        const below = prev.get();
        return below ?? top;
      };
      next.set = (v) => {
        prev.set?.(v);
        set(prev.get?.() ?? v);
      };
    }
    return [
      key,
      {
        configurable: true,
        enumerable: true,
        ...next
      }
    ];
  })));
  return () => {
    for (const [key, desc] of prevDesc) {
      if (desc == null) {
        delete target[key];
      } else {
        Object.defineProperty(target, key, desc);
      }
    }
  };
};
var kebab = (s) => s.replace(/[a-z](?=[A-Z])|[A-Z]+(?=[A-Z][a-z])/g, "$&-").toLowerCase();
var styleToCss = (style) => {
  let css = "";
  for (const key in style)
    css += style[key] != null && style[key] !== false ? kebab(key) + ":" + style[key] + ";" : "";
  return css;
};
var shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
var asyncSerialMap = async (arr, fn) => {
  const results = [];
  for (const [i, item] of arr.entries()) {
    results.push(await fn(item, i, arr));
  }
  return results;
};
var asyncSerialReduce = async (arr, fn, prev) => {
  for (const [i, item] of arr.entries()) {
    prev = await fn(prev, item, i, arr);
  }
  return prev;
};
var wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var tick = () => Promise.resolve();
var colorHash = (string, minColorHex = "888") => {
  const minColor = parseInt(minColorHex, 16);
  const color = ((string.split("").reduce((p, n) => p + (n.charCodeAt(0) << 5), 0) | 0) % (4096 - minColor) + minColor).toString(16).padStart(3, "0");
  return color;
};
function colorOf(id, sat = 100, lum = 65) {
  return `hsl(${Math.round(parseInt(id, 36) / 25) * 25 % 360}, ${sat}%, ${lum}%)`;
}
var removeFromArray = (arr, el, quiet = false) => {
  const index = arr.indexOf(el);
  if (!~index) {
    if (quiet)
      return;
    throw new ReferenceError("Item to be removed does not exist in the array.");
  }
  return arr.splice(index, 1);
};
var chainSync = (...args) => () => {
  for (const fn of args)
    fn();
};
var shallowEqual = (a, b) => [
  [
    a,
    b
  ],
  [
    b,
    a
  ]
].every(([a2, b2]) => entries(a2).every(([key, value]) => key in b2 && b2[key] == value));
var getOwnProperty = (object, name) => Object.getOwnPropertyDescriptor(object, name)?.value;
var padCenter = (str, length) => {
  const strLength = getStringLength(str);
  const padLength = Math.floor((length - strLength) / 2);
  return repeatString(" ", length - strLength - padLength) + str + repeatString(" ", padLength);
};
var getStringLength = (str) => stripAnsi(str).length;
var padStart = (str, length, char = " ") => {
  const strLength = getStringLength(str);
  return repeatString(char, length - strLength) + str;
};
var repeatString = (s, x) => s.repeat(Math.max(0, x));
var stripAnsi = (str) => str.toString().replace(/\u001b\[\d+m/g, "");
var includesAny = (str, predicates) => predicates.some((p) => str.includes(p));
var asyncFilter = async (array, fn) => (await Promise.all(array.map(async (x) => [
  x,
  await fn(x)
]))).filter(([, truth]) => truth).map(([x]) => x);
var defineProperty = toFluent(class {
  configurable = false;
  enumerable = false;
  writable = bool;
}, (descriptor) => (object, name, value) => Object.defineProperty(object, name, value == null ? descriptor : {
  ...descriptor,
  value
}));
var filterMap = (array, fn) => array.map(fn).filter((x) => x != null && x !== false);
var sortCompare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
var sortCompareKeys = ([a], [b]) => a < b ? -1 : a > b ? 1 : 0;
var sortObjectInPlace = (data) => {
  const sorted = Object.fromEntries(Object.entries(data).sort(sortCompareKeys));
  for (const key in data)
    delete data[key];
  Object.assign(data, sorted);
  return data;
};
var splitAt = (string, index) => [
  string.slice(0, index),
  string.slice(index + 1)
];
var memoize = (fn, map = /* @__PURE__ */ Object.create(null)) => function(...args) {
  const serialized = args.join();
  return map[serialized] ?? (map[serialized] = fn.apply(this, args));
};
var Deferred = () => {
  const _onwhen = () => {
    deferred.hasSettled = true;
    deferred.resolve = deferred.reject = noop;
  };
  const noop = () => {
  };
  let onwhen = noop;
  const deferred = {
    hasSettled: false,
    when: (fn) => {
      onwhen = () => {
        _onwhen();
        fn();
      };
    }
  };
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = (arg) => {
      onwhen();
      deferred.value = arg;
      resolve(arg);
    };
    deferred.reject = (error) => {
      onwhen();
      deferred.error = error;
      reject(error);
    };
  });
  return deferred;
};
function KeyedCache(getter) {
  const cache = /* @__PURE__ */ new Map();
  async function get(key, ...args) {
    let deferred = cache.get(key);
    if (deferred == null) {
      cache.set(key, deferred = Deferred());
      getter(key, ...args).then(deferred.resolve).catch(deferred.resolve);
    }
    return deferred.promise;
  }
  get.cache = cache;
  return get;
}
var promisify = (fn) => {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, ...data) => {
        if (err)
          reject(err);
        else
          resolve(data);
      });
    });
  };
};
var MapSet = class {
  #map = /* @__PURE__ */ new Map();
  add(key, value) {
    if (this.#map.has(key)) {
      const set = this.#map.get(key);
      set.add(value);
      return set.size;
    } else {
      this.#map.set(key, /* @__PURE__ */ new Set([
        value
      ]));
      return 1;
    }
  }
  values() {
    return [
      ...this.#map.values()
    ].flatMap((set) => [
      ...set
    ]);
  }
  get(key) {
    return this.#map.get(key);
  }
  delete(key, value) {
    return this.#map.get(key)?.delete(value) ?? false;
  }
  has(key, value) {
    return this.#map.get(key)?.has(value) ?? false;
  }
  hasKey(key) {
    return this.#map.has(key);
  }
  clear() {
    return this.#map.clear();
  }
  get size() {
    return this.#map.size;
  }
};
var WeakMapSet = class {
  #map = /* @__PURE__ */ new WeakMap();
  set(key, value) {
    if (this.#map.has(key)) {
      const set = this.#map.get(key);
      set.add(value);
      return set.size;
    } else {
      this.#map.set(key, /* @__PURE__ */ new Set([
        value
      ]));
      return 1;
    }
  }
  get(key) {
    return this.#map.get(key);
  }
  delete(key, value) {
    return this.#map.get(key)?.delete(value) ?? false;
  }
  has(key, value) {
    return this.#map.get(key)?.has(value) ?? false;
  }
};
var MapMap = class {
  #map = /* @__PURE__ */ new Map();
  set(keyA, keyB, value) {
    if (this.#map.has(keyA)) {
      const map = this.#map.get(keyA);
      map.set(keyB, value);
      return map.size;
    } else {
      this.#map.set(keyA, /* @__PURE__ */ new Map([
        [
          keyB,
          value
        ]
      ]));
      return 1;
    }
  }
  get(keyA, keyB) {
    return this.#map.get(keyA)?.get(keyB);
  }
  delete(keyA, keyB) {
    return this.#map.get(keyA)?.delete(keyB) ?? false;
  }
  has(keyA, keyB) {
    return this.#map.has(keyA) && this.#map.get(keyA).has(keyB);
  }
  clear() {
    return this.#map.clear();
  }
};
var MapMapSet = class {
  #map = /* @__PURE__ */ new Map();
  add(keyA, keyB, value) {
    if (this.#map.has(keyA)) {
      const map = this.#map.get(keyA);
      map.add(keyB, value);
      return map.size;
    } else {
      const map1 = new MapSet();
      map1.add(keyB, value);
      this.#map.set(keyA, map1);
      return 1;
    }
  }
  get(keyA, keyB) {
    return this.#map.get(keyA)?.get(keyB);
  }
  delete(keyA, keyB, value) {
    return this.#map.get(keyA)?.delete(keyB, value) ?? false;
  }
  has(keyA, keyB, value) {
    return this.#map.has(keyA) && this.#map.get(keyA).has(keyB, value);
  }
  clear() {
    return this.#map.clear();
  }
};
var mutable = (array) => array;
var MapFactory = class extends Map {
  get(key, ...args) {
    if (this.has(key)) {
      return super.get(key);
    } else {
      const value = new this.ctor(key, ...args.length ? args : this.defaultArgs);
      this.set(key, value);
      return value;
    }
  }
  ctor;
  constructor(ctorOrJson, defaultArgs = []) {
    if (typeof ctorOrJson === "object") {
      super(ctorOrJson.entries);
      this.defaultArgs = defaultArgs;
      this.ctor = ctorOrJson.ctor;
    } else {
      super();
      this.defaultArgs = defaultArgs;
      this.ctor = ctorOrJson;
    }
  }
  toJSON() {
    return {
      entries: [
        ...this
      ],
      ctor: this.ctor
    };
  }
  defaultArgs;
};
var WeakMapFactory = class extends WeakMap {
  get(key, ...args) {
    if (this.has(key)) {
      return super.get(key);
    } else {
      const value = new this.ctor(key, ...args.length ? args : this.defaultArgs);
      this.set(key, value);
      return value;
    }
  }
  constructor(ctor, defaultArgs = []) {
    super();
    this.ctor = ctor;
    this.defaultArgs = defaultArgs;
  }
  ctor;
  defaultArgs;
};
function bindAll(obj, target = obj) {
  return Object.assign(target, Object.fromEntries(filterMap(entries(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj))), ([key, desc]) => typeof desc.value === "function" && [
    key,
    desc.value.bind(obj)
  ])));
}
function once(fn) {
  if (!fn)
    return fn;
  let res;
  function wrap(...args) {
    const savefn = fn;
    fn = void 0;
    res ??= savefn?.apply(this, args);
    return res;
  }
  return wrap;
}

// ../../everyday-utils/dist/esm/index.js
__reExport(esm_exports, everyday_utils_exports);

// ../../event-toolkit/dist/esm/task.js
function taskDeferred(resolve, reject) {
  this.resolve = resolve;
  this.reject = reject;
}
function Task(fn, self2, args) {
  const task = {
    fn,
    self: self2,
    args
  };
  task.promise = new Promise(taskDeferred.bind(task));
  return task;
}
function taskRun(task, res) {
  return task.resolve(res = task.fn.apply(task.self, task.args)), res;
}
function taskNext(other, t) {
  return other.promise.then(t.resolve);
}
function taskGroup(other, tasks) {
  return tasks.forEach(taskNext.bind(null, other));
}

// ../../event-toolkit/dist/esm/queue.js
var QueueOptions = class {
  first = bool;
  last = bool;
  next = bool;
  raf = bool;
  task = bool;
  time = bool;
  atomic = bool;
  concurrency;
  debounce;
  throttle;
  hooks;
};
var wrapQueue = (options = {}) => (queueFn) => {
  const initialOptions = {
    ...options
  };
  const queued = [];
  let queueOuterFn;
  let id;
  let last;
  let runs = false;
  if (options.hooks) {
    if (options.hooks.before || options.hooks.after) {
      const real = queueFn;
      queueFn = function(...args) {
        options.hooks.before?.();
        const result = real.apply(this, args);
        options.hooks.after?.();
        return result;
      };
    }
  }
  if (options.raf)
    queueOuterFn = requestAnimationFrame;
  else if (options.task)
    queueOuterFn = queueMicrotask;
  else if (options.time)
    queueOuterFn = setTimeout;
  else if (options.throttle != null) {
    queueOuterFn = (fn) => {
      runs = true;
      setTimeout(() => {
        if (!queued.length)
          runs = false;
        fn();
      }, options.throttle);
    };
  } else if (options.debounce != null) {
    queueOuterFn = (fn) => {
      clearTimeout(id);
      id = setTimeout(fn, options.debounce);
    };
  } else if (options.atomic)
    queueOuterFn = (fn) => fn();
  else {
    return queueFn;
  }
  if (options.first == null && options.last == null) {
    if (options.throttle != null) {
      options.first = true;
      options.last = true;
    } else if (options.debounce != null)
      options.last = true;
    else
      options.next = true;
  }
  let runningTasks = 0;
  function queueNext() {
    let task;
    if (queued.length) {
      if (options.atomic) {
        task = queued.shift();
        taskRun(task).catch((_error) => {
        }).finally(() => {
          if (options.concurrency) {
            runningTasks--;
          }
          queueOuterFn(queueNext);
        });
        if (options.concurrency) {
          runningTasks++;
          if (runningTasks < options.concurrency) {
            queueOuterFn(queueNext);
          }
        }
        return;
      }
      if (options.last) {
        if (options.next) {
          const left = queued.splice(0, queued.length - 1);
          task = left.pop() ?? queued.pop();
          taskGroup(task, left);
          last = taskRun(task);
          if (queued.length || options.throttle) {
            queueOuterFn(queueNext);
          }
          return;
        } else {
          task = queued.pop();
          taskGroup(task, queued.splice(0));
          last = taskRun(task);
          if (options.throttle) {
            queueOuterFn(queueNext);
            return;
          }
        }
      } else if (options.next) {
        task = queued.shift();
        taskGroup(task, queued.splice(0, queued.length - 1));
        queueOuterFn(queueNext);
        last = taskRun(task);
        return;
      } else {
        task = Task();
        taskGroup(task, queued.splice(0));
        task.resolve(last);
      }
    }
    runs = false;
  }
  function queueWrap(...args) {
    const task = Task(queueFn, this, args);
    if (!runs && options.first) {
      runs = true;
      if (!queued.length) {
        last = taskRun(task);
        queueOuterFn(queueNext);
        return task.promise;
      }
    }
    queued.push(task);
    if (!runs || options.debounce) {
      runs = true;
      queueOuterFn(queueNext);
    }
    return task.promise;
  }
  queueWrap.fn = queueFn;
  queueWrap.options = initialOptions;
  queueWrap.update = (newFn, newOptions) => {
    if (!shallowEqual(initialOptions, newOptions)) {
      return newFn;
    }
    queueFn = newFn;
    return queueWrap;
  };
  return queueWrap;
};
var queue = toFluent(QueueOptions, wrapQueue);

// ../../event-toolkit/dist/esm/event.js
var EventOptions = class extends QueueOptions {
  prevent = bool;
  stop = bool;
  immediate = bool;
  capture = bool;
  once = bool;
  passive = bool;
};
var wrapEvent = (options = {}) => (fn = () => {
}) => wrapQueue(options)(options.prevent || options.stop || options.immediate || options.capture != null || options.once != null || options.passive != null ? Object.assign(function eventHandler(e) {
  if (options.prevent)
    e.preventDefault();
  if (options.stop) {
    options.immediate ? e.stopImmediatePropagation() : e.stopPropagation();
  }
  return fn.call(this, e);
}, options) : fn);
var event = toFluent(EventOptions, wrapEvent);

// ../../proxy-toolkit/dist/esm/proxy-toolkit.js
var FluentCaptureSymbol = Symbol();

// ../../synced-set/dist/esm/synced-set.js
var SyncedSet = class extends EventTarget {
  map = /* @__PURE__ */ new Map();
  added = /* @__PURE__ */ new Set();
  updated = /* @__PURE__ */ new Set();
  deleted = /* @__PURE__ */ new Set();
  options;
  constructor(options) {
    super();
    options.id ??= "id";
    this.options = options;
  }
  [Symbol.iterator]() {
    return this.map.values()[Symbol.iterator]();
  }
  get size() {
    return this.map.size;
  }
  forEach(callback, thisArg) {
    return (/* @__PURE__ */ new Set([
      ...this.map.values()
    ])).forEach(callback, thisArg);
  }
  clear() {
    return this.map.clear();
  }
  send() {
    this.options.send({
      added: this.added,
      updated: this.updated,
      deleted: this.deleted
    }, () => {
      this.added.clear();
      this.updated.clear();
      this.deleted.clear();
    });
  }
  receive(payload) {
    for (const id of payload.deleted) {
      this.deleteById(id);
    }
    for (const object of payload.updated) {
      this.update(object);
    }
    for (const object1 of payload.added) {
      this.add(object1, true);
    }
  }
  has(object) {
    const id = object[this.options.id];
    return this.map.has(id);
  }
  update(object) {
    const id = object[this.options.id];
    if (this.map.has(id)) {
      const local = this.map.get(id);
      Object.assign(local, pick(object, this.options.pick));
    }
  }
  add(object, fromRemote = false) {
    const id = object[this.options.id];
    if (this.map.has(id)) {
      throw new ReferenceError("Object id to be added already in set: " + id);
    } else {
      this.map.set(id, object);
      const entries2 = Object.entries(object);
      const curr = Object.fromEntries(entries2);
      let prev = this.options.reducer(curr);
      let next;
      accessors(object, object, (key) => ({
        get: () => curr[key],
        set: (v) => {
          if (!this.map.has(id))
            return;
          curr[key] = v;
          next = this.options.reducer(curr);
          if (!this.options.equal(prev, next)) {
            this.updated.add(object);
            this.send();
          }
          prev = next;
        }
      }));
      if (!fromRemote) {
        this.added.add(object);
        this.send();
      }
      if (typeof CustomEvent !== "undefined") {
        dispatch(this, "add", object);
      }
    }
    return this;
  }
  delete(object) {
    const id = object[this.options.id];
    if (!this.map.has(id)) {
      throw new ReferenceError("Object id to be delete not found in set: " + id);
    }
    this.deleteById(id);
    this.deleted.add(id);
    this.send();
    if (typeof CustomEvent !== "undefined") {
      dispatch(this, "delete", object);
    }
    return true;
  }
  deleteById(id) {
    this.map.delete(id);
  }
};

// ../../immutable-map-set/dist/esm/imm-set.js
var ImmSet = class extends Set {
  constructor(values) {
    super();
    if (values)
      for (const value of values)
        this.mutateAdd(value);
  }
  toJSON() {
    return [
      ...this
    ];
  }
  add(value) {
    return new ImmSet(this).mutateAdd(value);
  }
  mutateAdd(value) {
    return super.add(value);
  }
  delete(value) {
    const set = new ImmSet(this);
    set.mutateDelete(value);
    return set;
  }
  mutateDelete(value) {
    return super.delete(value);
  }
  clear() {
    return new ImmSet();
  }
};

// ../../json-objectify/dist/esm/json-objectify.js
var createContext = (asIsCtors = []) => {
  const asIs = new Set(asIsCtors);
  const objectify3 = (value, replacer3, top = true) => {
    if (value === null)
      return value;
    if (typeof value === "object" && !asIs.has(value.constructor)) {
      if (top) {
        value = replacer3.call({
          "": value
        }, "", value);
      }
      value = Object.entries(value).reduce((p, [k, v]) => {
        p[k] = v === null ? v : objectify3(replacer3.call(value, k, v), replacer3, false);
        return p;
      }, Array.isArray(value) ? [] : {});
      return value;
    }
    return value;
  };
  const objectifyAsync2 = async (value, replacer3, top = true) => {
    if (value === null)
      return value;
    if (typeof value === "object" && !asIs.has(value.constructor)) {
      if (top) {
        value = replacer3.call({
          "": value
        }, "", value);
      }
      value = await asyncSerialReduce(Object.entries(value), async (p, [k, v]) => {
        p[k] = v === null ? v : await new Promise((resolve) => {
          setTimeout(async () => {
            resolve(await objectifyAsync2(replacer3.call(value, k, v), replacer3, false));
          });
        });
        return p;
      }, Array.isArray(value) ? [] : {});
      return value;
    }
    return value;
  };
  const deobjectify3 = (value, reviver3, top = true) => {
    if (value === null)
      return value;
    if (typeof value === "object" && !asIs.has(value.constructor)) {
      value = Object.entries(value).reduce((p, [k, v]) => {
        p[k] = v === null ? v : reviver3.call(p, k, deobjectify3(v, reviver3, false));
        return p;
      }, Array.isArray(value) ? [] : {});
      if (top) {
        value = reviver3.call({
          "": value
        }, "", value);
      }
      return value;
    }
    return value;
  };
  return {
    objectify: objectify3,
    objectifyAsync: objectifyAsync2,
    deobjectify: deobjectify3
  };
};
var { objectify, objectifyAsync, deobjectify } = createContext();

// ../../serialize-whatever/dist/esm/serialize-whatever.js
var trailingNumbersRegExp = /\d+$/g;
var stripTrailingNumbers = (x) => x.replace(trailingNumbersRegExp, "");
var thru = (x) => x;
var createContext2 = (extraTypes = []) => {
  const Types = new Map([
    [
      Object
    ],
    [
      Array,
      [
        thru,
        thru
      ]
    ],
    [
      Map,
      [
        (x) => [
          ...x
        ]
      ]
    ],
    [
      Set,
      [
        (x) => [
          ...x
        ]
      ]
    ],
    [
      Date
    ],
    ...extraTypes
  ]);
  const TypesMap = [
    ...Types.keys()
  ].map((x) => [
    stripTrailingNumbers(x.name),
    x
  ]);
  let pointer = 0;
  const ptrs = /* @__PURE__ */ new Map();
  const defaultSerializer = (obj) => obj.toJSON ? obj.toJSON() : Object.assign({}, obj);
  const createEntry = (serializer, obj) => ptrs.get(obj) ?? {
    $r: (ptrs.set(obj, {
      $p: ++pointer
    }), pointer),
    $t: stripTrailingNumbers(obj.constructor.name),
    $v: serializer(obj)
  };
  const replacer3 = (top, clear = true) => (clear && (pointer = 0, ptrs.clear()), function(key) {
    const value = this[key];
    if (value === top && key !== "" || typeof value === "object" && value.$r || this.$r) {
      return value;
    }
    if (typeof value === "object") {
      const [serializer = defaultSerializer] = Types.get(value.constructor) ?? [];
      return createEntry(serializer, value);
    }
    return value;
  });
  const reviver3 = (classes, refs = /* @__PURE__ */ new Map(), pending = /* @__PURE__ */ new Map()) => {
    const types = new Map([
      ...TypesMap,
      ...classes.map((x) => [
        stripTrailingNumbers(x.name),
        x
      ])
    ]);
    const getRef = (value, key, owner) => {
      const { $p } = value;
      if (refs.has($p))
        return refs.get($p);
      else {
        let queued = pending.get($p);
        if (!queued)
          pending.set($p, queued = /* @__PURE__ */ new Set());
        queued.add([
          owner,
          key
        ]);
        return value;
      }
    };
    return function(key, value) {
      if (typeof value === "object" && value !== null) {
        if (value.$t) {
          const { $r, $t, $v } = value;
          const ctor = types.get($t);
          if (!ctor) {
            throw new TypeError("Unable to deserialize object type: " + $t + `
  Be sure to pass the class like so:

    deserialize(serialized, [${$t}])`);
          }
          const [, deserializer = (x) => new ctor(x)] = Types.get(ctor) ?? [];
          const result = deserializer($v);
          if ($t === "Map") {
            for (const pv of pending.values()) {
              for (const q of pv) {
                if ($v.includes(q[0])) {
                  if (q[1] == "0") {
                    q[1] = (key2) => {
                      const p = q[0][0];
                      const v = result.get(p);
                      result.set(key2, v);
                      result.delete(p);
                    };
                  } else if (q[1] == "1") {
                    q[1] = (value2) => {
                      let p = q[0][0];
                      if (p?.$p) {
                        p = refs.get(p.$p);
                      }
                      result.set(p, value2);
                    };
                  }
                }
              }
            }
          }
          if ($t === "Set") {
            for (const pv1 of pending.values()) {
              for (const q1 of pv1) {
                if ($v.includes(q1[0][0])) {
                  const p = q1[0][q1[1]];
                  q1[1] = (value2) => {
                    result.add(value2);
                    result.delete(p);
                  };
                }
              }
            }
          }
          refs.set($r, result);
          if (pending.has($r)) {
            pending.get($r).forEach(([parent, key2]) => {
              if (typeof key2 === "function") {
                key2(result);
              } else {
                parent[key2] = result;
              }
            });
          }
          return result;
        } else if (value.$p) {
          return getRef(value, key, this);
        }
      }
      return value;
    };
  };
  return {
    replacer: replacer3,
    reviver: reviver3
  };
};
var { replacer, reviver } = createContext2();

// ../../scheduler-node/dist/esm/message-queue.js
var MessageQueue = class {
  buffer = new Float64Array(new SharedArrayBuffer(8192 * Float64Array.BYTES_PER_ELEMENT));
  constructor(messageQueue = {}) {
    Object.assign(this, messageQueue);
  }
  toJSON() {
    return {
      buffer: this.buffer
    };
  }
  get readPtr() {
    return this.buffer[0];
  }
  set readPtr(index) {
    this.buffer[0] = index;
  }
  get writePtr() {
    return this.buffer[1];
  }
  set writePtr(index) {
    this.buffer[1] = index;
  }
  clear() {
    this.buffer.fill(-Infinity);
    this.readPtr = 2;
    this.writePtr = 2;
    return this;
  }
  push(...values) {
    const buffer = this.buffer;
    const ptr = this.writePtr;
    buffer.set(values, ptr);
    this.writePtr = ptr + values.length;
  }
  shift() {
    const buffer = this.buffer;
    const ptr = this.readPtr;
    const value = buffer[ptr];
    if (!isFinite(value)) {
      this.readPtr = this.writePtr = 2;
      return void 0;
    }
    buffer[ptr] = -Infinity;
    this.readPtr = ptr + 1;
    return value;
  }
  slice(length) {
    const buffer = this.buffer;
    const ptr = this.readPtr;
    const slice = buffer.subarray(ptr, ptr + length);
    if (!isFinite(slice[0])) {
      this.buffer.fill(-Infinity, 2, 2 + ptr);
      this.readPtr = this.writePtr = 2;
      return void 0;
    }
    this.readPtr = ptr + length;
    return slice;
  }
};

// ../../webaudio-tools/dist/esm/midi-events.js
var MidiOp = {
  NoteOff: 128,
  NoteOn: 144
};
var createMidiEvent = (time, data) => {
  const event2 = new MIDIMessageEvent("midimessage", {
    data: new Uint8Array(data)
  });
  event2.receivedTime = time * 1e3;
  return event2;
};
var createMidiNoteEvents = (time, note, velocity, length) => {
  const midiEvents = [];
  {
    const midiEvent = createMidiEvent(time, [
      MidiOp.NoteOn,
      note,
      velocity
    ]);
    midiEvents.push(midiEvent);
  }
  {
    const midiEvent1 = createMidiEvent(time + length, [
      MidiOp.NoteOff,
      note,
      0
    ]);
    midiEvents.push(midiEvent1);
  }
  return midiEvents;
};

// ../../scheduler-node/dist/esm/scheduler-event.js
var SchedulerEvent = class {
  id = cheapRandomId();
  midiEvent = {
    data: new Uint8Array(3),
    receivedTime: 0
  };
  constructor(data = {}) {
    this.id = data.id ?? this.id;
    if (data.midiEvent) {
      this.midiEvent.data = data.midiEvent.data;
      this.midiEvent.receivedTime = data.midiEvent.receivedTime;
    }
  }
  toJSON() {
    return {
      id: this.id,
      midiEvent: {
        receivedTime: this.midiEvent.receivedTime ?? 0,
        data: this.midiEvent.data
      }
    };
  }
};
var SchedulerTarget = class {
  id = cheapRandomId();
  midiQueue = new MessageQueue().clear();
  constructor(data = {}) {
    Object.assign(this, data);
  }
};
var SchedulerEventGroup = class {
  id = cheapRandomId();
  targets = new ImmSet();
  events = new ImmSet();
  loopPoints = new Float64Array(new SharedArrayBuffer(3 * Float64Array.BYTES_PER_ELEMENT));
  constructor(eventGroup = {}) {
    Object.assign(this, eventGroup);
  }
  toJSON() {
    return {
      id: this.id,
      targets: this.targets,
      events: this.events,
      loopPoints: this.loopPoints
    };
  }
  get loop() {
    return !!this.loopPoints[0];
  }
  set loop(value) {
    this.loopPoints[0] = +value;
  }
  get loopStart() {
    return this.loopPoints[1];
  }
  set loopStart(seconds) {
    this.loopPoints[1] = seconds;
  }
  get loopEnd() {
    return this.loopPoints[2];
  }
  set loopEnd(seconds) {
    this.loopPoints[2] = seconds;
  }
  replaceAllWithNotes(notes) {
    const midiEvents = [];
    for (const [time, note, velocity, length] of notes) {
      midiEvents.push(...createMidiNoteEvents(time, note, velocity, length));
    }
    this.events = this.events.clear();
    for (const midiEvent of midiEvents) {
      const event2 = new SchedulerEvent({
        midiEvent
      });
      this.events = this.events.add(event2);
    }
    return midiEvents;
  }
};

// ../../scheduler-node/dist/esm/scheduler-core.js
var deserializableClasses = [
  SchedulerEventGroup,
  SchedulerEvent,
  SchedulerTarget,
  MessageQueue,
  ImmSet
];
var { replacer: replacer2, reviver: reviver2 } = createContext2([
  [
    Float64Array,
    [
      thru,
      thru
    ]
  ],
  [
    Uint8Array,
    [
      thru,
      thru
    ]
  ]
]);
var { objectify: objectify2, deobjectify: deobjectify2 } = createContext([
  Float64Array,
  Uint8Array
]);
var core = {
  pickFromLocal: [
    "id",
    "targets",
    "events",
    "loopPoints"
  ],
  serialize: (data) => objectify2(data, replacer2(data)),
  deserialize: (data) => deobjectify2(data, reviver2(deserializableClasses))
};

// ../../scheduler-node/dist/esm/util.js
var getEventsInRange = (events, loop, loopStart, loopEnd, currentTime2, sampleTime, quantumDurationTime, playbackStartTime) => {
  let startTime;
  let endTime;
  let offsetTime = 0;
  let loopDuration = 0;
  const results = [];
  if (loop) {
    loopDuration = loopEnd - loopStart;
    offsetTime = currentTime2 - playbackStartTime - loopStart;
    if (offsetTime < 0) {
      return results;
    }
    startTime = offsetTime % loopDuration;
    endTime = (startTime + quantumDurationTime) % loopDuration;
    if (startTime < sampleTime)
      startTime = 0;
    if (endTime < sampleTime)
      endTime = 0;
  } else {
    startTime = currentTime2 - playbackStartTime;
    endTime = startTime + quantumDurationTime;
  }
  for (const event2 of events) {
    const eventTime = event2.midiEvent.receivedTime * 1e-3;
    const isPast = endTime < startTime;
    if (eventTime === startTime && startTime === endTime || (isPast ? eventTime >= loopStart && eventTime < endTime : eventTime >= startTime && eventTime < endTime)) {
      let receivedTime;
      if (loop) {
        receivedTime = eventTime + Math[isPast ? "ceil" : "floor"](startTime / loopDuration) * loopDuration + playbackStartTime + (offsetTime - startTime);
      } else {
        receivedTime = eventTime + playbackStartTime;
      }
      receivedTime *= 1e3;
      results.push([
        receivedTime,
        event2
      ]);
    }
  }
  return results;
};

// ../../scheduler-node/dist/esm/scheduler-processor.js
var SchedulerProcessor = class extends AudioWorkletProcessor {
  blockSize = 128;
  sampleTime = 1 / sampleRate;
  quantumDurationTime = this.blockSize / sampleRate;
  bpm = 120;
  coeff = 1;
  playbackStartTime = 0;
  adjustedStartTime = 0;
  running = false;
  eventGroups = new SyncedSet({
    send: (_, cb) => cb(),
    pick: core.pickFromLocal,
    reducer: () => null,
    equal: () => true
  });
  constructor() {
    super();
    const [worklet] = new Bob((data) => this.port.postMessage({
      rpc: data
    }), this).agents({
      debug: false
    });
    this.port.onmessage = ({ data }) => {
      if (data.rpc)
        worklet.receive(data.rpc);
      if (data.eventGroups)
        this.eventGroups.receive(core.deserialize(data.eventGroups));
    };
  }
  async start(playbackStartTime = currentTime) {
    this.running = true;
    this.playbackStartTime = playbackStartTime;
    this.adjustedStartTime = this.playbackStartTime * this.coeff;
    return playbackStartTime;
  }
  stop() {
    this.running = false;
  }
  setBpm(bpm) {
    this.bpm = bpm;
    this.coeff = 2 / (60 * 4 / this.bpm);
    this.sampleTime = 1 / sampleRate / this.coeff;
    this.quantumDurationTime = this.blockSize / sampleRate * this.coeff;
    const diff = currentTime - this.playbackStartTime;
    this.adjustedStartTime = (currentTime - diff) * this.coeff;
  }
  process() {
    if (!this.running)
      return true;
    for (const eventGroup of this.eventGroups) {
      const events = getEventsInRange(
        eventGroup.events,
        eventGroup.loop,
        eventGroup.loopStart,
        eventGroup.loopEnd,
        currentTime * this.coeff,
        this.sampleTime,
        this.quantumDurationTime,
        this.adjustedStartTime
      );
      for (const target of eventGroup.targets) {
        for (const [receivedTime, event2] of events) {
          target.midiQueue.push(receivedTime / this.coeff, ...event2.midiEvent.data);
        }
      }
    }
    return true;
  }
};
registerProcessor("scheduler", SchedulerProcessor);
export {
  SchedulerProcessor
};
//!? 'create accessor', key, prev, next
//!? 'new options', initialOptions, newOptions
//!? 'removing accessor', key, desc
//!? 'updated and returned previous wrapped'
//!? 'updating fn'
//!? 'wrap called'
//!warn _error
//!warn error
