var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod3) => function __require() {
  return mod3 || (0, cb[__getOwnPropNames(cb)[0]])((mod3 = { exports: {} }).exports, mod3), mod3.exports;
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
var __reExport = (target, mod3, secondTarget) => (__copyProps(target, mod3, "default"), secondTarget && __copyProps(secondTarget, mod3, "default"));
var __toESM = (mod3, isNodeMode, target) => (target = mod3 != null ? __create(__getProtoOf(mod3)) : {}, __copyProps(
  isNodeMode || !mod3 || !mod3.__esModule ? __defProp(target, "default", { value: mod3, enumerable: true }) : target,
  mod3
));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

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

// ../../wat-compiler/dist/esm/index.js
var BYTE = {
  "type.i32": 127,
  "type.i64": 126,
  "type.f32": 125,
  "type.f64": 124,
  "type.void": 64,
  "type.func": 96,
  "type.funcref": 112,
  "section.custom": 0,
  "section.type": 1,
  "section.import": 2,
  "section.function": 3,
  "section.table": 4,
  "section.memory": 5,
  "section.global": 6,
  "section.export": 7,
  "section.start": 8,
  "section.element": 9,
  "section.code": 10,
  "section.data": 11,
  "import.func": 0,
  "import.table": 1,
  "import.memory": 2,
  "import.global": 3,
  "export.function": 0,
  "export.table": 1,
  "export.memory": 2,
  "export.global": 3,
  "global.const": 0,
  "global.var": 1,
  "global.mut": 1,
  "limits.min": 0,
  "limits.minmax": 1,
  "limits.shared": 3
};
var opCodes = [
  "unreachable",
  "nop",
  "block",
  "loop",
  "if",
  "else",
  ,
  ,
  ,
  ,
  ,
  "end",
  "br",
  "br_if",
  "br_table",
  "return",
  "call",
  "call_indirect",
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  "drop",
  "select",
  ,
  ,
  ,
  ,
  "local.get",
  "local.set",
  "local.tee",
  "global.get",
  "global.set",
  ,
  ,
  ,
  "i32.load",
  "i64.load",
  "f32.load",
  "f64.load",
  "i32.load8_s",
  "i32.load8_u",
  "i32.load16_s",
  "i32.load16_u",
  "i64.load8_s",
  "i64.load8_u",
  "i64.load16_s",
  "i64.load16_u",
  "i64.load32_s",
  "i64.load32_u",
  "i32.store",
  "i64.store",
  "f32.store",
  "f64.store",
  "i32.store8",
  "i32.store16",
  "i64.store8",
  "i64.store16",
  "i64.store32",
  "memory.size",
  "memory.grow",
  "i32.const",
  "i64.const",
  "f32.const",
  "f64.const",
  "i32.eqz",
  "i32.eq",
  "i32.ne",
  "i32.lt_s",
  "i32.lt_u",
  "i32.gt_s",
  "i32.gt_u",
  "i32.le_s",
  "i32.le_u",
  "i32.ge_s",
  "i32.ge_u",
  "i64.eqz",
  "i64.eq",
  "i64.ne",
  "i64.lt_s",
  "i64.lt_u",
  "i64.gt_s",
  "i64.gt_u",
  "i64.le_s",
  "i64.le_u",
  "i64.ge_s",
  "i64.ge_u",
  "f32.eq",
  "f32.ne",
  "f32.lt",
  "f32.gt",
  "f32.le",
  "f32.ge",
  "f64.eq",
  "f64.ne",
  "f64.lt",
  "f64.gt",
  "f64.le",
  "f64.ge",
  "i32.clz",
  "i32.ctz",
  "i32.popcnt",
  "i32.add",
  "i32.sub",
  "i32.mul",
  "i32.div_s",
  "i32.div_u",
  "i32.rem_s",
  "i32.rem_u",
  "i32.and",
  "i32.or",
  "i32.xor",
  "i32.shl",
  "i32.shr_s",
  "i32.shr_u",
  "i32.rotl",
  "i32.rotr",
  "i64.clz",
  "i64.ctz",
  "i64.popcnt",
  "i64.add",
  "i64.sub",
  "i64.mul",
  "i64.div_s",
  "i64.div_u",
  "i64.rem_s",
  "i64.rem_u",
  "i64.and",
  "i64.or",
  "i64.xor",
  "i64.shl",
  "i64.shr_s",
  "i64.shr_u",
  "i64.rotl",
  "i64.rotr",
  "f32.abs",
  "f32.neg",
  "f32.ceil",
  "f32.floor",
  "f32.trunc",
  "f32.nearest",
  "f32.sqrt",
  "f32.add",
  "f32.sub",
  "f32.mul",
  "f32.div",
  "f32.min",
  "f32.max",
  "f32.copysign",
  "f64.abs",
  "f64.neg",
  "f64.ceil",
  "f64.floor",
  "f64.trunc",
  "f64.nearest",
  "f64.sqrt",
  "f64.add",
  "f64.sub",
  "f64.mul",
  "f64.div",
  "f64.min",
  "f64.max",
  "f64.copysign",
  "i32.wrap_i64",
  "i32.trunc_f32_s",
  "i32.trunc_f32_u",
  "i32.trunc_f64_s",
  "i32.trunc_f64_u",
  "i64.extend_i32_s",
  "i64.extend_i32_u",
  "i64.trunc_f32_s",
  "i64.trunc_f32_u",
  "i64.trunc_f64_s",
  "i64.trunc_f64_u",
  "f32.convert_i32_s",
  "f32.convert_i32_u",
  "f32.convert_i64_s",
  "f32.convert_i64_u",
  "f32.demote_f64",
  "f64.convert_i32_s",
  "f64.convert_i32_u",
  "f64.convert_i64_s",
  "f64.convert_i64_u",
  "f64.promote_f32",
  "i32.reinterpret_f32",
  "i64.reinterpret_f64",
  "f32.reinterpret_i32",
  "f64.reinterpret_i64"
];
var alias = {
  "get_local": "local.get",
  "set_local": "local.set",
  "tee_local": "local.tee",
  "get_global": "global.get",
  "set_global": "global.set",
  "i32.trunc_s/f32": "i32.trunc_f32_s",
  "i32.trunc_u/f32": "i32.trunc_f32_u",
  "i32.trunc_s/f64": "i32.trunc_f64_s",
  "i32.trunc_u/f64": "i32.trunc_f64_u",
  "i64.extend_s/i32": "i64.extend_i32_s",
  "i64.extend_u/i32": "i64.extend_i32_u",
  "i64.trunc_s/f32": "i64.trunc_f32_s",
  "i64.trunc_u/f32": "i64.trunc_f32_u",
  "i64.trunc_s/f64": "i64.trunc_f64_s",
  "i64.trunc_u/f64": "i64.trunc_f64_u",
  "f32.convert_s/i32": "f32.convert_i32_s",
  "f32.convert_u/i32": "f32.convert_i32_u",
  "f32.convert_s/i64": "f32.convert_i64_s",
  "f32.convert_u/i64": "f32.convert_i64_u",
  "f32.demote/f64": "f32.demote_f64",
  "f64.convert_s/i32": "f64.convert_i32_s",
  "f64.convert_u/i32": "f64.convert_i32_u",
  "f64.convert_s/i64": "f64.convert_i64_s",
  "f64.convert_u/i64": "f64.convert_i64_u",
  "f64.promote/f32": "f64.promote_f32"
};
for (const [i, op] of opCodes.entries()) {
  if (op != null) {
    BYTE[op] = i;
  }
}
BYTE["i32.trunc_sat_f32_s"] = [252, 0];
BYTE["i32.trunc_sat_f32_u"] = [252, 1];
BYTE["i32.trunc_sat_f64_s"] = [252, 2];
BYTE["i32.trunc_sat_f64_u"] = [252, 3];
BYTE["i64.trunc_sat_f32_s"] = [252, 4];
BYTE["i64.trunc_sat_f32_u"] = [252, 5];
BYTE["i64.trunc_sat_f64_s"] = [252, 6];
BYTE["i64.trunc_sat_f64_u"] = [252, 7];
BYTE["memory.init"] = [252, 8];
BYTE["data.drop"] = [252, 9];
BYTE["memory.copy"] = [252, 10];
BYTE["memory.fill"] = [252, 11];
BYTE["table.init"] = [252, 12];
BYTE["elem.drop"] = [252, 13];
BYTE["table.copy"] = [252, 14];
BYTE["table.grow"] = [252, 15];
BYTE["table.size"] = [252, 16];
BYTE["table.fill"] = [252, 17];
for (const name in alias) {
  const i = opCodes.indexOf(alias[name]);
  BYTE[name] = i;
}
var INSTR = {};
for (const op in BYTE) {
  INSTR[op] = wrap_instr(op);
  const [group, method] = op.split(".");
  if (method != null) {
    BYTE[group] = BYTE[group] ?? {};
    BYTE[group][method] = BYTE[op];
    INSTR[group] = INSTR[group] ?? {};
    INSTR[group][method] = wrap_instr(op);
  }
}
var ALIGN = {
  "i32.load": 4,
  "i64.load": 8,
  "f32.load": 4,
  "f64.load": 8,
  "i32.load8_s": 1,
  "i32.load8_u": 1,
  "i32.load16_s": 2,
  "i32.load16_u": 2,
  "i64.load8_s": 1,
  "i64.load8_u": 1,
  "i64.load16_s": 2,
  "i64.load16_u": 2,
  "i64.load32_s": 4,
  "i64.load32_u": 4,
  "i32.store": 4,
  "i64.store": 8,
  "f32.store": 4,
  "f64.store": 8,
  "i32.store8": 1,
  "i32.store16": 2,
  "i64.store8": 1,
  "i64.store16": 2,
  "i64.store32": 4
};
function* bigint(n) {
  n = to_int64(n);
  while (true) {
    const byte = Number(n & 0x7Fn);
    n >>= 7n;
    if (n === 0n && (byte & 64) === 0 || n === -1n && (byte & 64) !== 0) {
      yield byte;
      break;
    }
    yield byte | 128;
  }
}
function* int(value) {
  let byte = 0;
  const size = Math.ceil(Math.log2(Math.abs(value)));
  const negative = value < 0;
  let more = true;
  while (more) {
    byte = value & 127;
    value = value >> 7;
    if (negative) {
      value = value | -(1 << size - 7);
    }
    if (value == 0 && (byte & 64) == 0 || value == -1 && (byte & 64) == 64) {
      more = false;
    } else {
      byte = byte | 128;
    }
    yield byte;
  }
}
function* uint(value, pad = 0) {
  if (value < 0)
    throw new TypeError("uint value must be positive, received: " + value);
  let byte = 0;
  do {
    byte = value & 127;
    value = value >> 7;
    if (value != 0 || pad > 0) {
      byte = byte | 128;
    }
    yield byte;
    pad--;
  } while (value != 0 || pad > -1);
}
var byteView = new DataView(new BigInt64Array(1).buffer);
function to_int64(value) {
  byteView.setBigInt64(0, value);
  return byteView.getBigInt64(0);
}
function* f32(value) {
  byteView.setFloat32(0, value);
  for (let i = 4; i--; )
    yield byteView.getUint8(i);
}
function* f64(value) {
  byteView.setFloat64(0, value);
  for (let i = 8; i--; )
    yield byteView.getUint8(i);
}
function hex2float(input) {
  input = input.toUpperCase();
  const splitIndex = input.indexOf("P");
  let mantissa, exponent;
  if (splitIndex !== -1) {
    mantissa = input.substring(0, splitIndex);
    exponent = parseInt(input.substring(splitIndex + 1));
  } else {
    mantissa = input;
    exponent = 0;
  }
  const dotIndex = mantissa.indexOf(".");
  if (dotIndex !== -1) {
    let integerPart = parseInt(mantissa.substring(0, dotIndex), 16);
    const sign = Math.sign(integerPart);
    integerPart = sign * integerPart;
    const fractionLength = mantissa.length - dotIndex - 1;
    const fractionalPart = parseInt(mantissa.substring(dotIndex + 1), 16);
    const fraction = fractionLength > 0 ? fractionalPart / Math.pow(16, fractionLength) : 0;
    if (sign === 0) {
      if (fraction === 0) {
        mantissa = sign;
      } else {
        if (Object.is(sign, -0)) {
          mantissa = -fraction;
        } else {
          mantissa = fraction;
        }
      }
    } else {
      mantissa = sign * (integerPart + fraction);
    }
  } else {
    mantissa = parseInt(mantissa, 16);
  }
  return mantissa * (splitIndex !== -1 ? Math.pow(2, exponent) : 1);
}
var F32_SIGN = 2147483648;
var F32_NAN = 2139095040;
function* nanbox32(input) {
  let value = parseInt(input.split("nan:")[1]);
  value |= F32_NAN;
  if (input[0] === "-")
    value |= F32_SIGN;
  byteView.setInt32(0, value);
  for (let i = 4; i--; )
    yield byteView.getUint8(i);
}
var F64_SIGN = 0x8000000000000000n;
var F64_NAN = 0x7ff0000000000000n;
function* nanbox64(input) {
  let value = BigInt(input.split("nan:")[1]);
  value |= F64_NAN;
  if (input[0] === "-")
    value |= F64_SIGN;
  byteView.setBigInt64(0, value);
  for (let i = 8; i--; )
    yield byteView.getUint8(i);
}
(function(l) {
  function m() {
  }
  function k(a, c) {
    a = void 0 === a ? "utf-8" : a;
    c = void 0 === c ? { fatal: false } : c;
    if (-1 === r.indexOf(a.toLowerCase()))
      throw new RangeError("Failed to construct 'TextDecoder': The encoding label provided ('" + a + "') is invalid.");
    if (c.fatal)
      throw Error("Failed to construct 'TextDecoder': the 'fatal' option is unsupported.");
  }
  function t(a) {
    return Buffer.from(a.buffer, a.byteOffset, a.byteLength).toString("utf-8");
  }
  function u(a) {
    var c = URL.createObjectURL(new Blob([a], { type: "text/plain;charset=UTF-8" }));
    try {
      var f = new XMLHttpRequest();
      f.open("GET", c, false);
      f.send();
      return f.responseText;
    } catch (e) {
      return q(a);
    } finally {
      URL.revokeObjectURL(c);
    }
  }
  function q(a) {
    for (var c = 0, f = Math.min(65536, a.length + 1), e = new Uint16Array(f), h = [], d = 0; ; ) {
      var b = c < a.length;
      if (!b || d >= f - 1) {
        h.push(String.fromCharCode.apply(null, e.subarray(0, d)));
        if (!b)
          return h.join("");
        a = a.subarray(c);
        d = c = 0;
      }
      b = a[c++];
      if (0 === (b & 128))
        e[d++] = b;
      else if (192 === (b & 224)) {
        var g = a[c++] & 63;
        e[d++] = (b & 31) << 6 | g;
      } else if (224 === (b & 240)) {
        g = a[c++] & 63;
        var n = a[c++] & 63;
        e[d++] = (b & 31) << 12 | g << 6 | n;
      } else if (240 === (b & 248)) {
        g = a[c++] & 63;
        n = a[c++] & 63;
        var v = a[c++] & 63;
        b = (b & 7) << 18 | g << 12 | n << 6 | v;
        65535 < b && (b -= 65536, e[d++] = b >>> 10 & 1023 | 55296, b = 56320 | b & 1023);
        e[d++] = b;
      }
    }
  }
  if (l.TextEncoder && l.TextDecoder)
    return false;
  var r = ["utf-8", "utf8", "unicode-1-1-utf-8"];
  Object.defineProperty(m.prototype, "encoding", { value: "utf-8" });
  m.prototype.encode = function(a, c) {
    c = void 0 === c ? { stream: false } : c;
    if (c.stream)
      throw Error("Failed to encode: the 'stream' option is unsupported.");
    c = 0;
    for (var f = a.length, e = 0, h = Math.max(
      32,
      f + (f >>> 1) + 7
    ), d = new Uint8Array(h >>> 3 << 3); c < f; ) {
      var b = a.charCodeAt(c++);
      if (55296 <= b && 56319 >= b) {
        if (c < f) {
          var g = a.charCodeAt(c);
          56320 === (g & 64512) && (++c, b = ((b & 1023) << 10) + (g & 1023) + 65536);
        }
        if (55296 <= b && 56319 >= b)
          continue;
      }
      e + 4 > d.length && (h += 8, h *= 1 + c / a.length * 2, h = h >>> 3 << 3, g = new Uint8Array(h), g.set(d), d = g);
      if (0 === (b & 4294967168))
        d[e++] = b;
      else {
        if (0 === (b & 4294965248))
          d[e++] = b >>> 6 & 31 | 192;
        else if (0 === (b & 4294901760))
          d[e++] = b >>> 12 & 15 | 224, d[e++] = b >>> 6 & 63 | 128;
        else if (0 === (b & 4292870144))
          d[e++] = b >>> 18 & 7 | 240, d[e++] = b >>> 12 & 63 | 128, d[e++] = b >>> 6 & 63 | 128;
        else
          continue;
        d[e++] = b & 63 | 128;
      }
    }
    return d.slice ? d.slice(0, e) : d.subarray(0, e);
  };
  Object.defineProperty(k.prototype, "encoding", { value: "utf-8" });
  Object.defineProperty(k.prototype, "fatal", { value: false });
  Object.defineProperty(k.prototype, "ignoreBOM", { value: false });
  var p = q;
  "function" === typeof Buffer && Buffer.from ? p = t : "function" === typeof Blob && "function" === typeof URL && "function" === typeof URL.createObjectURL && (p = u);
  k.prototype.decode = function(a, c) {
    c = void 0 === c ? { stream: false } : c;
    if (c.stream)
      throw Error("Failed to decode: the 'stream' option is unsupported.");
    a = a instanceof Uint8Array ? a : a.buffer instanceof ArrayBuffer ? new Uint8Array(a.buffer) : new Uint8Array(a);
    return p(a);
  };
  l.TextEncoder = m;
  l.TextDecoder = k;
})("undefined" !== typeof window ? window : "undefined" !== typeof global ? global : globalThis);
function wrap_instr(code) {
  return function(args, exprs) {
    return instr(
      code,
      args != null && !Array.isArray(args) ? [args] : args,
      exprs != null && !Array.isArray(exprs) ? [exprs] : exprs
    );
  };
}
var encoding = {
  "f64.const": f64,
  "f32.const": f32
};
function* instr(code, args = [], exprs = []) {
  for (let expr of exprs) {
    switch (typeof expr) {
      case "number":
        yield expr;
        break;
      default:
        yield* expr;
        break;
    }
  }
  yield* Array.isArray(BYTE[code]) ? BYTE[code] : [BYTE[code]];
  for (let arg of args) {
    switch (typeof arg) {
      case "bigint":
        yield* bigint(arg);
        break;
      case "number":
        yield* (encoding[code] ?? int)(arg);
        break;
      default:
        yield* arg;
    }
  }
}
var encoder = new TextEncoder("utf-8");
function utf8(s) {
  return [...encoder.encode(s)];
}
function header() {
  return [...utf8("\0asm"), 1, 0, 0, 0];
}
function section(type, data) {
  return [BYTE.section[type], ...uint(data.length), ...data];
}
function vector(items) {
  return [...uint(items.length), ...items.flat()];
}
function locals(items) {
  const out = [];
  let curr = [];
  let prev;
  for (const type of items) {
    if (type !== prev && curr.length) {
      out.push([...uint(curr.length), BYTE.type[curr[0]]]);
      curr = [];
    }
    curr.push(type);
    prev = type;
  }
  if (curr.length)
    out.push([...uint(curr.length), BYTE.type[curr[0]]]);
  return out;
}
function limits(min, max, shared) {
  if (shared != null) {
    return [BYTE.limits.shared, ...uint(min), ...uint(max)];
  } else if (max != null) {
    return [BYTE.limits.minmax, ...uint(min), ...uint(max)];
  } else {
    return [BYTE.limits.min, ...uint(min)];
  }
}
section.type = function(types) {
  return section(
    "type",
    vector(types.map(([params, results]) => [
      BYTE.type.func,
      ...vector(params.map((x) => BYTE.type[x])),
      ...vector(results.map((x) => BYTE.type[x]))
    ]))
  );
};
section.import = function(imported) {
  return section(
    "import",
    vector(imported.map(([mod3, field, type, desc]) => [
      ...vector(utf8(mod3)),
      ...vector(utf8(field)),
      BYTE.import[type],
      ...{
        "func": () => desc.map((idx) => [...uint(idx)]),
        "memory": () => limits(...desc)
      }[type]()
    ]))
  );
};
section.function = function(funcs) {
  return section(
    "function",
    vector(funcs.map(
      (func) => [...uint(func)]
    ))
  );
};
section.table = function(tables) {
  return section(
    "table",
    vector(tables.map(
      ([type, min, max]) => [BYTE.type[type], ...limits(min, max)]
    ))
  );
};
section.memory = function(memories) {
  return section(
    "memory",
    vector(memories.map(
      ([min, max]) => limits(min, max)
    ))
  );
};
section.global = function(globals) {
  return section(
    "global",
    vector(globals.map(
      ([mut, valtype, expr]) => [BYTE.type[valtype], BYTE.global[mut], ...expr, BYTE.end]
    ))
  );
};
section.export = function(exports) {
  return section(
    "export",
    vector(exports.map(
      ([name, type, idx]) => [...vector(utf8(name)), BYTE.export[type], ...uint(idx)]
    ))
  );
};
section.start = function(func_idx) {
  return section("start", [...uint(func_idx)]);
};
section.element = function(elements) {
  return section(
    "element",
    vector(elements.map(
      ([table_idx, offset_idx_expr, funcs]) => [...uint(table_idx), ...offset_idx_expr, BYTE.end, ...vector(funcs)]
    ))
  );
};
section.code = function(funcs) {
  return section(
    "code",
    vector(funcs.map(
      ([func_locals, func_body]) => vector([...vector(locals(func_locals)), ...func_body, BYTE.end])
    ))
  );
};
section.data = function(data) {
  return section(
    "data",
    vector(data.map(
      ([mem_idx, offset_idx_expr, bytes]) => [...uint(mem_idx), ...offset_idx_expr, BYTE.end, ...vector(bytes)]
    ))
  );
};
var ByteArray = class extends Array {
  log = [];
  write(array, annotation) {
    this.log.push(array, annotation);
    this.push(...array);
    return this;
  }
  get buffer() {
    return new Uint8Array(this);
  }
};
var ModuleBuilder = class {
  types = [];
  imports = [];
  tables = [];
  memories = [];
  globals = [];
  exports = [];
  starts = "";
  elements = [];
  codes = [];
  datas = [];
  constructor(data) {
    if (data)
      Object.assign(this, data);
  }
  get funcs() {
    return this.codes.filter((func) => !func.imported);
  }
  ensureType(params, results) {
    const type_sig = [params.join(" "), results.join(" ")].join();
    const idx = this.types.indexOf(type_sig);
    if (idx >= 0)
      return idx;
    return this.types.push(type_sig) - 1;
  }
  getGlobalIndexOf(name) {
    return this.globals.find((glob) => glob.name === name).idx;
  }
  getFunc(name) {
    return this.codes.find((func) => func.name === name);
  }
  getMemory(name) {
    return this.memories.find((mem) => mem.name === name);
  }
  getType(name) {
    return this.types[name];
  }
  type(name, params, results) {
    this.types[name] = this.ensureType(params, results);
    return this;
  }
  import(type, name, mod3, field, params, results) {
    if (type === "func") {
      const func = this._func(name, params, results, [], [], false, true);
      this.imports.push({ mod: mod3, field, type, desc: [func.type_idx] });
    } else if (type === "memory") {
      this.imports.push({ mod: mod3, field, type, desc: params });
    }
    return this;
  }
  table(type, min, max) {
    this.tables.push({ type, min, max });
    return this;
  }
  memory(name, min, max) {
    this.memories.push({ name, min, max });
    return this;
  }
  global(name, mut, valtype, expr) {
    const global_idx = this.globals.length;
    this.globals.push({ idx: global_idx, name, valtype, mut, expr });
    return this;
  }
  export(type, name, export_name) {
    this.exports.push({ type, name, export_name });
    return this;
  }
  start(name) {
    this.starts = name;
    return this;
  }
  elem(offset_idx_expr, codes) {
    this.elements.push({ offset_idx_expr, codes });
    return this;
  }
  _func(name, params = [], results = [], locals2 = [], body = [], exported = false, imported = false) {
    const type_idx = this.ensureType(params, results);
    const func_idx = this.codes.length;
    const func = { idx: func_idx, name, type_idx, locals: locals2, body, imported };
    this.codes.push(func);
    if (exported) {
      this.export("func", name, name);
    }
    return func;
  }
  func(...args) {
    this._func(...args);
    return this;
  }
  data(offset_idx_expr, bytes) {
    this.datas.push({ offset_idx_expr, bytes });
    return this;
  }
  build({ metrics = true } = {}) {
    const bytes = new ByteArray();
    bytes.write(header());
    if (this.types.length) {
      bytes.write(section.type(
        this.types.map(
          (type) => type.split(",").map((x) => x.split(" ").filter(Boolean))
        )
      ));
    }
    if (this.imports.length) {
      bytes.write(section.import(
        this.imports.map(
          (imp) => [imp.mod, imp.field, imp.type, imp.desc]
        )
      ));
    }
    if (this.funcs.length) {
      bytes.write(section.function(
        this.funcs.map(
          (func) => func.type_idx
        )
      ));
    }
    if (this.elements.length) {
      bytes.write(section.table(
        this.tables.map(
          (table) => [table.type, table.min, table.max]
        )
      ));
    }
    if (this.memories.length) {
      bytes.write(section.memory(
        this.memories.map(
          (mem) => [mem.min, mem.max]
        )
      ));
    }
    if (this.globals.length) {
      bytes.write(section.global(
        this.globals.map(
          (glob) => [glob.mut, glob.valtype, glob.expr]
        )
      ));
    }
    if (this.exports.length) {
      bytes.write(section.export(
        this.exports.map(
          (exp) => exp.type === "func" ? [exp.export_name, exp.type, this.getFunc(exp.name).idx] : exp.type === "memory" ? [exp.export_name, exp.type, this.getMemory(exp.name).idx] : exp.type === "global" ? [exp.export_name, exp.type, this.getGlobalIndexOf(exp.name)] : []
        )
      ));
    }
    if (this.starts.length) {
      bytes.write(section.start(
        this.getFunc(this.starts).idx
      ));
    }
    if (this.elements.length) {
      bytes.write(section.element(
        this.elements.map((elem) => [
          0,
          elem.offset_idx_expr,
          elem.codes.map((name) => this.getFunc(name).idx)
        ])
      ));
    }
    if (this.funcs.length) {
      bytes.write(section.code(
        this.funcs.map(
          (func) => [func.locals, func.body]
        )
      ));
    }
    if (this.datas.length) {
      bytes.write(section.data(
        this.datas.map((data) => [
          0,
          data.offset_idx_expr,
          data.bytes
        ])
      ));
    }
    return bytes;
  }
};
var GlobalContext = class {
  globals = [];
  types = [];
  funcs = [];
  constructor(data) {
    if (data) {
      Object.assign(this, data);
      this.funcs.forEach(function createFunctionContext(x) {
        x.context = new FunctionContext(this, x.context);
      });
    }
  }
  lookup(name, instr2) {
    let index;
    switch (instr2) {
      case "call":
        {
          index = this.funcs.map((x) => x.name).lastIndexOf(name);
        }
        break;
      case "type":
        {
          index = this.types.map((x) => x.name).lastIndexOf(name);
        }
        break;
      default: {
        index = this.globals.map((x) => x.name).lastIndexOf(name);
      }
    }
    if (!~index)
      throw new ReferenceError(`lookup failed at: ${instr2} "${name}"`);
    return uint(index);
  }
};
var FunctionContext = class {
  #global = null;
  locals = [];
  depth = [];
  constructor(global2, data) {
    this.#global = global2;
    if (data)
      Object.assign(this, data);
  }
  lookup(name, instr2) {
    let index;
    switch (instr2) {
      case "br":
      case "br_table":
      case "br_if":
        {
          index = this.depth.lastIndexOf(name);
          if (~index)
            index = this.depth.length - 1 - index;
        }
        break;
      default: {
        index = this.locals.lastIndexOf(name);
      }
    }
    if (!~index)
      return this.#global.lookup(name, instr2);
    return uint(index);
  }
};
function compile(node, moduleData, globalData) {
  const m = new ModuleBuilder(moduleData);
  const g = new GlobalContext(globalData);
  const deferred = [];
  function cast(param, context2 = g, instr2 = "i32") {
    switch (param.kind) {
      case "number": {
        if (param.value === "inf" || param.value === "+inf") {
          return Infinity;
        } else if (param.value === "-inf") {
          return -Infinity;
        } else if (param.value === "nan" || param.value === "+nan") {
          return NaN;
        } else if (param.value === "-nan") {
          return NaN;
        } else if (instr2?.[0] === "f") {
          return parseFloat(param.value);
        }
      }
      case "hex": {
        let value;
        if (instr2.indexOf("i64") === 0) {
          if (param.value[0] === "-") {
            value = -BigInt(param.value.slice(1));
          } else {
            value = BigInt(param.value);
          }
          return value;
        } else if (instr2[0] === "f") {
          if (param.value.indexOf("nan") >= 0) {
            if (instr2.indexOf("f32") === 0) {
              value = nanbox32(param.value);
            } else {
              value = nanbox64(param.value);
            }
          } else {
            value = hex2float(param.value);
          }
          return value;
        } else {
          return parseInt(param.value);
        }
      }
      case "label":
        return context2.lookup(param.value, instr2);
      default:
        return param.value;
    }
  }
  function bytes(instr2, args, expr) {
    if (!(instr2 in INSTR) || typeof INSTR[instr2] !== "function") {
      throw new Error("Unknown instruction: " + instr2);
    }
    return [...INSTR[instr2](args, expr)];
  }
  function evaluate(node2, context2 = g) {
    const address = { offset: 0, align: 0 };
    const instr2 = node2.instr.value;
    switch (instr2) {
      case "type": {
        return m.getType(node2.name.value);
      }
      case "call_indirect": {
        const args = [evaluate(node2.children.shift(), context2), 0];
        const expr = node2.children.flatMap(function evaluateExpr(x) {
          return evaluate(x, context2);
        });
        return bytes(instr2, args, expr);
      }
      case "memory.grow": {
        const args = [0];
        const expr = node2.children.flatMap(function evaluateMemory(x) {
          return evaluate(x, context2);
        });
        return bytes(instr2, args, expr);
      }
      case "i32.load":
      case "i64.load":
      case "f32.load":
      case "f64.load":
      case "i32.load8_s":
      case "i32.load8_u":
      case "i32.load16_s":
      case "i32.load16_u":
      case "i64.load8_s":
      case "i64.load8_u":
      case "i64.load16_s":
      case "i64.load16_u":
      case "i64.load32_s":
      case "i64.load32_u":
      case "i32.store":
      case "i64.store":
      case "f32.store":
      case "f64.store":
      case "i32.store8":
      case "i32.store16":
      case "i64.store8":
      case "i64.store16":
      case "i64.store32": {
        address.align = ALIGN[instr2];
        for (const p of node2.params) {
          address[p.param.value] = cast(p.value);
        }
        const args = [Math.log2(address.align), address.offset].map((x) => {
          if (typeof x === "number")
            return uint(x);
          else if (typeof x === "bigint")
            return bigint(x);
        });
        const expr = node2.children.flatMap(function evaluateLoadStoreExpr(x) {
          return evaluate(x, context2);
        });
        return bytes(instr2, args, expr);
      }
      case "func": {
        const func = {
          name: node2.name?.value ?? g.funcs.length,
          params: [],
          results: []
        };
        g.funcs.push(func);
        for (const c of node2.children) {
          switch (c.instr.value) {
            case "param":
              {
                func.params.push(...c.children.map((x) => x.instr.value));
              }
              break;
            case "result": {
              func.results.push(...c.children.map((x) => x.instr.value));
            }
            case "type":
              break;
          }
        }
        return [func.name, func.params, func.results];
      }
      case "result": {
        return node2.children.flatMap(function evaluateResult(x) {
          return INSTR.type[x.instr.value]();
        });
      }
      case "else":
      case "then": {
        return node2.children.flatMap(function evaluateElseThen(x) {
          return evaluate(x, context2);
        });
      }
      case "if": {
        const name = node2.name?.value ?? context2.depth.length;
        const results = [];
        const branches = [];
        let cond, thenbody;
        context2.depth.push(name);
        for (const c of node2.children) {
          switch (c.instr.value) {
            case "result":
              {
                results.push(evaluate(c, context2));
              }
              break;
            case "else":
              branches.push(...INSTR.else());
            case "then":
              {
                thenbody = evaluate(c, context2);
                branches.push(thenbody);
              }
              break;
            default: {
              if (cond) {
                if (thenbody) {
                  branches.push(...INSTR.else());
                  branches.push(evaluate(c, context2));
                } else {
                  thenbody = evaluate(c, context2);
                  branches.push(thenbody);
                }
              } else {
                cond = evaluate(c, context2);
              }
            }
          }
        }
        context2.depth.pop();
        if (!results.length) {
          results.push(INSTR.type.void());
        }
        return [
          ...INSTR.if(results.flat(), cond),
          ...branches.flat(),
          ...INSTR.end()
        ];
      }
      case "loop":
      case "block": {
        const name = node2.name?.value ?? context2.depth.length;
        const results = [];
        const body = [];
        context2.depth.push(name);
        for (const c of node2.children) {
          switch (c.instr.value) {
            case "result":
              {
                results.push(evaluate(c, context2));
              }
              break;
            default: {
              body.push(evaluate(c, context2));
            }
          }
        }
        context2.depth.pop();
        if (!results.length) {
          results.push(INSTR.type.void());
        }
        return [
          ...INSTR[instr2](),
          ...results.flat().map(function layoutResults(x) {
            return [...x];
          }),
          ...body.flat(),
          ...INSTR.end()
        ];
      }
      case "br_table": {
        if (node2.name) {
          node2.params.unshift({
            param: {
              value: context2.lookup(node2.name.value, instr2)
            }
          });
        }
        const args = node2.params.map((x) => cast(x.param, context2, instr2));
        const expr = node2.children.flatMap(function evaluateBrTable(x) {
          return evaluate(x, context2);
        });
        return bytes(instr2, [args.length - 1, ...args], expr);
      }
      default: {
        if (node2.name) {
          node2.params.unshift({
            param: {
              value: (instr2.startsWith("global") ? g : context2).lookup(node2.name.value, instr2)
            }
          });
        }
        const args = node2.params.map((x) => cast(x.param, context2, instr2));
        const expr = node2.children.flatMap(function evaluateNode(x) {
          return evaluate(x, context2);
        });
        return bytes(instr2, args, expr);
      }
    }
  }
  function build(node2) {
    switch (node2.instr.value) {
      case "module":
        {
          node2.children.forEach(function buildModule(x) {
            build(x);
          });
        }
        break;
      case "memory":
        {
          const name = node2.name?.value ?? m.memories.length;
          const args = node2.params.map((x) => cast(x.param)).flat();
          if (node2.children?.[0]?.instr.value === "export") {
            const export_name = node2.children[0].params[0].param.value;
            const internal_name = node2.children[0].name?.value ?? name ?? 0;
            m.export("memory", internal_name, export_name);
          }
          m.memory(name, ...args);
        }
        break;
      case "data":
        {
          const expr = node2.children.shift();
          const data = node2.children.shift().data;
          m.data(evaluate(expr), data);
        }
        break;
      case "start":
        {
          m.start(node2.name.value);
        }
        break;
      case "table":
        {
          const args = node2.params.map((x) => cast(x.param));
          args.unshift(args.pop());
          m.table(...args);
        }
        break;
      case "elem":
        {
          const expr = node2.children.shift();
          const refs = node2.children.map((x) => x.ref.value);
          m.elem(evaluate(expr), refs);
        }
        break;
      case "import":
        {
          if (node2.children[0].instr.value === "func") {
            const args = node2.params.map((x) => cast(x.param));
            let params_results = evaluate(node2.children[0]);
            const name = params_results.shift();
            if (node2.children?.[0]?.children?.[0]?.instr.value === "type") {
              const typeName = node2.children?.[0]?.children?.[0]?.name.value;
              const typeIdx = m.getType(typeName);
              const type = m.types[typeIdx];
              params_results = type.split(",").map((x) => x.split(" "));
            }
            m.import("func", name, ...args, ...params_results);
          } else if (node2.children[0].instr.value === "memory") {
            const memory2 = node2.children[0];
            const args = node2.params.map((x) => cast(x.param));
            const name = memory2.instr.name;
            const desc = memory2.params.map((x) => cast(x.param));
            m.import("memory", name, ...args, desc);
          }
        }
        break;
      case "global":
        {
          const glob = {
            name: node2.name?.value ?? m.globals.length,
            vartype: "const",
            type: node2.children[0].instr.value
          };
          g.globals.push(glob);
          if (glob.type === "export") {
            const export_name = node2.children.shift().params[0].param.value;
            m.export("global", glob.name, export_name);
            glob.type = node2.children[0].instr.value;
          }
          if (glob.type === "mut") {
            glob.vartype = "var";
            glob.type = node2.children[0].children[0].instr.value;
          }
          const expr = node2.children[1];
          m.global(
            glob.name,
            glob.vartype,
            glob.type,
            evaluate(expr)
          );
        }
        break;
      case "type":
        {
          const type = {
            name: node2.name?.value ?? m.types.length,
            params: [],
            results: []
          };
          g.types.push(type);
          for (const c of node2.children[0].children) {
            switch (c.instr.value) {
              case "param":
                {
                  type.params.push(...c.children.map((x) => x.instr.value));
                }
                break;
              case "result":
                {
                  type.results.push(...c.children.map((x) => x.instr.value));
                }
                break;
            }
          }
          m.type(
            type.name,
            type.params,
            type.results
          );
        }
        break;
      case "export":
        {
          const exp = {
            name: node2.params[0].param.value
          };
          exp.type = node2.children[0].instr.value;
          exp.internal_name = node2.children[0].name.value;
          m.export(
            exp.type,
            exp.internal_name,
            exp.name
          );
        }
        break;
      case "func":
        {
          const func = {
            name: node2.name?.value ?? g.funcs.length,
            context: new FunctionContext(g),
            params: [],
            results: [],
            locals: [],
            body: []
          };
          g.funcs.push(func);
          for (const c of node2.children) {
            switch (c.instr.value) {
              case "export":
                {
                  const export_name = c.params[0].param.value;
                  m.export("func", func.name, export_name);
                }
                break;
              case "local":
                {
                  func.locals.push(...c.children.map((x) => x.instr.value));
                  func.context.locals.push(...c.children.map(() => c.name?.value));
                }
                break;
              case "param":
                {
                  func.params.push(...c.children.map((x) => x.instr.value));
                  func.context.locals.push(...c.children.map(() => c.name?.value));
                }
                break;
              case "result":
                {
                  func.results.push(...c.children.map((x) => x.instr.value));
                }
                break;
              case "type":
                break;
              default: {
                func.body.push(c);
              }
            }
          }
          deferred.push(function deferredFunc() {
            m.func(
              func.name,
              func.params,
              func.results,
              func.locals,
              [...func.body.flatMap(function evaluateFuncBody(x) {
                return evaluate(x, func.context);
              })]
            );
          });
        }
        break;
    }
  }
  build(node);
  deferred.forEach(function buildFunc(fn) {
    fn();
  });
  return { module: m, global: g };
}
var regexp = new RegExp([
  /(?<comment>;;.*|\(;[^]*?;\))/,
  /"(?<string>(?:\\"|[^"])*?)"/,
  /(?<param>offset|align|shared|funcref)=?/,
  /(?<hex>([+-]?nan:)?[+-]?0x[0-9a-f.p+-_]+)/,
  /(?<number>[+-]?inf|[+-]?nan|[+-]?\d[\d.e_+-]*)/,
  /(?<instr>[a-z][a-z0-9!#$%&'*+\-./:<=>?@\\^_`|~]+)/,
  /\$(?<label>[a-z0-9!#$%&'*+\-./:<=>?@\\^_`|~]+)/,
  /(?<lparen>\()|(?<rparen>\))|(?<nul>[ \t\n]+)|(?<error>.)/
].map((x) => x.toString().slice(1, -1)).join("|"), "gi");
function tokenize(input) {
  let last = {};
  let curr = {};
  const matches = input.matchAll(regexp);
  function next() {
    const match = matches.next();
    if (match.done)
      return { value: { value: null, kind: "eof", index: input.length }, done: true };
    const [kind, value] = Object.entries(match.value.groups).filter((e) => e[1] != null)[0];
    return { value: { value, kind, index: match.value.index }, done: false };
  }
  function advance() {
    last = curr;
    do {
      curr = next().value;
    } while (curr.kind === "nul" || curr.kind === "comment");
    return last;
  }
  function peek(kind, value) {
    if (kind != null) {
      if (value != null) {
        return value === curr.value;
      } else {
        return kind === curr.kind;
      }
    }
    return curr;
  }
  function accept(kind, value) {
    if (kind === curr.kind) {
      if (value != null) {
        if (value === curr.value) {
          return advance();
        }
      } else {
        return advance();
      }
    }
    return null;
  }
  function expect(kind, value) {
    const token = accept(kind, value);
    if (!token) {
      throw new SyntaxError(
        "Unexpected token: " + curr.value + "\n        expected: " + kind + (value ? ' "' + value + '"' : "") + "\n    but received: " + curr.kind + "\n     at position: " + curr.index
      );
    }
    return token;
  }
  const iterator = {
    [Symbol.iterator]() {
      return this;
    },
    next,
    advance,
    peek,
    accept,
    expect,
    start: advance
  };
  return iterator;
}
function parse({ start, peek, accept, expect }) {
  const encoder2 = new TextEncoder("utf-8");
  const HEX = /[0-9a-f]/i;
  const stringchar = {
    t: 9,
    n: 10,
    r: 13,
    '"': 34,
    "'": 39,
    "\\": 92
  };
  function parseDataString() {
    const parsed = [];
    while (1) {
      const str = accept("string");
      if (!str)
        break;
      for (let i = 0, ch, next; i < str.value.length; i++) {
        ch = str.value[i];
        if (ch === "\\") {
          next = str.value[i + 1];
          if (next in stringchar) {
            parsed.push(stringchar[next]);
            i++;
            continue;
          } else if (HEX.test(next)) {
            if (HEX.test(str.value[i + 2])) {
              parsed.push(parseInt(`${next}${str.value[i += 2]}`, 16));
            } else {
              parsed.push(parseInt(next, 16));
              i++;
            }
            continue;
          }
        }
        parsed.push(encoder2.encode(ch));
      }
    }
    return parsed;
  }
  function* params() {
    let param;
    while (1) {
      if (param = accept("number")) {
        param.value = param.value.replace(/_/g, "");
        yield { param };
        continue;
      }
      if (param = accept("hex")) {
        param.value = param.value.replace(/_/g, "");
        yield { param };
        continue;
      }
      if (param = accept("string")) {
        yield { param };
        continue;
      }
      if (param = accept("label")) {
        yield { param };
        continue;
      }
      if (param = accept("param")) {
        let value;
        if (value = accept("number")) {
          yield { param, value };
          continue;
        }
        if (value = accept("hex")) {
          yield { param, value };
          continue;
        } else {
          yield { param };
          continue;
        }
      }
      break;
    }
  }
  function expr() {
    const ref = accept("label");
    if (ref)
      return { ref };
    if (peek("string")) {
      return { data: parseDataString() };
    }
    const sexpr2 = accept("lparen");
    let instr2;
    if (sexpr2) {
      instr2 = expect("instr");
    } else {
      instr2 = accept("instr");
      if (!instr2)
        return;
    }
    const node = {
      instr: instr2,
      name: accept("label"),
      params: [...params()],
      children: []
    };
    if (sexpr2) {
      let child;
      while (!peek("eof") && (child = expr())) {
        node.children.push(child);
      }
      node.params.push(...params());
      expect("rparen");
    } else if (instr2.value === "block" || instr2.value === "loop") {
      let child;
      while (!peek("eof") && !peek("instr", "end") && (child = expr())) {
        node.children.push(child);
      }
      expect("instr", "end");
    }
    return node;
  }
  start();
  return expr();
}
function make(code, options, context2 = {}) {
  return compile(parse(tokenize("(module " + code + ")")), context2.module, context2.global).module.build(options).buffer;
}

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
  pick: () => pick,
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
  pick: () => pick,
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

// ../../pick-omit/dist/esm/pick-omit.js
var filter = (obj, fn) => Object.fromEntries(Object.entries(obj).filter(fn));
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

// ../../everyday-utils/dist/esm/everyday-utils.js
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
var pick = (obj, props) => props.reduce((p, n) => {
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
var accessors = (target, source2, fn, filter3 = () => true) => {
  const prevDesc = /* @__PURE__ */ new Map();
  Object.defineProperties(target, Object.fromEntries(entries(source2).filter(([key]) => typeof key === "string").filter(([key, value]) => filter3(key, value)).map(([key, value]) => {
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

// ../../json-objectify/dist/esm/json-objectify.js
var createContext = (asIsCtors = []) => {
  const asIs = new Set(asIsCtors);
  const objectify2 = (value, replacer2, top = true) => {
    if (value === null)
      return value;
    if (typeof value === "object" && !asIs.has(value.constructor)) {
      if (top) {
        value = replacer2.call({
          "": value
        }, "", value);
      }
      value = Object.entries(value).reduce((p, [k, v]) => {
        p[k] = v === null ? v : objectify2(replacer2.call(value, k, v), replacer2, false);
        return p;
      }, Array.isArray(value) ? [] : {});
      return value;
    }
    return value;
  };
  const objectifyAsync2 = async (value, replacer2, top = true) => {
    if (value === null)
      return value;
    if (typeof value === "object" && !asIs.has(value.constructor)) {
      if (top) {
        value = replacer2.call({
          "": value
        }, "", value);
      }
      value = await asyncSerialReduce(Object.entries(value), async (p, [k, v]) => {
        p[k] = v === null ? v : await new Promise((resolve) => {
          setTimeout(async () => {
            resolve(await objectifyAsync2(replacer2.call(value, k, v), replacer2, false));
          });
        });
        return p;
      }, Array.isArray(value) ? [] : {});
      return value;
    }
    return value;
  };
  const deobjectify2 = (value, reviver2, top = true) => {
    if (value === null)
      return value;
    if (typeof value === "object" && !asIs.has(value.constructor)) {
      value = Object.entries(value).reduce((p, [k, v]) => {
        p[k] = v === null ? v : reviver2.call(p, k, deobjectify2(v, reviver2, false));
        return p;
      }, Array.isArray(value) ? [] : {});
      if (top) {
        value = reviver2.call({
          "": value
        }, "", value);
      }
      return value;
    }
    return value;
  };
  return {
    objectify: objectify2,
    objectifyAsync: objectifyAsync2,
    deobjectify: deobjectify2
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
  const replacer2 = (top, clear = true) => (clear && (pointer = 0, ptrs.clear()), function(key) {
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
  const reviver2 = (classes, refs = /* @__PURE__ */ new Map(), pending = /* @__PURE__ */ new Map()) => {
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
    replacer: replacer2,
    reviver: reviver2
  };
};
var { replacer, reviver } = createContext2();

// ../../mono/dist/esm/causes.js
var causes_exports3 = {};
__export(causes_exports3, {
  CompilerErrorCause: () => CompilerErrorCause,
  InvalidErrorCause: () => InvalidErrorCause,
  ReferenceErrorCause: () => ReferenceErrorCause,
  SyntaxErrorCause: () => SyntaxErrorCause,
  TypeErrorCause: () => TypeErrorCause
});

// ../../../../.fastpm/-/join-regexp@1.0.0/dist/esm/index.js
var joinRegExp = (regexps, flags = "") => new RegExp(regexps.flat().map((x) => x.toString()).map((x) => x.slice(x.indexOf("/") + 1, x.lastIndexOf("/"))).join("|"), flags);

// ../../match-to-token/dist/esm/token.js
var Token = class extends String {
  static create(value, group, source2) {
    return new Token(value, group, source2);
  }
  group;
  get value() {
    return "" + this;
  }
  get index() {
    return this.source.index;
  }
  source;
  constructor(value, group, source2) {
    super(typeof value === "object" ? value.value : value);
    if (typeof value === "object") {
      group = value.group;
      source2 = Object.assign(value.source.match, {
        index: value.source.index,
        input: value.source.input
      });
    }
    this.group = group;
    Object.defineProperty(this, "source", {
      enumerable: false,
      value: source2
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
var createLexer = (tokenize2) => (input) => {
  const eof = Token.create("", "eof", {
    index: input.length,
    input
  });
  const unknown = Token.create("", "unknown", {
    index: 0,
    input
  });
  const it = tokenize2(input);
  let last;
  let curr;
  let errorFn = (error) => {
    throw error;
  };
  const onerror = (fn) => {
    errorFn = fn;
  };
  let filterFn = () => true;
  const filter3 = (fn) => {
    filterFn = fn;
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
  const advance = () => ([last, curr] = [
    curr,
    next()
  ], last);
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
var createParser = (regexp2, fn) => {
  const tokenizer = (input) => input.matchAll(new RegExpToken(regexp2));
  const Lexer = createLexer(tokenizer);
  const parse3 = (input) => {
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
    const post = (bp2) => (t) => [
      t,
      expr(bp2)
    ];
    const pre = (t, r, x) => {
      if (r)
        throw new ParserError(new BadToken(t));
      else
        return [
          t,
          x
        ];
    };
    const bin = (t, r, x) => [
      t,
      x,
      expr(r)
    ];
    const pass = {
      nud: (t) => t,
      led: (t, _, x) => [
        x,
        t
      ]
    };
    const never = {
      nud: (t, rbp) => {
        if (rbp)
          throw new ParserError(new BadOp(t));
      }
    };
    const until = (op, min_bp, fn2) => (t, r, L) => {
      const m = !peek("ops", op) ? expr(min_bp) : null;
      expect("ops", op);
      return fn2(t, L, m, r);
    };
    const bp = (t) => desc(t)[0];
    const desc = (t) => {
      const ctx = impl[`${t}`] ?? impl[t.group];
      if (!ctx)
        throw new ParserError(new BadOp(t));
      return ctx;
    };
    const denom = (impl2, t, rbp, left) => {
      const fn2 = desc(t)[1][impl2];
      if (fn2)
        return fn2(t, rbp, left);
      else
        throw new ParserError(new BadImpl(t, impl2));
    };
    const nud = denom.bind(null, "nud");
    const led = denom.bind(null, "led");
    const expr = (min) => {
      let t = advance();
      let left = nud(t, min);
      let lbp, rbp;
      while (min < ([lbp, rbp] = bp(peek()), lbp)) {
        t = advance();
        left = led(t, rbp, left);
      }
      return left;
    };
    const impl = fn({
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
  return parse3;
};

// ../../mono/dist/esm/causes.js
var CompilerErrorCause = class extends causes_exports2.ParserErrorCause {
  name = "CompilerUnknownError";
};
var ReferenceErrorCause = class extends CompilerErrorCause {
  name = "CompilerReferenceError";
};
var TypeErrorCause = class extends CompilerErrorCause {
  name = "CompilerTypeError";
};
var SyntaxErrorCause = class extends CompilerErrorCause {
  name = "CompilerSyntaxError";
};
var InvalidErrorCause = class extends CompilerErrorCause {
  name = "CompilerInvalidError";
};

// ../../mono/dist/esm/typed.js
var Type;
(function(Type2) {
  Type2["any"] = "any";
  Type2["bool"] = "bool";
  Type2["i32"] = "i32";
  Type2["f32"] = "f32";
  Type2["multi"] = "multi";
  Type2["none"] = "none";
})(Type || (Type = {}));
var I32Suffixed = `
  load8 load16
  lt gt le ge
  div rem shr
  trunc_f32 trunc_f64 extend_i32
  convert_i32 convert_i64
`.split(/\s+/);
var Types = [
  Type.any,
  Type.bool,
  Type.i32,
  Type.f32,
  Type.none
];
var W = (x) => Types.indexOf(x);
var OpTypeCast = {
  [Type.any]: {},
  [Type.multi]: {},
  [Type.f32]: {
    [Type.i32]: "f32.convert_i32_s",
    [Type.bool]: "f32.convert_i32_u"
  },
  [Type.i32]: {
    [Type.f32]: "i32.trunc_f32_s"
  },
  [Type.bool]: {
    [Type.f32]: "i32.trunc_f32_u"
  },
  [Type.none]: {
    [Type.bool]: "i32.const 0",
    [Type.i32]: "i32.const 0",
    [Type.f32]: "f32.const 0"
  }
};
var _Typed = class {
  W;
  max;
  constructor(types = /* @__PURE__ */ new Map()) {
    this.types = types;
    this.W = _Typed.W;
    this.max = _Typed.max;
    this.typeOf = (x) => (x && this.types.get(x)) ?? Type.any;
    this.typeAs = (type, x) => {
      if (typeof x === "string")
        return x;
      this.types.set(x, type);
      return x;
    };
    this.cast = (targetType, x) => {
      const sourceType = this.typeOf(x);
      if (sourceType != targetType) {
        const castOp = OpTypeCast[targetType]?.[sourceType];
        if (!castOp)
          return this.typeAs(targetType, x);
        return this.typeAs(targetType, [
          castOp,
          x
        ]);
      } else {
        return this.typeAs(targetType, x);
      }
    };
    this.castAll = (type, ...values) => values.map((x) => this.cast(type, x));
    this.hi = (...values) => {
      const weights = values.filter(Boolean).map((x) => W(this.typeOf(x)));
      return Types[Math.max(...weights)];
    };
    this.top = (type, ops) => {
      const prefix = type == Type.f32 ? "f32" : "i32";
      const [op, ...values] = ops;
      let suffix = "";
      if (type === "i32" && I32Suffixed.includes("" + op))
        suffix = "_s";
      return this.typeAs(type, [
        `${prefix}.${op}${suffix}`,
        ...this.castAll(type, ...values)
      ]);
    };
  }
  typeOf;
  typeAs;
  cast;
  castAll;
  hi;
  top;
  types;
};
var Typed = _Typed;
__publicField(Typed, "Type", Type);
__publicField(Typed, "Types", Types);
__publicField(Typed, "OpTypeCast", OpTypeCast);
__publicField(Typed, "W", W);
__publicField(Typed, "max", (type, ...types) => {
  return Types[Math.max(W(type), ...types.map(W))];
});

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
var mush = (arr, obj) => {
  const el = arr.find((x) => x.id == obj.id);
  if (el)
    Object.assign(el, obj);
  else
    arr.push(obj);
  return el ?? obj;
};

// ../../mono/dist/esm/optables.js
var Ops = (mod3) => {
  const { typeAs, hi, max, top } = mod3;
  const todo = null;
  const bin = (type, op) => (lhs, rhs) => top(max(type, hi(lhs, rhs)), [
    op,
    lhs,
    rhs
  ]);
  const typebin = (type, op) => (lhs, rhs) => top(type, [
    op,
    lhs,
    rhs
  ]);
  const eq = (op) => (lhs, rhs) => {
    const type = max(Type.i32, hi(lhs, rhs));
    if (type === Type.f32)
      return typeAs(Type.bool, top(Type.f32, [
        op,
        lhs,
        rhs
      ]));
    return typeAs(Type.bool, top(Type.i32, [
      op,
      lhs,
      rhs
    ]));
  };
  const createWasmOps = (type) => ({
    const: (value) => top(type, [
      "const",
      `${value}`
    ]),
    add: typebin(type, "add"),
    sub: typebin(type, "sub"),
    mul: typebin(type, "mul"),
    shl: typebin(type, "shl"),
    ne: typebin(type, "ne"),
    eq: typebin(type, "eq")
  });
  const i32 = createWasmOps(Type.i32);
  const f322 = createWasmOps(Type.f32);
  return {
    i32,
    f32: f322,
    todo,
    bin,
    typebin,
    eq
  };
};
var opTables = (mod3) => {
  const { typeOf, typeAs, cast, castAll, hi, max, top, infer, denan: denan2, global: global2, exported, funcCall } = mod3;
  const { i32, typebin, bin, eq, todo } = mod3.ops;
  let while_loop_id = 0;
  const Op = {
    ",": (lhs, rhs) => typeAs(Type.multi, [
      ...Array.isArray(lhs[0]) ? [
        ...lhs
      ] : [
        lhs
      ],
      rhs
    ]),
    ";": () => (local, ops) => (lhs, rhs) => local.map([
      ...flatten(";", lhs),
      rhs
    ], ops),
    "..": (lhs, rhs) => [
      lhs,
      rhs
    ],
    ":": () => (local, ops) => (lhs, rhs) => {
      const id = lhs;
      if (id[0] !== "#") {
        throw new CompilerError(new causes_exports3.SyntaxErrorCause(lhs, "buffer variables must begin with a hash(`#`) symbol"));
      }
      let size;
      let elements;
      let store = [];
      const buffer = local.get_buffer(id);
      const { sym } = buffer;
      if (rhs[0] == "[") {
        const vals = local.map(flatten(",", rhs[1]), ops);
        size = i32.const(vals.length);
        store = vals.map((val, i) => buffer.write_at(i, val));
      } else {
        const result = flatten(",", rhs);
        const size_raw = result[0];
        elements = result[1];
        size = cast(Type.i32, local.build(size_raw, ops));
      }
      local.elements[sym.id] = elements || lhs.as("1", "num");
      const buffer_create_body = typeAs(Type.none, [
        buffer.set_pointer(global2.scope.get("global_mem_ptr")),
        buffer.set_current(buffer.needle),
        ...store,
        buffer.set_size(size),
        buffer.set_size_m1(i32.sub(buffer.size, i32.const(1))),
        buffer.set_length(i32.shl(i32.mul(buffer.size, buffer.elements_const), i32.const(2))),
        global2.scope.set("global_mem_ptr", i32.add(global2.scope.get("global_mem_ptr"), i32.add(i32.const(Object.keys(Struct.Buffer).length - 1 << 2), buffer.length)))
      ]);
      if (global2.scope === local.scope) {
        mod3.fill_body.push(...buffer_create_body);
        return buffer.set_current(buffer.needle);
      } else {
        return buffer_create_body;
      }
    },
    "::": () => (local) => (lhs, map_fn, reduce_fn) => {
      const id = lhs;
      if (id[0] !== "#") {
        throw new CompilerError(new causes_exports3.SyntaxErrorCause(lhs, "map/reduce `::` operator's left hand side must be a buffer variable"));
      }
      const buffer = local.get_buffer(id);
      const temp_index = local.scope.add(Type.i32, "temp_index");
      const temp_sum = local.scope.add(Type.f32, "temp_sum");
      const temp_pos = local.scope.add(Type.i32, "temp_pos");
      const loop = typeAs(Type.f32, [
        temp_index.set(i32.const(0)),
        temp_sum.set(i32.const(0)),
        [
          "loop $map_reduce_loop",
          temp_pos.set(buffer.get_pos(temp_index.get())),
          temp_sum.set(funcCall(reduce_fn, [
            temp_sum.get(),
            map_fn ? funcCall(map_fn, Array.from({
              length: +buffer.elements
            }).map((_, i) => buffer.read_at_pos(temp_pos.get(), i))) : buffer.read_at_pos(temp_pos.get())
          ])),
          [
            "br_if $map_reduce_loop",
            i32.ne(temp_index.tee(i32.add(temp_index.get(), i32.const(1))), buffer.size)
          ]
        ],
        temp_sum.get()
      ]);
      return loop;
    },
    ":=": () => (local, _ops) => (lhs, rhs) => {
      const id = lhs;
      if (id[0] == "#") {
        const context2 = new Context(mod3);
        const fill_fn_id = id.as(`${id}_fill`);
        context2.funcDef(fill_fn_id, [], rhs);
        const buffer = local.get_buffer(lhs);
        const temp_mem_pos = local.scope.add(Type.i32, "temp_mem_pos");
        const temp_index = local.scope.add(Type.i32, "temp_index");
        const temp_pos = local.scope.add(Type.i32, "temp_pos");
        const global_mem_ptr = global2.scope.ensure_sym("global_mem_ptr").sym;
        const fill_body = typeAs(Type.none, [
          temp_mem_pos.set(global_mem_ptr.get()),
          temp_index.set(i32.const(0)),
          [
            "loop $fill_loop",
            global_mem_ptr.set(temp_mem_pos.get()),
            temp_pos.set(buffer.get_pos(temp_index.get())),
            buffer.write_at_pos(temp_pos.get(), 0, [
              "call",
              `$${fill_fn_id}`
            ]),
            [
              "br_if $fill_loop",
              i32.ne(temp_index.tee(i32.add(temp_index.get(), i32.const(1))), buffer.size)
            ]
          ]
        ]);
        mod3.fill_body.push(...fill_body);
        return [];
      }
      throw new CompilerError(new causes_exports3.TypeErrorCause(lhs, "not a buffer"));
    },
    "=": () => (local, ops) => (lhs, rhs) => {
      if (Array.isArray(lhs)) {
        const id = lhs[0];
        if (id[0] == "@") {
          const [id1, params] = [
            lhs[1],
            flatten(",", lhs[2]).filter(Boolean)
          ];
          const context2 = new Context(mod3);
          context2.funcDef(id1, params, rhs);
          return [];
        } else if (id[0] == "{") {
          const vars = flatten(",", lhs[1]);
          if (rhs[0] == "@") {
            const sym = rhs[1];
            const func = local.module.funcs[`${sym}`];
            const last = func.body.at(-1);
            const returnType = typeOf(last);
            if (returnType === Type.multi) {
              if (vars.length > last.length) {
                throw new CompilerError(new causes_exports3.TypeErrorCause(lhs[0], `Too many vars (\`${vars.length}\`) - must be equal or less than the values returned by \`${sym}\`: ${last.length}`));
              }
              const global_mem_ptr = global2.scope.ensure_sym("global_mem_ptr").sym;
              const local_mem_ptr = local.scope.add(Type.i32, "local_mem_ptr");
              let added = 0;
              const result = typeAs(Type.none, [
                local.build(rhs, ops),
                ...Array.from({
                  length: last.length - vars.length
                }, () => "drop"),
                vars.map((id2, i) => {
                  const result2 = [];
                  const sym2 = local.scope.add(Type.f32, id2);
                  if (!(sym2.id in local.offsets)) {
                    added++;
                    const current = Object.keys(local.offsets).length;
                    local.offsets[sym2.id] = current << 2;
                  }
                  result2.push([
                    sym2.set(typeAs(typeOf(last[i]), []))
                  ]);
                  return typeAs(Type.none, result2);
                }).reverse().concat(vars.map((id2) => {
                  const { sym: sym2 } = local.scope.ensure_sym(id2);
                  const offset = local.offsets[sym2.id];
                  return typeAs(Type.none, [
                    `f32.store offset=${offset}`,
                    local_mem_ptr.get(),
                    sym2.get()
                  ]);
                }))
              ]);
              if (added) {
                result.unshift(local_mem_ptr.set(global_mem_ptr.get()));
                result.push(global_mem_ptr.set(i32.add(i32.const(added << 2), global_mem_ptr.get())));
              }
              return result;
            } else if (vars.length === 1) {
              const v = vars[0];
              return typeAs(Type.none, [
                local.build(rhs, ops),
                [
                  `f32.store offset=${local.offsets[v]}`,
                  [
                    "local.get",
                    "$local_mem_ptr"
                  ],
                  [
                    "local.tee",
                    "$" + v,
                    cast(Type.f32, denan2([]))
                  ]
                ]
              ]);
            } else {
              throw new CompilerError(new causes_exports3.InvalidErrorCause(sym, "not implemented"));
            }
          }
          const vals = local.map(flatten(",", rhs), ops);
          if (vals.length !== vars.length) {
            throw new CompilerError(new causes_exports3.TypeErrorCause(id, `number of variables(\`${vars.length}\`) do not match number of values(\`${vals.length}\`)`));
          }
          return typeAs(Type.none, vars.map((sym, i) => [
            `f32.store offset=${local.offsets[sym]}`,
            [
              "local.get",
              "$local_mem_ptr"
            ],
            [
              "local.tee",
              "$" + sym,
              cast(Type.f32, denan2(vals[i]))
            ]
          ]));
        } else if (id[0] == ",") {
          const ids = flatten(",", lhs);
          if (rhs[0] == "@") {
            const sym1 = rhs[1];
            if (sym1[0] == "#") {
              const buffer = local.get_buffer(sym1);
              if (ids.length > +buffer.elements) {
                throw new CompilerError(new causes_exports3.TypeErrorCause(ids.at(-1), `number of variables(\`${ids.length}\`) are greater than the number of buffer elements(\`${buffer.elements}\`)`));
              }
              const offset = local.build(rhs[2], ops);
              const temp_buffer_pos = local.scope.add(Type.i32, "temp_buffer_pos");
              return typeAs(Type.none, [
                temp_buffer_pos.set(buffer.get_pos(offset)),
                ids.map((id2, i) => local.scope.set(id2, buffer.read_at_pos(temp_buffer_pos.get(), i)))
              ]);
            } else {
              const func1 = local.module.funcs[`${sym1}`];
              const last1 = func1.body.at(-1);
              const returnType1 = typeOf(last1);
              if (returnType1 === Type.multi) {
                if (ids.length > last1.length) {
                  throw new CompilerError(new causes_exports3.TypeErrorCause(lhs[0], `Too many values (\`${ids.length}\`) - must be equal or less than the values returned by \`${sym1}\`: ${last1.length}`));
                }
                const result1 = typeAs(Type.none, [
                  local.build(rhs, ops),
                  ...Array.from({
                    length: last1.length - ids.length
                  }, () => "drop"),
                  ids.map((id2, i) => local.scope.set(id2, typeAs(typeOf(last1[i]), []))).reverse()
                ]);
                return result1;
              } else {
                throw new CompilerError(new causes_exports3.InvalidErrorCause(sym1, "not implemented"));
              }
            }
          } else {
            const ids_raw = flatten(",", rhs);
            if (ids.length != ids_raw.length) {
              throw new CompilerError(new causes_exports3.TypeErrorCause(rhs[0], `number of values(\`${ids_raw.length}\`) do not match number of variables(\`${ids.length}\`)`));
            }
            const vals1 = local.map(ids_raw, ops);
            return ids.map((id2, i) => local.scope.set(id2, vals1[i]));
          }
        } else {
          throw new CompilerError(new causes_exports3.SyntaxErrorCause(lhs[0], "invalid assignment"));
        }
      } else {
        if (lhs[0] === "#") {
          const buffer1 = local.get_buffer(lhs);
          const rhs_raw = flatten(",", rhs);
          if (+buffer1.elements != rhs_raw.length) {
            throw new CompilerError(new causes_exports3.TypeErrorCause(lhs, `number of values(\`${rhs_raw.length}\`) do not match number of elements(\`${buffer1.elements}\`)`));
          }
          const vals2 = local.map(rhs_raw, ops);
          const temp_buffer_pos1 = local.scope.add(Type.i32, "temp_buffer_pos");
          return typeAs(Type.none, [
            temp_buffer_pos1.set(buffer1.get_pos(void 0, true)),
            ...vals2.map((val, i) => buffer1.write_at_pos(temp_buffer_pos1.get(), i, val)),
            buffer1.set_needle([
              "select",
              i32.const(0),
              i32.add(i32.const(1), buffer1.needle),
              i32.eq(buffer1.needle, buffer1.size_m1)
            ])
          ]);
        } else {
          const value = local.build(rhs, ops);
          const scope2 = local.scope.lookup(lhs);
          const sym2 = scope2.add(typeOf(value), lhs);
          return sym2.set(value);
        }
      }
    },
    "?": (cond, then_body, else_body) => {
      const type = hi(then_body, else_body);
      return typeAs(type, [
        "if",
        [
          "result",
          max(Type.i32, type)
        ],
        cast(Type.bool, cond),
        [
          "then",
          cast(type, then_body)
        ],
        [
          "else",
          cast(type, else_body)
        ]
      ]);
    },
    "||": () => (local, ops) => (...nodes) => {
      const [lhs, rhs] = local.map(nodes, ops);
      const type = hi(lhs, rhs);
      const temp = local.scope.add(type, "__lhs__" + type);
      const zero = top(type, [
        "const",
        "0"
      ]);
      return typeAs(type, [
        "if",
        [
          "result",
          max(Type.i32, type)
        ],
        top(type, [
          "ne",
          zero,
          temp.tee(lhs)
        ]),
        [
          "then",
          temp.get()
        ],
        [
          "else",
          cast(type, rhs)
        ]
      ]);
    },
    "|": typebin(Type.i32, "or"),
    "^": typebin(Type.i32, "xor"),
    "**": (lhs, rhs) => typeAs(Type.f32, [
      "call",
      "$pow",
      ...castAll(Type.f32, lhs, rhs)
    ]),
    "&": typebin(Type.i32, "and"),
    "==": (lhs, rhs) => typeAs(Type.bool, bin(Type.i32, "eq")(lhs, rhs)),
    "!=": (lhs, rhs) => typeAs(Type.bool, bin(Type.i32, "ne")(lhs, rhs)),
    "<": eq("lt"),
    ">": eq("gt"),
    "<=": eq("le"),
    ">=": eq("ge"),
    ">>": typebin(Type.i32, "shr_s"),
    "<<": typebin(Type.i32, "shl"),
    "+": [
      bin(Type.i32, "add"),
      (x) => cast(max(Type.i32, typeOf(x)), x)
    ],
    "-": [
      bin(Type.i32, "sub"),
      (x) => bin(Type.i32, "mul")(top(max(Type.i32, typeOf(x)), [
        "const",
        "-1"
      ]), x)
    ],
    "*": [
      bin(Type.i32, "mul"),
      () => (local) => (id) => {
        if (id[0] !== "#")
          throw new CompilerError(new causes_exports3.SyntaxErrorCause(id, "buffer variables must begin with a hash(`#`) symbol"));
        const buffer = local.get_buffer(id);
        const { sym } = buffer;
        if (+buffer.elements > 1)
          throw new CompilerError(new causes_exports3.TypeErrorCause(id, `passed by reference buffers can only be single(\`1\`) element, instead found "${buffer.elements}" elements in "${sym}"`));
        return buffer.pointer;
      }
    ],
    "/": bin(Type.f32, "div"),
    "%": (lhs, rhs) => {
      const type = hi(lhs, rhs);
      if (type === Type.f32)
        return typeAs(Type.f32, [
          "call",
          "$mod",
          ...castAll(Type.f32, lhs, rhs)
        ]);
      if (type === Type.bool)
        return top(Type.i32, [
          "rem_s",
          lhs,
          rhs
        ]);
      return top(Type.i32, [
        "rem_u",
        lhs,
        rhs
      ]);
    },
    "%%": (lhs, rhs) => typeAs(Type.f32, [
      "call",
      "$modwrap",
      ...castAll(Type.f32, lhs, rhs)
    ]),
    "!": (x) => top(Type.bool, [
      "eqz",
      x
    ]),
    "~": (x) => top(Type.i32, [
      "not",
      x
    ]),
    "'": (x) => {
      const id = mod3.exported_id++;
      exported.set(x, id);
      return x;
    },
    "{": () => (local) => (rhs) => {
      const local_mem_ptr = local.scope.add(Type.i32, "local_mem_ptr");
      const global_mem_ptr = global2.scope.ensure_sym("global_mem_ptr").sym;
      const vars = flatten(",", rhs).map((id, i) => {
        const offset = i << 2;
        const op = typeAs(Type.f32, [
          `f32.load offset=${offset}`,
          cast(Type.i32, local_mem_ptr.get())
        ]);
        const sym = local.scope.add(typeOf(op), id);
        local.offsets[sym.id] = offset;
        return sym.set(op);
      });
      return [
        local_mem_ptr.set(global_mem_ptr.get()),
        ...vars,
        global_mem_ptr.set(i32.add(i32.const(vars.length << 2), global_mem_ptr.get()))
      ];
    },
    "[": todo,
    "(": todo,
    "@": () => (local, ops) => (lhs, rhs) => {
      const id = lhs;
      if (id[0] === "#") {
        const offset = local.build(rhs, ops);
        return local.get_buffer(id).read_at(offset);
      } else {
        const args = local.map(flatten(",", rhs), ops);
        return funcCall(id, args);
      }
    },
    ".": todo,
    while: (cond, body) => [
      "loop $while_loop_" + ++while_loop_id,
      body,
      [
        "br_if $while_loop_" + while_loop_id,
        [
          [
            "select",
            [
              "i32.const",
              "0"
            ],
            cond,
            [
              [
                "global.set",
                "$infinite_loop_guard",
                [
                  "i32.add",
                  [
                    "i32.const",
                    "1"
                  ],
                  [
                    "global.get",
                    "$infinite_loop_guard"
                  ]
                ]
              ],
              [
                "i32.ge_s",
                [
                  "global.get",
                  "$infinite_loop_guard"
                ],
                [
                  "global.get",
                  "$max_loop"
                ]
              ]
            ]
          ]
        ]
      ]
    ],
    drop: () => [
      "drop"
    ],
    num: () => () => (lit) => top(infer(lit), [
      "const",
      lit
    ]),
    kwd: () => () => (x) => [
      x
    ],
    ids: () => (local) => (lhs) => {
      const id = lhs;
      if (lhs[0] === "#") {
        return local.get_buffer(id).read_at();
      }
      return local.scope.ensure_sym(id).sym.get();
    }
  };
  const OpParams = {
    ...Op,
    "'": () => (local, ops) => (lhs) => {
      let id = lhs;
      if (Array.isArray(id))
        id = local.build(id, ops)[0];
      const param = mush(local.params, {
        id,
        export: true
      });
      local.scope.add(param.type ??= Type.f32, id);
      return [
        id
      ];
    },
    "=": () => (local, ops) => (lhs, value) => {
      let id = lhs;
      if (Array.isArray(id))
        id = local.build(id, ops)[0];
      const defaultValue = local.build(value, Op);
      const param = mush(local.params, {
        id,
        default: defaultValue
      });
      const type = hi(param.default, ...param.range ?? []);
      param.default = cast(type, param.default);
      local.scope.add(param.type = type, id);
      if (param.range) {
        param.range[0] = cast(type, param.range[0]);
        param.range[1] = cast(type, param.range[1]);
      }
      return [
        id
      ];
    },
    "[": () => (local) => (lhs, rhs) => {
      const id = lhs;
      if (rhs == null) {
        throw new CompilerError(new causes_exports3.InvalidErrorCause(id, "Invalid parameter range for"));
      }
      const range = local.build(rhs, Op);
      if (!Array.isArray(range[0]) || !Array.isArray(range[1])) {
        throw new CompilerError(new causes_exports3.InvalidErrorCause(id, "Invalid parameter range for"));
      }
      const param = mush(local.params, {
        id,
        range
      });
      const type = hi(param.default, ...range);
      if (param.default)
        param.default = cast(type, param.default);
      local.scope.add(param.type = type, id);
      range[0] = cast(type, range[0]);
      range[1] = cast(type, range[1]);
      return [
        id
      ];
    },
    ids: () => (local) => (lhs) => {
      const id = lhs;
      if (id[0] === "#") {
        const type = Type.i32;
        mush(local.params, {
          id,
          type
        });
        local.scope.add(type, id);
        local.elements[id] = id.as("1", "num");
      } else {
        const type1 = Type.f32;
        mush(local.params, {
          id,
          type: type1
        });
        local.scope.add(type1, id);
      }
      return [
        id
      ];
    }
  };
  return {
    Op,
    OpParams
  };
};

// ../../mono/dist/esm/parser.js
var parse2 = (input) => Parse(input.replace(/[;\s]*$/g, ""));
var Parse = createParser(joinRegExp([
  /(?<kwd>while|drop|\.\.\.)/,
  /(?<ids>[#a-zA-Z_$][a-zA-Z0-9_$]*)/,
  /(?<num>inf|nan|\.\.|\d*\.?\d*e[+-]?\d+|(\d*\.((e[+-]?)?[\d]+)*\d+|\.\d+|\d+)(ms|[skKBbf])?)/,
  /(?<nul>\s+|\\\*[^]*?\*\\|\\.*)/,
  /(?<ops>\*\*|%%|:=|::|\?=|\+\+|--|\+=|-=|\*=|\/=|%=|<<=|>>=|&=|\^=|\|=|&&|!&|\|\||!=|==|>=|<=|>>|<<|\.\.|[[\](){}\\"'`,\-~+*/%=<>?!:;.|&^@]{1})/,
  /(?<err>.)/
], "g"), ({ never, pass, bin, pre, post, until, expr }) => {
  const varbin = (op) => (t, r, x) => {
    if (x[0] == "{") {
      x = x[1];
      const lhs = flatten(",", x);
      const rhs = expr(r);
      const res = lhs.map((x2) => [
        t.as("="),
        [
          t.as("{"),
          x2
        ],
        [
          t.as(op),
          x2,
          rhs
        ]
      ]);
      return unflatten(t.as(";"), res);
    } else {
      const lhs1 = flatten(",", x);
      const rhs1 = expr(r);
      const res1 = lhs1.map((x2) => [
        t.as("="),
        x2,
        [
          t.as(op),
          x2,
          rhs1
        ]
      ]);
      return unflatten(t.as(";"), res1);
    }
  };
  const parseNumber = (t) => {
    const isFloat = t.includes(".") || t.at(-1) == "f";
    let parsed = parseFloat(`${t}`).toString();
    if (isFloat && !parsed.includes("."))
      parsed += ".0";
    const number = t.as(parsed);
    const lastTwo = t.slice(-2);
    const lastOne = t.at(-1);
    if (lastTwo === "ms")
      return [
        t.as("*", "ops"),
        [
          t.as("*", "ops"),
          number,
          t.as("sr", "ids")
        ],
        t.as("0.001")
      ];
    else if (lastOne === "s")
      return [
        t.as("*", "ops"),
        number,
        t.as("sr", "ids")
      ];
    else if (lastOne === "k")
      return [
        t.as("*", "ops"),
        number,
        t.as("1000")
      ];
    else if (lastOne === "K")
      return [
        t.as("*", "ops"),
        number,
        t.as("1024")
      ];
    else if (lastOne === "b")
      return [
        t.as("*", "ops"),
        number,
        t.as("br", "ids")
      ];
    else if (lastOne === "B")
      return [
        t.as("*", "ops"),
        [
          t.as("*", "ops"),
          number,
          t.as("br", "ids")
        ],
        t.as("mr", "ids")
      ];
    return number;
  };
  const ternary = (sym, min_bp) => until(sym, min_bp, (t, L, M, r) => [
    t,
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
        nud: (t) => parseNumber(t),
        led: (t, _, x) => [
          x,
          parseNumber(t)
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
        nud: (t) => [
          t,
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
        nud: (_, __, x) => expr(x)
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
        led: (t, r, x) => [
          t.as("?"),
          [
            t.as("!="),
            t.as("0", "num"),
            x
          ],
          expr(r),
          t.as("0", "num")
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
        led: (t, _, x) => [
          t.as("="),
          x,
          [
            t.as("+"),
            x,
            t.as("1", "num")
          ]
        ],
        nud: (t) => {
          const x = expr(15);
          return [
            t.as("="),
            x,
            [
              t.as("+"),
              x,
              t.as("1", "num")
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
        led: (t, _, x) => [
          t.as("="),
          x,
          [
            t.as("-"),
            x,
            t.as("1", "num")
          ]
        ],
        nud: (t) => {
          const x = expr(15);
          return [
            t.as("="),
            x,
            [
              t.as("-"),
              x,
              t.as("1", "num")
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
        nud: until("}", 0, (t, _, x) => [
          t,
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
        led: until("]", 0, (t, L, R) => [
          t,
          L,
          R
        ]),
        nud: until("]", 0, (t, _, x) => [
          t,
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
        led: until(")", 0, (t, L, R) => [
          t.as("@"),
          L,
          R
        ].filter(Boolean)),
        nud: until(")", 0, (_, __, x) => x)
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
var CompilerError = class extends Error {
  name = "CompilerError";
  constructor(cause) {
    super(cause.message, {
      cause
    });
  }
};
var Struct = class {
  constructor(context2, sym) {
    this.context = context2;
    this.sym = sym;
    this.read = (type, index) => {
      const { typeAs, cast } = this.context.module;
      return typeAs(type, [
        `${type}.load offset=${index << 2}`,
        cast(Type.i32, this.sym.get())
      ]);
    };
    this.write = (type, index, value) => {
      const { typeAs, cast, denan: denan2 } = this.context.module;
      return typeAs(Type.none, [
        `${type}.store offset=${index << 2}`,
        cast(Type.i32, this.sym.get()),
        cast(type, denan2(value))
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
var Buffer2 = class extends Struct {
  get scope() {
    return this.context.scope;
  }
  get pointer() {
    return this.sym.get();
  }
  set_pointer(value) {
    return this.sym.set(value);
  }
  get needle() {
    return this.read(Type.i32, Struct.Buffer.Needle);
  }
  set_needle(value) {
    return this.write(Type.i32, Struct.Buffer.Needle, value);
  }
  get current() {
    return this.read(Type.i32, Struct.Buffer.Current);
  }
  set_current(value) {
    return this.write(Type.i32, Struct.Buffer.Current, value);
  }
  get size() {
    return this.read(Type.i32, Struct.Buffer.Size);
  }
  set_size(value) {
    return this.write(Type.i32, Struct.Buffer.Size, value);
  }
  get size_m1() {
    return this.read(Type.i32, Struct.Buffer.Size_m1);
  }
  set_size_m1(value) {
    return this.write(Type.i32, Struct.Buffer.Size_m1, value);
  }
  get elements() {
    return this.context.get_elements(this.sym) ?? 1;
  }
  get elements_const() {
    const { i32 } = this.context.module.ops;
    return i32.const(this.elements);
  }
  get length() {
    return this.read(Type.i32, Struct.Buffer.Length);
  }
  set_length(value) {
    return this.write(Type.i32, Struct.Buffer.Length, value);
  }
  write_at = (i, val) => this.write(Type.f32, Struct.Buffer.Contents + i, val);
  get_pos = (offset, useNeedle) => {
    const { typeAs, castAll } = this.context.module;
    const { i32 } = this.context.module.ops;
    const pos = useNeedle ? this.needle : this.current;
    return i32.add(this.pointer, typeAs(Type.i32, [
      "call",
      "$modwrapi",
      ...castAll(Type.i32, i32.shl(i32.mul(offset ? i32.add(offset, pos) : pos, this.elements_const), i32.const(2)), this.length)
    ]));
  };
  write_at_pos = (pos, elementOffset, value) => {
    const { typeAs, cast, denan: denan2 } = this.context.module;
    return typeAs(Type.none, [
      `f32.store offset=${Struct.Buffer.Contents + elementOffset << 2}`,
      cast(Type.i32, pos),
      cast(Type.f32, denan2(value))
    ]);
  };
  read_at_pos = (pos, elementOffset = 0) => {
    const { typeAs, cast } = this.context.module;
    return typeAs(Type.f32, [
      `f32.load offset=${Struct.Buffer.Contents + elementOffset << 2}`,
      cast(Type.i32, pos)
    ]);
  };
  read_at = (pos, elementOffset = 0) => {
    return this.read_at_pos(this.get_pos(pos), elementOffset);
  };
};
var Arg = class {
  export;
  default;
  originalDefault;
  range;
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }
  id;
  type;
};
var CompStep;
(function(CompStep2) {
  CompStep2["Lib"] = "lib";
  CompStep2["User"] = "user";
})(CompStep || (CompStep = {}));
var Sym = class {
  constructor(type, id, scope2, token = scope2.context.module.root.lexer.unknown.as(id)) {
    this.type = type;
    this.id = id;
    this.scope = scope2;
    this.token = token;
    this.get = () => {
      const { typeAs, scoped } = this.scope.context.module;
      return typeAs(this.type, [
        scoped(this.scope, "get"),
        this.$id
      ]);
    };
    this.set = (value) => {
      const { typeAs, scoped, cast, denan: denan2 } = this.scope.context.module;
      return typeAs(Type.none, [
        scoped(this.scope, "set"),
        this.$id,
        cast(this.type, denan2(value))
      ]);
    };
    this.tee = (value) => {
      const { typeAs, scoped, cast, denan: denan2 } = this.scope.context.module;
      if (this.scope === this.scope.context.module.global.scope) {
        return typeAs(this.type, [
          this.set(value),
          this.get()
        ]);
      } else {
        return typeAs(this.type, [
          scoped(this.scope, "tee"),
          this.$id,
          cast(this.type, denan2(value))
        ]);
      }
    };
  }
  get $id() {
    return `$${this.id}`;
  }
  export_id() {
    return [
      "export",
      `"${this.id}"`
    ];
  }
  export_mut(value) {
    const t = Typed.max(Type.i32, this.type);
    return [
      "global",
      this.$id,
      this.export_id(),
      [
        "mut",
        t
      ],
      [
        `${t}.const`,
        `${value}`
      ]
    ];
  }
  declare_mut(value) {
    const t = Typed.max(Type.i32, this.type);
    return [
      "global",
      this.$id,
      [
        "mut",
        t
      ],
      [
        `${t}.const`,
        `${value}`
      ]
    ];
  }
  get;
  set;
  tee;
  type;
  id;
  scope;
  token;
};
var Scope = class {
  symbols;
  constructor(context2) {
    this.context = context2;
    this.symbols = /* @__PURE__ */ new Map();
    this.lookup = (id) => {
      const global_scope = this.context.module.global.scope;
      return this.has(id) ? this : global_scope.has(id) ? global_scope : this;
    };
    this.ensure_sym = (id) => {
      const { forId } = this.context.module;
      const scope2 = this.lookup(id);
      if (!scope2.has(id)) {
        throw new CompilerError(new ReferenceErrorCause(forId(id), "Symbol not found in scope"));
      }
      const sym = scope2.symbols.get("" + id);
      return {
        scope: scope2,
        sym
      };
    };
  }
  add(type, id) {
    if (this.symbols.has("" + id)) {
      const sym = this.symbols.get("" + id);
      sym.type = type;
      return sym;
    }
    const sym1 = new Sym(type, "" + id, this, id instanceof Token ? id : this.context.module.root.lexer.unknown.as(id));
    this.symbols.set(sym1.id, sym1);
    return sym1;
  }
  has(id) {
    return this.symbols.has("" + id);
  }
  lookup;
  ensure_sym;
  get(id) {
    const { sym } = this.ensure_sym(id);
    return sym.get();
  }
  set(id, value) {
    const { typeOf } = this.context.module;
    const scope2 = this.lookup(id);
    if (!scope2.has(id))
      scope2.add(typeOf(value), id);
    const { sym } = this.ensure_sym(id);
    return sym.set(value);
  }
  tee(id, value) {
    const { typeOf } = this.context.module;
    const scope2 = this.lookup(id);
    if (!scope2.has(id))
      scope2.add(typeOf(value), id);
    const { sym } = this.ensure_sym(id);
    return sym.tee(value);
  }
  context;
};
var Func = class {
  body;
  source;
  constructor(context2, id) {
    this.context = context2;
    this.id = id;
  }
  get params() {
    return this.context.params;
  }
  get result() {
    const { typeOf } = this.context.module;
    return typeOf(this.body);
  }
  context;
  id;
};
var Context = class {
  params;
  scope;
  offsets;
  elements;
  refs;
  constructor(module) {
    this.module = module;
    this.params = [];
    this.scope = new Scope(this);
    this.offsets = {};
    this.elements = {};
    this.refs = [];
    this.get_elements = (sym) => sym.id in this.elements ? this.elements[sym.id] : this.module.global.elements[sym.id];
    this.get_buffer = (id) => {
      const scope2 = this.scope.lookup(id);
      const sym = scope2.add(Type.i32, id);
      const buffer = new Buffer2(scope2.context, sym);
      return buffer;
    };
    this.build = (node, ops) => {
      if (Array.isArray(node)) {
        const [sym, ...nodes] = node;
        if (!sym || !nodes.length)
          return [];
        let op = ops[sym];
        if (!op)
          throw new CompilerError(new InvalidErrorCause(sym, "not implemented"));
        if (Array.isArray(op))
          op = op.find((x) => x.length === nodes.length || x.length === 0) || op[0];
        return op.length ? op(...this.map(nodes, ops)) : op()(this, ops)(...nodes);
      } else {
        const op1 = ops[node.group];
        if (!op1)
          throw new CompilerError(new InvalidErrorCause(node, "not implemented"));
        return op1()(this, ops)(node);
      }
    };
    this.map = (nodes, ops) => nodes.filter(Boolean).map((x) => this.build(x, ops)).filter((x) => x.length > 0);
    this.funcDef = (id, params, body) => {
      this.map(params, this.module.OpTables.OpParams);
      const func = this.module.funcs[`${id}`] = new Func(this, id);
      this.module.bodies.set(func, body);
    };
  }
  get_elements;
  get_buffer;
  build;
  map;
  funcDef;
  module;
};
var Module = class extends Typed {
  body;
  bodies;
  funcs;
  exported_id;
  exported;
  exported_params;
  exported_params_map;
  init_body;
  fill_body;
  constructor(root, types = /* @__PURE__ */ new Map()) {
    super(types);
    this.root = root;
    this.types = types;
    this.body = [];
    this.bodies = /* @__PURE__ */ new Map();
    this.funcs = {};
    this.exported_id = 0;
    this.exported = /* @__PURE__ */ new Map();
    this.exported_params = /* @__PURE__ */ new Map();
    this.exported_params_map = /* @__PURE__ */ new Map();
    this.fill_body = [];
    this.funcCall = (id, args) => {
      const { exported, exported_params, exported_params_map } = this;
      if (Array.isArray(id))
        throw new CompilerError(new TypeErrorCause(id[0], "invalid function passed to map/reduce"));
      const sym = id;
      const func = this.funcs[sym];
      if (!func)
        throw new CompilerError(new ReferenceErrorCause(id, "function not defined"));
      func.params.forEach((param, i) => {
        if (exported.has(args[i])) {
          const sexpr2 = args[i];
          const export_id = `export/${sym}/${param.id}/${exported.get(args[i])}`;
          args[i] = this.typeAs(param.type, [
            "global.get",
            `$${export_id}`
          ]);
          let exported_params_args = exported_params.get(param);
          if (!exported_params_args)
            exported_params.set(param, exported_params_args = /* @__PURE__ */ new Set());
          exported_params_args.add(export_id);
          exported_params_map.set(export_id, sexpr2);
        }
        let param_default;
        if (param.export) {
          const export_default_$id = `$export/${sym}/${param.id}`;
          param_default = this.typeAs(param.type, [
            "global.get",
            export_default_$id
          ]);
        } else {
          if (param.default)
            param_default = param.default;
          else if (param.range)
            param_default = param.range[0];
          else
            param_default = this.typeAs(Type.f32, [
              "f32.const",
              "0"
            ]);
        }
        if (param.default) {
          if (!args[i])
            args[i] = param_default;
          else
            args[i] = this.cast(param.type, args[i]);
        } else if (param.range) {
          if (!args[i])
            args[i] = param_default;
          else {
            args[i] = this.cast(param.type, args[i]);
            if (param.type === Type.f32) {
              args[i] = this.typeAs(Type.f32, [
                "call",
                "$clamp",
                args[i],
                param.range[0],
                param.range[1]
              ]);
            } else {
              args[i] = this.typeAs(Type.i32, [
                "call",
                "$clampi",
                args[i],
                param.range[0],
                param.range[1]
              ]);
            }
          }
        } else if (args[i])
          args[i] = this.cast(param.type ?? Type.f32, args[i]);
        else
          args[i] = param_default;
      });
      args.length = func.params.length;
      return this.typeAs(func.result, [
        "call",
        "$" + sym,
        ...args
      ]);
    };
    this.scoped = (scope2, op) => `${scope2 === this.global.scope ? "global" : "local"}.${op}`;
    this.denan = (body) => this.typeOf(body) !== Type.f32 ? body : this.typeAs(Type.f32, [
      "call",
      "$denan",
      body
    ]);
    this.infer = (x) => {
      if ("01".includes(x))
        return Type.bool;
      else if (x.endsWith("f"))
        return Type.f32;
      else if (!x.includes("."))
        return Type.i32;
      else if (x.includes("."))
        return Type.f32;
      else
        throw new CompilerError(new TypeErrorCause(this.forId(x), "cannot infer type for"));
    };
    this.forId = (id) => {
      return id instanceof Token ? id : this.root.lexer.unknown.as("" + id);
    };
    this.global = new Context(this);
    this.ops = Ops(this);
    this.OpTables = opTables(this);
  }
  get f_type() {
    return this.typeOf(this.funcs.f?.body);
  }
  get f_params() {
    return this.funcs.f?.params ?? [];
  }
  funcCall;
  scoped;
  denan;
  infer;
  forId;
  global;
  ops;
  OpTables;
  valueOf() {
    return this.body;
  }
  root;
  types;
};
var compile2 = (root, scope_record = {}, includes2 = {}, init_body = [], fill_body = [], types = /* @__PURE__ */ new Map(), step = CompStep.User) => {
  const externalScopeKeys = Object.keys(scope_record);
  const unknown = root.lexer.unknown;
  const mod3 = new Module(root, types);
  mod3.fill_body = [
    ...fill_body
  ];
  const { global: global2, funcs, bodies, typeOf, typeAs, max, top } = mod3;
  for (const [id, type] of Object.entries(scope_record)) {
    global2.scope.add(type, id);
  }
  for (const [name, func] of Object.entries(includes2)) {
    if (!("context" in func)) {
      const context2 = new Context(mod3);
      context2.params = func.params.map((x, i) => Object.assign(new Arg(unknown.as(`${i}`), x), {
        default: top(x, [
          "const",
          "0"
        ])
      }));
      const f = funcs[name] = new Func(context2, unknown.as(name));
      f.body = typeAs(func.result, []);
    } else {
      funcs[name] = func;
    }
  }
  if (step === CompStep.Lib)
    global2.funcDef("__drop__", [], root);
  else {
    global2.funcDef("__begin__", [], root);
    global2.funcDef("__start__", [], []);
    global2.funcDef("update_exports", [], []);
  }
  for (const [func1, body] of bodies) {
    const b = func1.context.map(flatten(";", body), mod3.OpTables.Op);
    func1.body = typeAs(typeOf(b.at(-1)), b);
  }
  mod3.body = [];
  if (step === CompStep.User) {
    funcs.__start__.body.push(...init_body || [], ...mod3.fill_body);
  } else {
    mod3.init_body = funcs.__drop__.body;
    delete funcs.__drop__;
  }
  for (const [id1, sym] of global2.scope.symbols) {
    if (externalScopeKeys.includes(id1))
      continue;
    if (sym.id.includes("temp"))
      mod3.body.push(sym.declare_mut(0));
    else
      mod3.body.push(sym.export_mut(0));
  }
  for (const [id2, func2] of Object.entries(funcs)) {
    func2.params.filter((param) => param.export || mod3.exported_params.has(param)).forEach((param) => {
      const { sym } = func2.context.scope.ensure_sym(param.id);
      const export_id = `export/${id2}/${param.id}`;
      const t = max(Type.i32, sym.type);
      const export_min = global2.scope.add(sym.type, `${export_id}/min`);
      const export_max = global2.scope.add(sym.type, `${export_id}/max`);
      if (param.range) {
        funcs.update_exports.body.push(export_min.set(param.range[0]));
        funcs.update_exports.body.push(export_max.set(param.range[1]));
      }
      if (param.range || !param.default) {
        mod3.body.push(export_min.export_mut(0));
        mod3.body.push(export_max.export_mut(1));
      }
      const init_default = (export_id2, value) => {
        const export_default = global2.scope.add(sym.type, export_id2);
        mod3.body.push(export_default.export_mut(0));
        if (value) {
          param.originalDefault = value;
          funcs.update_exports.body.push(export_default.set(value));
        } else {
          funcs.update_exports.body.push(export_default.set(top(t, [
            "add",
            export_min.get(),
            [
              t + ".div" + (t === "i32" ? "_s" : ""),
              [
                t + ".sub",
                export_max.get(),
                export_min.get()
              ],
              [
                t + ".const",
                "2"
              ]
            ]
          ])));
        }
        return export_default;
      };
      if (param.export) {
        param.default = init_default(export_id, param.default).get();
      }
      const exported_params_args = mod3.exported_params.get(param);
      if (exported_params_args) {
        for (const id of exported_params_args) {
          init_default(id, mod3.exported_params_map.get(id));
        }
      }
    });
  }
  for (const [id3, func3] of Object.entries(funcs)) {
    if (id3 in includes2)
      continue;
    func3.source = [
      "func",
      "$" + id3,
      [
        "export",
        `"${id3}"`
      ],
      ...func3.params.map((param) => [
        "param",
        "$" + param.id,
        max(Type.i32, func3.context.scope.ensure_sym(param.id).sym.type)
      ]),
      ...func3.body.length && ![
        "update_exports",
        "__start__",
        "__begin__"
      ].includes(id3) ? [
        func3.result === Type.multi ? [
          "result",
          ...func3.body.at(-1).map((x) => max(Type.i32, typeOf(x)))
        ] : [
          "result",
          max(Type.i32, func3.result)
        ]
      ] : [],
      ...![
        "update_exports",
        "__start__",
        "__begin__"
      ].includes(id3) ? [
        ...func3.context.scope.symbols
      ].filter(([x]) => !func3.params.find((param) => param.id == x)).map(([x, sym]) => [
        "local",
        "$" + x,
        max(Type.i32, sym.type)
      ]) : [],
      ...[
        "update_exports",
        "__start__",
        "__begin__"
      ].includes(id3) ? func3.body.length ? [
        ...func3.body
      ] : [] : func3.body
    ];
    mod3.body.push(func3.source);
  }
  return mod3;
};

// ../../mono/dist/esm/sexpr.js
var S = (p, x = 0) => {
  return Array.isArray(p) ? p.length ? Array.isArray(p[0]) ? p.map((e) => "\n" + S(e, x + 2)).join(" ") : `${" ".repeat(x)}(${p[0]} ${p.slice(1).map((e) => (Array.isArray(e) ? "\n" : "") + S(e, x + 2)).join(" ")})` : "" : p;
};

// ../../mono/dist/esm/lib/math.js
var math_exports = {};
__export(math_exports, {
  lib: () => lib
});
var lib = String.raw`;;wasm
(module
  (func $abs (export "abs") (type $t0) (param $p0 f32) (result f32)
    (f32.abs
      (local.get $p0)))
  (func $f2 (type $t0) (param $p0 f32) (result f32)
    (f32.div
      (f32.mul
        (local.get $p0)
        (f32.add
          (f32.mul
            (local.get $p0)
            (f32.add
              (f32.mul
                (local.get $p0)
                (f32.const -0x1.1ba6d6p-7 (;=-0.00865636;)))
              (f32.const -0x1.5e2774p-5 (;=-0.0427434;))))
          (f32.const 0x1.5554eap-3 (;=0.166666;))))
      (f32.add
        (f32.mul
          (local.get $p0)
          (f32.const -0x1.69cb5cp-1 (;=-0.70663;)))
        (f32.const 0x1p+0 (;=1;)))))
  (func $f3 (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 i32) (local $l3 f32) (local $l4 f32)
    (if $I0
      (i32.ge_u
        (local.tee $l1
          (i32.and
            (local.tee $l2
              (i32.reinterpret_f32
                (local.get $p0)))
            (i32.const 2147483647)))
        (i32.const 1065353216))
      (then
        (if $I1
          (i32.eq
            (local.get $l1)
            (i32.const 1065353216))
          (then
            (return
              (select
                (f32.const 0x1.921fb4p+1 (;=3.14159;))
                (f32.const 0x0p+0 (;=0;))
                (i32.lt_s
                  (local.get $l2)
                  (i32.const 0))))))
        (return
          (f32.div
            (f32.const 0x0p+0 (;=0;))
            (f32.sub
              (local.get $p0)
              (local.get $p0))))))
    (if $I2
      (i32.lt_u
        (local.get $l1)
        (i32.const 1056964608))
      (then
        (if $I3
          (i32.le_u
            (local.get $l1)
            (i32.const 847249408))
          (then
            (return
              (f32.const 0x1.921fb4p+0 (;=1.5708;)))))
        (return
          (f32.sub
            (f32.const 0x1.921fb4p+0 (;=1.5708;))
            (f32.sub
              (local.get $p0)
              (f32.sub
                (f32.const 0x1.4442dp-24 (;=7.54979e-08;))
                (f32.mul
                  (local.get $p0)
                  (call $f2
                    (f32.mul
                      (local.get $p0)
                      (local.get $p0))))))))))
    (if $I4
      (i32.lt_s
        (local.get $l2)
        (i32.const 0))
      (then
        (return
          (f32.mul
            (f32.sub
              (f32.const 0x1.921fb4p+0 (;=1.5708;))
              (f32.add
                (local.tee $l3
                  (f32.sqrt
                    (local.tee $p0
                      (f32.add
                        (f32.mul
                          (local.get $p0)
                          (f32.const 0x1p-1 (;=0.5;)))
                        (f32.const 0x1p-1 (;=0.5;))))))
                (f32.sub
                  (f32.mul
                    (call $f2
                      (local.get $p0))
                    (local.get $l3))
                  (f32.const 0x1.4442dp-24 (;=7.54979e-08;)))))
            (f32.const 0x1p+1 (;=2;))))))
    (f32.mul
      (f32.add
        (local.tee $p0
          (f32.reinterpret_i32
            (i32.and
              (i32.reinterpret_f32
                (local.tee $l4
                  (f32.sqrt
                    (local.tee $l3
                      (f32.sub
                        (f32.const 0x1p-1 (;=0.5;))
                        (f32.mul
                          (local.get $p0)
                          (f32.const 0x1p-1 (;=0.5;))))))))
              (i32.const -4096))))
        (f32.add
          (f32.mul
            (call $f2
              (local.get $l3))
            (local.get $l4))
          (f32.div
            (f32.sub
              (local.get $l3)
              (f32.mul
                (local.get $p0)
                (local.get $p0)))
            (f32.add
              (local.get $l4)
              (local.get $p0)))))
      (f32.const 0x1p+1 (;=2;))))
  (func $acos (export "acos") (type $t0) (param $p0 f32) (result f32)
    (call $f3
      (local.get $p0)))
  (func $f5 (type $t0) (param $p0 f32) (result f32)
    (local $l1 f32) (local $l2 f32) (local $l3 f32) (local $l4 f32) (local $l5 i32) (local $l6 i32)
    (local.set $l5
      (i32.const 1))
    (if $I0
      (i32.or
        (i32.shr_u
          (local.tee $l6
            (i32.reinterpret_f32
              (local.get $p0)))
          (i32.const 31))
        (i32.lt_u
          (local.get $l6)
          (i32.const 1054086096)))
      (then
        (if $I1
          (i32.ge_u
            (local.get $l6)
            (i32.const -1082130432))
          (then
            (if $I2
              (f32.eq
                (local.get $p0)
                (f32.const -0x1p+0 (;=-1;)))
              (then
                (return
                  (f32.div
                    (local.get $p0)
                    (f32.const 0x0p+0 (;=0;))))))
            (return
              (f32.div
                (f32.sub
                  (local.get $p0)
                  (local.get $p0))
                (f32.const 0x0p+0 (;=0;))))))
        (if $I3
          (i32.lt_u
            (i32.shl
              (local.get $l6)
              (i32.const 1))
            (i32.const 1728053248))
          (then
            (return
              (local.get $p0))))
        (local.set $l1
          (if $I4 (result f32)
            (i32.le_u
              (local.get $l6)
              (i32.const -1097468391))
            (then
              (local.set $l5
                (i32.const 0))
              (local.get $p0))
            (else
              (f32.const 0x0p+0 (;=0;))))))
      (else
        (if $I5
          (i32.ge_u
            (local.get $l6)
            (i32.const 2139095040))
          (then
            (return
              (local.get $p0))))))
    (if $I6
      (local.get $l5)
      (then
        (local.set $l2
          (if $I7 (result f32)
            (i32.lt_s
              (local.tee $l5
                (i32.sub
                  (i32.shr_u
                    (local.tee $l6
                      (i32.add
                        (i32.reinterpret_f32
                          (local.tee $l1
                            (f32.add
                              (local.get $p0)
                              (f32.const 0x1p+0 (;=1;)))))
                        (i32.const 4913933)))
                    (i32.const 23))
                  (i32.const 127)))
              (i32.const 25))
            (then
              (f32.div
                (select
                  (f32.sub
                    (f32.const 0x1p+0 (;=1;))
                    (f32.sub
                      (local.get $l1)
                      (local.get $p0)))
                  (f32.sub
                    (local.get $p0)
                    (f32.sub
                      (local.get $l1)
                      (f32.const 0x1p+0 (;=1;))))
                  (i32.ge_s
                    (local.get $l5)
                    (i32.const 2)))
                (local.get $l1)))
            (else
              (f32.const 0x0p+0 (;=0;)))))
        (local.set $l1
          (f32.sub
            (f32.reinterpret_i32
              (i32.add
                (i32.and
                  (local.get $l6)
                  (i32.const 8388607))
                (i32.const 1060439283)))
            (f32.const 0x1p+0 (;=1;))))))
    (local.set $l4
      (f32.mul
        (local.tee $p0
          (f32.mul
            (local.tee $l3
              (f32.div
                (local.get $l1)
                (f32.add
                  (local.get $l1)
                  (f32.const 0x1p+1 (;=2;)))))
            (local.get $l3)))
        (local.get $p0)))
    (f32.add
      (f32.add
        (f32.sub
          (f32.add
            (f32.mul
              (local.get $l3)
              (f32.add
                (local.tee $l3
                  (f32.mul
                    (f32.mul
                      (local.get $l1)
                      (f32.const 0x1p-1 (;=0.5;)))
                    (local.get $l1)))
                (f32.add
                  (f32.mul
                    (local.get $p0)
                    (f32.add
                      (f32.mul
                        (local.get $l4)
                        (f32.const 0x1.23d3dcp-2 (;=0.284988;)))
                      (f32.const 0x1.555554p-1 (;=0.666667;))))
                  (f32.mul
                    (local.get $l4)
                    (f32.add
                      (f32.mul
                        (local.get $l4)
                        (f32.const 0x1.f13c4cp-3 (;=0.242791;)))
                      (f32.const 0x1.999c26p-2 (;=0.40001;)))))))
            (f32.add
              (f32.mul
                (local.tee $p0
                  (f32.convert_i32_s
                    (local.get $l5)))
                (f32.const 0x1.2fefa2p-17 (;=9.058e-06;)))
              (local.get $l2)))
          (local.get $l3))
        (local.get $l1))
      (f32.mul
        (local.get $p0)
        (f32.const 0x1.62e3p-1 (;=0.693138;)))))
  (func $f6 (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 f32) (local $l5 f32) (local $l6 f32)
    (if $I0
      (i32.or
        (local.tee $l2
          (i32.shr_u
            (local.tee $l1
              (i32.reinterpret_f32
                (local.get $p0)))
            (i32.const 31)))
        (i32.lt_u
          (local.get $l1)
          (i32.const 8388608)))
      (then
        (if $I1
          (i32.eqz
            (i32.shl
              (local.get $l1)
              (i32.const 1)))
          (then
            (return
              (f32.div
                (f32.const -0x1p+0 (;=-1;))
                (f32.mul
                  (local.get $p0)
                  (local.get $p0))))))
        (if $I2
          (local.get $l2)
          (then
            (return
              (f32.div
                (f32.sub
                  (local.get $p0)
                  (local.get $p0))
                (f32.const 0x0p+0 (;=0;))))))
        (local.set $l3
          (i32.const -25))
        (local.set $l1
          (i32.reinterpret_f32
            (f32.mul
              (local.get $p0)
              (f32.const 0x1p+25 (;=3.35544e+07;))))))
      (else
        (if $I3
          (i32.ge_u
            (local.get $l1)
            (i32.const 2139095040))
          (then
            (return
              (local.get $p0)))
          (else
            (if $I4
              (i32.eq
                (local.get $l1)
                (i32.const 1065353216))
              (then
                (return
                  (f32.const 0x0p+0 (;=0;)))))))))
    (local.set $l6
      (f32.mul
        (local.tee $l4
          (f32.mul
            (local.tee $l5
              (f32.div
                (local.tee $p0
                  (f32.sub
                    (f32.reinterpret_i32
                      (i32.add
                        (i32.and
                          (local.tee $l1
                            (i32.add
                              (local.get $l1)
                              (i32.const 4913933)))
                          (i32.const 8388607))
                        (i32.const 1060439283)))
                    (f32.const 0x1p+0 (;=1;))))
                (f32.add
                  (local.get $p0)
                  (f32.const 0x1p+1 (;=2;)))))
            (local.get $l5)))
        (local.get $l4)))
    (f32.add
      (f32.add
        (f32.sub
          (f32.add
            (f32.mul
              (local.get $l5)
              (f32.add
                (local.tee $l5
                  (f32.mul
                    (f32.mul
                      (local.get $p0)
                      (f32.const 0x1p-1 (;=0.5;)))
                    (local.get $p0)))
                (f32.add
                  (f32.mul
                    (local.get $l4)
                    (f32.add
                      (f32.mul
                        (local.get $l6)
                        (f32.const 0x1.23d3dcp-2 (;=0.284988;)))
                      (f32.const 0x1.555554p-1 (;=0.666667;))))
                  (f32.mul
                    (local.get $l6)
                    (f32.add
                      (f32.mul
                        (local.get $l6)
                        (f32.const 0x1.f13c4cp-3 (;=0.242791;)))
                      (f32.const 0x1.999c26p-2 (;=0.40001;)))))))
            (f32.mul
              (local.tee $l4
                (f32.convert_i32_s
                  (i32.add
                    (local.get $l3)
                    (i32.sub
                      (i32.shr_u
                        (local.get $l1)
                        (i32.const 23))
                      (i32.const 127)))))
              (f32.const 0x1.2fefa2p-17 (;=9.058e-06;))))
          (local.get $l5))
        (local.get $p0))
      (f32.mul
        (local.get $l4)
        (f32.const 0x1.62e3p-1 (;=0.693138;)))))
  (func $acosh (export "acosh") (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32)
    (block $B0 (result f32)
      (if $I1
        (i32.lt_u
          (i32.and
            (local.tee $l1
              (i32.reinterpret_f32
                (local.get $p0)))
            (i32.const 2147483647))
          (i32.const 1073741824))
        (then
          (br $B0
            (call $f5
              (f32.add
                (local.tee $p0
                  (f32.sub
                    (local.get $p0)
                    (f32.const 0x1p+0 (;=1;))))
                (f32.sqrt
                  (f32.mul
                    (local.get $p0)
                    (f32.add
                      (local.get $p0)
                      (f32.const 0x1p+1 (;=2;))))))))))
      (if $I2
        (i32.lt_u
          (local.get $l1)
          (i32.const 1166016512))
        (then
          (br $B0
            (call $f6
              (f32.sub
                (f32.add
                  (local.get $p0)
                  (local.get $p0))
                (f32.div
                  (f32.const 0x1p+0 (;=1;))
                  (f32.add
                    (local.get $p0)
                    (f32.sqrt
                      (f32.sub
                        (f32.mul
                          (local.get $p0)
                          (local.get $p0))
                        (f32.const 0x1p+0 (;=1;)))))))))))
      (f32.add
        (call $f6
          (local.get $p0))
        (f32.const 0x1.62e43p-1 (;=0.693147;)))))
  (func $asin (export "asin") (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 f32) (local $l3 f64)
    (block $B0 (result f32)
      (if $I1
        (i32.ge_u
          (local.tee $l1
            (i32.and
              (i32.reinterpret_f32
                (local.get $p0))
              (i32.const 2147483647)))
          (i32.const 1065353216))
        (then
          (drop
            (br_if $B0
              (f32.add
                (f32.mul
                  (local.get $p0)
                  (f32.const 0x1.921fb6p+0 (;=1.5708;)))
                (f32.const 0x1p-120 (;=7.52316e-37;)))
              (i32.eq
                (local.get $l1)
                (i32.const 1065353216))))
          (br $B0
            (f32.div
              (f32.const 0x0p+0 (;=0;))
              (f32.sub
                (local.get $p0)
                (local.get $p0))))))
      (if $I2
        (i32.lt_u
          (local.get $l1)
          (i32.const 1056964608))
        (then
          (drop
            (br_if $B0
              (local.get $p0)
              (i32.and
                (i32.lt_u
                  (local.get $l1)
                  (i32.const 964689920))
                (i32.ge_u
                  (local.get $l1)
                  (i32.const 8388608)))))
          (br $B0
            (f32.add
              (local.get $p0)
              (f32.mul
                (local.get $p0)
                (call $f2
                  (f32.mul
                    (local.get $p0)
                    (local.get $p0))))))))
      (f32.copysign
        (f32.demote_f64
          (f64.sub
            (f64.const 0x1.921fb6p+0 (;=1.5708;))
            (f64.mul
              (f64.add
                (local.tee $l3
                  (f64.sqrt
                    (f64.promote_f32
                      (local.tee $l2
                        (f32.sub
                          (f32.const 0x1p-1 (;=0.5;))
                          (f32.mul
                            (f32.abs
                              (local.get $p0))
                            (f32.const 0x1p-1 (;=0.5;))))))))
                (f64.mul
                  (local.get $l3)
                  (f64.promote_f32
                    (call $f2
                      (local.get $l2)))))
              (f64.const 0x1p+1 (;=2;)))))
        (local.get $p0))))
  (func $asinh (export "asinh") (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 f32)
    (local.set $l2
      (f32.reinterpret_i32
        (local.tee $l1
          (i32.and
            (i32.reinterpret_f32
              (local.get $p0))
            (i32.const 2147483647)))))
    (f32.copysign
      (if $I0 (result f32)
        (i32.ge_u
          (local.get $l1)
          (i32.const 1166016512))
        (then
          (f32.add
            (call $f6
              (local.get $l2))
            (f32.const 0x1.62e43p-1 (;=0.693147;))))
        (else
          (if $I1 (result f32)
            (i32.ge_u
              (local.get $l1)
              (i32.const 1073741824))
            (then
              (call $f6
                (f32.add
                  (f32.add
                    (local.get $l2)
                    (local.get $l2))
                  (f32.div
                    (f32.const 0x1p+0 (;=1;))
                    (f32.add
                      (f32.sqrt
                        (f32.add
                          (f32.mul
                            (local.get $l2)
                            (local.get $l2))
                          (f32.const 0x1p+0 (;=1;))))
                      (local.get $l2))))))
            (else
              (if $I2 (result f32)
                (i32.ge_u
                  (local.get $l1)
                  (i32.const 964689920))
                (then
                  (call $f5
                    (f32.add
                      (local.get $l2)
                      (f32.div
                        (local.tee $l2
                          (f32.mul
                            (local.get $l2)
                            (local.get $l2)))
                        (f32.add
                          (f32.sqrt
                            (f32.add
                              (local.get $l2)
                              (f32.const 0x1p+0 (;=1;))))
                          (f32.const 0x1p+0 (;=1;)))))))
                (else
                  (local.get $l2)))))))
      (local.get $p0)))
  (func $f10 (type $t0) (param $p0 f32) (result f32)
    (local $l1 f32) (local $l2 f32) (local $l3 f32) (local $l4 i32) (local $l5 i32)
    (local.set $l1
      (local.get $p0))
    (if $I0
      (i32.ge_u
        (local.tee $l4
          (i32.and
            (i32.reinterpret_f32
              (local.get $p0))
            (i32.const 2147483647)))
        (i32.const 1283457024))
      (then
        (if $I1
          (f32.ne
            (local.get $p0)
            (local.get $p0))
          (then
            (return
              (local.get $p0))))
        (return
          (f32.copysign
            (f32.const 0x1.921fb4p+0 (;=1.5708;))
            (local.get $l1)))))
    (if $I2
      (i32.lt_u
        (local.get $l4)
        (i32.const 1054867456))
      (then
        (if $I3
          (i32.lt_u
            (local.get $l4)
            (i32.const 964689920))
          (then
            (return
              (local.get $p0))))
        (local.set $l5
          (i32.const -1)))
      (else
        (local.set $p0
          (f32.abs
            (local.get $p0)))
        (local.set $p0
          (if $I4 (result f32)
            (i32.lt_u
              (local.get $l4)
              (i32.const 1066926080))
            (then
              (if $I5 (result f32)
                (i32.lt_u
                  (local.get $l4)
                  (i32.const 1060110336))
                (then
                  (f32.div
                    (f32.sub
                      (f32.add
                        (local.get $p0)
                        (local.get $p0))
                      (f32.const 0x1p+0 (;=1;)))
                    (f32.add
                      (local.get $p0)
                      (f32.const 0x1p+1 (;=2;)))))
                (else
                  (local.set $l5
                    (i32.const 1))
                  (f32.div
                    (f32.sub
                      (local.get $p0)
                      (f32.const 0x1p+0 (;=1;)))
                    (f32.add
                      (local.get $p0)
                      (f32.const 0x1p+0 (;=1;)))))))
            (else
              (if $I6 (result f32)
                (i32.lt_u
                  (local.get $l4)
                  (i32.const 1075576832))
                (then
                  (local.set $l5
                    (i32.const 2))
                  (f32.div
                    (f32.sub
                      (local.get $p0)
                      (f32.const 0x1.8p+0 (;=1.5;)))
                    (f32.add
                      (f32.mul
                        (local.get $p0)
                        (f32.const 0x1.8p+0 (;=1.5;)))
                      (f32.const 0x1p+0 (;=1;)))))
                (else
                  (local.set $l5
                    (i32.const 3))
                  (f32.div
                    (f32.const -0x1p+0 (;=-1;))
                    (local.get $p0)))))))))
    (local.set $l2
      (f32.mul
        (local.tee $l3
          (f32.mul
            (local.get $p0)
            (local.get $p0)))
        (local.get $l3)))
    (local.set $l2
      (f32.mul
        (local.get $p0)
        (f32.add
          (f32.mul
            (local.get $l3)
            (f32.add
              (f32.mul
                (local.get $l2)
                (f32.add
                  (f32.mul
                    (local.get $l2)
                    (f32.const 0x1.f9584ap-5 (;=0.0616876;)))
                  (f32.const 0x1.23ea1ap-3 (;=0.142536;))))
              (f32.const 0x1.555552p-2 (;=0.333333;))))
          (f32.mul
            (local.get $l2)
            (f32.add
              (f32.mul
                (local.get $l2)
                (f32.const -0x1.b4248ep-4 (;=-0.10648;)))
              (f32.const -0x1.99953p-3 (;=-0.199992;)))))))
    (if $I7
      (i32.lt_s
        (local.get $l5)
        (i32.const 0))
      (then
        (return
          (f32.sub
            (local.get $p0)
            (local.get $l2)))))
    (block $B8
      (block $B9
        (block $B10
          (block $B11
            (block $B12
              (block $B13
                (br_table $B13 $B12 $B11 $B10 $B9
                  (local.get $l5)))
              (local.set $p0
                (f32.sub
                  (f32.const 0x1.dac67p-2 (;=0.463648;))
                  (f32.sub
                    (f32.sub
                      (local.get $l2)
                      (f32.const 0x1.586ed2p-28 (;=5.01216e-09;)))
                    (local.get $p0))))
              (br $B8))
            (local.set $p0
              (f32.sub
                (f32.const 0x1.921fb4p-1 (;=0.785398;))
                (f32.sub
                  (f32.sub
                    (local.get $l2)
                    (f32.const 0x1.4442dp-25 (;=3.77489e-08;)))
                  (local.get $p0))))
            (br $B8))
          (local.set $p0
            (f32.sub
              (f32.const 0x1.f730bcp-1 (;=0.982794;))
              (f32.sub
                (f32.sub
                  (local.get $l2)
                  (f32.const 0x1.281f68p-25 (;=3.44732e-08;)))
                (local.get $p0))))
          (br $B8))
        (local.set $p0
          (f32.sub
            (f32.const 0x1.921fb4p+0 (;=1.5708;))
            (f32.sub
              (f32.sub
                (local.get $l2)
                (f32.const 0x1.4442dp-24 (;=7.54979e-08;)))
              (local.get $p0))))
        (br $B8))
      (unreachable))
    (f32.copysign
      (local.get $p0)
      (local.get $l1)))
  (func $atan (export "atan") (type $t0) (param $p0 f32) (result f32)
    (call $f10
      (local.get $p0)))
  (func $f12 (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32)
    (if $I0
      (i32.or
        (f32.ne
          (local.get $p0)
          (local.get $p0))
        (f32.ne
          (local.get $p1)
          (local.get $p1)))
      (then
        (return
          (f32.add
            (local.get $p1)
            (local.get $p0)))))
    (if $I1
      (i32.eq
        (local.tee $l3
          (i32.reinterpret_f32
            (local.get $p1)))
        (i32.const 1065353216))
      (then
        (return
          (call $f10
            (local.get $p0)))))
    (local.set $l2
      (i32.or
        (i32.and
          (i32.shr_u
            (local.get $l3)
            (i32.const 30))
          (i32.const 2))
        (i32.shr_u
          (local.tee $l4
            (i32.reinterpret_f32
              (local.get $p0)))
          (i32.const 31))))
    (if $I2
      (i32.eqz
        (local.tee $l4
          (i32.and
            (local.get $l4)
            (i32.const 2147483647))))
      (then
        (block $B3
          (block $B4
            (block $B5
              (if $I6
                (i32.eqz
                  (i32.or
                    (i32.eqz
                      (local.get $l2))
                    (i32.eq
                      (local.get $l2)
                      (i32.const 1))))
                (then
                  (br_if $B5
                    (i32.eq
                      (local.get $l2)
                      (i32.const 2)))
                  (br_if $B4
                    (i32.eq
                      (local.get $l2)
                      (i32.const 3)))
                  (br $B3)))
              (return
                (local.get $p0)))
            (return
              (f32.const 0x1.921fb6p+1 (;=3.14159;))))
          (return
            (f32.const -0x1.921fb6p+1 (;=-3.14159;))))))
    (block $B7
      (br_if $B7
        (i32.eqz
          (local.tee $l3
            (i32.and
              (local.get $l3)
              (i32.const 2147483647)))))
      (if $I8
        (i32.eq
          (local.get $l3)
          (i32.const 2139095040))
        (then
          (return
            (select
              (f32.neg
                (local.tee $p0
                  (select
                    (select
                      (f32.const 0x1.2d97c8p+1 (;=2.35619;))
                      (f32.const 0x1.921fb6p-1 (;=0.785398;))
                      (local.tee $l3
                        (i32.and
                          (local.get $l2)
                          (i32.const 2))))
                    (select
                      (f32.const 0x1.921fb6p+1 (;=3.14159;))
                      (f32.const 0x0p+0 (;=0;))
                      (local.get $l3))
                    (i32.eq
                      (local.get $l4)
                      (i32.const 2139095040)))))
              (local.get $p0)
              (i32.and
                (local.get $l2)
                (i32.const 1))))))
      (br_if $B7
        (i32.or
          (i32.eq
            (local.get $l4)
            (i32.const 2139095040))
          (i32.lt_u
            (i32.add
              (local.get $l3)
              (i32.const 218103808))
            (local.get $l4))))
      (local.set $p0
        (if $I9 (result f32)
          (select
            (i32.lt_u
              (i32.add
                (local.get $l4)
                (i32.const 218103808))
              (local.get $l3))
            (i32.const 0)
            (i32.and
              (local.get $l2)
              (i32.const 2)))
          (then
            (f32.const 0x0p+0 (;=0;)))
          (else
            (call $f10
              (f32.abs
                (f32.div
                  (local.get $p0)
                  (local.get $p1)))))))
      (block $B10
        (block $B11
          (block $B12
            (block $B13
              (block $B14
                (br_table $B14 $B13 $B12 $B11 $B10
                  (local.get $l2)))
              (return
                (local.get $p0)))
            (return
              (f32.neg
                (local.get $p0))))
          (return
            (f32.sub
              (f32.const 0x1.921fb6p+1 (;=3.14159;))
              (f32.sub
                (local.get $p0)
                (f32.const -0x1.777a5cp-24 (;=-8.74228e-08;))))))
        (return
          (f32.sub
            (f32.sub
              (local.get $p0)
              (f32.const -0x1.777a5cp-24 (;=-8.74228e-08;)))
            (f32.const 0x1.921fb6p+1 (;=3.14159;)))))
      (unreachable))
    (select
      (f32.const -0x1.921fb6p+0 (;=-1.5708;))
      (f32.const 0x1.921fb6p+0 (;=1.5708;))
      (i32.and
        (local.get $l2)
        (i32.const 1))))
  (func $atan2 (export "atan2") (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (call $f12
      (local.get $p0)
      (local.get $p1)))
  (func $atanh (export "atanh") (type $t0) (param $p0 f32) (result f32)
    (local $l1 f32) (local $l2 i32)
    (local.set $l1
      (f32.abs
        (local.get $p0)))
    (f32.copysign
      (if $I0 (result f32)
        (i32.lt_u
          (local.tee $l2
            (i32.reinterpret_f32
              (local.get $p0)))
          (i32.const 1056964608))
        (then
          (if $I1 (result f32)
            (i32.ge_u
              (local.get $l2)
              (i32.const 796917760))
            (then
              (f32.mul
                (call $f5
                  (f32.mul
                    (f32.add
                      (local.get $l1)
                      (local.get $l1))
                    (f32.add
                      (f32.div
                        (local.get $l1)
                        (f32.sub
                          (f32.const 0x1p+0 (;=1;))
                          (local.get $l1)))
                      (f32.const 0x1p+0 (;=1;)))))
                (f32.const 0x1p-1 (;=0.5;))))
            (else
              (local.get $l1))))
        (else
          (f32.mul
            (call $f5
              (f32.mul
                (f32.div
                  (local.get $l1)
                  (f32.sub
                    (f32.const 0x1p+0 (;=1;))
                    (local.get $l1)))
                (f32.const 0x1p+1 (;=2;))))
            (f32.const 0x1p-1 (;=0.5;)))))
      (local.get $p0)))
  (func $f15 (type $t0) (param $p0 f32) (result f32)
    (local $l1 f64) (local $l2 f64) (local $l3 f64) (local $l4 i32) (local $l5 i32)
    (if $I0
      (i32.ge_u
        (local.tee $l4
          (i32.and
            (local.tee $l5
              (i32.reinterpret_f32
                (local.get $p0)))
            (i32.const 2147483647)))
        (i32.const 2139095040))
      (then
        (return
          (f32.add
            (local.get $p0)
            (local.get $p0)))))
    (local.set $l2
      (f64.mul
        (f64.mul
          (local.tee $l1
            (f64.promote_f32
              (f32.reinterpret_i32
                (i32.or
                  (if $I1 (result i32)
                    (i32.lt_u
                      (local.get $l4)
                      (i32.const 8388608))
                    (then
                      (if $I2
                        (i32.eqz
                          (local.get $l4))
                        (then
                          (return
                            (local.get $p0))))
                      (i32.add
                        (i32.div_u
                          (i32.and
                            (local.tee $l5
                              (i32.reinterpret_f32
                                (f32.mul
                                  (local.get $p0)
                                  (f32.const 0x1p+24 (;=1.67772e+07;)))))
                            (i32.const 2147483647))
                          (i32.const 3))
                        (i32.const 642849266)))
                    (else
                      (i32.add
                        (i32.div_u
                          (local.get $l4)
                          (i32.const 3))
                        (i32.const 709958130))))
                  (i32.and
                    (local.get $l5)
                    (i32.const -2147483648))))))
          (local.get $l1))
        (local.get $l1)))
    (local.set $l1
      (f64.mul
        (f64.mul
          (local.tee $l2
            (f64.div
              (f64.mul
                (local.get $l1)
                (f64.add
                  (local.tee $l3
                    (f64.add
                      (f64.promote_f32
                        (local.get $p0))
                      (f64.promote_f32
                        (local.get $p0))))
                  (local.get $l2)))
              (f64.add
                (f64.add
                  (f64.promote_f32
                    (local.get $p0))
                  (local.get $l2))
                (local.get $l2))))
          (local.get $l2))
        (local.get $l2)))
    (f32.demote_f64
      (f64.div
        (f64.mul
          (local.get $l2)
          (f64.add
            (local.get $l3)
            (local.get $l1)))
        (f64.add
          (f64.add
            (f64.promote_f32
              (local.get $p0))
            (local.get $l1))
          (local.get $l1)))))
  (func $cbrt (export "cbrt") (type $t0) (param $p0 f32) (result f32)
    (call $f15
      (local.get $p0)))
  (func $ceil (export "ceil") (type $t0) (param $p0 f32) (result f32)
    (f32.ceil
      (local.get $p0)))
  (func $f18 (type $t2) (param $p0 f64) (result i32)
    (i32.wrap_i64
      (i64.trunc_sat_f64_s
        (f64.sub
          (local.get $p0)
          (f64.mul
            (f64.floor
              (f64.mul
                (local.get $p0)
                (f64.const 0x1p-32 (;=2.32831e-10;))))
            (f64.const 0x1p+32 (;=4.29497e+09;)))))))
  (func $clz32 (export "clz32") (type $t0) (param $p0 f32) (result f32)
    (if $I0 (result f32)
      (f32.ne
        (f32.sub
          (local.get $p0)
          (local.get $p0))
        (f32.const 0x0p+0 (;=0;)))
      (then
        (f32.const 0x1p+5 (;=32;)))
      (else
        (f32.convert_i32_s
          (i32.clz
            (call $f18
              (f64.promote_f32
                (local.get $p0))))))))
  (func $f20 (type $t0) (param $p0 f32) (result f32)
    (local $l1 f64) (local $l2 f64) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i64) (local $l7 i64) (local $l8 i64)
    (local.set $l4
      (i32.shr_u
        (local.tee $l3
          (i32.reinterpret_f32
            (local.get $p0)))
        (i32.const 31)))
    (if $I0
      (i32.le_u
        (local.tee $l3
          (i32.and
            (local.get $l3)
            (i32.const 2147483647)))
        (i32.const 1061752794))
      (then
        (if $I1
          (i32.lt_u
            (local.get $l3)
            (i32.const 964689920))
          (then
            (return
              (f32.const 0x1p+0 (;=1;)))))
        (local.set $l2
          (f64.mul
            (local.tee $l1
              (f64.mul
                (local.tee $l1
                  (f64.promote_f32
                    (local.get $p0)))
                (local.get $l1)))
            (local.get $l1)))
        (return
          (f32.demote_f64
            (f64.add
              (f64.add
                (f64.add
                  (f64.mul
                    (local.get $l1)
                    (f64.const -0x1.ffffffd0c5e81p-2 (;=-0.5;)))
                  (f64.const 0x1p+0 (;=1;)))
                (f64.mul
                  (local.get $l2)
                  (f64.const 0x1.55553e1053a42p-5 (;=0.0416666;))))
              (f64.mul
                (f64.mul
                  (local.get $l2)
                  (local.get $l1))
                (f64.add
                  (f64.mul
                    (local.get $l1)
                    (f64.const 0x1.99342e0ee5069p-16 (;=2.43904e-05;)))
                  (f64.const -0x1.6c087e80f1e27p-10 (;=-0.00138868;)))))))))
    (if $I2
      (i32.ge_u
        (local.get $l3)
        (i32.const 2139095040))
      (then
        (return
          (f32.sub
            (local.get $p0)
            (local.get $p0)))))
    (local.set $l3
      (block $B3 (result i32)
        (if $I4
          (i32.lt_u
            (local.get $l3)
            (i32.const 1305022427))
          (then
            (global.set $g7
              (f64.sub
                (f64.sub
                  (f64.promote_f32
                    (local.get $p0))
                  (f64.mul
                    (local.tee $l1
                      (f64.nearest
                        (f64.mul
                          (f64.promote_f32
                            (local.get $p0))
                          (f64.const 0x1.45f306dc9c883p-1 (;=0.63662;)))))
                    (f64.const 0x1.921fb5p+0 (;=1.5708;))))
                (f64.mul
                  (local.get $l1)
                  (f64.const 0x1.110b4611a6263p-26 (;=1.58933e-08;)))))
            (br $B3
              (i32.trunc_sat_f64_s
                (local.get $l1)))))
        (local.set $l7
          (i64.extend_i32_s
            (i32.and
              (local.tee $l5
                (i32.sub
                  (i32.shr_s
                    (local.get $l3)
                    (i32.const 23))
                  (i32.const 152)))
              (i32.const 63))))
        (local.set $l6
          (i64.load offset=8
            (local.tee $l5
              (i32.add
                (i32.shl
                  (i32.shr_s
                    (local.get $l5)
                    (i32.const 6))
                  (i32.const 3))
                (i32.const 1024)))))
        (global.set $g7
          (f64.mul
            (f64.copysign
              (f64.const 0x1.921fb54442d18p-64 (;=8.5153e-20;))
              (f64.promote_f32
                (local.get $p0)))
            (f64.convert_i64_s
              (local.tee $l7
                (i64.shl
                  (local.tee $l6
                    (i64.add
                      (i64.mul
                        (local.tee $l8
                          (i64.extend_i32_s
                            (i32.or
                              (i32.and
                                (local.get $l3)
                                (i32.const 8388607))
                              (i32.const 8388608))))
                        (i64.or
                          (i64.shl
                            (i64.load
                              (local.get $l5))
                            (local.get $l7))
                          (i64.shr_u
                            (local.get $l6)
                            (i64.sub
                              (i64.const 64)
                              (local.get $l7)))))
                      (i64.shr_u
                        (i64.mul
                          (if $I5 (result i64)
                            (i64.gt_u
                              (local.get $l7)
                              (i64.const 32))
                            (then
                              (i64.or
                                (i64.shl
                                  (local.get $l6)
                                  (i64.sub
                                    (local.get $l7)
                                    (i64.const 32)))
                                (i64.shr_u
                                  (i64.load offset=16
                                    (local.get $l5))
                                  (i64.sub
                                    (i64.const 96)
                                    (local.get $l7)))))
                            (else
                              (i64.shr_u
                                (local.get $l6)
                                (i64.sub
                                  (i64.const 32)
                                  (local.get $l7)))))
                          (local.get $l8))
                        (i64.const 32))))
                  (i64.const 2))))))
        (select
          (i32.sub
            (i32.const 0)
            (local.tee $l3
              (i32.wrap_i64
                (i64.add
                  (i64.shr_u
                    (local.get $l6)
                    (i64.const 62))
                  (i64.shr_u
                    (local.get $l7)
                    (i64.const 63))))))
          (local.get $l3)
          (local.get $l4))))
    (local.set $l1
      (global.get $g7))
    (select
      (f32.neg
        (local.tee $p0
          (if $I6 (result f32)
            (i32.and
              (local.get $l3)
              (i32.const 1))
            (then
              (f32.demote_f64
                (f64.add
                  (f64.add
                    (local.get $l1)
                    (f64.mul
                      (local.tee $l1
                        (f64.mul
                          (local.tee $l2
                            (f64.mul
                              (local.get $l1)
                              (local.get $l1)))
                          (local.get $l1)))
                      (f64.add
                        (f64.mul
                          (local.get $l2)
                          (f64.const 0x1.11110896efbb2p-7 (;=0.00833333;)))
                        (f64.const -0x1.5555554cbac77p-3 (;=-0.166667;)))))
                  (f64.mul
                    (f64.mul
                      (local.get $l1)
                      (f64.mul
                        (local.get $l2)
                        (local.get $l2)))
                    (f64.add
                      (f64.mul
                        (local.get $l2)
                        (f64.const 0x1.6cd878c3b46a7p-19 (;=2.71831e-06;)))
                      (f64.const -0x1.a00f9e2cae774p-13 (;=-0.000198393;)))))))
            (else
              (local.set $l2
                (f64.mul
                  (local.tee $l1
                    (f64.mul
                      (local.get $l1)
                      (local.get $l1)))
                  (local.get $l1)))
              (f32.demote_f64
                (f64.add
                  (f64.add
                    (f64.add
                      (f64.mul
                        (local.get $l1)
                        (f64.const -0x1.ffffffd0c5e81p-2 (;=-0.5;)))
                      (f64.const 0x1p+0 (;=1;)))
                    (f64.mul
                      (local.get $l2)
                      (f64.const 0x1.55553e1053a42p-5 (;=0.0416666;))))
                  (f64.mul
                    (f64.mul
                      (local.get $l2)
                      (local.get $l1))
                    (f64.add
                      (f64.mul
                        (local.get $l1)
                        (f64.const 0x1.99342e0ee5069p-16 (;=2.43904e-05;)))
                      (f64.const -0x1.6c087e80f1e27p-10 (;=-0.00138868;))))))))))
      (local.get $p0)
      (i32.and
        (i32.add
          (local.get $l3)
          (i32.const 1))
        (i32.const 2))))
  (func $cos (export "cos") (type $t0) (param $p0 f32) (result f32)
    (call $f20
      (local.get $p0)))
  (func $f22 (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 f32) (local $l5 f32) (local $l6 f32) (local $l7 f32)
    (local.set $l2
      (i32.and
        (local.tee $l3
          (i32.reinterpret_f32
            (local.get $p0)))
        (i32.const 2147483647)))
    (local.set $l3
      (i32.shr_u
        (local.get $l3)
        (i32.const 31)))
    (if $I0
      (i32.ge_u
        (local.get $l2)
        (i32.const 1100331076))
      (then
        (if $I1
          (i32.gt_u
            (local.get $l2)
            (i32.const 2139095040))
          (then
            (return
              (local.get $p0))))
        (if $I2
          (local.get $l3)
          (then
            (return
              (f32.const -0x1p+0 (;=-1;)))))
        (if $I3
          (i32.gt_u
            (local.get $l2)
            (i32.const 1118925335))
          (then
            (return
              (f32.mul
                (local.get $p0)
                (f32.const 0x1p+127 (;=1.70141e+38;))))))))
    (if $I4
      (i32.gt_u
        (local.get $l2)
        (i32.const 1051816472))
      (then
        (local.set $l4
          (f32.sub
            (f32.sub
              (local.tee $l4
                (f32.sub
                  (local.get $p0)
                  (f32.mul
                    (local.tee $p0
                      (f32.convert_i32_s
                        (local.tee $l1
                          (select
                            (i32.sub
                              (i32.const 1)
                              (i32.shl
                                (local.get $l3)
                                (i32.const 1)))
                            (i32.trunc_sat_f32_s
                              (f32.add
                                (f32.mul
                                  (local.get $p0)
                                  (f32.const 0x1.715476p+0 (;=1.4427;)))
                                (f32.copysign
                                  (f32.const 0x1p-1 (;=0.5;))
                                  (local.get $p0))))
                            (i32.lt_u
                              (local.get $l2)
                              (i32.const 1065686418))))))
                    (f32.const 0x1.62e3p-1 (;=0.693138;)))))
              (local.tee $p0
                (f32.sub
                  (local.get $l4)
                  (local.tee $l4
                    (f32.mul
                      (local.get $p0)
                      (f32.const 0x1.2fefa2p-17 (;=9.058e-06;)))))))
            (local.get $l4))))
      (else
        (if $I5
          (i32.lt_u
            (local.get $l2)
            (i32.const 855638016))
          (then
            (return
              (local.get $p0))))))
    (local.set $l6
      (f32.sub
        (f32.const 0x1.8p+1 (;=3;))
        (f32.mul
          (local.tee $l7
            (f32.add
              (f32.mul
                (local.tee $l5
                  (f32.mul
                    (local.get $p0)
                    (local.tee $l6
                      (f32.mul
                        (local.get $p0)
                        (f32.const 0x1p-1 (;=0.5;))))))
                (f32.add
                  (f32.mul
                    (local.get $l5)
                    (f32.const 0x1.9e602p-10 (;=0.00158072;)))
                  (f32.const -0x1.1110dp-5 (;=-0.0333332;))))
              (f32.const 0x1p+0 (;=1;))))
          (local.get $l6))))
    (local.set $l6
      (f32.mul
        (local.get $l5)
        (f32.div
          (f32.sub
            (local.get $l7)
            (local.get $l6))
          (f32.sub
            (f32.const 0x1.8p+2 (;=6;))
            (f32.mul
              (local.get $p0)
              (local.get $l6))))))
    (if $I6
      (i32.eqz
        (local.get $l1))
      (then
        (return
          (f32.sub
            (local.get $p0)
            (f32.sub
              (f32.mul
                (local.get $p0)
                (local.get $l6))
              (local.get $l5))))))
    (local.set $l4
      (f32.sub
        (f32.sub
          (f32.mul
            (local.get $p0)
            (f32.sub
              (local.get $l6)
              (local.get $l4)))
          (local.get $l4))
        (local.get $l5)))
    (if $I7
      (i32.eq
        (local.get $l1)
        (i32.const -1))
      (then
        (return
          (f32.sub
            (f32.mul
              (f32.sub
                (local.get $p0)
                (local.get $l4))
              (f32.const 0x1p-1 (;=0.5;)))
            (f32.const 0x1p-1 (;=0.5;))))))
    (if $I8
      (i32.eq
        (local.get $l1)
        (i32.const 1))
      (then
        (if $I9
          (f32.lt
            (local.get $p0)
            (f32.const -0x1p-2 (;=-0.25;)))
          (then
            (return
              (f32.mul
                (f32.sub
                  (local.get $l4)
                  (f32.add
                    (local.get $p0)
                    (f32.const 0x1p-1 (;=0.5;))))
                (f32.const -0x1p+1 (;=-2;))))))
        (return
          (f32.add
            (f32.mul
              (f32.sub
                (local.get $p0)
                (local.get $l4))
              (f32.const 0x1p+1 (;=2;)))
            (f32.const 0x1p+0 (;=1;))))))
    (local.set $l5
      (f32.reinterpret_i32
        (i32.shl
          (i32.add
            (local.get $l1)
            (i32.const 127))
          (i32.const 23))))
    (if $I10
      (i32.or
        (i32.lt_s
          (local.get $l1)
          (i32.const 0))
        (i32.gt_s
          (local.get $l1)
          (i32.const 56)))
      (then
        (return
          (f32.sub
            (select
              (f32.mul
                (f32.add
                  (local.tee $p0
                    (f32.add
                      (f32.sub
                        (local.get $p0)
                        (local.get $l4))
                      (f32.const 0x1p+0 (;=1;))))
                  (local.get $p0))
                (f32.const 0x1p+127 (;=1.70141e+38;)))
              (f32.mul
                (local.get $p0)
                (local.get $l5))
              (i32.eq
                (local.get $l1)
                (i32.const 128)))
            (f32.const 0x1p+0 (;=1;))))))
    (f32.mul
      (f32.add
        (local.get $p0)
        (select
          (f32.sub
            (f32.sub
              (f32.const 0x1p+0 (;=1;))
              (local.tee $p0
                (f32.reinterpret_i32
                  (i32.shl
                    (i32.sub
                      (i32.const 127)
                      (local.get $l1))
                    (i32.const 23)))))
            (local.get $l4))
          (f32.sub
            (f32.const 0x1p+0 (;=1;))
            (f32.add
              (local.get $l4)
              (local.get $p0)))
          (i32.lt_s
            (local.get $l1)
            (i32.const 20))))
      (local.get $l5)))
  (func $f23 (type $t0) (param $p0 f32) (result f32)
    (local $l1 f32) (local $l2 f32) (local $l3 i32) (local $l4 i32) (local $l5 i32)
    (local.set $l4
      (i32.shr_u
        (local.tee $l5
          (i32.reinterpret_f32
            (local.get $p0)))
        (i32.const 31)))
    (if $I0
      (i32.ge_u
        (local.tee $l5
          (i32.and
            (local.get $l5)
            (i32.const 2147483647)))
        (i32.const 1118743632))
      (then
        (if $I1
          (i32.gt_u
            (local.get $l5)
            (i32.const 2139095040))
          (then
            (return
              (local.get $p0))))
        (if $I2
          (i32.ge_u
            (local.get $l5)
            (i32.const 1118925336))
          (then
            (if $I3
              (local.get $l4)
              (then
                (if $I4
                  (i32.ge_u
                    (local.get $l5)
                    (i32.const 1120924085))
                  (then
                    (return
                      (f32.const 0x0p+0 (;=0;))))))
              (else
                (return
                  (f32.mul
                    (local.get $p0)
                    (f32.const 0x1p+127 (;=1.70141e+38;))))))))))
    (if $I5
      (i32.gt_u
        (local.get $l5)
        (i32.const 1051816472))
      (then
        (local.set $p0
          (f32.sub
            (local.tee $l1
              (f32.sub
                (local.get $p0)
                (f32.mul
                  (f32.convert_i32_s
                    (local.tee $l3
                      (select
                        (i32.trunc_sat_f32_s
                          (f32.add
                            (f32.mul
                              (local.get $p0)
                              (f32.const 0x1.715476p+0 (;=1.4427;)))
                            (f32.copysign
                              (f32.const 0x1p-1 (;=0.5;))
                              (local.get $p0))))
                        (i32.sub
                          (i32.const 1)
                          (i32.shl
                            (local.get $l4)
                            (i32.const 1)))
                        (i32.gt_u
                          (local.get $l5)
                          (i32.const 1065686418)))))
                  (f32.const 0x1.62e4p-1 (;=0.693146;)))))
            (local.tee $l2
              (f32.mul
                (f32.convert_i32_s
                  (local.get $l3))
                (f32.const 0x1.7f7d1cp-20 (;=1.42861e-06;)))))))
      (else
        (local.set $l1
          (if $I6 (result f32)
            (i32.gt_u
              (local.get $l5)
              (i32.const 956301312))
            (then
              (local.get $p0))
            (else
              (return
                (f32.add
                  (local.get $p0)
                  (f32.const 0x1p+0 (;=1;)))))))))
    (local.set $p0
      (f32.add
        (f32.add
          (f32.sub
            (f32.div
              (f32.mul
                (local.get $p0)
                (local.tee $p0
                  (f32.sub
                    (local.get $p0)
                    (f32.mul
                      (local.tee $p0
                        (f32.mul
                          (local.get $p0)
                          (local.get $p0)))
                      (f32.add
                        (f32.mul
                          (local.get $p0)
                          (f32.const -0x1.6aa42ap-9 (;=-0.00276673;)))
                        (f32.const 0x1.55551ep-3 (;=0.166666;)))))))
              (f32.sub
                (f32.const 0x1p+1 (;=2;))
                (local.get $p0)))
            (local.get $l2))
          (local.get $l1))
        (f32.const 0x1p+0 (;=1;))))
    (if $I7 (result f32)
      (local.get $l3)
      (then
        (f32.mul
          (if $I8 (result f32)
            (i32.gt_s
              (local.get $l3)
              (i32.const 127))
            (then
              (local.set $p0
                (f32.mul
                  (local.get $p0)
                  (f32.const 0x1p+127 (;=1.70141e+38;))))
              (if $I9 (result f32)
                (i32.gt_s
                  (local.tee $l3
                    (i32.sub
                      (local.get $l3)
                      (i32.const 127)))
                  (i32.const 127))
                (then
                  (local.set $l3
                    (select
                      (local.tee $l3
                        (i32.sub
                          (local.get $l3)
                          (i32.const 127)))
                      (i32.const 127)
                      (i32.lt_s
                        (local.get $l3)
                        (i32.const 127))))
                  (f32.mul
                    (local.get $p0)
                    (f32.const 0x1p+127 (;=1.70141e+38;))))
                (else
                  (local.get $p0))))
            (else
              (if $I10 (result f32)
                (i32.lt_s
                  (local.get $l3)
                  (i32.const -126))
                (then
                  (local.set $p0
                    (f32.mul
                      (local.get $p0)
                      (f32.const 0x1p-102 (;=1.97215e-31;))))
                  (if $I11 (result f32)
                    (i32.lt_s
                      (local.tee $l3
                        (i32.add
                          (local.get $l3)
                          (i32.const 102)))
                      (i32.const -126))
                    (then
                      (local.set $l3
                        (select
                          (local.tee $l3
                            (i32.add
                              (local.get $l3)
                              (i32.const 102)))
                          (i32.const -126)
                          (i32.gt_s
                            (local.get $l3)
                            (i32.const -126))))
                      (f32.mul
                        (local.get $p0)
                        (f32.const 0x1p-102 (;=1.97215e-31;))))
                    (else
                      (local.get $p0))))
                (else
                  (local.get $p0)))))
          (f32.reinterpret_i32
            (i32.shl
              (i32.add
                (local.get $l3)
                (i32.const 127))
              (i32.const 23)))))
      (else
        (local.get $p0))))
  (func $cosh (export "cosh") (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32)
    (block $B0 (result f32)
      (local.set $p0
        (f32.reinterpret_i32
          (local.tee $l1
            (i32.and
              (i32.reinterpret_f32
                (local.get $p0))
              (i32.const 2147483647)))))
      (if $I1
        (i32.lt_u
          (local.get $l1)
          (i32.const 1060205079))
        (then
          (drop
            (br_if $B0
              (f32.const 0x1p+0 (;=1;))
              (i32.lt_u
                (local.get $l1)
                (i32.const 964689920))))
          (br $B0
            (f32.add
              (f32.div
                (f32.mul
                  (local.tee $p0
                    (call $f22
                      (local.get $p0)))
                  (local.get $p0))
                (f32.add
                  (f32.add
                    (local.get $p0)
                    (local.get $p0))
                  (f32.const 0x1p+1 (;=2;))))
              (f32.const 0x1p+0 (;=1;))))))
      (if $I2
        (i32.lt_u
          (local.get $l1)
          (i32.const 1118925335))
        (then
          (br $B0
            (f32.add
              (f32.mul
                (local.tee $p0
                  (call $f23
                    (local.get $p0)))
                (f32.const 0x1p-1 (;=0.5;)))
              (f32.div
                (f32.const 0x1p-1 (;=0.5;))
                (local.get $p0))))))
      (f32.mul
        (f32.mul
          (call $f23
            (f32.sub
              (local.get $p0)
              (f32.const 0x1.45c778p+7 (;=162.89;))))
          (f32.const 0x1p+117 (;=1.66153e+35;)))
        (f32.const 0x1p+117 (;=1.66153e+35;)))))
  (func $exp (export "exp") (type $t0) (param $p0 f32) (result f32)
    (call $f23
      (local.get $p0)))
  (func $expm1 (export "expm1") (type $t0) (param $p0 f32) (result f32)
    (call $f22
      (local.get $p0)))
  (func $floor (export "floor") (type $t0) (param $p0 f32) (result f32)
    (f32.floor
      (local.get $p0)))
  (func $fround (export "fround") (type $t0) (param $p0 f32) (result f32)
    (local.get $p0))
  (func $f29 (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 f32)
    (if $I0
      (i32.gt_u
        (local.tee $l3
          (i32.and
            (i32.reinterpret_f32
              (local.get $p1))
            (i32.const 2147483647)))
        (local.tee $l2
          (i32.and
            (i32.reinterpret_f32
              (local.get $p0))
            (i32.const 2147483647))))
      (then
        (local.set $l4
          (local.get $l2))
        (local.set $l2
          (local.get $l3))
        (local.set $l3
          (local.get $l4))))
    (local.set $p1
      (f32.reinterpret_i32
        (local.get $l3)))
    (if $I1
      (i32.eq
        (local.get $l3)
        (i32.const 2139095040))
      (then
        (return
          (local.get $p1))))
    (local.set $l5
      (f32.reinterpret_i32
        (local.get $l2)))
    (if $I2
      (i32.or
        (i32.or
          (i32.eqz
            (local.get $l3))
          (i32.ge_u
            (local.get $l2)
            (i32.const 2139095040)))
        (i32.ge_u
          (i32.sub
            (local.get $l2)
            (local.get $l3))
          (i32.const 209715200)))
      (then
        (return
          (f32.add
            (local.get $l5)
            (local.get $p1)))))
    (local.set $p0
      (f32.const 0x1p+0 (;=1;)))
    (local.set $l5
      (if $I3 (result f32)
        (i32.ge_u
          (local.get $l2)
          (i32.const 1568669696))
        (then
          (local.set $p0
            (f32.const 0x1p+90 (;=1.23794e+27;)))
          (local.set $p1
            (f32.mul
              (local.get $p1)
              (f32.const 0x1p-90 (;=8.07794e-28;))))
          (f32.mul
            (local.get $l5)
            (f32.const 0x1p-90 (;=8.07794e-28;))))
        (else
          (if $I4 (result f32)
            (i32.lt_u
              (local.get $l3)
              (i32.const 562036736))
            (then
              (local.set $p0
                (f32.const 0x1p-90 (;=8.07794e-28;)))
              (local.set $p1
                (f32.mul
                  (local.get $p1)
                  (f32.const 0x1p+90 (;=1.23794e+27;))))
              (f32.mul
                (local.get $l5)
                (f32.const 0x1p+90 (;=1.23794e+27;))))
            (else
              (local.get $l5))))))
    (f32.mul
      (local.get $p0)
      (f32.sqrt
        (f32.demote_f64
          (f64.add
            (f64.mul
              (f64.promote_f32
                (local.get $l5))
              (f64.promote_f32
                (local.get $l5)))
            (f64.mul
              (f64.promote_f32
                (local.get $p1))
              (f64.promote_f32
                (local.get $p1))))))))
  (func $hypot (export "hypot") (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (call $f29
      (local.get $p0)
      (local.get $p1)))
  (func $imul (export "imul") (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (local $l2 f32)
    (if $I0 (result f32)
      (f32.ne
        (f32.sub
          (local.tee $l2
            (f32.add
              (local.get $p0)
              (local.get $p1)))
          (local.get $l2))
        (f32.const 0x0p+0 (;=0;)))
      (then
        (f32.const 0x0p+0 (;=0;)))
      (else
        (f32.convert_i32_s
          (i32.mul
            (call $f18
              (f64.promote_f32
                (local.get $p0)))
            (call $f18
              (f64.promote_f32
                (local.get $p1))))))))
  (func $log (export "log") (type $t0) (param $p0 f32) (result f32)
    (call $f6
      (local.get $p0)))
  (func $f33 (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 f32) (local $l5 f32) (local $l6 f32) (local $l7 f32) (local $l8 f32)
    (if $I0
      (i32.or
        (local.tee $l2
          (i32.shr_u
            (local.tee $l1
              (i32.reinterpret_f32
                (local.get $p0)))
            (i32.const 31)))
        (i32.lt_u
          (local.get $l1)
          (i32.const 8388608)))
      (then
        (if $I1
          (i32.eqz
            (i32.shl
              (local.get $l1)
              (i32.const 1)))
          (then
            (return
              (f32.div
                (f32.const -0x1p+0 (;=-1;))
                (f32.mul
                  (local.get $p0)
                  (local.get $p0))))))
        (if $I2
          (local.get $l2)
          (then
            (return
              (f32.div
                (f32.sub
                  (local.get $p0)
                  (local.get $p0))
                (f32.const 0x0p+0 (;=0;))))))
        (local.set $l3
          (i32.const -25))
        (local.set $l1
          (i32.reinterpret_f32
            (f32.mul
              (local.get $p0)
              (f32.const 0x1p+25 (;=3.35544e+07;))))))
      (else
        (if $I3
          (i32.ge_u
            (local.get $l1)
            (i32.const 2139095040))
          (then
            (return
              (local.get $p0)))
          (else
            (if $I4
              (i32.eq
                (local.get $l1)
                (i32.const 1065353216))
              (then
                (return
                  (f32.const 0x0p+0 (;=0;)))))))))
    (local.set $l7
      (f32.mul
        (local.tee $l4
          (f32.mul
            (local.tee $p0
              (f32.div
                (local.tee $l6
                  (f32.sub
                    (f32.reinterpret_i32
                      (i32.add
                        (i32.and
                          (local.tee $l1
                            (i32.add
                              (local.get $l1)
                              (i32.const 4913933)))
                          (i32.const 8388607))
                        (i32.const 1060439283)))
                    (f32.const 0x1p+0 (;=1;))))
                (f32.add
                  (local.get $l6)
                  (f32.const 0x1p+1 (;=2;)))))
            (local.get $p0)))
        (local.get $l4)))
    (f32.add
      (f32.add
        (f32.add
          (f32.add
            (f32.mul
              (local.tee $l5
                (f32.convert_i32_s
                  (i32.add
                    (local.get $l3)
                    (i32.sub
                      (i32.shr_u
                        (local.get $l1)
                        (i32.const 23))
                      (i32.const 127)))))
              (f32.const 0x1.a84fb6p-21 (;=7.90342e-07;)))
            (f32.mul
              (f32.add
                (local.tee $p0
                  (f32.add
                    (f32.sub
                      (f32.sub
                        (local.get $l6)
                        (local.tee $l8
                          (f32.reinterpret_i32
                            (i32.and
                              (i32.reinterpret_f32
                                (f32.sub
                                  (local.get $l6)
                                  (local.tee $l6
                                    (f32.mul
                                      (f32.mul
                                        (local.get $l6)
                                        (f32.const 0x1p-1 (;=0.5;)))
                                      (local.get $l6)))))
                              (i32.const -4096)))))
                      (local.get $l6))
                    (f32.mul
                      (local.get $p0)
                      (f32.add
                        (local.get $l6)
                        (f32.add
                          (f32.mul
                            (local.get $l4)
                            (f32.add
                              (f32.mul
                                (local.get $l7)
                                (f32.const 0x1.23d3dcp-2 (;=0.284988;)))
                              (f32.const 0x1.555554p-1 (;=0.666667;))))
                          (f32.mul
                            (local.get $l7)
                            (f32.add
                              (f32.mul
                                (local.get $l7)
                                (f32.const 0x1.f13c4cp-3 (;=0.242791;)))
                              (f32.const 0x1.999c26p-2 (;=0.40001;)))))))))
                (local.get $l8))
              (f32.const -0x1.09d5b2p-15 (;=-3.169e-05;))))
          (f32.mul
            (local.get $p0)
            (f32.const 0x1.bccp-2 (;=0.434326;))))
        (f32.mul
          (local.get $l8)
          (f32.const 0x1.bccp-2 (;=0.434326;))))
      (f32.mul
        (local.get $l5)
        (f32.const 0x1.3441p-2 (;=0.301029;)))))
  (func $log10 (export "log10") (type $t0) (param $p0 f32) (result f32)
    (call $f33
      (local.get $p0)))
  (func $log1p (export "log1p") (type $t0) (param $p0 f32) (result f32)
    (call $f5
      (local.get $p0)))
  (func $f36 (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 f32) (local $l5 f32) (local $l6 f32) (local $l7 f32)
    (if $I0
      (i32.or
        (local.tee $l2
          (i32.shr_u
            (local.tee $l1
              (i32.reinterpret_f32
                (local.get $p0)))
            (i32.const 31)))
        (i32.lt_u
          (local.get $l1)
          (i32.const 8388608)))
      (then
        (if $I1
          (i32.eqz
            (i32.shl
              (local.get $l1)
              (i32.const 1)))
          (then
            (return
              (f32.div
                (f32.const -0x1p+0 (;=-1;))
                (f32.mul
                  (local.get $p0)
                  (local.get $p0))))))
        (if $I2
          (local.get $l2)
          (then
            (return
              (f32.div
                (f32.sub
                  (local.get $p0)
                  (local.get $p0))
                (f32.const 0x0p+0 (;=0;))))))
        (local.set $l3
          (i32.const -25))
        (local.set $l1
          (i32.reinterpret_f32
            (f32.mul
              (local.get $p0)
              (f32.const 0x1p+25 (;=3.35544e+07;))))))
      (else
        (if $I3
          (i32.ge_u
            (local.get $l1)
            (i32.const 2139095040))
          (then
            (return
              (local.get $p0)))
          (else
            (if $I4
              (i32.eq
                (local.get $l1)
                (i32.const 1065353216))
              (then
                (return
                  (f32.const 0x0p+0 (;=0;)))))))))
    (local.set $l6
      (f32.mul
        (local.tee $l4
          (f32.mul
            (local.tee $p0
              (f32.div
                (local.tee $l5
                  (f32.sub
                    (f32.reinterpret_i32
                      (i32.add
                        (i32.and
                          (local.tee $l1
                            (i32.add
                              (local.get $l1)
                              (i32.const 4913933)))
                          (i32.const 8388607))
                        (i32.const 1060439283)))
                    (f32.const 0x1p+0 (;=1;))))
                (f32.add
                  (local.get $l5)
                  (f32.const 0x1p+1 (;=2;)))))
            (local.get $p0)))
        (local.get $l4)))
    (f32.add
      (f32.add
        (f32.add
          (f32.mul
            (f32.add
              (local.tee $p0
                (f32.add
                  (f32.sub
                    (f32.sub
                      (local.get $l5)
                      (local.tee $l7
                        (f32.reinterpret_i32
                          (i32.and
                            (i32.reinterpret_f32
                              (f32.sub
                                (local.get $l5)
                                (local.tee $l5
                                  (f32.mul
                                    (f32.mul
                                      (local.get $l5)
                                      (f32.const 0x1p-1 (;=0.5;)))
                                    (local.get $l5)))))
                            (i32.const -4096)))))
                    (local.get $l5))
                  (f32.mul
                    (local.get $p0)
                    (f32.add
                      (local.get $l5)
                      (f32.add
                        (f32.mul
                          (local.get $l4)
                          (f32.add
                            (f32.mul
                              (local.get $l6)
                              (f32.const 0x1.23d3dcp-2 (;=0.284988;)))
                            (f32.const 0x1.555554p-1 (;=0.666667;))))
                        (f32.mul
                          (local.get $l6)
                          (f32.add
                            (f32.mul
                              (local.get $l6)
                              (f32.const 0x1.f13c4cp-3 (;=0.242791;)))
                            (f32.const 0x1.999c26p-2 (;=0.40001;)))))))))
              (local.get $l7))
            (f32.const -0x1.7135a8p-13 (;=-0.000176053;)))
          (f32.mul
            (local.get $p0)
            (f32.const 0x1.716p+0 (;=1.44287;))))
        (f32.mul
          (local.get $l7)
          (f32.const 0x1.716p+0 (;=1.44287;))))
      (f32.convert_i32_s
        (i32.add
          (local.get $l3)
          (i32.sub
            (i32.shr_u
              (local.get $l1)
              (i32.const 23))
            (i32.const 127))))))
  (func $log2 (export "log2") (type $t0) (param $p0 f32) (result f32)
    (call $f36
      (local.get $p0)))
  (func $max (export "max") (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (f32.max
      (local.get $p0)
      (local.get $p1)))
  (func $min (export "min") (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (f32.min
      (local.get $p0)
      (local.get $p1)))
  (func $f40 (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (local $l2 f64) (local $l3 f64) (local $l4 f64) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i64) (local $l10 i64) (local $l11 f32)
    (if $I0
      (f32.le
        (f32.abs
          (local.get $p1))
        (f32.const 0x1p+1 (;=2;)))
      (then
        (if $I1
          (f32.eq
            (local.get $p1)
            (f32.const 0x1p+1 (;=2;)))
          (then
            (return
              (f32.mul
                (local.get $p0)
                (local.get $p0)))))
        (if $I2
          (f32.eq
            (local.get $p1)
            (f32.const 0x1p-1 (;=0.5;)))
          (then
            (return
              (select
                (f32.abs
                  (f32.sqrt
                    (local.get $p0)))
                (f32.const inf (;=inf;))
                (f32.ne
                  (local.get $p0)
                  (f32.const -inf (;=-inf;)))))))
        (if $I3
          (f32.eq
            (local.get $p1)
            (f32.const -0x1p+0 (;=-1;)))
          (then
            (return
              (f32.div
                (f32.const 0x1p+0 (;=1;))
                (local.get $p0)))))
        (if $I4
          (f32.eq
            (local.get $p1)
            (f32.const 0x1p+0 (;=1;)))
          (then
            (return
              (local.get $p0))))
        (if $I5
          (f32.eq
            (local.get $p1)
            (f32.const 0x0p+0 (;=0;)))
          (then
            (return
              (f32.const 0x1p+0 (;=1;)))))))
    (if $I6
      (f32.eq
        (local.get $p1)
        (f32.const 0x0p+0 (;=0;)))
      (then
        (return
          (f32.const 0x1p+0 (;=1;)))))
    (if $I7
      (i32.or
        (f32.ne
          (local.get $p0)
          (local.get $p0))
        (f32.ne
          (local.get $p1)
          (local.get $p1)))
      (then
        (return
          (f32.const nan (;=nan;)))))
    (if $I8
      (i32.and
        (local.tee $l5
          (i32.shr_u
            (local.tee $l8
              (i32.reinterpret_f32
                (local.get $p0)))
            (i32.const 31)))
        (f32.eq
          (f32.nearest
            (local.get $p1))
          (local.get $p1)))
      (then
        (local.set $l5
          (i32.const 0))
        (local.set $l7
          (i32.shl
            (f32.ne
              (local.tee $l11
                (f32.mul
                  (local.get $p1)
                  (f32.const 0x1p-1 (;=0.5;))))
              (f32.nearest
                (local.get $l11)))
            (i32.const 31)))
        (local.set $p0
          (f32.neg
            (local.get $p0)))))
    (local.set $l6
      (i32.reinterpret_f32
        (local.get $p1)))
    (f32.reinterpret_i32
      (i32.or
        (if $I9 (result i32)
          (i32.eq
            (local.tee $l8
              (i32.and
                (local.get $l8)
                (i32.const 2147483647)))
            (i32.const 1065353216))
          (then
            (select
              (i32.const 2143289344)
              (i32.const 1065353216)
              (i32.or
                (local.get $l5)
                (i32.eq
                  (i32.and
                    (local.get $l6)
                    (i32.const 2147483647))
                  (i32.const 2139095040)))))
          (else
            (if $I10 (result i32)
              (local.get $l8)
              (then
                (if $I11 (result i32)
                  (i32.eq
                    (local.get $l8)
                    (i32.const 2139095040))
                  (then
                    (select
                      (i32.const 0)
                      (i32.const 2139095040)
                      (i32.lt_s
                        (local.get $l6)
                        (i32.const 0))))
                  (else
                    (if $I12 (result i32)
                      (local.get $l5)
                      (then
                        (i32.const 2143289344))
                      (else
                        (i32.reinterpret_f32
                          (f32.demote_f64
                            (block $B13 (result f64)
                              (local.set $l9
                                (i64.shr_s
                                  (i64.sub
                                    (local.tee $l10
                                      (i64.reinterpret_f64
                                        (f64.promote_f32
                                          (local.get $p0))))
                                    (i64.const 4604544271217802189))
                                  (i64.const 52)))
                              (local.set $l3
                                (f64.mul
                                  (local.tee $l2
                                    (f64.div
                                      (f64.sub
                                        (local.tee $l2
                                          (f64.reinterpret_i64
                                            (i64.sub
                                              (local.get $l10)
                                              (i64.shl
                                                (local.get $l9)
                                                (i64.const 52)))))
                                        (f64.const 0x1p+0 (;=1;)))
                                      (f64.add
                                        (local.get $l2)
                                        (f64.const 0x1p+0 (;=1;)))))
                                  (local.get $l2)))
                              (drop
                                (br_if $B13
                                  (f64.const 0x0p+0 (;=0;))
                                  (f64.lt
                                    (local.tee $l2
                                      (f64.mul
                                        (f64.promote_f32
                                          (local.get $p1))
                                        (f64.add
                                          (f64.mul
                                            (f64.add
                                              (local.get $l2)
                                              (f64.mul
                                                (f64.mul
                                                  (local.get $l2)
                                                  (local.get $l3))
                                                (f64.add
                                                  (f64.add
                                                    (f64.mul
                                                      (local.get $l3)
                                                      (f64.const 0x1.999a7a8af4132p-3 (;=0.200002;)))
                                                    (f64.const 0x1.555554fd9caefp-2 (;=0.333333;)))
                                                  (f64.mul
                                                    (f64.add
                                                      (f64.mul
                                                        (local.get $l3)
                                                        (f64.const 0x1.e2f663b001c97p-4 (;=0.117911;)))
                                                      (f64.const 0x1.2438d7943703p-3 (;=0.142687;)))
                                                    (f64.mul
                                                      (local.get $l3)
                                                      (local.get $l3))))))
                                            (f64.const 0x1.71547652b82fep+1 (;=2.88539;)))
                                          (f64.convert_i64_s
                                            (local.get $l9)))))
                                    (f64.const -0x1.ffp+9 (;=-1022;)))))
                              (drop
                                (br_if $B13
                                  (f64.const inf (;=inf;))
                                  (f64.ge
                                    (local.get $l2)
                                    (f64.const 0x1p+10 (;=1024;)))))
                              (local.set $l2
                                (f64.mul
                                  (local.tee $l4
                                    (f64.sub
                                      (local.get $l2)
                                      (local.tee $l3
                                        (f64.nearest
                                          (local.get $l2)))))
                                  (local.get $l4)))
                              (f64.reinterpret_i64
                                (i64.add
                                  (i64.reinterpret_f64
                                    (f64.add
                                      (f64.mul
                                        (local.get $l4)
                                        (f64.add
                                          (f64.add
                                            (f64.add
                                              (f64.mul
                                                (local.get $l4)
                                                (f64.const 0x1.ebfbe07d97b91p-3 (;=0.240227;)))
                                              (f64.const 0x1.62e4302fcc24ap-1 (;=0.693147;)))
                                            (f64.mul
                                              (f64.add
                                                (f64.mul
                                                  (local.get $l4)
                                                  (f64.const 0x1.3b29e3ce9aef6p-7 (;=0.00961803;)))
                                                (f64.const 0x1.c6af6ccfc1a65p-5 (;=0.0555036;)))
                                              (local.get $l2)))
                                          (f64.mul
                                            (f64.add
                                              (f64.mul
                                                (local.get $l4)
                                                (f64.const 0x1.446c81e384864p-13 (;=0.000154697;)))
                                              (f64.const 0x1.5f0896145a89fp-10 (;=0.00133909;)))
                                            (f64.mul
                                              (local.get $l2)
                                              (local.get $l2)))))
                                      (f64.const 0x1p+0 (;=1;))))
                                  (i64.shl
                                    (i64.trunc_sat_f64_s
                                      (local.get $l3))
                                    (i64.const 52))))))))))))
              (else
                (select
                  (i32.const 2139095040)
                  (i32.const 0)
                  (i32.lt_s
                    (local.get $l6)
                    (i32.const 0)))))))
        (local.get $l7))))
  (func $pow (export "pow") (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (call $f40
      (local.get $p0)
      (local.get $p1)))
  (func $f42 (type $t4) (param $p0 i64) (result i64)
    (i64.xor
      (i64.shr_u
        (local.tee $p0
          (i64.mul
            (i64.xor
              (i64.shr_u
                (local.tee $p0
                  (i64.mul
                    (i64.xor
                      (local.get $p0)
                      (i64.shr_u
                        (local.get $p0)
                        (i64.const 33)))
                    (i64.const -49064778989728563)))
                (i64.const 33))
              (local.get $p0))
            (i64.const -4265267296055464877)))
        (i64.const 33))
      (local.get $p0)))
  (func $f43 (type $t5) (param $p0 i32) (result i32)
    (i32.xor
      (i32.shr_u
        (local.tee $p0
          (i32.xor
            (i32.add
              (i32.mul
                (i32.or
                  (local.tee $p0
                    (i32.mul
                      (i32.or
                        (local.tee $p0
                          (i32.add
                            (local.get $p0)
                            (i32.const 1831565813)))
                        (i32.const 1))
                      (i32.xor
                        (local.get $p0)
                        (i32.shr_u
                          (local.get $p0)
                          (i32.const 15)))))
                  (i32.const 61))
                (i32.xor
                  (local.get $p0)
                  (i32.shr_u
                    (local.get $p0)
                    (i32.const 7))))
              (local.get $p0))
            (local.get $p0)))
        (i32.const 14))
      (local.get $p0)))
  (func $random (export "random") (type $t6) (result f32)
    (local $l0 i64) (local $l1 i32) (local $l2 i32)
    (if $I0
      (i32.eqz
        (global.get $g8))
      (then
        (if $I1
          (i64.eqz
            (local.tee $l0
              (i64.reinterpret_f64
                (call $env.seed))))
          (then
            (local.set $l0
              (i64.const -7046029254386353131))))
        (global.set $g9
          (call $f42
            (local.get $l0)))
        (drop
          (call $f42
            (i64.xor
              (global.get $g9)
              (i64.const -1))))
        (global.set $g10
          (call $f43
            (i32.wrap_i64
              (local.get $l0))))
        (global.set $g11
          (call $f43
            (global.get $g10)))
        (global.set $g8
          (i32.const 1))))
    (global.set $g10
      (i32.xor
        (i32.xor
          (local.tee $l1
            (i32.xor
              (local.tee $l2
                (global.get $g10))
              (global.get $g11)))
          (i32.rotl
            (local.get $l2)
            (i32.const 26)))
        (i32.shl
          (local.get $l1)
          (i32.const 9))))
    (global.set $g11
      (i32.rotl
        (local.get $l1)
        (i32.const 13)))
    (f32.sub
      (f32.reinterpret_i32
        (i32.or
          (i32.shr_u
            (i32.mul
              (i32.rotl
                (i32.mul
                  (local.get $l2)
                  (i32.const -1640531525))
                (i32.const 5))
              (i32.const 5))
            (i32.const 9))
          (i32.const 1065353216)))
      (f32.const 0x1p+0 (;=1;))))
  (func $round (export "round") (type $t0) (param $p0 f32) (result f32)
    (f32.sub
      (f32.ceil
        (local.get $p0))
      (f32.convert_i32_u
        (f32.gt
          (f32.sub
            (f32.ceil
              (local.get $p0))
            (f32.const 0x1p-1 (;=0.5;)))
          (local.get $p0)))))
  (func $sign (export "sign") (type $t0) (param $p0 f32) (result f32)
    (select
      (f32.copysign
        (f32.const 0x1p+0 (;=1;))
        (local.get $p0))
      (local.get $p0)
      (f32.gt
        (f32.abs
          (local.get $p0))
        (f32.const 0x0p+0 (;=0;)))))
  (func $signbit (export "signbit") (type $t7) (param $p0 f32) (result i32)
    (i32.shr_u
      (i32.reinterpret_f32
        (local.get $p0))
      (i32.const 31)))
  (func $f48 (type $t0) (param $p0 f32) (result f32)
    (local $l1 f64) (local $l2 f64) (local $l3 f64) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i64) (local $l8 i64) (local $l9 i64)
    (local.set $l5
      (i32.shr_u
        (local.tee $l4
          (i32.reinterpret_f32
            (local.get $p0)))
        (i32.const 31)))
    (if $I0
      (i32.le_u
        (local.tee $l4
          (i32.and
            (local.get $l4)
            (i32.const 2147483647)))
        (i32.const 1061752794))
      (then
        (if $I1
          (i32.lt_u
            (local.get $l4)
            (i32.const 964689920))
          (then
            (return
              (local.get $p0))))
        (local.set $l1
          (f64.mul
            (local.tee $l3
              (f64.mul
                (local.tee $l2
                  (f64.promote_f32
                    (local.get $p0)))
                (local.get $l2)))
            (local.get $l2)))
        (return
          (f32.demote_f64
            (f64.add
              (f64.add
                (local.get $l2)
                (f64.mul
                  (local.get $l1)
                  (f64.add
                    (f64.mul
                      (local.get $l3)
                      (f64.const 0x1.11110896efbb2p-7 (;=0.00833333;)))
                    (f64.const -0x1.5555554cbac77p-3 (;=-0.166667;)))))
              (f64.mul
                (f64.mul
                  (local.get $l1)
                  (f64.mul
                    (local.get $l3)
                    (local.get $l3)))
                (f64.add
                  (f64.mul
                    (local.get $l3)
                    (f64.const 0x1.6cd878c3b46a7p-19 (;=2.71831e-06;)))
                  (f64.const -0x1.a00f9e2cae774p-13 (;=-0.000198393;)))))))))
    (if $I2
      (i32.ge_u
        (local.get $l4)
        (i32.const 2139095040))
      (then
        (return
          (f32.sub
            (local.get $p0)
            (local.get $p0)))))
    (local.set $l4
      (block $B3 (result i32)
        (if $I4
          (i32.lt_u
            (local.get $l4)
            (i32.const 1305022427))
          (then
            (global.set $g7
              (f64.sub
                (f64.sub
                  (f64.promote_f32
                    (local.get $p0))
                  (f64.mul
                    (local.tee $l1
                      (f64.nearest
                        (f64.mul
                          (f64.promote_f32
                            (local.get $p0))
                          (f64.const 0x1.45f306dc9c883p-1 (;=0.63662;)))))
                    (f64.const 0x1.921fb5p+0 (;=1.5708;))))
                (f64.mul
                  (local.get $l1)
                  (f64.const 0x1.110b4611a6263p-26 (;=1.58933e-08;)))))
            (br $B3
              (i32.trunc_sat_f64_s
                (local.get $l1)))))
        (local.set $l8
          (i64.extend_i32_s
            (i32.and
              (local.tee $l6
                (i32.sub
                  (i32.shr_s
                    (local.get $l4)
                    (i32.const 23))
                  (i32.const 152)))
              (i32.const 63))))
        (local.set $l7
          (i64.load offset=8
            (local.tee $l6
              (i32.add
                (i32.shl
                  (i32.shr_s
                    (local.get $l6)
                    (i32.const 6))
                  (i32.const 3))
                (i32.const 1024)))))
        (global.set $g7
          (f64.mul
            (f64.copysign
              (f64.const 0x1.921fb54442d18p-64 (;=8.5153e-20;))
              (f64.promote_f32
                (local.get $p0)))
            (f64.convert_i64_s
              (local.tee $l8
                (i64.shl
                  (local.tee $l7
                    (i64.add
                      (i64.mul
                        (local.tee $l9
                          (i64.extend_i32_s
                            (i32.or
                              (i32.and
                                (local.get $l4)
                                (i32.const 8388607))
                              (i32.const 8388608))))
                        (i64.or
                          (i64.shl
                            (i64.load
                              (local.get $l6))
                            (local.get $l8))
                          (i64.shr_u
                            (local.get $l7)
                            (i64.sub
                              (i64.const 64)
                              (local.get $l8)))))
                      (i64.shr_u
                        (i64.mul
                          (if $I5 (result i64)
                            (i64.gt_u
                              (local.get $l8)
                              (i64.const 32))
                            (then
                              (i64.or
                                (i64.shl
                                  (local.get $l7)
                                  (i64.sub
                                    (local.get $l8)
                                    (i64.const 32)))
                                (i64.shr_u
                                  (i64.load offset=16
                                    (local.get $l6))
                                  (i64.sub
                                    (i64.const 96)
                                    (local.get $l8)))))
                            (else
                              (i64.shr_u
                                (local.get $l7)
                                (i64.sub
                                  (i64.const 32)
                                  (local.get $l8)))))
                          (local.get $l9))
                        (i64.const 32))))
                  (i64.const 2))))))
        (select
          (i32.sub
            (i32.const 0)
            (local.tee $l4
              (i32.wrap_i64
                (i64.add
                  (i64.shr_u
                    (local.get $l7)
                    (i64.const 62))
                  (i64.shr_u
                    (local.get $l8)
                    (i64.const 63))))))
          (local.get $l4)
          (local.get $l5))))
    (local.set $l1
      (global.get $g7))
    (select
      (f32.neg
        (local.tee $p0
          (if $I6 (result f32)
            (i32.and
              (local.get $l4)
              (i32.const 1))
            (then
              (local.set $l2
                (f64.mul
                  (local.tee $l1
                    (f64.mul
                      (local.get $l1)
                      (local.get $l1)))
                  (local.get $l1)))
              (f32.demote_f64
                (f64.add
                  (f64.add
                    (f64.add
                      (f64.mul
                        (local.get $l1)
                        (f64.const -0x1.ffffffd0c5e81p-2 (;=-0.5;)))
                      (f64.const 0x1p+0 (;=1;)))
                    (f64.mul
                      (local.get $l2)
                      (f64.const 0x1.55553e1053a42p-5 (;=0.0416666;))))
                  (f64.mul
                    (f64.mul
                      (local.get $l2)
                      (local.get $l1))
                    (f64.add
                      (f64.mul
                        (local.get $l1)
                        (f64.const 0x1.99342e0ee5069p-16 (;=2.43904e-05;)))
                      (f64.const -0x1.6c087e80f1e27p-10 (;=-0.00138868;)))))))
            (else
              (f32.demote_f64
                (f64.add
                  (f64.add
                    (local.get $l1)
                    (f64.mul
                      (local.tee $l1
                        (f64.mul
                          (local.tee $l2
                            (f64.mul
                              (local.get $l1)
                              (local.get $l1)))
                          (local.get $l1)))
                      (f64.add
                        (f64.mul
                          (local.get $l2)
                          (f64.const 0x1.11110896efbb2p-7 (;=0.00833333;)))
                        (f64.const -0x1.5555554cbac77p-3 (;=-0.166667;)))))
                  (f64.mul
                    (f64.mul
                      (local.get $l1)
                      (f64.mul
                        (local.get $l2)
                        (local.get $l2)))
                    (f64.add
                      (f64.mul
                        (local.get $l2)
                        (f64.const 0x1.6cd878c3b46a7p-19 (;=2.71831e-06;)))
                      (f64.const -0x1.a00f9e2cae774p-13 (;=-0.000198393;))))))))))
      (local.get $p0)
      (i32.and
        (local.get $l4)
        (i32.const 2))))
  (func $sin (export "sin") (type $t0) (param $p0 f32) (result f32)
    (call $f48
      (local.get $p0)))
  (func $sinh (export "sinh") (type $t0) (param $p0 f32) (result f32)
    (local $l1 f32) (local $l2 f32) (local $l3 i32)
    (block $B0 (result f32)
      (local.set $l2
        (f32.reinterpret_i32
          (local.tee $l3
            (i32.and
              (i32.reinterpret_f32
                (local.get $p0))
              (i32.const 2147483647)))))
      (local.set $l1
        (f32.copysign
          (f32.const 0x1p-1 (;=0.5;))
          (local.get $p0)))
      (if $I1
        (i32.lt_u
          (local.get $l3)
          (i32.const 1118925335))
        (then
          (local.set $l2
            (call $f22
              (local.get $l2)))
          (if $I2
            (i32.lt_u
              (local.get $l3)
              (i32.const 1065353216))
            (then
              (drop
                (br_if $B0
                  (local.get $p0)
                  (i32.lt_u
                    (local.get $l3)
                    (i32.const 964689920))))
              (br $B0
                (f32.mul
                  (local.get $l1)
                  (f32.sub
                    (f32.add
                      (local.get $l2)
                      (local.get $l2))
                    (f32.div
                      (f32.mul
                        (local.get $l2)
                        (local.get $l2))
                      (f32.add
                        (local.get $l2)
                        (f32.const 0x1p+0 (;=1;)))))))))
          (br $B0
            (f32.mul
              (local.get $l1)
              (f32.add
                (local.get $l2)
                (f32.div
                  (local.get $l2)
                  (f32.add
                    (local.get $l2)
                    (f32.const 0x1p+0 (;=1;)))))))))
      (f32.mul
        (f32.mul
          (call $f23
            (f32.sub
              (local.get $l2)
              (f32.const 0x1.45c778p+7 (;=162.89;))))
          (f32.mul
            (f32.add
              (local.get $l1)
              (local.get $l1))
            (f32.const 0x1p+117 (;=1.66153e+35;))))
        (f32.const 0x1p+117 (;=1.66153e+35;)))))
  (func $sqrt (export "sqrt") (type $t0) (param $p0 f32) (result f32)
    (f32.sqrt
      (local.get $p0)))
  (func $f52 (type $t0) (param $p0 f32) (result f32)
    (local $l1 f64) (local $l2 f64) (local $l3 f64) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i64) (local $l8 i64) (local $l9 i64)
    (local.set $l5
      (i32.shr_u
        (local.tee $l4
          (i32.reinterpret_f32
            (local.get $p0)))
        (i32.const 31)))
    (if $I0
      (i32.le_u
        (local.tee $l4
          (i32.and
            (local.get $l4)
            (i32.const 2147483647)))
        (i32.const 1061752794))
      (then
        (if $I1
          (i32.lt_u
            (local.get $l4)
            (i32.const 964689920))
          (then
            (return
              (local.get $p0))))
        (local.set $l3
          (f64.mul
            (local.tee $l2
              (f64.mul
                (local.tee $l1
                  (f64.promote_f32
                    (local.get $p0)))
                (local.get $l1)))
            (local.get $l2)))
        (return
          (f32.demote_f64
            (f64.add
              (f64.add
                (local.get $l1)
                (f64.mul
                  (local.tee $l1
                    (f64.mul
                      (local.get $l2)
                      (local.get $l1)))
                  (f64.add
                    (f64.mul
                      (local.get $l2)
                      (f64.const 0x1.112fd38999f72p-3 (;=0.133392;)))
                    (f64.const 0x1.5554d3418c99fp-2 (;=0.333331;)))))
              (f64.mul
                (f64.mul
                  (local.get $l1)
                  (local.get $l3))
                (f64.add
                  (f64.add
                    (f64.mul
                      (local.get $l2)
                      (f64.const 0x1.91df3908c33cep-6 (;=0.0245283;)))
                    (f64.const 0x1.b54c91d865afep-5 (;=0.0533812;)))
                  (f64.mul
                    (local.get $l3)
                    (f64.add
                      (f64.mul
                        (local.get $l2)
                        (f64.const 0x1.362b9bf971bcdp-7 (;=0.00946565;)))
                      (f64.const 0x1.85dadfcecf44ep-9 (;=0.00297436;)))))))))))
    (if $I2
      (i32.ge_u
        (local.get $l4)
        (i32.const 2139095040))
      (then
        (return
          (f32.sub
            (local.get $p0)
            (local.get $p0)))))
    (local.set $l4
      (block $B3 (result i32)
        (if $I4
          (i32.lt_u
            (local.get $l4)
            (i32.const 1305022427))
          (then
            (global.set $g7
              (f64.sub
                (f64.sub
                  (f64.promote_f32
                    (local.get $p0))
                  (f64.mul
                    (local.tee $l1
                      (f64.nearest
                        (f64.mul
                          (f64.promote_f32
                            (local.get $p0))
                          (f64.const 0x1.45f306dc9c883p-1 (;=0.63662;)))))
                    (f64.const 0x1.921fb5p+0 (;=1.5708;))))
                (f64.mul
                  (local.get $l1)
                  (f64.const 0x1.110b4611a6263p-26 (;=1.58933e-08;)))))
            (br $B3
              (i32.trunc_sat_f64_s
                (local.get $l1)))))
        (local.set $l8
          (i64.extend_i32_s
            (i32.and
              (local.tee $l6
                (i32.sub
                  (i32.shr_s
                    (local.get $l4)
                    (i32.const 23))
                  (i32.const 152)))
              (i32.const 63))))
        (local.set $l7
          (i64.load offset=8
            (local.tee $l6
              (i32.add
                (i32.shl
                  (i32.shr_s
                    (local.get $l6)
                    (i32.const 6))
                  (i32.const 3))
                (i32.const 1024)))))
        (global.set $g7
          (f64.mul
            (f64.copysign
              (f64.const 0x1.921fb54442d18p-64 (;=8.5153e-20;))
              (f64.promote_f32
                (local.get $p0)))
            (f64.convert_i64_s
              (local.tee $l8
                (i64.shl
                  (local.tee $l7
                    (i64.add
                      (i64.mul
                        (local.tee $l9
                          (i64.extend_i32_s
                            (i32.or
                              (i32.and
                                (local.get $l4)
                                (i32.const 8388607))
                              (i32.const 8388608))))
                        (i64.or
                          (i64.shl
                            (i64.load
                              (local.get $l6))
                            (local.get $l8))
                          (i64.shr_u
                            (local.get $l7)
                            (i64.sub
                              (i64.const 64)
                              (local.get $l8)))))
                      (i64.shr_u
                        (i64.mul
                          (if $I5 (result i64)
                            (i64.gt_u
                              (local.get $l8)
                              (i64.const 32))
                            (then
                              (i64.or
                                (i64.shl
                                  (local.get $l7)
                                  (i64.sub
                                    (local.get $l8)
                                    (i64.const 32)))
                                (i64.shr_u
                                  (i64.load offset=16
                                    (local.get $l6))
                                  (i64.sub
                                    (i64.const 96)
                                    (local.get $l8)))))
                            (else
                              (i64.shr_u
                                (local.get $l7)
                                (i64.sub
                                  (i64.const 32)
                                  (local.get $l8)))))
                          (local.get $l9))
                        (i64.const 32))))
                  (i64.const 2))))))
        (select
          (i32.sub
            (i32.const 0)
            (local.tee $l4
              (i32.wrap_i64
                (i64.add
                  (i64.shr_u
                    (local.get $l7)
                    (i64.const 62))
                  (i64.shr_u
                    (local.get $l8)
                    (i64.const 63))))))
          (local.get $l4)
          (local.get $l5))))
    (local.set $l3
      (f64.mul
        (local.tee $l2
          (f64.mul
            (local.tee $l1
              (global.get $g7))
            (local.get $l1)))
        (local.get $l2)))
    (f32.demote_f64
      (select
        (f64.div
          (f64.const -0x1p+0 (;=-1;))
          (local.tee $l1
            (f64.add
              (f64.add
                (local.get $l1)
                (f64.mul
                  (local.tee $l1
                    (f64.mul
                      (local.get $l2)
                      (local.get $l1)))
                  (f64.add
                    (f64.mul
                      (local.get $l2)
                      (f64.const 0x1.112fd38999f72p-3 (;=0.133392;)))
                    (f64.const 0x1.5554d3418c99fp-2 (;=0.333331;)))))
              (f64.mul
                (f64.mul
                  (local.get $l1)
                  (local.get $l3))
                (f64.add
                  (f64.add
                    (f64.mul
                      (local.get $l2)
                      (f64.const 0x1.91df3908c33cep-6 (;=0.0245283;)))
                    (f64.const 0x1.b54c91d865afep-5 (;=0.0533812;)))
                  (f64.mul
                    (local.get $l3)
                    (f64.add
                      (f64.mul
                        (local.get $l2)
                        (f64.const 0x1.362b9bf971bcdp-7 (;=0.00946565;)))
                      (f64.const 0x1.85dadfcecf44ep-9 (;=0.00297436;)))))))))
        (local.get $l1)
        (i32.and
          (local.get $l4)
          (i32.const 1)))))
  (func $tan (export "tan") (type $t0) (param $p0 f32) (result f32)
    (call $f52
      (local.get $p0)))
  (func $tanh (export "tanh") (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 f32)
    (local.set $l2
      (f32.reinterpret_i32
        (local.tee $l1
          (i32.and
            (i32.reinterpret_f32
              (local.get $p0))
            (i32.const 2147483647)))))
    (f32.copysign
      (if $I0 (result f32)
        (i32.gt_u
          (local.get $l1)
          (i32.const 1057791828))
        (then
          (if $I1 (result f32)
            (i32.gt_u
              (local.get $l1)
              (i32.const 1092616192))
            (then
              (f32.add
                (f32.div
                  (f32.const 0x0p+0 (;=0;))
                  (local.get $l2))
                (f32.const 0x1p+0 (;=1;))))
            (else
              (f32.sub
                (f32.const 0x1p+0 (;=1;))
                (f32.div
                  (f32.const 0x1p+1 (;=2;))
                  (f32.add
                    (call $f22
                      (f32.add
                        (local.get $l2)
                        (local.get $l2)))
                    (f32.const 0x1p+1 (;=2;))))))))
        (else
          (if $I2 (result f32)
            (i32.gt_u
              (local.get $l1)
              (i32.const 1048757624))
            (then
              (f32.div
                (local.tee $l2
                  (call $f22
                    (f32.add
                      (local.get $l2)
                      (local.get $l2))))
                (f32.add
                  (local.get $l2)
                  (f32.const 0x1p+1 (;=2;)))))
            (else
              (if $I3 (result f32)
                (i32.ge_u
                  (local.get $l1)
                  (i32.const 8388608))
                (then
                  (f32.div
                    (f32.neg
                      (local.tee $l2
                        (call $f22
                          (f32.mul
                            (local.get $l2)
                            (f32.const -0x1p+1 (;=-2;))))))
                    (f32.add
                      (local.get $l2)
                      (f32.const 0x1p+1 (;=2;)))))
                (else
                  (local.get $l2)))))))
      (local.get $p0)))
  (func $trunc (export "trunc") (type $t0) (param $p0 f32) (result f32)
    (f32.trunc
      (local.get $p0)))
  (global $E (export "E") f32 (f32.const 0x1.5bf0a8p+1 (;=2.71828;)))
  (global $LN2 (export "LN2") f32 (f32.const 0x1.62e43p-1 (;=0.693147;)))
  (global $LOG2E (export "LOG2E") f32 (f32.const 0x1.715476p+0 (;=1.4427;)))
  (global $LOG10E (export "LOG10E") f32 (f32.const 0x1.bcb7b2p-2 (;=0.434294;)))
  (global $PI (export "PI") f32 (f32.const 0x1.921fb6p+1 (;=3.14159;)))
  (global $SQRT1_2 (export "SQRT1_2") f32 (f32.const 0x1.6a09e6p-1 (;=0.707107;)))
  (global $SQRT2 (export "SQRT2") f32 (f32.const 0x1.6a09e6p+0 (;=1.41421;)))
  (global $g7 (mut f64) (f64.const 0x0p+0 (;=0;)))
  (global $g8 (mut i32) (i32.const 0))
  (global $g9 (mut i64) (i64.const 0))
  (global $g10 (mut i32) (i32.const 0))
  (global $g11 (mut i32) (i32.const 0))
  (data $d0 (i32.const 1024) ")\15DNn\83\f9\a2\c0\dd4\f5\d1W'\fcA\90C<\99\95b\dba\c5\bb\de\abcQ\fe"))
`;

// ../../mono/dist/esm/lib/mono.js
var mono_default = String.raw`

#zero:[0f];

clamp(x,xmin,xmax)=(
  x > xmax ? xmax
: x < xmin ? xmin
: x
);

clampi(x=0,xmin=0,xmax=1)=(
  x > xmax ? xmax
: x < xmin ? xmin
: x
);

clamp05(x)=(x > 0.5 ? 0.5 : x);
clamp1(x)=(x > 1f ? 1f : x);
clamp11(x)=(x > 1f ? 1f : x < -1f ? -1f : x);

osc(x)=({p};s=p;{p}=(p+pi2*x/sr)%pi2;s);
tri(x)=1f-abs(1f-(((osc(x)+hpi)/pi)%2f))*2f;
saw(x)=1f-(((osc(x)+pi)/pi)%2f);
ramp(x)=   (((osc(x)+pi)/pi)%2f)-1f;
sqr(x)=ramp(x)<0f?-1f:1f;
noise(x)=sin(osc(x)*1e7+1e7);
sine(x)= sin(osc(x));
expo(x)=(
  {p};
  s=p;
  ph=fract(x);
  ph=ph>0.5?1f-ph:ph;
  {p}=-1f+8f*ph*ph;
  s
);

inc(x)=({p};s=p;{p}=p+x;s);

#tri:1s;  #tri:=  tri(1);
#saw:1s;  #saw:=  saw(1);
#ramp:1s; #ramp:= ramp(1);
#sqr:1s;  #sqr:=  sqr(1);
#noise:1s;#noise:=noise(1);
#sine:1s; #sine:= sine(1);
\ #exp:1s;  #exp:=  expw(inc(1)/sr);

#exp:10s;  #exp:=  exp(-inc(1)/1s);

wt(#,hz)=({p};s=#(p);{p}=(p+hz)%sr;s);

wtri(hz)  =wt(*#tri,hz);
wsaw(hz)  =wt(*#saw,hz);
wramp(hz) =wt(*#ramp,hz);
wsqr(hz)  =wt(*#sqr,hz);
wnoise(hz)=wt(*#noise,hz);
wsine(hz) =wt(*#sine,hz);
\ wexp(hz)  =wt(*#exp,hz);
\ wexp(p)=#exp(p<0?0:p>1s-1?1s-1:p);
wexp(p)=(
  p*=-1s;
  #exp(clamp(p, 0, 10s-1))
);

note_to_hz(x)=440*2**((x-33)/12);

soft(x,amt)=(x/(1/amt+abs(x)));

\ https://github.com/thi-ng/umbrella/blob/776f08d4491787a071c74f1bbc2a36d69188c75d/packages/math/src/interval.ts#L202
\ https://www.desmos.com/calculator/lkyf2ag3ta
\ https://www.musicdsp.org/en/latest/Effects/203-fold-back-distortion.html
foldback(x,e)=(
  ((x < -e) || (x > e)) ?
    (abs(
      abs(
        (x - e) % (4 * e)
      ) - 2 * e
    ) - e) * (1 / e)
  : x
);

comb(
  x0,
  #,
  fb[0.1..0.999f]=1f,
  da[0.1..0.999f]=1f
)=(
  {y};
  o=#;
  {y}=o*(1f-da)+y*da;
  #=x0*0.015   +y*fb;
  o
);

allpass(x,#)=(
  s=#;
  o=-x+s;
  #=x+s*0.5;
  o
);

\ combs_a = [1116,1188,1277,1356]
\ combs_b = [1422,1491,1557,1617]
freeverb(x0,
  ro[0.01..0.999f]=0.5f,
  da[0.01..0.999f]=0.5f
)=(
  #a0:0.02530612237751484s;
  #a1:0.026938775554299355s;
  #a2:0.02895691618323326s;
  #a3:0.03074829839169979s;

  #b0:0.03224489837884903s;
  #b1:0.03380952402949333s;
  #b2:0.03530612215399742s;
  #b3:0.036666665226221085s;

  #c0:0.005102040711790323s;
  #c1:0.012607709504663944s;
  #c2:0.009999999776482582s;
  #c3:0.007732426282018423s;

  fb=ro*0.28+0.7;
  da*=0.4;

  o=comb(x0,*#a0,fb,da)
   +comb(x0,*#a1,fb,da)
   +comb(x0,*#a2,fb,da)
   +comb(x0,*#a3,fb,da)

   +comb(x0,*#b0,fb,da)
   +comb(x0,*#b1,fb,da)
   +comb(x0,*#b2,fb,da)
   +comb(x0,*#b3,fb,da);

  o=allpass(o,*#c0);
  o=allpass(o,*#c1);
  o=allpass(o,*#c2);
  o=allpass(o,*#c3);

  o
);

lop(x, freq[1..nyq]=1000f)=(
  w = clamp05((tau * freq) / sr);
  b1 = exp(-tau * w);
  a0 = 1f - b1;
  x*a0+x*b1
);

hop(x, freq[1..nyq]=1000f)=(
  w = clamp05((tau * freq) / sr);
  b1 = -exp(-tau * (0.5 - w));
  a0 = 1f + b1;
  x*a0+x*b1
);

bi_co(
  freq[1..10k]=1000f,
  Q[0.01..2f]=1.0
)=(
  w = (pi2 * freq) / sr;
  sin_w = sin(w);
  cos_w = cos(w);
  a = sin_w / (2.0 * Q);
  (sin_w,cos_w,a)
);

bi_ig(x0,b0,b1,b2,a0,a1,a2)=(
  {x1,x2,y1,y2};

  g = 1.0 / a0;

  (b0,b1,b2,a1,a2) *= g;

  y0 = b0*x0 + b1*x1 + b2*x2 - a1*y1 - a2*y2;

  {y1,y2} = (y0,y1);
  {x1,x2} = (x0,x1);

  y0
);

lp(x0, freq[1..10k]=1000f, Q[0.01..2f]=1.0)=(
  (sin_w,cos_w,a)=bi_co(freq,Q);

  b0 = (1.0 - cos_w) / 2.0;
  b1 =  1.0 - cos_w;
  b2 = b0;
  a0 =  1.0 + a;
  a1 = -2.0 * cos_w;
  a2 =  1.0 - a;

  bi_ig(x0,b0,b1,b2,a0,a1,a2)
);

hp(x0, freq[1..1000]=100.0, Q[0.01..2f]=1.0)=(
  (sin_w,cos_w,a)=bi_co(freq,Q);

  b0 = (1.0 + cos_w) / 2.0;
  b1 = -(1.0 + cos_w);
  b2 = b0;
  a0 = 1.0 + a;
  a1 = -2.0 * cos_w;
  a2 = 1.0 - a;

  bi_ig(x0,b0,b1,b2,a0,a1,a2)
);

bp(x0, freq[1..1000]=100.0, Q[0.01..2f]=1.0)=(
  (sin_w,cos_w,a)=bi_co(freq,Q);

  b0 = sin_w / 2.0;
  b1 = 0.0;
  b2 = -b0;
  a0 = 1.0 + a;
  a1 = -2.0 * cos_w;
  a2 = 1.0 - a;

  bi_ig(x0,b0,b1,b2,a0,a1,a2)
);

pk(x0, freq[1..1000]=100.0, Q[0.01..2f]=1.0)=(
  (sin_w,cos_w,a)=bi_co(freq,Q);

  b0 = a;
  b1 = 0.0;
  b2 = -a;
  a0 = 1.0 + a;
  a1 = -2.0 * cos_w;
  a2 = 1.0 - a;

  bi_ig(x0,b0,b1,b2,a0,a1,a2)
);

notch(x0, freq[1..1000]=100.0, Q[0.01..2f]=1.0)=(
  (sin_w,cos_w,a)=bi_co(freq,Q);

  b0 = 1.0;
  b1 =-2.0 * cos_w;
  b2 = 1.0;
  a0 = 1.0 + a;
  a1 = b1;
  a2 = 1.0 - a;

  bi_ig(x0,b0,b1,b2,a0,a1,a2)
);

ap(x0, freq[1..1000]=100.0, Q[0.01..2f]=1.0)=(
  (sin_w,cos_w,a)=bi_co(freq,Q);

  b0 = 1.0 - a;
  b1 =-2.0 * cos_w;
  b2 = 1.0 + a;
  a0 = b2;
  a1 = b1;
  a2 = b0;

  bi_ig(x0,b0,b1,b2,a0,a1,a2)
);

pks(x0, freq[1..1000]=100.0, Q[0.01..2f]=1.0, gain[0.01..10f]=1.0)=(
  (sin_w,cos_w,a)=bi_co(freq,Q);

  A = 10.0 ** (gain / 40.0);
  b0 = 1.0 + a * A;
  b1 =-2.0 * cos_w;
  b2 = 1.0 - a * A;
  a0 = 1.0 + a / A;
  a1 = b1;
  a2 = 1.0 - a / A;

  bi_ig(x0,b0,b1,b2,a0,a1,a2)
);

ls(x0, freq[1..1000]=100.0, Q[0.01..2f]=1.0, gain[0.01..10f]=1.0)=(
  (sin_w,cos_w,a)=bi_co(freq,Q);

  A = 10.0 ** (gain / 40.0);
  c = 2.0 * sqrt(A) * a;
  b0 =       A * ((A + 1.0) - (A - 1.0) * cos_w + c);
  b1 = 2.0 * A * ((A - 1.0) - (A + 1.0) * cos_w);
  b2 =       A * ((A + 1.0) - (A - 1.0) * cos_w - c);
  a0 =            (A + 1.0) + (A - 1.0) * cos_w + c;
  a1 =    -2.0 * ((A - 1.0) + (A + 1.0) * cos_w);
  a2 =            (A + 1.0) + (A - 1.0) * cos_w - c;

  bi_ig(x0,b0,b1,b2,a0,a1,a2)
);

hs(x0, freq[1..1000]=100.0, Q[0.01..2f]=1.0, gain[0.01..10f]=1.0)=(
  (sin_w,cos_w,a)=bi_co(freq,Q);

  A = 10.0 ** (gain / 40.0);
  c = 2.0 * sqrt(A) * a;
  b0 =        A * ((A + 1.0) + (A - 1.0) * cos_w + c);
  b1 = -2.0 * A * ((A - 1.0) + (A + 1.0) * cos_w);
  b2 =        A * ((A + 1.0) + (A - 1.0) * cos_w - c);
  a0 =             (A + 1.0) - (A - 1.0) * cos_w + c;
  a1 =      2.0 * ((A - 1.0) - (A + 1.0) * cos_w);
  a2 =             (A + 1.0) - (A - 1.0) * cos_w - c;

  bi_ig(x0,b0,b1,b2,a0,a1,a2)
);

\ https://cytomic.com/files/dsp/SvfLinearTrapOptimised2.pdf
svf_co(
  cutoff[50..22k]=3169.975,
  res[0.01..0.985]=0.556
)=(
  g=tan(pi*cutoff/sr);
  k=2f-2f*res;
  a1=1f/(1f+g*(g+k));
  a2=g*a1;
  a3=g*a2;
  (k,a1,a2,a3)
);

svf_ig(v0,a1,a2,a3)=(
  {c1,c2};
  v3=v0-c2;
  v1=a1*c1+a2*v3;
  v2=c2+a2*c1+a3*v3;
  {c1}=2*v1-c1;
  {c2}=2*v2-c2;
  (v1,v2,v3)
);

svf(
  v0,
  cutoff[50..22k]=3169.975,
  res[0.01..0.985]=0.556
)=(
  (k,a1,a2,a3)=svf_co(cutoff,res);
  (v1,v2,v3)  =svf_ig(v0,a1,a2,a3);
  (k,v1,v2,v3)
);

lpf(
  v0,
  cutoff[50..22k]=3169.975,
  res[0.01..0.985]=0.556
)=(
  (k,v1,v2,v3)=svf(v0,cutoff,res);

  low=v2;
  \ band=v1;
  \ high=v0-k*v1-v2;
  \ notch=v0-k*v1;
  \ peak=v0-k*v1-2*v2;
  \ all=v0-2*k*v1;

  low
);

bpf(
  v0,
  cutoff[50..22k]=3169.975,
  res[0.01..0.985]=0.556
)=(
  (k,v1,v2,v3)=svf(v0,cutoff,res);

  \ low=v2;
  band=v1;
  \ high=v0-k*v1-v2;
  \ notch=v0-k*v1;
  \ peak=v0-k*v1-2*v2;
  \ all=v0-2*k*v1;

  band
);

hpf(
  v0,
  cutoff[50..22k]=3169.975,
  res[0.01..0.985]=0.556
)=(
  (k,v1,v2,v3)=svf(v0,cutoff,res);

  \ low=v2;
  \ band=v1;
  high=v0-k*v1-v2;
  \ notch=v0-k*v1;
  \ peak=v0-k*v1-2*v2;
  \ all=v0-2*k*v1;

  high
);

notchf(
  v0,
  cutoff[50..22k]=3169.975,
  res[0.01..0.985]=0.556
)=(
  (k,v1,v2,v3)=svf(v0,cutoff,res);

  \ low=v2;
  \ band=v1;
  \ high=v0-k*v1-v2;
  notch=v0-k*v1;
  \ peak=v0-k*v1-2*v2;
  \ all=v0-2*k*v1;

  notch
);

peakf(
  v0,
  cutoff[50..22k]=3169.975,
  res[0.01..0.985]=0.556
)=(
  (k,v1,v2,v3)=svf(v0,cutoff,res);

  \ low=v2;
  \ band=v1;
  \ high=v0-k*v1-v2;
  \ notch=v0-k*v1;
  peak=v0-k*v1-2*v2;
  \ all=v0-2*k*v1;

  peak
);

apf(
  v0,
  cutoff[50..22k]=3169.975,
  res[0.01..0.985]=0.556
)=(
  (k,v1,v2,v3)=svf(v0,cutoff,res);

  \ low=v2;
  \ band=v1;
  \ high=v0-k*v1-v2;
  \ notch=v0-k*v1;
  \ peak=v0-k*v1-2*v2;
  all=v0-2*k*v1;

  all
);

\ fract(x)=x-floor(x);

cubic(#,i)=(
  fr = fract(i);

  xm = #(i-1);
  x0 = #(i  );
  x1 = #(i+1);
  x2 = #(i+2);

  a = (3f * (x0-x1) -     xm+x2) * .5;
  b =  2f *  x1+xm  - (5f*x0+x2) * .5;
  c =       (x1-xm) * .5;

  (((a * fr) + b)
       * fr  + c)
       * fr  + x0
);

spline(#,i)=(
  fr = fract(i);

  xm2 = #(i-2);
  xm1 = #(i-1);
  x0  = #(i  );
  x1  = #(i+1);
  x2  = #(i+2);
  x3  = #(i+3);

  x0 + 0.04166666666
     * fr * ((x1-xm1)        *  16.0+(xm2-x2)      *  2.0
     + fr * ((x1+xm1)        *  16.0-xm2      -x0  * 30.0 - x2
     + fr *  (x1*66.0  - x0  *  70.0-x2 * 33.0+xm1 * 39.0 + x3*7.0  - xm2  *  9.0
     + fr *  (x0*126.0 - x1  * 124.0+x2 * 61.0-xm1 * 64.0 - x3*12.0 + xm2  * 13.0
     + fr * ((x1       - x0) *  50.0+(xm1-x2)      * 25.0 +(x3      - xm2) *  5.0)))))
);

modwrap(x,N)=(x%N+N)%N;

\ denan(x)=x-x!=0f?0f:x;

sum(x,y)=x+y;

idy(x)=x;

daverb(x,
  pd[1..1s]=1137.95, \ predelay
  bw[0..1f]=0.402, \ bandwidth
  fi[0..1f]=0.803, \ input diffusion 1
  si[0..1f]=0.51, \ input diffusion 2
  dc[0..1f]=0.43, \ decay
  ft[0..0.999999]=0.978, \ decay diffusion 1
  st[0..0.999999]=0.938, \ decay diffusion 2
  dp[0..1f]=0.427, \ damping
  ex[0..2f]=0.87, \ excursion rate
  ed[0..2f]=1.748, \ excursion depth
  dr[0..1f]=0, \ dry
  we[0..1f]=1 \ wet
)=(
  \ set parameters
  dp=1-dp;
  ex=ex/sr;
  ed=ed*sr/1000f;

  \ predelay
  #pd:1s;

  \ delay banks
  #d0:0.004771345s;
  #d1:0.003595309s;
  #d2:0.012734787s;
  #d3:0.009307483s;
  #d4:0.022579886s;
  #d5:0.149625349s;
  #d6:0.060481839s;
  #d7:0.1249958s;
  #d8:0.030509727s;
  #d9:0.141695508s;
  #d10:0.089244313s;
  #d11:0.106280031s;

  \ write to predelay
  #pd=x*.5;

  {lp1};{lp1}+=bw*(cubic(*#pd,-pd) -lp1);

  \ pre-tank
  #d0=( lp1-fi*#d0(-1));
  #d1=(fi*(#d0-#d1(-1))  +#d0(-1));
  #d2=(fi* #d1+#d1(-1)-si*#d2(-1));
  #d3=(si*(#d2-#d3(-1))  +#d2(-1));

  split=si*#d3+#d3(-1);

  \ excursions
  {exc_phase};
  exc  = ed*(1f+cos(exc_phase*6.2800));
  exc2 = ed*(1f+sin(exc_phase*6.2847));

  \ left loop
  #d4=split+dc*#d11(-1)+ft*cubic(*#d4,-exc); \ tank diffuse 1
  #d5=cubic(*#d4,-exc)-ft*#d4;               \ long delay 1

  {lp2};{lp2}+=dp*(#d5(-1)-lp2); \ damp 1

  #d6=dc*lp2-st*#d6(-1); \ tank diffuse 2
  #d7=#d6(-1)+st*#d6;    \ long delay 2

  \ right loop
  #d8=split+dc*#d7(-1)+ft*cubic(*#d8,-exc2); \ tank diffuse 3
  #d9=cubic(*#d8,-exc2)-ft*#d8;              \ long delay 3

  {lp3};{lp3}+=dp*#d9(-1)-lp3; \ damp 2

  #d10=dc*lp3-st*#d10(-1); \ tank diffuse 4
  #d11=#d10(-1)+st*#d10;   \ long delay 4

  lo=
    #d9(0.008937872s)
  + #d9(0.099929438s)
  - #d10(0.064278754s)
  + #d11(0.067067639s)
  - #d5(0.066866033s)
  - #d6(0.006283391s)
  - #d7(0.035818689s)
  ;

  ro=
    #d5(0.011861161s)
  + #d5(0.121870905s)
  - #d6(0.041262054s)
  + #d7(0.08981553s)
  - #d9(0.070931756s)
  - #d10(0.011256342s)
  - #d11(0.004065724s)
  ;

  {exc_phase}+=ex;

  \ todo: stereo
    ((x*dr+lo*we)
  +  (x*dr+ro*we))
);

diode(
  x0,
  freq[50f..2k]=280.036,
  Q[0.01f..1f]=1,
  hpf[1f..1k]=348.209,
  sat[0.01f..1.5f]=0.189
)=(
  {z0,z1,z2,z3,z4};

  fc = freq / sr;
  hfc = hpf / sr;
  a = pi * fc;
  K = pi * hfc;
  k = 20.0 * Q;
  A = 1.0 + 0.5 * k;
  ah = (K - 2.0) / (K + 2.0);
  bh = 2.0 / (K + 2.0);
  \ a = 2 * Math.tan(0.5*a) // dewarping, not required with 2x oversampling

  ainv = 1.0 / a;
  a2 = a * a;
  b = 2.0 * a + 1.0;
  b2 = b * b;
  c = 1.0 / (2.0 * a2 * a2 - 4.0 * a2 * b2 + b2 * b2);
  g0 = 2.0 * a2 * a2 * c;
  g = g0 * bh;

  \ current state
  s0 =
    (a2 * a * z0 +
      a2 * b * z1 +
      z2 * (b2 - 2.0 * a2) * a +
      z3 * (b2 - 3.0 * a2) * b) *
    c;

  s = bh * s0 - z4;

  \ solve feedback loop (linear)
  y5 = (g * x0 + s) / (1.0 + g * k);

  \ input clipping
  y0 = soft((x0 - k * y5),sat);
  y5 = g * y0 + s;

  \ compute integrator outputs
  y4 = g0 * y0 + s0;
  y3 = (b * y4 - z3) * ainv;
  y2 = (b * y3 - a * y4 - z2) * ainv;
  y1 = (b * y2 - a * y3 - z1) * ainv;

  \ update filter state
  {z0} += 4.0 * a * (y0 - y1 + y2);
  {z1} += 2.0 * a * (y1 - 2.0 * y2 + y3);
  {z2} += 2.0 * a * (y2 - 2.0 * y3 + y4);
  {z3} += 2.0 * a * (y3 - 2.0 * y4);
  {z4} = bh * y4 + ah * y5;

  A * y4
);

env(
  note_on_time,
  a[0.1..100]=15, \ attack
  r[0.1..100]=15  \ release
)=(
  dt=t-note_on_time; \ time since note_on_time
  A=1-wexp(-dt*a); \ attack curve
  R=wexp(-dt*r);   \ release curve
  A*R
);

tb303(
  x,
  freq[50f..2k]=280.036,
  Q[0.01f..1f]=1,
  hpf[1f..1k]=348.209,
  sat[0.01f..1.5f]=0.189,
  pre[0.1f..2f]=0.624,
  dist[1f..80f]=80
)=atan(diode(x*pre, freq, Q, hpf, sat)*dist);

distort(#x,#y,#k,bias=0f,post=0f,x)=(
  xmax=#x:::max;
  xmin=#x:::min;

  x+=bias;

  x=clamp(x,
    xmin+0.001,
    xmax-0.001);

  i=1;(while #x(i)<x i++);

  z = (x - #x(i-1)) / (#x(i) - #x(i-1));

  a = #k(i-1) * (#x(i) - #x(i-1)) - (#y(i) - #y(i-1));
  b =  -#k(i) * (#x(i) - #x(i-1)) + (#y(i) - #y(i-1));

  q = (1-z) * #y(i-1)
        +z  * #y(i)
        +z  * (1-z)
        *(a * (1-z)
        + b * z);

  q+post
);

#jfetl_x:[
  -2.4999032020568848, -1.7674853801727295,
  -1.6253507137298584, -1.5339927673339844,
  -1.4729481935501099,  -1.412233829498291,
  -1.3487496376037598, -0.9000921845436096,
   0.1996227502822876,  0.3705906569957733,
   0.4163645803928375, 0.46580982208251953,
   0.5479905605316162,  0.7514151930809021,
   1.5497076511383057,  1.7004239559173584
];
#jfetl_y:[
  19.672000885009766, 19.672000885009766,
  19.669902801513672, 19.652894973754883,
   19.53590965270996,  19.29184913635254,
  18.891223907470703,   15.0526704788208,
   4.147157192230225,  2.421009063720703,
  2.0919277667999268, 1.8554054498672485,
  1.7178535461425781, 1.6377859115600586,
  1.5540000200271606, 1.5540000200271606
];
#jfetl_k:[
    -9.691473007202148,   -9.32113265991211,
    -8.838568687438965,  -6.721536159515381,
    -6.113120079040527,  -5.439774036407471,
   -3.5792548656463623,  -2.998894691467285,
   -0.6902798414230347, -0.5636267066001892,
  -0.06262518465518951,                   0,
                     0,                   0,
                     0,                   0
];
distort_jfetl(x)=distort(
  *#jfetl_x,
  *#jfetl_y,
  *#jfetl_k,
  0, -5, x);
`;

// ../../mono/dist/esm/lib/vm.js
var env = ({ memory: memory2, memPadding: memPadding2, eventsPointer }) => `;;wasm
  (import "env" "memory"
    (memory
      ${memory2.initial}
      ${memory2.maximum}
      ${memory2.shared ? "shared" : ""}
    )
  )

  (global $global_mem_ptr (export "global_mem_ptr") (mut i32) (i32.const ${memPadding2}))
  (global $start_ptr (export "start_ptr") (mut i32) (i32.const 0))

  ;; set the max number of loop iterations per sample
  (global $infinite_loop_guard (mut i32) (i32.const 0))
  (global $max_loop (mut i32) (i32.const 128))

  (global $sr (export "sampleRate") (mut f32) (f32.const 44100.0))
  (global $nyq (export "nyquistFreq") (mut f32) (f32.const 22050.0))
  (global $t (export "currentTime") (mut f32) (f32.const 0))
  (global $pi (f32) (f32.const 3.1415927410125732))
  (global $pi2 (f32) (f32.const 6.2831854820251465))
  (global $tau (f32) (f32.const 6.2831854820251465))
  (global $hpi (f32) (f32.const 1.5707963705062866))
  (global $cf (export "cf") (mut i32) (i32.const 0))
  (global $bf (export "bf") (mut i32) (i32.const 0))

  (global $seed (mut f32) (f32.const 0))
  (global $$x (mut f32) (f32.const 0))
  (global $ch (mut i32) (i32.const 0))

  (global $events (i32) (i32.const ${eventsPointer}))
`;
var process2 = (mod3) => `;;wasm
(func $process (export "process")
  (param $channels i32)
  (param $events i32)

  (local $channelsIndex i32)
  (local $eventsIndex i32)
  (local $pos i32)

  (loop $eventsLoop
    (local.set $pos
      (i32.add
        (i32.shl
          (local.get $eventsIndex)
          (i32.const 4)
        )
        (global.get $events)
      )
    )

    (if (i32.eqz (i32.load offset=0 (local.get $pos)))
      (then

        (local.set $channelsIndex (i32.const 0))
        (loop $channelsLoop
          (call $fill (local.get $channelsIndex)
            (i32.load offset=4 (local.get $pos))
            (i32.load offset=8 (local.get $pos))
            (i32.load offset=12 (local.get $pos))
          )
          (br_if $channelsLoop (i32.ne
            (local.tee $channelsIndex (i32.add (i32.const 1) (local.get $channelsIndex)))
            (local.get $channels)
          ))
        )

      )
      (else

        (drop ${S("midi_in" in mod3.funcs ? mod3.funcCall("midi_in", [
  mod3.typeAs(Type.i32, [
    "i32.load offset=4",
    [
      "local.get",
      "$pos"
    ]
  ]),
  mod3.typeAs(Type.i32, [
    "i32.load offset=8",
    [
      "local.get",
      "$pos"
    ]
  ]),
  mod3.typeAs(Type.i32, [
    "i32.load offset=12",
    [
      "local.get",
      "$pos"
    ]
  ])
]) : [
  "i32.const",
  "0"
])}
        )
      )
    )

    (br_if $eventsLoop (i32.ne
      (local.tee $eventsIndex (i32.add (i32.const 1) (local.get $eventsIndex)))
      (local.get $events)
    ))
  )
)
`;
var fill = ({ type, params, blockSize, channels, channelBytes, memPadding: memPadding2 }) => `;;wasm
  (func $fill (export "fill")
    ;; channel
    (param $channel i32)
    ;; song position starting frame
    (param $frame i32)
    ;; buffer offset
    (param $offset i32)
    ;; buffer end index exclusive
    (param $end i32)
    ;; ...params
    ${params.map((x) => `(param $${x.id} ${Typed.max(Type.i32, x.type)})`).join(" ")}

    (local $start_mem_ptr i32)
    (local $user_mem_ptr i32)
    (local $buffer_ptr i32)
    (local $sample f32)
    (local $sample_time f32)

    (local.set $start_mem_ptr (i32.add
      (i32.const ${memPadding2})
      (i32.mul (i32.const ${channelBytes}) (local.get $channel)))
    )

    (local.set $user_mem_ptr (i32.add
      (i32.const ${(blockSize + 5) * 2 << 2})
      (local.get $start_mem_ptr))
    )

    (local.set $sample_time (f32.div (f32.const 1.0) (global.get $sr)))

    (global.set $t (f32.div (f32.convert_i32_s (local.get $frame)) (global.get $sr)))

    (global.set $ch (local.get $channel))

    (if
      (i32.eq
        (i32.const 0)
        (local.get $end)
      )
      (then
        (global.set $global_mem_ptr (local.get $user_mem_ptr))

        (global.set $infinite_loop_guard (i32.const 0))

        (global.set $cf (local.get $frame))
        (global.set $bf (local.get $offset))

        ;; run initializers
        (call $__begin__)

        return
      )
    )

    ${Array.from({
  length: channels
}, (_, i) => `;;wasm
      (i32.store offset=0 (global.get $#i${i}) (i32.const 0))
      (i32.store offset=4 (global.get $#i${i}) (i32.const 0))
      (i32.store offset=0 (global.get $#o${i}) (i32.const 0))
      (i32.store offset=4 (global.get $#o${i}) (i32.const 0))
      ;; todo: zero out #zero
    `).join("\n")}

    ;; do
    (loop $loop
      (global.set $global_mem_ptr (local.get $user_mem_ptr))

      (global.set $infinite_loop_guard (i32.const 0))

      (global.set $cf (local.get $frame))
      (global.set $bf (local.get $offset))

      ;; run initializers
      (call $__begin__)

      (local.set $buffer_ptr
        (i32.add
          (local.get $start_mem_ptr)
          (i32.shl (local.get $offset) (i32.const 2))
        )
      )

      ;; read input
      ;;(global.set $$x
      ;;  (f32.load offset=20 (local.get $buffer_ptr))
      ;;)

      ;; $sample = f(...params)
      (local.set $sample
        ${W(type) < W(Type.f32) ? "(f32.convert_i32_s " : ""}
        (call $f ${params.map((x) => `(local.get $${x.id})`).join(" ")})
        ${W(type) < W(Type.f32) ? ")" : ""}
      )

      ;; buffer[$offset] =
      (f32.store offset=${(blockSize + 5 << 2) + 20} (local.get $buffer_ptr)
        ;; if $sample is finite return $sample else return 0
        (select
          (local.get $sample)
          (f32.const 0)
          (f32.eq
            (f32.const 0)
            (f32.sub
              (local.get $sample)
              (local.get $sample)
            )
          )
        )
      )

      ;; $t += $sample_time
      (global.set $t (f32.add (global.get $t) (local.get $sample_time)))

      ;; $offset++
      (local.set $offset (i32.add (local.get $offset) (i32.const 1)))

      ${Array.from({
  length: channels
}, (_, i) => `;;wasm
        (i32.store offset=0 (global.get $#i${i}) (local.get $offset))
        (i32.store offset=4 (global.get $#i${i}) (local.get $offset))
        (i32.store offset=0 (global.get $#o${i}) (local.get $offset))
        (i32.store offset=4 (global.get $#o${i}) (local.get $offset))
      `).join("\n")}

      ;; $frame++
      (local.set $frame (i32.add (local.get $frame) (i32.const 1)))

      ;; if ($offset !== $end) continue $loop
      (br_if $loop (i32.ne (local.get $offset) (local.get $end)))
    )
  )
`;

// ../../mono/dist/esm/lib/wat.js
var wat_exports = {};
__export(wat_exports, {
  denan: () => denan,
  envseed: () => envseed,
  floori: () => floori,
  fract: () => fract,
  mod: () => mod,
  modwrapi: () => modwrapi
});
var envseed = `;;wasm
(func $env.seed (result f64) (f64.promote_f32 (global.get $seed)))
`;
var floori = `;;wasm
(func $floori (param $0 f32) (result i32) (i32.reinterpret_f32 (f32.floor (local.get $0))))
`;
var fract = `;;wasm
(func $fract (param $x f32) (result f32)
  (f32.sub
    (local.get $x)
    (f32.floor (local.get $x))
  )
)
`;
var modwrapi = `;;wasm
(func $modwrapi (param $x i32) (param $y i32) (result i32)
  (local $rem i32)

  (local.set $rem (i32.rem_s
    (local.get $x)
    (local.get $y)
  ))

  (if
    (result i32)

    (i32.and
      (local.get $rem)
      (i32.const 0x80000000)
    )

    (then
      (i32.add
        (local.get $y)
        (local.get $rem)
      )
    )
    (else
      (local.get $rem)
    )
  )
)
`;
var denan = `;;wasm
(func $denan (param $x f32) (result f32)
  (local $result f32)

  (local.set $result (f32.sub
    (local.get $x)
    (local.get $x)
  ))

  (if
    (result f32)

    (i32.eqz (i32.reinterpret_f32 (local.get $result)))

    (then
      (local.get $x)
    )
    (else
      (f32.const 0)
    )
  )
)
`;
var mod = `;;wasm
(func $mod (param $0 f32) (param $1 f32) (result f32)
  (local $2 i32) (local $3 i32) (local $4 i32) (local $5 i32) (local $6 i32) (local $7 i32) (local $8 i32)
  (if $I0
    (f32.eq
      (f32.abs
        (local.get $1))
      (f32.const 0x1p+0 (;=1;)))
    (then
      (return
        (f32.copysign
          (f32.sub
            (local.get $0)
            (f32.trunc
              (local.get $0)))
          (local.get $0)))))
  (local.set $7
    (i32.and
      (i32.shr_u
        (local.tee $4
          (i32.reinterpret_f32
            (local.get $1)))
        (i32.const 23))
      (i32.const 255)))
  (if $I1
    (select
      (i32.const 1)
      (f32.ne
        (local.get $1)
        (local.get $1))
      (select
        (i32.eq
          (local.tee $8
            (i32.and
              (i32.shr_u
                (local.tee $6
                  (i32.reinterpret_f32
                    (local.get $0)))
                (i32.const 23))
              (i32.const 255)))
          (i32.const 255))
        (i32.const 1)
        (local.tee $3
          (i32.shl
            (local.get $4)
            (i32.const 1)))))
    (then
      (return
        (f32.div
          (local.tee $0
            (f32.mul
              (local.get $0)
              (local.get $1)))
          (local.get $0)))))
  (if $I2
    (i32.ge_u
      (local.get $3)
      (local.tee $2
        (i32.shl
          (local.get $6)
          (i32.const 1))))
    (then
      (return
        (f32.mul
          (local.get $0)
          (f32.convert_i32_u
            (i32.ne
              (local.get $2)
              (local.get $3)))))))
  (i32.and
    (local.get $6)
    (i32.const -2147483648))
  (local.set $2
    (if $I3 (result i32)
      (local.get $8)
      (then
        (i32.or
          (i32.and
            (local.get $6)
            (i32.const 8388607))
          (i32.const 8388608)))
      (else
        (i32.shl
          (local.get $6)
          (i32.sub
            (i32.const 1)
            (local.tee $8
              (i32.sub
                (local.get $8)
                (i32.clz
                  (i32.shl
                    (local.get $6)
                    (i32.const 9))))))))))
  (local.set $3
    (if $I4 (result i32)
      (local.get $7)
      (then
        (i32.or
          (i32.and
            (local.get $4)
            (i32.const 8388607))
          (i32.const 8388608)))
      (else
        (i32.shl
          (local.get $4)
          (i32.sub
            (i32.const 1)
            (local.tee $7
              (i32.sub
                (local.get $7)
                (i32.clz
                  (i32.shl
                    (local.get $4)
                    (i32.const 9))))))))))
  (loop $L5
    (if $I6
      (i32.lt_s
        (local.get $7)
        (local.get $8))
      (then
        (local.set $2
          (i32.shl
            (if $I7 (result i32)
              (i32.ge_u
                (local.get $2)
                (local.get $3))
              (then
                (if $I8
                  (i32.eq
                    (local.get $2)
                    (local.get $3))
                  (then
                    (return
                      (f32.mul
                        (local.get $0)
                        (f32.const 0x0p+0 (;=0;))))))
                (i32.sub
                  (local.get $2)
                  (local.get $3)))
              (else
                (local.get $2)))
            (i32.const 1)))
        (local.set $8
          (i32.sub
            (local.get $8)
            (i32.const 1)))
        (br $L5))))
  (if $I9
    (i32.ge_u
      (local.get $2)
      (local.get $3))
    (then
      (if $I10
        (i32.eq
          (local.get $2)
          (local.get $3))
        (then
          (return
            (f32.mul
              (local.get $0)
              (f32.const 0x0p+0 (;=0;))))))
      (local.set $2
        (i32.sub
          (local.get $2)
          (local.get $3)))))
  (local.set $3
    (i32.sub
      (local.get $8)
      (local.tee $4
        (i32.clz
          (i32.shl
            (local.get $2)
            (i32.const 8))))))
  (select
    (i32.or
      (i32.sub
        (local.tee $2
          (i32.shl
            (local.get $2)
            (local.get $4)))
        (i32.const 8388608))
      (i32.shl
        (local.get $3)
        (i32.const 23)))
    (i32.shr_u
      (local.get $2)
      (i32.sub
        (i32.const 1)
        (local.get $3)))
    (i32.gt_s
      (local.get $3)
      (i32.const 0)))
  (f32.reinterpret_i32
    (i32.or)))
`;

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

// ../../mono/dist/esm/linker-worker.js
var copy = (x) => deobjectify(objectify(x, replacer(x)), reviver([
  Uint8Array,
  ModuleBuilder,
  FunctionContext,
  GlobalContext
]));
var includes = {};
var source = Object.values({
  env,
  ...wat_exports,
  ...math_exports
}).map((x) => typeof x === "function" ? x({
  memory,
  memPadding,
  eventsPointer: config.eventsPointer,
  samplePointers
}) : x).join("\n");
var context = compile(parse(tokenize(`(module ${source})`)));
for (const code of context.module.codes) {
  const [params, result] = context.module.types[code.type_idx].split(",");
  includes[code.name] = {
    params: params.split(" "),
    result: result.split(" ")[0]
  };
}
var scope = Object.fromEntries(context.global.globals.map((x) => [
  x.name,
  x.type
]));
var lib2 = {
  context,
  scope,
  includes,
  init_body: [],
  fill_body: [],
  types: /* @__PURE__ */ new Map()
};
var ast = parse2(mono_default);
var mod2 = compile2(ast, lib2.scope, lib2.includes, [], [], lib2.types, CompStep.Lib);
lib2.includes = Object.assign(lib2.includes, Object.fromEntries(Object.entries(mod2.funcs).filter(([name]) => !(name in lib2.includes))));
lib2.init_body = mod2.init_body;
lib2.fill_body = mod2.fill_body;
var sexpr = [
  "module",
  ...mod2.body
];
make(S(sexpr), {
  metrics: false
}, lib2.context);
self.onconnect = ({ ports: [port] }) => {
  port.onmessage = ({ data }) => {
    if (data.link) {
      try {
        const ast2 = parse2(data.link);
        if (!ast2) {
          throw new Error("No ast produced.");
        }
        if (!ast2.lexer) {
          throw new Error("No lexer");
        }
        const scope2 = copy(lib2.scope);
        const monoBufferGlobals = data.monoBuffers.map(([id, pos]) => {
          scope2[`#${id}`] = Type.i32;
          return `(global $#${id} (i32) (i32.const ${pos}))`;
        });
        const fill_body = [
          ...lib2.fill_body
        ];
        for (let i = data.config.channels; i < data.config.maxChannels; i++) {
          scope2[`#i${i}`] = Type.i32;
          scope2[`#o${i}`] = Type.i32;
          monoBufferGlobals.push(`(global $#i${i} (mut i32) (i32.const 0))`);
          monoBufferGlobals.push(`(global $#o${i} (mut i32) (i32.const 0))`);
          fill_body.push([
            `global.set`,
            `$#i${i}`,
            [
              `global.get`,
              `$#zero`
            ]
          ]);
          fill_body.push([
            `global.set`,
            `$#o${i}`,
            [
              `global.get`,
              `$#zero`
            ]
          ]);
        }
        const mod3 = compile2(ast2, scope2, lib2.includes, [
          ...lib2.init_body
        ], fill_body, new Map(lib2.types), CompStep.User);
        const sexpr2 = [
          "module",
          ...monoBufferGlobals,
          process2(mod3),
          fill({
            type: mod3.f_type,
            params: mod3.f_params,
            blockSize: data.config.blockSize,
            channels: data.config.channels,
            maxChannels: data.config.maxChannels,
            channelBytes: CHANNEL_BYTES,
            memPadding: MEM_PADDING + EVENTS + sampleBufferSizes.bytes + CHANNEL_BYTES
          }),
          ...mod3.body
        ];
        console.log(S(sexpr2));
        console.log("WHAT");
        const binary = make(S(sexpr2), {
          metrics: false
        }, copy(lib2.context));
        const params = Object.values(mod3.funcs).map((f) => [
          f.id,
          f.params.filter((p) => p.export || mod3.exported_params.has(p))
        ]).filter((x) => x[1].length).map(([fnId, params2]) => params2.map((param) => {
          const exportIdMin = `export/${fnId}/${param.id}/min`;
          const exportIdMax = `export/${fnId}/${param.id}/max`;
          const exported = [];
          if (param.export) {
            const exportId = param.id.as(`export/${fnId}/${param.id}`);
            const code = param.id.source.input;
            const sourceIndex = code.lastIndexOf("'", exportId.source.index);
            const parseArg = /(?<arg>'?\s*(?<id>[a-zA-Z_$][a-zA-Z0-9_$]*)(?<range>\[[^\]]*?\])?(=.*?(?<default>[^\s,)]+)?)?).*?(,|\)\s*=)/s;
            const source2 = code.slice(sourceIndex).match(parseArg).groups;
            exported.push({
              id: exportId.toJSON(),
              name: exportId.toString(),
              fnId: fnId.toJSON(),
              paramId: param.id.toJSON(),
              exportIdMin,
              exportIdMax,
              sourceIndex,
              source: source2
            });
          }
          const exported_params_args = mod3.exported_params.get(param);
          if (exported_params_args) {
            for (const id of exported_params_args) {
              const token = mod3.exported_params_map.get(id)[1];
              const sourceIndex1 = token.index;
              exported.push({
                id: param.id.as(id).toJSON(),
                name: id,
                fnId: fnId.toJSON(),
                paramId: param.id.toJSON(),
                exportIdMin,
                exportIdMax,
                sourceIndex: sourceIndex1,
                source: {
                  arg: token.source.input.slice(sourceIndex1, sourceIndex1 + token.length)
                }
              });
            }
          }
          return exported;
        })).flat(Infinity);
        port.postMessage({
          success: true,
          id: data.id,
          binary,
          params
        }, [
          binary.buffer
        ]);
      } catch (error) {
        port.postMessage({
          id: data.id,
          error
        });
      }
    }
  };
};
//!? 'create accessor', key, prev, next
//!? 'removing accessor', key, desc
//!time 'module build'
//!timeEnd 'module build'
