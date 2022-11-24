var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// ../../../../.fastpm/-/eventemitter-strict@1.0.1/lib/index.js
var require_lib = __commonJS({
  "../../../../.fastpm/-/eventemitter-strict@1.0.1/lib/index.js"(exports) {
    "use strict";
    var __assign2 = exports && exports.__assign || function() {
      __assign2 = Object.assign || function(t2) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t2[p] = s[p];
        }
        return t2;
      };
      return __assign2.apply(this, arguments);
    };
    var __read2 = exports && exports.__read || function(o, n) {
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
    var __spreadArray2 = exports && exports.__spreadArray || function(to, from, pack) {
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
    var EventEmitter4 = function() {
      function EventEmitter5() {
        this.listeners = {};
      }
      EventEmitter5.prototype.emit = function(eventName) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
        }
        if (this.listeners[eventName]) {
          try {
            this.listeners[eventName].forEach(function(item) {
              if (typeof item.callback === "function") {
                item.callback.apply(item, __spreadArray2([], __read2(args), false));
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
      EventEmitter5.prototype.on = function(eventName, callback, options) {
        if (!this.listeners[eventName]) {
          this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(__assign2(__assign2({}, options), { callback }));
        return this;
      };
      EventEmitter5.prototype.off = function(eventName, callback) {
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
      EventEmitter5.prototype.once = function(eventName, callback) {
        this.on(eventName, callback, { once: true });
        return this;
      };
      EventEmitter5.onceSymbol = Symbol("once");
      return EventEmitter5;
    }();
    exports.EventEmitter = EventEmitter4;
  }
});

// ../../html-jsx/dist/types/index.js
var require_types = __commonJS({
  "../../html-jsx/dist/types/index.js"(exports, module) {
    "use strict";
    module.exports = {};
  }
});

// ../../../../.fastpm/-/tslib@2.4.0/tslib.js
var require_tslib = __commonJS({
  "../../../../.fastpm/-/tslib@2.4.0/tslib.js"(exports, module) {
    var __extends2;
    var __assign2;
    var __rest2;
    var __decorate6;
    var __param2;
    var __metadata5;
    var __awaiter2;
    var __generator2;
    var __exportStar2;
    var __values2;
    var __read2;
    var __spread2;
    var __spreadArrays2;
    var __spreadArray2;
    var __await2;
    var __asyncGenerator2;
    var __asyncDelegator2;
    var __asyncValues2;
    var __makeTemplateObject2;
    var __importStar2;
    var __importDefault2;
    var __classPrivateFieldGet2;
    var __classPrivateFieldSet2;
    var __classPrivateFieldIn2;
    var __createBinding2;
    (function(factory) {
      var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
      if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function(exports2) {
          factory(createExporter(root, createExporter(exports2)));
        });
      } else if (typeof module === "object" && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
      } else {
        factory(createExporter(root));
      }
      function createExporter(exports2, previous) {
        if (exports2 !== root) {
          if (typeof Object.create === "function") {
            Object.defineProperty(exports2, "__esModule", { value: true });
          } else {
            exports2.__esModule = true;
          }
        }
        return function(id, v) {
          return exports2[id] = previous ? previous(id, v) : v;
        };
      }
    })(function(exporter) {
      var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b)
          if (Object.prototype.hasOwnProperty.call(b, p))
            d[p] = b[p];
      };
      __extends2 = function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      __assign2 = Object.assign || function(t2) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t2[p] = s[p];
        }
        return t2;
      };
      __rest2 = function(s, e) {
        var t2 = {};
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t2[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t2[p[i]] = s[p[i]];
          }
        return t2;
      };
      __decorate6 = function(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          r = Reflect.decorate(decorators, target, key, desc);
        else
          for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
              r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };
      __param2 = function(paramIndex, decorator) {
        return function(target, key) {
          decorator(target, key, paramIndex);
        };
      };
      __metadata5 = function(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(metadataKey, metadataValue);
      };
      __awaiter2 = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      __generator2 = function(thisArg, body) {
        var _3 = { label: 0, sent: function() {
          if (t2[0] & 1)
            throw t2[1];
          return t2[1];
        }, trys: [], ops: [] }, f, y, t2, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_3)
            try {
              if (f = 1, y && (t2 = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t2 = y["return"]) && t2.call(y), 0) : y.next) && !(t2 = t2.call(y, op[1])).done)
                return t2;
              if (y = 0, t2)
                op = [op[0] & 2, t2.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t2 = op;
                  break;
                case 4:
                  _3.label++;
                  return { value: op[1], done: false };
                case 5:
                  _3.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _3.ops.pop();
                  _3.trys.pop();
                  continue;
                default:
                  if (!(t2 = _3.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _3 = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
                    _3.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _3.label < t2[1]) {
                    _3.label = t2[1];
                    t2 = op;
                    break;
                  }
                  if (t2 && _3.label < t2[2]) {
                    _3.label = t2[2];
                    _3.ops.push(op);
                    break;
                  }
                  if (t2[2])
                    _3.ops.pop();
                  _3.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _3);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t2 = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      __exportStar2 = function(m, o) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
            __createBinding2(o, m, p);
      };
      __createBinding2 = Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      };
      __values2 = function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
          return m.call(o);
        if (o && typeof o.length === "number")
          return {
            next: function() {
              if (o && i >= o.length)
                o = void 0;
              return { value: o && o[i++], done: !o };
            }
          };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
      };
      __read2 = function(o, n) {
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
      __spread2 = function() {
        for (var ar = [], i = 0; i < arguments.length; i++)
          ar = ar.concat(__read2(arguments[i]));
        return ar;
      };
      __spreadArrays2 = function() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
          s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
        return r;
      };
      __spreadArray2 = function(to, from, pack) {
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
      __await2 = function(v) {
        return this instanceof __await2 ? (this.v = v, this) : new __await2(v);
      };
      __asyncGenerator2 = function(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
        }, i;
        function verb(n) {
          if (g[n])
            i[n] = function(v) {
              return new Promise(function(a, b) {
                q.push([n, v, a, b]) > 1 || resume(n, v);
              });
            };
        }
        function resume(n, v) {
          try {
            step(g[n](v));
          } catch (e) {
            settle(q[0][3], e);
          }
        }
        function step(r) {
          r.value instanceof __await2 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
        }
        function fulfill(value) {
          resume("next", value);
        }
        function reject(value) {
          resume("throw", value);
        }
        function settle(f, v) {
          if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]);
        }
      };
      __asyncDelegator2 = function(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function(e) {
          throw e;
        }), verb("return"), i[Symbol.iterator] = function() {
          return this;
        }, i;
        function verb(n, f) {
          i[n] = o[n] ? function(v) {
            return (p = !p) ? { value: __await2(o[n](v)), done: n === "return" } : f ? f(v) : v;
          } : f;
        }
      };
      __asyncValues2 = function(o) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values2 === "function" ? __values2(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
        }, i);
        function verb(n) {
          i[n] = o[n] && function(v) {
            return new Promise(function(resolve, reject) {
              v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
          };
        }
        function settle(resolve, reject, d, v) {
          Promise.resolve(v).then(function(v2) {
            resolve({ value: v2, done: d });
          }, reject);
        }
      };
      __makeTemplateObject2 = function(cooked, raw) {
        if (Object.defineProperty) {
          Object.defineProperty(cooked, "raw", { value: raw });
        } else {
          cooked.raw = raw;
        }
        return cooked;
      };
      var __setModuleDefault = Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      };
      __importStar2 = function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding2(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      __importDefault2 = function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      __classPrivateFieldGet2 = function(receiver, state, kind, f) {
        if (kind === "a" && !f)
          throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
          throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
      };
      __classPrivateFieldSet2 = function(receiver, state, value, kind, f) {
        if (kind === "m")
          throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
          throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
          throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
      };
      __classPrivateFieldIn2 = function(state, receiver) {
        if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function")
          throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof state === "function" ? receiver === state : state.has(receiver);
      };
      exporter("__extends", __extends2);
      exporter("__assign", __assign2);
      exporter("__rest", __rest2);
      exporter("__decorate", __decorate6);
      exporter("__param", __param2);
      exporter("__metadata", __metadata5);
      exporter("__awaiter", __awaiter2);
      exporter("__generator", __generator2);
      exporter("__exportStar", __exportStar2);
      exporter("__createBinding", __createBinding2);
      exporter("__values", __values2);
      exporter("__read", __read2);
      exporter("__spread", __spread2);
      exporter("__spreadArrays", __spreadArrays2);
      exporter("__spreadArray", __spreadArray2);
      exporter("__await", __await2);
      exporter("__asyncGenerator", __asyncGenerator2);
      exporter("__asyncDelegator", __asyncDelegator2);
      exporter("__asyncValues", __asyncValues2);
      exporter("__makeTemplateObject", __makeTemplateObject2);
      exporter("__importStar", __importStar2);
      exporter("__importDefault", __importDefault2);
      exporter("__classPrivateFieldGet", __classPrivateFieldGet2);
      exporter("__classPrivateFieldSet", __classPrivateFieldSet2);
      exporter("__classPrivateFieldIn", __classPrivateFieldIn2);
    });
  }
});

// ../../pick-omit/dist/esm/pick-omit.js
var filter = (obj, fn2) => Object.fromEntries(Object.entries(obj).filter(fn2));
var pick = (obj, props17) => props17.reduce((p, n) => {
  if (n in obj)
    p[n] = obj[n];
  return p;
}, {});
var omit = (obj, props17) => filter(obj, includesKey(props17, true));
var includesKey = (props17, invert = false) => ([key]) => invert ^ props17.includes(key);

// ../../to-fluent/dist/esm/to-fluent.js
var bool = Symbol.for("to-fluent-bool");
var toFluent = (Schema, cb) => {
  const bools = Object.entries(new Schema()).filter(([, x]) => x === bool || typeof x === "boolean");
  const flags = bools.map(([key]) => key);
  const omitted = bools.filter(([, x]) => x === bool).map(([key]) => key);
  const settings = omit(new Schema(), omitted);
  let not = false;
  const bind = (settings2) => new Proxy(cb, {
    get(_3, key, receiver) {
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
    construct(_3, args) {
      const ctor = cb.call(self, {
        ...settings2
      });
      return new ctor(...args);
    },
    apply: (_3, self1, args) => cb.call(self1, {
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
var abort = toFluent(AbortOptions, (options) => (fn2) => {
  let ctrl;
  const wrap = Object.assign(async function wrap2(...args) {
    if (options.latest && ctrl)
      ctrl.abort();
    ctrl = new AbortController();
    if (options.timeout != null) {
      const timeoutError = new Error("Timed out");
      try {
        return await Promise.race([
          new Promise((_3, reject) => setTimeout(reject, options.timeout, timeoutError)),
          fn2(ctrl.signal).apply(this, args)
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
      return fn2(ctrl.signal).apply(this, args);
    }
  }, {
    fn: fn2()
  });
  return wrap;
});

// ../../event-toolkit/dist/esm/constants.js
var MouseButton = {
  Left: 1,
  Right: 2,
  Middle: 4
};

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
var dispatchBind = (el) => toFluent(DispatchOptions, (options) => (nameOrEvent, detail, init) => dispatchEvent(el, nameOrEvent, detail, init, options));

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
var filter2 = (obj, fn2) => Object.fromEntries(Object.entries(obj).filter(fn2));
var nonNull = (obj) => filter2(obj, ([, value]) => value != null);
var pick2 = (obj, props17) => props17.reduce((p, n) => {
  if (n in obj)
    p[n] = obj[n];
  return p;
}, {});
var omit2 = (obj, props17) => filter2(obj, includesKey2(props17, true));
var includesKey2 = (props17, invert = false) => ([key]) => invert ^ props17.includes(key);

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
  }, (_3, i) => {
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
var accessors = (target, source, fn2, filter3 = () => true) => {
  const prevDesc = /* @__PURE__ */ new Map();
  Object.defineProperties(target, Object.fromEntries(entries(source).filter(([key]) => typeof key === "string").filter(([key, value]) => filter3(key, value)).map(([key, value]) => {
    const next = fn2(key, value);
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
var styleToCss = (style2) => {
  let css3 = "";
  for (const key in style2)
    css3 += style2[key] != null && style2[key] !== false ? kebab(key) + ":" + style2[key] + ";" : "";
  return css3;
};
var shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
var asyncSerialMap = async (arr, fn2) => {
  const results = [];
  for (const [i, item] of arr.entries()) {
    results.push(await fn2(item, i, arr));
  }
  return results;
};
var asyncSerialReduce = async (arr, fn2, prev) => {
  for (const [i, item] of arr.entries()) {
    prev = await fn2(prev, item, i, arr);
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
  for (const fn2 of args)
    fn2();
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
var asyncFilter = async (array, fn2) => (await Promise.all(array.map(async (x) => [
  x,
  await fn2(x)
]))).filter(([, truth]) => truth).map(([x]) => x);
var defineProperty = toFluent(class {
  configurable = false;
  enumerable = false;
  writable = bool;
}, (descriptor) => (object, name, value) => Object.defineProperty(object, name, value == null ? descriptor : {
  ...descriptor,
  value
}));
var filterMap = (array, fn2) => array.map(fn2).filter((x) => x != null && x !== false);
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
var memoize = (fn2, map = /* @__PURE__ */ Object.create(null)) => function(...args) {
  const serialized = args.join();
  return map[serialized] ?? (map[serialized] = fn2.apply(this, args));
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
    when: (fn2) => {
      onwhen = () => {
        _onwhen();
        fn2();
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
var promisify = (fn2) => {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn2.call(this, ...args, (err, ...data) => {
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
function once(fn2) {
  if (!fn2)
    return fn2;
  let res;
  function wrap(...args) {
    const savefn = fn2;
    fn2 = void 0;
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
function Task(fn2, self2, args) {
  const task = {
    fn: fn2,
    self: self2,
    args
  };
  task.promise = new Promise(taskDeferred.bind(task));
  return task;
}
function taskRun(task, res) {
  return task.resolve(res = task.fn.apply(task.self, task.args)), res;
}
function taskNext(other, t2) {
  return other.promise.then(t2.resolve);
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
  let last2;
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
    queueOuterFn = (fn2) => {
      runs = true;
      setTimeout(() => {
        if (!queued.length)
          runs = false;
        fn2();
      }, options.throttle);
    };
  } else if (options.debounce != null) {
    queueOuterFn = (fn2) => {
      clearTimeout(id);
      id = setTimeout(fn2, options.debounce);
    };
  } else if (options.atomic)
    queueOuterFn = (fn2) => fn2();
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
          last2 = taskRun(task);
          if (queued.length || options.throttle) {
            queueOuterFn(queueNext);
          }
          return;
        } else {
          task = queued.pop();
          taskGroup(task, queued.splice(0));
          last2 = taskRun(task);
          if (options.throttle) {
            queueOuterFn(queueNext);
            return;
          }
        }
      } else if (options.next) {
        task = queued.shift();
        taskGroup(task, queued.splice(0, queued.length - 1));
        queueOuterFn(queueNext);
        last2 = taskRun(task);
        return;
      } else {
        task = Task();
        taskGroup(task, queued.splice(0));
        task.resolve(last2);
      }
    }
    runs = false;
  }
  function queueWrap(...args) {
    const task = Task(queueFn, this, args);
    if (!runs && options.first) {
      runs = true;
      if (!queued.length) {
        last2 = taskRun(task);
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
var wrapEvent = (options = {}) => (fn2 = () => {
}) => wrapQueue(options)(options.prevent || options.stop || options.immediate || options.capture != null || options.once != null || options.passive != null ? Object.assign(function eventHandler(e) {
  if (options.prevent)
    e.preventDefault();
  if (options.stop) {
    options.immediate ? e.stopImmediatePropagation() : e.stopPropagation();
  }
  return fn2.call(this, e);
}, options) : fn2);
var event = toFluent(EventOptions, wrapEvent);

// ../../event-toolkit/dist/esm/helpers.js
function chain(first, ...rest) {
  if (Array.isArray(first)) {
    [first, ...rest] = first.flat().filter(Boolean);
    if (first == null)
      return;
  }
  rest = rest.filter(Boolean);
  return (...args) => {
    first?.(...args);
    for (const fn2 of rest)
      fn2(...args);
  };
}
var onAll = (target, listener, ...args) => {
  const targetOwnDispatch = target.dispatchEvent;
  const events = /* @__PURE__ */ new Set();
  target.dispatchEvent = function(event2) {
    if (!events.has(event2.type)) {
      target.addEventListener(event2.type, listener, ...args);
      events.add(event2.type);
    }
    return targetOwnDispatch.call(this, event2);
  };
  return () => {
    for (const eventType of events) {
      target.removeEventListener(eventType, listener, ...args);
    }
    events.clear();
    target.dispatchEvent = targetOwnDispatch;
  };
};

// ../../proxy-toolkit/dist/esm/proxy-toolkit.js
var Getter = (cb, target = {}) => new Proxy(target, {
  get: (_3, key) => cb(key)
});
var FluentCaptureSymbol = Symbol();
function FluentCapture(handler) {
  const fn2 = () => {
  };
  const results = Object.assign([], {
    origin: new Error()
  });
  const proxy = new Proxy(fn2, {
    get: (_3, key, receiver) => {
      if (key === FluentCaptureSymbol)
        return true;
      if (key === "_results")
        return results;
      if (key === "ops") {
        return results;
      }
      results.push([
        "get",
        key
      ]);
      return receiver;
    },
    apply: (_3, __, args) => {
      const op = [
        "apply",
        args
      ];
      results.push(op);
      const result = handler?.callMethod(results.at(-2)[1], args, results);
      if (result != null) {
        return result;
      }
      return proxy;
    }
  });
  return proxy;
}
var applyFluentCapture = (capture, target) => {
  let res = target;
  for (const [op, args] of capture) {
    if (op === "get") {
      res = res[args];
    } else if (op === "apply") {
      res = res(...args);
    }
  }
  return res;
};

// ../../event-toolkit/dist/esm/on.js
var OnOptions = class extends EventOptions {
  once = bool;
  passive = bool;
  capture = bool;
};
var onEvent = (el, type, listener, options) => {
  el.addEventListener(type, listener, options);
  return () => el.removeEventListener(type, listener, options);
};
var onEventFluent = (el, key) => toFluent(OnOptions, (options) => (listener = () => {
}) => onEvent(el, key, wrapEvent(options)(listener), options));
function on(el, key) {
  return key != null ? onEventFluent(el, key) : Getter((key2) => onEventFluent(el, key2));
}

// ../../minimal-reactive/dist/esm/minimal-reactive.js
var equals = (value, next1) => value != null && next1 != null && typeof value === "object" && "equals" in value ? value.equals(next1, value) : Object.is(next1, value);
function dep(value) {
  const d = {
    subs: /* @__PURE__ */ new Set(),
    get value() {
      return value;
    },
    set value(next) {
      if (!equals(value, next)) {
        if (effect.debug) {
          this.stackErr = new Error();
        }
        const prev = value;
        value = next;
        this.subs.forEach((fn2) => fn2(prev, next));
      }
    },
    get current() {
      return this.value;
    },
    set current(newValue) {
      this.value = newValue;
    },
    accessors: {
      get() {
        return value;
      },
      set(value2) {
        d.value = value2;
        return true;
      }
    },
    trigger() {
      this.subs.forEach((fn2) => fn2(value, value));
    }
  };
  return d;
}
function deps(obj) {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [
    key,
    dep(value)
  ]));
}
var count = 0;
var clearCountTimeout;
var clearCount = () => {
  count = 0;
};
var infiniteLoopGuard = () => {
  if (++count >= effect.maxUpdates) {
    console.warn(`Infinite loop detected (>${effect.maxUpdates} updates within ${effect.maxUpdatesWithinMs}ms)`);
    return true;
  } else {
    clearTimeout(clearCountTimeout);
    clearCountTimeout = setTimeout(clearCount, effect.maxUpdatesWithinMs);
  }
};
var effect = Object.assign(function effect2(deps2, fn2) {
  let prev;
  let stackErr;
  if (effect2.debug) {
    stackErr = new Error();
  }
  const values = () => Object.fromEntries(Object.entries(deps2).map(([key, dep2]) => [
    key,
    dep2.value
  ]));
  let dispose;
  const A = (next1) => {
    if (infiniteLoopGuard())
      return;
    if (Object.values(next1).every((value) => value != null)) {
      strategy = B;
      dispose = once(fn2(prev = next1));
    }
  };
  const B = (next1) => {
    if (infiniteLoopGuard())
      return;
    const entries2 = Object.entries(next1);
    const changed = entries2.filter(([key, value]) => !equals(prev[key], value));
    if (changed.length) {
      if (effect2.debug) {
        effect2.debug(changed, fn2, ...changed.map(([key]) => deps2[key].stackErr), stackErr);
      }
      if (entries2.some(([, value]) => value == null)) {
        dispose?.();
        strategy = A;
      } else {
        dispose?.(true);
        dispose = once(fn2(prev = next1));
      }
    }
  };
  let strategy = A;
  const callback = () => strategy(values());
  Object.values(deps2).forEach((dep2) => {
    dep2.subs.add(callback);
  });
  callback();
  return (reconnect = false, disconnect = true) => {
    Object.values(deps2).forEach((dep2) => {
      dep2.subs.delete(callback);
    });
    dispose?.(reconnect, disconnect);
  };
}, {
  maxUpdates: 2e3,
  maxUpdatesWithinMs: 10,
  debug: false
});

// ../../match-to-token/dist/esm/token.js
var Token = class extends String {
  static create(value, group, source) {
    return new Token(value, group, source);
  }
  group;
  get value() {
    return "" + this;
  }
  get index() {
    return this.source.index;
  }
  source;
  constructor(value, group, source) {
    super(typeof value === "object" ? value.value : value);
    if (typeof value === "object") {
      group = value.group;
      source = Object.assign(value.source.match, {
        index: value.source.index,
        input: value.source.input
      });
    }
    this.group = group;
    Object.defineProperty(this, "source", {
      enumerable: false,
      value: source
    });
  }
  toJSON() {
    return {
      value: this.value,
      group: this.group,
      source: {
        match: this.source.slice(),
        index: this.source.index,
        input: this.source.input
      }
    };
  }
  is(group, value) {
    return group == this.group && (value == null || value == this.value);
  }
  as(value, group = this.group) {
    return Token.create(value, group, this.source);
  }
};

// ../../match-to-token/dist/esm/util.js
var NonNull = (e) => e[1] != null;

// ../../match-to-token/dist/esm/index.js
var matchToToken = (match) => {
  if (!match)
    return null;
  if (match.index == null)
    return null;
  if (!match.groups)
    throw new TypeError("RegExp match is missing named groups such as: /(?<group>[a-z])/");
  const entry = Object.entries(match.groups).find(NonNull);
  if (entry)
    return Token.create(entry[1], entry[0], match);
  return null;
};
var RegExpToken = class extends RegExp {
  [Symbol.match](input) {
    const match = RegExp.prototype[Symbol.match].call(this, input);
    return matchToToken(match);
  }
  *[Symbol.matchAll](input) {
    const matches = RegExp.prototype[Symbol.matchAll].call(this, input);
    for (const match of matches)
      yield matchToToken(match);
  }
};

// ../../tokenizer-next/dist/esm/util.js
var joinRegExps = (regexps) => new RegExp(regexps.map((x) => x.toString()).map((x) => x.slice(x.indexOf("/") + 1, x.lastIndexOf("/"))).join("|"), "gi");

// ../../tokenizer-next/dist/esm/index.js
var createTokenizer = (...regexps) => {
  const regexp = joinRegExps(regexps);
  return (input) => {
    const matches = input.matchAll(regexp);
    const next = () => matchToToken(matches.next().value);
    const iterator = function* (token) {
      while (token = next())
        yield token;
    };
    Object.defineProperty(next, Symbol.iterator, {
      value: iterator
    });
    return next;
  };
};

// ../../nested-css/dist/esm/css-to-js.js
var extraWhitespace = /\s+/g;
var tokenizer = createTokenizer(/(?<open>\s*\{\s*)/, /(?<close>\s*\}\s*)/, /(?<comment>\/\*[^]*?\*\/)/, /\s*(?<rule>[^{;}/'"]+)\s+?(?={)/, /\s*(?<string>'.*?'|".*?")(?=;)/, /\s*(?<prop>[^:;/]+)(?=:)/, /\s*(?<value>[^:;]+)(?=;)/);
function cssToJs(input) {
  input = input.replace(extraWhitespace, " ");
  const nextToken = tokenizer(input);
  const filter3 = (ignored) => () => {
    let token;
    while (token = nextToken())
      if (!ignored.includes(token.group))
        break;
    return token;
  };
  const next = filter3([
    "comment"
  ]);
  const parse2 = (style2 = {}) => {
    let token;
    while (token = next()) {
      const { value, group } = token;
      switch (group) {
        case "rule":
          next();
          parse2(style2[value.trim()] ??= {});
          break;
        case "prop":
          style2[value.trim()] = next()?.value?.trim();
          break;
        case "close":
          return style2;
      }
    }
    return style2;
  };
  return parse2();
}

// ../../nested-css/dist/esm/util.js
function joinPartsWithValues(parts, values) {
  let str = "";
  for (let i = 0; i < parts.length; i++) {
    str += parts[i];
    str += values[i];
  }
  return str;
}
function kebabCase(s) {
  return s.replace(/[A-Z]/g, (m, i) => (i ? "-" : "") + m).toLowerCase();
}

// ../../nested-css/dist/esm/js-to-css.js
var mediaRule = (rule, media) => media ? `${media}{${rule}}` : rule;
var createRule = (target, prop2, value) => `${target}{${kebabCase(prop2)}:${value}}`;
var remap = (target, map) => [
  ...target.matchAll(/[\w-]+|./g)
].flat().map((x) => map?.get(x) ?? x).join("");
function jsToCss(rules, rootSelector, aliasMap) {
  rootSelector ??= "";
  let css3 = "";
  const parse2 = (rules2, child = "", media = "") => {
    for (const key in rules2) {
      const value = rules2[key];
      if (typeof value === "object") {
        const isMedia = /^@/.test(key) ? key : null;
        const isPct = /%$/.test(key);
        let target = child;
        if (isPct)
          target = key;
        else if (!isMedia) {
          target = key.split(",").map((k) => k.trim()).map((k) => child.split(",").map((x) => (x + (/^&/.test(k) ? k.slice(1) : " " + k)).trim()).join(",")).map((k) => k.trim()).join(",");
        }
        parse2(value, target, isMedia || media);
      } else {
        const rule = mediaRule(createRule(child ? remap(child, aliasMap) : rootSelector, key, value), media);
        css3 += "\n" + rule.trim();
      }
    }
  };
  parse2({
    [rootSelector]: rules
  });
  return css3.trim();
}

// ../../nested-css/dist/esm/index.js
function css(parts, ...values) {
  const nestedCssString = joinPartsWithValues(parts, values);
  const nestedCssObject = cssToJs(nestedCssString);
  function compileCss(rootSelector = ":host", aliasMap) {
    return jsToCss(nestedCssObject, rootSelector, aliasMap);
  }
  compileCss.valueOf = compileCss;
  return compileCss;
}

// ../../minimal-view/dist/esm/jsx-runtime.js
var jsx_runtime_exports2 = {};
__export(jsx_runtime_exports2, {
  Fragment: () => Fragment,
  createHook: () => createHook,
  createProps: () => createProps,
  hook: () => hook,
  html: () => html,
  jsx: () => jsx,
  jsxs: () => jsxs,
  render: () => render,
  renderCache: () => renderCache,
  svg: () => svg,
  updateProps: () => updateProps
});

// ../../html-vdom/dist/esm/jsx-runtime.js
var jsx_runtime_exports = {};
__export(jsx_runtime_exports, {
  Fragment: () => Fragment,
  createHook: () => createHook,
  createProps: () => createProps,
  hook: () => hook,
  html: () => html,
  jsx: () => jsx,
  jsxs: () => jsxs,
  render: () => render,
  renderCache: () => renderCache,
  svg: () => svg,
  updateProps: () => updateProps
});

// ../../html-jsx/dist/esm/index.js
var esm_exports2 = {};
__reExport(esm_exports2, __toESM(require_types(), 1));

// ../../html-vdom/dist/esm/jsx-runtime.js
__reExport(jsx_runtime_exports, esm_exports2);

// ../../html-vdom/dist/esm/props.js
var isEvent = (name) => name.charAt(0) === "o" && name.charAt(1) === "n" && !name.endsWith("ref");
var toEvent = (name) => name.slice(2);
var createProp = (doc = html, el, _type, name, value, attrs) => {
  switch (name) {
    case "children":
      return;
    case "style":
      value = value?.valueOf();
      if (typeof value === "object")
        value = styleToCss(value);
      if (value) {
        el.setAttribute("style", value);
        attrs.style = el.getAttributeNode("style");
      }
      return;
  }
  const attr2 = name;
  value = value?.valueOf();
  switch (typeof value) {
    case "string":
    case "number":
      if (doc === svg || !(name in el)) {
        el.setAttribute(attr2, value);
        attrs[attr2] = el.getAttributeNode(attr2);
        return;
      }
      break;
    case "function":
      if (isEvent(attr2)) {
        el.addEventListener(toEvent(attr2), value, value);
      } else {
        el.setAttribute(attr2, "");
        attrs[attr2] = el.getAttributeNode(attr2);
        el[name] = value;
      }
      return;
  }
  if (value == null) {
    el.removeAttribute(attr2);
    delete attrs[attr2];
    if (el[name] != null) {
      delete el[name];
    }
    return;
  }
  el[name] = value === "false" ? false : value;
  if (el.hasAttribute(attr2))
    attrs[attr2] = el.getAttributeNode(attr2);
};
var propCache = /* @__PURE__ */ new WeakMap();
var createProps = (doc, el, type, props17 = {}, attrs = {}, cacheRef = el) => {
  for (const name in props17)
    createProp(doc, el, type, name, props17[name], attrs);
  propCache.set(cacheRef, {
    props: props17,
    attrs
  });
};
var updateProps = (doc, el, type, next = {}, cacheRef = el) => {
  if (!propCache.has(cacheRef))
    return next && createProps(doc, el, type, next, void 0, cacheRef);
  const c = propCache.get(cacheRef);
  const { attrs, props: props17 } = c;
  if (!next) {
    for (const name in attrs) {
      el.removeAttributeNode(attrs[name]);
    }
    for (const name1 in props17) {
      if (isEvent(name1)) {
        el.removeEventListener(toEvent(name1), props17[name1], props17[name1]);
      } else {
        delete el[name1];
      }
    }
    propCache.delete(cacheRef);
    return;
  }
  let prev;
  let value;
  out:
    for (const name2 in props17) {
      if (!(name2 in next)) {
        delete el[name2];
        continue;
      }
      value = next[name2];
      switch (name2) {
        case "children":
          continue out;
      }
      value = value?.valueOf();
      prev = props17[name2];
      if (prev !== value) {
        if (typeof value === "function") {
          if (prev?.fn && value?.fn) {
            value = prev.update(value.fn, value.options);
            if (value === prev) {
              next[name2] = value;
            }
          }
          if (prev !== value || cacheRef !== el) {
            let attr2 = name2;
            if (isEvent(attr2)) {
              attr2 = toEvent(attr2);
              el.removeEventListener(attr2, prev, prev);
              el.addEventListener(attr2, value, value);
            } else {
              props17[attr2] = el[attr2] = value;
            }
          }
        } else if (!(name2 in attrs)) {
          if (value == null) {
            if (el[name2] != null) {
              el[name2] = value;
            }
          } else {
            el[name2] = value === "false" ? false : value;
          }
        }
      }
    }
  for (const name3 in attrs) {
    if (!(name3 in next) || next[name3] === false || next[name3] == null) {
      el.removeAttribute(name3);
      delete attrs[name3];
      continue;
    }
    value = next[name3]?.valueOf();
    switch (name3) {
      case "style":
        if (typeof value === "object")
          value = styleToCss(value);
        break;
    }
    if (props17[name3] !== value && typeof value !== "function") {
      if (value == null) {
        if (attrs[name3].value != null) {
          el.removeAttribute(name3);
          delete attrs[name3];
        }
      } else {
        attrs[name3].value = value;
      }
    }
  }
  for (const name4 in next) {
    if (!(name4 in attrs) && !(name4 in props17))
      createProp(doc, el, type, name4, next[name4], attrs);
  }
  c.props = next;
};

// ../../html-vdom/dist/esm/jsx-runtime.js
var Fragment = Symbol();
var jsx = (kind, props17, key) => kind === Fragment ? props17.children : {
  kind,
  props: props17,
  key
};
var jsxs = jsx;
var hook;
var createHook = () => bindAll(new esm_exports.EventEmitter(), function current(fn2 = current.fn) {
  const prev = hook;
  hook = current;
  hook.fn = fn2;
  hook.onstart?.();
  hook.emit("start");
  fn2();
  hook.onend?.();
  hook.emit("end");
  hook = prev;
});
var Chunk = class Chunk2 extends Array {
  firstChild;
  dom = [];
  get last() {
    return this.dom.at(-1);
  }
  get nextSibling() {
    return this.last?.nextSibling;
  }
  appendChild(x) {
    this.push(x);
  }
  after(x) {
    this.last?.after(x);
  }
  save() {
    this.dom = [
      ...this
    ];
  }
  remove() {
    this.dom.forEach((el) => {
      el.onunref?.();
      el.remove();
    });
    this.splice(0);
  }
  removeChild(x) {
    const i = this.indexOf(x);
    ~i && this.splice(i, 1);
  }
};
var { TEXT_NODE, COMMENT_NODE } = document;
var html = document.createElement.bind(document);
var svg = document.createElementNS.bind(document, "http://www.w3.org/2000/svg");
var forceArray = (x, withNull) => Array.isArray(x) ? withNull && !x.length ? [
  null
] : x : x == null && !withNull ? [] : [
  x
];
var flatDom = (arr, res = []) => {
  for (const el of arr) {
    if (el.dom)
      res.push(...flatDom(el.dom));
    else
      res.push(el);
  }
  return res;
};
var renderCache = /* @__PURE__ */ new WeakMap();
function render(n, el = document.createDocumentFragment(), doc = html, withNull = false) {
  reconcile(el, forceArray(n, withNull), renderCache.get(el), doc);
  return el;
}
var reconcile = (parent, nk, pk, doc) => {
  if (pk?.running) {
    console.warn("attempt to reconcile lane which is reconciling");
    return;
  }
  if (pk === nk)
    nk = [
      ...nk
    ];
  nk.running = true;
  renderCache.set(parent, nk);
  for (const [i, n] of nk.entries()) {
    nk[i] = n?.valueOf?.();
  }
  nk.dom = Array(nk.length);
  nk.keyed = /* @__PURE__ */ new Map();
  nk.mapped = /* @__PURE__ */ new Map();
  if (Array.isArray(pk)) {
    const keep = /* @__PURE__ */ new Set();
    for (let i1 = 0, n1, el, p, pel, k, pi2; i1 < nk.length; i1++) {
      n1 = nk[pi2 = i1];
      k = n1?.key ?? n1?.ref?.key;
      if (k != null) {
        nk.keyed.set(k, i1);
        pi2 = pk.keyed.get(k) ?? -1;
      }
      p = pk[pi2];
      pel = pk.dom[pi2];
      nk.dom[i1] = el = create(doc, n1, p, pel);
      nk.mapped.set(el, n1);
      if (el === pel)
        keep.add(pel);
    }
    for (const pel1 of pk.dom) {
      if (!keep.has(pel1)) {
        pel1.onunref?.();
        pel1.remove();
        const hook2 = pk.mapped.get(pel1)?.hook;
        hook2?.onremove?.();
        hook2?.emit("remove");
      }
    }
  } else {
    for (let i2 = 0, n2, el1, k1; i2 < nk.length; i2++) {
      n2 = nk[i2];
      k1 = n2?.key ?? n2?.ref?.key;
      if (k1 != null)
        nk.keyed.set(k1, i2);
      nk.dom[i2] = el1 = create(doc, n2);
      nk.mapped.set(el1, n2);
    }
  }
  nk.flatDom = flatDom(nk.dom);
  if (pk?.flatDom)
    diff(parent, nk.flatDom, pk.flatDom);
  else
    nk.flatDom.forEach((el) => parent.appendChild(el));
  nk.running = false;
};
var mount = (el) => {
  if (el?.ref && el !== el.ref.current) {
    queueMicrotask(() => {
      if (el.isConnected) {
        el.ref.current = el;
      }
    });
  }
  if (el?.onref) {
    queueMicrotask(() => {
      if (el.isConnected) {
        el.onunref = el.onref(el);
      }
    });
  }
  return el;
};
var diff = (parent, n, p, i = 0, len = n.length, el, last2) => {
  if (parent instanceof Chunk) {
    for (; i < len; i++) {
      el = n[i];
      if (i < parent.length) {
        if (p[i] === el)
          continue;
        parent[i] = el;
      } else {
        parent.push(el);
      }
    }
    let d = parent.length - len;
    while (d--)
      parent.pop();
  } else {
    for (; i < len; i++) {
      el = n[i];
      if (p[i] === el)
        last2 = el;
      else if (!i)
        parent.insertBefore(last2 = el, parent.firstChild);
      else
        last2.after(last2 = el);
    }
  }
};
var create = (doc, n, p, pel) => {
  let el;
  switch (typeof n) {
    case "string":
    case "number":
      if (pel?.nodeType === TEXT_NODE) {
        if (p != n)
          pel.nodeValue = n;
        return pel;
      }
      el = new Text(n);
      return el;
    case "object":
      if (!n)
        break;
      if (Array.isArray(n)) {
        if (pel && Array.isArray(p))
          el = pel;
        else
          el = new Chunk();
        if (!n.length)
          n.push(null);
        reconcile(el, n, p, doc);
        el.save();
      } else if (typeof n.kind === "string") {
        if (n.kind === "svg")
          doc = svg;
        if (n.props.ref?.current && n.props.ref.current.tagName.toLowerCase() === n.kind && (el = n.props.ref.current) || pel && p?.kind === n.kind && (el = pel)) {
          el.onprops?.(n.props);
          updateProps(doc, el, n.kind, n.props);
        } else {
          el = doc(n.kind, "is" in n.props ? {
            is: n.props.is
          } : void 0);
          el.onprops?.(n.props);
          createProps(doc, el, n.kind, n.props);
        }
        if (n.kind === "foreignObject")
          doc = html;
        if (!n.kind.includes("-"))
          render(n.props.children, el, doc);
        mount(el);
      } else {
        let initial = true;
        if (!((el = pel) && (n.hook = p?.hook))) {
          el = new Chunk();
          n.hook = createHook();
        }
        const anchor = new Comment();
        let prevDom;
        let nextDom;
        n.hook(() => {
          let next;
          if (!initial && !(next = el.nextSibling))
            el.after(next = anchor);
          if (typeof n.kind !== "function") {
            console.warn("Hook called but node is not a function component.");
            console.warn(n);
            return;
          }
          render(n.kind(n.props), el, doc, true);
          el.save();
          if (!initial && next) {
            nextDom = flatDom(el);
            if (prevDom?.length > 0) {
              for (let i = 0, last2, e; i < nextDom.length; i++) {
                e = nextDom[i];
                if (last2) {
                  last2.after(last2 = e);
                } else if (prevDom[i] !== e) {
                  next.before(last2 = e);
                } else {
                  last2 = last2 && e;
                }
              }
            } else {
              for (const e1 of nextDom)
                next.before(e1);
            }
            prevDom = nextDom;
            next === anchor && next.remove();
          } else {
            prevDom = flatDom(el);
            initial = false;
          }
        });
      }
      return el;
  }
  if (pel?.nodeType === COMMENT_NODE)
    return pel;
  el = new Comment();
  return el;
};

// ../../minimal-view/dist/esm/jsx-runtime.js
__reExport(jsx_runtime_exports2, jsx_runtime_exports);

// ../../minimal-view/dist/esm/lane.js
function laneFnRun(fn2) {
  fn2();
}
var Lane = class {
  effects = /* @__PURE__ */ new Set();
  get size() {
    return this.effects.size;
  }
  laneRun() {
    if (this.complete) {
      throw new Error("Lane has already completed.");
    }
    if (this.effects.size) {
      this.effects.forEach(laneFnRun);
    }
    this.complete = true;
    this.effects = void 0;
  }
};

// ../../minimal-view/dist/esm/fiber.js
var Fiber = class extends esm_exports.EventEmitter {
  #lane = new Lane();
  #lanes = /* @__PURE__ */ new Map();
  #running = false;
  #runLanes = async () => {
    this.emit("flushstart");
    try {
      let count2 = 0;
      while (this.#lane.size) {
        if (++count2 > 10) {
          this.emit("error", new Error("Possible infinite loop while flushing."));
          return;
        }
        this.#lanes.clear();
        const lane = this.#lane;
        this.#lane = new Lane();
        lane.laneRun();
        await Promise.resolve();
      }
    } finally {
      this.#running = false;
      this.emit("flushend");
    }
  };
  get(obj) {
    let lane = this.#lanes.get(obj);
    if (!lane) {
      this.#lanes.set(obj, lane = this.#lane);
      if (!this.#running) {
        this.#running = true;
        queueMicrotask(this.#runLanes);
      }
    }
    return lane;
  }
};

// ../../argtor/dist/esm/argtor.js
function argsOf(fn2) {
  const source = fn2.toString();
  let x = source;
  const d = x.indexOf("{") + 1;
  if (!d || x.slice(0, d).includes(")"))
    return {
      keys: [],
      source
    };
  x = x.slice(d);
  let match;
  do {
    match = false;
    x = x.replace(/`((\\`)?[^`])+?`|'((\\')?[^'])+?'|"((\\")?[^"])+?"|\([^{[(]*?\)|\{[^{[(]*?\}|\[[^{[(]*?\]/g, () => {
      match = true;
      return "";
    });
  } while (match);
  return {
    keys: x.split("}")[0].split(",").map((x2) => x2.split(/[^\w\s$]+/g)[0].trim()),
    source
  };
}
function argtor(fn2, keys2 = /* @__PURE__ */ new Set()) {
  const args = argsOf(fn2?.fn ?? fn2);
  args.keys.forEach((x) => !x || keys2.add(x));
  return Object.assign([
    ...keys2
  ], {
    source: args.source
  });
}

// ../../minimal-view/dist/esm/state.js
var EffectOptions = class extends QueueOptions {
  keys;
};
var State = class {
  id;
  $;
  deps;
  #fxs;
  abort;
  constructor(fiber2, props17 = {}, local17 = class {
  }) {
    this.fiber = fiber2;
    this.props = props17;
    this.local = local17;
    this.id = cheapRandomId();
    this.$ = {};
    this.#fxs = [];
    this.abort = abort;
    this.fn = toFluent(EffectOptions, (options) => (fn2) => {
      const keys2 = argtor(fn2);
      let inner;
      function stateFn(...args) {
        return inner?.apply(this, args);
      }
      const outer = wrapQueue(options)(stateFn);
      this.fx.keys(keys2)((props18) => {
        inner = fn2(props18);
      });
      return outer;
    });
    this.fx = toFluent(EffectOptions, (options) => (fn2) => {
      const keys2 = options.keys ?? argtor(fn2);
      const missing = keys2.filter((key) => !(key in this.deps));
      if (missing.length) {
        throw new TypeError(`Missing dependencies: ${missing}
${keys2.source}`);
      }
      const deps2 = pick2(this.deps, keys2);
      let dispose;
      const qfn = wrapQueue({
        ...options,
        hooks: {
          before: () => {
            dispose?.();
          }
        }
      })(fn2);
      let last2;
      const fx2 = Object.assign((props18) => {
        let disposed = false;
        this.#lane.effects.add(function laneFn() {
          if (disposed)
            return;
          const res = qfn(props18);
          if (res instanceof Promise) {
            res.then((_dispose) => {
              if (last2 === _dispose)
                return;
              last2 = _dispose;
              if (disposed)
                _dispose?.();
              else
                dispose = _dispose;
            });
          } else {
            dispose = res;
          }
        });
        return (reconnect, disconnect) => {
          disposed = true;
          if (!reconnect && !disconnect) {
            dispose?.();
          }
        };
      }, {
        source: keys2.source
      });
      const off = once(chain(effect(deps2, fx2), () => {
        dispose?.();
      }));
      this.#fxs.push(off);
      return off;
    });
    this.deps = deps(Object.assign({
      $: this.$
    }, new this.local(this), this.props));
    accessors(this.$, this.deps, (_3, dep2) => dep2.accessors);
  }
  get size() {
    return this.#fxs.length;
  }
  get #lane() {
    return this.fiber.get(this);
  }
  get refs() {
    return this.deps;
  }
  fn;
  fx;
  dispose() {
    chain(this.#fxs.splice(0))();
  }
  fiber;
  props;
  local;
};

// ../../minimal-view/dist/esm/custom-elements.js
if (!customElements.getName) {
  const tags = /* @__PURE__ */ new WeakMap();
  const { define: define2 } = customElements;
  customElements.define = function(name, ctor, options) {
    tags.set(ctor, name);
    return define2.call(customElements, name, ctor, options);
  };
  customElements.getName = function(ctor) {
    return tags.get(ctor);
  };
}
var monotonicId = 0;
function getTag(name) {
  let tag = kebab(name.replace(/[^a-z0-9]/ig, "")).replace("-element", "");
  if (!tag.includes("-"))
    tag = `x-${tag}`;
  while (customElements.get(tag) != null) {
    tag += (++monotonicId).toString(36);
  }
  return tag;
}

// ../../minimal-view/dist/esm/web.js
var element;
var Classes = [];
function web(name, fn2, options, parent = HTMLElement) {
  const tag = getTag(name);
  const Web = (props17) => jsx(tag, props17, void 0);
  Web.Fn = fn2;
  Web.toString = () => tag;
  let ctor = class ctor extends parent {
    static Web = Web;
    static Fn = fn2;
    onprops(props17) {
      element = this;
      render(jsx(fn2, props17, void 0), this.shadowRoot ?? this.attachShadow({
        mode: "open"
      }));
    }
    disconnectedCallback() {
      queueMicrotask(() => {
        if (!this.isConnected && this.shadowRoot) {
          render(null, this.shadowRoot);
        }
      });
    }
  };
  Web.Element = ctor;
  Object.defineProperty(ctor, "name", {
    value: tag
  });
  customElements.define(tag, ctor, options);
  Classes.push(ctor);
  return ctor.Web;
}

// ../../html-vdom/dist/esm/index.js
var esm_exports3 = {};
__export(esm_exports3, {
  Fragment: () => Fragment,
  createHook: () => createHook,
  createProps: () => createProps,
  hook: () => hook,
  html: () => html,
  jsx: () => jsx,
  jsxs: () => jsxs,
  render: () => render,
  renderCache: () => renderCache,
  svg: () => svg,
  updateProps: () => updateProps
});
__reExport(esm_exports3, jsx_runtime_exports);

// ../../minimal-view/dist/esm/minimal-view.js
var fiber = new Fiber();
var states = new WeakMapFactory(State);
function view(defaultProps, local17, fn2) {
  const isClass = local17?.toString().startsWith("class");
  if (!isClass) {
    fn2 = local17;
    local17 = class {
    };
  }
  return function(props17) {
    hook.state ??= (() => {
      const state = new State(fiber, {
        __style: "",
        view: "",
        css: "",
        ...new defaultProps(),
        ...props17
      }, local17);
      const self2 = hook;
      const update = queue.raf(hook);
      state.fx.task(({ css: css3 }) => {
        state.$.__style = jsx("style", {
          children: css`${css3}`()
        }, void 0);
        update();
      });
      state.fx.task(({ view: _3 }) => {
        update();
      });
      hook.once("remove", () => {
        self2.__dispose?.(state.$);
        state.dispose();
      });
      return state;
    })();
    hook.__dispose ??= fn2(hook.state) ?? (() => {
    });
    Object.assign(hook.state.$, props17);
    return [
      hook.state.$.__style,
      hook.state.$.view
    ];
  };
}

// ../../geometrik/dist/esm/core.js
var Intersect;
(function(Intersect2) {
  Intersect2[Intersect2["None"] = 0] = "None";
  Intersect2[Intersect2["Left"] = 1] = "Left";
  Intersect2[Intersect2["Top"] = 2] = "Top";
  Intersect2[Intersect2["Right"] = 4] = "Right";
  Intersect2[Intersect2["Bottom"] = 8] = "Bottom";
  Intersect2[Intersect2["Inside"] = 16] = "Inside";
})(Intersect || (Intersect = {}));

// ../../geometrik/dist/esm/shape.js
var Shape = class {
  x;
  y;
  get left() {
    return this.x;
  }
  set left(x) {
    this.x = x;
  }
  get top() {
    return this.y;
  }
  set top(y) {
    this.y = y;
  }
  get bottom() {
    return this.y;
  }
  set bottom(y) {
    this.y = y;
  }
  get right() {
    return this.x;
  }
  set right(x) {
    this.x = x;
  }
  setLeft(x) {
    this.x = x;
    return this;
  }
  setTop(y) {
    this.y = y;
    return this;
  }
  clone() {
    const ctor = this.constructor;
    return new ctor(this);
  }
  toJSON() {
    return this;
  }
  draw(color = "red", position = "absolute") {
    const div = document.createElement("div");
    Object.assign(div.style, {
      position,
      boxSizing: "border-box",
      border: "1px solid " + color,
      ...this.toStyle(),
      zIndex: 1e3
    });
    document.body.appendChild(div);
    return div;
  }
  screen(other = this) {
    return this.clone().screenSelf(other);
  }
  screenSelf(other = this) {
    return this.translateSelf(other.negate());
  }
  negate() {
    return this.clone().negateSelf();
  }
  negateSelf() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }
  contain(other) {
    return this.clone().containSelf(other);
  }
  containSelf(other) {
    if (this.top < other.top)
      this.top = other.top;
    else if (this.bottom > other.bottom)
      this.bottom = other.bottom;
    if (this.right > other.right)
      this.right = other.right;
    else if (this.left < other.left)
      this.left = other.left;
    return this;
  }
  scale(x = 0, y = x) {
    return this.clone().scaleSelf(x, y);
  }
  scaleSelf(x = 0, y = x) {
    if (typeof x === "object") {
      this.width *= x.width;
      this.height *= x.height;
    } else {
      this.width *= x;
      this.height *= y;
    }
    return this;
  }
  scaleLinear(x = 0, y = x) {
    return this.clone().scaleLinearSelf(x, y);
  }
  scaleLinearSelf(x = 0, y = x) {
    if (typeof x === "object") {
      this.width += x.width;
      this.height += x.height;
    } else {
      this.width += x;
      this.height += y;
    }
    return this;
  }
  zoomLinear(x = 0, y = x) {
    return this.clone().zoomLinearSelf(x, y);
  }
  zoomLinearSelf(x = 0, y = x) {
    if (x instanceof Shape) {
      this.scaleLinearSelf(x).translateSelf(x.scale(-0.5));
    } else {
      this.scaleLinearSelf(x, y).translateSelf(x * -0.5, y * -0.5);
    }
    return this;
  }
  add(x = 0, y = x) {
    return this.translate(x, y);
  }
  addSelf(x = 0, y = x) {
    return this.translateSelf(x, y);
  }
  sub(x = 0, y = x) {
    return this.clone().subSelf(x, y);
  }
  subSelf(x = 0, y = x) {
    if (typeof x === "object") {
      return this.translateSelf(x.negate());
    } else {
      return this.translateSelf(-x, -y);
    }
  }
  translate(x = 0, y = x) {
    return this.clone().translateSelf(x, y);
  }
  translateSelf(x = 0, y = x) {
    if (typeof x === "object") {
      this.x += x.x || 0;
      this.y += x.y || 0;
    } else {
      this.x += x;
      this.y += y;
    }
    return this;
  }
  touchPoint(other, center = this.center ?? this) {
    const self2 = this instanceof Rect ? this : new Point(1, 1);
    const i = this.intersectPoint(other, center).translateSelf(other.center);
    const x = i.x - self2.width * 0.5;
    const y = i.y - self2.height * 0.5;
    return new Point(x, y);
  }
  intersectPoint(other, center = this.center ?? this) {
    const self2 = this instanceof Rect ? this : new Point(1, 1);
    const w = (self2.width + other.width) * 0.5;
    const h = (self2.height + other.height) * 0.5;
    const d = center.screen(other.center);
    const tan_phi = h / w;
    const tan_theta = Math.abs(d.y / d.x);
    const qx = Math.sign(d.x);
    const qy = Math.sign(d.y);
    let xI, yI;
    if (tan_theta > tan_phi) {
      xI = h / tan_theta * qx;
      yI = h * qy;
    } else {
      xI = w * qx;
      yI = w * tan_theta * qy;
    }
    return new Point(xI, yI);
  }
  toStylePosition() {
    return {
      left: this.x + "px",
      top: this.y + "px"
    };
  }
  toStylePositionPct() {
    return {
      left: this.x * 100 + "%",
      top: this.y * 100 + "%"
    };
  }
  toStyleSize() {
    return {
      width: this.width + "px",
      height: this.height + "px"
    };
  }
  toStyleSizePct() {
    return {
      width: this.width * 100 + "%",
      height: this.height * 100 + "%"
    };
  }
  toStyle() {
    return {
      ...this.toStylePosition(),
      ...this.toStyleSize()
    };
  }
  toStylePct() {
    return {
      ...this.toStylePositionPct(),
      ...this.toStyleSizePct()
    };
  }
  toCSSStyle() {
    return Object.entries(this.toStyle()).map(([key, value]) => `${key}: ${value};`).join("\n");
  }
  toPositionObject() {
    return {
      x: this.x,
      y: this.y
    };
  }
  toSizeObject() {
    return {
      width: this.width,
      height: this.height
    };
  }
};

// ../../geometrik/dist/esm/rect.js
var _stale, _leftLine, _topLine, _rightLine, _bottomLine;
var _Rect = class extends Shape {
  constructor(x = 0, y = x, width = x, height = y) {
    super();
    __publicField(this, "x");
    __publicField(this, "y");
    __publicField(this, "width");
    __publicField(this, "height");
    __privateAdd(this, _stale, true);
    __privateAdd(this, _leftLine, void 0);
    __privateAdd(this, _topLine, void 0);
    __privateAdd(this, _rightLine, void 0);
    __privateAdd(this, _bottomLine, void 0);
    if (typeof x === "object")
      Object.assign(this, _Rect.fromObject(x.toJSON ? x.toJSON() : x));
    else {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  }
  static fromElement(el) {
    return el.rect ? el.rect.clone() : new _Rect(+(el.dataset.x ?? el.offsetLeft), +(el.dataset.y ?? el.offsetTop), +(el.dataset.width ?? el.offsetWidth), +(el.dataset.height ?? el.offsetHeight));
  }
  static fromObject(obj) {
    return new _Rect(obj.x ?? obj.width, obj.y ?? obj.height, obj.width ?? 0, obj.height ?? 0);
  }
  static fromPoints(topLeft, bottomRight) {
    return new _Rect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
  }
  static fromUnsortedPoints(p1, p2) {
    const topLeft = new Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y));
    const bottomRight = new Point(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y));
    return new _Rect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
  }
  static combine(rects) {
    const x = Math.min(...rects.map((b) => b.x));
    const y = Math.min(...rects.map((b) => b.y));
    return new _Rect(x, y, Math.max(...rects.map((b) => b.right)) - x, Math.max(...rects.map((b) => b.bottom)) - y);
  }
  static compare(a, b) {
    return a?.equals(b) ?? false;
  }
  [Symbol.iterator]() {
    return [
      this.x,
      this.y,
      this.width,
      this.height
    ][Symbol.iterator]();
  }
  toJSON() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
  toSVGPath() {
    return `M ${this.x} ${this.y} h ${this.width} v ${this.height} h ${-this.width} v ${-this.height}`;
  }
  toString() {
    return `${this.x} ${this.y} ${this.width} ${this.height}`;
  }
  draw(color = "red", position = "absolute") {
    const div = document.createElement("div");
    Object.assign(div.style, {
      position,
      pointerEvents: "none",
      boxSizing: "border-box",
      border: "1px solid " + color,
      ...this.toStyle(),
      zIndex: 1e3
    });
    document.body.appendChild(div);
    return div;
  }
  set(other) {
    this.x = other.x;
    this.y = other.y;
    this.width = other.width;
    this.height = other.height;
    __privateSet(this, _stale, true);
    return this;
  }
  setWidth(width) {
    this.width = width;
    return this;
  }
  setHeight(height) {
    this.height = height;
    return this;
  }
  setPosition(other) {
    this.x = other.x;
    this.y = other.y;
    __privateSet(this, _stale, true);
    return this;
  }
  setSize(other) {
    this.width = other.width;
    this.height = other.height;
    __privateSet(this, _stale, true);
    return this;
  }
  get points() {
    return [
      new Point(this.x, this.y),
      new Point(this.right, this.y),
      new Point(this.right, this.bottom),
      new Point(this.x, this.bottom)
    ];
  }
  get pos() {
    return new Point(this.x, this.y);
  }
  get position() {
    return this.pos;
  }
  get size() {
    return new Point(this.width, this.height);
  }
  get center() {
    return new Point(this.x + this.width * 0.5, this.y + this.height * 0.5);
  }
  get topLeft() {
    return this.pos;
  }
  get topRight() {
    return new Point(this.right, this.top);
  }
  get bottomLeft() {
    return new Point(this.x, this.bottom);
  }
  get bottomRight() {
    return this.pos.translate(this.size);
  }
  get right() {
    return this.x + this.width;
  }
  set right(x) {
    this.x = x - this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  set bottom(y) {
    this.y = y - this.height;
  }
  maybeCalculateLines() {
    if (!__privateGet(this, _stale))
      return;
    __privateSet(this, _leftLine, new Line(this.topLeft, this.bottomLeft));
    __privateSet(this, _topLine, new Line(this.topLeft, this.topRight));
    __privateSet(this, _rightLine, new Line(this.topRight, this.bottomRight));
    __privateSet(this, _bottomLine, new Line(this.bottomLeft, this.bottomRight));
    __privateSet(this, _stale, false);
  }
  get leftLine() {
    this.maybeCalculateLines();
    return __privateGet(this, _leftLine);
  }
  get topLine() {
    this.maybeCalculateLines();
    return __privateGet(this, _topLine);
  }
  get rightLine() {
    this.maybeCalculateLines();
    return __privateGet(this, _rightLine);
  }
  get bottomLine() {
    this.maybeCalculateLines();
    return __privateGet(this, _bottomLine);
  }
  interpolate(other, t2) {
    return this.clone().interpolateSelf(other, t2);
  }
  interpolateSelf(other, t2) {
    this.x = this.x + (other.x - this.x) * t2;
    this.y = this.y + (other.y - this.y) * t2;
    this.width = this.width + (other.width - this.width) * t2;
    this.height = this.height + (other.height - this.height) * t2;
    return this;
  }
  round() {
    return this.clone().roundSelf();
  }
  roundSelf() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
    __privateSet(this, _stale, true);
    return this;
  }
  multiply(x = 0, y = x, w = x, h = y) {
    return this.clone().multiplySelf(x, y, w, h);
  }
  multiplySelf(x = 0, y = x, w = x, h = y) {
    if (x instanceof Shape) {
      this.x *= x.x;
      this.y *= x.y;
      this.width *= x.width;
      this.height *= x.height;
    } else {
      this.x *= x;
      this.y *= y;
      this.width *= w;
      this.height *= h;
    }
    __privateSet(this, _stale, true);
    return this;
  }
  transform(matrix) {
    return this.clone().transformSelf(matrix);
  }
  transformSelf(matrix) {
    const { x, y, width, height } = this;
    const { a, b, c, d, e, f } = matrix;
    this.x = a * x + c * y + e;
    this.y = b * x + d * y + f;
    this.width = a * width + c * height;
    this.height = b * width + d * height;
    __privateSet(this, _stale, true);
    return this;
  }
  normalize(other) {
    return this.clone().normalizeSelf(other);
  }
  normalizeSelf(other) {
    if (other instanceof DOMMatrix) {
      this.transformSelf(other.inverse());
    } else {
      this.x -= other.left;
      this.y -= other.top;
      this.x /= other.width;
      this.y /= other.height;
      this.width /= other.width;
      this.height /= other.height;
    }
    __privateSet(this, _stale, true);
    return this;
  }
  equals(other) {
    return this.x === other.x && this.y === other.y && this.width === other.width && this.height === other.height;
  }
  intersectionRect(other) {
    return (this.bottom - 0.75 >= other.top ? Intersect.Top : 0) + (this.top + 0.75 <= other.bottom ? Intersect.Bottom : 0) + (this.right - 0.75 >= other.left ? Intersect.Left : 0) + (this.left + 0.75 <= other.right ? Intersect.Right : 0);
  }
  intersectsRect(other) {
    return !(this.bottom - 0.75 < other.top || this.top + 0.75 > other.bottom || this.right - 0.75 < other.left || this.left + 0.75 > other.right);
  }
  withinRect(other) {
    return this.left >= other.left && this.right <= other.right && this.top >= other.top && this.bottom <= other.bottom;
  }
  distanceRect(other) {
    let dx = 0;
    let dy = 0;
    if (this.right < other.left) {
      dx = other.left - this.right;
    } else if (this.left > other.right) {
      dx = this.left - other.right;
    } else {
      dx = Math.abs(this.center.x - other.center.x);
    }
    if (this.bottom < other.top) {
      dy = other.top - this.bottom;
    } else if (this.top > other.bottom) {
      dy = this.top - other.bottom;
    } else {
      dy = Math.abs(this.center.y - other.center.y);
    }
    return new Point(dx, dy);
  }
  collisionResponse(other) {
    return this.intersectPoint(other).addSelf(other.center).subSelf(this.center);
  }
  place(other, placement) {
    return this.clone().placeSelf(other, placement);
  }
  placeSelf(other, placement) {
    if (placement.includes("n"))
      this.y = other.top - this.height;
    else if (placement.includes("s"))
      this.y = other.bottom;
    else
      this.y = other.center.y - this.height * 0.5;
    if (placement.includes("w"))
      this.x = other.left - this.width;
    else if (placement.includes("e"))
      this.x = other.right;
    else
      this.x = other.center.x - this.width * 0.5;
    if (placement.includes("r")) {
      this.x += this.width;
    }
    if (placement.includes("l")) {
      this.x -= this.width;
    }
    __privateSet(this, _stale, true);
    return this;
  }
};
var Rect = _Rect;
_stale = new WeakMap();
_leftLine = new WeakMap();
_topLine = new WeakMap();
_rightLine = new WeakMap();
_bottomLine = new WeakMap();
__publicField(Rect, "boundingRect", _Rect.combine);

// ../../geometrik/dist/esm/matrix.js
var Matrix = class extends DOMMatrix {
  constructor(matrix) {
    if (typeof matrix === "string") {
      super(matrix.split("(")[1].split(")")[0].split(",").map(parseFloat));
    } else if (Array.isArray(matrix)) {
      super(matrix);
    } else if (matrix instanceof DOMMatrix) {
      super(matrix.toFloat64Array());
    } else if (typeof matrix === "object") {
      super(Object.values(matrix));
    } else {
      super(matrix);
    }
  }
  flipX() {
    return new Matrix(super.flipX());
  }
  flipY() {
    return new Matrix(super.flipY());
  }
  inverse() {
    return new Matrix(super.inverse());
  }
  multiply(other) {
    return new Matrix(super.multiply(other));
  }
  rotate(rotX, rotY, rotZ) {
    return new Matrix(super.rotate(rotX, rotY, rotZ));
  }
  rotateAxisAngle(x, y, z, angle) {
    return new Matrix(super.rotateAxisAngle(x, y, z, angle));
  }
  rotateFromVector(x, y) {
    return new Matrix(super.rotateFromVector(x, y));
  }
  scale(scaleX, scaleY, scaleZ, originX, originY, originZ) {
    return new Matrix(super.scale(scaleX, scaleY, scaleZ, originX, originY, originZ));
  }
  scaleSelf(scaleX, scaleY, scaleZ, originX, originY, originZ) {
    super.scaleSelf(scaleX, scaleY, scaleZ, originX, originY, originZ);
    return this;
  }
  scale3d(scale, originX, originY, originZ) {
    return new Matrix(super.scale3d(scale, originX, originY, originZ));
  }
  skewX(sx) {
    return new Matrix(super.skewX(sx));
  }
  skewY(sy) {
    return new Matrix(super.skewY(sy));
  }
  translate(tx, ty, tz) {
    return new Matrix(super.translate(tx, ty, tz));
  }
  translateSelf(tx, ty, tz) {
    super.translateSelf(tx, ty, tz);
    return this;
  }
  clone() {
    return new Matrix(this);
  }
  toJSON() {
    return this.toFloat64Array();
  }
};

// ../../geometrik/dist/esm/scalar.js
var Scalar = class {
  static interpolate(a, b, t2) {
    return a + (b - a) * t2;
  }
  static radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
  }
  static degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  static clamp(min, max, x) {
    return Math.max(min, Math.min(max, x));
  }
  x;
  constructor(x = 0) {
    this.x = x;
  }
  scaleSelf(x) {
    this.x *= x;
    return this;
  }
  normalizeSelf(x) {
    if (x instanceof Matrix) {
      this.x = (this.x - x.e) / x.a;
    } else if (typeof x === "number") {
      this.x /= x;
    }
    return this;
  }
  transformSelf(matrix) {
    const { x } = this;
    const { a, e } = matrix;
    this.x = a * x + e;
    return this;
  }
};

// ../../geometrik/dist/esm/point.js
var Point = class extends Shape {
  static fromElement(el) {
    return new Point(+(el.dataset.left ?? el.offsetLeft), +(el.dataset.top ?? el.offsetTop));
  }
  static fromObject(obj) {
    return new Point(obj.x ?? obj.width, obj.y ?? obj.height);
  }
  static fromMatrix(matrix) {
    return new Point(matrix.e, matrix.f);
  }
  static fromAngle(radians) {
    return new Point(Math.cos(radians), Math.sin(radians));
  }
  static fromAngleDegrees(degrees) {
    return Point.fromAngle(Scalar.degreesToRadians(degrees));
  }
  static compare(a, b) {
    return a?.equals(b) ?? false;
  }
  x;
  y;
  constructor(x = 0, y = x) {
    super();
    if (typeof x === "object")
      Object.assign(this, Point.fromObject(x.toJSON ? x.toJSON() : x));
    else {
      this.x = x;
      this.y = y;
    }
  }
  [Symbol.iterator]() {
    return [
      this.x,
      this.y
    ][Symbol.iterator]();
  }
  toString() {
    return `${this.x} ${this.y}`;
  }
  set(other) {
    this.x = other.x;
    this.y = other.y;
    return this;
  }
  draw(color = "yellow", position = "absolute") {
    const div = document.createElement("div");
    Object.assign(div.style, {
      position,
      boxSizing: "border-box",
      border: "1px solid " + color,
      ...this.toStylePosition(),
      width: "2px",
      height: "2px",
      zIndex: 1e3
    });
    document.body.appendChild(div);
    return div;
  }
  get pos() {
    return new Point(this.x, this.y);
  }
  get position() {
    return this.pos;
  }
  get size() {
    return new Point(this.width, this.height);
  }
  get width() {
    return this.x;
  }
  set width(x) {
    this.x = x;
  }
  get height() {
    return this.y;
  }
  set height(y) {
    this.y = y;
  }
  interpolate(other, t2) {
    return this.clone().interpolateSelf(other, t2);
  }
  interpolateSelf(other, t2) {
    this.x = this.x + (other.x - this.x) * t2;
    this.y = this.y + (other.y - this.y) * t2;
    return this;
  }
  diff(other) {
    return this.clone().diffSelf(other);
  }
  diffSelf(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }
  abs() {
    return this.clone().absSelf();
  }
  absSelf() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }
  square() {
    return this.clone().squareSelf();
  }
  squareSelf() {
    this.x *= this.x;
    this.y *= this.y;
    return this;
  }
  sum() {
    return this.x + this.y;
  }
  manhattan(other) {
    return this.diff(other).absSelf().sum();
  }
  octile(other) {
    const d = this.diff(other).absSelf();
    const F = Math.SQRT2 - 1;
    return d.x < d.y ? F * d.x + d.y : F * d.y + d.x;
  }
  max() {
    return Math.max(this.x, this.y);
  }
  min() {
    return Math.min(this.x, this.y);
  }
  clampSelf(min, max) {
    if (this.x < min)
      this.x = min;
    else if (this.x > max)
      this.x = max;
    if (this.y < min)
      this.y = min;
    else if (this.y > max)
      this.y = max;
    return this;
  }
  clampMinSelf(min) {
    if (this.x < min)
      this.x = min;
    if (this.y < min)
      this.y = min;
    return this;
  }
  chebyshev(other) {
    return this.diff(other).absSelf().max();
  }
  euclidean(other) {
    return this.distance(other);
  }
  distance(other) {
    return this.diff(other).mag();
  }
  mag() {
    return Math.hypot(this.x, this.y);
  }
  length() {
    return this.mag();
  }
  unit() {
    return this.scale(1 / this.mag());
  }
  dot(other) {
    return new Line(this, other).dot();
  }
  normal() {
    return new Point(this.y, -this.x);
  }
  angleTo(other) {
    return new Line(this, other).angle();
  }
  round() {
    return this.clone().roundSelf();
  }
  roundSelf() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }
  precisionRound(p = 1) {
    return this.clone().precisionRoundSelf(p);
  }
  precisionRoundSelf(p = 1) {
    this.x = Math.round(this.x * p) / p;
    this.y = Math.round(this.y * p) / p;
    return this;
  }
  gridRound(p = 1) {
    return this.clone().gridRoundSelf(p);
  }
  gridRoundSelf(p = 1) {
    this.x = Math.round(this.x / p) * p;
    this.y = Math.round(this.y / p) * p;
    return this;
  }
  absoluteSum() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  withinRect(other) {
    return this.x >= other.left && this.x <= other.right && this.y >= other.top && this.y <= other.bottom;
  }
  transform(matrix) {
    return this.clone().transformSelf(matrix);
  }
  transformSelf(matrix) {
    const { x, y } = this;
    const { a, b, c, d, e, f } = matrix;
    this.x = a * x + c * y + e;
    this.y = b * x + d * y + f;
    return this;
  }
  multiply(x = 0, y = x) {
    return this.clone().multiplySelf(x, y);
  }
  multiplySelf(x = 0, y = x) {
    if (x instanceof Shape) {
      this.x *= x.x;
      this.y *= x.y;
    } else {
      this.x *= x;
      this.y *= y;
    }
    return this;
  }
  normalize(x, y = x) {
    return this.clone().normalizeSelf(x, y);
  }
  normalizeSelf(x = this.mag(), y = x) {
    if (x instanceof DOMMatrix) {
      this.x = (this.x - x.e) / x.a;
      this.y = (this.y - x.f) / x.d;
    } else if (x instanceof Rect) {
      this.x = (this.x - x.x) / x.width;
      this.y = (this.y - x.y) / x.height;
    } else if (typeof x === "number") {
      this.x /= x;
      this.y /= y;
    } else {
      this.x /= x.x;
      this.y /= x.y;
    }
    return this;
  }
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
  equalsAny(other) {
    return this.x === other.x || this.y === other.y;
  }
};
Point.prototype.absSum = Point.prototype.absoluteSum;

// ../../geometrik/dist/esm/line.js
var Line = class {
  p1;
  p2;
  constructor(p1, p2) {
    if (p1.p1) {
      this.p1 = new Point(p1.p1);
      this.p2 = new Point(p1.p2);
    } else {
      this.p1 = p1;
      this.p2 = p2;
    }
  }
  [Symbol.iterator]() {
    return this.points[Symbol.iterator]();
  }
  get points() {
    return [
      this.p1,
      this.p2
    ];
  }
  angle() {
    const dx = this.p2.x - this.p1.x;
    const dy = this.p2.y - this.p1.y;
    return Math.atan2(dy, dx);
  }
  angleDegrees() {
    return Scalar.radiansToDegrees(this.angle());
  }
  clone() {
    const ctor = this.constructor;
    return new ctor(this);
  }
  mag() {
    return this.p1.distance(this.p2);
  }
  dot() {
    return this.p1.x * this.p2.x + this.p1.y * this.p2.y;
  }
  intersectionRect(r) {
    const p1 = this.p1;
    const p2 = this.p2;
    const is2 = (this.intersectsLine(r.leftLine) ? Intersect.Left : 0) + (this.intersectsLine(r.topLine) ? Intersect.Top : 0) + (this.intersectsLine(r.rightLine) ? Intersect.Right : 0) + (this.intersectsLine(r.bottomLine) ? Intersect.Bottom : 0) + (p1.withinRect(r) && p2.withinRect(r) ? Intersect.Inside : 0);
    return is2;
  }
  intersectsRect(r) {
    const p1 = this.p1;
    const p2 = this.p2;
    return this.intersectsLine(r.leftLine) ? Intersect.Left : this.intersectsLine(r.topLine) ? Intersect.Top : this.intersectsLine(r.rightLine) ? Intersect.Right : this.intersectsLine(r.bottomLine) ? Intersect.Bottom : p1.withinRect(r) && p2.withinRect(r) ? Intersect.Inside : Intersect.None;
  }
  intersectsLine(other) {
    const a1 = this.p1;
    const a2 = this.p2;
    const b1 = other.p1;
    const b2 = other.p2;
    let q = (a1.y - b1.y) * (b2.x - b1.x) - (a1.x - b1.x) * (b2.y - b1.y);
    const d = (a2.x - a1.x) * (b2.y - b1.y) - (a2.y - a1.y) * (b2.x - b1.x);
    if (d == 0) {
      return false;
    }
    const r = q / d;
    q = (a1.y - b1.y) * (a2.x - a1.x) - (a1.x - b1.x) * (a2.y - a1.y);
    const s = q / d;
    if (r < 0 || r > 1 || s < 0 || s > 1) {
      return false;
    }
    return true;
  }
  getLineToRectangleCollisionResponse(intersection, r) {
    if (intersection === Intersect.None) {
      return this;
    }
    const p1 = this.p1;
    const p2 = this.p2;
    const a1 = p1.clone();
    const a2 = p2.clone();
    const b1 = r.topLeft;
    const b2 = r.bottomRight;
    if (intersection & Intersect.Left) {
      a1.x = b1.x - 1;
    }
    if (intersection & Intersect.Top) {
      a1.y = b1.y - 1;
    }
    if (intersection & Intersect.Right) {
      a2.x = b2.x + 1;
    }
    if (intersection & Intersect.Bottom) {
      a2.y = b2.y + 1;
    }
    if (intersection & Intersect.Inside) {
      const p = p1.interpolate(p2, 0.5);
      const tp = p.touchPoint(r);
      a1.x = tp.x;
      a1.y = tp.y;
      a2.x = tp.x;
      a2.y = tp.y;
    }
    return new Line(a1, a2);
  }
  translate(x = 0, y = x) {
    return this.clone().translateSelf(x, y);
  }
  translateSelf(x = 0, y = x) {
    this.p1.translateSelf(x, y);
    this.p2.translateSelf(x, y);
    return this;
  }
};

// ../../geometrik/dist/esm/polyline.js
var Polyline = class {
  static fromPoints(points) {
    return new Polyline(points.slice(0, -1).map((p, i) => {
      const next = points[i + 1];
      const line = new Line(p, next);
      return line;
    }));
  }
  lines;
  constructor(lines) {
    if (lines.lines) {
      this.lines = lines.lines;
    } else {
      this.lines = lines;
    }
  }
  get normals() {
    const mags = this.lines.map((line) => line.mag());
    const total = mags.reduce((a, b) => a + b, 0);
    const normals = mags.map((mag) => mag / total);
    return normals;
  }
  get path() {
    const points = [];
    for (const line of this.lines) {
      points.push(line.p1);
    }
    points.push(this.lines.at(-1).p2);
    return new Polygon(points);
  }
  get length() {
    return this.lines.reduce((a, b) => a + b.mag(), 0);
  }
  chopAt(index) {
    const points = [];
    for (const [i, line] of this.lines.entries()) {
      points.push(line.p1);
      if (i === index) {
        const np = line.p1.interpolate(line.p2, 0.5);
        points.push(np);
      }
    }
    points.push(this.lines.at(-1).p2);
    this.lines = Polyline.fromPoints(points).lines;
    return this;
  }
};

// ../../geometrik/dist/esm/polygon.js
var Polygon = class {
  static toSVGPath(points) {
    return (points.length ? points : [
      [
        0,
        0
      ]
    ]).reduce((p, n) => {
      let last2 = p.at(-1);
      if (last2.length === 3) {
        last2 = [
          "L"
        ];
        p.push(last2);
      }
      last2.push(...n);
      return p;
    }, [
      [
        "M"
      ]
    ]).flat(Infinity).join(" ");
  }
  static sum(points) {
    return points.reduce((p, n) => {
      p.x += n.x;
      p.y += n.y;
      return p;
    }, new Point());
  }
  static absSum(points) {
    return points.reduce((p, n) => {
      p.x += Math.abs(n.x);
      p.y += Math.abs(n.y);
      return p;
    }, new Point());
  }
  static screen(a, b) {
    return a.map((x, i) => x.screen(b[i]));
  }
  static mag(points) {
    return points.reduce((p, n) => {
      return p + n.mag();
    }, 0);
  }
  static rope(points, coeff = 1) {
    const from = points[0].clone();
    const to = points.at(-1).clone();
    const oldRope = Polyline.fromPoints(points);
    const mags = oldRope.lines.map((line) => line.mag());
    const total = mags.reduce((a, b) => a + b, 0);
    const normals = mags.map((mag) => mag / total);
    const result = points.slice().map((x) => x.clone());
    const pl = points.length;
    const pl_1 = pl - 1;
    const c = pl_1 / pl;
    let p = to.clone();
    for (let i = pl_1; i--; ) {
      const t2 = (i + 1) / pl_1;
      const np = result[i];
      const normal = normals[Math.ceil(i * c)];
      const d = p.screen(np).scale(normal).scale(t2 ** coeff);
      p.translateSelf(d.negate());
      np.translateSelf(d);
      p = np;
    }
    result[0] = from.clone();
    result[points.length - 1] = to.clone();
    return result;
  }
  static chop(points, min = 35, max = 240) {
    const from = points[0].clone();
    const to = points.at(-1).clone();
    const newRope = Polyline.fromPoints(points);
    const newPoints = [];
    let last2;
    for (const line of newRope.lines) {
      const mag = line.mag();
      if (mag > min) {
        last2 = newPoints.push(line.p1);
      } else {
        if (last2) {
          newPoints[last2 - 1].translateSelf(line.p1.screen(newPoints[last2 - 1]).scale(0.5));
        }
      }
      if (mag > max) {
        const d = line.p2.screen(line.p1);
        const np = line.p1.translate(d);
        last2 = newPoints.push(np);
      }
    }
    newPoints[0] = from.clone();
    newPoints.push(to.clone());
    return newPoints;
  }
  static morph(morphFn, from, to, t2) {
    const [length, fc, tc] = Morph.coeffs(from, to);
    const fn2 = morphFn(from, to);
    return t2 < 1 ? Array.from({
      length
    }, (_3, i) => {
      const fi = Math.round(i * fc);
      const ti = Math.round(i * tc);
      return fn2(fi, ti, t2);
    }) : to;
  }
  static resample(points, index, t2) {
    const pl = points.length;
    const pl_1 = pl - 1;
    const p_0 = points[Math.min(index, pl_1)];
    const p_1 = points[Math.max(0, index - 1)];
    const p$1 = points[Math.min(index + 1, pl_1)];
    return p_0.interpolate(p_1.interpolate(p_0, t2).translateSelf(p_0.interpolate(p$1, 1 - t2)).scale(0.5), t2);
  }
  static fit(points, length) {
    const pl = points.length;
    const pl_1 = pl - 1;
    const coeff = pl / length;
    const newPoints = Array.from({
      length
    }, (_3, i) => {
      const index = Math.round(i * coeff);
      const p_0 = points[Math.min(index, pl_1)];
      const p_1 = points[Math.max(0, index - 1)];
      const p$1 = points[Math.min(index + 1, pl_1)];
      return p_0.interpolate(p_1.interpolate(p_0, 1).translateSelf(p_0.interpolate(p$1, 0)).scale(0.5), 0.5);
    });
    return newPoints;
  }
  static resampleSpline(points, index, t2) {
    const pl = points.length;
    const pl_1 = pl - 1;
    const p0 = points[Math.max(0, index - 2)];
    const p1 = points[Math.max(0, index - 1)];
    const p2 = points[Math.min(index, pl_1)];
    const p3 = points[Math.min(index + 1, pl_1)];
    const p4 = points[Math.min(index + 2, pl_1)];
    const p5 = points[Math.min(index + 3, pl_1)];
    const x = p2.x + 0.04166666666 * t2 * ((p3.x - p1.x) * 16 + (p0.x - p4.x) * 2 + t2 * ((p3.x + p1.x) * 16 - p0.x - p2.x * 30 - p4.x + t2 * (p3.x * 66 - p2.x * 70 - p4.x * 33 + p1.x * 39 + p5.x * 7 - p0.x * 9 + t2 * (p2.x * 126 - p3.x * 124 + p4.x * 61 - p1.x * 64 - p5.x * 12 + p0.x * 13 + t2 * ((p3.x - p2.x) * 50 + (p1.x - p4.x) * 25 + (p5.x - p0.x) * 5)))));
    const y = p2.y + 0.04166666666 * t2 * ((p3.y - p1.y) * 16 + (p0.y - p4.y) * 2 + t2 * ((p3.y + p1.y) * 16 - p0.y - p2.y * 30 - p4.y + t2 * (p3.y * 66 - p2.y * 70 - p4.y * 33 + p1.y * 39 + p5.y * 7 - p0.y * 9 + t2 * (p2.y * 126 - p3.y * 124 + p4.y * 61 - p1.y * 64 - p5.y * 12 + p0.y * 13 + t2 * ((p3.y - p2.y) * 50 + (p1.y - p4.y) * 25 + (p5.y - p0.y) * 5)))));
    return new Point(x, y);
  }
  static resampleCubic(points, index, t2) {
    const pl = points.length;
    const pl_1 = pl - 1;
    const i = index + t2 | 0;
    const p_1 = points[Math.min(Math.max(0, i - 1), pl_1)];
    const p0 = points[Math.min(i, pl_1)];
    const p1 = points[Math.min(i + 1, pl_1)];
    const p2 = points[Math.min(i + 2, pl_1)];
    const ax = (3 * (p0.x - p1.x) - p_1.x + p2.x) * 0.5;
    const bx = 2 * p1.x + p_1.x - (5 * p0.x + p2.x) * 0.5;
    const cx = (p1.x - p_1.x) * 0.5;
    const x = ((ax * t2 + bx) * t2 + cx) * t2 + p0.x;
    const ay = (3 * (p0.y - p1.y) - p_1.y + p2.y) * 0.5;
    const by = 2 * p1.y + p_1.y - (5 * p0.y + p2.y) * 0.5;
    const cy = (p1.y - p_1.y) * 0.5;
    const y = ((ay * t2 + by) * t2 + cy) * t2 + p0.y;
    return new Point(x, y);
  }
  static boundingRect(points) {
    const minX = Math.min(...points.map((p) => p.x));
    const minY = Math.min(...points.map((p) => p.y));
    const maxX = Math.max(...points.map((p) => p.x));
    const maxY = Math.max(...points.map((p) => p.y));
    return new Rect(minX, minY, maxX - minX, maxY - minY);
  }
  static sat(p1, p2) {
    let overlap = Number.MAX_VALUE;
    let displacement = new Point();
    for (const poly of [
      p1,
      p2
    ]) {
      for (let i = 0; i < poly.points.length; i++) {
        const a = poly.points[i];
        const b = poly.points[(i + 1) % poly.points.length];
        const axisProj = b.sub(a).normal().unit();
        let min1 = Number.MAX_VALUE;
        let max1 = -Number.MAX_VALUE;
        for (let j = 0; j < p1.points.length; j++) {
          const q = p1.points[j].dot(axisProj);
          min1 = Math.min(min1, q);
          max1 = Math.max(max1, q);
        }
        let min2 = Number.MAX_VALUE;
        let max2 = -Number.MAX_VALUE;
        for (let j1 = 0; j1 < p2.points.length; j1++) {
          const q1 = p2.points[j1].dot(axisProj);
          min2 = Math.min(min2, q1);
          max2 = Math.max(max2, q1);
        }
        const o = Math.min(max1, max2) - Math.max(min1, min2);
        if (o < 0) {
          return null;
        }
        if (o < Math.abs(overlap)) {
          const o1 = max2 - min1;
          const o2 = min2 - max1;
          overlap = Math.abs(o1) < Math.abs(o2) ? o1 : o2;
          displacement = axisProj.scale(overlap);
        }
      }
    }
    return displacement;
  }
  points;
  constructor(polygon = []) {
    if (Array.isArray(polygon)) {
      this.points = polygon;
    } else {
      this.points = polygon.points;
    }
  }
  get length() {
    return this.points.length;
  }
  get forEach() {
    return this.points.forEach.bind(this.points);
  }
  get slice() {
    return this.points.slice.bind(this.points);
  }
  toSVGPath() {
    return Polygon.toSVGPath(this.points);
  }
  screen(other) {
    return new Polygon(Polygon.screen(this.points, Array.isArray(other) ? other : other.points));
  }
  mag() {
    return Polygon.mag(this.points);
  }
  absSum() {
    return Polygon.absSum(this.points).absSum();
  }
  translateSelf(other) {
    const points = Array.isArray(other) ? other : other.points;
    this.points.forEach((x, i) => {
      x.translateSelf(points[i]);
    });
    return this;
  }
  chop(min, max) {
    return new Polygon(Polygon.chop(this.points, min, max));
  }
  chopSelf(min, max) {
    this.points = Polygon.chop(this.points, min, max);
    return this;
  }
  fit(length) {
    return new Polygon(Polygon.fit(this.points, length));
  }
  fitSelf(length) {
    this.points = Polygon.fit(this.points, length);
    return this;
  }
  rope(coeff) {
    return new Polygon(Polygon.rope(this.points, coeff));
  }
  ropeSelf(coeff) {
    this.points = Polygon.rope(this.points, coeff);
    return this;
  }
  boundingRect() {
    return Polygon.boundingRect(this.points);
  }
};

// ../../geometrik/dist/esm/morph.js
var Morph = class {
};
__publicField(Morph, "coeffs", (from, to) => {
  const fl = from.length;
  const tl = to.length;
  const length = Math.max(fl, tl);
  const fc = fl / length;
  const tc = tl / length;
  return [
    length,
    fc,
    tc,
    fl,
    tl
  ];
});
__publicField(Morph, "Nearest", (from, to) => {
  const fl_1 = from.length - 1;
  const tl_1 = to.length - 1;
  return (fi, ti, t2) => {
    const fp = from[Math.min(fi, fl_1)];
    const tp = to[Math.min(ti, tl_1)];
    return fp.interpolate(tp, t2);
  };
});
__publicField(Morph, "Linear", (from, to) => (fi, ti, t2) => {
  const fp = Polygon.resample(from, fi, 0.5);
  const tp = Polygon.resample(to, ti, 0.5);
  return fp.interpolate(tp, t2);
});
__publicField(Morph, "Cubic", (from, to) => (fi, ti, t2) => {
  const fp = Polygon.resampleCubic(from, fi, 0.5);
  const tp = Polygon.resampleCubic(to, ti, 0.5);
  return fp.interpolate(tp, t2);
});
__publicField(Morph, "Spline", (from, to) => (fi, ti, t2) => {
  const fp = Polygon.resampleSpline(from, fi, 0.5);
  const tp = Polygon.resampleSpline(to, ti, 0.5);
  return fp.interpolate(tp, t2);
});

// ../../geometrik/dist/esm/util.js
var cardinal = (data, closed, tension) => {
  if (data.length < 1)
    return "M 0 0";
  if (tension == null)
    tension = 1;
  const size = data.length - (closed ? 0 : 1);
  const path = [
    `M ${data[0]} C`
  ];
  for (let i = 0; i < size; i++) {
    let p0, p1, p2, p3;
    if (closed) {
      p0 = data[(i - 1 + size) % size];
      p1 = data[i];
      p2 = data[(i + 1) % size];
      p3 = data[(i + 2) % size];
    } else {
      p0 = i == 0 ? data[0] : data[i - 1];
      p1 = data[i];
      p2 = data[i + 1];
      p3 = i == size - 1 ? p2 : data[i + 2];
    }
    const x1 = p1.x + (p2.x - p0.x) / 6 * tension;
    const y1 = p1.y + (p2.y - p0.y) / 6 * tension;
    const x2 = p2.x - (p3.x - p1.x) / 6 * tension;
    const y2 = p2.y - (p3.y - p1.y) / 6 * tension;
    path.push(x1, y1, x2, y2, p2.x, p2.y);
  }
  closed && path.push("z");
  return path.join(" ");
};

// ../../geometrik/dist/esm/vec3.js
var Vec3 = class {
  x;
  y;
  z;
  constructor(x = 0, y = x, z = x) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  [Symbol.iterator]() {
    return [
      this.x,
      this.y,
      this.z
    ][Symbol.iterator]();
  }
  toString() {
    return `${this.x} ${this.y} ${this.z}`;
  }
  set(other) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    return this;
  }
  interpolate() {
    return Scalar.interpolate(this.y, this.x, this.z);
  }
};

// ../../sigl/dist/esm/jsx-runtime.js
var jsx_runtime_exports3 = {};
__export(jsx_runtime_exports3, {
  Fragment: () => Fragment,
  createHook: () => createHook,
  createProps: () => createProps,
  hook: () => hook,
  html: () => html,
  jsx: () => jsx,
  jsxs: () => jsxs,
  render: () => render,
  renderCache: () => renderCache,
  svg: () => svg,
  updateProps: () => updateProps
});
__reExport(jsx_runtime_exports3, jsx_runtime_exports);

// ../../sigl/dist/esm/sigl.js
var sigl_exports = {};
__export(sigl_exports, {
  AbortOptions: () => AbortOptions,
  DispatchOptions: () => DispatchOptions,
  EventOptions: () => EventOptions,
  GlobalLock: () => GlobalLock,
  Intersect: () => Intersect,
  Line: () => Line,
  Matrix: () => Matrix,
  Morph: () => Morph,
  MouseButton: () => MouseButton,
  MutationObserverSettings: () => MutationObserverSettings,
  OnOptions: () => OnOptions,
  Point: () => Point,
  Polygon: () => Polygon,
  Polyline: () => Polyline,
  PropertySettings: () => PropertySettings,
  PropsRef: () => PropsRef,
  QueueOptions: () => QueueOptions,
  Rect: () => Rect,
  Ref: () => Ref,
  RefCollection: () => RefCollection,
  RefMap: () => RefMap,
  RefProxy: () => RefProxy,
  RefSet: () => RefSet,
  ResizeObserverSettings: () => ResizeObserverSettings,
  Scalar: () => Scalar,
  Shape: () => Shape,
  State: () => State2,
  Task: () => Task,
  Transition: () => Transition,
  TransitionSettings: () => TransitionSettings,
  Vec3: () => Vec3,
  _: () => _,
  abort: () => abort,
  attr: () => attr,
  cardinal: () => cardinal,
  chain: () => chain,
  classes: () => classes,
  clone: () => clone,
  compare: () => compare,
  css: () => css,
  cssToJs: () => cssToJs,
  dataset: () => dataset,
  dispatch: () => dispatch,
  dispatchBind: () => dispatchBind,
  element: () => element2,
  event: () => event,
  findParentElement: () => findParentElement,
  getActiveElement: () => getActiveElement,
  getElementOffset: () => getElementOffset,
  getObservedRect: () => getObservedRect,
  getOffsetRect: () => getOffsetRect,
  getViewportRect: () => getViewportRect,
  inherit: () => inherit,
  is: () => is,
  isMac: () => isMac,
  isMobile: () => isMobileAgent,
  jsToCss: () => jsToCss,
  kbd: () => kbd,
  mix: () => pipeInto,
  mixin: () => mixin,
  mixins: () => mixins_exports,
  nodesToText: () => nodesToText,
  observe: () => observe,
  observeNodes: () => observeNodes,
  on: () => on,
  onAll: () => onAll,
  onSlotChange: () => onSlotChange,
  onTextChange: () => onTextChange,
  ondblclick: () => ondblclick,
  out: () => out,
  prop: () => prop,
  protoPropertyMap: () => protoPropertyMap,
  queue: () => queue,
  reactive: () => reactive,
  render: () => render,
  renderCache: () => renderCache,
  renderDom: () => render,
  shadow: () => shadow,
  slotted: () => slotted2,
  taskGroup: () => taskGroup,
  taskRun: () => taskRun,
  transition: () => transition,
  warn: () => warn,
  wrapEvent: () => wrapEvent,
  wrapQueue: () => wrapQueue
});

// ../../sigl/dist/esm/context.js
var import_eventemitter_strict = __toESM(require_lib());
var NO_DEPS = Symbol();
var REDUCER = Symbol();
var EffectOptions2 = class extends QueueOptions {
  cb;
  keys;
  why = bool;
  once = bool;
  lock = bool;
  isFulfillReducer = bool;
};
var Fx = class {
  remove;
  target;
  values = {};
  pass;
  origin = [];
  originExtra;
  constructor(fx2) {
    Object.assign(this, fx2);
  }
};
var GlobalLock;
var ContextClass = class extends import_eventemitter_strict.EventEmitter {
  entries;
  mem;
  keys;
  effects;
  triggered;
  tailQueue;
  active;
  reducer;
  $;
  scheduled;
  fxListeners;
  static attach(target, extension = {}) {
    if (target.context instanceof ContextClass) {
      return;
    }
    target.context = new ContextClass(target);
    target.context.mutate(() => {
      target.$ = Object.assign(target.context.$, extension);
    });
  }
  debug;
  constructor(target) {
    super();
    this.target = target;
    this.keys = /* @__PURE__ */ new Set();
    this.triggered = /* @__PURE__ */ new Set();
    this.tailQueue = /* @__PURE__ */ new Set();
    this.active = [];
    this.$ = {};
    this.scheduled = /* @__PURE__ */ new Set();
    this.fxListeners = /* @__PURE__ */ new Map();
    this.debug = false;
    this.maybeAddChangeListener = (key, value) => {
      if (typeof value !== "object" || !(value instanceof EventTarget) || typeof Element !== "undefined" && value instanceof Element) {
        return;
      }
      const [prev, off] = this.fxListeners.get(key) ?? [];
      if (prev === value)
        return;
      off?.();
      const ownEvents = /* @__PURE__ */ new WeakSet();
      const runKeyEffects = () => {
        this.clearKey(key);
        this.target[key] = value;
        this.runEffects(key);
      };
      this.fxListeners.set(key, [
        value,
        onAll(value, (event2) => {
          if (event2.type === "change")
            runKeyEffects();
          if (ownEvents.has(event2))
            return;
          const newEvent = new event2.constructor(event2.type, {
            ...event2,
            detail: event2.detail,
            composed: true,
            bubbles: true
          });
          ownEvents.add(newEvent);
          if (typeof Element === "undefined" || !(this.target instanceof Element)) {
            console.error(this.target);
            throw new Error("Target is not an EventTarget");
          }
          this.target.dispatchEvent(newEvent);
        })
      ]);
      return true;
    };
    this.origins = /* @__PURE__ */ new Map();
    this.cleanup = () => {
      if (this.effects) {
        for (const fns of this.effects.values())
          fns.forEach((f) => f.dispose?.());
      }
      this.effects = new Map([
        [
          NO_DEPS,
          []
        ],
        ...this.entries.map(([key]) => [
          key,
          []
        ])
      ]);
    };
    this.register = (f) => {
      if (this.debug) {
        f.origin.push(new Error());
      }
      f.keys = f.options?.keys ?? new Set(argtor(f.fn));
      f.fn = wrapQueue(f.options)(f.fn);
      f.keys.forEach((key) => {
        const fx2 = this.effects.get(key);
        if (!fx2) {
          console.warn("No effects for key:", key);
          return;
        }
        fx2.push(f);
      });
      !f.keys.size && this.effects.get(NO_DEPS).push(f);
      f.remove = async () => {
        if (f.keys.size) {
          f.keys.forEach((key) => {
            const fx2 = this.effects.get(key);
            if (!fx2) {
              console.warn("No effects for key:", key);
              return;
            }
            removeFromArray(fx2, f, true);
          });
        } else
          removeFromArray(this.effects.get(NO_DEPS), f);
        if (this.triggered.has(f))
          this.triggered.delete(f);
        f.dispose?.();
      };
      return this.run(f);
    };
    this.lastTasks = [];
    this.hasScheduledFlush = false;
    this.didFlushLast = false;
    this.flush = queue.task.first.last.next(() => {
      this.didFlushLast = true;
      this.hasScheduledFlush = false;
      if (this.triggered.size) {
        const tasks = [
          ...this.triggered
        ];
        this.triggered.clear();
        tasks.forEach(this.run);
      }
      if (this.tailQueue.size) {
        const tasks1 = [
          ...this.tailQueue
        ];
        this.tailQueue.clear();
        tasks1.forEach((fn2) => fn2());
      }
      this.emit("flush");
    });
    this.run = (f) => {
      if (this.debug) {
        f.originExtra ??= [
          new Error()
        ];
      }
      if (f.pass && f.options?.once)
        return;
      if (this.active.length || GlobalLock) {
        if (!this.active.includes(f))
          this.triggered.add(f);
        GlobalLock?.add(this);
        return;
      }
      this.active.push(f);
      f.dispose?.();
      if (this.update(f)) {
        if (!f.pass) {
          f.values = {};
          return this.complete();
        }
      }
      return this.finalize();
    };
    this.complete = (result) => {
      const f = this.active.at(-1);
      if (!f.pass) {
        this.active.pop();
        this.flush();
        return;
      }
      if (f.cb?.(result) === false) {
        this.active.pop();
        this.flush();
        return;
      }
      if (f.target != null && !f.options?.isFulfillReducer) {
        this.target[f.target] = result;
        this.active.pop();
        this.flush();
        return true;
      } else {
        if (Array.isArray(result))
          result = chain(result);
        if (typeof result === "function") {
          f.dispose = () => {
            result();
            f.dispose = null;
          };
        }
        this.active.pop();
        this.flush();
      }
    };
    this.reduce = toFluent(EffectOptions2, (options) => (fn2, initial) => {
      this.reducer = new Fx({
        fn: fn2,
        options,
        initial,
        origin: [
          this._origin
        ]
      });
      this._origin = null;
      return REDUCER;
    });
    this.fulfill = toFluent(EffectOptions2, (options) => (fn2, initial) => {
      options.isFulfillReducer = true;
      this.reducer = new Fx({
        fn: fn2,
        options,
        initial,
        origin: [
          this._origin
        ]
      });
      this._origin = null;
      return REDUCER;
    });
    this.effect = toFluent(EffectOptions2, (options) => (fn2, cb) => {
      const f = new Fx({
        fn: fn2,
        cb: cb ?? options.cb,
        options
      });
      this.register(f);
      return f.remove;
    });
    this.mutate = (fn2) => {
      const f = new Fx({
        fn: fn2,
        options: {
          lock: true
        }
      });
      f.keys = /* @__PURE__ */ new Set();
      f.values = {
        ...this.target
      };
      return this.run(f);
    };
    this.mutating = (fn2) => () => {
      this.mutate(fn2);
    };
    this.use = (fn2) => fn2(this.target);
    this.using = (fn2) => () => fn2(this.target);
    this.function = (fn2) => {
      const { withLock, target: target2 } = this;
      let _args = [];
      let _self = null;
      let _result;
      function inner() {
        const cb = fn2(target2);
        _result = cb.apply(_self, _args);
      }
      function wrapped(...args) {
        _self = this;
        _args = args;
        withLock(inner);
        return _result;
      }
      return wrapped;
    };
    this.with = (fn2) => {
      const { target: target2 } = this;
      function wrapped(...args) {
        const cb = fn2(target2);
        return cb.apply(this, args);
      }
      return wrapped;
    };
    this.callback = toFluent(EffectOptions2, (options) => (fn2) => {
      const { mutate } = this;
      const qfn = wrapQueue(options)(function wrapped(...args) {
        mutate((ctx) => {
          const cb = fn2(ctx);
          cb.apply(this, args);
        });
      });
      return qfn;
    });
    this.atomic = (fn2) => this.callback(() => fn2);
    this.query = (sel) => this.reduce(({ root }) => root.querySelector(sel));
    this.when = (condition, cb) => function(...args) {
      if (condition)
        cb.apply(this, args);
    };
    this.withGlobalLock = (fn2) => {
      GlobalLock ??= /* @__PURE__ */ new Set();
      try {
        fn2();
      } catch (error) {
        console.warn(error);
      }
      const items = [
        ...GlobalLock
      ];
      GlobalLock = null;
      for (const item of items) {
        item.flush();
      }
    };
    this.withLock = (fn2) => {
      this.active.push(fn2);
      try {
        fn2();
      } catch (error) {
        console.warn(error);
      }
      this.active.pop();
      this.flush();
    };
    this.lock = () => {
      this.active.push(Symbol());
      return () => {
        this.active.pop();
        this.flush();
      };
    };
    this.globalLock = () => {
      GlobalLock ??= /* @__PURE__ */ new Set();
      return () => {
        if (!GlobalLock)
          return;
        const items = [
          ...GlobalLock
        ];
        GlobalLock = null;
        for (const item of items) {
          item.flush();
        }
      };
    };
    this.startDebugging = () => {
      const name = this.target.constructor.name;
      this.on("update", ({ origin: origin2, changedKeys }) => {
        const atKey = origin2.slice().reverse().map((x) => x.stack).join("").match(/\[as (\w+)]/)?.[1];
        console.groupCollapsed(name + ": " + changedKeys.join(" ") + (atKey?.length && !changedKeys.includes(atKey) ? ` > ${atKey}` : ""));
        for (const err of origin2) {
          console.log(err);
        }
        console.groupEnd();
      });
    };
    if (this.target.debug || this.debug) {
      this.debug = true;
      this.startDebugging();
    }
    this.copyMethods();
    this.createMemory();
    this.createAccessors();
    this.cleanup();
  }
  setupScheduled() {
    for (const item of this.scheduled) {
      if (item.value) {
        const { key, value: [method, args] } = item;
        this.$[key] = this.$[method](...args);
      } else if (item.captured) {
        const { key: key1, captured } = item;
        this._origin = captured.origin;
        this.$[key1] = applyFluentCapture(captured, this.$);
        this._origin = null;
      }
    }
  }
  _origin;
  copyMethods() {
    Object.assign(this.$, pick2(this, [
      "atomic",
      "callback",
      "cleanup",
      "effect",
      "fulfill",
      "function",
      "globalLock",
      "lock",
      "mutate",
      "mutating",
      "query",
      "reduce",
      "register",
      "render",
      "tailQueue",
      "use",
      "using",
      "when",
      "with",
      "withLock",
      "withGlobalLock"
    ]));
  }
  runEffects(key) {
    this.effects.get(key).forEach(this.run);
  }
  clearKey(key) {
    this.effects.get(key).forEach((f) => {
      delete f.values[key];
    });
  }
  maybeAddChangeListener;
  createMemory() {
    const pending = this.target._pendingProperties;
    this.entries = entries(this.target);
    this.mem = fromEntries(this.entries.map(([key, value]) => {
      if (typeof value === "symbol" && pending) {
        if (pending.has(value)) {
          this.scheduled.add({
            key,
            value: pending.get(value)
          });
          value = void 0;
        }
      }
      if (typeof value === "function" && value[FluentCaptureSymbol] === true) {
        this.scheduled.add({
          key,
          captured: value._results
        });
        value = void 0;
      }
      return [
        key,
        value
      ];
    }));
  }
  origins;
  createAccessors() {
    accessors(this.$, this.target, (key) => ({
      get: () => this.mem[key],
      set: (v) => {
        if (v === REDUCER) {
          v = this.reducer.initial;
          this.reducer.target = key;
          if (this.debug) {
            this.origins.set(key, new Error());
          }
          if (this.register(this.reducer))
            return;
          if (v == null)
            return;
        }
        this.target[key] = v;
      }
    }), (key) => !this.keys.has(key));
    accessors(this.target, this.target, (key) => ({
      get: () => this.mem[key],
      set: (v) => {
        const prev = this.mem[key];
        const settings = this.target._getPropertySettings?.(key);
        const isDifferent = !(settings?.compare ? settings.compare(prev, v) : Object.is(prev, v));
        if (isDifferent) {
          if (this.debug) {
            this.origins.set(key, new Error());
          }
          this.mem[key] = v;
          this.runEffects(key);
        }
      }
    }), (key) => {
      if (!this.keys.has(key)) {
        this.keys.add(key);
        return true;
      }
      return false;
    });
    accessors(this.target, fromEntries(entries(this.mem).filter(([key, value]) => {
      if (this.maybeAddChangeListener(key, value))
        return true;
    })), (key) => ({
      set: (v) => {
        this.maybeAddChangeListener(key, v);
      }
    }));
  }
  cleanup;
  register;
  update(f) {
    let changed = f.pass == null;
    f.pass ??= !f.keys.size;
    const changedKeys = [];
    for (const key of f.keys) {
      const value = this.target[key];
      if (value == null) {
        f.pass = false;
        return true;
      }
      const settings = this.target._getPropertySettings?.(key);
      const isDifferent = !(settings?.compare ? settings.compare(f.values[key], value) : Object.is(f.values[key], value));
      if (isDifferent) {
        f.values[key] = value;
        f.pass = true;
        changed = true;
        changedKeys.push(key);
      }
    }
    if (f.options?.why)
      console.warn(f, changedKeys);
    const origin2 = [
      ...f.origin,
      ...f.originExtra ?? [],
      ...changedKeys.map((key) => this.origins.get(key))
    ];
    this.emit("update", {
      f,
      changedKeys,
      origin: origin2
    });
    f.originExtra = null;
    return changed;
  }
  lastTasks;
  hasScheduledFlush;
  didFlushLast;
  flush;
  run;
  get _fulfill() {
    const f = this.active.at(-1);
    const key = f?.target;
    if (f == null || key == null) {
      throw new TypeError("Attempted to use `fulfill` when no reducer was active.");
    }
    return (value) => {
      this.target[key] = value;
    };
  }
  finalize() {
    const f = this.active.at(-1);
    let result = f.fn.call(this, f.values);
    if (f.options?.isFulfillReducer) {
      result = result(this._fulfill);
    }
    if (result?.then) {
      result.then((result2) => {
        f.dispose?.();
        try {
          if (f.cb?.(result2) === false) {
            this.active.pop();
            this.flush();
            return;
          }
          if (f.target != null && !f.options?.isFulfillReducer) {
            this.target[f.target] = result2;
          } else {
            if (Array.isArray(result2))
              result2 = chain(result2);
            if (typeof result2 === "function") {
              f.dispose = () => {
                result2();
                f.dispose = null;
              };
            }
          }
        } finally {
          if (f.options?.lock) {
            this.active.pop();
            this.flush();
          }
        }
      });
      if (!f.options?.lock) {
        this.active.pop();
        this.flush();
      }
      return true;
    } else {
      return this.complete(result);
    }
  }
  complete;
  reduce;
  fulfill;
  effect;
  mutate;
  mutating;
  use;
  using;
  function;
  with;
  callback;
  atomic;
  query;
  when;
  withGlobalLock;
  withLock;
  lock;
  globalLock;
  startDebugging;
  target;
};

// ../../sigl/dist/esm/extensions/slotted.js
var SlottedSettings = class {
  deep = bool;
  elements = bool;
  firstChild = bool;
  flatten = bool;
  nodes = bool;
};
var slotted = (c) => toFluent(SlottedSettings, (settings) => (mapFn = (x) => x) => c._scheduleProperty("fulfill", ({ root }) => (cb) => esm_default.onSlotChange(root, (slotted3) => {
  let result;
  if (settings.nodes)
    result = slotted3.nodes;
  else if (settings.firstChild)
    result = [
      slotted3.firstChild
    ];
  else
    result = slotted3.elements;
  if (settings.deep) {
    if (settings.nodes) {
      result = result.flatMap((x) => x instanceof HTMLSlotElement ? [
        ...x.assignedNodes({
          flatten: settings.flatten
        })
      ] : x);
    } else {
      result = result.flatMap((x) => x instanceof HTMLSlotElement ? [
        ...x.assignedElements({
          flatten: settings.flatten
        })
      ] : x);
    }
  }
  result = filterMap(result, mapFn);
  if (!result.length)
    cb([]);
  else if (settings.firstChild)
    cb(result[0]);
  else
    cb(result);
}, void 0, {
  flatten: settings.flatten
})));

// ../../get-element-offset/dist/esm/index.js
var getElementOffset = (el, maxDepth = Infinity) => {
  let x = 0;
  let y = 0;
  do {
    x += el.offsetLeft - el.scrollLeft;
    y += el.offsetTop - el.scrollTop;
  } while (maxDepth-- && (el = el.offsetParent));
  return {
    x,
    y
  };
};

// ../../../../.fastpm/-/is-mobile-agent@1.0.0/dist/esm/is-mobile-agent.js
var isMobileAgent = /Mobi|Android|Tablet/i.test(navigator.userAgent);

// ../../sigl/dist/esm/dom-util/classes.js
function classes(obj) {
  return Object.entries(obj).reduce((p, [className, value]) => {
    if (value)
      p.push(className);
    return p;
  }, []).join(" ");
}

// ../../sigl/dist/esm/dom-util/dataset.js
var dataset = (target, data) => {
  for (const key in data)
    target.dataset[key] = data[key].toString();
};

// ../../sigl/dist/esm/dom-util/find-parent-element.js
var findParentElement = (child, fn2) => {
  let el = child;
  while (el = el.parentElement)
    if (fn2(el))
      return el;
};

// ../../sigl/dist/esm/dom-util/get-active-element.js
var getActiveElement = (el = document.activeElement) => {
  if (el?.shadowRoot)
    return getActiveElement(el.shadowRoot.activeElement) ?? el;
  return el;
};

// ../../sigl/dist/esm/dom-util/get-offset-rect.js
function getOffsetRect(el, depth = Infinity) {
  const offset = esm_default.getElementOffset(el, depth);
  const rect = new esm_default.Rect(offset.x, offset.y, el.offsetWidth, el.offsetHeight);
  return rect;
}

// ../../sigl/dist/esm/dom-util/get-observed-rect.js
function getObservedRect(el) {
  return new Promise((resolve) => {
    const observer = new IntersectionObserver(([entry]) => {
      const bounds = entry.boundingClientRect;
      observer.disconnect();
      resolve(bounds);
    });
    observer.observe(el);
  });
}

// ../../sigl/dist/esm/dom-util/get-viewport-rect.js
function getViewportRect() {
  return new Rect(document.scrollingElement.scrollLeft, document.scrollingElement.scrollTop, window.visualViewport.width, window.visualViewport.height);
}

// ../../sigl/dist/esm/dom-util/is-mac.js
var isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

// ../../sigl/dist/esm/dom-util/kbd.js
var kbd = (...shortcuts) => (e) => {
  const localeKey = e.key.replace("Arrow", "").toLowerCase();
  const physicalKey = String.fromCharCode(e.which).toLowerCase();
  const pressed = [
    e.shiftKey && "shift",
    e.altKey && "alt",
    e.ctrlKey && "ctrl",
    e.metaKey && "meta",
    (e.ctrlKey || e.metaKey) && "cmd"
  ].filter(Boolean);
  const shortcutsLower = shortcuts.map(([shortcut, cmd]) => [
    shortcut.map((x) => x.toLowerCase()),
    cmd
  ]);
  const pressedLocale = [
    ...pressed,
    localeKey
  ];
  const pressedPhysical = [
    ...pressed,
    physicalKey
  ];
  const candidates = [
    pressedLocale,
    pressedPhysical
  ];
  for (const [shortcut, cmd] of shortcutsLower) {
    for (const candidate of candidates) {
      if (shortcut.every((x) => candidate.includes(x)) && candidate.every((x) => shortcut.includes(x))) {
        e.preventDefault();
        e.stopPropagation();
        return cmd(e);
      }
    }
  }
};

// ../../sigl/dist/esm/dom-util/observe.js
var MutationObserverSettings = class {
  attributeFilter;
  attributeOldValue = bool;
  attributes = bool;
  characterData = bool;
  characterDataOldValue = bool;
  childList = bool;
  subtree = bool;
  initial = bool;
};
var ResizeObserverSettings = class {
  box;
  initial = bool;
};
var observe = {
  resize: toFluent(ResizeObserverSettings, (settings) => (el, fn2) => {
    const observer = new ResizeObserver(fn2);
    observer.observe(el, settings);
    if (settings.initial)
      fn2([], observer);
    return () => observer.disconnect();
  }),
  mutation: toFluent(MutationObserverSettings, (settings) => (el, fn2) => {
    const observer = new MutationObserver(fn2);
    observer.observe(el, settings);
    if (settings.initial)
      fn2([], observer);
    return () => observer.disconnect();
  }),
  gc: (item, value, fn2) => {
    const reg = new FinalizationRegistry(fn2);
    reg.register(item, value);
    return reg;
  }
};

// ../../sigl/dist/esm/dom-util/ondblclick.js
var ondblclick = (el, cb, ms = 250) => {
  let prevTimestamp = 0;
  const pointers = /* @__PURE__ */ new Set();
  const clear = (e) => {
    pointers.delete(e.pointerId);
  };
  let firstDownPath;
  return chain(on(el).pointerdown((e) => {
    if (!(e.buttons & MouseButton.Left))
      return;
    pointers.add(e.pointerId);
    if (pointers.size > 1)
      return;
    if (e.timeStamp - prevTimestamp < ms) {
      e.stopPropagation();
      return cb(e, firstDownPath);
    }
    firstDownPath = e.composedPath();
    prevTimestamp = e.timeStamp;
  }), on(window).pointerup(clear), on(window).pointercancel(clear));
};

// ../../sigl/dist/esm/dom-util/shadow.js
var shadow = (host, init = "", html2 = "") => {
  const root = host.attachShadow(typeof init === "object" ? init : {
    mode: "open"
  });
  root.innerHTML = typeof init === "string" ? init : html2;
  return root;
};

// ../../sigl/dist/esm/dom-util/transition.js
var TransitionSettings = class {
  immediate = bool;
  expire = bool;
  expireAfter = 0;
  locked = bool;
  pop = bool;
  idle = bool;
  drop = bool;
};
var Transition = class extends EventTarget {
  static from() {
    throw new TypeError("Transition cannot be recreated by its string representation.");
  }
  #modeExpireTime;
  #dropExpireTime;
  #modeTimeout;
  #resetModeTimeout;
  #locked;
  constructor(state, AnimSettings) {
    super();
    this.state = state;
    this.AnimSettings = AnimSettings;
    this.#modeExpireTime = 0;
    this.#dropExpireTime = 0;
    this.#locked = false;
    this.to = toFluent(TransitionSettings, (settings) => (mode, cb) => {
      if (this.#locked) {
        return;
      }
      const now = performance.now();
      if (now < this.#dropExpireTime) {
        return;
      }
      clearTimeout(this.#resetModeTimeout);
      clearTimeout(this.#modeTimeout);
      if (now > this.#modeExpireTime || settings.immediate) {
        this.#setMode(settings, mode, cb);
      } else {
        this.#modeTimeout = setTimeout(() => {
          this.#setMode(settings, mode, cb);
        }, this.#modeExpireTime - now);
      }
    });
    esm_default.on(state).change(() => {
      this.dispatchEvent(new CustomEvent("change"));
    });
  }
  get animSettings() {
    return this.AnimSettings[this.state.current] ?? this.AnimSettings[this.state.states.Idle];
  }
  #resetMode(cb, toIdle) {
    clearTimeout(this.#resetModeTimeout);
    this.#resetModeTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        this.#dropExpireTime = 0;
        if (!this.state.isIdle) {
          if (toIdle) {
            this.state.returnToIdle();
          } else {
            this.state.pop(this.state.current);
          }
        }
        if (cb)
          requestAnimationFrame(cb);
      });
    }, (this.AnimSettings[this.state.current]?.duration || 50) + 175);
  }
  #setMode(settings, mode, cb1) {
    const now = performance.now();
    if (mode === this.state.states.Idle)
      this.#resetMode(cb1, settings.idle);
    else {
      this.#modeExpireTime = now + (settings.expireAfter ? settings.expireAfter : settings.expire ? this.AnimSettings[mode]?.duration ?? 0 : 0);
      if (settings.drop)
        this.#dropExpireTime = this.#modeExpireTime;
      if (settings.locked)
        this.#locked = true;
      if (mode !== this.state.current) {
        requestAnimationFrame(() => {
          this.state.pushOrSwap(mode);
          if (cb1)
            requestAnimationFrame(cb1);
          if (settings.pop)
            this.#resetMode(null, settings.idle);
        });
      } else {
        cb1?.();
        if (settings.pop)
          this.#resetMode(null, settings.idle);
      }
    }
  }
  unlock() {
    this.#locked = false;
    this.state.pop(this.state.current);
  }
  to;
  get current() {
    return this.toString();
  }
  toString() {
    return this.state.current;
  }
  state;
  AnimSettings;
};
var transition = (state, AnimSettings) => new Transition(state, AnimSettings);

// ../../sigl/dist/esm/state.js
var State2 = class extends EventTarget {
  static from(x) {
    return new State2(Array.isArray(x) ? x : x.toString().split(","));
  }
  stack;
  transition;
  constructor(states2, guard, AnimSettings) {
    super();
    this.states = states2;
    this.guard = guard;
    this.AnimSettings = AnimSettings;
    this.stack = [
      states2.Idle
    ];
    this.transition = new Transition(this, AnimSettings ?? {});
    if (states2.Initial)
      this.stack.push(states2.Initial);
    esm_default.on(this).change(() => {
      esm_default.dispatch(this, "statechange", this);
    });
    if (this.stack.length) {
      esm_default.dispatch(this, "change");
    }
  }
  toJSON() {
    return this.states;
  }
  get current() {
    return this.toString();
  }
  get isIdle() {
    return this.stack.length === 1;
  }
  get isInitial() {
    return this.states.Initial ? this.is(this.states.Initial) : false;
  }
  toString() {
    return this.stack.at(-1);
  }
  is(testState) {
    return this.stack.at(-1) === testState;
  }
  emit(state, ...detail) {
    if (!this.is(state)) {
      throw new TypeError(`Attempt to emit for "${state}" but our current state stack is "${this.stack}"`);
    }
    esm_default.dispatch(this, state, ...detail);
  }
  pushOrSwap(state, ...detail) {
    try {
      this.push(state, ...detail);
    } catch {
      if (this.is(state)) {
        return;
      }
      if (this.stack.at(-2) === state) {
        this.pop(this.current, ...detail);
      } else {
        this.swap(state, ...detail);
      }
    }
  }
  push(state, ...detail) {
    if (this.is(state)) {
      throw new TypeError(`Attempt to push state "${state}" again on top of itself, our current state stack is "${this.stack}"`);
    }
    if (this.guard) {
      const allowedPushStates = this.guard[this.current]?.push ?? [];
      if (!Array.isArray(allowedPushStates)) {
        throw new TypeError(`Invalid push guard for "${this.current}"`);
      }
      if (!allowedPushStates.includes(state)) {
        throw new TypeError(`Invalid push state "${state}" - allowed push states for "${this.current}" are: "${allowedPushStates}"`);
      }
    }
    this.stack = [
      ...this.stack,
      state
    ];
    esm_default.dispatch(this, `${this.stack.at(-2)}pause`);
    esm_default.dispatch(this, `${state}start`, ...detail);
    esm_default.dispatch(this, "change");
  }
  swap(state, ...detail) {
    if (this.stack.length === 1) {
      throw new TypeError(`Attempt to swap base state "${state}" when stack is length 1.`);
    }
    const current = this.current;
    if (this.guard) {
      const below = this.stack.at(-2);
      const allowedPushOrSwapStates = [
        ...this.guard[below]?.push ?? [],
        ...this.guard[below]?.swap ?? []
      ];
      if (!Array.isArray(allowedPushOrSwapStates)) {
        throw new TypeError(`Invalid push guard for "${below}"`);
      }
      if (!allowedPushOrSwapStates?.includes(state)) {
        throw new TypeError(`Invalid swap to state "${state}" from "${current}" - allowed push and swap states above "${below}" are: "${allowedPushOrSwapStates}"`);
      }
      const allowedSwapStates = this.guard[current]?.swap;
      if (allowedSwapStates && !allowedSwapStates?.includes(state)) {
        throw new TypeError(`Invalid swap to state "${state}" from "${current}" - allowed swap states for "${current}" are: "${allowedSwapStates}"`);
      }
    }
    this.stack = [
      ...this.stack.slice(0, -1),
      state
    ];
    esm_default.dispatch(this, `${current}cancel`);
    esm_default.dispatch(this, `${this.stack.at(-1)}start`, ...detail);
    esm_default.dispatch(this, "change");
  }
  pop(state, ...detail) {
    if (!this.is(state)) {
      throw new TypeError(`Attempt to pop state "${state}" but our current state stack is "${this.stack}"`);
    }
    if (this.stack.length === 1) {
      throw new TypeError(`Attempt to pop base state "${state}" when stack is length 1.`);
    }
    this.stack = [
      ...this.stack.slice(0, -1)
    ];
    esm_default.dispatch(this, `${state}end`, ...detail);
    esm_default.dispatch(this, `${this.stack.at(-1)}resume`);
    esm_default.dispatch(this, "change");
  }
  cancel(state, ...detail) {
    if (!this.is(state)) {
      throw new TypeError(`Attempt to cancel state "${state}" but our current state stack is "${this.stack}"`);
    }
    if (this.stack.length === 1) {
      throw new TypeError(`Attempt to cancel base state "${state}" when stack is length 1.`);
    }
    this.stack = [
      ...this.stack.slice(0, -1)
    ];
    esm_default.dispatch(this, `${state}cancel`, ...detail);
    esm_default.dispatch(this, `${this.stack.at(-1)}resume`);
    esm_default.dispatch(this, "change");
  }
  returnToIdle() {
    while (!this.isIdle) {
      this.cancel(this.current, void 0);
    }
  }
  states;
  guard;
  AnimSettings;
};

// ../../../../.fastpm/-/tslib@2.4.0/modules/index.js
var import_tslib = __toESM(require_tslib(), 1);
var {
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __metadata,
  __awaiter,
  __generator,
  __exportStar,
  __createBinding,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn
} = import_tslib.default;

// ../../../../.fastpm/-/ts-functional-pipe@3.1.2/dist/ts-functional-pipe.es5.js
var applyArgs = function() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var f = function(f2) {
    return f2.apply(void 0, __spreadArray([], __read(args), false));
  };
  f.to = f;
  return f;
};
function pipeImpl() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var _a = __read(args), o1 = _a[0], operations = _a.slice(1);
  return function() {
    var args2 = [];
    for (var _i2 = 0; _i2 < arguments.length; _i2++) {
      args2[_i2] = arguments[_i2];
    }
    return operations.reduce(function(acc, f) {
      return f(acc);
    }, o1.apply(void 0, __spreadArray([], __read(args2), false)));
  };
}
function pipeInto(src, o1) {
  var operations = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    operations[_i - 2] = arguments[_i];
  }
  return applyArgs(src).to(pipeImpl.apply(void 0, __spreadArray([o1], __read(operations), false)));
}

// ../../sigl/dist/esm/decorators.js
var PropertySettings = class extends QueueOptions {
  attr = false;
  clone = false;
  compare;
  is;
  out = false;
};
var protoPropertyMap = /* @__PURE__ */ new WeakMap();
var prop = toFluent(PropertySettings, (settings) => (is2) => (proto4, key) => {
  if (typeof key !== "string")
    return;
  settings.is ??= is2;
  if (!protoPropertyMap.has(proto4)) {
    protoPropertyMap.set(proto4, /* @__PURE__ */ new Map([
      [
        key,
        settings
      ]
    ]));
  } else {
    const propertyMap = protoPropertyMap.get(proto4);
    if (propertyMap.has(key)) {
      Object.assign(propertyMap.get(key), settings);
    } else {
      propertyMap.set(key, settings);
    }
  }
});
var attr = prop.attr;
var clone = prop.clone;
var compare = prop.compare;
var is = prop.is;
var out = prop.out;

// ../../sigl/dist/esm/mixins/index.js
var mixins_exports = {};
__export(mixins_exports, {
  layout: () => layout,
  observed: () => observed
});

// ../../sigl/dist/esm/mixins/layout.js
var __decorate2 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata2 = function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var layout = () => esm_default.mixin((superclass) => {
  let Layout2 = class Layout extends superclass {
    rect;
    pos = esm_default(this).reduce(({ rect }) => rect.pos.round());
    size = esm_default(this).reduce(({ rect }) => rect.size.round());
    matrix = esm_default(this).fulfill(({ layout: layout2 }) => (fulfill) => layout2.$.effect.raf(({ matrix }) => {
      fulfill(matrix);
    }));
    scale = 1;
    layout;
    layoutRect = esm_default(this).fulfill(({ layout: layout2 }) => (fulfill) => layout2.$.effect.raf(({ rect, layoutRect }) => {
      fulfill(rect.translate(layoutRect.pos).round());
    }));
    fixed = esm_default(this).fulfill(({ layout: layout2 }) => (fulfill) => layout2.$.effect(({ fixed }) => {
      fulfill(fixed);
    }));
    mounted($4) {
      $4.effect(({ rect }) => {
        const rounded = rect.round();
        if (!rounded.equals(rect)) {
          $4.rect = rounded;
        }
      });
    }
  };
  __decorate2([
    esm_default.compare(esm_default.Rect.compare)(),
    __metadata2("design:type", typeof esm_default === "undefined" || typeof esm_default.Rect === "undefined" ? Object : esm_default.Rect)
  ], Layout2.prototype, "rect", void 0);
  __decorate2([
    esm_default.compare(esm_default.Point.compare)()
  ], Layout2.prototype, "pos", void 0);
  __decorate2([
    esm_default.compare(esm_default.Point.compare)()
  ], Layout2.prototype, "size", void 0);
  __decorate2([
    esm_default.compare(esm_default.Rect.compare)(),
    __metadata2("design:type", typeof esm_default === "undefined" || typeof esm_default.Rect === "undefined" ? Object : esm_default.Rect)
  ], Layout2.prototype, "layoutRect", void 0);
  Layout2 = __decorate2([
    esm_default.element()
  ], Layout2);
  return Layout2;
});

// ../../sigl/dist/esm/mixins/observed.js
var observed = () => esm_default.mixin((superclass) => {
  return class ObservedMixin extends superclass {
    #offsetLeft;
    #offsetTop;
    #offsetWidth;
    #offsetHeight;
    get offsetLeft() {
      return this.#offsetLeft;
    }
    get offsetTop() {
      return this.#offsetTop;
    }
    get offsetWidth() {
      return this.#offsetWidth;
    }
    get offsetHeight() {
      return this.#offsetHeight;
    }
    #updateOffsets() {
      this.#offsetLeft = super.offsetLeft;
      this.#offsetTop = super.offsetTop;
      this.#offsetWidth = super.offsetWidth;
      this.#offsetHeight = super.offsetHeight;
    }
    matrix = new esm_default.Matrix();
    rect = new esm_default.Rect();
    prevRect = new esm_default.Rect();
    relativeTo = false;
    pos = esm_default(this).reduce(({ $: $4, rect }) => $4.pos?.equals(rect.pos) ? $4.pos : rect.pos);
    size = esm_default(this).reduce(({ $: $4, rect }) => $4.size?.equals(rect.size) ? $4.size : rect.size);
    get ownRect() {
      this.#updateOffsets();
      const offset = esm_default.getElementOffset(this);
      return new esm_default.Rect(offset.x, offset.y, this.offsetWidth, this.offsetHeight);
    }
    mounted($4) {
      $4.rect = $4.fulfill(({ host, relativeTo }) => (fulfill) => $4.chain($4.observe.resize.initial(host, ([_entry]) => {
        const newRect = host.ownRect;
        if (relativeTo) {
          newRect.translateSelf(relativeTo.pos);
        }
        if (!newRect.equals(host.rect)) {
          fulfill(newRect);
        }
      }), $4.on(host).resize(() => {
        const newRect = host.ownRect;
        if (relativeTo) {
          newRect.translateSelf(relativeTo.pos);
        }
        if (!newRect.equals(host.rect)) {
          fulfill(newRect);
        } else {
          if (host.root) {
            host.root.querySelectorAll("*").forEach((el) => {
              el.dispatchEvent(new CustomEvent("resize", {
                bubbles: false,
                composed: false
              }));
            });
          }
        }
      }), $4.on(host).translate((ev) => {
        const diff2 = ev.detail;
        const newRect = $4.rect.translate(diff2);
        if (!newRect.equals(host.rect)) {
          fulfill(newRect);
        }
        host.root?.querySelectorAll("*").forEach((el) => {
          el.dispatchEvent(new CustomEvent("translate", {
            detail: diff2,
            bubbles: false,
            composed: false
          }));
        });
      })));
      $4.effect(({ host, rect }) => {
        if ($4.prevRect.size.equals(rect.size)) {
          const diff2 = rect.pos.screen($4.prevRect.pos);
          if (diff2.sum()) {
          }
        } else {
          host.querySelectorAll("*").forEach((el) => {
            el.dispatchEvent(new CustomEvent("resize", {
              bubbles: false,
              composed: false
            }));
          });
          if (host.root) {
            host.root.querySelectorAll("*").forEach((el) => {
              el.dispatchEvent(new CustomEvent("resize", {
                bubbles: false,
                composed: false
              }));
            });
          }
        }
        return () => {
          $4.prevRect = rect.clone();
        };
      });
    }
  };
});

// ../../sigl/dist/esm/refs.js
var RefProxy = (target) => Getter((key) => ({
  get current() {
    return target[key];
  },
  set current(el) {
    target[key] = el;
  }
}));
var Ref = class extends EventTarget {
  #current;
  key;
  constructor(ref) {
    super();
    defineProperty.enumerable.get(() => this.#current).set((el1) => {
      this.#current = el1;
      dispatch(this, "change", el1);
    })(this, "current");
    Object.assign(this, ref);
  }
};
var PropsRef = class {
  ref = new Ref();
  constructor(props17, key) {
    Object.assign(this, props17?.toJSON?.() ?? props17);
    if (props17 instanceof EventTarget) {
      this.ref.current = props17;
    }
    defineProperty.not.enumerable(this, "_props", props17);
    if (key)
      this.ref.key = key;
  }
};
var RefCollection = class extends EventTarget {
  items = [];
  listeners = /* @__PURE__ */ new Map();
  #construct = (param) => {
    const item = this.construct(param);
    this.listeners.set(item, on(item.ref).change(() => {
      dispatch(this, "change");
    }));
    return item;
  };
  refConstruct(param) {
    return this.#construct(param);
  }
  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }
  get length() {
    return this.items.length;
  }
  get refs() {
    return filterMap(this.items, (x) => x.ref.current);
  }
  refEvents = new MapSet();
  onEvent(eventName, fn2) {
    const refThis = this;
    this.refEvents.add(eventName, fn2);
    let offRefListeners;
    const resetRefListeners = () => {
      offRefListeners?.();
      offRefListeners = chain(this.refs.map((x) => on(x, eventName)(function(ev) {
        return fn2.call(refThis, ev, this);
      })));
    };
    const offChange = on(this, "change")(resetRefListeners);
    resetRefListeners();
    const off = chain(offChange, () => {
      this.refEvents.delete(eventName, fn2);
    }, () => {
      offRefListeners?.();
    });
    return off;
  }
  createItems(entriesOrValues = []) {
    this.items = entriesOrValues.map(this.#construct);
  }
  find(cb) {
    return this.refs.find(cb);
  }
  findIndex(cb) {
    return this.items.map((item) => item.ref.current).findIndex(cb);
  }
  map(cb) {
    return this.items.map(cb);
  }
  filter(cb) {
    return this.items.filter(cb);
  }
  push(state) {
    const result = this.items.push(this.#construct(state));
    dispatch(this, "change");
    return result;
  }
  insertAfter(state, other) {
    const index = this.refs.indexOf(other);
    if (!~index) {
      throw new ReferenceError("Item not in ref collection.");
    }
    const newItem = this.#construct(state);
    this.splice(index + 1, 0, newItem);
    return newItem;
  }
  splice(start, deleteCount, ...args) {
    const result = this.items.splice(start, deleteCount, ...args);
    dispatch(this, "change");
    return result;
  }
  move(oldIndex, newIndex) {
    const item = this.items.splice(oldIndex, 1)[0];
    this.splice(newIndex, 0, item);
  }
  add(...items) {
    for (const item of items) {
      this.items.push(item);
    }
    dispatch(this, "change");
  }
  insertItemAt(index, ...items) {
    this.items.splice(index, 0, ...items);
    dispatch(this, "change");
  }
  getRefItem(item) {
    const index = this.map((refItem) => refItem.ref.current).indexOf(item);
    if (!~index) {
      throw new ReferenceError("Item not in ref collection.");
    }
    return this.items[index];
  }
  remove(item) {
    let index;
    if (item instanceof HTMLElement) {
      index = this.items.indexOf(this.getRefItem(item));
    } else {
      index = this.items.indexOf(item);
    }
    if (!~index) {
      throw new ReferenceError("Item not in ref collection.");
    }
    return this.splice(index, 1)[0];
  }
};
var RefMap = class extends RefCollection {
  #map = /* @__PURE__ */ new Map();
  construct([key, state]) {
    const item = new PropsRef(state, key);
    this.#map.set(item.ref.key, item);
    return item;
  }
  constructor(entries2) {
    super();
    this.createItems(entries2);
  }
  toJSON() {
    return filterMap(this.items, (x) => [
      x.ref.key,
      (x.ref.current?.toJSON && x.ref.current) ?? x._props
    ]);
  }
  get(key, defaultProps = {}) {
    if (this.#map.has(key))
      return this.#map.get(key);
    else {
      const item = this.refConstruct([
        key,
        defaultProps
      ]);
      this.items.push(item);
      return item;
    }
  }
  getRef(key, defaultProps = {}) {
    return this.get(key, defaultProps).ref;
  }
  setRef(key, el1) {
    this.get(key).ref.current = el1;
  }
  delete(key) {
    if (this.#map.has(key)) {
      const item = this.#map.get(key);
      this.#map.delete(key);
      this.remove(item);
    }
  }
};
var RefSet = class extends RefCollection {
  construct(state) {
    return new PropsRef(state);
  }
  constructor(values) {
    super();
    this.createItems(values);
  }
  get(id) {
    return this.refs.find((ref) => ref.id === id);
  }
  has(id) {
    return !!this.get(id);
  }
  at(index, defaultProps = {}) {
    if (this.items[index])
      return this.items[index];
    else {
      const item = this.refConstruct(defaultProps);
      this.splice(index, 0, item);
      return item;
    }
  }
  push(state) {
    if (state instanceof HTMLElement) {
      const item = this.refConstruct({});
      item.ref.current = state;
      const length = this.items.length;
      super.add(item);
      return length + 1;
    }
    return super.push(state);
  }
  insertAt(index, state) {
    if (state instanceof HTMLElement) {
      const item = this.refConstruct({});
      item.ref.current = state;
      super.insertItemAt(index, item);
    }
    const item1 = this.refConstruct(state);
    return super.insertItemAt(index, item1);
  }
  toJSON() {
    return filterMap(this.items, (x) => (x.ref.current?.toJSON && x.ref.current) ?? x._props);
  }
};

// ../../sigl/dist/esm/slots.js
var observeNodes = (nodes, observer, options) => nodes?.forEach((node) => observer.observe(node, options));
var nodesToText = (nodes) => nodes?.map((node) => {
  const text = node.textContent;
  return text.trim().length ? text : "";
}).join("") ?? "";
var slotted2 = (slots, options) => ({
  get nodes() {
    return slots.map((slot) => slot.assignedNodes(options)).flat(Infinity);
  },
  get elements() {
    return slots.map((slot) => slot.assignedElements(options)).flat(Infinity);
  },
  get firstChild() {
    return this.elements[0];
  }
});
var onSlotChange = (el, cb, fn2 = (el2) => el2 instanceof HTMLSlotElement ? [
  el2
] : [
  ...el2.querySelectorAll("slot")
], options) => on(el, "slotchange")(() => cb(slotted2(fn2(el), options)));
var onTextChange = (el, cb, fn2) => {
  let observer;
  const off = onSlotChange(el, ({ nodes }) => {
    observer?.disconnect();
    if (nodes.length) {
      observer = new MutationObserver(() => cb(nodesToText(nodes)));
      observeNodes(nodes, observer, {
        characterData: true
      });
      cb(nodesToText(nodes));
    }
  }, fn2);
  return () => {
    observer?.disconnect();
    return off();
  };
};

// ../../sigl/dist/esm/util/warn.js
var warn = (fn2) => function(...args) {
  try {
    return fn2.apply(this, args);
  } catch (e) {
    console.warn(e);
  }
};

// ../../html-vdom/dist/esm/from-element.js
if (!customElements.getName) {
  const tags = /* @__PURE__ */ new WeakMap();
  const { define: define2 } = customElements;
  customElements.define = function(name, ctor, options) {
    tags.set(ctor, name);
    return define2.call(customElements, name, ctor, options);
  };
  customElements.getName = function(ctor) {
    return tags.get(ctor);
  };
}
var suffixKey = 0;
var fromElement = (ctor, options = ctor.elementOptions ?? {}, defaultProps = {}) => {
  let fn2;
  let tag = customElements.getName(ctor);
  if (!tag) {
    tag = kebab(ctor.name).replace("-element", "");
    if (!tag.includes("-"))
      tag = "x-" + tag;
    while (customElements.get(tag) != null) {
      tag += (++suffixKey).toString(36);
    }
    customElements.define(tag, ctor, options);
  }
  if (options.extends)
    fn2 = (props17) => jsx(options.extends, Object.assign({}, defaultProps, props17, {
      is: tag
    }), void 0);
  else
    fn2 = (props17) => jsx(tag, Object.assign({}, defaultProps, props17), void 0);
  fn2.toString = () => tag;
  return fn2;
};

// ../../sigl/dist/esm/attrs.js
var AttrTypes = /* @__PURE__ */ new Map([
  [
    String,
    (x) => x?.toString()
  ],
  [
    Number,
    (x) => parseFloat(x)
  ],
  [
    Boolean,
    (x) => x = x === false ? false : x != null
  ]
]);
var applyAttrs = (self2, data, initialUpdates) => {
  for (const [k, v] of Object.entries(data)) {
    if ([
      String,
      Number,
      Boolean
    ].includes(v))
      self2[k] = data[k] = void 0;
    else if (v === true)
      data[k] = true;
    else if (typeof v === "object")
      data[k] = v.toString();
  }
  const update = (attr2, key, value) => {
    if (typeof value === "boolean") {
      if (value) {
        self2.setAttribute(attr2, "");
      } else {
        if (self2.hasAttribute(attr2)) {
          self2.removeAttribute(attr2);
        } else {
          data[key] = false;
        }
      }
    } else {
      self2.setAttribute(attr2, value);
    }
  };
  return accessors(self2, data, (key) => {
    const attr2 = key.toLowerCase();
    return {
      get: () => data[key],
      set(value) {
        if (!self2.isConnected)
          initialUpdates.push(() => update(attr2, key, value));
        else
          update(attr2, key, value);
      }
    };
  });
};
var attrListener = (body) => new Function("event", `with(this){let fn=${body};return typeof fn=='function'?fn.call(this,event):fn}`);

// ../../sigl/dist/esm/element.js
function element2(ctorOrOptions, options, defaultProps) {
  if (typeof ctorOrOptions === "function")
    return fromElement(ctorOrOptions, options, defaultProps);
  if (typeof ctorOrOptions === "object")
    options = ctorOrOptions;
  return (superclass) => {
    const parent = superclass;
    const ownPropertyMap = protoPropertyMap.get(superclass.prototype) ?? /* @__PURE__ */ new Map();
    const ownAttrKeys = [
      ...ownPropertyMap
    ].filter(([, settings]) => settings.attr).map(([key]) => key);
    const attrKeysMap = new Map(ownAttrKeys.map((x) => [
      x.toLowerCase(),
      x
    ]));
    const attrTypes = /* @__PURE__ */ new Map();
    const ownObservedAttributes = [
      ...attrKeysMap.keys()
    ];
    const ctor = class extends parent {
      static get elementOptions() {
        return options ?? super.elementOptions;
      }
      static get observedAttributes() {
        return ownObservedAttributes.concat(super.observedAttributes ?? []);
      }
      static get attributeKeys() {
        return ownAttrKeys.concat(super.attributeKeys ?? []);
      }
      static get propertyMap() {
        const mergedPropertyMap = /* @__PURE__ */ new Map();
        for (const [key, superSettings] of super.propertyMap ?? []) {
          if (ownPropertyMap.has(key)) {
            const mergedSettings = Object.assign({}, superSettings, ownPropertyMap.get(key));
            mergedPropertyMap.set(key, mergedSettings);
          } else {
            mergedPropertyMap.set(key, superSettings);
          }
        }
        for (const [key1, ownSettings] of ownPropertyMap) {
          if (!mergedPropertyMap.has(key1)) {
            mergedPropertyMap.set(key1, ownSettings);
          }
        }
        return mergedPropertyMap;
      }
      static get exposedPropertyKeys() {
        return [
          ...ctor.propertyMap
        ].filter(([, settings]) => settings.out).map(([key]) => key);
      }
      static get clonedPropertyKeys() {
        return [
          ...ctor.propertyMap
        ].filter(([, settings]) => settings.out && settings.clone).map(([key]) => key);
      }
      #isMain = true;
      #attrData;
      #attrInitialUpdates = [];
      $;
      host = this;
      isMounted = false;
      preventUnmount = false;
      constructor(...args) {
        super(...args);
        this.#isMain = new.target === ctor;
        if (this.#isMain) {
          defineProperty.not.enumerable(this, "_ctor", ctor);
          if (this.debug) {
            console.groupCollapsed("CREATE", this.constructor.name);
          }
          this.#create();
          Object.assign(this, args[0]);
          this.context.tailQueue.add(() => {
            this.#flushAttributeUpdates();
          });
          if (this.debug) {
            console.groupEnd();
          }
        }
      }
      toJSON() {
        const json = pick2(this, ctor.exposedPropertyKeys);
        ctor.clonedPropertyKeys.forEach((key) => {
          json[key] = Array.isArray(json[key]) ? [
            ...json[key]
          ] : {
            ...json[key]
          };
        });
        return json;
      }
      _scheduleProperty(key, ...args) {
        const symbol = Symbol();
        this._pendingProperties ??= /* @__PURE__ */ new Map();
        this._pendingProperties.set(symbol, [
          key,
          args
        ]);
        return symbol;
      }
      _getPropertySettings(key) {
        return ctor.propertyMap.get(key);
      }
      #applyAttributes() {
        const attrs = pick2(this, ctor.attributeKeys);
        for (const [key, value] of entries(attrs)) {
          const valueCtor = value?.constructor;
          if (valueCtor?.from) {
            const settings = ctor.propertyMap.get(key);
            settings.is = valueCtor;
          }
          const type = value == null ? AttrTypes.get(String) : AttrTypes.get(value) ?? (valueCtor ? AttrTypes.get(valueCtor) ?? (Object.hasOwn(valueCtor.prototype, "toString") ? AttrTypes.get(String) : null) : null);
          if (!type) {
            throw new TypeError(`Attribute "${key}" is not valid type, must be either: String, Number, Boolean, null, undefined`);
          }
          attrTypes.set(key, type);
          attrKeysMap.set(key.toLowerCase(), key);
        }
        this.#attrData = attrs;
        applyAttrs(this, attrs, this.#attrInitialUpdates);
      }
      #flushAttributeUpdates() {
        this.#attrInitialUpdates.splice(0).forEach((fn2) => fn2());
      }
      #attachReactiveContext() {
        ContextClass.attach(this, omit2(esm_default, [
          "transition"
        ]));
        this.host.on = esm_default.on.bind(this, this);
        this.host.dispatch = esm_default.dispatchBind(this);
      }
      #registerChangeEvents() {
        const keys2 = new Set(ctor.exposedPropertyKeys);
        const changeTask = esm_default.queue.task(() => {
          esm_default.dispatch.composed(this.host, "change");
        });
        for (const key1 of keys2) {
          const settings1 = ctor.propertyMap.get(key1);
          const fn2 = wrapQueue(settings1)(changeTask);
          this.$.effect.keys(/* @__PURE__ */ new Set([
            key1
          ]))(fn2);
        }
      }
      #create() {
        this.#attachReactiveContext();
        let initial = true;
        this.context.setupScheduled();
        this.#applyAttributes();
        esm_default.on(this.host).mounted(() => {
          if (this.isMounted)
            return;
          if (initial) {
            initial = false;
          } else {
            this.context.setupScheduled();
          }
          this.#flushAttributeUpdates();
          this.#registerChangeEvents();
        });
        this.$.render = this.$.effect.cb((result) => {
          render(result, this.root ?? (this.root = esm_default.shadow(this)));
          return false;
        });
        this.$.part = toFluent(EffectOptions2, (options2) => (fn2, output) => {
          let update;
          const origin2 = this.context.debug ? [
            new Error()
          ] : [];
          const cb = (value) => {
            if (value !== void 0)
              output = value;
            if (update)
              this.$.tailQueue.add(update);
            return false;
          };
          const Fn = () => {
            if (!update) {
              this.$.register(new Fx({
                fn: fn2,
                cb,
                options: options2,
                origin: origin2,
                dispose: cb
              }));
            }
            update = hook;
            return output;
          };
          return Fn;
        });
        this.$.ref = RefProxy(this.$);
        this.created?.(this.$);
        esm_default.on(this.host).unmounted(() => {
          if (!initial) {
            this.$.cleanup();
          }
        });
      }
      dispatchEvent(event2) {
        const onEventType = `on${event2.type}`;
        if (this.debug && this.#isMain) {
          console.groupCollapsed(event2.type.toUpperCase(), this.constructor.name);
        }
        let pass = true;
        if (this.#isMain && Object.hasOwn(this, onEventType)) {
          let fn2 = this[onEventType];
          if (fn2) {
            if (!fn2)
              fn2 = attrListener(this.getAttribute(onEventType));
            pass = fn2.call(this, event2);
          }
        }
        if (pass !== false) {
          const fn1 = getOwnProperty(super.constructor.prototype, onEventType);
          if (fn1)
            pass = fn1.call(this, event2);
        }
        if (pass !== false) {
          const fn2 = getOwnProperty(super.constructor.prototype, event2.type);
          if (fn2) {
            pass = fn2.call(this, this.$, event2);
          }
        }
        if (pass !== false)
          super.dispatchEvent(event2);
        if (this.debug && this.#isMain) {
          console.groupEnd();
        }
        return pass;
      }
      connectedCallback() {
        if (!this.#isMain) {
          super.connectedCallback?.();
          return;
        }
        super.connectedCallback?.();
        if (!this.isMounted) {
          this.host.dispatch("mounted");
          this.isMounted = true;
        }
      }
      disconnectedCallback() {
        if (!this.#isMain) {
          super.disconnectedCallback?.();
          return;
        }
        super.disconnectedCallback?.();
        queueMicrotask(() => {
          if (!this.isConnected && !this.preventUnmount) {
            this.isMounted = false;
            this.host.dispatch("unmounted");
          }
        });
      }
      attributeChangedCallback(name, oldValue, newValue) {
        if (!this.#isMain) {
          super.attributeChangedCallback?.(name, oldValue, newValue);
          return;
        }
        let key;
        if (key = attrKeysMap.get(name)) {
          const { is: is2, compare: compare2 } = ctor.propertyMap.get(key);
          const prev = this.#attrData[key];
          const next = attrTypes.get(key)(newValue);
          const isDifferent = is2 ? prev != next : compare2 ? !compare2(prev, next) : !Object.is(prev, next);
          if (isDifferent) {
            this.#attrData[key] = next;
            this[key] = is2 ? this[key] == next ? this[key] : is2.from(next) : next;
            this.propertyChangedCallback?.(key, prev, next);
          }
        }
        super.attributeChangedCallback?.(name, oldValue, newValue);
      }
    };
    defineProperty(ctor, "name", superclass.name);
    return ctor;
  };
}

// ../../sigl/dist/esm/sigl-common.js
var sigl_common_default = {};

// ../../sigl/dist/esm/reactive.js
function reactive() {
  return (superclass) => {
    const parent = superclass;
    const ownPropertyMap = protoPropertyMap.get(superclass.prototype) ?? /* @__PURE__ */ new Map();
    const ctor = class extends parent {
      static get propertyMap() {
        return new Map([
          ...ownPropertyMap,
          ...super.propertyMap ?? []
        ]);
      }
      static get exposedPropertyKeys() {
        return [
          ...ctor.propertyMap
        ].filter(([, settings]) => settings.out).map(([key]) => key);
      }
      static get clonedPropertyKeys() {
        return [
          ...ctor.propertyMap
        ].filter(([, settings]) => settings.out && settings.clone).map(([key]) => key);
      }
      self = this;
      $;
      constructor(...args) {
        super(...args);
        ContextClass.attach(this, omit2(sigl_common_default, [
          "transition"
        ]));
        this.context.setupScheduled();
        this.created?.(this.$);
        Object.assign(this, args[0]);
      }
      toJSON() {
        const json = pick2(this, ctor.exposedPropertyKeys);
        ctor.clonedPropertyKeys.forEach((key) => {
          json[key] = Object.assign({}, json[key]);
        });
        return json;
      }
      destroy() {
        this.context.cleanup();
      }
      _scheduleProperty(key, ...args) {
        const symbol = Symbol();
        this._pendingProperties ??= /* @__PURE__ */ new Map();
        this._pendingProperties.set(symbol, [
          key,
          args
        ]);
        return symbol;
      }
    };
    defineProperty(ctor, "name", superclass.name);
    return ctor;
  };
}

// ../../sigl/dist/esm/sigl.js
function inherit(ctor) {
  return ctor;
}
function _(ctx) {
  if (typeof ctx === "function") {
    return ctx;
  } else if (ctx instanceof HTMLElement) {
    const c = ctx;
    const shadow2 = esm_default.shadow.bind(null, ctx);
    const slotted3 = slotted(c);
    return Getter((key) => {
      switch (key) {
        case "shadow":
          return shadow2;
        case "slotted":
          return slotted3;
        case "state":
          return (states2, guard, AnimSettings) => new State2(states2, guard, AnimSettings);
        default: {
          return FluentCapture()[key];
        }
      }
    });
  } else {
    return Getter((key) => {
      switch (key) {
        default: {
          return FluentCapture()[key];
        }
      }
    });
  }
}
var mixin = (mixin3) => {
  return (realsuperclass) => esm_default.element()(mixin3(realsuperclass));
};

// ../../sigl/dist/esm/index.js
globalThis.Reflect.metadata ??= () => {
};
var $2 = Object.assign(_, sigl_exports, {
  String,
  Number,
  Boolean
});
Object.assign(sigl_common_default, $2);
var esm_default = $2;

// ../../sigl/dist/esm/sigl-worker.js
var sigl_worker_exports = {};
__export(sigl_worker_exports, {
  AbortOptions: () => AbortOptions,
  ContextClass: () => ContextClass,
  DispatchOptions: () => DispatchOptions,
  EventOptions: () => EventOptions,
  Intersect: () => Intersect,
  Line: () => Line,
  Matrix: () => Matrix,
  Morph: () => Morph,
  MouseButton: () => MouseButton,
  OnOptions: () => OnOptions,
  Point: () => Point,
  Polygon: () => Polygon,
  Polyline: () => Polyline,
  PropertySettings: () => PropertySettings,
  QueueOptions: () => QueueOptions,
  Rect: () => Rect,
  Scalar: () => Scalar,
  Shape: () => Shape,
  Task: () => Task,
  Vec3: () => Vec3,
  _: () => _2,
  abort: () => abort,
  attr: () => attr,
  cardinal: () => cardinal,
  chain: () => chain,
  clone: () => clone,
  compare: () => compare,
  css: () => css,
  cssToJs: () => cssToJs,
  dispatch: () => dispatch,
  dispatchBind: () => dispatchBind,
  event: () => event,
  is: () => is,
  jsToCss: () => jsToCss,
  mix: () => pipeInto,
  mixin: () => mixin2,
  on: () => on,
  onAll: () => onAll,
  out: () => out,
  prop: () => prop,
  protoPropertyMap: () => protoPropertyMap,
  queue: () => queue,
  reactive: () => reactive,
  taskGroup: () => taskGroup,
  taskRun: () => taskRun,
  warn: () => warn,
  wrapEvent: () => wrapEvent,
  wrapQueue: () => wrapQueue
});
function _2(ctx) {
  if (typeof ctx === "function") {
    return ctx;
  } else {
    return Getter((key) => {
      switch (key) {
        default: {
          return FluentCapture()[key];
        }
      }
    });
  }
}
var mixin2 = (mixin3) => (realsuperclass) => reactive()(mixin3(realsuperclass));

// ../../sigl/dist/esm/worker.js
globalThis.Reflect.metadata ??= () => {
};
var $3 = Object.assign(_2, sigl_worker_exports, {
  String,
  Number,
  Boolean
});
Object.assign(sigl_common_default, $3);
var worker_default = $3;

// ../../zerolag/dist/esm/point.js
var Point2 = class {
  x = 0;
  y = 0;
  constructor(p) {
    if (p) {
      this.x = p.x;
      this.y = p.y;
    }
  }
  set(p) {
    this.x = p.x;
    this.y = p.y;
  }
  isNotZero() {
    return this.x !== 0 || this.y !== 0;
  }
  copy() {
    return new Point2(this);
  }
  equal(p) {
    return this.x === p.x && this.y === p.y;
  }
  addRight(x) {
    this.x += x;
    return this;
  }
  abs() {
    return new Point2({
      x: Math.abs(this.x),
      y: Math.abs(this.y)
    });
  }
  sign() {
    return new Point2({
      x: Math.sign(this.x),
      y: Math.sign(this.y)
    });
  }
  div(p) {
    return new Point2({
      x: this.x / (p.x || p.width || 0),
      y: this.y / (p.y || p.height || 0)
    });
  }
  floorDiv(p) {
    return new Point2({
      x: this.x / (p.x || p.width || 0) | 0,
      y: this.y / (p.y || p.height || 0) | 0
    });
  }
  roundDiv(p) {
    return new Point2({
      x: Math.round(this.x / (p.x || p.width || 0)),
      y: Math.round(this.y / (p.y || p.height || 0))
    });
  }
  ceilDiv(p) {
    return new Point2({
      x: Math.ceil(this.x / (p.x || p.width || 0)),
      y: Math.ceil(this.y / (p.y || p.height || 0))
    });
  }
  add(p) {
    return new Point2({
      x: this.x + (p.x || p.width || 0),
      y: this.y + (p.y || p.height || 0)
    });
  }
  sub(p) {
    return new Point2({
      x: this.x - (p.x || p.width || 0),
      y: this.y - (p.y || p.height || 0)
    });
  }
  mul(p) {
    return new Point2({
      x: this.x * (p.x || p.width || 0),
      y: this.y * (p.y || p.height || 0)
    });
  }
  ceilMul(p) {
    return new Point2({
      x: Math.ceil(this.x * (p.x || p.width || 0)),
      y: Math.ceil(this.y * (p.y || p.height || 0))
    });
  }
  roundMul(p) {
    return new Point2({
      x: Math.round(this.x * (p.x || p.width || 0)),
      y: Math.round(this.y * (p.y || p.height || 0))
    });
  }
  floorMul(p) {
    return new Point2({
      x: this.x * (p.x || p.width || 0) | 0,
      y: this.y * (p.y || p.height || 0) | 0
    });
  }
  lerp(p, a) {
    return new Point2({
      x: this.x + (p.x - this.x) * a,
      y: this.y + (p.y - this.y) * a
    });
  }
  clamp(area) {
    return Point2.clamp(area, this);
  }
  toString() {
    return this.x + "," + this.y;
  }
  static sort(a, b) {
    return a.y === b.y ? a.x - b.x : a.y - b.y;
  }
  static gridRound(b, a) {
    return {
      x: Math.round(a.x / b.width),
      y: Math.round(a.y / b.height)
    };
  }
  static low(low, p) {
    return {
      x: Math.max(low.x, p.x),
      y: Math.max(low.y, p.y)
    };
  }
  static clamp(area, p) {
    return new Point2({
      x: Math.min(area.end?.x ?? area.width, Math.max(area.begin?.x ?? 0, p.x)),
      y: Math.min(area.end?.y ?? area.height, Math.max(area.begin?.y ?? 0, p.y))
    });
  }
  static offset(b, a) {
    return {
      x: a.x + b.x,
      y: a.y + b.y
    };
  }
  static offsetX(x, p) {
    return {
      x: p.x + x,
      y: p.y
    };
  }
  static offsetY(y, p) {
    return {
      x: p.x,
      y: p.y + y
    };
  }
  static toLeftTop(p) {
    return {
      left: p.x,
      top: p.y
    };
  }
};
var proto = Point2.prototype;
proto["/"] = proto.div;
proto["_/"] = proto.floorDiv;
proto["o/"] = proto.roundDiv;
proto["^/"] = proto.ceilDiv;
proto["+"] = proto.plus = proto.add;
proto["-"] = proto.minus = proto.sub;
proto["*"] = proto.mul;
proto["^*"] = proto.ceilMul;
proto["o*"] = proto.roundMul;
proto["_*"] = proto.floorMul;

// ../../zerolag/dist/esm/area.js
var Area = class {
  static offset(b, a) {
    return {
      begin: Point2.offset(b.begin, a.begin),
      end: Point2.offset(b.end, a.end)
    };
  }
  static offsetX(x, a) {
    return {
      begin: Point2.offsetX(x, a.begin),
      end: Point2.offsetX(x, a.end)
    };
  }
  static offsetY(y, a) {
    return {
      begin: Point2.offsetY(y, a.begin),
      end: Point2.offsetY(y, a.end)
    };
  }
  static sort(a, b) {
    return a.begin.y === b.begin.y ? a.begin.x - b.begin.x : a.begin.y - b.begin.y;
  }
  static toPointSort(a, b) {
    return a.begin.y <= b.y && a.end.y >= b.y ? a.begin.y === b.y ? a.begin.x - b.x : a.end.y === b.y ? a.end.x - b.x : 0 : a.begin.y - b.y;
  }
  static join(areas) {
    const sorted = areas.map((a) => a.get()).flatMap((a) => [
      a.begin,
      a.end
    ]).sort(Point2.sort);
    const begin = sorted[0];
    const end = sorted.at(-1);
    return new Area({
      begin,
      end
    });
  }
  begin;
  end;
  constructor(a) {
    if (a) {
      this.begin = new Point2(a.begin);
      this.end = new Point2(a.end);
    } else {
      this.begin = new Point2();
      this.end = new Point2();
    }
  }
  copy() {
    return new Area(this);
  }
  get() {
    const s = [
      this.begin,
      this.end
    ].sort(Point2.sort);
    return new Area({
      begin: new Point2(s[0]),
      end: new Point2(s[1])
    });
  }
  set(area) {
    this.begin.set(area.begin);
    this.end.set(area.end);
  }
  get height() {
    const { begin, end } = this.get();
    return end.y - begin.y;
  }
  setLeft(bx, ex) {
    this.begin.x = bx;
    if (ex != null)
      this.end.x = ex;
    return this;
  }
  addRight(x) {
    this.begin.x += x;
    this.end.x += x;
    return this;
  }
  addBottom(y) {
    this.end.y += y;
    return this;
  }
  shiftByLines(y) {
    this.begin.y += y;
    this.end.y += y;
    return this;
  }
  normalizeY() {
    return this.shiftByLines(-this.begin.y);
  }
  greaterThan(a) {
    return this.begin.y === a.end.y ? this.begin.x > a.end.x : this.begin.y > a.end.y;
  }
  greaterThanOrEqual(a) {
    return this.begin.y === a.begin.y ? this.begin.x >= a.begin.x : this.begin.y > a.begin.y;
  }
  lessThan(a) {
    return this.end.y === a.begin.y ? this.end.x < a.begin.x : this.end.y < a.begin.y;
  }
  lessThanOrEqual(a) {
    return this.end.y === a.end.y ? this.end.x <= a.end.x : this.end.y < a.end.y;
  }
  isEmpty() {
    return this.begin.equal(this.end);
  }
  inside(a) {
    return this[">"](a) && this["<"](a);
  }
  outside(a) {
    return this["<"](a) || this[">"](a);
  }
  insideEqual(a) {
    return this[">="](a) && this["<="](a);
  }
  outsideEqual(a) {
    return this["<="](a) || this[">="](a);
  }
  equal(a) {
    return this.begin.x === a.begin.x && this.begin.y === a.begin.y && this.end.x === a.end.x && this.end.y === a.end.y;
  }
  beginLineEqual(a) {
    return this.begin.y === a.begin.y;
  }
  endLineEqual(a) {
    return this.end.y === a.end.y;
  }
  linesEqual(a) {
    return this["|="](a) && this["=|"](a);
  }
  sameLine(a) {
    return this.begin.y === this.end.y && this.begin.y === a.begin.y;
  }
  shortenByX(x) {
    return new Area({
      begin: {
        x: this.begin.x + x,
        y: this.begin.y
      },
      end: {
        x: this.end.x - x,
        y: this.end.y
      }
    });
  }
  widenByX(x) {
    return new Area({
      begin: {
        x: this.begin.x - x,
        y: this.begin.y
      },
      end: {
        x: this.end.x + x,
        y: this.end.y
      }
    });
  }
  toString() {
    const area = this.get();
    return "" + area.begin + "|" + area.end;
  }
};
var proto2 = Area.prototype;
proto2[">"] = proto2.greaterThan;
proto2[">="] = proto2.greaterThanOrEqual;
proto2["<"] = proto2.lessThan;
proto2["<="] = proto2.lessThanOrEqual;
proto2["><"] = proto2.inside;
proto2["<>"] = proto2.outside;
proto2[">=<"] = proto2.insideEqual;
proto2["<=>"] = proto2.outsideEqual;
proto2["==="] = proto2.equal;
proto2["|="] = proto2.beginLineEqual;
proto2["=|"] = proto2.endLineEqual;
proto2["|=|"] = proto2.linesEqual;
proto2["=|="] = proto2.sameLine;
proto2["-x-"] = proto2.shortenByX;
proto2["+x+"] = proto2.widenByX;

// ../../zerolag/dist/esm/event.js
var Event2 = class {
  _handlers = {};
  silent;
  _getHandlers(name) {
    return this._handlers[name] = this._handlers[name] || [];
  }
  emit(name, a, b, c, d) {
    if (this.silent)
      return;
    const handlers = this._getHandlers(name);
    for (let i = 0; i < handlers.length; i++) {
      handlers[i](a, b, c, d);
    }
  }
  on(name, ...newHandlers) {
    this._getHandlers(name).push(...newHandlers);
  }
  off(name, handler) {
    const handlers = this._getHandlers(name);
    const index = handlers.indexOf(handler);
    if (~index)
      handlers.splice(index, 1);
  }
  once(name, fn2) {
    const handlers = this._getHandlers(name);
    const handler = function(a, b, c, d) {
      fn2(a, b, c, d);
      handlers.splice(handlers.indexOf(handler), 1);
    };
    handlers.push(handler);
  }
};

// ../../zerolag/dist/esm/regexp.js
var _Regexp = class {
  static create(names, flags = "", fn2 = (s) => s) {
    return new RegExp(names.map((n) => "string" === typeof n ? _Regexp.types[n] : n).map((r) => fn2(r.toString().slice(1, -1))).join("|"), flags);
  }
  static join(regexps, flags) {
    return new RegExp(regexps.map((n) => "string" === typeof n ? [
      n,
      _Regexp.types[n]
    ] : n).map((r) => (r[2] ?? "") + "(?<" + r[0].replace(/\s/g, "_") + ">" + r[1].toString().slice(1, -1) + ")").join("|"), flags);
  }
  static parse(s, regexp, filter3) {
    const words = [];
    let word;
    if (filter3) {
      while (word = regexp.exec(s)) {
        if (filter3(word))
          words.push(word);
      }
    } else {
      while (word = regexp.exec(s)) {
        words.push(word);
      }
    }
    return words;
  }
};
var Regexp = _Regexp;
__publicField(Regexp, "types", {
  tokens: /.+?\b|.\B|\b.+?/,
  definition: /[a-zA-Z_]+?(?=\(.*\)=)/,
  buffer: /#/,
  call: /[a-zA-Z_]+?(?=\()/,
  words: /[a-zA-Z0-9]{1,}/,
  parts: /[./\\()"'\-:,.;<>~!@#$%^&*|+=[\]{}`~? ]+/,
  "single comment": /\\.*?$/,
  "double comment": /\/\*[^]*?\*\//,
  "single quote string": /('(?:(?:\\\n|\\'|[^'\n]))*?')/,
  "double quote string": /("(?:(?:\\\n|\\"|[^"\n]))*?")/,
  "template string": /(`(?:(?:\\`|[^`]))*?`)/,
  operator: /!|::|:|>=?|<=?|={1,3}|(?:&){1,2}|\|?\||\?|\*|\/|~|\^|%|\+{1,2}|-{1,2}/,
  attribute: / ((?!\d|[. ]*?(if|else|do|for|case|try|catch|while|with|switch))[a-zA-Z0-9_ $]+)(?=\(.*\).*{)/,
  keyword: /\b(drop|async|await|break|case|catch|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|if|implements|import|in|instanceof|interface|let|new|package|private|protected|public|return|static|super|switch|throw|try|typeof|while|with|yield)\b/,
  declare: /\b(function|interface|class|var|let|const|enum|void)\b/,
  variable: /\b(Object|Function|Boolean|Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|SyntaxError|TypeError|URIError|Number|Math|Date|String|RegExp|Array|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|ArrayBuffer|DataView|JSON|Intl|arguments|console|window|document|Symbol|Set|Map|WeakSet|WeakMap|Proxy|Reflect|Promise)\b/,
  special: /\b(true|false|null|undefined)\b/,
  params: /function[ (]{1}[^]*?\{/,
  number: /-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|-?Infinity)\b/,
  brackets: /[{}()[\]]/,
  symbol: /[;,.]/,
  regexp: /(?![^/])(\/(?![/|*]).*?[^\\^]\/)([;\n.)\]} gim])/,
  xml: /<[^>]*>/,
  url: /((\w+:\/\/)[-a-zA-Z0-9:@;?&=/%+.*!'(),$_{}^~[\]`#|]+)/,
  indent: /^ +|^\t+/,
  line: /^.+$|^\n/,
  newline: /\r\n|\r|\n/
});
Regexp.types.comment = Regexp.create([
  "single comment",
  "double comment"
]);
Regexp.types.string = Regexp.create([
  "single quote string",
  "double quote string",
  "template string"
]);
Regexp.types.multiline = Regexp.create([
  "double comment",
  "template string",
  "indent",
  "line"
]);

// ../../zerolag/dist/esm/skipstring.js
var Node = class Node2 {
  value;
  level;
  width;
  next;
  constructor(value, level) {
    this.value = value;
    this.level = level;
    this.width = new Array(this.level).fill(value && value.length || 0);
    this.next = new Array(this.level).fill(null);
  }
  get length() {
    return this.width[0];
  }
};
var SkipString = class {
  levels;
  bias;
  head;
  chunkSize;
  constructor({ levels = 11, bias = 1 / Math.E, chunkSize = 5e3 } = {}) {
    this.levels = levels;
    this.bias = bias;
    this.head = new Node(null, this.levels);
    this.chunkSize = chunkSize;
  }
  get length() {
    return this.head.width[this.levels - 1];
  }
  get(offset) {
    return this.search(offset, true);
  }
  set(text) {
    this.insertChunked(0, text);
  }
  search(offset, incl) {
    incl = incl ? 0.1 : 0;
    const steps = new Array(this.levels);
    const width = new Array(this.levels);
    let i = this.levels;
    let node = this.head;
    while (i--) {
      while (node && offset + incl > node.width[i] && null != node.next[i]) {
        offset -= node.width[i];
        node = node.next[i];
      }
      steps[i] = node;
      width[i] = offset;
    }
    return {
      node,
      steps,
      width,
      offset
    };
  }
  splice(s, _offset, value, level = this.randomLevel()) {
    const steps = s.steps;
    const width = s.width;
    let p;
    const q = new Node(value, level);
    const length = q.width[0];
    let i;
    i = level;
    while (i--) {
      p = steps[i];
      q.next[i] = p.next[i];
      p.next[i] = q;
      q.width[i] = p.width[i] - width[i] + length;
      p.width[i] = width[i];
    }
    i = this.levels;
    while (i-- > level) {
      p = steps[i];
      p.width[i] += length;
    }
    return q;
  }
  insert(offset, value, level) {
    const s = this.search(offset);
    if (s.node && s.offset && s.node.value && s.offset < s.node.value.length) {
      this.update(s, insert(s.offset, s.node.value, value));
      return s.node;
    }
    return this.splice(s, offset, value, level);
  }
  update(s, value) {
    const length = s.node.value.length - value.length;
    s.node.value = value;
    let i;
    i = this.levels;
    while (i--) {
      s.steps[i].width[i] -= length;
    }
    return length;
  }
  remove(range) {
    if (range[1] > this.length) {
      throw new Error("range end over maximum length(" + this.length + "): [" + range.join() + "]");
    }
    let x = range[1] - range[0];
    const s = this.search(range[0]);
    const offset = s.offset;
    const steps = s.steps;
    let node = s.node;
    if (this.head === node)
      node = node.next[0];
    if (offset) {
      if (offset < node.width[0]) {
        x -= this.update(s, node.value.slice(0, offset) + node.value.slice(offset + Math.min(x, node.length - offset)));
      }
      node = node.next[0];
      if (!node)
        return;
    }
    while (node && x >= node.width[0]) {
      x -= this.removeNode(steps, node);
      node = node.next[0];
    }
    if (x) {
      this.replace(steps, node, node.value.slice(x));
    }
  }
  removeNode(steps, node) {
    const length = node.width[0];
    let i;
    i = node.level;
    while (i--) {
      steps[i].width[i] -= length - node.width[i];
      steps[i].next[i] = node.next[i];
    }
    i = this.levels;
    while (i-- > node.level) {
      steps[i].width[i] -= length;
    }
    return length;
  }
  replace(steps, node, value) {
    const length = node.value.length - value.length;
    node.value = value;
    let i;
    i = node.level;
    while (i--) {
      node.width[i] -= length;
    }
    i = this.levels;
    while (i-- > node.level) {
      steps[i].width[i] -= length;
    }
    return length;
  }
  removeCharAt(offset) {
    return this.remove([
      offset,
      offset + 1
    ]);
  }
  insertChunked(offset, text) {
    for (let i = 0; i < text.length; i += this.chunkSize) {
      const chunk2 = text.substr(i, this.chunkSize);
      this.insert(i + offset, chunk2);
    }
  }
  substring(a, b) {
    const length = b - a;
    const search = this.search(a, true);
    let node = search.node;
    if (this.head === node)
      node = node.next[0];
    let d = length + search.offset;
    let s = "";
    while (node && d >= 0) {
      d -= node.width[0];
      s += node.value;
      node = node.next[0];
    }
    if (node) {
      s += node.value;
    }
    return s.substr(search.offset, length);
  }
  randomLevel() {
    let level = 1;
    while (level < this.levels - 1 && Math.random() < this.bias)
      level++;
    return level;
  }
  getRange(range = [
    0,
    0
  ]) {
    return this.substring(range[0], range[1]);
  }
  copy() {
    const copy = new SkipString();
    let node = this.head;
    let offset = 0;
    while (node = node.next[0]) {
      copy.insert(offset, node.value);
      offset += node.width[0];
    }
    return copy;
  }
  joinString(delimiter) {
    const parts = [];
    let node = this.head;
    while (node = node.next[0]) {
      parts.push(node.value);
    }
    return parts.join(delimiter);
  }
  toString() {
    return this.substring(0, this.length);
  }
};
function insert(offset, string, part) {
  return string.slice(0, offset) + part + string.slice(offset);
}

// ../../zerolag/dist/esm/prefixtree.js
var WORD = /[a-zA-Z0-9]{1,}/g;
var PrefixTreeNode = class {
  value;
  rank;
  children;
  constructor() {
    this.value = "";
    this.rank = 0;
    this.children = {};
  }
  getChildren() {
    const children = Object.keys(this.children).map((key) => this.children[key]);
    return children.reduce((p, n) => p.concat(n.getChildren()), children);
  }
  collect(key) {
    let collection = [];
    const node = this.find(key);
    if (node) {
      collection = node.getChildren().filter((node2) => node2.value).sort((a, b) => {
        let res = b.rank - a.rank;
        if (res === 0)
          res = b.value.length - a.value.length;
        if (res === 0)
          res = a.value > b.value;
        return res;
      });
      if (node.value)
        collection.push(node);
    }
    return collection;
  }
  find(key) {
    let node = this;
    for (const char in key) {
      if (key[char] in node.children) {
        node = node.children[key[char]];
      } else {
        return;
      }
    }
    return node;
  }
  insert(s) {
    let node = this;
    let i = 0;
    const n = s.length;
    while (i < n) {
      if (s[i] in node.children) {
        node = node.children[s[i]];
        i++;
      } else {
        break;
      }
    }
    while (i < n) {
      node = node.children[s[i]] = node.children[s[i]] || new PrefixTreeNode();
      i++;
    }
    node.value = s;
    node.rank++;
  }
  index(s) {
    let word;
    while (word = WORD.exec(s)) {
      this.insert(word[0]);
    }
  }
};

// ../../zerolag/dist/esm/util.js
var binarySearch = (array, compare2) => {
  let index = -1;
  let prev = -1;
  let low = 0;
  let high = array.length;
  if (!high)
    return {
      item: null,
      index: 0
    };
  let item;
  let result;
  do {
    prev = index;
    index = low + (high - low >> 1);
    item = array[index];
    result = compare2(item);
    if (result)
      low = index;
    else
      high = index;
  } while (prev !== index);
  if (item != null) {
    return {
      item,
      index
    };
  }
  return {
    item: null,
    index: ~low * -1 - 1
  };
};

// ../../zerolag/dist/esm/tokens.js
var Type = {
  "\n": "lines",
  "{": "open curly",
  "}": "close curly",
  "[": "open square",
  "]": "close square",
  "(": "open parens",
  ")": "close parens",
  "/": "open comment",
  "*": "close comment",
  "`": "template string"
};
var TOKEN = /\n|\/\*|\*\/|`|\{|\}|\[|\]|\(|\)/g;
var _Tokens = class extends Event2 {
  factory;
  tokens;
  collection;
  constructor(factory) {
    super();
    this.factory = factory;
    const t2 = this.tokens = {
      lines: factory(),
      blocks: factory(),
      segments: factory()
    };
    this.collection = {
      "\n": t2.lines,
      "{": t2.blocks,
      "}": t2.blocks,
      "[": t2.blocks,
      "]": t2.blocks,
      "(": t2.blocks,
      ")": t2.blocks,
      "/": t2.segments,
      "*": t2.segments,
      "`": t2.segments
    };
  }
  index(text, offset = 0) {
    let match;
    let collection;
    while (match = TOKEN.exec(text)) {
      collection = this.collection[text[match.index]];
      collection.push(match.index + offset);
    }
  }
  update(range, text, shift) {
    const insert3 = new _Tokens(Array);
    insert3.index(text, range[0]);
    const lengths = {};
    for (const type in this.tokens) {
      lengths[type] = this.tokens[type].length;
    }
    for (const type1 in this.tokens) {
      this.tokens[type1].shiftOffset(range[0], shift);
      this.tokens[type1].removeRange(range);
      this.tokens[type1].insert(range[0], insert3.tokens[type1]);
    }
    for (const type2 in this.tokens) {
      if (this.tokens[type2].length !== lengths[type2]) {
        this.emit(`change ${type2}`);
      }
    }
  }
  getByIndex(type, index) {
    return this.tokens[type].get(index);
  }
  getCollection(type) {
    return this.tokens[type];
  }
  getByOffset(type, offset) {
    return this.tokens[type].find(offset);
  }
  copy() {
    const tokens = new _Tokens(this.factory);
    const t2 = tokens.tokens;
    for (const key in this.tokens) {
      t2[key] = this.tokens[key].slice();
    }
    tokens.collection = {
      "\n": t2.lines,
      "{": t2.blocks,
      "}": t2.blocks,
      "[": t2.blocks,
      "]": t2.blocks,
      "(": t2.blocks,
      ")": t2.blocks,
      "/": t2.segments,
      "*": t2.segments,
      "`": t2.segments
    };
    return tokens;
  }
};
var Tokens = _Tokens;
__publicField(Tokens, "Type", Type);

// ../../zerolag/dist/esm/segments.js
var Begin = /[\/'"`]/g;
var Type2 = Tokens.Type;
var Match = {
  "single comment": [
    "//",
    "\n"
  ],
  "double comment": [
    "/*",
    "*/"
  ],
  "template string": [
    "`",
    "`"
  ],
  "single quote string": [
    "'",
    "'"
  ],
  "double quote string": [
    '"',
    '"'
  ],
  regexp: [
    "/",
    "/"
  ]
};
var Skip = {
  "single quote string": "\\",
  "double quote string": "\\",
  "single comment": false,
  "double comment": false,
  regexp: "\\"
};
var Token2 = {};
for (const key in Match) {
  const M = Match[key];
  Token2[M[0]] = key;
}
var Length = {
  "open comment": 2,
  "close comment": 2,
  "template string": 1
};
var NotOpen = {
  "close comment": true
};
var Closes = {
  "open comment": "close comment",
  "template string": "template string"
};
var Tag = {
  "open comment": "comment",
  "template string": "string"
};
var Segments = class {
  buffer;
  cache;
  constructor(buffer) {
    this.buffer = buffer;
    this.cache = {
      state: [],
      offset: {},
      range: {},
      point: {}
    };
    this.reset();
  }
  clearCache(offset) {
    if (offset) {
      const s = binarySearch(this.cache.state, (s2) => s2.offset < offset);
      this.cache.state.splice(s.index);
    } else {
      this.cache.state = [];
    }
    this.cache.offset = {};
    this.cache.range = {};
    this.cache.point = {};
  }
  reset() {
    this.clearCache();
  }
  get(y) {
    if (y in this.cache.point) {
      return this.cache.point[y];
    }
    const segments = this.buffer.tokens.getCollection("segments");
    let open = false;
    let state = null;
    let waitFor = "";
    let point = {
      x: -1,
      y: -1
    };
    let close = 0;
    let offset;
    let segment;
    let range;
    let valid;
    let last2;
    let i = 0;
    const cacheState = this.getCacheState(y);
    if (cacheState && cacheState.item) {
      open = true;
      state = cacheState.item;
      waitFor = Closes[state.type];
      i = state.index + 1;
    }
    for (; i < segments.length; i++) {
      offset = segments.get(i);
      segment = {
        offset,
        type: Type2[this.buffer.charAt(offset)]
      };
      if (open) {
        if (waitFor === segment.type) {
          point = this.getOffsetPoint(segment.offset);
          if (!point) {
            return this.cache.point[y] = null;
          }
          if (point.y >= y) {
            return this.cache.point[y] = Tag[state.type];
          }
          last2 = segment;
          last2.point = point;
          state = null;
          open = false;
          if (point.y >= y)
            break;
        }
      } else {
        point = this.getOffsetPoint(segment.offset);
        if (!point) {
          return this.cache.point[y] = null;
        }
        range = this.buffer.getLine(point.y).offsetRange;
        if (last2 && last2.point.y === point.y) {
          close = last2.point.x + Length[last2.type];
        } else {
          close = 0;
        }
        valid = this.isValidRange([
          range[0],
          range[1] + 1
        ], segment, close);
        if (valid) {
          if (NotOpen[segment.type])
            continue;
          open = true;
          state = segment;
          state.index = i;
          state.point = point;
          waitFor = Closes[state.type];
          if (!this.cache.state.length || this.cache.state.length && state.offset > this.cache.state[this.cache.state.length - 1].offset) {
            this.cache.state.push(state);
          }
        }
        if (point.y >= y)
          break;
      }
    }
    if (state && state.point.y < y) {
      return this.cache.point[y] = Tag[state.type];
    }
    return this.cache.point[y] = null;
  }
  getOffsetPoint(offset) {
    if (offset in this.cache.offset)
      return this.cache.offset[offset];
    return this.cache.offset[offset] = this.buffer.getOffsetPoint(offset);
  }
  isValidRange(range, segment, close) {
    const key = range.join();
    if (key in this.cache.range)
      return this.cache.range[key];
    const text = this.buffer.getOffsetRangeText(range);
    const valid = this.isValid(text, segment.offset - range[0], close);
    return this.cache.range[key] = valid;
  }
  isValid(text, offset, lastIndex) {
    Begin.lastIndex = lastIndex;
    const match = Begin.exec(text);
    if (!match)
      return false;
    let i = match.index;
    let last2 = i;
    let valid = true;
    outer:
      for (; i < text.length; i++) {
        let one = text[i];
        const next = text[i + 1];
        let two = one + next;
        if (i === offset)
          return true;
        let o = Token2[two];
        if (!o)
          o = Token2[one];
        if (!o) {
          continue;
        }
        const waitFor = Match[o][1];
        last2 = i;
        switch (waitFor.length) {
          case 1:
            while (++i < text.length) {
              one = text[i];
              if (one === Skip[o]) {
                ++i;
                continue;
              }
              if (waitFor === one) {
                i += 1;
                break;
              }
              if ("\n" === one && !valid) {
                valid = true;
                i = last2 + 1;
                continue outer;
              }
              if (i === offset) {
                valid = false;
                continue;
              }
            }
            break;
          case 2:
            while (++i < text.length) {
              one = text[i];
              two = text[i] + text[i + 1];
              if (one === Skip[o]) {
                ++i;
                continue;
              }
              if (waitFor === two) {
                i += 2;
                break;
              }
              if ("\n" === one && !valid) {
                valid = true;
                i = last2 + 2;
                continue outer;
              }
              if (i === offset) {
                valid = false;
                continue;
              }
            }
            break;
        }
      }
    return valid;
  }
  getCacheState(y) {
    const s = binarySearch(this.cache.state, (s2) => s2.point.y < y);
    if (s.item && y - 1 < s.item.point.y)
      return null;
    else
      return s;
  }
};

// ../../zerolag/dist/esm/indexer.js
var Indexer = class {
  buffer;
  constructor(buffer) {
    this.buffer = buffer;
  }
  find(s) {
    if (!s)
      return [];
    const offsets = [];
    const text = this.buffer.raw;
    const len = s.length;
    let index = -1;
    while (~(index = text.indexOf(s, index + len))) {
      offsets.push(index);
    }
    return offsets;
  }
};

// ../../zerolag/dist/esm/parts.js
function last(array) {
  return array[array.length - 1];
}
function remove(array, a, b) {
  if (b == null) {
    return array.splice(a);
  } else {
    return array.splice(a, b - a);
  }
}
function insert2(target, index, array) {
  const op = array.slice();
  op.unshift(index, 0);
  target.splice.apply(target, op);
}
var Parts = class {
  minSize;
  parts;
  length;
  constructor(minSize) {
    minSize = minSize || 5e3;
    this.minSize = minSize;
    this.parts = [];
    this.length = 0;
  }
  push(item) {
    this.append([
      item
    ]);
  }
  append(items) {
    let part = last(this.parts);
    if (!part) {
      part = [];
      part.startIndex = 0;
      part.startOffset = 0;
      this.parts.push(part);
    } else if (part.length >= this.minSize) {
      const startIndex = part.startIndex + part.length;
      const startOffset = items[0];
      part = [];
      part.startIndex = startIndex;
      part.startOffset = startOffset;
      this.parts.push(part);
    }
    part.push.apply(part, items.map((offset) => offset - part.startOffset));
    this.length += items.length;
  }
  get(index) {
    const part = this.findPartByIndex(index).item;
    if (!part)
      return -1;
    return (part[Math.min(part.length - 1, index - part.startIndex)] ?? -1) + part.startOffset;
  }
  find(offset) {
    const p = this.findPartByOffset(offset);
    if (!p.item)
      return null;
    const part = p.item;
    const partIndex = p.index;
    const o = this.findOffsetInPart(offset, part);
    return {
      offset: o.item + part.startOffset,
      index: o.index + part.startIndex,
      local: o.index,
      part,
      partIndex
    };
  }
  insert(offset, array) {
    const o = this.find(offset);
    if (!o) {
      return this.append(array);
    }
    if (o.offset > offset)
      o.local = -1;
    const length = array.length;
    array = array.map((el) => el -= o.part.startOffset);
    insert2(o.part, o.local + 1, array);
    this.shiftIndex(o.partIndex + 1, -length);
    this.length += length;
  }
  shiftOffset(offset, shift) {
    const parts = this.parts;
    const item = this.find(offset);
    if (!item)
      return;
    if (offset > item.offset)
      item.local += 1;
    let removed = 0;
    for (let i = item.local; i < item.part.length; i++) {
      item.part[i] += shift;
      if (item.part[i] + item.part.startOffset < offset) {
        removed++;
        item.part.splice(i--, 1);
      }
    }
    if (removed) {
      this.shiftIndex(item.partIndex + 1, removed);
      this.length -= removed;
    }
    for (let i1 = item.partIndex + 1; i1 < parts.length; i1++) {
      parts[i1].startOffset += shift;
      if (parts[i1].startOffset < offset) {
        if (last(parts[i1]) + parts[i1].startOffset < offset) {
          removed = parts[i1].length;
          this.shiftIndex(i1 + 1, removed);
          this.length -= removed;
          parts.splice(i1--, 1);
        } else {
          this.removeBelowOffset(offset, parts[i1]);
        }
      }
    }
  }
  removeRange(range) {
    const a = this.find(range[0]);
    const b = this.find(range[1]);
    if (!a || !b)
      return;
    if (a.partIndex === b.partIndex) {
      if (a.offset >= range[1] || a.offset < range[0])
        a.local += 1;
      if (b.offset >= range[1] || b.offset < range[0])
        b.local -= 1;
      const shift = remove(a.part, a.local, b.local + 1).length;
      this.shiftIndex(a.partIndex + 1, shift);
      this.length -= shift;
    } else {
      if (a.offset >= range[1] || a.offset < range[0])
        a.local += 1;
      if (b.offset >= range[1] || b.offset < range[0])
        b.local -= 1;
      const shiftA = remove(a.part, a.local).length;
      const shiftB = remove(b.part, 0, b.local + 1).length;
      if (b.partIndex - a.partIndex > 1) {
        const removed = remove(this.parts, a.partIndex + 1, b.partIndex);
        const shiftBetween = removed.reduce((p, n) => p + n.length, 0);
        b.part.startIndex -= shiftA + shiftBetween;
        this.shiftIndex(b.partIndex - removed.length + 1, shiftA + shiftB + shiftBetween);
        this.length -= shiftA + shiftB + shiftBetween;
      } else {
        b.part.startIndex -= shiftA;
        this.shiftIndex(b.partIndex + 1, shiftA + shiftB);
        this.length -= shiftA + shiftB;
      }
    }
    if (!a.part.length) {
      this.parts.splice(this.parts.indexOf(a.part), 1);
    }
    if (!b.part.length) {
      this.parts.splice(this.parts.indexOf(b.part), 1);
    }
  }
  shiftIndex(startIndex, shift) {
    for (let i = startIndex; i < this.parts.length; i++) {
      this.parts[i].startIndex -= shift;
    }
  }
  removeBelowOffset(offset, part) {
    const o = this.findOffsetInPart(offset, part);
    const shift = remove(part, 0, o.index).length;
    this.shiftIndex(o.index + 1, shift);
    this.length -= shift;
  }
  findOffsetInPart(offset, part) {
    offset -= part.startOffset;
    return binarySearch(part, (o) => o <= offset);
  }
  findPartByIndex(index) {
    return binarySearch(this.parts, (s) => s.startIndex <= index);
  }
  findPartByOffset(offset) {
    return binarySearch(this.parts, (s) => s.startOffset <= offset);
  }
  toArray() {
    return this.parts.reduce((p, n) => p.concat(n), []);
  }
  slice() {
    const parts = new Parts(this.minSize);
    this.parts.forEach((part) => {
      const p = part.slice();
      p.startIndex = part.startIndex;
      p.startOffset = part.startOffset;
      parts.parts.push(p);
    });
    parts.length = this.length;
    return parts;
  }
};

// ../../zerolag/dist/esm/syntax.js
function entities(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var R = Regexp.create;
var NewLine = R([
  "newline"
], "g");
var syntax = Regexp.join([
  "newline",
  "comment",
  "number",
  "buffer",
  "special",
  "operator",
  "symbol",
  "brackets",
  "params",
  "attribute",
  "definition",
  "call",
  "keyword",
  "variable"
], "gm");
var AnyChar = /\S/g;
var Blocks = Regexp.join([
  "comment",
  [
    "property",
    R([
      "declare"
    ])
  ],
  [
    "keyword",
    R([
      "keyword"
    ])
  ],
  [
    "string",
    R([
      "string"
    ])
  ]
], "gm");
var Syntax = class {
  tab;
  blocks;
  blockIndex;
  constructor({ tab = "	" }) {
    this.tab = tab;
    this.blocks = [];
    this.blockIndex = 0;
  }
  highlight(code) {
    code += "\n`*/\n";
    code = this.createBlocks(code);
    const pieces = [];
    let match, piece, lastPos = 0, text;
    while (match = syntax.exec(code)) {
      if (match.index > lastPos) {
        text = code.slice(lastPos, match.index);
        const blocks = this.restoreBlocks(text);
        blocks.forEach((block) => {
          pieces.push([
            block[0],
            block[1],
            block[2] + lastPos
          ]);
        });
      }
      piece = Object.entries(match.groups).filter(([_3, value]) => value !== void 0)[0];
      piece.push(match.index);
      pieces.push(piece);
      lastPos = match.index + piece[1].length;
    }
    pieces.pop();
    while (pieces.pop()[0] !== "newline") {
    }
    return pieces;
  }
  createIndents(code) {
    const lines = code.split(/\n/g);
    let indent = 0;
    let match;
    let line;
    let i;
    i = lines.length;
    while (i--) {
      line = lines[i];
      AnyChar.lastIndex = 0;
      match = AnyChar.exec(line);
      if (match)
        indent = match.index;
      else if (indent && !line.length) {
        lines[i] = new Array(indent + 1).join(this.tab);
      }
    }
    code = lines.join("\n");
    return code;
  }
  restoreBlocks(code) {
    let block;
    const blocks = this.blocks;
    const regexp = /\uffee/g;
    let match, lastPos = 0, text, add = 0;
    const out2 = [];
    let newLineMatch, lastNewLinePos = 0;
    while (match = regexp.exec(code)) {
      if (match.index > lastPos) {
        text = code.slice(lastPos, match.index);
        if (text.length) {
          out2.push([
            "text",
            text,
            lastPos
          ]);
        }
        add += text.length;
      }
      block = blocks[this.blockIndex++];
      const tag = block[0];
      lastNewLinePos = 0;
      while (newLineMatch = NewLine.exec(block[1])) {
        text = block[1].slice(lastNewLinePos, newLineMatch.index);
        out2.push([
          tag,
          text,
          lastNewLinePos + add
        ]);
        out2.push([
          "newline",
          "\n",
          newLineMatch.index + add
        ]);
        lastNewLinePos = newLineMatch.index + 1;
      }
      if (!lastNewLinePos) {
        out2.push([
          tag,
          block[1],
          match.index
        ]);
      } else {
        out2.push([
          tag,
          block[1].slice(lastNewLinePos),
          lastNewLinePos + add
        ]);
      }
      add += block[1].length;
      lastPos = match.index + block[1].length;
    }
    text = code.slice(lastPos);
    if (text.length)
      out2.push([
        "text",
        text,
        lastPos
      ]);
    return out2;
  }
  createBlocks(code) {
    this.blocks = [];
    this.blockIndex = 0;
    const parts = [];
    let match, piece, lastPos = 0, text;
    while (match = Blocks.exec(code)) {
      if (match.index > lastPos) {
        text = code.slice(lastPos, match.index);
        parts.push(text);
      }
      piece = Object.entries(match.groups).filter(([_3, value]) => value !== void 0)[0];
      piece.push(match.index);
      this.blocks.push(piece);
      parts.push("\uFFEE" + " ".repeat(piece[1].length - 1));
      lastPos = match.index + piece[1].length;
    }
    if (lastPos < code.length)
      parts.push(code.slice(lastPos));
    return parts.join("");
  }
  entities;
};
Syntax.prototype.entities = entities;

// ../../zerolag/dist/esm/index.js
var EOL = /\r\n|\r|\n/g;
var NEWLINE = /\n/g;
var WORDS = Regexp.create([
  "tokens"
], "g");
var Line2 = class {
  offsetRange = [
    -1,
    -1
  ];
  offset = 0;
  length = 0;
  point = new Point2();
};
function normalizeEOL(s) {
  return s.replace(EOL, "\n");
}
var Buffer2 = class extends Event2 {
  log;
  raw = "";
  indexer;
  segments;
  text;
  tokens;
  prefix;
  constructor() {
    super();
    this.log = [];
    this.indexer = new Indexer(this);
    this.segments = new Segments(this);
    this.setText("");
  }
  updateRaw() {
    this.raw = this.text.toString();
  }
  copy() {
    this.updateRaw();
    const buffer = new Buffer2();
    buffer.replace(this);
    return buffer;
  }
  replace(data) {
    this.raw = data.raw;
    this.text.set(this.raw);
    this.tokens = data.tokens.copy();
    this.segments.clearCache();
  }
  setText(text) {
    text = normalizeEOL(text);
    this.raw = text;
    this.text = new SkipString();
    this.text.set(this.raw);
    this.tokens = new Tokens(() => new Parts());
    this.tokens.index(this.raw);
    this.tokens.on("change segments", this.emit.bind(this, "change segments"));
    this.prefix = new PrefixTreeNode();
    this.prefix.index(this.raw);
    this.emit("set");
  }
  insertTextAtPoint(p, text, noLog) {
    if (!noLog)
      this.emit("before update");
    text = normalizeEOL(text);
    const length = text.length;
    const point = this.getPoint(p);
    const shift = (text.match(NEWLINE) || []).length;
    const range = [
      point.y,
      point.y + shift
    ];
    const offsetRange = this.getLineRangeOffsets(range);
    const before = this.getOffsetRangeText(offsetRange);
    this.text.insert(point.offset, text);
    offsetRange[1] += text.length;
    const after = this.getOffsetRangeText(offsetRange);
    this.prefix.index(after);
    this.tokens.update(offsetRange, after, length);
    this.segments.clearCache(offsetRange[0]);
    if (!noLog)
      this.appendLog("insert", [
        point.offset,
        point.offset + text.length
      ], text);
    if (!noLog)
      this.emit("update", range, shift, before, after);
    return text.length;
  }
  removeOffsetRange(o, noLog) {
    if (!noLog)
      this.emit("before update");
    const a = this.getOffsetPoint(o[0]);
    const b = this.getOffsetPoint(o[1]);
    const length = o[0] - o[1];
    const range = [
      a.y,
      b.y
    ];
    const shift = a.y - b.y;
    const offsetRange = this.getLineRangeOffsets(range);
    const before = this.getOffsetRangeText(offsetRange);
    const text = this.text.getRange(o);
    this.text.remove(o);
    offsetRange[1] += length;
    const after = this.getOffsetRangeText(offsetRange);
    this.prefix.index(after);
    this.tokens.update(offsetRange, after, length);
    this.segments.clearCache(offsetRange[0]);
    if (!noLog)
      this.appendLog("remove", o, text);
    if (!noLog)
      this.emit("update", range, shift, before, after);
  }
  appendLog(type, offsets, text) {
    if (type === "insert") {
      const lastLog = this.log[this.log.length - 1];
      if (lastLog && lastLog[0] === "insert" && lastLog[1][1] === offsets[0]) {
        lastLog[1][1] += text.length;
        lastLog[2] += text;
      } else {
        this.log.push([
          "insert",
          offsets,
          text
        ]);
      }
    } else if (type === "remove") {
      const lastLog1 = this.log[this.log.length - 1];
      if (lastLog1 && lastLog1[0] === "remove" && lastLog1[1][0] === offsets[1]) {
        lastLog1[1][0] -= text.length;
        lastLog1[2] = text + lastLog1[2];
      } else {
        this.log.push([
          "remove",
          offsets,
          text
        ]);
      }
    }
  }
  removeArea(area) {
    const offsets = this.getAreaOffsetRange(area);
    return this.removeOffsetRange(offsets);
  }
  removeCharAtPoint(p) {
    const point = this.getPoint(p);
    const offsetRange = [
      point.offset,
      point.offset + 1
    ];
    return this.removeOffsetRange(offsetRange);
  }
  getLine(y) {
    const line = new Line2();
    const loc = this.loc();
    line.offsetRange = this.getLineRangeOffsets([
      y,
      y
    ]);
    line.offset = line.offsetRange[0];
    line.length = line.offsetRange[1] - line.offsetRange[0] - (y < loc ? 1 : 0);
    line.point.set({
      x: 0,
      y: y >= loc ? loc : y
    });
    return line;
  }
  getPoint(p) {
    const line = this.getLine(p.y);
    const point = new Point2({
      x: Math.min(line.length, p.x),
      y: line.point.y
    });
    point.offset = line.offset + point.x;
    point.point = point;
    point.line = line;
    return point;
  }
  getLineRangeText(range) {
    const offsets = this.getLineRangeOffsets(range);
    const text = this.text.getRange(offsets);
    return text;
  }
  getLineRangeOffsets(range) {
    const a = this.getLineOffset(range[0]);
    const b = range[1] >= this.loc() ? this.text.length : this.getLineOffset(range[1] + 1);
    const offsets = [
      a,
      b
    ];
    return offsets;
  }
  getOffsetRangeText(offsetRange) {
    const text = this.text.getRange(offsetRange);
    return text;
  }
  getOffsetPoint(offset) {
    const token = this.tokens.getByOffset("lines", offset - 0.5);
    if (!token)
      return new Point2();
    return new Point2({
      x: offset - (offset > token.offset ? token.offset + !!token.part.length : 0),
      y: Math.min(this.loc(), token.index - (token.offset + 1 > offset) + 1)
    });
  }
  charAt(offset) {
    const char = this.text.getRange([
      offset,
      offset + 1
    ]);
    return char;
  }
  getLineLength(line) {
    return this.getLine(line).length;
  }
  getLineText(y) {
    const text = this.getLineRangeText([
      y,
      y
    ]);
    return text;
  }
  getAreaText(area) {
    const offsets = this.getAreaOffsetRange(area);
    const text = this.text.getRange(offsets);
    return text;
  }
  wordAreaAtPoint(p, inclusive) {
    const point = this.getPoint(p);
    const text = this.text.getRange(point.line.offsetRange);
    const words = Regexp.parse(text, WORDS);
    if (words.length === 1) {
      const area = new Area({
        begin: {
          x: 0,
          y: point.y
        },
        end: {
          x: point.line.length,
          y: point.y
        }
      });
      return area;
    }
    let lastIndex = 0;
    let word = [];
    let end = text.length;
    for (let i = 0; i < words.length; i++) {
      word = words[i];
      if (word.index > point.x - !!inclusive) {
        end = word.index;
        break;
      }
      lastIndex = word.index;
    }
    const area1 = new Area({
      begin: {
        x: lastIndex,
        y: point.y
      },
      end: {
        x: end,
        y: point.y
      }
    });
    return area1;
  }
  moveAreaByLines(dy, area) {
    if (area.begin.y + dy < 0 || area.end.y + dy > this.loc())
      return false;
    let x = 0;
    let y = area.begin.y + dy;
    let swap_a = false;
    let swap_b = false;
    area.end.x = area.begin.x = 0;
    area.end.y = area.end.y + 1;
    if (dy > 0 && area.end.y === this.loc()) {
      if (area.begin.y === 0) {
        area.begin.x = 0;
        area.end.x = 0;
        x = Infinity;
        swap_b = true;
      } else {
        area.end.y = this.loc();
        y = area.begin.y + dy;
        x = Infinity;
        swap_b = true;
      }
    } else if (dy < 0 && area.end.y > this.loc() && y > 0) {
      area.begin.y = y;
      area.begin.x = this.getLineLength(area.begin.y);
      y = area.begin.y - 1;
      x = Infinity;
    } else if (dy < 0 && y === 0 && area.end.y > this.loc()) {
      area.begin.y -= 1;
      area.begin.x = this.getLineLength(area.begin.y);
      swap_a = true;
    }
    const offsets = this.getAreaOffsetRange(area);
    let text = this.text.getRange(offsets);
    if (swap_a) {
      text = text.slice(1) + text[0];
    }
    if (swap_b) {
      text = text.slice(-1) + text.slice(0, -1);
    }
    this.remove(offsets);
    this.insert({
      x,
      y
    }, text);
    return true;
  }
  getAreaOffsetRange(area) {
    const begin = this.getPoint(area.begin);
    const end = this.getPoint(area.end);
    const range = [
      Math.max(0, begin.offset),
      end.y < area.end.y ? end.line.offsetRange[1] : end.offset
    ];
    return range;
  }
  getLineOffset(y) {
    const offset = y < 0 ? -1 : y === 0 ? 0 : this.tokens.getByIndex("lines", y - 1) + 1;
    return offset;
  }
  getLongestLine() {
    return this.getLongestLineLength(true);
  }
  getLongestLineLength(withLineNumber) {
    let max = this.getLineLength(this.loc()) + 1, y = this.loc(), diff2 = 0, prev = -1, curr = 0;
    const parts = this.tokens.getCollection("lines").parts;
    for (let i = 0, cy = 0; i < parts.length; i++) {
      const part = parts[i];
      for (let j = 0; j < part.length; j++) {
        cy++;
        curr = part[j];
        diff2 = curr - prev;
        prev = curr;
        if (diff2 > max) {
          max = diff2;
          y = cy;
        }
      }
    }
    if (withLineNumber)
      return {
        length: max - 1,
        lineNumber: Math.max(0, y - 1)
      };
    return max - 1;
  }
  loc() {
    return this.tokens.getCollection("lines").length;
  }
  toString() {
    return this.text.toString();
  }
};
var proto3 = Buffer2.prototype;
proto3.insert = proto3.insertTextAtPoint;
proto3.remove = proto3.removeOffsetRange;

// ../../canvy/dist/esm/util.js
var debounce = (fn2, ms) => {
  let timeout;
  return function debounceWrap(a, b, c, d) {
    clearTimeout(timeout);
    timeout = setTimeout(fn2.bind(this, a, b, c, d), ms);
    return timeout;
  };
};

// ../../canvy/dist/esm/history.js
var History = class extends Event2 {
  editor;
  debouncedSave;
  log = [
    null
  ];
  needle = 1;
  lastNeedle = 1;
  timeout = true;
  timeStart = 0;
  didSave = false;
  meta;
  constructor(editor) {
    super();
    this.editor = editor;
    this.clear();
    this.debouncedSave = debounce(this.actuallySave.bind(this), 300);
  }
  clear() {
    this.log = [
      null
    ];
    this.needle = 1;
    this.lastNeedle = 1;
    this.timeout = true;
    this.timeStart = 0;
  }
  toJSON() {
    return {
      log: this.log.map((commit) => commit ? {
        ...commit,
        editor: commit.editor.id,
        undo: {
          ...commit.undo,
          editor: commit.undo.editor.id
        },
        redo: {
          ...commit.redo,
          editor: commit.redo.editor.id
        }
      } : commit),
      needle: this.needle,
      lastNeedle: this.lastNeedle
    };
  }
  setEditor(editor) {
    if (this.editor !== editor) {
      this.actuallySave(true);
    }
    this.editor = editor;
  }
  save(force) {
    this.emit("edit", this.editor);
    if (this.lastNeedle === this.needle) {
      this.needle++;
      this.emit("save", this.editor);
      this.saveMeta();
    }
    if (Date.now() - this.timeStart > 2e3 || force) {
      this.actuallySave();
    }
    this.timeout = this.debouncedSave();
    return this;
  }
  actuallySave(noEmit) {
    clearTimeout(this.timeout);
    this.didSave = false;
    if (this.editor.buffer.log.length) {
      this.didSave = true;
      this.log = this.log.slice(0, this.lastNeedle);
      this.log.push(this.commit());
      this.needle = ++this.lastNeedle;
      this.saveMeta();
      if (!noEmit) {
        this.emit("save", this.editor);
        this.emit("change", this.editor);
      }
    } else {
      this.saveMeta();
    }
    this.timeStart = Date.now();
    this.timeout = false;
  }
  undo(needle) {
    if (this.timeout !== false)
      this.actuallySave(true);
    if (needle < 1)
      return;
    this.lastNeedle = this.needle = needle;
    return this.checkout("undo", needle);
  }
  redo(needle) {
    if (this.timeout !== false)
      this.actuallySave(true);
    if (needle < 1)
      return;
    this.lastNeedle = this.needle = Math.min(needle, this.log.length);
    return this.checkout("redo", needle - 1);
  }
  checkout(type, n) {
    let commit = this.log[n];
    if (!commit)
      return;
    let log = commit.log;
    commit = this.log[n][type];
    commit.editor.controlEditor.setFocusedEditor(commit.editor);
    commit.editor.markActive = commit.markActive;
    commit.editor.mark.set(commit.mark.copy());
    commit.editor.setCaret(commit.caret.copy());
    log = "undo" === type ? log.slice().reverse() : log.slice();
    log.forEach((item) => {
      const action = item[0];
      const offsets = item[1];
      const text = item[2];
      switch (action) {
        case "insert":
          if ("undo" === type) {
            commit.editor.buffer.remove(offsets, true);
          } else {
            commit.editor.buffer.insert(commit.editor.buffer.getOffsetPoint(offsets[0]), text, true);
          }
          break;
        case "remove":
          if ("undo" === type) {
            commit.editor.buffer.insert(commit.editor.buffer.getOffsetPoint(offsets[0]), text, true);
          } else {
            commit.editor.buffer.remove(offsets, true);
          }
          break;
      }
    });
    if (this.didSave) {
      this.emit("save", this.editor);
      this.didSave = false;
    }
    this.emit("change", commit.editor);
    return commit.editor;
  }
  commit() {
    const editor = this.meta.editor;
    const log = editor.buffer.log;
    editor.buffer.log = [];
    return {
      editor,
      log,
      undo: this.meta,
      redo: {
        editor,
        caret: editor.caret.pos.copy(),
        mark: editor.mark.copy(),
        markActive: editor.markActive
      }
    };
  }
  saveMeta() {
    this.meta = {
      editor: this.editor,
      caret: this.editor.caret.pos.copy(),
      mark: this.editor.mark.copy(),
      markActive: this.editor.markActive
    };
  }
};

// ../../canvy/dist/esm/editor-worker.js
var isWorker = typeof window === "undefined" && typeof postMessage !== "undefined";
var backgrounds = {
  comment: "#53ea"
};
var colors = {
  background: "#000",
  buffer: "#94f",
  call: "#7bf",
  brackets: "#999",
  variable: "#48f",
  text: "#f99",
  marker: "#226",
  mark: "#43b",
  markHover: "#44a",
  caret: "#f4f4f4",
  gutter: "#333",
  scrollbar: "#555",
  lineNumbers: "#888",
  titlebar: "#000",
  title: "#557",
  attribute: "#fff",
  definition: "#fff",
  keyword: "#954",
  operator: "#f42",
  property: "#fff",
  number: "#ff5",
  string: "#fff",
  comment: "#fff",
  symbol: "#888",
  meta: "#fff",
  tag: "#fff"
};
var theme = {
  ...colors
};
var Open = {
  "{": "curly",
  "[": "square",
  "(": "parens"
};
var Close = {
  "}": "curly",
  "]": "square",
  ")": "parens"
};
var NONSPACE = /[^\s]/g;
var WORD2 = /[\s]{2,}|[./\\()"'\-:,.;<>~!@#$%^&*|+=[\]{}`~?\b ]{1}/g;
var parse = (regexp, text) => {
  regexp.lastIndex = 0;
  let word;
  const words = [];
  while (word = regexp.exec(text))
    words.push(word);
  return words;
};
var NEWLINE2 = Regexp.create([
  "newline"
]);
var PseudoWorker = class {
  editor;
  constructor() {
    this.editor = new Editor();
    this.editor.postMessage = (data) => this.onmessage({
      data
    });
  }
  onmessage(_arg0) {
    throw new Error("Method not implemented.");
  }
  postMessage(data) {
    if (!(data.call in this.editor)) {
      throw new ReferenceError("EditorWorker: no such method: " + data.call);
    }
    this.editor[data.call](data);
  }
};
var Editor = class Editor2 {
  isReady = false;
  _deleted;
  autoResize;
  block;
  buffer;
  canvas;
  caret;
  char;
  color;
  controlEditor;
  ctx;
  extraTitle;
  focusedEditor;
  font;
  fontAlias;
  fontSize;
  gutter;
  hasFocus;
  history;
  id;
  isSubEditor;
  isVisible;
  key;
  keys;
  line;
  mark;
  markActive;
  offsetTop;
  padding;
  page;
  pressed;
  realOffsetTop;
  scroll;
  scrollAnim;
  scrollbar;
  setupData;
  sizes;
  subEditors;
  subEditorsHeight;
  syntax;
  tabSize;
  title;
  titlebar;
  usedMouseRight;
  view;
  constructor(data = {}) {
    this.fontSize = data.fontSize ?? 11;
    this.color = theme.variable;
    this.block = new Area();
    this.scroll = {
      pos: new Point2(),
      target: new Point2()
    };
    this.offsetTop = 0;
    this.realOffsetTop = 0;
    this.subEditors = [];
    this.controlEditor = this;
    this.focusedEditor = null;
    this.buffer = new Buffer2();
    this.syntax = new Syntax({
      tab: "	"
    });
    this.drawSync = this.drawSync.bind(this);
    this.highlightBlock = this.highlightBlock.bind(this);
    this.scrollAnim = {
      speed: 166,
      isRunning: false,
      animFrame: null
    };
    this.scrollAnim.threshold = {
      tiny: 21,
      near: 0.29,
      mid: 1.9,
      far: 0.1
    };
    this.scrollAnim.scale = {
      tiny: 0.425,
      near: 0.71,
      mid: 0.802,
      far: 2.65
    };
    this.animScrollStart = this.animScrollStart.bind(this);
    this.animScrollTick = this.animScrollTick.bind(this);
  }
  update() {
    const editor = this.controlEditor.focusedEditor ?? this.controlEditor;
    this.postMessage({
      call: "onupdate",
      file: editor.toJSON()
    });
  }
  postMessage(_arg0) {
    throw new Error("Method not implemented.");
  }
  toJSON() {
    return {
      controlEditor: {
        id: this.controlEditor.id
      },
      id: this.id,
      title: this.title,
      value: this.buffer.toString()
    };
  }
  lastTexts = [];
  async setup(data, controlEditor) {
    const { pixelRatio } = data;
    const { width, height } = data.outerCanvas;
    this.setupData = data;
    this.extraTitle = data.extraTitle ?? "";
    this.font = data.font;
    this.fontSize = data.fontSize ?? this.fontSize;
    this.autoResize = data.autoResize ?? this.autoResize;
    try {
      const { groups: { color } } = /(?:color\(')(?<color>[^']+)/gi.exec(this.value);
      if (color) {
        this.color = color;
      }
    } catch (err) {
    }
    this.controlEditor = controlEditor ?? this.controlEditor;
    this.isSubEditor = !!this.controlEditor && this.controlEditor !== this;
    this.buffer.on("update", () => {
      this.controlEditor.history.setEditor(this);
      this.controlEditor.history.save();
      this.updateText();
      this.updateMark();
    });
    this.buffer.on("before update", () => {
      this.controlEditor.history.setEditor(this);
      this.controlEditor.history.save();
      this.updateText();
      this.updateMark();
    });
    if (this.font) {
      this.fontAlias = "mono";
    } else {
      this.fontAlias = "monospace";
    }
    if (!controlEditor && this.font) {
      const fontFace = new FontFace(this.fontAlias, `local('${this.fontAlias}'),
         url('${this.font}') format('woff2')`);
      if (isWorker) {
        self.fonts.add(fontFace);
      } else {
        document.fonts.add(fontFace);
      }
      await fontFace.load();
    }
    const createCanvas = (width2, height2) => {
      if (isWorker) {
        const canvas = new OffscreenCanvas(width2, height2);
        return canvas;
      } else {
        const canvas1 = document.createElement("canvas");
        canvas1.width = width2;
        canvas1.height = height2;
        return canvas1;
      }
    };
    this.canvas = {
      width,
      height,
      pixelRatio,
      padding: data.padding ?? 3
    };
    this.canvas.outer = this.canvas.outerCanvas = data.outerCanvas;
    this.canvas.gutter = createCanvas(width, height);
    this.canvas.title = createCanvas(width, height);
    this.canvas.mark = createCanvas(width, height);
    this.canvas.back = createCanvas(width, height);
    this.canvas.text = createCanvas(width, height);
    this.canvas.debug = createCanvas(width, height);
    this.canvas.scroll = {
      width: this.canvas.width,
      height: this.canvas.height
    };
    this.ctx = {};
    this.ctx.outer = this.canvas.outer.getContext("2d");
    this.ctx.gutter = this.canvas.gutter.getContext("2d");
    this.ctx.title = this.canvas.title.getContext("2d");
    this.ctx.mark = this.canvas.mark.getContext("2d");
    this.ctx.back = this.canvas.back.getContext("2d");
    this.ctx.text = this.canvas.text.getContext("2d");
    this.ctx.debug = this.canvas.debug.getContext("2d");
    this.key = null;
    this.keys = /* @__PURE__ */ new Set();
    this.sizes = {
      loc: -1,
      longestLineLength: -1
    };
    this.hasFocus = false;
    this.tabSize = 2;
    this.char = {};
    this.updateChar();
    this.markActive = false;
    this.mark ??= new Area({
      begin: new Point2({
        x: -1,
        y: -1
      }),
      end: new Point2({
        x: -1,
        y: -1
      })
    });
    if (!this.isSubEditor && !this.history) {
      this.history = new History(this);
      this.history.on("change", (editor) => {
        this.postMessage({
          call: "onchange",
          file: editor.toJSON()
        });
      });
      this.history.on("edit", (editor) => {
        const file = editor.toJSON();
        this.postMessage({
          call: "onedit",
          file
        });
      });
    }
    if (!this.isSubEditor) {
      this.setData(data.files[0]);
      for (const file of data.files.slice(1)) {
        const editor = await this.addSubEditor();
        editor.setData(file);
      }
      this.subEditors.forEach((editor) => {
        editor.updateSizes(true);
        editor.updateText();
        editor.updateMark();
      });
    }
    this.setCaret({
      x: 0,
      y: 0
    });
    this.draw();
    this.isReady = true;
    if (!this.isSubEditor) {
      setTimeout(() => {
        this.postMessage({
          call: "onready"
        });
      });
    }
  }
  value(_value) {
    throw new Error("Method not implemented.");
  }
  get isLastEditor() {
    const length = this.controlEditor.subEditors.length;
    return length === 0 || this.controlEditor.subEditors.indexOf(this) === length - 1;
  }
  async addSubEditor() {
    const editor = new Editor2();
    editor.postMessage = this.postMessage;
    await editor.setup(this.setupData, this);
    this.subEditors.push(editor);
    return editor;
  }
  updateChar = () => {
    this.applyFont(this.ctx.text);
    this.char.offsetTop = 0.5;
    this.char.metrics = this.ctx.text.measureText("M");
    this.char.width = this.char.metrics.width;
    this.char.height = (this.char.metrics.actualBoundingBoxDescent - this.char.metrics.actualBoundingBoxAscent) * 1.15;
    this.gutter = {
      padding: 7,
      width: 0,
      height: 0
    };
    this.line = {
      padding: 4
    };
    this.line.height = this.char.height + this.line.padding;
    this.char.px = {
      width: this.char.width * this.canvas.pixelRatio,
      height: this.line.height * this.canvas.pixelRatio
    };
    this.padding = {
      width: 0,
      height: this.char.px.height
    };
    this.titlebar = {
      height: "titlebarHeight" in this.setupData ? this.setupData.titlebarHeight * this.canvas.pixelRatio : this.char.px.height + 2.5,
      dir: this.setupData.titlebarDir ?? 0
    };
    this.canvas.title.height = Math.max(1, this.titlebar.height);
    this.scrollbar = {
      width: 6
    };
    this.scrollbar.margin = Math.ceil(this.scrollbar.width / 2);
    this.scrollbar.view = {
      width: 0,
      height: this.canvas.height - this.titlebar.height
    };
    this.scrollbar.area = {
      width: 0,
      height: 0
    };
    this.scrollbar.scale = {
      width: 0,
      height: 0
    };
    this.view = {
      left: 0,
      top: this.titlebar.height,
      width: this.canvas.width,
      height: this.canvas.height - this.titlebar.height
    };
    this.page ??= {};
    this.page.lines = Math.floor(this.view.height / this.char.px.height);
    this.page.height = this.page.lines * this.char.px.height;
    this.caret = {
      pos: this.caret?.pos ?? new Point2(),
      px: this.caret?.px ?? new Point2(),
      align: 0,
      width: this.fontSize / 4 | 0,
      height: this.line.height + this.line.padding / 2 + 2
    };
  };
  setColor({ color }) {
    if (this.focusedEditor && color !== this.focusedEditor.color) {
      this.focusedEditor.color = color;
      this.focusedEditor.updateText();
      this.focusedEditor.updateMark();
      this.controlEditor.draw();
    }
  }
  getEditorById(id) {
    if (id === this.id)
      return this;
    return this.subEditors.find((editor) => editor.id === id);
  }
  setFocusedEditorById({ id }) {
    const editor = this.getEditorById(id);
    if (editor)
      this.setFocusedEditor(editor);
  }
  async addEditor({ file }) {
    if (this._deleted) {
      this._deleted = false;
      this.setData(file);
      this.updateSizes(true);
      this.updateText();
      this.updateMark();
    } else {
      const editor = await this.addSubEditor();
      editor.setData(file);
      this.subEditors.forEach((editor2) => {
        editor2.updateSizes(true);
        editor2.updateText();
        editor2.updateMark();
      });
    }
  }
  swapEditors(a, b) {
    const data = a.toJSON();
    const caretA = a.caret.pos.copy();
    const caretB = b.caret.pos.copy();
    const history = this.history.save(true).toJSON();
    a.setData(b.toJSON());
    b.setData(data);
    a.updateTitle();
    a.updateSizes(true);
    a.updateText();
    a.updateMark();
    b.updateTitle();
    b.updateSizes(true);
    b.updateText();
    b.updateMark();
    b.setCaret(caretA);
    a.setCaret(caretB);
    this.history.clear();
    this.restoreHistory(history);
    this.draw();
  }
  moveEditorUp({ id }) {
    const self1 = this.getEditorById(id);
    if (self1 === this) {
      return;
    } else {
      let other;
      const index = this.subEditors.indexOf(self1);
      if (index === 0) {
        other = this.controlEditor;
      } else {
        other = this.subEditors[index - 1];
      }
      this.swapEditors(self1, other);
    }
    this.setFocusedEditor(this.getEditorById(id));
    setTimeout(() => this.keepCaretInView(false, true));
  }
  moveEditorDown({ id }) {
    const self1 = this.getEditorById(id);
    if (self1 === this) {
      if (this.subEditors.length) {
        const other = this.subEditors[0];
        this.swapEditors(self1, other);
      }
    } else {
      const other1 = this.subEditors[this.subEditors.indexOf(self1) + 1];
      if (!other1)
        return;
      this.swapEditors(self1, other1);
    }
    this.setFocusedEditor(this.getEditorById(id));
    setTimeout(() => this.keepCaretInView(false, true));
  }
  deleteEditor({ id }) {
    const editor = this.getEditorById(id);
    const history = this.history.save(true).toJSON();
    if (editor === this) {
      if (this.subEditors.length) {
        const other = this.subEditors.shift();
        this.setData(other.toJSON());
        this.setCaret(other.caret.pos.copy());
      } else {
        this._deleted = true;
        this.setText("");
        this.setCaret({
          x: 0,
          y: 0
        });
      }
      this.setFocusedEditor(this);
    } else {
      const index = this.subEditors.indexOf(editor);
      this.subEditors.splice(index, 1);
      const lastEditor = this.subEditors[index] ?? this.subEditors[index - 1] ?? this;
      lastEditor.updateSizes(true);
      lastEditor.updateText();
      lastEditor.updateMark();
      this.setFocusedEditor(lastEditor);
    }
    this.history.clear();
    this.restoreHistory(history);
    this.keepCaretInView();
    this.updateSizes(true);
    this.updateText();
    this.updateMark();
    this.draw();
  }
  setEditorData({ id, data }) {
    const editor = this.getEditorById(id) || this;
    editor.setData(data);
    try {
      editor.updateTitle();
      editor.updateSizes();
      editor.updateText();
      editor.updateMark();
      this.draw();
    } catch (error) {
      console.error(error);
    }
  }
  restoreHistory(history) {
    const editors = {};
    editors[this.id] = this;
    this.subEditors.forEach((editor) => {
      editors[editor.id] = editor;
    });
    const log = history.log.filter((item, i) => {
      if (item) {
        item.editor = editors[item.editor];
        if (!item.editor) {
          if (i < history.needle) {
            history.needle--;
          }
          if (i < history.lastNeedle) {
            history.lastNeedle--;
          }
          return false;
        }
        item.undo.editor = editors[item.undo.editor];
        item.undo.caret = new Point2(item.undo.caret);
        item.undo.mark = new Area(item.undo.mark);
        item.redo.editor = editors[item.redo.editor];
        item.redo.caret = new Point2(item.redo.caret);
        item.redo.mark = new Area(item.redo.mark);
      }
      return true;
    });
    this.history.log = log;
    this.history.needle = history.needle;
    this.history.lastNeedle = history.lastNeedle;
  }
  setData(data) {
    if ("id" in data)
      this.id = data.id;
    if ("title" in data)
      this.title = data.title;
    if ("value" in data)
      this.setText(data.value);
  }
  erase(moveByChars = 0, inView = true) {
    if (this.markActive && !this.mark.isEmpty()) {
      this.controlEditor.history.setEditor(this);
      this.controlEditor.history.save(true);
      const area = this.mark.get();
      this.moveCaret(area.begin);
      this.buffer.removeArea(area);
      this.markClear(true);
    } else {
      this.markClear(true);
      this.controlEditor.history.setEditor(this);
      this.controlEditor.history.save();
      if (moveByChars)
        this.moveByChars(moveByChars);
      this.buffer.removeCharAtPoint(this.caret.pos);
    }
    this.updateSizes();
    this.updateText();
    this.updateMark();
    if (inView)
      this.keepCaretInView("ease", false);
    this.draw();
  }
  align() {
    this.caret.align = this.caret.pos.x;
  }
  delete(inView) {
    if (this.isEndOfFile()) {
      if (this.markActive && !this.isBeginOfFile())
        return this.backspace(inView);
      return;
    }
    this.erase(0, inView);
    queueMicrotask(this.highlightBlock);
  }
  backspace(inView) {
    if (this.isBeginOfFile()) {
      if (this.markActive && !this.isEndOfFile())
        return this.delete(inView);
      return;
    }
    this.erase(-1, inView);
  }
  insert(text, noRules = false, inView = true) {
    if (this.markActive && !this.mark.isEmpty())
      this.delete(inView);
    this.markClear();
    const matchSymbol = {
      "'": "'",
      '"': '"',
      "`": "`",
      "(": ")",
      "[": "]",
      "{": "}",
      ")": "(",
      "]": "[",
      "}": "{"
    };
    const line = this.buffer.getLineText(this.caret.pos.y);
    const right = line[this.caret.pos.x];
    let left = line[this.caret.pos.x - 1];
    const hasRightSymbol = [
      "'",
      '"',
      "`",
      "}",
      "]",
      ")"
    ].includes(right);
    const hasMatchSymbol = hasRightSymbol && text === right && matchSymbol[left] === right;
    let indent = 0;
    let hasLeftSymbol;
    if (!noRules && NEWLINE2.test(text)) {
      left = line.slice(0, this.caret.pos.x).trim().slice(-1);
      hasLeftSymbol = [
        "{",
        "[",
        "("
      ].includes(left);
      indent = line.match(/\S/)?.index ?? (line.length || 1) - 1;
      const isBeforeIndent = this.caret.pos.x < indent;
      if (hasLeftSymbol)
        indent += 2;
      if (!isBeforeIndent) {
        text += " ".repeat(indent);
      }
    }
    if (!noRules) {
      if (hasLeftSymbol && hasRightSymbol) {
        this.buffer.insert(this.caret.pos, "\n" + " ".repeat(indent - 2));
      }
    }
    let length = 1;
    if (noRules || !hasMatchSymbol) {
      length = this.buffer.insert(this.caret.pos, text);
      this.updateSizes();
    }
    this.moveByChars(length);
    this.updateSizes();
    this.updateText();
    this.updateMark();
    if (inView)
      this.keepCaretInView();
    this.draw();
  }
  markBegin(area) {
    if (!this.markActive) {
      this.markActive = true;
      if (area) {
        this.mark.set(area);
      } else if (area !== false || this.mark.begin.x === -1) {
        this.mark.begin.set(this.caret.pos);
        this.mark.end.set(this.caret.pos);
      }
    }
  }
  markSet(reverse) {
    if (this.markActive) {
      if (reverse) {
        this.mark.end.set(this.mark.begin);
        this.mark.begin.set(this.caret.pos);
        this.caret.pos.set(this.mark.end);
      } else {
        this.mark.end.set(this.caret.pos);
      }
      this.updateMark();
      this.draw();
    }
  }
  markSetArea(area) {
    this.markBegin(area);
    this.updateMark();
    this.draw();
  }
  markClear(force) {
    if (this.keys.has("Shift") && !force || !this.markActive)
      return;
    this.postMessage({
      call: "onselection",
      text: ""
    });
    this.markActive = false;
    this.mark.set({
      begin: new Point2({
        x: -1,
        y: -1
      }),
      end: new Point2({
        x: -1,
        y: -1
      })
    });
    this.draw();
  }
  getPointTabs({ x, y }) {
    const line = this.buffer.getLineText(y);
    let remainder = 0;
    let tabs = 0;
    let tab = -1;
    let prev = 0;
    while (~(tab = line.indexOf("	", tab + 1))) {
      if (tab >= x)
        break;
      remainder += (tab - prev) % this.tabSize;
      tabs++;
      prev = tab + 1;
    }
    remainder += tabs;
    return {
      tabs,
      remainder
    };
  }
  getCoordsTabs({ x, y }) {
    const line = this.buffer.getLineText(y);
    const { tabSize } = this;
    let displayIndex = 0;
    let i = 0;
    for (i = 0; i < line.length; i++) {
      if (displayIndex >= x)
        break;
      if (line[i] === "	")
        displayIndex += tabSize;
      else
        displayIndex += 1;
    }
    return i;
  }
  highlightBlock() {
    this.block.begin.set({
      x: -1,
      y: -1
    });
    this.block.end.set({
      x: -1,
      y: -1
    });
    const offset = this.buffer.getPoint(this.caret.pos).offset;
    const result = this.buffer.tokens.getByOffset("blocks", offset);
    if (!result)
      return;
    const length = this.buffer.tokens.getCollection("blocks").length;
    let char = this.buffer.charAt(result.index);
    let open;
    let close;
    let i = result.index;
    let openOffset = result.offset;
    if (i === 0 && offset < openOffset)
      return;
    char = this.buffer.charAt(openOffset);
    let count2 = openOffset >= offset - 1 && Close[char] ? 0 : 1;
    let limit = 200;
    while (i >= 0) {
      open = Open[char];
      if (Close[char])
        count2++;
      if (!--limit)
        return;
      if (open && !--count2)
        break;
      openOffset = this.buffer.tokens.getByIndex("blocks", --i);
      char = this.buffer.charAt(openOffset);
    }
    if (count2)
      return;
    count2 = 1;
    let closeOffset;
    while (i < length - 1) {
      closeOffset = this.buffer.tokens.getByIndex("blocks", ++i);
      char = this.buffer.charAt(closeOffset);
      if (!--limit)
        return;
      close = Close[char];
      if (Open[char] === open)
        count2++;
      if (open === close)
        count2--;
      if (!count2)
        break;
    }
    if (count2)
      return;
    const begin = this.buffer.getOffsetPoint(openOffset);
    const end = this.buffer.getOffsetPoint(closeOffset);
    this.block.begin.set(this.getCharPxFromPoint(begin));
    this.block.end.set(this.getCharPxFromPoint(end));
  }
  moveByWords(dx) {
    let { x, y } = this.caret.pos;
    const line = this.buffer.getLineText(y);
    if (dx > 0 && x >= line.length - 1) {
      return this.moveByChars(1);
    } else if (dx < 0 && x === 0) {
      return this.moveByChars(-1);
    }
    const words = parse(WORD2, dx > 0 ? line : [
      ...line
    ].reverse().join(""));
    let word;
    if (dx < 0)
      x = line.length - x;
    for (let i = 0; i < words.length; i++) {
      word = words[i];
      if (word.index > x) {
        x = dx > 0 ? word.index : line.length - word.index;
        return this.moveCaret({
          x,
          y
        });
      }
    }
    return dx > 0 ? this.moveEndOfLine() : this.moveBeginOfLine();
  }
  moveByChars(dx) {
    let { x, y } = this.caret.pos;
    if (dx < 0) {
      x += dx;
      if (x < 0) {
        if (y > 0) {
          y -= 1;
          x = this.buffer.getLineLength(y);
        } else {
          x = 0;
        }
      }
    } else if (dx > 0) {
      x += dx;
      while (x - this.buffer.getLineLength(y) > 0) {
        if (y === this.sizes.loc) {
          x = this.buffer.getLineLength(y);
          break;
        }
        x -= this.buffer.getLineLength(y) + 1;
        y += 1;
      }
    }
    this.caret.align = x;
    return this.moveCaret({
      x,
      y
    });
  }
  moveByLines(dy) {
    let { x, y } = this.caret.pos;
    if (dy < 0) {
      if (y + dy > 0) {
        y += dy;
      } else {
        if (y === 0) {
          x = 0;
          return this.moveCaret({
            x,
            y
          });
        }
        y = 0;
      }
    } else if (dy > 0) {
      if (y < this.sizes.loc - dy) {
        y += dy;
      } else {
        if (y === this.sizes.loc) {
          x = this.buffer.getLineLength(y);
          return this.moveCaret({
            x,
            y
          });
        }
        y = this.sizes.loc;
      }
    }
    x = Math.min(this.caret.align, this.buffer.getLineLength(y));
    return this.moveCaret({
      x,
      y
    });
  }
  moveBeginOfLine({ isHomeKey = false } = {}) {
    const y = this.caret.pos.y;
    let x = 0;
    if (isHomeKey) {
      const lineText = this.buffer.getLineText(y);
      NONSPACE.lastIndex = 0;
      x = NONSPACE.exec(lineText)?.index ?? 0;
      if (x === this.caret.pos.x)
        x = 0;
    }
    this.caret.align = x;
    return this.moveCaret({
      x,
      y
    });
  }
  moveEndOfLine() {
    const y = this.caret.pos.y;
    const x = this.buffer.getLine(y).length;
    this.caret.align = Infinity;
    return this.moveCaret({
      x,
      y
    });
  }
  moveBeginOfFile() {
    this.caret.align = 0;
    return this.moveCaret({
      x: 0,
      y: 0
    });
  }
  moveEndOfFile() {
    const y = this.sizes.loc;
    const x = this.buffer.getLine(y).length;
    this.caret.align = x;
    return this.moveCaret({
      x,
      y
    });
  }
  isBeginOfFile() {
    return this.caret.pos.x === 0 && this.caret.pos.y === 0;
  }
  isEndOfFile() {
    const { x, y } = this.caret.pos;
    const last2 = this.sizes.loc;
    return y === last2 && x === this.buffer.getLineLength(last2);
  }
  isBeginOfLine() {
    return this.caret.pos.x === 0;
  }
  isEndOfLine() {
    return this.caret.pos.x === this.buffer.getLineLength(this.caret.pos.y);
  }
  moveCaret({ x, y }) {
    return this.setCaret({
      x,
      y
    });
  }
  getCaretPxDiff(centered = false) {
    let editor = this.controlEditor.focusedEditor;
    if (!editor) {
      this.controlEditor.setFocusedEditor(this);
      editor = this;
    }
    let left = this.canvas.gutter.width;
    let top = this.titlebar.height;
    let right = left + (this.view.width - this.scrollbar.width - this.char.px.width);
    let bottom = this.view.height - this.char.px.height;
    const x = editor.caret.px.x * this.canvas.pixelRatio + this.canvas.gutter.width - this.scroll.pos.x;
    const y = editor.caret.px.y * this.canvas.pixelRatio + this.titlebar.height + editor.offsetTop - editor.scroll.pos.y;
    let dx = Math.floor(x < left ? left - x : x > right ? right - x : 0);
    let dy = Math.floor(y < top ? top - y : y > bottom ? bottom - y : 0);
    if (dx !== 0 && centered) {
      left = right / 2;
      right = right / 2;
      dx = x < left ? left - x : x > right ? right - x : 0;
    }
    if (dy !== 0 && centered) {
      top = bottom / 2;
      bottom = bottom / 2;
      dy = y < top ? top - y : y > bottom ? bottom - y : 0;
    }
    return new Point2({
      x: dx,
      y: dy
    });
  }
  getCharPxFromPoint(point) {
    const { tabs } = this.getPointTabs(point);
    return new Point2({
      x: this.char.width * (point.x - tabs + tabs * this.tabSize) + this.gutter.padding,
      y: this.line.height * point.y + this.canvas.padding - this.line.padding
    });
  }
  setCaret(pos) {
    const prevCaretPos = this.caret.pos.copy();
    this.caret.pos.set(Point2.low({
      x: 0,
      y: 0
    }, pos));
    const px = this.getCharPxFromPoint(this.caret.pos);
    this.caret.px.set({
      x: px.x,
      y: px.y
    });
    queueMicrotask(this.highlightBlock);
    this.postMessage({
      call: "setCaret",
      caret: this.caret.pos
    });
    return prevCaretPos.minus(this.caret.pos);
  }
  getPointByMouse({ clientX, clientY }) {
    const y = Math.max(0, Math.min(this.sizes.loc, Math.floor((clientY - (-this.scroll.pos.y / this.canvas.pixelRatio + this.offsetTop / this.canvas.pixelRatio + this.canvas.padding + this.titlebar.height / this.canvas.pixelRatio)) / this.line.height)));
    let x = Math.max(0, Math.ceil((clientX - this.padding.width / this.canvas.pixelRatio - -this.scroll.pos.x / this.canvas.pixelRatio) / this.char.width));
    const actualIndex = this.getCoordsTabs({
      x,
      y
    });
    x = Math.max(0, Math.min(actualIndex, this.buffer.getLineLength(y)));
    return new Point2({
      x,
      y
    });
  }
  setCaretByMouse({ clientX, clientY }) {
    const p = this.getPointByMouse({
      clientX,
      clientY
    });
    this.caret.align = p.x;
    this.setCaret(p);
    this.keepCaretInView();
  }
  setText(text) {
    this.buffer.setText(text);
    if (this.updateSizes()) {
      this.updateText();
      this.updateMark();
    }
  }
  updateSizes(force = false) {
    if (!this.sizes)
      return;
    let changed = false;
    const loc = this.buffer.loc();
    const lensSize = Math.max(...Object.values(this.lenses).map((x) => x.length));
    const longestLine = this.buffer.getLongestLine();
    const { tabs, remainder } = this.getPointTabs({
      x: longestLine.length,
      y: longestLine.lineNumber
    });
    const longestLineLength = longestLine.length + tabs + remainder + (lensSize ? lensSize + 2 : 0);
    if (loc !== this.sizes.loc || force) {
      changed = true;
      this.sizes.loc = loc;
      this.view.height = this.canvas.height;
      this.scrollbar.view.height = this.canvas.height - this.titlebar.height;
      this.gutter.size = 0;
      this.gutter.width = 0;
      this.gutter.padding = 0;
      this.canvas.back.height = this.canvas.text.height = this.canvas.padding * this.canvas.pixelRatio * 2 + (1 + this.sizes.loc) * this.char.px.height;
      if (!isWorker && this.autoResize && !this.isSubEditor) {
        this.view.height = this.canvas.height = this.canvas.outer.height = this.canvas.text.height + this.titlebar.height + this.canvas.padding * this.canvas.pixelRatio;
        this.page.lines = Math.floor(this.view.height / this.char.px.height);
        this.canvas.outer.style.height = this.canvas.outer.height / this.canvas.pixelRatio + "pt";
        this.postMessage({
          call: "onresize",
          width: this.canvas.width,
          height: this.canvas.height
        });
      }
      this.subEditorsHeight = this.subEditors.reduce((p, n) => p + n.canvas.text.height + this.titlebar.height, 0);
      this.canvas.scroll.height = Math.floor(this.subEditorsHeight + (!isWorker && this.autoResize ? 0 : this.canvas.text.height) - (this.canvas.padding + this.caret.height - this.line.padding) * this.canvas.pixelRatio);
      this.canvas.gutter.width = (this.gutter.width + this.canvas.padding) * this.canvas.pixelRatio;
      this.canvas.gutter.height = !this.isLastEditor ? this.canvas.text.height : this.canvas.scroll.height + this.view.height;
      this.scrollbar.view.width = this.canvas.width - this.canvas.gutter.width;
      this.view.left = this.canvas.gutter.width;
      this.view.width = this.canvas.width - this.canvas.gutter.width;
      this.padding.width = (this.gutter.width + this.gutter.padding + this.char.width) * this.canvas.pixelRatio;
      this.ctx.gutter.scale(this.canvas.pixelRatio, this.canvas.pixelRatio);
      this.updateGutter();
    }
    if (longestLineLength !== this.sizes.longestLineLength || force) {
      changed = true;
      this.sizes.longestLineLength = longestLineLength;
      this.canvas.back.width = this.canvas.text.width = (this.sizes.longestLineLength * this.char.width + this.gutter.padding) * this.canvas.pixelRatio;
      this.canvas.mark.width = this.canvas.text.width + this.char.px.width / 2;
      this.canvas.scroll.width = Math.max(0, this.canvas.text.width - this.canvas.width + this.canvas.gutter.width + this.char.px.width * 2);
    }
    if (changed) {
      this.scrollbar.area.width = this.canvas.text.width + this.char.px.width * 2;
      this.scrollbar.area.height = this.canvas.scroll.height;
      this.scrollbar.scale.width = this.scrollbar.view.width / this.scrollbar.area.width;
      this.scrollbar.scale.height = this.scrollbar.view.height / this.scrollbar.area.height;
      this.scrollbar.horiz = this.scrollbar.scale.width * this.scrollbar.view.width;
      this.scrollbar.vert = this.scrollbar.scale.height * this.scrollbar.view.height;
      this.ctx.text.scale(this.canvas.pixelRatio, this.canvas.pixelRatio);
      this.ctx.back.scale(this.canvas.pixelRatio, this.canvas.pixelRatio);
      this.canvas.title.width = this.canvas.width;
      this.updateTitle();
      if (this.isSubEditor) {
        this.controlEditor.updateSizes(true);
        this.controlEditor.updateText();
      }
      return true;
    }
  }
  hasKeys(keys2) {
    return keys2.split(" ").every((key) => this.keys.has(key));
  }
  getLineLength(line) {
    return this.buffer.getLine(line).length;
  }
  alignCol(line) {
    return Math.min(this.caret.align, this.buffer.getLineLength(line));
  }
  applyFont(ctx) {
    ctx.textBaseline = "top";
    ctx.font = `normal ${this.fontSize | 0}px ${this.fontAlias}`;
  }
  updateGutter() {
    const { gutter } = this.ctx;
    gutter.textBaseline = "top";
    gutter.font = `normal ${this.fontSize | 0}px ${this.fontAlias}`;
    gutter.fillStyle = theme.gutter;
    gutter.fillRect(0, 0, this.canvas.gutter.width, this.canvas.gutter.height);
    gutter.fillStyle = theme.lineNumbers;
    for (let i = 0, y = 0; i <= this.sizes.loc; i++) {
      y = this.canvas.padding + i * this.line.height + this.char.offsetTop;
      gutter.fillText((1 + i).toString().padStart(this.gutter.size), this.canvas.padding, y);
    }
  }
  lenses = {
    0: ""
  };
  onlenses = (lenses) => {
    this.lenses = lenses;
    this.updateSizes();
    this.updateText();
    this.draw();
  };
  origMarkers = [];
  onmarkers = ({ markers }) => {
    this.origMarkers = markers;
    this.markers = markers.map(({ index, size, color, hoverColor, kind }) => {
      const begin = this.buffer.getOffsetPoint(index);
      const end = this.buffer.getOffsetPoint(index + size);
      return Object.assign(new Area({
        begin,
        end
      }), {
        color,
        hoverColor,
        kind
      });
    });
    if (this.isReady) {
      this.updateMark();
      this.draw();
      if (this.hoveredMarkerIndex) {
        this.postMessage({
          call: "onentermarker",
          markerIndex: this.hoveredMarkerIndex
        });
      }
    }
  };
  updateTextSync = () => {
    if (!this.ctx)
      return;
    const { text, back } = this.ctx;
    this.applyFont(text);
    back.clearRect(0, 0, this.canvas.text.width, this.canvas.text.height);
    text.clearRect(0, 0, this.canvas.text.width, this.canvas.text.height);
    text.fillStyle = theme.text;
    const code = this.buffer.toString();
    const pieces = this.syntax.highlight(code + "\n.");
    const fh = this.line.height;
    let i = 0, x = 0, y = 0, lastNewLine = 0, idx = 0;
    const queue2 = [];
    let lens;
    for (const [type, string, index] of pieces.values()) {
      y = this.canvas.padding + i * this.line.height;
      idx = index;
      if (type === "newline") {
        back.fillStyle = "rgba(0,0,0,.7)";
        back.fillRect(0, y - 1.5, this.char.width * (index - lastNewLine), fh);
        for (const [type1, string1, x1, y1] of queue2) {
          const bg = backgrounds[type1];
          if (bg) {
            back.fillStyle = bg;
            back.fillRect(+x1, +y1 - 1.5, this.char.width * string1.length, fh);
          }
          text.fillStyle = theme[type1];
          text.fillText(string1, x1, y1 + this.char.offsetTop);
        }
        queue2.length = 0;
        lastNewLine = index + 1;
        lens = this.lenses[i];
        if (lens) {
          text.font = `italic ${this.fontSize * 0.85 | 0}px ${this.fontAlias}`;
          text.fillStyle = "#f31";
          text.fillText(lens, (this.buffer.getLineLength(i - 1) + 1.25) * this.char.width, (i - 1) * this.line.height + this.char.offsetTop + this.canvas.padding + this.char.height * 0.05);
          text.font = `normal ${this.fontSize | 0}px ${this.fontAlias}`;
        }
        i++;
        continue;
      }
      x = (index - lastNewLine) * this.char.width + this.gutter.padding;
      queue2.push([
        type,
        string,
        x,
        y
      ]);
    }
    back.fillStyle = "rgba(0,0,0,.7)";
    back.fillRect(0, y - 1.5, this.char.width * (idx - lastNewLine + queue2[queue2.length - 1][1].length) + 8, fh);
    for (const [type2, string2, x2, y2] of queue2.slice(0, -1)) {
      const bg1 = backgrounds[type2];
      if (bg1) {
        back.fillStyle = bg1;
        back.fillRect(+x2, +y2 - 1.5, this.char.width * string2.length, fh);
      }
      text.fillStyle = theme[type2];
      text.fillText(string2, x2, y2);
    }
    lens = this.lenses[i];
    if (lens) {
      text.font = `italic ${this.fontSize * 0.85 | 0}px ${this.fontAlias}`;
      text.fillStyle = "#f31";
      text.fillText(lens, (this.buffer.getLineLength(i - 1) + 1.25) * this.char.width, (i - 1) * this.line.height + this.char.offsetTop + this.canvas.padding + this.char.height * 0.05);
      text.font = `normal ${this.fontSize | 0}px ${this.fontAlias}`;
    }
  };
  updateText = worker_default.queue.task(this.updateTextSync);
  markers = [];
  updateMark = () => {
    if (!this.ctx)
      return;
    const { mark } = this.ctx;
    const markArea = this.mark.get();
    markArea.color = theme.mark;
    const markers = [
      ...this.markers,
      ...this.markActive && !this.mark.isEmpty() ? [
        markArea
      ] : []
    ];
    const totalArea = Area.join(markers);
    this.canvas.mark.height = ((1 + totalArea.height) * this.line.height + this.line.padding) * this.canvas.pixelRatio;
    if (totalArea.isEmpty())
      return;
    const Y = totalArea.begin.y;
    mark.scale(this.canvas.pixelRatio, this.canvas.pixelRatio);
    mark.fillStyle = theme.mark;
    const xx = this.gutter.padding;
    const yy = 0;
    let ax = 0, bx = 0, ay = 0, by = 0;
    const drawMarkArea = ({ begin, end }, eax = 0, ebx = 0) => {
      ax = begin.x * this.char.width;
      bx = (end.x - begin.x) * this.char.width;
      ay = begin.y * this.line.height;
      by = this.line.height + 0.5;
      mark.fillRect(xx + ax + eax, yy + ay, bx - eax + ebx, by);
    };
    const hoveredMarker = this.markers[this.hoveredMarkerIndex];
    for (const area of markers) {
      if (area === hoveredMarker) {
        mark.fillStyle = area.hoverColor ?? theme.markHover;
      } else {
        mark.fillStyle = area.color ?? theme.marker;
      }
      const { begin, end } = new Area(area).shiftByLines(-Y);
      if (begin.y === end.y) {
        const { tabs: beginTabs } = this.getPointTabs({
          x: begin.x,
          y: begin.y + Y
        });
        const { tabs: endTabs } = this.getPointTabs({
          x: end.x,
          y: end.y + Y
        });
        begin.x += beginTabs * this.tabSize - beginTabs;
        end.x += endTabs * this.tabSize - endTabs;
        drawMarkArea({
          begin,
          end
        });
      } else {
        for (let y = begin.y; y <= end.y; y++) {
          let lineLength = this.buffer.getLineLength(y + Y);
          const { tabs } = this.getPointTabs({
            x: lineLength,
            y: y + Y
          });
          lineLength += tabs * this.tabSize - tabs;
          if (y === begin.y) {
            const { tabs: tabs1 } = this.getPointTabs({
              x: begin.x,
              y: begin.y + Y
            });
            begin.x += tabs1 * this.tabSize - tabs1;
            drawMarkArea({
              begin,
              end: {
                x: lineLength
              }
            }, 0, this.char.width / 2);
          } else if (y === end.y) {
            const { tabs: tabs2 } = this.getPointTabs({
              x: end.x,
              y: end.y + Y
            });
            end.x += tabs2 * this.tabSize - tabs2;
            drawMarkArea({
              begin: {
                x: 0,
                y
              },
              end
            }, -this.gutter.padding);
          } else {
            drawMarkArea({
              begin: {
                x: 0,
                y
              },
              end: {
                x: lineLength,
                y
              }
            }, -this.gutter.padding, this.char.width / 2);
          }
        }
      }
    }
    this.postMessage({
      call: "onselection",
      text: this.buffer.getAreaText(this.mark.get())
    });
  };
  updateTitle() {
    if (!this.ctx)
      return;
    this.ctx.title.save();
    this.ctx.title.fillStyle = theme.titlebar;
    this.ctx.title.fillRect(0, 0, this.canvas.title.width, this.canvas.title.height);
    this.applyFont(this.ctx.title);
    this.ctx.title.font = `normal 9pt ${this.fontAlias}`;
    this.ctx.title.scale(this.canvas.pixelRatio, this.canvas.pixelRatio);
    this.ctx.title.fillStyle = theme.title;
    this.ctx.title.fillText(
      (this.extraTitle ?? "") + this.title,
      this.titlebar.dir ? this.canvas.title.width / this.canvas.pixelRatio - 2 - this.char.px.width / this.canvas.pixelRatio * this.title.length : 7.5,
      7.5
    );
    this.ctx.title.restore();
  }
  setOffsetTop(offsetTop, realOffsetTop) {
    this.offsetTop = offsetTop;
    this.realOffsetTop = realOffsetTop;
    this.isVisible = !this.isSubEditor || this.offsetTop + this.scroll.pos.y < this.canvas.height && this.offsetTop + this.scroll.pos.y + this.canvas.gutter.height + this.titlebar.height > 0;
  }
  clear() {
    Object.assign(this.canvas.outer, {
      width: this.canvas.width,
      height: this.canvas.height
    });
  }
  drawTitle() {
    if (this.titlebar.height === 0)
      return;
    this.ctx.outer.fillStyle = theme.titlebar;
  }
  drawBack() {
    if (!this.canvas.back.height || !this.canvas.back.width)
      return;
    const clipTop = Math.max(0, -this.offsetTop);
    this.ctx.outer.drawImage(
      this.canvas.back,
      this.scroll.pos.x,
      this.scroll.pos.y + clipTop,
      this.view.width,
      this.view.height - this.offsetTop - clipTop,
      this.view.left,
      Math.max(0, this.view.top + this.offsetTop + clipTop),
      this.view.width,
      this.view.height - this.offsetTop - clipTop
    );
  }
  drawText() {
    if (!this.canvas.text.height || !this.canvas.text.width)
      return;
    const clipTop = Math.max(0, -this.offsetTop);
    this.ctx.outer.drawImage(
      this.canvas.text,
      this.scroll.pos.x,
      this.scroll.pos.y + clipTop,
      this.view.width,
      this.view.height - this.offsetTop - clipTop,
      this.view.left,
      Math.max(0, this.view.top + this.offsetTop + clipTop),
      this.view.width,
      this.view.height - this.offsetTop - clipTop
    );
  }
  drawGutter() {
    return;
    const clipTop = Math.max(0, -this.offsetTop);
    this.ctx.outer.drawImage(
      this.canvas.gutter,
      0,
      this.scroll.pos.y + clipTop,
      this.canvas.gutter.width,
      this.view.height - this.offsetTop - clipTop,
      0,
      Math.max(0, this.view.top + this.offsetTop + clipTop),
      this.canvas.gutter.width,
      this.view.height - this.offsetTop - clipTop
    );
  }
  drawMark() {
    const markers = [
      ...this.markers,
      ...this.markActive && !this.mark.isEmpty() ? [
        this.mark.get()
      ] : []
    ];
    const totalArea = Area.join(markers);
    if (totalArea.isEmpty())
      return;
    const { begin } = totalArea;
    const y = begin.y * this.char.px.height;
    const clipTop = Math.max(0, -(y + this.offsetTop - this.scroll.pos.y + this.canvas.padding * this.canvas.pixelRatio));
    const posTop = -this.scroll.pos.y + this.offsetTop + y + clipTop + this.titlebar.height + this.canvas.padding * this.canvas.pixelRatio;
    const height = this.canvas.mark.height - clipTop;
    this.ctx.outer.drawImage(
      this.canvas.mark,
      this.scroll.pos.x,
      clipTop,
      this.canvas.mark.width,
      height,
      this.canvas.gutter.width,
      posTop - 3,
      this.canvas.mark.width,
      height
    );
  }
  drawCaret() {
    this.ctx.outer.fillStyle = theme.caret;
    this.ctx.outer.fillRect(
      -this.scroll.pos.x + (this.caret.px.x + this.gutter.width + this.canvas.padding) * this.canvas.pixelRatio,
      -this.scroll.pos.y + this.caret.px.y * this.canvas.pixelRatio + this.titlebar.height + this.offsetTop,
      this.caret.width * this.canvas.pixelRatio,
      this.caret.height * this.canvas.pixelRatio
    );
  }
  drawBlock() {
    this.ctx.outer.fillStyle = "#fff";
    if (this.block.isEmpty())
      return;
    this.ctx.outer.fillRect(
      -this.scroll.pos.x + (this.block.begin.x + this.gutter.width + this.canvas.padding) * this.canvas.pixelRatio + this.char.px.width * 0.08,
      -this.scroll.pos.y + this.block.begin.y * this.canvas.pixelRatio + this.titlebar.height + this.offsetTop + this.char.px.height * 1.1,
      this.char.px.width * 0.84,
      2
    );
    this.ctx.outer.fillRect(
      -this.scroll.pos.x + (this.block.end.x + this.gutter.width + this.canvas.padding) * this.canvas.pixelRatio + this.char.px.width * 0.08,
      -this.scroll.pos.y + this.block.end.y * this.canvas.pixelRatio + this.titlebar.height + this.offsetTop + this.char.px.height * 1.1,
      this.char.px.width * 0.84,
      2
    );
  }
  drawVertScrollbar() {
    this.ctx.outer.strokeStyle = theme.scrollbar;
    this.ctx.outer.lineWidth = this.scrollbar.width;
    const y = this.scroll.pos.y / (this.canvas.text.height + this.subEditorsHeight - this.canvas.height || 1) * (this.scrollbar.view.height - this.scrollbar.vert || 1);
    this.ctx.outer.beginPath();
    this.ctx.outer.moveTo(this.canvas.width - this.scrollbar.margin, y);
    this.ctx.outer.lineTo(this.canvas.width - this.scrollbar.margin, y + this.scrollbar.vert);
    this.ctx.outer.stroke();
  }
  drawHorizScrollbar() {
    this.ctx.outer.strokeStyle = theme.scrollbar;
    this.ctx.outer.lineWidth = this.scrollbar.width;
    const x = this.scroll.pos.x / (this.canvas.scroll.width || 1) * (this.scrollbar.view.width - this.scrollbar.horiz || 1) || 0;
    const y = Math.min(this.canvas.gutter.height + this.offsetTop - this.scroll.pos.y + this.titlebar.height - this.scrollbar.margin, this.canvas.height - this.scrollbar.margin);
    if (y > this.titlebar.height - this.scrollbar.width + this.scrollbar.margin && this.offsetTop + this.titlebar.height < this.canvas.height && x + this.scrollbar.view.width - this.scrollbar.horiz > 12) {
      this.ctx.outer.beginPath();
      this.ctx.outer.moveTo(this.canvas.gutter.width + x, y);
      this.ctx.outer.lineTo(this.canvas.gutter.width + x + this.scrollbar.horiz + 1, y);
      this.ctx.outer.stroke();
    }
  }
  drawSync(noDelegate = false) {
    if (!this.isReady)
      return;
    if (this.isSubEditor && !noDelegate) {
      this.controlEditor.drawSync();
      return;
    }
    if (!this.isSubEditor)
      this.setOffsetTop(0, 0);
    let offsetTop = -this.scroll.pos.y + this.canvas.gutter.height + this.titlebar.height;
    let realOffsetTop = this.canvas.gutter.height + this.titlebar.height;
    this.subEditors.forEach((editor) => {
      editor.setOffsetTop(offsetTop, realOffsetTop);
      offsetTop += editor.canvas.gutter.height + editor.titlebar.height;
      realOffsetTop += editor.canvas.gutter.height + editor.titlebar.height;
    });
    if (!this.isSubEditor) {
      this.clear();
    }
    this.drawBack();
    this.drawMark();
    if (this.controlEditor.focusedEditor === this && this.hasFocus) {
      this.drawCaret();
      this.drawBlock();
    }
    if (!this.isSubEditor && this.isVisible)
      this.drawTitle();
    this.subEditors.forEach((editor) => editor.isVisible && editor.drawTitle());
    this.drawText();
    this.drawGutter();
    this.subEditors.forEach((editor) => editor.isVisible && editor.drawSync(true));
    if (!this.isSubEditor && this.hasFocus) {
      this.drawVertScrollbar();
      this.drawHorizScrollbar();
      this.subEditors.forEach((editor) => editor.isVisible && editor.drawHorizScrollbar());
    }
    if (!this.isSubEditor) {
      this.postMessage({
        call: "ondraw"
      });
    }
  }
  draw = worker_default.queue.raf(() => {
    if (this.isSubEditor) {
      this.controlEditor.draw();
    } else {
      this.drawSync();
    }
  });
  drawAnimFrame(_drawAnimFrame) {
    throw new Error("Method not implemented.");
  }
  scrollTo(pos) {
    this.animScrollCancel();
    this.scroll.pos.set(Point2.clamp(this.canvas.scroll, pos));
    this.scroll.target.set(this.scroll.pos);
    this.drawSync();
  }
  scrollBy(d, animType, clamp3 = false) {
    this.scroll.target.set(Point2.clamp(clamp3 ? {
      begin: {
        x: 0,
        y: this.controlEditor.focusedEditor.realOffsetTop
      },
      end: {
        x: this.canvas.scroll.width,
        y: this.controlEditor.focusedEditor.realOffsetTop + this.controlEditor.focusedEditor.canvas.text.height - this.view.height + this.titlebar.height
      }
    } : this.canvas.scroll, this.scroll.pos.add(d)));
    if (!animType) {
      this.scrollTo(this.scroll.target);
    } else {
      this.animScrollStart(animType);
    }
  }
  animScrollCancel() {
    this.scrollAnim.isRunning = false;
    cancelAnimationFrame(this.scrollAnim.animFrame);
  }
  animScrollStart(animType = "ease") {
    this.scrollAnim.type = animType;
    if (this.scrollAnim.isRunning)
      return;
    this.scrollAnim.isRunning = true;
    this.scrollAnim.animFrame = requestAnimationFrame(this.animScrollTick);
    const s = this.scroll.pos;
    const t2 = this.scroll.target;
    if (s.equal(t2))
      return this.animScrollCancel();
    const d = t2.minus(s);
    d.x = Math.sign(d.x) * 5;
    d.y = Math.sign(d.y) * 5;
    this.scroll.pos.set(Point2.clamp(this.canvas.scroll, this.scroll.pos.add(d)));
    this.drawSync();
  }
  animScrollTick() {
    const { scale, threshold } = this.scrollAnim;
    let { speed } = this.scrollAnim;
    const d = this.scroll.target.minus(this.scroll.pos);
    const a = d.abs();
    if (a.y > this.canvas.height * threshold.far) {
      speed *= scale.far;
    }
    if (a.x < 0.5 && a.y < 0.5) {
      this.scrollTo(this.scroll.target);
    } else if (this.scroll.pos.equal(this.scroll.target)) {
      this.animScrollCancel();
    } else {
      this.scrollAnim.animFrame = requestAnimationFrame(this.animScrollTick);
      switch (this.scrollAnim.type) {
        case "linear":
          if (a.x < speed * threshold.mid)
            d.x = d.x * (a.x < speed * threshold.near ? a.x < threshold.tiny ? scale.tiny : scale.near : scale.mid);
          else
            d.x = Math.sign(d.x) * speed;
          if (a.y < speed * threshold.mid)
            d.y = d.y * (a.y < speed * threshold.near ? a.y < threshold.tiny ? scale.tiny : scale.near : scale.mid);
          else
            d.y = Math.sign(d.y) * speed;
          break;
        case "ease":
          d.x *= 0.26;
          d.y *= 0.26;
          break;
      }
      this.scroll.pos.set(Point2.clamp(this.canvas.scroll, this.scroll.pos.add(d)));
      this.drawSync();
    }
  }
  maybeDelegateMouseEvent(eventName, e) {
    if (this.isSubEditor)
      return false;
    for (const editor of this.subEditors.values()) {
      if (e.clientY * this.canvas.pixelRatio > editor.offsetTop && e.clientY * this.canvas.pixelRatio < editor.offsetTop + editor.canvas.gutter.height + editor.titlebar.height) {
        if (eventName === "onmousedown") {
          this.controlEditor.setFocusedEditor(editor);
        }
        editor[eventName](e);
        return true;
      }
    }
    if (eventName !== "onmousewheel" && this.controlEditor.focusedEditor !== this) {
      this.controlEditor.setFocusedEditor(this);
    }
    return false;
  }
  maybeDelegateEvent(eventName, e) {
    if (this.isSubEditor)
      return false;
    if (this.focusedEditor && this.focusedEditor !== this) {
      this.focusedEditor?.[eventName](e);
      return true;
    }
    return false;
  }
  oncontextmenu() {
  }
  onmouseenter() {
  }
  onmouseover() {
  }
  onmouseout() {
  }
  onmousewheel(e) {
    let { deltaX, deltaY } = e;
    if (e.cmdKey) {
      let fontSize = this.fontSize;
      fontSize += Math.sign(deltaY) * 0.5;
      fontSize = +Math.max(1, fontSize).toFixed(1);
      this.fontSize = fontSize;
      this.updateChar();
      this.updateSizes(true);
      this.updateText();
      this.updateMark();
      this.moveCaret(this.caret.pos);
      this.controlEditor.draw();
      this.postMessage({
        call: "onfontsize",
        fontSize
      });
      return;
    }
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (!this.maybeDelegateMouseEvent("onmousewheel", e)) {
        deltaX *= 0.75;
        this.scrollBy({
          x: deltaX,
          y: 0
        }, "linear");
      }
    } else {
      deltaY *= 0.75;
      this.scrollBy({
        x: 0,
        y: deltaY
      }, "linear");
    }
  }
  onmouseup() {
    if (this.mark.isEmpty())
      this.markClear();
  }
  onmousedown(e) {
    if (!this.maybeDelegateMouseEvent("onmousedown", e)) {
      this.usedMouseRight = false;
      if (e.left) {
        this.maybeHoverMarkerByEvent(e);
        this.markClear();
        this.updateMark();
        this.setCaretByMouse(e);
        this.markBegin();
        this.draw();
      } else if (e.right) {
        this.usedMouseRight = true;
      }
    }
  }
  hoveredMarkerIndex = -1;
  maybeHoverMarkerByEvent(e) {
    if (e.clientX == null || e.clientY == null)
      return;
    const pos = this.getPointByMouse(e);
    const { offset } = this.buffer.getPoint(pos);
    let i = 0;
    for (const { index, size, kind } of this.origMarkers) {
      if (kind !== "param")
        continue;
      if (offset >= index && offset < index + size) {
        if (this.hoveredMarkerIndex !== i) {
          this.hoveredMarkerIndex = i;
          this.updateMark();
          this.draw();
          this.postMessage({
            call: "onentermarker",
            markerIndex: i
          });
        }
        return;
      }
      i++;
    }
    if (this.hoveredMarkerIndex !== -1) {
      const i1 = this.hoveredMarkerIndex;
      this.hoveredMarkerIndex = -1;
      this.updateMark();
      this.draw();
      this.postMessage({
        call: "onleavemarker",
        markerIndex: i1
      });
    }
  }
  onmousemove(e) {
    if (!this.maybeDelegateEvent("onmousemove", e)) {
      if (!this.usedMouseRight) {
        if (e.left) {
          this.setCaretByMouse(e);
          this.markSet();
          this.drawSync();
        } else {
          this.maybeHoverMarkerByEvent(e);
        }
      }
    }
  }
  keepCaretInView(animType, centered, clamp3) {
    const caretPxDiff = this.getCaretPxDiff(centered);
    if (this.controlEditor === this) {
      this.scrollBy({
        x: -caretPxDiff.x,
        y: -caretPxDiff.y
      }, animType, clamp3);
    } else {
      if (caretPxDiff.x !== 0)
        this.scrollBy({
          x: -caretPxDiff.x,
          y: 0
        }, animType);
      if (caretPxDiff.y !== 0)
        this.controlEditor.scrollBy({
          x: 0,
          y: -caretPxDiff.y
        }, animType, clamp3);
    }
  }
  applyCaretDiff(diff2, jump = false) {
    const diffPx = new Point2(diff2).mul(this.char.px);
    const caretPxDiff = this.getCaretPxDiff();
    if (caretPxDiff.x !== 0)
      this.scrollBy({
        x: -caretPxDiff.x,
        y: 0
      });
    if (caretPxDiff.y !== 0) {
      if (jump) {
        this.controlEditor.scrollBy({
          x: 0,
          y: -(diffPx.y || caretPxDiff.y)
        }, "ease", true);
      } else {
        this.controlEditor.scrollBy({
          x: 0,
          y: -caretPxDiff.y
        }, "ease");
      }
    }
  }
  onkeydown(e) {
    if (this.maybeDelegateEvent("onkeydown", e))
      return;
    this.keys.delete(e.key.toLowerCase());
    this.keys.delete(e.key.toUpperCase());
    this.keys.add(e.key);
    this.keys.add(e.which);
    this.keys.add(e.char);
    this.key = e.key.length === 1 ? e.key : null;
    if (!e.cmdKey && this.key)
      return this.insert(this.key);
    if (!e.cmdKey && e.key === "Enter")
      return this.insert("\n");
    if (!e.cmdKey && e.key === "Backspace")
      return this.backspace();
    if (!e.cmdKey && !e.shiftKey && e.key === "Delete")
      return this.delete();
    this.pressed = [
      e.cmdKey && "Cmd",
      e.altKey && "Alt",
      e.key
    ].filter(Boolean).join(" ");
    if (e.shiftKey && e.key !== "Shift")
      this.markBegin();
    else if (e.key !== "Delete" && !e.cmdKey && e.key !== "Tab") {
      this.markClear();
      this.updateMark();
    }
    switch (this.pressed) {
      case "Cmd z":
        {
          const editor = this.controlEditor.history.undo(this.controlEditor.history.needle - 1);
          if (editor)
            this.setFocusedEditor(editor);
          this.draw();
        }
        break;
      case "Cmd y":
        {
          const editor1 = this.controlEditor.history.redo(this.controlEditor.history.needle + 1);
          if (editor1)
            this.setFocusedEditor(editor1);
          this.draw();
        }
        break;
      case "Tab":
        {
          const tab = " ".repeat(this.tabSize);
          let add;
          let area;
          let text;
          const prevArea = this.mark.copy();
          const clear = false;
          const caret = this.caret.pos.copy();
          const align = this.caret.align;
          let matchIndent = false;
          if (!this.markActive) {
            this.insert(tab);
            break;
          } else {
            area = this.mark.get();
            area.end.y += area.end.x > 0 ? 1 : 0;
            area.begin.x = 0;
            area.end.x = 0;
            text = this.buffer.getAreaText(area);
            matchIndent = true;
          }
          if (e.shiftKey) {
            add = -2;
            text = text.replace(/^ {1,2}(.+)/gm, "$1");
          } else {
            add = 2;
            text = text.replace(/^([\s]*)(.+)/gm, `$1${tab}$2`);
          }
          this.mark.set(area);
          this.insert(text);
          this.mark.set(prevArea);
          this.mark.begin.x += this.mark.begin.x > 0 ? add : 0;
          this.mark.end.x += this.mark.end.x > 0 ? add : 0;
          this.markActive = !clear;
          this.caret.align = align;
          if (matchIndent) {
            caret.x += add;
            this.caret.align += add;
          }
          this.setCaret(caret);
          this.updateMark();
          this.draw();
        }
        break;
      case "Cmd ,":
      case "Cmd ?": {
        if (!this.markActive || e.key === "?") {
          let y = this.caret.pos.y;
          while (y > 0 && this.buffer.getLineLength(y) > 0)
            y--;
          const startY = ++y;
          y = this.caret.pos.y;
          while (y <= this.sizes.loc && this.buffer.getLineLength(y) > 0)
            y++;
          const endY = --y;
          this.mark.set({
            begin: {
              x: 0,
              y: startY
            },
            end: {
              x: this.buffer.getLineLength(endY),
              y: endY
            }
          });
          this.markActive = true;
          this.updateMark();
          this.draw();
          if (e.key !== ",") {
            break;
          }
        }
      }
      case "Cmd /":
        {
          let add1;
          let area1;
          let text1;
          const prevArea1 = this.mark.copy();
          let clear1 = false;
          const caret1 = this.caret.pos.copy();
          const align1 = this.caret.align;
          let matchIndent1 = false;
          if (!this.markActive) {
            clear1 = true;
            this.markClear();
            this.moveBeginOfLine();
            this.markBegin();
            this.moveEndOfLine();
            this.markSet();
            area1 = this.mark.get();
            text1 = this.buffer.getAreaText(area1);
            matchIndent1 = text1.match(/\S/)?.index < caret1.x;
          } else {
            area1 = this.mark.get();
            if (area1.end.x > 0) {
              area1.end.x = this.buffer.getLineLength(area1.end.y);
            } else {
              area1.end.y--;
              area1.end.x = this.buffer.getLineLength(area1.end.y);
            }
            area1.begin.x = 0;
            text1 = this.buffer.getAreaText(area1);
            matchIndent1 = true;
          }
          if (text1.trimLeft().substr(0, 2) === "\\ ") {
            add1 = -2;
            text1 = text1.replace(/^(\s+)?\\ (.+)?/gm, "$1$2");
          } else {
            add1 = 2;
            text1 = text1.replace(/^(\s+)?/gm, "\\ $1");
          }
          this.mark.set(area1);
          this.insert(text1, false, false);
          this.mark.set(prevArea1);
          this.mark.begin.x += this.mark.begin.x > 0 ? add1 : 0;
          this.mark.end.x += this.mark.end.x > 0 ? add1 : 0;
          this.markActive = !clear1;
          this.caret.align = align1;
          if (matchIndent1) {
            caret1.x += add1;
            this.caret.align += add1;
          }
          this.setCaret(caret1);
          this.updateMark();
          this.keepCaretInView();
          this.draw();
          if (e.key === ",") {
            this.postMessage({
              call: "onblockcomment"
            });
          }
        }
        return;
      case "Cmd D":
        {
          this.align();
          const area2 = this.mark.get();
          if (area2.isEmpty()) {
            this.buffer.insert(new Point2({
              x: 0,
              y: this.caret.pos.y
            }), this.buffer.getLineText(this.caret.pos.y) + (this.caret.pos.y === this.buffer.loc() ? "\n" : ""));
            this.updateSizes();
            this.updateText();
            this.moveByLines(1);
            this.markClear(true);
          } else if (area2.begin.y === area2.end.y) {
            const text2 = this.buffer.getAreaText(area2);
            this.buffer.insert(this.caret.pos, text2);
            this.updateSizes();
            this.updateText();
            this.moveByChars(text2.length);
            this.mark.addRight(text2.length);
            this.updateMark();
          } else {
            let text3 = "";
            let addY = 0;
            if (area2.end.x > 0) {
              addY = 1;
              text3 = "\n";
              area2.end.x = this.buffer.getLineLength(area2.end.y);
            }
            area2.begin.x = 0;
            text3 = text3 + this.buffer.getAreaText(area2);
            this.buffer.insert(area2.end, text3);
            area2.end.y += addY;
            this.updateSizes();
            this.updateText();
            this.moveByLines(area2.height);
            this.mark.shiftByLines(area2.height);
            this.updateMark();
          }
          this.keepCaretInView("ease");
          this.draw();
        }
        return;
      case "Delete":
      case "Cmd x":
        if (!this.mark.isEmpty()) {
          this.delete();
        } else {
          this.markClear(true);
          this.moveBeginOfLine();
          this.markBegin();
          const diff2 = this.caret.pos.y === this.sizes.loc ? this.moveEndOfLine() : this.moveByLines(1);
          if (diff2.y !== 0 || diff2.x !== 0) {
            this.markSet();
            this.delete();
          } else {
            this.markClear(true);
          }
        }
        break;
      case "Cmd a":
        this.markClear(true);
        this.moveBeginOfFile();
        this.markBegin();
        this.moveEndOfFile();
        this.markSet();
        break;
      case "Cmd Backspace":
        this.markBegin();
        e.shiftKey ? this.moveBeginOfLine() : this.moveByWords(-1);
        this.markSet(true);
        this.delete();
        break;
      case "Cmd Delete":
        this.markBegin();
        e.shiftKey ? this.moveEndOfLine() : this.moveByWords(1);
        this.markSet(true);
        this.delete();
        this.align();
        break;
      case "Cmd ArrowLeft":
        this.moveByWords(-1);
        this.align();
        break;
      case "Cmd ArrowRight":
        this.moveByWords(1);
        this.align();
        break;
      case "Cmd ArrowUp":
        if (e.shiftKey) {
          this.align();
          this.markBegin(false);
          const area3 = this.mark.get();
          if (!area3.isEmpty() && area3.end.x === 0) {
            area3.end.y = area3.end.y - 1;
            area3.end.x = this.buffer.getLine(area3.end.y).length;
          }
          if (this.buffer.moveAreaByLines(-1, area3)) {
            this.updateSizes();
            this.updateText();
            this.mark.shiftByLines(-1);
            this.applyCaretDiff(this.moveByLines(-1));
            this.updateMark();
          }
        } else {
          this.scrollBy({
            x: 0,
            y: -this.char.px.height
          }, "ease");
        }
        break;
      case "Cmd ArrowDown":
        if (e.shiftKey) {
          this.align();
          this.markBegin(false);
          const area4 = this.mark.get();
          if (!area4.isEmpty() && area4.end.x === 0) {
            area4.end.y = area4.end.y - 1;
            area4.end.x = this.buffer.getLine(area4.end.y).length;
          }
          if (this.buffer.moveAreaByLines(1, area4)) {
            this.updateSizes();
            this.updateText();
            this.mark.shiftByLines(1);
            this.applyCaretDiff(this.moveByLines(1));
            this.updateMark();
          }
        } else {
          this.scrollBy({
            x: 0,
            y: +this.char.px.height
          }, "ease");
        }
        break;
      case "ArrowLeft":
        this.applyCaretDiff(this.moveByChars(-1));
        if (e.shiftKey)
          this.markSet();
        break;
      case "ArrowRight":
        this.applyCaretDiff(this.moveByChars(1));
        if (e.shiftKey)
          this.markSet();
        break;
      case "ArrowUp":
        this.applyCaretDiff(this.moveByLines(-1));
        if (e.shiftKey)
          this.markSet();
        break;
      case "ArrowDown":
        this.applyCaretDiff(this.moveByLines(1));
        if (e.shiftKey)
          this.markSet();
        break;
      case "Alt PageUp":
        this.controlEditor.moveByEditors(-1);
        break;
      case "Alt PageDown":
        this.controlEditor.moveByEditors(1);
        break;
      case "PageUp":
        {
          const caretPos = this.caret.pos.copy();
          this.applyCaretDiff(this.moveByLines(-this.page.lines), true);
          if (e.shiftKey)
            this.markSet();
          else {
            if (caretPos.equal(this.caret.pos)) {
              this.controlEditor.moveByEditors(-1);
            }
          }
        }
        break;
      case "PageDown":
        {
          const caretPos1 = this.caret.pos.copy();
          this.applyCaretDiff(this.moveByLines(+this.page.lines), true);
          if (e.shiftKey)
            this.markSet();
          else {
            if (caretPos1.equal(this.caret.pos)) {
              this.controlEditor.moveByEditors(1);
            }
          }
        }
        break;
      case "Home":
        this.applyCaretDiff(this.moveBeginOfLine({
          isHomeKey: true
        }));
        if (e.shiftKey)
          this.markSet();
        break;
      case "End":
        this.applyCaretDiff(this.moveEndOfLine());
        if (e.shiftKey)
          this.markSet();
        break;
    }
    this.draw();
  }
  moveByEditors(y) {
    const editors = [
      this,
      ...this.subEditors
    ];
    let index = editors.indexOf(this.focusedEditor);
    const prev = index;
    index += y;
    if (index > editors.length - 1)
      index = 0;
    if (index < 0)
      index = editors.length - 1;
    if (prev === index)
      return;
    const editor = editors[index];
    if (y > 0)
      editor.setCaret({
        x: 0,
        y: 0
      });
    else
      editor.setCaret({
        x: 0,
        y: editor.sizes.loc
      });
    this.setFocusedEditor(editor);
  }
  onkeyup(e) {
    if (this.maybeDelegateEvent("onkeyup", e))
      return;
    this.keys.delete(e.key.toLowerCase());
    this.keys.delete(e.key.toUpperCase());
    this.keys.delete(e.key);
    this.keys.delete(e.which);
    this.keys.delete(e.char);
    if (e.key === this.key) {
      this.key = null;
    }
  }
  onpaste({ text }) {
    if (this.maybeDelegateEvent("onpaste", {
      text
    }))
      return;
    this.insert(text, true);
  }
  onhistory({ needle }) {
    if (needle !== this.history.needle) {
      let editor;
      if (needle < this.history.needle) {
        editor = this.history.undo(needle);
      } else if (needle > this.history.needle) {
        editor = this.history.redo(needle);
      }
      if (editor) {
        this.setFocusedEditor(editor);
      }
    }
  }
  setFocusedEditor(editor) {
    const hasFocus = this.focusedEditor?.hasFocus;
    if (editor !== this.focusedEditor) {
      this.focusedEditor?.onblur();
      this.focusedEditor = editor;
      if (hasFocus) {
        this.postMessage({
          call: "onfocus",
          id: editor.id
        });
      }
    }
    editor.onfocus();
    editor.updateSizes();
    editor.updateText();
    editor.updateMark();
    editor.draw();
  }
  onblur() {
    if (this.controlEditor.focusedEditor) {
      this.controlEditor.focusedEditor.hoveredMarkerIndex = -1;
      this.controlEditor.focusedEditor.updateMark();
      this.controlEditor.focusedEditor.hasFocus = false;
      this.controlEditor.focusedEditor.keys.clear();
      this.controlEditor.focusedEditor = null;
    }
    this.controlEditor.draw();
  }
  onfocus() {
    if (this.controlEditor.focusedEditor) {
      this.controlEditor.focusedEditor.hasFocus = true;
      this.controlEditor.focusedEditor.keys.clear();
    } else {
      this.controlEditor.focusedEditor = this;
      this.controlEditor.hasFocus = true;
    }
    this.postMessage({
      call: "onfocus",
      id: this.controlEditor.focusedEditor.id
    });
    this.controlEditor.draw();
  }
  onresize = worker_default.queue.raf(({ width, height }) => {
    const set = (c) => {
      if (!c)
        return;
      c.width = width;
      c.height = height;
    };
    if (!this.canvas)
      return;
    set(this.canvas);
    set(this.canvas.outer);
    set(this.canvas.gutter);
    set(this.canvas.title);
    set(this.canvas.mark);
    set(this.canvas.back);
    set(this.canvas.text);
    set(this.canvas.debug);
    set(this.canvas.scroll);
    this.updateChar();
    this.updateSizes(true);
    this.updateTextSync();
    this.updateMark();
    this.drawSync();
  });
  replaceChunk = ({ start, end, text, code }) => {
    if (code !== this.buffer.toString()) {
      throw new Error(`Attempt to replace chunk but own buffer has diverged.

Own buffer:
-----------
"${this.buffer.toString()}"

Other buffer:
"${code}"

Attempt to replace chunk:

"${text}"

at position: ${start}-${end}
`);
    }
    const sp = this.buffer.getOffsetPoint(start);
    const ep = this.buffer.getOffsetPoint(end);
    const prev = this.caret.pos.copy();
    this.markClear();
    this.moveCaret(sp);
    this.markBegin();
    this.moveCaret(ep);
    this.markSet();
    this.insert(text, true, false);
    this.moveCaret(prev);
    this.markClear();
  };
  setValue = ({ value }) => {
    if (value !== this.buffer.toString()) {
      const prev = this.caret.pos.copy();
      this.markClear();
      this.moveBeginOfFile();
      this.markBegin();
      this.moveEndOfFile();
      this.markSet();
      this.insert(value, true, false);
      this.moveCaret(prev);
      this.markClear();
    }
  };
};
if (isWorker) {
  const editor = new Editor();
  onmessage = ({ data }) => {
    if (!(data.call in editor)) {
      throw new Error("EditorWorker: no such method:" + data.call);
    }
    editor[data.call](data);
  };
}

// ../../canvy/dist/esm/editor.js
var __decorate3 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata3 = function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var File = class {
  id;
  title;
  value;
  editor;
  previousId;
  constructor(data = {}) {
    this.id = data.id ?? cheapRandomId();
    this.title = data.title ?? "untitled";
    this.value = data.value ?? "";
    this.previousId = this.id;
  }
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      value: this.value
    };
  }
  updateMeta() {
    this.setData({
      id: this.id,
      title: this.title
    });
  }
  focus() {
    this.editor.worker.postMessage({
      call: "setFocusedEditorById",
      id: this.id
    });
  }
  setColor(color) {
    this.editor.worker.postMessage({
      call: "setColor",
      id: this.id,
      color
    });
  }
  setData(data) {
    this.editor.worker.postMessage({
      call: "setEditorData",
      id: this.previousId,
      data
    });
    this.previousId = this.id;
  }
  rename(newTitle) {
    this.title = newTitle;
    this.updateMeta();
  }
  delete() {
    this.editor.files.splice(this.editor.files.indexOf(this), 1);
    this.editor.worker.postMessage({
      call: "deleteEditor",
      id: this.id
    });
    if (!this.editor.files.length) {
    }
  }
  moveUp() {
    const index = this.editor.files.indexOf(this);
    if (index >= 1) {
      this.editor.worker.postMessage({
        call: "moveEditorUp",
        id: this.id
      });
      const self2 = this.editor.files[index];
      const other = this.editor.files[index - 1];
      this.editor.files.splice(index - 1, 2, self2, other);
      return [
        self2,
        other
      ];
    }
  }
  moveDown() {
    const index = this.editor.files.indexOf(this);
    if (index < this.editor.files.length - 1) {
      this.editor.worker.postMessage({
        call: "moveEditorDown",
        id: this.id
      });
      const self2 = this.editor.files[index];
      const other = this.editor.files[index + 1];
      this.editor.files.splice(index, 2, other, self2);
      return [
        other,
        self2
      ];
    }
  }
};
var CanvyElement = class CanvyElement2 extends esm_default.mix(HTMLElement, esm_default.mixins.layout()) {
  fontSize = 11;
  focused = false;
  caret;
  scene;
  worker;
  pixelRatio = window.devicePixelRatio;
  isVisible = true;
  files = [];
  focusedFile = esm_default(this).reduce.once(({ files }) => files[0]);
  ready = false;
  canvas;
  font;
  _setCaret({ caret }) {
    this.caret = caret;
  }
  _onready() {
    this.ready = true;
  }
  _ondraw() {
  }
  _onblur = esm_default(this).reduce(({ $: $4, worker }) => () => {
    $4.focused = false;
    $4.hoveringMarkerIndex = null;
    worker.postMessage({
      call: "onblur"
    });
  });
  _onfocus = esm_default(this).reduce(({ $: $4, files }) => ({ id }) => {
    $4.focused = true;
    const file = files.find((file2) => file2.id === id);
    if (!file)
      return;
    $4.focusedFile = file;
  });
  _onresize = esm_default(this).reduce(({ canvas, pixelRatio }) => ({ width, height }) => {
    canvas.style.width = width / pixelRatio + "px";
    canvas.style.height = height / pixelRatio + "px";
  });
  _onselection = esm_default(this).reduce(({ scene }) => ({ text }) => {
    scene.selectionText = text;
  });
  _onedit = esm_default(this).reduce(({ host, files }) => ({ file }) => {
    const f = files.find((f2) => f2.id === file.id);
    if (f) {
      Object.assign(f, file);
      esm_default.dispatch.composed(host, "edit");
    }
  });
  _onchange = esm_default(this).reduce(({ host, files }) => ({ file }) => {
    const f = files.find((f2) => f2.id === file.id);
    if (f) {
      Object.assign(f, file);
      esm_default.dispatch.composed(host, "change");
    }
  });
  _onfontsize = esm_default(this).reduce(({ $: $4 }) => ({ fontSize }) => {
    $4.fontSize = fontSize;
  });
  hoveringMarkerIndex;
  _onentermarker = esm_default(this).reduce(({ $: $4, host }) => ({ markerIndex }) => {
    if (!~markerIndex)
      return;
    $4.hoveringMarkerIndex = markerIndex;
    host.dispatch.composed("entermarker", markerIndex);
  });
  _onleavemarker = esm_default(this).reduce(({ $: $4, host }) => ({ markerIndex }) => {
    $4.hoveringMarkerIndex = null;
    host.dispatch.composed("leavemarker", markerIndex);
  });
  replaceChunk = esm_default(this).reduce(({ worker }) => function callReplaceChunk(params) {
    worker.postMessage({
      call: "replaceChunk",
      ...params
    });
  });
  setMarkers = esm_default(this).reduce(({ worker }) => (markers) => {
    worker.postMessage({
      call: "onmarkers",
      markers
    });
  });
  setValue = esm_default(this).reduce(({ worker }) => (value) => {
    worker.postMessage({
      call: "setValue",
      value
    });
  });
  get value() {
    return this.files[0]?.value;
  }
  mounted($4) {
    $4.effect(({ host, scene, _onblur }) => {
      host.tabIndex = 0;
      return [
        $4.on(host).focus(() => {
          ($4.focusedFile ?? $4.files[0])?.focus();
          scene.activeEditor = host;
        }),
        $4.on(host).blur(() => {
          if (scene.activeEditor === host) {
            _onblur();
            scene.activeEditor = null;
          }
        })
      ];
    });
    $4.effect(({ host, scene }) => {
      scene.register(host);
    });
    $4.effect(({ host }) => {
      $4.worker = new PseudoWorker();
      $4.worker.onerror = (error) => host.dispatch("error", error);
      $4.worker.onmessage = ({ data }) => {
        const method = "_" + data.call;
        if (!(method in this)) {
          throw new Error("Editor: no such method: " + method);
        }
        this["_" + data.call](data);
      };
    });
    $4.effect(({ host }) => $4.observe.resize.initial(host, () => {
      $4.rect = new $4.Rect(host.getBoundingClientRect());
    }));
    $4.effect(({ canvas, worker, pixelRatio, rect: { size }, ready }) => {
      if (!ready)
        return;
      requestAnimationFrame(() => {
        Object.assign(canvas.style, size.toStyleSize());
      });
      worker.postMessage({
        call: "onresize",
        ...size.scale(pixelRatio).toSizeObject()
      });
    });
    $4.effect.once.raf(({ host, size, files, worker, canvas, pixelRatio }) => {
      if (files.length === 0) {
        const file = new File();
        file.value = "";
        file.editor = host;
        files = $4.files = [
          file
        ];
      }
      files.forEach((file) => {
        file.editor = host;
      });
      canvas.width = size.width;
      canvas.height = size.height;
      worker.postMessage({
        call: "setup",
        ...size.scale(pixelRatio).toSizeObject(),
        font: $4.font,
        fontSize: $4.fontSize,
        titlebarHeight: 0,
        files: files.map((file) => file.toJSON()),
        outerCanvas: canvas,
        pixelRatio
      }, [
        canvas
      ]);
    });
    $4.render(() => /* @__PURE__ */ jsxs(Fragment, {
      children: [
        /* @__PURE__ */ jsx("style", {
          children: `
          :host {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            outline: none;
            box-sizing: border-box;
            /* border-top: 3px dashed transparent; */
            /* overflow: hidden; */
            /* background: #44f4; */
          }
          :host(:focus) {
            z-index: 1000;
            /* border-top-color: #fff4; */
          }
          [part=canvas] {
            /* background: #44f4; */
            /* height: 100%; */
            /* width: 100%; */
          }
          :host(:not([ready])) [part=canvas] {
            display: none;
          }
        `
        }),
        /* @__PURE__ */ jsx("canvas", {
          part: "canvas",
          ref: $4.ref.canvas
        })
      ]
    }));
  }
  handleEvent = (eventName, data) => {
    if (this.hoveringMarkerIndex != null && eventName === "mousewheel") {
      this.dispatch("event", {
        name: eventName,
        data
      });
      return;
    }
    this.worker.postMessage({
      call: "on" + eventName,
      ...data
    });
  };
};
__decorate3([
  esm_default.out()
], CanvyElement.prototype, "fontSize", void 0);
__decorate3([
  esm_default.attr()
], CanvyElement.prototype, "focused", void 0);
__decorate3([
  esm_default.out(),
  __metadata3("design:type", Array)
], CanvyElement.prototype, "files", void 0);
__decorate3([
  esm_default.attr()
], CanvyElement.prototype, "ready", void 0);
CanvyElement = __decorate3([
  esm_default.element()
], CanvyElement);
var Canvy = esm_default.element(CanvyElement);

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

// ../../canvy/dist/esm/editor-scene.js
var __decorate4 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata4 = function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var EditorScene = class EditorScene2 {
  selectionText = "";
  editors = new ImmSet();
  caret;
  ignoredElements = [];
  activeEditor;
  fullEditor;
  layout;
  constructor(data) {
    Object.assign(this, data);
  }
  created($4) {
    $4.effect(({ layout: layout2, editors }) => {
      if (!editors.size)
        return;
      const findEditorFromEvent = (e) => {
        const pointerPos = new $4.Point(e.pageX, e.pageY);
        const normalizedPointerPos = pointerPos;
        for (const editor of editors) {
          const rect = new $4.Rect(editor.getBoundingClientRect());
          if (pointerPos.withinRect(rect)) {
            return {
              editor,
              pointerPos,
              normalizedPointerPos
            };
          }
        }
        return {
          pointerPos,
          normalizedPointerPos
        };
      };
      const mouseEventToJson = (e) => ({
        deltaX: e.deltaX,
        deltaY: e.deltaY,
        cmdKey: $4.isMac ? e.metaKey : e.ctrlKey,
        left: e.buttons & $4.MouseButton.Left,
        middle: e.buttons & $4.MouseButton.Middle,
        right: e.buttons & $4.MouseButton.Right
      });
      const handleKeyEvent = (e, editor) => {
        const { key, which, altKey, shiftKey, ctrlKey, metaKey } = e;
        const cmdKey = $4.isMac ? metaKey : ctrlKey;
        if (cmdKey && key === "r")
          return false;
        if (cmdKey && key === "+")
          return false;
        if (cmdKey && key === "-")
          return false;
        if (cmdKey && key === "c") {
          if (e.type === "keydown") {
            navigator.clipboard.writeText($4.selectionText);
            return false;
          }
        }
        if (cmdKey && key === "x") {
          if (e.type === "keydown") {
            navigator.clipboard.writeText($4.selectionText);
            $4.selectionText = "";
          }
        }
        if (cmdKey && (key === "v" || key === "V")) {
          if (e.type === "keydown") {
            navigator.clipboard.readText().then((text) => {
              $4.activeEditor?.handleEvent("paste", {
                text
              });
            });
            return false;
          }
        }
        if (cmdKey && shiftKey && key === "J")
          return false;
        if (altKey && (key === "ArrowLeft" || key === "ArrowRight"))
          return false;
        const ev = {
          key,
          which,
          char: String.fromCharCode(which),
          altKey,
          shiftKey,
          ctrlKey,
          metaKey,
          cmdKey,
          caret: $4.caret
        };
        e.stopPropagation();
        e.preventDefault();
        editor.handleEvent(e.type, ev);
      };
      const handleMouseEvent = (name, e, editor, pos) => {
        e.stopPropagation();
        e.preventDefault();
        editor.handleEvent(name, {
          ...mouseEventToJson(e),
          clientX: pos.x - editor.pos.x + (layout2.pos?.x ?? 0),
          clientY: pos.y - editor.pos.y + (layout2.pos?.y ?? 0)
        });
      };
      let isDown = false;
      let intentMove = false;
      let intentMoveTimeout;
      const stopIntentMove = () => {
        clearTimeout(intentMoveTimeout);
        intentMoveTimeout = setTimeout(() => {
          intentMove = false;
        }, 500);
      };
      return $4.chain($4.on(window).pointermove((e) => {
        if (!$4.layout.viewMatrix)
          return;
        if (!$4.activeEditor && $4.layout.viewMatrix.a < 0.65)
          return;
        if (!layout2.state.isIdle)
          return;
        if (e.altKey)
          return;
        const ev = findEditorFromEvent(e);
        const { normalizedPointerPos } = ev;
        let { editor } = ev;
        if (isDown && !editor)
          editor = $4.activeEditor;
        if (editor) {
          intentMove = editor;
          stopIntentMove();
        } else {
          intentMove = false;
        }
        if (editor && $4.activeEditor === editor) {
          handleMouseEvent("mousemove", e, editor, normalizedPointerPos);
          return;
        }
      }), $4.on(window).pointerdown.capture((e) => {
        const [firstElement] = e.composedPath();
        const part = firstElement?.getAttribute?.("part");
        if (part !== "item" && part !== "sliders")
          return;
        {
          const editor = firstElement.getRootNode().host;
          editor.rect = new $4.Rect(editor.getBoundingClientRect());
        }
        if (!(e.buttons & $4.MouseButton.Left))
          return;
        if (!layout2.state.isIdle)
          return;
        if (e.altKey)
          return;
        const focused = $4.getActiveElement(document.activeElement);
        if (focused !== document.body)
          focused?.blur();
        const { editor: editor1, normalizedPointerPos } = findEditorFromEvent(e);
        if (editor1) {
          clearTimeout(intentMoveTimeout);
          isDown = true;
          if ($4.activeEditor && $4.activeEditor !== editor1) {
            $4.activeEditor._onblur();
          }
          $4.activeEditor = editor1;
          editor1.focus({
            preventScroll: true
          });
          handleMouseEvent("mousedown", e, editor1, normalizedPointerPos);
        } else {
          if ($4.activeEditor) {
            $4.activeEditor._onblur();
            $4.activeEditor = null;
          }
        }
      }), $4.on(window).pointerup((e) => {
        if (e.altKey)
          return;
        if (!isDown)
          return;
        isDown = false;
        const { editor = $4.activeEditor, normalizedPointerPos } = findEditorFromEvent(e);
        if (editor || isDown) {
          handleMouseEvent("mouseup", e, editor, normalizedPointerPos);
        }
      }), $4.on(window).keydown((e) => {
        if (e.altKey)
          return;
        if ($4.activeEditor) {
          handleKeyEvent(e, $4.activeEditor);
        }
      }), $4.on(window).keyup((e) => {
        if (e.altKey)
          return;
        if ($4.activeEditor) {
          handleKeyEvent(e, $4.activeEditor);
        }
      }), $4.on(window).wheel.not.passive.capture((e) => {
        if (!layout2.viewMatrix || !layout2.viewFrameNormalRect)
          return;
        if (e.altKey)
          return;
        const { editor, normalizedPointerPos } = findEditorFromEvent(e);
        const [firstElement] = e.composedPath();
        const part = firstElement.getAttribute("part");
        if ([
          "fill",
          "name"
        ].includes(part) || firstElement.tagName === "X-SLIDER")
          return;
        if (editor && ($4.activeEditor || intentMove === editor)) {
          e.preventDefault();
          e.stopPropagation();
          clearTimeout(intentMoveTimeout);
          handleMouseEvent("mousewheel", e, editor, normalizedPointerPos);
        }
      }));
    });
  }
  register(editor) {
    this.editors = this.editors.add(editor);
    editor.$.effect(() => () => {
      this.editors = this.editors.delete(editor);
    });
  }
};
EditorScene = __decorate4([
  esm_default.reactive(),
  __metadata4("design:type", Function),
  __metadata4("design:paramtypes", [
    typeof Partial === "undefined" ? Object : Partial
  ])
], EditorScene);

// ../../../../.fastpm/-/join-regexp@1.0.0/dist/esm/index.js
var joinRegExp = (regexps, flags = "") => new RegExp(regexps.flat().map((x) => x.toString()).map((x) => x.slice(x.indexOf("/") + 1, x.lastIndexOf("/"))).join("|"), flags);

// ../../lexer-next/dist/esm/causes.js
var causes_exports = {};
__export(causes_exports, {
  LexerErrorCause: () => LexerErrorCause,
  UnexpectedToken: () => UnexpectedToken
});
var LexerErrorCause = class {
  name;
  constructor(message) {
    this.message = message;
    this.name = "LexerErrorUnknown";
  }
  message;
};
var UnexpectedToken = class extends LexerErrorCause {
  name;
  constructor(currentToken, expectedGroup, expectedValue) {
    super("Unexpected token: " + currentToken.value + "\n        expected: " + expectedGroup + " " + (expectedValue ? '"' + expectedValue + '"' : "") + "\n    but received: " + currentToken.group + ' "' + currentToken.value + '"\n     at position: ' + currentToken.index);
    this.currentToken = currentToken;
    this.expectedGroup = expectedGroup;
    this.expectedValue = expectedValue;
    this.name = "LexerErrorUnexpectedToken";
  }
  currentToken;
  expectedGroup;
  expectedValue;
};

// ../../lexer-next/dist/esm/index.js
var LexerError = class extends Error {
  name = "LexerError";
  constructor(cause) {
    super(cause.message, {
      cause
    });
  }
};
var createLexer = (tokenize) => (input) => {
  const eof = Token.create("", "eof", {
    index: input.length,
    input
  });
  const unknown = Token.create("", "unknown", {
    index: 0,
    input
  });
  const it = tokenize(input);
  let last2;
  let curr;
  let errorFn = (error) => {
    throw error;
  };
  const onerror = (fn2) => {
    errorFn = fn2;
  };
  let filterFn = () => true;
  const filter3 = (fn2) => {
    filterFn = fn2;
    if (!filterFn(curr))
      curr = next();
  };
  const next = () => {
    let token;
    while (token = it.next().value) {
      if (token && !filterFn(token))
        continue;
      break;
    }
    if (!token)
      token = eof;
    return token;
  };
  const advance = () => ([last2, curr] = [
    curr,
    next()
  ], last2);
  const peek = (group, value) => group != null ? curr.is(group, value) && curr : curr;
  const accept = (group, value) => curr.is(group, value) ? advance() : null;
  const expect = (group, value) => {
    const token = accept(group, value);
    if (!token)
      errorFn(new LexerError(new UnexpectedToken(curr, group, value)));
    return token;
  };
  advance();
  return {
    onerror,
    filter: filter3,
    advance,
    peek,
    expect,
    accept,
    unknown
  };
};

// ../../tinypratt/dist/esm/causes.js
var causes_exports2 = {};
__export(causes_exports2, {
  BadImpl: () => BadImpl,
  BadOp: () => BadOp,
  BadToken: () => BadToken,
  ParserErrorCause: () => ParserErrorCause,
  UnexpectedToken: () => UnexpectedToken2
});

// ../../annotate-code/dist/esm/index.js
var isTTY = typeof process !== "undefined" && process.stdout.isTTY;
var BOLD = isTTY ? "\x1B[1m" : "";
var RED = isTTY ? BOLD + "\x1B[31m" : "";
var GREY = isTTY ? "\x1B[90m" : "";
var RESET = isTTY ? "\x1B[0m" : "";
var BAR = " \u2502 ";
var LF = GREY + "\xAC" + RESET;
var EOF = GREY + "<EOF>" + RESET;
var arrow = ({
  col,
  message = "",
  pad = 0,
  size = 1
}) => BAR.padStart(pad, " ") + RED + (("^".repeat(size) + " ").padStart(col + size, " ") + message) + RESET;
var annotate = ({ message, input, index, linesBefore = 3, linesAfter = 3, size = 1, showLineNumbers = true }) => {
  if (index > input.length) {
    const pos = index.toLocaleString();
    const size1 = input.length.toLocaleString();
    return {
      message: RED + `index ${pos} past buffer of size ${size1}: ${pos} > ${size1}` + RESET
    };
  }
  if (index < 0) {
    const pos1 = index.toLocaleString();
    const size2 = input.length.toLocaleString();
    return {
      message: RED + `index ${pos1} behind buffer of size ${size2}` + RESET
    };
  }
  let c;
  let targetLine = "";
  let col = 1;
  let b = index - 1;
  for (; b >= 0; b--, col++) {
    c = input.charAt(b);
    if (c === "\n")
      break;
    targetLine = c + targetLine;
  }
  let a = index;
  for (; a <= input.length; a++) {
    c = input.charAt(a);
    if (a === input.length)
      targetLine += EOF;
    else if (c === "\n") {
      targetLine += LF;
      break;
    } else
      targetLine += c;
  }
  let line = 1;
  for (let i = 0; i < index; i++) {
    if (input.charAt(i) === "\n")
      line++;
  }
  const before = [];
  let lb = b;
  while (before.length < linesBefore && lb > 0) {
    lb = input.slice(0, b).lastIndexOf("\n");
    before.unshift(input.slice(lb + 1, b) + LF);
    if (lb < 0)
      break;
    b = lb;
  }
  const after = [];
  let la = a;
  while (a < input.length && after.length < linesAfter) {
    la = input.indexOf("\n", a + 1);
    if (la < 0) {
      if (after.length < linesAfter) {
        after.push(EOF);
      }
      break;
    }
    after.push(input.slice(a + 1, la) + LF);
    a = la;
  }
  let lines = [
    ...before,
    targetLine,
    ...after
  ];
  let pad = 0;
  if (showLineNumbers) {
    pad = (line + after.length).toString().length + 6;
    lines = lines.map((s, i) => {
      const ln = i + (line - before.length);
      return (ln === line ? RED : "") + ((ln === line ? "> " : "") + ln + RESET + " \u2502 ").padStart(pad + RESET.length) + s;
    });
  }
  lines.splice(before.length + 1, 0, arrow({
    col,
    message,
    size,
    pad
  }));
  lines[before.length] = RED + lines[before.length] + RESET;
  lines.splice(before.length, 0, BAR.padStart(pad));
  message = lines.join("\n");
  return {
    line,
    col,
    message
  };
};

// ../../tinypratt/dist/esm/causes.js
var ParserErrorCause = class {
  name;
  index;
  input;
  line;
  col;
  message;
  constructor(token, short) {
    this.token = token;
    this.short = short;
    this.name = "ParserUnknownError";
    this.index = token.index;
    this.input = token.source.input;
    const message = `${short || this.name}: [${token.group}]: ${token.value}`;
    Object.assign(this, annotate({
      message,
      index: token.index,
      input: token.source.input
    }));
    this.message = message + "\n" + this.message;
  }
  token;
  short;
};
var UnexpectedToken2 = class extends ParserErrorCause {
  name;
  constructor(token, group, value) {
    super(token, `Expected: '${value}' [${group}], instead received`);
    this.group = group;
    this.value = value;
    this.name = "ParserUnexpectedToken";
  }
  group;
  value;
};
var BadImpl = class extends ParserErrorCause {
  name;
  constructor(token, impl) {
    super(token, `Bad ${impl}`);
    this.impl = impl;
    this.name = "ParserBadImpl";
  }
  impl;
};
var BadToken = class extends ParserErrorCause {
  name = "ParserBadToken";
};
var BadOp = class extends ParserErrorCause {
  name = "ParserBadOp";
};

// ../../tinypratt/dist/esm/index.js
var nodeToString = (node) => Array.isArray(node) ? "(" + node.map((child) => nodeToString(child)).join(" ") + ")" : node != null ? node.value : "()";
var ParserError = class extends Error {
  name = "ParserError";
  constructor(cause) {
    super(cause.message, {
      cause
    });
  }
};
var createParser = (regexp, fn2) => {
  const tokenizer2 = (input) => input.matchAll(new RegExpToken(regexp));
  const Lexer = createLexer(tokenizer2);
  const parse2 = (input) => {
    const lexer = Lexer(input);
    const { onerror, filter: filter3, peek, advance, expect, accept, unknown } = lexer;
    filter3((token) => token.group !== "nul");
    onerror((error) => {
      if (error.cause instanceof causes_exports.UnexpectedToken) {
        throw new ParserError(new UnexpectedToken2(error.cause.currentToken, error.cause.expectedGroup, error.cause.expectedValue));
      } else {
        throw error;
      }
    });
    const post = (bp2) => (t2) => [
      t2,
      expr(bp2)
    ];
    const pre = (t2, r, x) => {
      if (r)
        throw new ParserError(new BadToken(t2));
      else
        return [
          t2,
          x
        ];
    };
    const bin = (t2, r, x) => [
      t2,
      x,
      expr(r)
    ];
    const pass = {
      nud: (t2) => t2,
      led: (t2, _3, x) => [
        x,
        t2
      ]
    };
    const never = {
      nud: (t2, rbp) => {
        if (rbp)
          throw new ParserError(new BadOp(t2));
      }
    };
    const until = (op, min_bp, fn3) => (t2, r, L) => {
      const m = !peek("ops", op) ? expr(min_bp) : null;
      expect("ops", op);
      return fn3(t2, L, m, r);
    };
    const bp = (t2) => desc(t2)[0];
    const desc = (t2) => {
      const ctx = impl[`${t2}`] ?? impl[t2.group];
      if (!ctx)
        throw new ParserError(new BadOp(t2));
      return ctx;
    };
    const denom = (impl2, t2, rbp, left) => {
      const fn3 = desc(t2)[1][impl2];
      if (fn3)
        return fn3(t2, rbp, left);
      else
        throw new ParserError(new BadImpl(t2, impl2));
    };
    const nud = denom.bind(null, "nud");
    const led = denom.bind(null, "led");
    const expr = (min) => {
      let t2 = advance();
      let left = nud(t2, min);
      let lbp, rbp;
      while (min < ([lbp, rbp] = bp(peek()), lbp)) {
        t2 = advance();
        left = led(t2, rbp, left);
      }
      return left;
    };
    const impl = fn2({
      peek,
      advance,
      accept,
      expect,
      unknown,
      never,
      pass,
      bin,
      pre,
      post,
      until,
      expr
    });
    const node = expr(0);
    if (node) {
      node.lexer = lexer;
      node.toString = function() {
        return nodeToString(this);
      };
    }
    return node;
  };
  return parse2;
};

// ../../mono/dist/esm/causes.js
var CompilerErrorCause = class extends causes_exports2.ParserErrorCause {
  name = "CompilerUnknownError";
};

// ../../mono/dist/esm/typed.js
var Type3;
(function(Type4) {
  Type4["any"] = "any";
  Type4["bool"] = "bool";
  Type4["i32"] = "i32";
  Type4["f32"] = "f32";
  Type4["multi"] = "multi";
  Type4["none"] = "none";
})(Type3 || (Type3 = {}));
var I32Suffixed = `
  load8 load16
  lt gt le ge
  div rem shr
  trunc_f32 trunc_f64 extend_i32
  convert_i32 convert_i64
`.split(/\s+/);
var Types = [
  Type3.any,
  Type3.bool,
  Type3.i32,
  Type3.f32,
  Type3.none
];
var OpTypeCast = {
  [Type3.any]: {},
  [Type3.multi]: {},
  [Type3.f32]: {
    [Type3.i32]: "f32.convert_i32_s",
    [Type3.bool]: "f32.convert_i32_u"
  },
  [Type3.i32]: {
    [Type3.f32]: "i32.trunc_f32_s"
  },
  [Type3.bool]: {
    [Type3.f32]: "i32.trunc_f32_u"
  },
  [Type3.none]: {
    [Type3.bool]: "i32.const 0",
    [Type3.i32]: "i32.const 0",
    [Type3.f32]: "f32.const 0"
  }
};

// ../../mono/dist/esm/util.js
var flatten = (sym, x) => Array.isArray(x) ? x[0] == sym ? [
  ...flatten(sym, x[1]),
  x[2]
] : [
  x
] : [
  x
];
var unflatten = (sym, x) => x.length > 1 ? [
  sym,
  unflatten(sym, x.slice(0, -1)),
  x.at(-1)
] : x[0];
var X = RegExp;
var join = (s, ...r) => X(`(${r.map((x) => `(${x.source})`).join(s)})`);

// ../../mono/dist/esm/parser.js
var Parse = createParser(joinRegExp([
  /(?<kwd>while|drop|\.\.\.)/,
  /(?<ids>[#a-zA-Z_$][a-zA-Z0-9_$]*)/,
  /(?<num>inf|nan|\.\.|\d*\.?\d*e[+-]?\d+|(\d*\.((e[+-]?)?[\d]+)*\d+|\.\d+|\d+)(ms|[skKBbf])?)/,
  /(?<nul>\s+|\\\*[^]*?\*\\|\\.*)/,
  /(?<ops>\*\*|%%|:=|::|\?=|\+\+|--|\+=|-=|\*=|\/=|%=|<<=|>>=|&=|\^=|\|=|&&|!&|\|\||!=|==|>=|<=|>>|<<|\.\.|[[\](){}\\"'`,\-~+*/%=<>?!:;.|&^@]{1})/,
  /(?<err>.)/
], "g"), ({ never, pass, bin, pre, post, until, expr }) => {
  const varbin = (op) => (t2, r, x) => {
    if (x[0] == "{") {
      x = x[1];
      const lhs = flatten(",", x);
      const rhs = expr(r);
      const res = lhs.map((x2) => [
        t2.as("="),
        [
          t2.as("{"),
          x2
        ],
        [
          t2.as(op),
          x2,
          rhs
        ]
      ]);
      return unflatten(t2.as(";"), res);
    } else {
      const lhs1 = flatten(",", x);
      const rhs1 = expr(r);
      const res1 = lhs1.map((x2) => [
        t2.as("="),
        x2,
        [
          t2.as(op),
          x2,
          rhs1
        ]
      ]);
      return unflatten(t2.as(";"), res1);
    }
  };
  const parseNumber = (t2) => {
    const isFloat = t2.includes(".") || t2.at(-1) == "f";
    let parsed = parseFloat(`${t2}`).toString();
    if (isFloat && !parsed.includes("."))
      parsed += ".0";
    const number = t2.as(parsed);
    const lastTwo = t2.slice(-2);
    const lastOne = t2.at(-1);
    if (lastTwo === "ms")
      return [
        t2.as("*", "ops"),
        [
          t2.as("*", "ops"),
          number,
          t2.as("sr", "ids")
        ],
        t2.as("0.001")
      ];
    else if (lastOne === "s")
      return [
        t2.as("*", "ops"),
        number,
        t2.as("sr", "ids")
      ];
    else if (lastOne === "k")
      return [
        t2.as("*", "ops"),
        number,
        t2.as("1000")
      ];
    else if (lastOne === "K")
      return [
        t2.as("*", "ops"),
        number,
        t2.as("1024")
      ];
    else if (lastOne === "b")
      return [
        t2.as("*", "ops"),
        number,
        t2.as("br", "ids")
      ];
    else if (lastOne === "B")
      return [
        t2.as("*", "ops"),
        [
          t2.as("*", "ops"),
          number,
          t2.as("br", "ids")
        ],
        t2.as("mr", "ids")
      ];
    return number;
  };
  const ternary = (sym, min_bp) => until(sym, min_bp, (t2, L, M, r) => [
    t2,
    L,
    M,
    expr(r)
  ]);
  return {
    ops: [
      [],
      never
    ],
    eof: [
      [],
      never
    ],
    ids: [
      [],
      pass
    ],
    kwd: [
      [],
      pass
    ],
    num: [
      [],
      {
        nud: (t2) => parseNumber(t2),
        led: (t2, _3, x) => [
          x,
          parseNumber(t2)
        ]
      }
    ],
    drop: [
      [],
      pass
    ],
    while: [
      [],
      {
        nud: (t2) => [
          t2,
          expr(0),
          expr(0)
        ]
      }
    ],
    ";": [
      [
        1,
        1
      ],
      {
        led: bin,
        nud: (_3, __, x) => expr(x)
      }
    ],
    ",": [
      [
        2,
        2
      ],
      {
        led: bin
      }
    ],
    "..": [
      [
        2,
        2
      ],
      {
        led: bin
      }
    ],
    ":": [
      [
        3,
        1
      ],
      {
        led: bin
      }
    ],
    "=": [
      [
        3,
        3
      ],
      {
        led: bin
      }
    ],
    ":=": [
      [
        3,
        3
      ],
      {
        led: bin
      }
    ],
    "+=": [
      [
        3,
        2
      ],
      {
        led: varbin("+")
      }
    ],
    "-=": [
      [
        3,
        2
      ],
      {
        led: varbin("-")
      }
    ],
    "*=": [
      [
        3,
        2
      ],
      {
        led: varbin("*")
      }
    ],
    "/=": [
      [
        3,
        2
      ],
      {
        led: varbin("/")
      }
    ],
    "%=": [
      [
        3,
        2
      ],
      {
        led: varbin("%")
      }
    ],
    "<<=": [
      [
        3,
        2
      ],
      {
        led: varbin("<<")
      }
    ],
    ">>=": [
      [
        3,
        2
      ],
      {
        led: varbin(">>")
      }
    ],
    "&=": [
      [
        3,
        2
      ],
      {
        led: varbin("&")
      }
    ],
    "^=": [
      [
        3,
        2
      ],
      {
        led: varbin("^")
      }
    ],
    "|=": [
      [
        3,
        2
      ],
      {
        led: varbin("|")
      }
    ],
    "?": [
      [
        4,
        2
      ],
      {
        led: ternary(":", 3)
      }
    ],
    "||": [
      [
        5,
        4
      ],
      {
        led: bin
      }
    ],
    "&&": [
      [
        6,
        5
      ],
      {
        led: (t2, r, x) => [
          t2.as("?"),
          [
            t2.as("!="),
            t2.as("0", "num"),
            x
          ],
          expr(r),
          t2.as("0", "num")
        ]
      }
    ],
    "|": [
      [
        7,
        6
      ],
      {
        led: bin
      }
    ],
    "^": [
      [
        7,
        6
      ],
      {
        led: bin
      }
    ],
    "&": [
      [
        9,
        8
      ],
      {
        led: bin
      }
    ],
    "==": [
      [
        10,
        9
      ],
      {
        led: bin
      }
    ],
    "!=": [
      [
        10,
        9
      ],
      {
        led: bin
      }
    ],
    "<": [
      [
        11,
        10
      ],
      {
        led: bin
      }
    ],
    ">": [
      [
        11,
        10
      ],
      {
        led: bin
      }
    ],
    "<=": [
      [
        11,
        10
      ],
      {
        led: bin
      }
    ],
    ">=": [
      [
        11,
        10
      ],
      {
        led: bin
      }
    ],
    ">>": [
      [
        12,
        11
      ],
      {
        led: bin
      }
    ],
    "<<": [
      [
        12,
        11
      ],
      {
        led: bin
      }
    ],
    "+": [
      [
        13,
        13
      ],
      {
        led: bin,
        nud: post(15)
      }
    ],
    "-": [
      [
        13,
        13
      ],
      {
        led: bin,
        nud: post(15)
      }
    ],
    "*": [
      [
        14,
        14
      ],
      {
        led: bin,
        nud: post(15)
      }
    ],
    "/": [
      [
        14,
        14
      ],
      {
        led: bin
      }
    ],
    "%": [
      [
        14,
        14
      ],
      {
        led: bin
      }
    ],
    "%%": [
      [
        14,
        14
      ],
      {
        led: bin
      }
    ],
    "!": [
      [
        15,
        2
      ],
      {
        led: pre,
        nud: post(15)
      }
    ],
    "~": [
      [
        15,
        2
      ],
      {
        led: pre,
        nud: post(15)
      }
    ],
    ".": [
      [
        15,
        2
      ],
      {
        led: pre,
        nud: post(15)
      }
    ],
    "'": [
      [
        15,
        2
      ],
      {
        led: pre,
        nud: post(15)
      }
    ],
    "**": [
      [
        15,
        15
      ],
      {
        led: bin
      }
    ],
    "++": [
      [
        16,
        2
      ],
      {
        led: (t2, _3, x) => [
          t2.as("="),
          x,
          [
            t2.as("+"),
            x,
            t2.as("1", "num")
          ]
        ],
        nud: (t2) => {
          const x = expr(15);
          return [
            t2.as("="),
            x,
            [
              t2.as("+"),
              x,
              t2.as("1", "num")
            ]
          ];
        }
      }
    ],
    "--": [
      [
        16,
        2
      ],
      {
        led: (t2, _3, x) => [
          t2.as("="),
          x,
          [
            t2.as("-"),
            x,
            t2.as("1", "num")
          ]
        ],
        nud: (t2) => {
          const x = expr(15);
          return [
            t2.as("="),
            x,
            [
              t2.as("-"),
              x,
              t2.as("1", "num")
            ]
          ];
        }
      }
    ],
    "{": [
      [
        16,
        0
      ],
      {
        nud: until("}", 0, (t2, _3, x) => [
          t2,
          x
        ])
      }
    ],
    "[": [
      [
        16,
        16
      ],
      {
        led: until("]", 0, (t2, L, R2) => [
          t2,
          L,
          R2
        ]),
        nud: until("]", 0, (t2, _3, x) => [
          t2,
          x
        ])
      }
    ],
    "(": [
      [
        16,
        0
      ],
      {
        led: until(")", 0, (t2, L, R2) => [
          t2.as("@"),
          L,
          R2
        ].filter(Boolean)),
        nud: until(")", 0, (_3, __, x) => x)
      }
    ],
    "::": [
      [
        18,
        16
      ],
      {
        led: ternary(":", 17)
      }
    ]
  };
});

// ../../mono/dist/esm/compiler.js
var Struct = class {
  constructor(context, sym) {
    this.context = context;
    this.sym = sym;
    this.read = (type, index) => {
      const { typeAs, cast } = this.context.module;
      return typeAs(type, [
        `${type}.load offset=${index << 2}`,
        cast(Type3.i32, this.sym.get())
      ]);
    };
    this.write = (type, index, value) => {
      const { typeAs, cast, denan } = this.context.module;
      return typeAs(Type3.none, [
        `${type}.store offset=${index << 2}`,
        cast(Type3.i32, this.sym.get()),
        cast(type, denan(value))
      ]);
    };
  }
  read;
  write;
  context;
  sym;
};
__publicField(Struct, "Buffer", {
  Needle: 0,
  Current: 1,
  Size: 2,
  Size_m1: 3,
  Length: 4,
  Contents: 5
});
var CompStep;
(function(CompStep2) {
  CompStep2["Lib"] = "lib";
  CompStep2["User"] = "user";
})(CompStep || (CompStep = {}));

// ../../mono/dist/esm/get-shared-worker-port.js
var getSharedWorkerPort = () => {
  const worker = new SharedWorker(
    new URL("linker-worker.js", import.meta.url),
    {
      type: "module"
    }
  );
  return worker.port;
};

// ../../mono/dist/esm/config.js
var KB = 1024;
var MB = 1024 * KB;
var PAGE_BYTES = 64 * KB;
var MEM_PADDING = 1 * PAGE_BYTES;
var MB_PER_CHANNEL = 5;
var CHANNEL_BYTES = MB * MB_PER_CHANNEL;
var EVENTS_SIZE = 128;
var EVENTS = 4 * EVENTS_SIZE * Int32Array.BYTES_PER_ELEMENT;
var config = {
  channels: 1,
  maxChannels: 6,
  blockSize: 128,
  sampleRate: 44100,
  sampleCount: 6,
  sampleChannels: 2,
  sampleSeconds: 4,
  samplePointers: [],
  eventsPointer: MEM_PADDING,
  eventsSize: EVENTS_SIZE
};
var sampleBufferSizes = (() => {
  const channel = config.sampleRate * config.sampleSeconds + Object.keys(Struct.Buffer).length - 1;
  const one = channel * config.sampleChannels;
  const bytes = one * config.sampleCount * Float32Array.BYTES_PER_ELEMENT;
  const pages = bytes / PAGE_BYTES;
  return {
    one,
    channel,
    bytes,
    pages
  };
})();
var memory = {
  initial: Math.ceil((MEM_PADDING + EVENTS + sampleBufferSizes.bytes + CHANNEL_BYTES + config.channels * CHANNEL_BYTES) / PAGE_BYTES),
  maximum: Math.ceil((MEM_PADDING + EVENTS + sampleBufferSizes.bytes + CHANNEL_BYTES + config.maxChannels * CHANNEL_BYTES) / PAGE_BYTES)
};
var memPadding = MEM_PADDING + EVENTS + sampleBufferSizes.bytes;
var { sampleCount, sampleChannels } = config;
var sizes = sampleBufferSizes;
var startPos = MEM_PADDING + EVENTS;
var samplePointers = [];
for (let i = 0; i < sampleCount; i++) {
  const ptrs = [];
  samplePointers.push(ptrs);
  for (let c = 0; c < sampleChannels; c++) {
    const ptr = startPos + (i * sizes.one + c * sizes.channel) * Float32Array.BYTES_PER_ELEMENT;
    ptrs.push(ptr);
  }
}

// ../../mono/dist/esm/linker-service.js
var MonoParam = class {
  id;
  fnId;
  paramId;
  sourceIndex;
  source;
  code;
  name;
  minValue;
  maxValue;
  defaultValue;
  normalValue;
  scaleValue;
  constructor(data) {
    Object.assign(this, data);
    this.scaleValue = this.maxValue - this.minValue;
    this.normalValue = this.normalize(this.defaultValue);
  }
  normalize(value) {
    return Math.max(0, Math.min(1, (value - this.minValue) / this.scaleValue));
  }
  scale(normal) {
    return normal * this.scaleValue + this.minValue;
  }
};

// ../../mono/dist/esm/syntax.js
var ids = /[a-zA-Z_$][a-zA-Z0-9_$]*/;
var num = /inf|nan|\d*\.?\d*e[+-]?\d+|(\d*\.((e[+-]?)?[\d]+)*\d+|\.\d+|\d+)([skKmbf]|ms)?/;
var ops = /%%|::|\?=|\+\+|--|\+=|-=|\*=|\/=|%=|<<=|>>=|&=|\^=|\|=|&&|!&|\|\||!=|==|>=|<=|>>|<<|\.\.|[[\](){}\\"'`,\-~+*/%=<>?!:;.|&^@]{1}/;
var syntax2 = {
  comment: join("|", /(\\\*)[^]*?(\*\\)/, /(\\\*)[^]*/, /(\s?(\\)(?!\*)[\S\s]*?(?=[\n\r]))/),
  property: join("", ids, /(?=\()/),
  declare: join("|", join("", /#/, ids), /#/),
  regexp: /\b(t|pi2?|sr|br|mr)\b/,
  normal: ids,
  punctuation: /[[\](),]/,
  number: num,
  operator: ops
};

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
      const fn2 = this.local[method] ?? this.local.target?.[method];
      if (typeof fn2 !== "function") {
        throw new TypeError(`Agent method "${method.toString()}" is not a function. Instead found: ${typeof fn2}`);
      }
      const hasCallback = typeof method === "string" && method[0] !== "_";
      try {
        result = await fn2.apply(this.local.target, this.local.deserializer(args));
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
      get: (target, prop2) => {
        if (prop2 in target)
          return target[prop2];
        else {
          const method = prop2;
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
      set: (target, prop2, value) => {
        target[prop2] = value;
        return true;
      }
    });
  }
  agents(local17, remote) {
    Object.assign(this.local, local17);
    Object.assign(this.remote, remote);
    return [
      this.local,
      this.remote
    ];
  }
};
var Alice = class extends AliceBob {
  constructor(send, target) {
    super(send);
    this.local.name = "alice";
    this.local.target = target || this.local;
    this.remote.name = "bob";
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
var SchedulerEventGroupNode = class extends EventTarget {
  eventGroup;
  constructor(schedulerNode) {
    super();
    this.schedulerNode = schedulerNode;
    this.eventGroup = new SchedulerEventGroup();
    this.schedulerNode.eventGroups.add(this.eventGroup);
  }
  destroy() {
    this.schedulerNode.eventGroups.delete(this.eventGroup);
  }
  connect(targetNode) {
    this.schedulerNode.connect(targetNode);
    this.eventGroup.targets = this.eventGroup.targets.add(targetNode.schedulerTarget);
    this.dispatchEvent(new CustomEvent("connectchange"));
    return targetNode;
  }
  disconnect(targetNode) {
    this.schedulerNode.disconnect(targetNode);
    this.eventGroup.targets = this.eventGroup.targets.delete(targetNode.schedulerTarget);
    this.dispatchEvent(new CustomEvent("connectchange"));
  }
  schedulerNode;
};

// ../../scheduler-node/dist/esm/scheduler-target-node.js
var xfer = (args) => {
  const xfers = [];
  for (const arg of args) {
    if (arg instanceof MessagePort) {
      xfers.push(arg);
    }
  }
  return xfers;
};
var SchedulerTargetNode = class extends AudioWorkletNode {
  id = cheapRandomId();
  schedulerTarget = new SchedulerTarget();
  worklet;
  constructor(context, name, options = {}) {
    options.numberOfInputs = (options.numberOfInputs ?? 0) + 1;
    super(context, name, options);
    const [node, worklet] = new Alice((data) => void this.port.postMessage(data, xfer(data.args))).agents({
      debug: false
    });
    this.port.onmessage = ({ data }) => node.receive(data);
    this.worklet = worklet;
  }
  async init() {
    await this.worklet.init(this.schedulerTarget.midiQueue.buffer);
  }
  processMidiEvent(midiEvent) {
    if (midiEvent.receivedTime == null) {
      throw new Error("Midi event missing receivedTime");
    }
    this.schedulerTarget.midiQueue.push(midiEvent.receivedTime, ...midiEvent.data);
  }
};

// ../../mono-worklet/dist/esm/mono-node.js
var MonoNode = class extends SchedulerTargetNode {
  static async register(context) {
    if (this.registeredContexts.has(context))
      return;
    await context.audioWorklet.addModule(
      new URL("./mono-processor.js", import.meta.url).href
    );
    this.registeredContexts.add(context);
  }
  static async create(context, options = {}) {
    await this.register(context);
    const node = new this(context, {
      ...options,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [
        1
      ],
      channelCount: 1,
      channelCountMode: "explicit",
      channelInterpretation: "discrete"
    });
    await node.init();
    return node;
  }
  vmParams;
  vmParamsMap;
  params;
  sortedParams;
  input;
  output;
  constructor(context, options) {
    super(context, "mono", options);
    this.context = context;
    this.options = options;
    this.vmParamsMap = /* @__PURE__ */ new Map();
    this.params = /* @__PURE__ */ new Map();
    this.sortedParams = [
      ...this.parameters.entries()
    ].sort(([a], [b]) => a > b ? 1 : -1);
    this.input = new ChannelMergerNode(this.context, {
      numberOfInputs: 1,
      channelCountMode: "explicit",
      channelInterpretation: "discrete"
    });
    this.output = new ChannelSplitterNode(this.context, {
      numberOfOutputs: 1,
      channelCountMode: "explicit",
      channelInterpretation: "discrete"
    });
    this.input.connect(this);
    this.connect(this.output);
    const port = getSharedWorkerPort();
    this.worklet.setPort(port);
  }
  disable() {
    this.worklet.disable();
  }
  async setSampleBuffer(index, buffer, range) {
    return await this.worklet.setSampleBuffer(index, buffer, range);
  }
  async setSampleBufferRange(index, range) {
    return await this.worklet.setSampleBufferRange(index, range);
  }
  async setCode(code) {
    const { params } = await this.worklet.setCode(code);
    this.vmParams = params.map((x) => new MonoParam(x));
    this.vmParamsMap.clear();
    for (const [i, x] of this.vmParams.entries()) {
      const param = this.sortedParams[i][1];
      if (x.normalValue > param.maxValue || x.normalValue < param.minValue)
        throw new Error(`Default value "${x.defaultValue}" not in range [${x.minValue}..${x.maxValue}]`);
      param.value = x.normalValue;
      this.vmParamsMap.set(x, param);
      this.params.set(x.id.toString(), {
        monoParam: x,
        audioParam: param
      });
    }
  }
  suspend() {
    this.worklet.suspend();
    this.dispatchEvent(new CustomEvent("suspend"));
  }
  resume() {
    this.worklet.resume();
    this.dispatchEvent(new CustomEvent("resume"));
  }
  async createVM() {
    await this.worklet.resetError();
    return this.worklet.createVM();
  }
  async test(frame, length, ...params) {
    return this.worklet.test(frame, length, params);
  }
  context;
  options;
};
__publicField(MonoNode, "registeredContexts", /* @__PURE__ */ new Set());

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
      const local17 = this.map.get(id);
      Object.assign(local17, pick(object, this.options.pick));
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
  const Types2 = new Map([
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
    ...Types2.keys()
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
      const [serializer = defaultSerializer] = Types2.get(value.constructor) ?? [];
      return createEntry(serializer, value);
    }
    return value;
  });
  const reviver3 = (classes3, refs2 = /* @__PURE__ */ new Map(), pending = /* @__PURE__ */ new Map()) => {
    const types = new Map([
      ...TypesMap,
      ...classes3.map((x) => [
        stripTrailingNumbers(x.name),
        x
      ])
    ]);
    const getRef = (value, key, owner) => {
      const { $p } = value;
      if (refs2.has($p))
        return refs2.get($p);
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
          const [, deserializer = (x) => new ctor(x)] = Types2.get(ctor) ?? [];
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
                        p = refs2.get(p.$p);
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
          refs2.set($r, result);
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

// ../../scheduler-node/dist/esm/scheduler-node.js
var SchedulerNode = class {
  static async register(context) {
    if (this.registeredCtx.has(context))
      return;
    await context.audioWorklet.addModule(new URL("./scheduler-processor.js", import.meta.url).href);
    this.registeredCtx.add(context);
  }
  static async create(context) {
    await this.register(context);
    return new this(context);
  }
  node;
  worklet;
  targetNodes;
  eventGroups;
  createEventGroup() {
    const eventGroup = new SchedulerEventGroup();
    this.eventGroups.add(eventGroup);
    return eventGroup;
  }
  removeEventGroup(eventGroup) {
    this.eventGroups.delete(eventGroup);
  }
  constructor(context) {
    this.context = context;
    this.targetNodes = /* @__PURE__ */ new Set();
    this.eventGroups = new SyncedSet({
      send: queue.task((payload, cb) => {
        this.node.port.postMessage({
          eventGroups: core.serialize(payload)
        });
        cb();
      }),
      pick: [],
      reducer: (eventGroup) => ({
        targets: eventGroup.targets,
        events: eventGroup.events
      }),
      equal: (prev, next) => prev.targets === next.targets && prev.events === next.events
    });
    this.node = new AudioWorkletNode(this.context, "scheduler");
    const [scheduler, worklet] = new Alice((data) => void this.node.port.postMessage({
      rpc: data
    })).agents({
      debug: false
    });
    this.node.port.onmessage = ({ data }) => {
      if (data.rpc)
        scheduler.receive(data.rpc);
    };
    this.worklet = worklet;
  }
  start() {
    return this.worklet.start();
  }
  stop() {
    this.worklet.stop();
  }
  setBpm(bpm) {
    return this.worklet.setBpm(bpm);
  }
  connect(targetNode) {
    if (!this.targetNodes.has(targetNode)) {
      this.node.connect(targetNode, 0, targetNode.numberOfInputs - 1);
    }
    return targetNode;
  }
  disconnect(targetNode) {
    if (this.targetNodes.has(targetNode)) {
      this.node.disconnect(targetNode, 0, targetNode.numberOfInputs - 1);
    }
  }
  context;
};
__publicField(SchedulerNode, "registeredCtx", /* @__PURE__ */ new WeakSet());

// ../src/anim.ts
function animCall(fn2) {
  fn2();
}
var anim = queue.raf(function animRaf() {
  if (animFns.size) {
    anim();
    const fns = [...animFns];
    animFns.clear();
    fns.forEach(animCall);
  }
});
var animFns = /* @__PURE__ */ new Set();
function animSchedule(fn2) {
  animFns.add(fn2);
  anim();
}
function animRemoveSchedule(fn2) {
  animFns.delete(fn2);
}

// ../src/wave.tsx
var Wave = web("wave", view(
  class props {
    width = 200;
    height = 100;
    funcSource;
  },
  class local {
    canvas;
    c;
    running = true;
    func;
  },
  ({ $, fx, fn, refs }) => {
    $.css = `
  canvas {
    background: #000;
    display: flex;
    image-rendering: pixelated;
    height: 0;
    min-height: 100%;
    width: 100%;
  }`;
    const pr = window.devicePixelRatio;
    let t = 0;
    let stop = () => {
    };
    const draw = fn(({ func, canvas, c, width, height }) => {
      stop = () => animRemoveSchedule(waveTick);
      function waveTick() {
        const y = func(t);
        animSchedule(waveTick);
        c.imageSmoothingEnabled = false;
        c.fillStyle = "#333";
        c.drawImage(canvas, -1, 0, width, height);
        c.fillRect(canvas.width - pr, 0, pr, height);
        c.fillStyle = "#aaa";
        t += 0.025;
        c.fillRect(width - pr, (height - pr) * (y * 0.5 + 0.5), pr, pr);
      }
      return waveTick;
    });
    fx(function waveEvalFuncSource({ funcSource }) {
      stop();
      const { sin, cos, tanh, PI: pi } = Math;
      try {
        eval(`
        $.func = function waveFunc(t) {
          let y = 0, x;
          ${funcSource};
          return y
        }
      `);
      } catch (error) {
        console.error(error);
      }
    });
    fx(({ canvas }) => {
      $.c = canvas.getContext("2d");
    });
    fx(({ c: ctx, width, height }) => {
      ctx.fillStyle = "#333";
      ctx.fillRect(0, 0, width, height);
    });
    fx(function waveStart({ func: _3, c: __ }) {
      draw();
    });
    fx(({ width, height }) => {
      $.view = /* @__PURE__ */ jsx("canvas", {
        ref: refs.canvas,
        width,
        height,
        onclick: () => {
          if ($.running) {
            stop();
            $.running = false;
          } else {
            draw();
            $.running = true;
          }
        }
      });
    });
  }
));

// ../src/waveform.tsx
var Waveform = web("waveform", view(
  class props2 {
    running = false;
    width = 200;
    height = 100;
    analyser;
  },
  class local2 {
    host = element;
    running;
    bytes;
    analyser;
    canvas;
    c;
  },
  ({ $: $4, fx: fx2, fn: fn2, refs: refs2 }) => {
    $4.css = `
  & {
    display: block;
    width: 100%;
    height: 100%;
  }
  canvas {
    background: #000;
    display: flex;
    image-rendering: pixelated;
    height: 0;
    min-height: 100%;
    width: 100%;
  }
  &(:not([running])) {
    opacity: 0.2;
  }
  `;
    const pr2 = window.devicePixelRatio;
    let stop2 = () => {
    };
    const draw2 = fn2(({ analyser, bytes, canvas, c, width, height }) => {
      stop2 = () => animRemoveSchedule(waveTick);
      let py = 0.5 * height;
      c.fillStyle = "#000";
      c.strokeStyle = "#16e";
      c.imageSmoothingEnabled = false;
      function waveTick() {
        analyser.getByteTimeDomainData(bytes);
        let h = bytes[0] / 256;
        const normal = 1 - h * 2;
        const sign = Math.sign(normal);
        h = Math.abs(normal) ** 0.38 * sign * 0.5 + 0.5;
        animSchedule(waveTick);
        c.drawImage(canvas, -1, 0, width, height);
        c.fillRect(canvas.width - 1, 0, 1, height);
        const y = (height - pr2) * h + pr2 / 2;
        c.beginPath();
        c.lineWidth = pr2;
        c.moveTo(width - 1, py);
        c.lineTo(width, y);
        c.closePath();
        c.stroke();
        py = y;
      }
      return waveTick;
    });
    fx2.raf(({ host, running }) => {
      host.toggleAttribute("running", running);
    });
    fx2(({ canvas }) => {
      $4.c = canvas.getContext("2d");
    });
    fx2(({ c: ctx, width, height }) => {
      ctx.fillRect(0, 0, width, height);
    });
    fx2(function waveStartStop({ running, bytes: _3, c: __ }) {
      if (running) {
        draw2();
      } else {
        stop2();
      }
    });
    fx2(({ analyser }) => {
      $4.bytes = new Uint8Array(analyser.fftSize);
    });
    fx2(({ width, height }) => {
      $4.view = /* @__PURE__ */ jsx("canvas", {
        ref: refs2.canvas,
        width,
        height
      });
    });
  }
));

// ../src/util/list.ts
function createOrReturn(ctor, object, list, otherList) {
  if (list === otherList)
    return object;
  return new ctor(otherList);
}
var List = class {
  constructor(items = []) {
    this.items = items;
  }
  add(item) {
    return new List([...this.items, item]);
  }
  getById(itemId) {
    return getItemInListById(this.items, itemId);
  }
  setById(itemId, newItem) {
    return createOrReturn(List, this, this.items, setItemInListById(this.items, itemId, newItem));
  }
  hasId(itemId) {
    return this.items.some((item) => item.id === itemId);
  }
  updateById(itemId, updateData) {
    return createOrReturn(List, this, this.items, updateItemInListById(this.items, itemId, updateData));
  }
  removeById(itemId) {
    return createOrReturn(List, this, this.items, removeItemInListById(this.items, itemId));
  }
  insertAfterIndex(index, newItem) {
    return new List(insertItemInListAfterIndex(this.items, index, newItem));
  }
  toJSON() {
    return this.items;
  }
};
function updateOrReturn(target, updateData) {
  if (entries(updateData).every(
    ([key, value]) => key in target && is_equal_default(target[key], value)
  )) {
    return target;
  }
  return {
    ...target,
    ...updateData
  };
}
function updateItemInListById(list, itemId, updateData) {
  let found = false;
  let equal = false;
  const newList = list.map((item) => {
    if (item.id === itemId) {
      const newItem = updateOrReturn(item, updateData);
      found = true;
      if (newItem === item)
        equal = true;
      return newItem;
    }
    return item;
  });
  if (!found) {
    throw new Error("Item not found with id: " + itemId);
  }
  if (equal) {
    return list;
  }
  return newList;
}
function getItemInListById(list, itemId) {
  const item = list.find((item2) => item2.id === itemId);
  if (!item) {
    throw new Error(`Item not found in list with id: "${itemId}"`);
  }
  return item;
}
function removeItemInListById(list, itemId) {
  getItemInListById(list, itemId);
  return list.filter((item) => item.id !== itemId);
}
function setItemInListById(list, itemId, newItem) {
  const oldItem = getItemInListById(list, itemId);
  if (oldItem === newItem)
    return list;
  return list.map((item) => {
    if (item === oldItem) {
      return newItem;
    }
    return item;
  });
}
function insertItemInListAfterIndex(list, index, newItem) {
  if (index > list.length - 1) {
    throw new Error(`Insert index ${index} out of bounds in list with length ${list.length}`);
  }
  let newList;
  if (index >= 0) {
    newList = [...list];
    if (index === newList.length - 1) {
      newList.push(newItem);
    } else {
      newList.splice(index + 1, 0, newItem);
    }
  } else {
    newList = [...list, newItem];
  }
  return newList;
}

// ../src/machine-data.ts
var MachineData = class {
  id;
  groupId;
  kind;
  state = "init";
  outputs;
  presets = new List();
  selectedPresetId = false;
  spacer;
  height;
  constructor(data = {}) {
    Object.assign(this, data);
  }
};

// ../src/util/checksum.ts
function checksum(s) {
  return s.split("").reduce(
    (p, n) => (p << 1) + n.charCodeAt(0),
    0
  );
}

// ../src/util/audio.ts
function setParam(audioContext, param, targetValue, slope = 0.015) {
  param.setTargetAtTime(targetValue, audioContext.currentTime, slope);
}

// ../src/util/marker.ts
function markerForSlider(slider) {
  return {
    key: slider.id,
    index: slider.sourceIndex,
    size: slider.source.arg.length,
    kind: "param",
    color: `hsl(${checksum(slider.id) % 360}, 55%, 25%)`,
    hoverColor: `hsl(${checksum(slider.id) % 360}, 55%, 35%)`
  };
}

// ../src/util/args.ts
function removeSliderArgsFromCode(sliders, code) {
  Array.from(sliders.values()).reverse().forEach((slider) => {
    code = code.slice(
      0,
      slider.sourceIndex
    ) + code.slice(slider.sourceIndex + slider.source.arg.length);
  });
  return code;
}
function copySliders(sliders) {
  return new Map([...sliders].map(
    ([key, slider]) => [key, {
      ...slider,
      source: {
        ...slider.source
      }
    }]
  ));
}

// ../../../../.fastpm/-/memoize-pure@1.0.0/dist/esm/index.js
var memoize2 = (fn2, map = /* @__PURE__ */ Object.create(null)) => {
  const wrapped = function(...args) {
    const serialized = args.join();
    return map[serialized] ?? (map[serialized] = fn2.apply(this, args));
  };
  return wrapped;
};

// ../../icon-svg/dist/esm/data.js
var iconSets = {
  bootstrap: "npm/bootstrap-icons@1/icons/{icon}.svg",
  boxicons: "npm/boxicons@2/svg/{type}/{prefix}-{icon}.svg",
  bytesize: "npm/bytesize-icons@1/dist/icons/{icon}.svg",
  cssgg: "npm/css.gg@2/icons/svg/{icon}.svg",
  emojicc: "npm/emoji-cc@1/svg/{icon}.svg",
  eos: "gh/lekoala/eos-icons-mirror/{type}/{icon}.svg",
  feather: "npm/feather-icons@4/dist/icons/{icon}.svg",
  flags: "npm/flag-svg-collection@1/flags/{kind}/{icon}.svg",
  fontawesome: "npm/@fortawesome/fontawesome-free@5/svgs/{type}/{icon}.svg",
  iconoir: "gh/lucaburgio/iconoir/icons/{icon}.svg",
  iconpark: "gh/bytedance/IconPark/source/{type}/{icon}.svg",
  material: "npm/@material-icons/svg@1/svg/{icon}/{kind}.svg",
  phosphor: "gh/phosphor-icons/phosphor-icons@1/assets/{type}/{icon}-{type}.svg",
  supertiny: "npm/super-tiny-icons@0.4.0/images/svg/{icon}.svg",
  tabler: "npm/@tabler/icons@1/icons/{icon}.svg"
};
var prefixes = {
  boxicons: {
    solid: "bxs",
    regular: "bx",
    logos: "bxl"
  }
};

// ../../icon-svg/dist/esm/icon-svg.js
var origin = "https://cdn.jsdelivr.net";
var getIconUrl = (props17) => {
  if (!propsSatisfyTemplate(props17))
    throw new TypeError("IconSvg: Missing properties");
  const prefix = prefixes[props17.set]?.[props17.type];
  const values = Object.assign({}, props17, {
    prefix
  });
  let url = origin + "/" + iconSets[props17.set].replace(/{(.*?)}/g, (_3, key) => values[key]);
  if (props17.set === "phosphor" && props17.type === "regular")
    url = url.replace("-regular", "");
  return url;
};
var propsSatisfyTemplate = (props17) => {
  if (!("set" in props17) || props17.set == null)
    return false;
  const template = iconSets[props17.set];
  const keys2 = [
    ...template.matchAll(/{(.*?)}/g)
  ].map((x) => x[1]);
  for (const key of keys2) {
    if (key === "prefix")
      continue;
    if (!(key in props17) || props17[key] == null)
      return false;
  }
  return true;
};

// ../../icon-svg/dist/esm/fetch.js
var fetchMemoized = memoize2(async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  if (response.ok)
    return text;
  else {
    console.error(url + ": " + text);
    return `<span title="Error loading icon: ${url}">\u26A0\uFE0F</span>`;
  }
});
var fetchIconSvg = async (props17) => {
  const url = getIconUrl(props17);
  let svg2 = (await fetchMemoized(url)).trim();
  if (props17.raw || [
    "emojicc",
    "flags"
  ].includes(props17.set))
    return svg2;
  try {
    svg2 = svg2.replace(new RegExp(`(?<=^<svg[^>]*)\\s(width|height)="[\\d.]+"(?=.*>)`, "gis"), "");
  } catch {
  }
  svg2 = svg2.replace(/(^<svg[^>]*?)>/gis, '$1 fill="var(--stroke)">').replace('<rect width="48" height="48" fill="white" fill-opacity="0.01"/>', "").replace('<path d="M48 0H0V48H48V0Z" fill="white" fill-opacity="0.01"/>', "");
  if (props17.strokeWidth != null) {
    svg2 = svg2.replace(/(stroke-width=")([^"]*?)(")/gi, `$1${props17.strokeWidth}$3`).replace(/(<(?:path|circle|rect|polyline)[^>]*?)(\/?>)/gis, '$1 vector-effect="non-scaling-stroke"$2');
  }
  svg2 = svg2.replace(/"#2F88FF"/gis, '"var(--fill)"').replace(/"#43CCF8"/gis, '"var(--fill-secondary)"').replace(/"(currentColor|white|black)"/gis, '"var(--stroke)"');
  return svg2;
};

// ../../icon-svg/dist/esm/element.js
var __decorate5 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var style = ({ strokeWidth }) => `
:host {
  ${strokeWidth ? `stroke-width: ${strokeWidth};` : ""}
  --stroke: currentColor;
  --fill: #9994;
  --fill-secondary: #9996;
  display: inline-flex;
  vertical-align: middle;
}

[part=svg] {
  width: 100%;
  height: 100%;
}`;
var IconSvgElement = class IconSvgElement2 extends HTMLElement {
  icon = esm_default.String;
  set = esm_default.String;
  type = esm_default.String;
  kind = esm_default.String;
  raw = esm_default.Boolean;
  strokeWidth = esm_default.Number;
  root = esm_default.shadow(this);
  async updateSvg() {
    const props17 = {
      set: this.getAttribute("set"),
      icon: this.getAttribute("icon"),
      type: this.getAttribute("type"),
      kind: this.getAttribute("kind"),
      raw: this.hasAttribute("raw"),
      strokeWidth: this.getAttribute("stroke-width")
    };
    if (!propsSatisfyTemplate(props17))
      return;
    this.shadowRoot.innerHTML = `<style>${style(props17)}</style>${(await fetchIconSvg(props17)).replace(/(<svg.*?)>/, '$1 part="svg">')}`;
  }
  attributeChangedCallback() {
    this.updateSvg();
  }
};
__decorate5([
  esm_default.attr()
], IconSvgElement.prototype, "icon", void 0);
__decorate5([
  esm_default.attr()
], IconSvgElement.prototype, "set", void 0);
__decorate5([
  esm_default.attr()
], IconSvgElement.prototype, "type", void 0);
__decorate5([
  esm_default.attr()
], IconSvgElement.prototype, "kind", void 0);
__decorate5([
  esm_default.attr()
], IconSvgElement.prototype, "raw", void 0);
__decorate5([
  esm_default.attr()
], IconSvgElement.prototype, "strokeWidth", void 0);
IconSvgElement = __decorate5([
  esm_default.element()
], IconSvgElement);

// ../../icon-svg/dist/esm/component.js
var IconSvgTag = esm_default.element(IconSvgElement);
var IconSvg = (props17) => /* @__PURE__ */ jsx(IconSvgTag, {
  ...props17
});
IconSvg.toString = IconSvgTag.toString;

// ../src/button.tsx
var Button = web("btn", view(
  class props3 {
    onClick;
    shadow = false;
    children;
  },
  class local3 {
  },
  ({ $: $4, fx: fx2 }) => {
    $4.css = `
  button {
    cursor: pointer;
    font-family: monospace;
    font-weight: bold;
    all: unset;
    position: relative;
  }

  ${IconSvg} {
    &::part(svg) {
      height: 73px;
      stroke-width: 1.25px;
    }
    &.small::part(svg) {
      height: 56px;
    }
    &.smaller::part(svg) {
      height: 28px;
    }
  }

  [part=shadow] {
    position: absolute;
    color: #001e;
    z-index: -1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    ${IconSvg}::part(svg) {
      stroke-width: var(--shadow-size);
    }
  }
  `;
    fx2(({ onClick, shadow: shadow2, children }) => {
      $4.view = /* @__PURE__ */ jsx(Fragment, {
        children: /* @__PURE__ */ jsxs("button", {
          onclick: event.prevent.stop(onClick),
          children: [
            children,
            shadow2 && /* @__PURE__ */ jsx("div", {
              part: "shadow",
              style: `--shadow-size:${shadow2}px`,
              children
            })
          ]
        })
      });
    });
  }
));

// ../src/machine-controls.tsx
var MachineControls = ({ app, machine }) => /* @__PURE__ */ jsxs("div", {
  part: "controls",
  children: [
    /* @__PURE__ */ jsx(Button, {
      shadow: 3,
      onClick: (machine.state === "running" ? machine.stop : machine.start) ?? (() => {
      }),
      style: {
        color: {
          ["running"]: "#1f3",
          ["compiling"]: "cyan",
          ["errored"]: "red",
          ["idle"]: "#334",
          ["init"]: "#334",
          ["ready"]: "#667",
          ["suspended"]: "#667"
        }[machine.state]
      },
      children: /* @__PURE__ */ jsx(IconSvg, {
        set: "feather",
        icon: machine.state === "running" ? "stop-circle" : "play-circle"
      })
    }),
    app.getMachinesInGroup(machine.groupId).flatMap(
      (machine2) => machine2.presets
    ).length === 0 && machine.state === "suspended" && /* @__PURE__ */ jsx(Button, {
      part: "remove",
      shadow: 3,
      onClick: () => app.removeMachinesInGroup(machine.groupId),
      style: {
        color: "#f30"
      },
      children: /* @__PURE__ */ jsx(IconSvg, {
        set: "feather",
        icon: "x-circle"
      })
    })
  ]
});

// ../src/mono.tsx
var { clamp } = Scalar;
var monoDefaultEditorValue = `\\\\\\ a track \\\\\\
#:6,3;
write_note(x,y)=(
  #=(t,note_to_hz(x),y/127);
  0
);
midi_in(op=0,x=0,y=0)=(
  op==144 && write_note(x,y)
);
play(nt,x,y)=(
  saw(x/4)*env(nt, 100, 30)*y
);
synth(
  'cut[50f..5k]=500,
  'q[.1..0.95]=0.125
)=(
  x=tanh(
    lpf(
      #::play:sum*5,
      cut+300*sine(.125),
      q
    )*3
  );
  x=x+daverb(x)*0.4;
  x
);
f()=synth();
`;
var Mono = web("mono", view(
  class props4 extends MachineData {
    app;
    machine;
    audioContext;
    editorScene;
    audioNode;
  },
  class local4 {
    host = element;
    fftSize = 32;
    analyser;
    monoNode;
    monoCode;
    gainNode;
    editor;
    errorMarkers = [];
    detail;
  },
  ({ $: $4, fx: fx2, fn: fn2, deps: deps2 }) => {
    $4.css = `
  & {
    position: relative;
    display: flex;
    flex-flow: row wrap;
    height: 100%;
    width: 100%;
    max-height: 100%;
    max-width: 100%;
  }

  `;
    fx2.raf(({ host, state }) => {
      host.setAttribute("state", state);
    });
    fx2(({ audioNode }) => {
      $4.monoNode = audioNode;
    });
    fx2(({ audioContext, fftSize }) => {
      $4.analyser = new AnalyserNode(audioContext, {
        channelCount: 1,
        fftSize,
        smoothingTimeConstant: 0.5
      });
    });
    fx2(({ audioContext, analyser, monoNode }) => {
      const gainNode = $4.gainNode = new GainNode(audioContext, { channelCount: 1, gain: 0 });
      monoNode.connect(gainNode);
      monoNode.connect(analyser);
      gainNode.connect(audioContext.destination);
      return () => {
        setParam(audioContext, gainNode.gain, 0);
        setTimeout(() => {
          gainNode.disconnect(audioContext.destination);
          monoNode.disconnect(gainNode);
        }, 50);
      };
    });
    let prev;
    const compile = fn2(({ app, id, monoNode }) => async (monoCode) => {
      try {
        prev ??= $4.state;
        console.log(prev);
        app.setMachineState(id, "compiling");
        await monoNode.setCode(monoCode);
        localStorage.monoCode = monoCode;
        if ($4.state !== "running") {
          if (prev === "running") {
            start();
          } else {
            app.setMachineState(id, "suspended");
            monoNode.suspend();
          }
        }
        prev = null;
      } catch (error) {
        console.log(error);
        app.setMachineState(id, "errored");
      }
    });
    const updateEditorValueArgs = fn2(({ audioContext, editor, monoNode }) => function updateEditorValueArgs2(editorValue, targetSliders, sourceSliders = targetSliders) {
      const sliders = copySliders(sourceSliders);
      targetSliders.forEach(function applySliderValueToEditorArg(targetSlider, key) {
        const slider = sliders.get(key);
        if ("default" in slider.source) {
          const newDefault = `${parseFloat(targetSlider.value.toFixed(3))}`;
          if (`${parseFloat(parseFloat(slider.source.default).toFixed(3))}` !== newDefault) {
            const { monoParam, audioParam } = monoNode.params.get(slider.id);
            setParam(
              audioContext,
              audioParam,
              monoParam.normalize(parseFloat(newDefault))
            );
            const argMinusDefault = slider.source.arg.slice(0, -slider.source.default.length);
            const newArg = `${argMinusDefault}${newDefault}`;
            const diff2 = newArg.length - slider.source.arg.length;
            const [start2, end] = [
              slider.sourceIndex,
              slider.sourceIndex + slider.source.arg.length
            ];
            const newValue = editorValue.slice(0, start2) + newArg + editorValue.slice(end);
            editor.replaceChunk({
              start: start2,
              end,
              text: newArg,
              code: editorValue
            });
            if (editor.value !== newValue) {
              throw new Error("Not the expected code");
            }
            editorValue = newValue;
            slider.source.default = newDefault;
            slider.source.arg = newArg;
            sliders.forEach((other) => {
              if (other === targetSlider)
                return;
              if (other.sourceIndex > start2) {
                other.sourceIndex += diff2;
              }
            });
          }
        }
      });
      return { editorValue, sliders };
    });
    const updateSliders = fn2(({ app, id, editor, monoNode }) => () => {
      if (!monoNode.vmParams)
        return;
      const sliders = new Map(monoNode.vmParams.map((p) => [p.id.toString(), {
        value: p.defaultValue,
        min: p.minValue,
        max: p.maxValue,
        hue: checksum(p.id) % 360,
        id: p.id.toString(),
        name: p.id.split("/").pop(),
        source: p.source,
        sourceIndex: p.sourceIndex
      }]));
      return sliders;
    });
    const start = fn2(({ id, app, audioContext, analyser, monoNode, gainNode }) => () => {
      setParam(audioContext, gainNode.gain, 1);
      monoNode.connect(analyser);
      monoNode.resume();
      app.setMachineState(id, "running");
    });
    const stop2 = fn2(({ id, app, audioContext, analyser, monoNode, gainNode }) => () => {
      if ($4.state === "suspended")
        return;
      setParam(audioContext, gainNode.gain, 0);
      try {
        monoNode.disconnect(analyser);
      } catch (err) {
        console.warn(err);
      }
      try {
        monoNode.suspend();
      } catch (err) {
        console.warn(err);
      }
      app.setMachineState(id, "suspended");
    });
    fx2(({ id, app, editor, selectedPresetId }) => {
      if (!selectedPresetId)
        return;
      const machine = app.machines.getById(id);
      if (!machine.presets.hasId(selectedPresetId))
        return;
      const { detail } = machine.presets.getById(selectedPresetId);
      if (!detail.sliders)
        return;
      let editorValue = editor.value;
      if (editorValue !== detail.editorValue) {
        editor.setValue(editorValue = detail.editorValue);
        app.setPresetDetail(id, { editorValue });
      }
      const errorMarkers = $4.errorMarkers ?? [];
      let paramMarkers = [...detail.sliders.values()].map(markerForSlider);
      editor.setMarkers([...errorMarkers, ...paramMarkers]);
      const newDetail = updateEditorValueArgs(editorValue, detail.sliders);
      if (!is_equal_default(newDetail, $4.detail)) {
        paramMarkers = [...newDetail.sliders.values()].map(markerForSlider);
        editor.setMarkers([...errorMarkers, ...paramMarkers]);
        app.setPresetDetail(id, $4.detail = newDetail, true);
      }
    });
    const setSliderNormal = fn2(({ id, app, editor, errorMarkers }) => function setSliderNormal2(sliderId, newNormal) {
      const newSliders = new Map([...$4.detail.sliders].map(([key, slider], i) => {
        if (sliderId === slider.id) {
          return [key, {
            ...slider,
            value: newNormal * (slider.max - slider.min) + slider.min
          }];
        } else {
          return [key, slider];
        }
      }));
      let paramMarkers = [...$4.detail.sliders.values()].map(markerForSlider);
      editor.setMarkers([...errorMarkers, ...paramMarkers]);
      const newDetail = updateEditorValueArgs(editor.value, newSliders);
      if (!is_equal_default(newDetail, $4.detail)) {
        paramMarkers = [...newDetail.sliders.values()].map(markerForSlider);
        editor.setMarkers([...errorMarkers, ...paramMarkers]);
        app.setPresetDetail(id, $4.detail = newDetail);
      }
    });
    const onWheel = fn2(({ editor }) => function onWheel2(ev, sliderId) {
      if (sliderId || !sliderId && editor.hoveringMarkerIndex != null) {
        sliderId ??= [...$4.detail.sliders.keys()].at(editor.hoveringMarkerIndex);
        if (sliderId != null) {
          ev.preventDefault?.();
          ev.stopPropagation?.();
          const slider = $4.detail.sliders.get(sliderId);
          const normal = (slider.value - slider.min) / (slider.max - slider.min);
          const newNormal = clamp(
            0,
            1,
            (normal ?? 0) + Math.sign(ev.deltaY) * (0.01 + 0.1 * Math.abs(ev.deltaY * 5e-3) ** 1.05)
          );
          setSliderNormal(sliderId, newNormal);
        }
      }
    });
    fx2(({ app, id, editor }) => {
      app.setMachineControls(id, { start, stop: stop2, compile, editor, updateSliders, onWheel, setSliderNormal, updateEditorValueArgs });
    });
    let initial = true;
    fx2(({ editor, detail, monoNode }) => {
      if (initial && (!editor.value || $4.state !== "init") && detail && detail.editorValue) {
        initial = false;
        editor.setValue(detail.editorValue);
        if ($4.state === "suspended") {
          monoNode.suspend();
        }
        compile(detail.editorValue);
      }
    });
    fx2(({ app, id, editor: _3, selectedPresetId, presets }) => {
      if (selectedPresetId) {
        const preset = presets.getById(selectedPresetId);
        $4.detail = preset.detail;
      } else {
        if (!$4.detail) {
          app.setPresetDetail(id, {
            editorValue: localStorage.monoCode || monoDefaultEditorValue
          });
        }
      }
    });
    fx2(({ app, id, monoCode }) => {
      app.setPresetDetail(id, { editorValue: monoCode });
    });
    fx2(({ app, machine, id, host, editorScene, state, analyser, presets, selectedPresetId, spacer }) => {
      $4.view = /* @__PURE__ */ jsx(Fragment, {
        children: /* @__PURE__ */ jsxs(Spacer, {
          part: "spacer",
          app,
          id,
          layout: host,
          initial: spacer,
          children: [
            /* @__PURE__ */ jsx(Code, {
              part: "editor",
              style: "border-bottom: 2px solid transparent;",
              editorScene,
              onWheel,
              editor: deps2.editor,
              value: deps2.monoCode
            }),
            /* @__PURE__ */ jsxs("div", {
              part: "side",
              children: [
                /* @__PURE__ */ jsx(MachineControls, {
                  app,
                  machine
                }),
                /* @__PURE__ */ jsx(Sliders, {
                  part: "sliders",
                  machine,
                  sliders: $4.detail ? $4.detail.sliders : /* @__PURE__ */ new Map(),
                  running: state !== "suspended"
                }),
                /* @__PURE__ */ jsx(Waveform, {
                  part: "waveform",
                  analyser,
                  width: 100,
                  height: 50,
                  running: state !== "suspended"
                })
              ]
            }),
            /* @__PURE__ */ jsx(Presets, {
              part: "presets",
              style: "border-bottom: 2px solid transparent;",
              app,
              id,
              presets: presets.items,
              selectedPresetId
            })
          ]
        })
      });
    });
  }
));

// ../src/scheduler.tsx
var schedulerDefaultEditorValue = `bars=2
seed=391434
on(1/4,delay(
   1/8,0.39,x=>
  rnd(10)<2?0:[x,
  24+rnd(5)**2,
  rnd(100)*3,0.1]))
`;
var Scheduler = web("scheduler", view(
  class props5 extends MachineData {
    app;
    audioContext;
    schedulerNode;
    editorScene;
  },
  class local5 {
    host = element;
    detail;
    sandbox;
    groupNode;
    schedulerCode;
    numberOfBars = 1;
    midiEvents = [];
    editor;
  },
  ({ $: $4, fx: fx2, deps: deps2, refs: refs2 }) => {
    $4.css = `
  & {
    display: flex;
    flex-flow: row wrap;
    max-height: 100%;
    max-width: 100%;
  }
/*
  [part=spacer] {
    &::part(handle) {
      background-color: #bbf2;
      background-clip: content-box;
    }
  } */
  `;
    fx2(({ app, id, editor, selectedPresetId, presets }) => {
      if (selectedPresetId) {
        const preset = presets.getById(selectedPresetId);
        $4.detail = preset.detail;
        editor.setValue($4.detail.editorValue);
      } else {
        if (!$4.detail) {
          app.setPresetDetail(id, {
            editorValue: localStorage.schedulerCode || schedulerDefaultEditorValue
          });
        }
      }
    });
    fx2(({ editor, detail }) => {
    });
    fx2(({ app, id, schedulerCode }) => {
      app.setPresetDetail(id, { editorValue: schedulerCode });
    });
    fx2(({ app, id, editor }) => {
      app.setMachineControls(id, { editor });
    });
    fx2(({ schedulerNode }) => {
      const groupNode = $4.groupNode = new SchedulerEventGroupNode(schedulerNode);
      return () => {
        groupNode.destroy();
      };
    });
    fx2(
      ({ app, id, groupNode }) => on(groupNode, "connectchange")(() => {
        app.setMachineState(
          id,
          groupNode.eventGroup.targets.size ? "running" : "suspended"
        );
      })
    );
    fx2(
      ({ app, schedulerNode, groupNode, outputs }) => chain(outputs.map(
        (output) => chain(
          app.connectNode(schedulerNode, output),
          app.connectNode(groupNode, output)
        )
      ))
    );
    fx2(async () => {
      $4.sandbox = {
        eval(code) {
          return new Function(code)();
        },
        destroy() {
        }
      };
    });
    fx2(({ groupNode, numberOfBars }) => {
      groupNode.eventGroup.loopEnd = numberOfBars;
      groupNode.eventGroup.loop = true;
    });
    fx2(async ({ groupNode, sandbox, schedulerCode, numberOfBars }) => {
      try {
        const setup = `
        let seed = 42;
        const rnd = (amt = 1) => {
          var t = seed += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return (((t ^ t >>> 14) >>> 0) / 4294967296) * amt;
        };

        let rand = rnd;
      `;
        const events = [];
        const On = (start, end) => {
          return (measure, fn2) => {
            const result = [];
            let count2 = 0;
            end = bars;
            for (let x = start; x < end && ++count2 < 128; x += measure) {
              const events2 = fn2(x, x + measure);
              if (!events2)
                continue;
              if (Array.isArray(events2[0])) {
                result.push(...events2);
              } else {
                result.push(events2);
              }
            }
            events.push(...result);
            return result;
          };
        };
        const getEuclideanPattern = (pulses, steps) => {
          if (pulses < 0 || steps < 0 || steps < pulses) {
            return [];
          }
          let first = new Array(pulses).fill([1]);
          let second = new Array(steps - pulses).fill([0]);
          let firstLength = first.length;
          let minLength = Math.min(firstLength, second.length);
          let loopThreshold = 0;
          while (minLength > loopThreshold) {
            if (loopThreshold === 0) {
              loopThreshold = 1;
            }
            for (let x = 0; x < minLength; x++) {
              first[x] = [...first[x], ...second[x]];
            }
            if (minLength === firstLength) {
              second = second.slice(minLength);
            } else {
              second = first.slice(minLength);
              first = first.slice(0, minLength);
            }
            firstLength = first.length;
            minLength = Math.min(firstLength, second.length);
          }
          const pattern = [...first.flat(), ...second.flat()];
          return pattern;
        };
        const Euclidean = (start, end) => {
          return (measure, pulses, fn2) => {
            const result = [];
            let count2 = 0;
            end = bars;
            const pattern = getEuclideanPattern(pulses, Math.floor((end - start) / measure) / bars);
            let i = 0;
            for (let x = start; x < end && ++count2 < 128; x += measure) {
              const events2 = fn2(x, x + measure, pattern[i % pattern.length]);
              i++;
              if (!events2)
                continue;
              if (Array.isArray(events2[0])) {
                result.push(...events2);
              } else {
                result.push(events2);
              }
            }
            events.push(...result);
            return result;
          };
        };
        const Delay = (measure, decay, fn2) => {
          let lastNote;
          let lastX;
          let offset;
          return (start, end) => {
            const result = [];
            let count2 = 0;
            let note = fn2(start);
            if (!note) {
              if (!lastNote)
                return;
              note = lastNote;
              if (lastX >= end)
                return;
              start = lastX;
            } else {
              offset = note[0] - start;
            }
            let x;
            for (x = start; x < end && ++count2 < 128; x += measure) {
              note = [...note];
              note[0] = x + offset;
              result.push(note);
              note = [...note];
              note[2] *= decay;
              lastNote = note;
            }
            lastX = x;
            return result;
          };
        };
        const [notes = [], bars = numberOfBars] = await Promise.race([
          sandbox.eval(`
          let start = 0;
          let end = ${numberOfBars};
          const getEuclideanPattern = ${getEuclideanPattern};
          const on = ${On(0, numberOfBars)};
          const euc = ${Euclidean(0, numberOfBars)}
          const delay = ${Delay};
          const has = () => true;
          const get = (target, key, receiver) => {
            if (key === Symbol.unscopables) return undefined;
            return Reflect.get(target, key, receiver);
          }
          // const sandbox = new Proxy({ Math, on }, { has, get });
          let events = [];
          let bars = ${numberOfBars};
          // with (sandbox) {
            ${setup};
            ${schedulerCode};
          // }
          return [events, bars];
      `),
          new Promise((_3, reject) => setTimeout(reject, 1e4, "timeout"))
        ]) || [];
        $4.midiEvents = groupNode.eventGroup.replaceAllWithNotes(notes);
        $4.numberOfBars = bars;
        localStorage.schedulerCode = schedulerCode;
      } catch (error) {
        console.warn(error);
        if (error === "timeout") {
          sandbox.destroy();
        }
      }
    });
    fx2(({ app, id, host, state, audioContext, editorScene, midiEvents, numberOfBars, presets, selectedPresetId, spacer }) => {
      $4.view = /* @__PURE__ */ jsxs(Spacer, {
        part: "spacer",
        id,
        app,
        layout: host,
        initial: spacer,
        children: [
          /* @__PURE__ */ jsx(Code, {
            editorScene,
            editor: deps2.editor,
            value: deps2.schedulerCode
          }),
          /* @__PURE__ */ jsx(Midi, {
            part: "waveform",
            style: "position:absolute; bottom:0",
            state,
            audioContext,
            midiEvents,
            numberOfBars
          }),
          /* @__PURE__ */ jsx(Presets, {
            app,
            id,
            selectedPresetId,
            presets: presets.items,
            style: "pointer-events: all"
          })
        ]
      });
    });
  }
));

// ../src/editor.tsx
var Editor3 = web("editor", view(
  class props6 {
    value;
    rows = 10;
  },
  class local6 {
  },
  ({ $: $4, fx: fx2 }) => {
    $4.css = `
    textarea {
      display: block;
      box-sizing: border-box;
      background: #000;
      color: #fff;
      border: none;
      width: 100%;
      resize: vertical;
    }
  `;
    fx2(({ value, rows }) => {
      $4.view = /* @__PURE__ */ jsx("textarea", {
        spellcheck: "false",
        autocorrect: "off",
        rows,
        oninput: function() {
          value.value = this.value;
        },
        children: value.value
      }, "text");
    });
  }
));

// ../src/code.tsx
var Code = web("code", view(
  class props7 {
    editorScene;
    value;
    editor;
    onWheel = () => {
    };
  },
  class local7 {
    host = element;
    waitingEditor;
  },
  ({ $: $4, fx: fx2, fn: fn2, refs: refs2 }) => {
    $4.css = `
  & {
    box-sizing: border-box;
    max-width: 100%;
    flex: 1;
  }
  `;
    const off = fx2(
      ({ editor, waitingEditor }) => waitingEditor.$.effect(({ ready }) => {
        if (ready) {
          off();
          editor.current = waitingEditor;
        }
      })
    );
    const onCodeChange = fn2(({ value }) => function onCodeChange2() {
      if (this.ready && this.value != null) {
        value.value = this.value;
      }
    });
    fx2(({ editorScene, onWheel }) => {
      $4.view = /* @__PURE__ */ jsx(Canvy, {
        ref: refs2.waitingEditor,
        part: "canvy",
        scene: editorScene,
        font: "/CascadiaMono.woff2",
        fontSize: 17,
        onevent: ({ detail: ev }) => {
          if (ev.name === "mousewheel") {
            onWheel(ev.data);
          }
        },
        onchange: onCodeChange,
        onedit: onCodeChange
      }, "text");
    });
  }
));

// ../src/machine.tsx
var Machine = web("machine", view(
  class props8 {
    app;
    audioContext;
    schedulerNode;
    editorScene;
    machine;
    audioNode;
    Machines;
  },
  class local8 {
    host = element;
  },
  ({ $: $4, fx: fx2 }) => {
    fx2(({ machine }) => {
      $4.css = `
    & {
      box-sizing: border-box;
      display: flex;
      flex-flow: column wrap;
      position: relative;
      max-height: 100%;
      z-index: ${machine.kind === "scheduler" ? 4 : 3};
      pointer-events: none;

      > * {
        flex: 1;
      }
    }
    `;
    });
    fx2(({ host, machine }) => {
      host.setAttribute("id", machine.id);
    });
    fx2(({ host }) => {
      const resize = queue.raf(() => {
        host.style.width = Math.min(800, window.innerWidth - 50) + "px";
      });
      resize();
      return on(window, "resize")(resize);
    });
    fx2(({ app, Machines, audioContext, editorScene, schedulerNode, audioNode, machine }) => {
      const Kind = Machines[machine.kind];
      $4.view = /* @__PURE__ */ jsx(Fragment, {
        children: /* @__PURE__ */ jsx(Kind, {
          app,
          machine,
          audioContext,
          schedulerNode,
          editorScene,
          audioNode,
          ...machine
        })
      });
    });
  }
));

// ../src/util/observe.ts
var MutationObserverSettings2 = class {
  attributeFilter;
  attributeOldValue = bool;
  attributes = bool;
  characterData = bool;
  characterDataOldValue = bool;
  childList = bool;
  subtree = bool;
  initial = bool;
};
var ResizeObserverSettings2 = class {
  box;
  initial = bool;
};
var IntersectionObserverSettings = class {
  root;
  rootMargin;
  threshold;
  observer;
};
var observe2 = {
  resize: toFluent(ResizeObserverSettings2, (settings) => (el, fn2) => {
    const observer = new ResizeObserver(fn2);
    observer.observe(el, settings);
    if (settings.initial)
      fn2([], observer);
    return () => observer.disconnect();
  }),
  intersection: toFluent(IntersectionObserverSettings, (settings) => (el, fn2) => {
    const observer = settings.observer ?? new IntersectionObserver(fn2, settings);
    observer.observe(el);
    return Object.assign(() => {
      if (settings.observer)
        observer.unobserve(el);
      else
        observer.disconnect();
    }, { observer });
  }),
  mutation: toFluent(MutationObserverSettings2, (settings) => (el, fn2) => {
    const observer = new MutationObserver(fn2);
    observer.observe(el, settings);
    if (settings.initial)
      fn2([], observer);
    return () => observer.disconnect();
  }),
  gc: (item, value, fn2) => {
    const reg = new FinalizationRegistry(fn2);
    reg.register(item, value);
    return reg;
  }
};

// ../src/layout.tsx
var Layout = web("layout", view(class props9 {
  size;
  layout;
  vertical = false;
  children;
}, class local9 {
  host = element;
}, ({ $: $4, fx: fx2, fn: fn2 }) => {
  fx2(({ vertical }) => {
    const dim = vertical ? "height" : "width";
    $4.css = `
    & {
      /* width: 100%; */
      /* height: 100%; */
      position: relative;
      display: flex;
      transition:
        ${dim} 3.5ms linear,
        min-${dim} 3.5ms linear,
        max-${dim} 3.5ms linear
        ;
    }

    > * {
      width: 100%;
      height: 100%;
    }

    [part=waveform] {
      z-index: 1;
      pointer-events: none;
      min-height: 88px; /* 90px-2px border */
    }

    [part=sliders] {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      opacity: 1;
      box-sizing: border-box;
      padding: 12px 12px;
      /* padding-left: 30%; */
      overflow: hidden;
      width: 100%;
      max-width: 100%;
      min-height: 88px; /* 90px-2px border */

      &[small] {
        padding-top: 90px;
      }
    }

    [part=editor] {
      /* pointer-events: none; */
      z-index: 2;
    }

    [part=presets] {
      z-index: 2;
      pointer-events: all;
    }
    [part=side] {
      height: calc(100% - 2px);
      pointer-events: all;
    }

    .column {
      display: flex;
      flex-flow: column nowrap;
      height: 100%;
    }
    [part=controls] {
      z-index: 999999;
      pointer-events: all;
      font-family: system-ui;
      display: flex;
      flex-flow: row wrap;
      gap: 7px;
      position: absolute;
      margin: 7px;
      top: 0;
      right: 0;
      /* background: #fff; */
      /* height: 50%; */

      ${Button} {
        cursor: pointer;
        opacity: 0.8;
        &[part=remove] {
          opacity: 0.8;
        }
        &:hover {
          opacity: 1;
        }
      }
    }

    &([state=running]) [part=controls] ${Button} {
      opacity: 1;
      &:hover {
        color: #fff !important;
      }
    }
    `;
  });
  const resize = fn2(({ host, layout: layout2, size, vertical }) => () => {
    const [dim, min, max] = vertical ? ["height", "minHeight", "maxHeight"] : ["width", "minWidth", "maxWidth"];
    const rect = new Rect(layout2.getBoundingClientRect()).round();
    const w = rect[dim] * (typeof size === "string" ? parseFloat(size) / 100 : size) + "px";
    Object.assign(host.style, {
      [dim]: w,
      [min]: w,
      [max]: w
    });
  });
  fx2(
    ({ layout: layout2 }) => observe2.resize.initial(layout2, resize)
  );
  fx2(({ size: _3 }) => resize());
  fx2(({ children }) => {
    $4.view = children;
  });
}));

// ../src/spacer.tsx
var { clamp: clamp2 } = Scalar;
var Spacer = web("spacer", view(class props10 {
  app;
  id;
  layout;
  initial;
  snap = true;
  vertical = false;
  children;
}, class local10 {
  host = element;
  rect;
  cells;
  intents;
  handles;
}, ({ $: $4, fx: fx2, fn: fn2 }) => {
  const dims = (vertical) => vertical ? ["height", "width", "top", "ns-resize", "y", "column"] : ["width", "height", "left", "ew-resize", "x", "row"];
  fx2(({ vertical }) => {
    const [dim, opp, pos, cursor, , flow] = dims(vertical);
    $4.css = `
    & {
      display: flex;
      flex-flow: ${flow} nowrap;
      /* overflow: hidden; */
    }

    /* > * {
      width: 100%;
      height: 100%;
    } */

    [part=handle] {
      pointer-events: all;
      position: absolute;
      z-index: 10;
      ${dim}: 3px;
      padding: ${vertical ? "" : "0 "} 4px 0 4px;
      margin-${pos}: -5px;
      ${opp}: 100%;
      cursor: ${cursor};
      background-color: #aaa2;
      background-clip: content-box;
      &.dragging,
      &:hover {
        background-color: #5efa !important;
      }
      transition:
        left 3.5ms linear
        ;
    }
    `;
  });
  const off = fx2(({ initial }) => {
    off();
    $4.cells = $4.intents = [...initial];
  });
  fx2(({ host, layout: layout2 }) => {
    const resize = queue.raf(() => {
      $4.rect = new Rect(layout2.getBoundingClientRect()).round();
      Object.assign(host.style, $4.rect.toStyle());
    });
    return chain(
      on(window, "resize")(resize),
      observe2.resize.initial(layout2, resize)
    );
  });
  const handleDown = fn2(({ rect, cells, intents, vertical, snap }) => function spacerHandleDown(el, e, index) {
    el.classList.add("dragging");
    const [dim, , , , n] = dims(vertical);
    const moveTo = (pos) => {
      let posN = pos[n] / rect[dim];
      posN = clamp2(0, 1, posN);
      const newCells = [...cells];
      const oldN = cells[index];
      newCells[index] = posN;
      const diffN = posN - oldN;
      for (const [i, intentN] of intents.entries()) {
        if (i < index) {
          if (e.shiftKey) {
            if (intentN > 0) {
              const co = intentN / oldN;
              newCells[i] = clamp2(0, 1, intentN + diffN * (isNaN(co) ? 1 : co));
            }
          } else {
            newCells[i] = intentN;
            if (newCells[i] > posN) {
              newCells[i] = posN;
            }
          }
        } else if (i > index) {
          if (e.shiftKey) {
            if (intentN < 1) {
              const co = (1 - intentN) / (1 - oldN);
              newCells[i] = clamp2(0, 1, intentN + diffN * (isNaN(co) ? 1 : co));
            }
          } else {
            newCells[i] = intentN;
            if (newCells[i] < posN) {
              newCells[i] = posN;
            }
          }
        }
      }
      $4.cells = newCells;
    };
    const getPointerPos = (e2) => {
      return new Point(e2.pageX, e2.pageY).sub(rect.pos);
    };
    let ended = false;
    const off2 = on(window, "pointermove")(function spacerPointerMove(e2) {
      if (ended)
        return;
      moveTo(getPointerPos(e2));
    });
    on(window, "pointerup").once((e2) => {
      off2();
      ended = true;
      requestAnimationFrame(() => {
        if (snap) {
          if (index === $4.cells.length - 1 && $4.cells.at(-1) > 0.99) {
            moveTo(new Point(window.innerWidth, 0));
          } else {
            moveTo(
              getPointerPos(e2).gridRound(15)
            );
          }
        }
        $4.intents = [...$4.cells];
        el.classList.remove("dragging");
      });
    });
  });
  fx2(({ app, id, intents }) => {
    app.setSpacer(id, intents);
  });
  fx2(({ cells, vertical }) => {
    const [, , pos] = dims(vertical);
    $4.handles = cells.slice(1).map(
      (p, i) => /* @__PURE__ */ jsx("div", {
        part: "handle",
        style: { [pos]: p * 100 + "%" },
        onpointerdown: function(e) {
          e.preventDefault();
          handleDown(this, e, i + 1);
        }
      })
    );
  });
  fx2(({ layout: layout2, handles, children, cells, vertical }) => {
    $4.view = [
      (Array.isArray(children) ? children : [children]).map((child, i) => {
        const after = i < children.length - 1 ? cells[i + 1] : 1;
        const size = after - cells[i];
        return /* @__PURE__ */ jsx(Layout, {
          layout: layout2,
          size,
          vertical,
          children: child
        });
      }),
      handles
    ];
  });
}));

// ../src/vertical.tsx
function selectorsToNode(selectors, rootNode = document) {
  let current, el;
  for (const sel of selectors) {
    if (sel === "window") {
      return window;
    }
    el = rootNode?.querySelector(sel);
    if (!el)
      return current;
    current = el;
    rootNode = el?.shadowRoot;
    if (!rootNode)
      break;
  }
  return current;
}
var Vertical = web("vertical", view(class props11 {
  app;
  id;
  height;
  minHeight = 90;
  collapseSibling = false;
  fixed = false;
}, class local11 {
  host = element;
  target;
  sibling = false;
}, ({ $: $4, fx: fx2, fn: fn2 }) => {
  $4.css = `
  & {
    position: relative;
    display: flex;
    height: 2px;
    padding: 3px 0 3px;
    margin-top: -5px;
    margin-bottom: -3px;
    z-index: 10;
    width: 100%;
    background-clip: content-box;
    cursor: ns-resize;
    &([fixed]) {
      padding: 3px 0;
      margin: -3px 0;
    }
    background-color: #aab2;
    &([small]) {
      pointer-events: none;
      background-color: transparent;
    }
    &(.dragging),
    &(:hover) {
      background-color: #5efa;
    }
  }
  `;
  fx2.raf(({ host, fixed }) => {
    host.toggleAttribute("fixed", fixed);
  });
  fx2(({ host, collapseSibling }) => {
    $4.target = host.previousElementSibling;
    if (collapseSibling) {
      $4.sibling = host.parentElement.previousElementSibling.firstElementChild.nextElementSibling;
    }
  });
  fx2.raf(({ target, height }) => {
    target.style.height = target.style.minHeight = target.style.maxHeight = height + "px";
  });
  const handleDown = fn2(({ app, minHeight, id, host, target, sibling }) => function verticalHandleDown(e) {
    host.classList.add("dragging");
    const getPointerPos = (e2) => {
      return new Point(e2.pageX, e2.pageY);
    };
    let moveTo;
    let height;
    let heightSibling;
    if (sibling) {
      height = Math.floor(target.getBoundingClientRect().height ?? 0);
      const midi = selectorsToNode(["x-scheduler", "x-spacer", "x-layout", "x-midi"], target.shadowRoot);
      let siblingTop;
      if (sibling) {
        heightSibling = sibling?.getBoundingClientRect().height ?? 0;
        siblingTop = getElementOffset(sibling).y;
      }
      moveTo = (pos, force) => {
        if (ended && !force)
          return;
        const targetTop = getElementOffset(target).y;
        const h = pos.y - targetTop;
        if (height > 90 || h > 90 || heightSibling > 90) {
          setHeight(target, height = Math.max(height < 90 ? 45 : 90, h));
          setHeight(sibling, heightSibling = Math.max(90, pos.y - siblingTop - height));
        } else if (height > 45) {
          if (h < 45 || height < 90 && h > 60) {
            setHeight(target, height = Math.max(45, h));
          }
        } else {
          if (heightSibling >= 45 && heightSibling <= 90 && (h < 15 && heightSibling === 90 || heightSibling < 90)) {
            setHeight(sibling, heightSibling = Math.max(45, Math.min(90, pos.y - siblingTop - height)));
            if (heightSibling === 90) {
              height = Math.max(45, h);
              setHeight(target, height);
            }
          }
        }
        if (height === 45 && heightSibling >= 90) {
          midi.style.height = midi.style.minHeight = midi.style.maxHeight = "43px";
        } else {
          midi.style.height = midi.style.minHeight = midi.style.maxHeight = "";
        }
      };
    } else {
      let prevHeight = Math.floor(target.getBoundingClientRect().height ?? 0);
      moveTo = (pos, force) => {
        if (ended && !force)
          return;
        const targetTop = getElementOffset(target).y;
        const h = pos.y - targetTop;
        setHeight(target, height = Math.max(prevHeight < minHeight ? 45 : minHeight, h));
        if (height > minHeight) {
          prevHeight = height;
          host.style.width = "100%";
          host.style.left = "0";
        }
      };
    }
    const setHeight = (el, height2) => {
      el.style.height = el.style.minHeight = el.style.maxHeight = height2 + "px";
    };
    let ended = false;
    const off = on(window, "pointermove").raf(function verticalPointerMove(e2) {
      if (ended)
        return;
      moveTo(getPointerPos(e2));
    });
    on(window, "pointerup").once((e2) => {
      ended = true;
      off();
      requestAnimationFrame(() => {
        const targetTop = getElementOffset(target).y;
        moveTo(
          getPointerPos(e2).sub(0, targetTop).gridRound(15).translate(0, targetTop),
          true
        );
        host.classList.remove("dragging");
        app.setVertical(id, height);
        if (sibling && heightSibling) {
          app.setVertical(sibling.id, heightSibling);
        }
      });
    });
  });
  fx2(
    ({ host }) => on(host, "pointerdown").prevent(handleDown)
  );
}));

// ../../webaudio-tools/dist/esm/silence-detector-processor.js
var SilenceDetector = {
  name: "silence-detector",
  channelCount: 1,
  channelCountMode: "clamped-max",
  channelInterpretation: "speakers",
  numberOfInputs: 1,
  numberOfOutputs: 0
};
if (typeof AudioWorkletProcessor !== "undefined") {
  let SilenceDetectorProcessor = class SilenceDetectorProcessor extends AudioWorkletProcessor {
    isSilent = true;
    seconds = 0.5;
    detectedSilenceAt = 0;
    constructor(options) {
      super();
      this.seconds = options.processorOptions?.seconds ?? this.seconds;
    }
    process(inputs) {
      const data = inputs[0][0];
      if (!data) {
        if (!this.isSilent) {
          this.isSilent = true;
          this.port.postMessage({
            silence: true
          });
        }
        return true;
      }
      if (!this.isSilent) {
        if (data[0] === 0) {
          if (!this.detectedSilenceAt)
            this.detectedSilenceAt = currentTime;
          else {
            if (currentTime - this.detectedSilenceAt > this.seconds) {
              this.isSilent = true;
              this.port.postMessage({
                silence: true
              });
            }
          }
        } else {
          this.detectedSilenceAt = 0;
        }
      } else {
        if (data[0] !== 0) {
          this.detectedSilenceAt = 0;
          this.isSilent = false;
          this.port.postMessage({
            playing: true
          });
        }
      }
      return true;
    }
  };
  registerProcessor(SilenceDetector.name, SilenceDetectorProcessor);
}

// ../../webaudio-tools/dist/esm/silence-detector.js
var SilenceDetectorNode = class extends AudioWorkletNode {
  static async register(context) {
    if (this.hasRegistered)
      return;
    await context.audioWorklet.addModule(new URL(
      "./silence-detector-processor.js",
      import.meta.url
    ).href);
    this.hasRegistered = true;
  }
  static async create(context, options = {}) {
    await this.register(context);
    return new this(context, {
      ...options,
      ...SilenceDetector
    });
  }
  isSilent = true;
  constructor(context, options) {
    super(context, SilenceDetector.name, options);
    this.port.onmessage = ({ data }) => {
      if (data.silence) {
        this.isSilent = true;
        this.onsilence?.();
        this.dispatchEvent(new CustomEvent("silence"));
      }
      if (data.playing) {
        this.isSilent = false;
        this.onplaying?.();
        this.dispatchEvent(new CustomEvent("playing"));
      }
    };
  }
};
__publicField(SilenceDetectorNode, "hasRegistered", false);

// ../src/midi.tsx
var MidiOps = new Set(Object.values(MidiOp));
var Midi = web("midi", view(
  class props12 {
    state;
    audioContext;
    midiEvents = [];
    numberOfBars = 1;
  },
  class local12 {
    host = element;
    rects;
    currentTime;
  },
  ({ $: $4, fx: fx2 }) => {
    $4.css = `
  & {
    contain: size layout style paint;
    --note-color: #d64;
    display: inline-flex;

    &(:not([state=running])) {
      --note-color: #666c;
    }
  }

  [part=svg] {
    z-index: -1;
    width: 100%;
    height: 100%;
    shape-rendering: optimizeSpeed;
  }

  [part=note] {
    shape-rendering: optimizeSpeed;
    fill: var(--note-color);
    &.lit {
      fill: #03f;
      opacity: 1;
    }
  }
  `;
    fx2.raf(({ host, state }) => {
      host.setAttribute("state", state);
    });
    fx2(({ midiEvents, numberOfBars }) => {
      const events = midiEvents.filter((x) => MidiOps.has(x.data[0]));
      const minNote = Math.min(...midiEvents.map((x) => x.data[1]));
      const maxNote = Math.max(...midiEvents.map((x) => x.data[1]));
      const heightScale = maxNote - minNote;
      const fullTime = numberOfBars * 1e3;
      const width = 100 / numberOfBars;
      const height = 100 / (heightScale + 1);
      const noteOns = events.filter((x) => x.data[0] === MidiOp.NoteOn);
      const noteOffs = events.filter((x) => x.data[0] === MidiOp.NoteOff);
      const rects = noteOns.map((noteOn) => {
        const noteOff = noteOffs.find((y) => noteOn.data[1] === y.data[1] && y.receivedTime >= noteOn.receivedTime);
        if (noteOff)
          noteOffs.splice(noteOffs.indexOf(noteOff), 1);
        return [
          new Rect(
            noteOn.receivedTime / 1e3 * width,
            (heightScale - (noteOn.data[1] - minNote)) * height,
            ((noteOff?.receivedTime ?? fullTime) - noteOn.receivedTime) / 1e3 * width,
            height
          ),
          [noteOn, noteOff]
        ];
      });
      $4.rects = rects;
    });
    const notesMap = /* @__PURE__ */ new Map();
    fx2(({ state, audioContext, numberOfBars }) => {
      if (state === "running") {
        const iv = setInterval(() => {
          $4.currentTime = audioContext.currentTime % numberOfBars * 1e3;
        }, 10);
        return () => {
          clearInterval(iv);
        };
      }
    });
    fx2.raf(({ currentTime: currentTime2 }) => {
      for (const [
        el,
        [, [noteOnEvent, noteOffEvent]]
      ] of notesMap) {
        if (currentTime2 >= noteOnEvent.receivedTime && currentTime2 < noteOffEvent.receivedTime) {
          el.classList.add("lit");
        } else {
          el.classList.remove("lit");
        }
      }
    });
    fx2(({ rects }) => {
      $4.view = /* @__PURE__ */ jsx("svg", {
        part: "svg",
        viewBox: "0 0 100 100",
        preserveAspectRatio: "none",
        children: rects.map((item) => {
          const [rect, [{ data: [, , vel] }]] = item;
          return /* @__PURE__ */ jsx("rect", {
            onref: (el) => {
              notesMap.set(el, item);
            },
            onunref: (el) => {
              notesMap.delete(el);
            },
            part: "note",
            ...rect.toJSON(),
            opacity: (vel / 127) ** 0.3 * 0.9 + 0.1
          });
        })
      });
    });
  }
));

// ../src/stretchy.tsx
var Stretchy = ({ key, width, height, children }) => /* @__PURE__ */ jsx("svg", {
  viewBox: `0 0 ${width} ${height}`,
  preserveAspectRatio: "xMidYMid meet",
  children: /* @__PURE__ */ jsx("foreignObject", {
    x: "0",
    y: "0",
    width,
    height,
    children: /* @__PURE__ */ jsx("div", {
      style: {
        width: width + "px",
        height: height + "px",
        display: "flex",
        justifyContent: "center"
      },
      children
    })
  })
});

// ../src/util/fit-grid.ts
var fitGrid = (width, height, total) => {
  const [w, h] = [width, height];
  if (total === 1) {
    return {
      cols: 1,
      rows: 1,
      vertical: false
    };
  }
  let candidates = [];
  const vertical = true;
  if (!vertical) {
    for (let i = 1; i <= total; i++) {
      const cols = i;
      const rows = total / cols;
      const iw = w / cols;
      const ih = h / Math.ceil(rows);
      const a = iw / ih;
      const frac = rows - (rows | 0);
      const fits = Math.abs(cols / rows - 1);
      const hanging = total - cols * (rows | 0);
      candidates.push({
        aspect: Math.abs(a - 1),
        frac,
        cols,
        rows,
        fits,
        fitsFrac: fits - (fits | 0),
        hanging
      });
    }
  } else {
    for (let i = 1; i <= total; i++) {
      const rows = i;
      const cols = total / rows;
      const iw = w / cols;
      const ih = h / rows;
      const a = iw / ih;
      const frac = cols - (cols | 0);
      const fits = Math.abs(cols / rows - 1);
      const hanging = total - (cols | 0) * rows;
      candidates.push({
        aspect: Math.abs(a - 1),
        frac,
        cols,
        rows,
        fits,
        fitsFrac: fits - (fits | 0),
        hanging
      });
    }
  }
  candidates = candidates.filter(({ frac }) => frac === 0 || frac >= 0.35).sort((a, b) => sortCompare(a.aspect, b.aspect));
  const search = (candidates2) => {
    for (const c of candidates2) {
      if ((!c.hanging || !c.fitsFrac) && c.aspect < 0.85) {
        return c;
      }
    }
  };
  let result;
  let attempt;
  for (const f of [0.5, 0.25]) {
    attempt = candidates.filter(({ frac }) => frac === 0 || frac % f === 0);
    result = search(attempt);
    if (result) {
      break;
    }
  }
  if (!result) {
    attempt = candidates.filter(({ aspect, frac }) => aspect < 0.5 && (frac === 0 || frac % 0.0625 === 0));
    result = attempt.sort((a, b) => sortCompare(a.frac, b.frac))[0];
  }
  if (!result) {
    if (!result)
      result = candidates[0];
  }
  if (!result) {
    return {
      cols: 1,
      rows: 1,
      vertical: false
    };
  }
  const { cols: newCols, rows: newRows } = result;
  if (vertical) {
    return {
      cols: Math.ceil(newCols),
      rows: newRows,
      vertical
    };
  } else {
    return {
      cols: newCols,
      rows: Math.ceil(newRows),
      vertical
    };
  }
};

// ../src/util/classes.ts
function classes2(obj) {
  return Object.entries(obj).reduce((p, [className, value]) => {
    if (value)
      p.push(className);
    return p;
  }, []).join(" ");
}

// ../src/presets.tsx
var Presets = web("presets", view(
  class props13 {
    app;
    id;
    presets;
    selectedPresetId;
  },
  class local13 {
    host = element;
    size;
  },
  ({ $: $4, fx: fx2 }) => {
    $4.css = `
  & {
    --cols: 1;
    --rows: 1;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    cursor: default;
    user-select: none;
    touch-action: none;
  }

  [part=preset] {
    position: relative;
    /* width: calc(100% / var(--cols)); */
    /* height: calc(100% / var(--rows)); */
    color: hsl(var(--hue), 85%, 65%);
    font-family: Helvetica, 'Helvetica Neue', 'Open Sans', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-size: 22px;
    line-height: 30px;
    text-align: center;

    --shadow-color: #001e;
    --shadow-width: 3px;

    --outline-color: #0000;
    --outline-width: 3px;

    svg {
      position: relative;
      z-index: 1;
      display: flex;
      width: 100%;
      height: 100%;
    }

    [part=outline],
    [part=shadow] {
      display: none;
      position: absolute;
      z-index: -1;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    [part=shadow] {
      color: var(--shadow-color);
      -webkit-text-stroke: var(--shadow-width) var(--shadow-color);
    }

    [part=outline] {
      z-index: -2;
      color: var(--outline-color);
      -webkit-text-stroke: var(--outline-width) var(--outline-color);
    }

    [part=overlay] {
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: hsl(var(--hue), 85%, 65%);
      opacity: 0;
    }

    [part=draft] {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-repeat: repeat;
      background-size: 30px 30px;
      background-position: center;
    }

    &.draft {
      [part=shadow] {
        display: block;
      }
    }

    &:hover,
    &.selected {
      --shadow-color: hsl(var(--hue), 85%, 65%);
      --shadow-width: 3.5px;
      --outline-color: hsl(calc(var(--hue) + 45), 75%, 20%);
      --outline-width: calc(var(--shadow-width) + 3px);

      svg {
        color: hsl(calc(var(--hue) + 45), 75%, 20%); !important;
      }

      [part=outline],
      [part=shadow] {
        display: block;
      }

      [part=overlay] {
        opacity: 1;
      }

      [part=draft] {
        opacity: 1;
      }
    }
  }
  `;
    fx2(
      ({ host }) => observe2.resize.initial(host, () => {
        $4.size = new Rect(host.getBoundingClientRect()).round().size;
      })
    );
    fx2(({ app, id, presets, selectedPresetId, size }) => {
      const [w, h] = size;
      const total = presets.length;
      const { cols, rows } = fitGrid(w, h, total);
      $4.view = presets.map(
        (preset) => /* @__PURE__ */ jsxs("div", {
          id: preset.id,
          part: "preset",
          style: {
            "--hue": preset.hue,
            width: 100 / cols + "%",
            height: 100 / rows + "%"
          },
          class: classes2({
            ["selected"]: selectedPresetId === preset.id,
            ["draft"]: preset.isDraft
          }),
          onpointerdown: (e) => {
            if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
              app.removePresetById(id, preset.id);
            } else if (e.buttons & 4) {
              app.renamePresetRandom(id, preset.id, e.altKey);
            } else {
              app.selectPreset(id, preset.id, true);
            }
          },
          ondblclick: (e) => {
            if (e.shiftKey && (e.ctrlKey || e.metaKey))
              return;
            if (e.buttons & 4)
              return;
            app.savePreset(id, preset.id);
          },
          children: [
            /* @__PURE__ */ jsx("div", {
              part: "overlay"
            }),
            /* @__PURE__ */ jsx("div", {
              part: "draft",
              style: preset.isDraft ? {
                backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" preserveAspectRatio="xMidYMid meet">          <circle cx="22.5" cy="22.5" r="20" fill="hsl(${(preset.hue + 45) % 360}, 75%, 20%)" />          <circle cx="67.5" cy="67.5" r="20" fill="hsl(${(preset.hue + 45) % 360}, 75%, 20%)" />          " /></svg>')`
              } : {}
            }),
            /* @__PURE__ */ jsxs(Stretchy, {
              width: 30,
              height: 30,
              children: [
                preset.name,
                /* @__PURE__ */ jsx("div", {
                  part: "shadow",
                  children: preset.name
                }),
                /* @__PURE__ */ jsx("div", {
                  part: "outline",
                  children: preset.name
                })
              ]
            })
          ]
        }, preset.id)
      );
    });
  }
));

// ../src/slider.tsx
var downSlider = false;
var SliderParam2 = class {
  id;
  name;
  value;
  min;
  max;
  hue;
  source;
  sourceIndex;
};
var Slider = web("slider", view(
  class props14 extends SliderParam2 {
    machine;
    running;
    vertical = true;
    children;
  },
  class local14 {
    host = element;
    rect;
    fill;
  },
  ({ $: $4, fx: fx2, fn: fn2, refs: refs2 }) => {
    fx2(({ vertical }) => {
      const [dim, opp, pos, oppPos, line, oppLine] = vertical ? ["height", "width", "left", "bottom", "top", "left"] : ["width", "height", "bottom", "left", "left", "top"];
      $4.css = `
  & {
    --hue: #f00;
    --sat: 85%;
    --lum: 65%;
    display: flex;
    position: relative;
    box-sizing: border-box;
    /* box-shadow: inset 0 0 0 5px #d64; */
    width: 100%;
    max-width: 100px;
    height: 100%;
    margin: 0 -10px;
    user-select: none;
    touch-action: none;
    &(.active) {
      border-color: #fff;
    }
  }

  [part=name] {
    position: absolute;
    top: 0px;
    color: #fff;
    left: calc(50% - 10px);
    /* background: red; */
    line-height: 20px;
    vertical-align: middle;
    white-space: nowrap;
    /* writing-mode: horizontal-tb; */
    writing-mode: vertical-lr;
    text-orientation: upright;
    direction: ltr;
    /* transform: rotate(-90deg); */
    font-family: monospace;
    font-weight: bold;
    text-shadow: 1px 1px #000;
  }

  &:before {
    content: ' ';
    position: absolute;
    ${line}: calc(50% - max(45%, 12px) / 2);
    ${oppLine}: 0;
    ${dim}: max(45%, 12px);
    ${opp}: 100%;
    background: #fff0;
  }

  [part=fill] {
    transition:
      height 40ms linear,
      min-height 40ms linear,
      max-height 40ms linear
      ;
    position: absolute;
    ${dim}: 100%;
    ${opp}: auto;
    ${pos}: 0;
    ${oppPos}: auto;
    &:before {
      box-shadow: 5px 5px 0 0px #000;
      content: ' ';
      position: absolute;
      ${line}: calc(50% - max(45%, 12px) / 2);
      ${oppLine}: 0;
      ${dim}: max(45%, 12px);
      ${opp}: 100%;
      background: hsl(var(--hue), var(--sat), calc(var(--lum) - 5%));
    }
  }

  &(.active),
  &(:hover) {
    cursor: ns-resize;
    z-index: 99;
    &:before {
      ${line}: calc(50% - max(80%, 20px) / 2);
      ${oppLine}: 0;
      ${dim}: max(80%, 20px);
      ${opp}: 100%;
      background: #aaf2;
    }
    [part=fill] {
      &:before {
        ${line}: calc(50% - max(80%, 20px) / 2);
        ${oppLine}: 0;
        ${dim}: max(80%, 20px);
        ${opp}: 100%;
        background: hsl(var(--hue), var(--sat), calc(var(--lum) + 5%));
      }
    }
  }
  &([running]:hover) {
    &:before {
      background: #aaf3;
    }
  }
  `;
    });
    fx2.raf(({ host, running }) => {
      host.toggleAttribute("running", running);
    });
    fx2(({ host }) => {
      const resize = queue.raf(() => {
        $4.rect = new Rect(host.getBoundingClientRect()).round();
      });
      return chain(
        observe2.resize.initial(host, resize)
      );
    });
    fx2(({ rect, fill, value, min, max, vertical }) => {
      const yDims = ["height", "minHeight", "maxHeight"];
      const xDims = ["width", "minWidth", "maxWidth"];
      const [[dim, dimMin, dimMax], [opp, oppMin, oppMax]] = vertical ? [xDims, yDims] : [yDims, xDims];
      const normal = (value - min) / (max - min);
      const newSize = normal * rect[dim];
      const size = Math.max(0, Math.min(rect[dim], newSize));
      fill.style[dim] = fill.style[dimMin] = fill.style[dimMax] = size / rect[dim] * 100 + "%";
      fill.style[opp] = fill.style[oppMin] = fill.style[oppMax] = "100%";
    });
    let handling = false;
    const handleDown = fn2(({ host, machine, id, fill, vertical }) => (e) => {
      if (handling || !(e.buttons & 1))
        return;
      if (e.type === "pointerdown") {
        downSlider = true;
      } else {
        if (!downSlider)
          return;
        if (e.type === "pointerenter" && !e.altKey) {
          return;
        }
      }
      handling = true;
      host.classList.add("active");
      const yDims = ["height", "minHeight", "maxHeight", "y"];
      const xDims = ["width", "minWidth", "maxWidth", "x"];
      const [[dim, dimMin, dimMax, n], [opp, oppMin, oppMax]] = vertical ? [xDims, yDims] : [yDims, xDims];
      const getPointerPos = (e2) => {
        return new Point(e2.pageX, e2.pageY);
      };
      const ownRect = new Rect(host.getBoundingClientRect());
      const moveTo = (pos) => {
        let newSize = pos[n] - ownRect[n];
        if (!vertical)
          newSize = ownRect[dim] - newSize;
        const size = Math.max(0, Math.min(ownRect[dim], newSize));
        const normal = size / ownRect[dim];
        machine.setSliderNormal(id, normal);
        fill.style[dim] = fill.style[dimMin] = fill.style[dimMax] = size / ownRect[dim] * 100 + "%";
        fill.style[opp] = fill.style[oppMin] = fill.style[oppMax] = "100%";
      };
      moveTo(getPointerPos(e));
      const off = on(e.altKey ? host : window, "pointermove").raf(function verticalPointerMove(e2) {
        moveTo(getPointerPos(e2));
      });
      on(window, "pointerup").once((e2) => {
        off();
        handling = false;
        downSlider = false;
        requestAnimationFrame(() => {
          host.classList.remove("active");
        });
      });
    });
    const handleWheel = fn2(({ machine, id }) => function onSliderWheel(ev) {
      machine.onWheel(ev, id);
    });
    fx2(
      ({ host }) => chain(
        on(host, "pointerdown")(handleDown),
        on(host, "pointerenter")(handleDown),
        on(host, "wheel").not.passive(handleWheel)
      )
    );
    fx2(({ name }) => {
      $4.view = /* @__PURE__ */ jsx("div", {
        part: "fill",
        ref: refs2.fill,
        children: /* @__PURE__ */ jsx("span", {
          part: "name",
          children: name
        })
      });
    });
  }
));

// ../src/sliders.tsx
var Sliders = web("sliders", view(
  class props15 {
    machine;
    sliders;
    running;
  },
  class local15 {
    host = element;
    size;
  },
  ({ $: $4, fx: fx2 }) => {
    $4.css = `
  & {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: nowrap;
    flex-direction: row;
    cursor: default;
    user-select: none;
    touch-action: none;
  }

  /* &([small]) { */
    [part=padding] {
      min-width: 80px;
      width: 80px;
      /* height: 100%; */
    }

    &([small]) {
      /* height: calc(100% - 90px); */
      [part=padding] {
        display: none;
      }
    }
  /* } */
  `;
    fx2(
      ({ host }) => observe2.resize.initial(host, () => {
        $4.size = new Rect(host.getBoundingClientRect()).round().size;
      })
    );
    fx2.raf(({ host, size }) => {
      host.toggleAttribute("small", size.width < 180);
    });
    fx2(
      ({ machine, sliders, running }) => {
        const vertical = false;
        $4.view = /* @__PURE__ */ jsxs(Fragment, {
          children: [
            [...sliders.values()].map(
              (slider) => /* @__PURE__ */ jsx(Slider, {
                ...slider,
                running,
                machine,
                vertical,
                style: {
                  "--hue": Math.round(slider.hue / 25) * 25 % 360,
                  "--sat": running ? "85%" : "80%",
                  "--lum": running ? "40%" : "30%"
                }
              })
            ),
            /* @__PURE__ */ jsx("div", {
              part: "padding"
            })
          ]
        });
      }
    );
  }
));

// ../src/util/random-name.ts
var unicode = (a, b) => String.fromCodePoint(Math.round(a + Math.random() * (b - a)));
var ancient = [
  [4265, 4293],
  [592, 687],
  [11570, 11622],
  [66176, 66204],
  [66208, 66256],
  [119296, 119356],
  [8903, 8919],
  [8763, 8787],
  [5027, 5107],
  [1984, 2023],
  [1329, 1366],
  [1377, 1415]
];
var emoji = [
  [127744, 128511],
  [128512, 128591],
  [128640, 128709]
];
var randomName = (pages = ancient) => unicode(...pages[Math.random() * pages.length | 0]);

// ../src/app.tsx
var parseArgsRegExp = /'(?<id>\w+)\s*?\[.+\]\s*?=\s*(?<value>[.0-9kKf]+)/gi;
function satisfiesDetail(prev, next) {
  if (Array.isArray(prev)) {
    if (Array.isArray(next)) {
      return prev.every(
        (a) => next.find((b) => is_equal_default(a, b))
      );
    }
  }
  return is_equal_default(prev, next);
}
var deserialize = (json) => {
  const Classes2 = [
    List
  ];
  return deobjectify(json, reviver(Classes2));
};
var serialize = (json) => objectify(json, replacer(json));
var windowWidth = window.innerWidth;
var HEIGHTS = {
  app: 45,
  mono: 360,
  scheduler: 150
};
var defaultMachines = {
  mono: new MachineData({
    id: "a",
    kind: "mono",
    groupId: "A",
    state: "init",
    spacer: [0, 0.35, 1 - 45 / windowWidth],
    height: HEIGHTS.mono
  }),
  scheduler: new MachineData({
    id: "b",
    kind: "scheduler",
    groupId: "A",
    state: "init",
    spacer: [0, 0.35, 1 - 45 / windowWidth],
    height: HEIGHTS.scheduler,
    outputs: ["a"]
  })
};
var App = class {
  load;
  save;
  connectNode;
  disconnectNode;
  startPlaying;
  stopPlaying;
  getMachineSlider;
  getMachinesInGroup;
  removeMachinesInGroup;
  setMachineState;
  setMachineControls;
  setMachineSliders;
  getPresetByDetail;
  insertPreset;
  removePresetById;
  setPresetDetail;
  selectPreset;
  renamePresetRandom;
  savePreset;
  setSpacer;
  setVertical;
  constructor(state) {
    const { $: $4 } = state;
    this.load = () => {
      const machines = [];
      try {
        const json = JSON.parse(localStorage.app);
        const app = new MachineData({
          id: "app",
          kind: "app",
          ...deserialize(json)
        });
        $4.appMachine = app;
        console.log(app);
      } catch (error) {
        console.warn("Failed to load app data.");
        console.warn(error);
      }
      (localStorage.machines ?? "").split(",").filter(Boolean).forEach((id) => {
        try {
          const m = JSON.parse(localStorage[`machine_${id}`]);
          machines.push(new MachineData(deserialize(m)));
        } catch (error) {
          console.warn("Failed to load machine with id", id);
          console.warn(error);
        }
      });
      if (machines.length) {
        $4.machines = new List(machines);
      }
      console.log($4.machines);
    };
    this.save = () => {
      localStorage.app = JSON.stringify(serialize(
        pick2($4.appMachine, [
          "id",
          "kind",
          "presets",
          "selectedPresetId",
          "height"
        ])
      ));
      localStorage.machines = $4.machines.items.map((x) => x.id).filter((id) => id !== "app");
      for (const m of $4.machines.items) {
        if (m.id === "app")
          continue;
        localStorage[`machine_${m.id}`] = JSON.stringify(
          serialize(
            Object.assign(pick2(m, [
              "id",
              "groupId",
              "kind",
              "state",
              "outputs",
              "presets",
              "selectedPresetId",
              "spacer",
              "height"
            ]))
          )
        );
      }
    };
    this.connectNode = (sourceNode, targetId) => {
      const targetNode = $4.audioNodes.get(targetId);
      if (!targetNode) {
        throw new Error("No target audio node found with id: " + targetId);
      }
      sourceNode.connect(targetNode);
      const off = on(targetNode, "suspend")(() => {
        sourceNode.disconnect(targetNode);
        on(targetNode, "resume").once(() => {
          sourceNode.connect(targetNode);
        });
      });
      return () => {
        try {
          sourceNode.disconnect(targetNode);
        } catch (error) {
          console.warn(error);
        }
        off();
      };
    };
    this.disconnectNode = (sourceNode, targetId) => {
      const targetNode = $4.audioNodes.get(targetId);
      if (!targetNode) {
        throw new Error("No target audio node found with id: " + targetId);
      }
      try {
        sourceNode.disconnect(targetNode);
      } catch (error) {
        console.warn(error);
      }
    };
    this.startPlaying = () => {
      $4.machines.items.forEach(({ start }) => start?.());
    };
    this.stopPlaying = () => {
      $4.machines.items.forEach(({ stop: stop2 }) => stop2?.());
    };
    this.getMachineSlider = (id, sliderId) => {
      const machine = $4.machines.getById(id);
      const preset = machine.presets.getById(machine.selectedPresetId);
      const slider = preset.detail.sliders.get(sliderId);
      if (!slider) {
        throw new Error(`Slider not found "${id}" in machine "${id}"`);
      }
      return slider;
    };
    this.removeMachinesInGroup = (groupId) => {
      $4.machines = new List($4.machines.items.filter(
        (machine) => machine.groupId !== groupId
      ));
    };
    this.getMachinesInGroup = (groupId) => $4.machines.items.filter(
      (machine) => machine.groupId === groupId
    );
    this.setMachineState = (id, state2) => {
      $4.machines = $4.machines.updateById(id, { state: state2 });
    };
    this.setMachineControls = (id, controls) => {
      Object.assign($4.machines.getById(id), controls);
      $4.machines = $4.machines.updateById(id, controls);
    };
    this.setMachineSliders = (id, newSliders) => {
      const machine = $4.machines.getById(id);
      const preset = machine.presets.getById(machine.selectedPresetId);
      const sliders = preset.detail.sliders;
      if (is_equal_default(sliders, newSliders))
        return;
      this.setPresetDetail(id, { ...preset.detail, sliders: newSliders });
    };
    this.getPresetByDetail = (id, detail) => {
      const candidates = $4.machines.getById(id).presets.items.filter((preset) => satisfiesDetail(preset.detail, detail));
      const nonDraft = candidates.find((preset) => !preset.isDraft);
      return nonDraft ?? candidates[0];
    };
    this.renamePresetRandom = (id, presetId, useEmoji) => {
      $4.machines = $4.machines.updateById(id, {
        presets: $4.machines.getById(id).presets.updateById(presetId, {
          hue: Math.round(Math.random() * 1e5 / 25) * 25 % 360,
          name: randomName(useEmoji ? emoji : ancient)
        })
      });
    };
    this.savePreset = (id, presetId) => {
      $4.machines = $4.machines.updateById(id, {
        presets: $4.machines.getById(id).presets.updateById(presetId, { isDraft: false })
      });
    };
    this.removePresetById = (id, presetId, fallbackPresetId) => {
      const machine = $4.machines.getById(id);
      try {
        const preset = machine.presets.getById(presetId);
        const index = machine.presets.items.indexOf(preset);
        setDraft(id, { index, preset });
        $4.machines = $4.machines.updateById(id, {
          selectedPresetId: machine.selectedPresetId === presetId ? false : machine.selectedPresetId,
          presets: machine.presets.removeById(presetId)
        });
      } catch (error) {
        console.warn(error);
      }
    };
    this.insertPreset = (id, index, newDetail) => {
      const machine = $4.machines.getById(id);
      const hue = Math.round(Math.random() * 1e5 / 25) * 25 % 360;
      const newPreset = {
        id: cheapRandomId(),
        name: randomName(),
        hue,
        detail: newDetail,
        isIntent: false,
        isDraft: true
      };
      setDraft(id, { index, preset: newPreset });
      $4.machines = $4.machines.updateById(id, {
        selectedPresetId: newPreset.id,
        presets: machine.presets.insertAfterIndex(index, newPreset)
      });
      this.selectPreset(id, newPreset.id);
    };
    const drafts = /* @__PURE__ */ new Map();
    this.selectPreset = (id, nextPresetId, byClick = false, newDetail, byGroup) => {
      if (byClick)
        drafts.delete(id);
      const machine = $4.machines.getById(id);
      const prev = !nextPresetId || !machine.selectedPresetId ? false : machine.presets.getById(machine.selectedPresetId);
      const next = !nextPresetId ? false : machine.presets.getById(nextPresetId);
      const isArray2 = Array.isArray(newDetail);
      if (prev && prev === next && newDetail && (isArray2 || newDetail.editorValue !== prev.detail.editorValue)) {
        if (machine.kind === "mono" && !newDetail.sliders) {
          const prevCodeNoArgs = removeSliderArgsFromCode(
            prev.detail.sliders,
            prev.detail.editorValue
          );
          const nextCode = newDetail.editorValue;
          const nextCodeNoArgs = nextCode.replace(parseArgsRegExp, "");
          if (nextCodeNoArgs === prevCodeNoArgs) {
            const argTokens = [...newDetail.editorValue.matchAll(parseArgsRegExp)];
            const sliderNames = new Map([...prev.detail.sliders.values()].map((x) => [x.name, x]));
            if (argTokens.length && argTokens.length === prev.detail.sliders.size && argTokens.every(
              ([, id2]) => sliderNames.has(id2)
            )) {
              const nextSliders = copySliders(prev.detail.sliders);
              argTokens.forEach((match) => {
                const [arg, id2, value] = match;
                const { index } = match;
                const slider = nextSliders.get(sliderNames.get(id2).id);
                slider.value = parseFloat(value);
                slider.source.arg = arg;
                slider.source.default = value;
                slider.sourceIndex = index;
              });
              $4.machines = $4.machines.updateById(id, {
                presets: machine.presets.updateById(nextPresetId, {
                  detail: {
                    ...newDetail,
                    sliders: nextSliders
                  }
                })
              });
              const paramMarkers = [...nextSliders.values()].map(markerForSlider);
              machine.editor.setMarkers([...paramMarkers]);
              return;
            }
          }
          machine.compile(newDetail.editorValue, false).then(() => {
            const newSliders = machine.updateSliders?.();
            if (newSliders && machine.editor.value === newDetail.editorValue) {
              $4.machines = $4.machines.updateById(id, {
                presets: machine.presets.updateById(nextPresetId, {
                  detail: {
                    ...newDetail,
                    sliders: newSliders
                  }
                })
              });
              const paramMarkers = [...newSliders.values()].map(markerForSlider);
              machine.editor.setMarkers([...paramMarkers]);
            }
          });
        } else {
          const nextDetail2 = isArray2 ? newDetail : { ...next.detail, ...newDetail };
          $4.machines = $4.machines.updateById(id, {
            presets: machine.presets.updateById(nextPresetId, {
              detail: nextDetail2
            })
          });
          if (byGroup) {
            machine.updateEditorValueArgs(
              prev.detail.editorValue,
              nextDetail2.sliders,
              prev.detail.sliders
            );
          }
        }
        return;
      }
      const nextDetail = newDetail ? { ...next && next.detail || {}, ...newDetail } : next && next.detail;
      if (byClick)
        machine.presets.items.forEach((preset) => {
          preset.isIntent = true;
        });
      let isInitial = false;
      let promise;
      if (nextPresetId && machine.kind === "mono") {
        const prevCodeNoArgs = !prev || !prev.detail.sliders ? false : removeSliderArgsFromCode(
          prev.detail.sliders,
          prev.detail.editorValue
        );
        const nextCodeNoArgs = !next || !nextDetail.sliders ? null : removeSliderArgsFromCode(
          nextDetail.sliders,
          nextDetail.editorValue
        );
        const sameCodeNoArgs = prevCodeNoArgs === nextCodeNoArgs;
        if (next && (machine.state === "init" || !sameCodeNoArgs)) {
          isInitial = !prev || machine.state === "init";
          machine.editor.setValue(nextDetail.editorValue);
          promise = machine.compile(nextDetail.editorValue, isInitial);
        } else {
          if (prev && next && machine.editor) {
            if (byClick && !sameCodeNoArgs) {
              machine.editor.setValue(nextDetail.editorValue);
            } else if (nextDetail.editorValue !== machine.editor.value) {
              try {
                machine.updateEditorValueArgs(
                  prev.detail.editorValue,
                  nextDetail.sliders,
                  prev.detail.sliders
                );
              } catch (error) {
                console.warn(error);
                machine.editor.setValue(nextDetail.editorValue);
              }
            }
            const paramMarkers = [...nextDetail.sliders.values()].map(markerForSlider);
            machine.editor.setMarkers([...paramMarkers]);
          }
        }
      }
      if (byClick && machine.kind === "app" && next) {
        nextDetail.forEach(function applyAppPresetDetail([id2, , detail]) {
          $4.setPresetDetail(id2, detail, false, true);
        });
      }
      $4.machines = $4.machines.updateById(id, {
        selectedPresetId: nextPresetId
      });
      if (isInitial && machine.kind === "mono") {
        promise?.then(() => {
          const sliders = machine.updateSliders?.();
          if (machine.editor.value === nextDetail.editorValue) {
            this.setPresetDetail(id, { sliders });
          }
        });
      }
    };
    function setDraft(id, draft) {
      drafts.set(id, draft);
    }
    function restoreDraft(id, newDetail) {
      const machine = $4.machines.getById(id);
      const draft = drafts.get(id);
      if (draft && !draft.preset.isIntent) {
        if (draft.preset.isDraft) {
          Object.assign(draft.preset.detail, newDetail);
          if (machine.presets.hasId(draft.preset.id)) {
            $4.machines = $4.machines.updateById(id, {
              selectedPresetId: draft.preset.id
            });
            return true;
          } else {
            $4.machines = $4.machines.updateById(id, {
              selectedPresetId: draft.preset.id,
              presets: machine.presets.insertAfterIndex(draft.index - 1, draft.preset)
            });
            return true;
          }
        }
      }
    }
    this.setPresetDetail = (id, newDetail, bySelect = true, byGroup) => {
      const machine = $4.machines.getById(id);
      if (!machine.selectedPresetId) {
        if (restoreDraft(id, newDetail))
          return;
        this.insertPreset(id, -1, newDetail);
        return;
      }
      const current = machine.presets.getById(machine.selectedPresetId);
      const mergedDetail = Array.isArray(current.detail) ? [...newDetail] : { ...current.detail, ...newDetail };
      const preset = this.getPresetByDetail(id, mergedDetail);
      if (preset && !is_equal_default(mergedDetail, preset.detail)) {
        preset.detail = mergedDetail;
      }
      if (preset && !(current.isDraft && !current.isIntent && preset.isDraft)) {
        if (bySelect || machine.selectedPresetId !== preset.id) {
          this.selectPreset(id, preset.id);
          for (const [index2, p] of machine.presets.items.entries()) {
            if (p !== preset && p.isDraft && !p.isIntent) {
              setDraft(id, { index: index2, preset: p });
              $4.machines = $4.machines.updateById(id, {
                presets: machine.presets.removeById(p.id)
              });
            }
          }
          return;
        }
        if (preset.isDraft) {
          setDraft(id, { index: machine.presets.items.indexOf(preset), preset });
          return;
        }
      }
      if (is_equal_default(preset?.detail, current.detail))
        return;
      const index = machine.presets.items.indexOf(current);
      if (current.isDraft) {
        setDraft(id, { index, preset: current });
        this.selectPreset(id, current.id, false, newDetail, byGroup);
        return;
      }
      if (restoreDraft(id, newDetail))
        return;
      this.insertPreset(id, index, mergedDetail);
    };
    this.setSpacer = (id, spacer) => {
      $4.machines = $4.machines.updateById(id, { spacer });
    };
    this.setVertical = (id, height) => {
      $4.machines = $4.machines.updateById(id, { height });
    };
  }
};
var AppView = web("app", view(
  class props16 {
  },
  class local16 extends App {
    appMachine = new MachineData({
      id: "app",
      kind: "app",
      height: HEIGHTS["app"]
    });
    machines = new List([
      { ...defaultMachines.mono },
      { ...defaultMachines.scheduler }
    ]);
    Machines = {
      app: () => {
      },
      mono: Mono,
      scheduler: Scheduler
    };
    host = element;
    rect = new Rect();
    audioContext = new AudioContext({ sampleRate: 44100, latencyHint: 0.04 });
    audioNodes = /* @__PURE__ */ new Map();
    schedulerNode;
    startTime;
    items = [];
    itemsView = false;
    editorScene = new EditorScene({
      layout: {
        viewMatrix: new Matrix(),
        state: {
          isIdle: true
        },
        viewFrameNormalRect: new Rect(0, 0, 1e4, 1e4),
        pos: new Point(0, 0)
      }
    });
    detail;
  },
  ({ $: $4, fx: fx2, fn: fn2 }) => {
    $4.css = `
  & {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    background: #000;
    min-height: 100%;
    padding-bottom: 65vh;
  }

  [part=header] {
    position: sticky;
    top: 0;
    z-index: 99999;
    background: #001d;
    width: 100%;
  }

  [part=main-controls] {
    z-index: 99999999999;
    position: fixed;
    bottom: 50px;
    right: 50px;
    display: flex;
    padding: 8px 25px;
    justify-content: space-between;
    background: #112;
    border-radius: 100px;
    border: 3px solid #fff;
    box-shadow: 3px 3px 0 6px #000;
    ${Button} {
      cursor: pointer;
    }
  }

  [part=items] {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    max-width: max(900px, calc(1vw - 50px));
  }

  [part=item] {
    position: relative;
    max-width: max(900px, calc(1vw - 50px));
  }

  [part=add] {
    margin: 7px;
    display: flex;
    justify-content: center;
    ${Button} {
      cursor: pointer;
      opacity: 0.35;
      color: #667;
      &:hover {
        opacity: 1;
      }
    }
  }
  `;
    fx2(() => {
      document.body.onclick = () => {
        console.log("resuming audio");
        $4.audioContext.resume();
      };
      $4.load();
      $4.machines = $4.machines.add($4.appMachine);
      $4.setMachineState("app", "ready");
      const saveBtn = document.createElement("button");
      Object.assign(saveBtn.style, {
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "99999999999"
      });
      saveBtn.textContent = "save";
      saveBtn.onclick = () => {
        $4.save();
        console.log("saved");
      };
      document.body.appendChild(saveBtn);
    });
    fx2(({ machines }) => {
      const app = machines.getById("app");
      if (!is_equal_default(app, $4.appMachine)) {
        $4.appMachine = app;
      }
    });
    fx2(({ appMachine: { selectedPresetId, presets } }) => {
      if (selectedPresetId) {
        const preset = presets.getById(selectedPresetId);
        $4.detail = preset.detail;
      }
    });
    fx2(({ $: app, appMachine: { state, selectedPresetId, presets }, machines }) => {
      if (state === "init")
        return;
      const newDetail = machines.items.filter((machine) => machine.kind !== "app" && machine.selectedPresetId).map((machine) => [machine, machine.presets.getById(machine.selectedPresetId)]).map(([machine, preset]) => [machine.id, machine.kind, preset.detail]);
      if (!selectedPresetId && satisfiesDetail(newDetail, $4.detail))
        return;
      app.setPresetDetail("app", newDetail);
    });
    fx2(() => {
      const resize = queue.raf(() => {
        const rect = $4.rect.clone();
        rect.width = window.innerWidth;
        rect.height = window.innerHeight;
        $4.rect = rect;
      });
      resize();
      return on(window, "resize")(resize);
    });
    fx2(({ host, rect }) => {
      host.style.width = rect.width + "px";
    });
    fx2(async ({ audioContext }) => {
      $4.schedulerNode = await SchedulerNode.create(audioContext);
      $4.startTime = await $4.schedulerNode.start();
    });
    fx2(async ({ $: app, appMachine: { state }, audioContext, schedulerNode, editorScene, Machines, machines, audioNodes }) => {
      if (state === "init")
        return;
      const itemsView = [];
      for (const machine of machines.items) {
        if (machine.kind === "app")
          continue;
        let audioNode = audioNodes.get(machine.id);
        if (!audioNode) {
          if (machine.kind === "mono") {
            audioNode = await MonoNode.create(audioContext, {
              numberOfInputs: 0,
              numberOfOutputs: 1,
              processorOptions: {
                metrics: 0
              }
            });
            audioNodes.set(machine.id, audioNode);
          }
        }
        itemsView.push(/* @__PURE__ */ jsxs("div", {
          part: "item",
          children: [
            /* @__PURE__ */ jsx(Machine, {
              style: machine.kind === "scheduler" && "border-bottom: 2px solid #aaf2",
              app,
              machine,
              Machines,
              audioNode: audioNode || false,
              audioContext,
              schedulerNode,
              editorScene
            }),
            /* @__PURE__ */ jsx(Vertical, {
              app,
              id: machine.id,
              height: machine.height ?? HEIGHTS[machine.kind]
            })
          ]
        }));
      }
      $4.itemsView = itemsView;
    });
    fx2(({ $: app, machines, itemsView, appMachine: { state, presets, selectedPresetId, height } }) => {
      if (state === "init")
        return;
      const playing = machines.items.filter((machine) => machine.kind === "mono" && machine.state === "running").length;
      $4.view = /* @__PURE__ */ jsxs(Fragment, {
        children: [
          /* @__PURE__ */ jsxs("div", {
            part: "header",
            children: [
              /* @__PURE__ */ jsx(Presets, {
                app,
                id: "app",
                presets: presets.items,
                selectedPresetId
              }),
              /* @__PURE__ */ jsx(Vertical, {
                app,
                id: "app",
                height,
                fixed: true,
                minHeight: 45
              })
            ]
          }),
          /* @__PURE__ */ jsx("div", {
            part: "items",
            children: itemsView
          }),
          /* @__PURE__ */ jsx("div", {
            part: "add",
            children: /* @__PURE__ */ jsx(Button, {
              onClick: () => {
                const a = cheapRandomId();
                const b = cheapRandomId();
                const groupId = cheapRandomId();
                $4.machines = $4.machines.add({
                  ...defaultMachines.mono,
                  id: a,
                  groupId
                });
                $4.machines = $4.machines.add({
                  ...defaultMachines.scheduler,
                  id: b,
                  groupId,
                  outputs: [a]
                });
              },
              children: /* @__PURE__ */ jsx(IconSvg, {
                class: "small",
                set: "feather",
                icon: "plus-circle"
              })
            })
          })
        ]
      });
    });
  }
));

// web.tsx
if (false)
  enableDebug(5e3);
effect.maxUpdates = 1e5;
var css2 = `
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
`;
render(/* @__PURE__ */ jsxs(Fragment, {
  children: [
    /* @__PURE__ */ jsx("style", {
      children: css2
    }),
    /* @__PURE__ */ jsx(AppView, {})
  ]
}), document.body);
//!? 'apply attrs', attrs
//!? 'attach context to target', target
//!? 'change listener', key
//!? 'connected'
//!? 'context setter:', key, v
//!? 'context target isDifferent', isDifferent, key, prev, v
//!? 'context target setter:', key, v
//!? 'create accessor', key, prev, next
//!? 'create event listener', attr, value
//!? 'create function', attr, value
//!? 'creating accessors'
//!? 'disconnected, removing all attrs and props', cacheRef
//!? 'is different:', isDifferent, name, prev, next
//!? 'mounted', this
//!? 'new options', initialOptions, newOptions
//!? 'own observed attributes', ownObservedAttributes, superclass
//!? 'part', this, output
//!? 'propertyChangedCallback:', key, next
//!? 'removed attr', name
//!? 'removed event listener', name
//!? 'removed prop', name
//!? 'removing accessor', key, desc
//!? 'render', this, result
//!? 'sending'
//!? 'setting attr "%s"', k, v.toString()
//!? 'setting event target', key
//!? 'setting', attr, value
//!? 'type', key, type.toString()
//!? 'unmounted', this
//!? 'updated and returned previous wrapped'
//!? 'updated event listener', attr, prev, value
//!? 'updated fn'
//!? 'updated function', attr, prev, value
//!? 'updating fn'
//!? 'value', value
//!? 'valueCtor', valueCtor.name
//!? 'wrap called'
//!? 'written attr:', data[k]
//!? this.effects.get(key)
//!dir this
//!warn 'attributeChangedCallback:', name, newValue
//!warn 'cancel %s (-%s)', this.stack, state
//!warn 'pop %s (-%s)', this.stack, state
//!warn 'push %s', this.stack
//!warn 'setter changed', key, value
//!warn 'swap %s (!%s)', this.stack, prev
//!warn _error
//!warn error
