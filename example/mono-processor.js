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

// ../../../../.fastpm/-/join-regexp@1.0.0/dist/esm/index.js
var joinRegExp = (regexps, flags = "") => new RegExp(regexps.flat().map((x) => x.toString()).map((x) => x.slice(x.indexOf("/") + 1, x.lastIndexOf("/"))).join("|"), flags);

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
var createParser = (regexp, fn) => {
  const tokenizer = (input) => input.matchAll(new RegExpToken(regexp));
  const Lexer = createLexer(tokenizer);
  const parse = (input) => {
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
  return parse;
};

// ../../mono/dist/esm/causes.js
var CompilerErrorCause = class extends causes_exports2.ParserErrorCause {
  name = "CompilerUnknownError";
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
var Struct = class {
  constructor(context, sym) {
    this.context = context;
    this.sym = sym;
    this.read = (type, index) => {
      const { typeAs, cast } = this.context.module;
      return typeAs(type, [
        `${type}.load offset=${index << 2}`,
        cast(Type.i32, this.sym.get())
      ]);
    };
    this.write = (type, index, value) => {
      const { typeAs, cast, denan } = this.context.module;
      return typeAs(Type.none, [
        `${type}.store offset=${index << 2}`,
        cast(Type.i32, this.sym.get()),
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
var padCenter = (str, length2) => {
  const strLength = getStringLength(str);
  const padLength = Math.floor((length2 - strLength) / 2);
  return repeatString(" ", length2 - strLength - padLength) + str + repeatString(" ", padLength);
};
var getStringLength = (str) => stripAnsi(str).length;
var padStart = (str, length2, char = " ") => {
  const strLength = getStringLength(str);
  return repeatString(char, length2 - strLength) + str;
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
var pending = /* @__PURE__ */ new Map();
var VM = class {
  id;
  memory;
  instance;
  params;
  floats;
  ints;
  inputs;
  outputs;
  samples;
  monoBuffers;
  port;
  constructor(config2 = {
    ...config
  }) {
    this.config = config2;
    this.id = cheapRandomId();
    this.params = [];
    this.monoBuffers = /* @__PURE__ */ new Map();
    this.sampleBuffers = [];
    this.sampleBufferRanges = [];
    this.exportEntries = {};
    this.isReady = false;
    this.memory = new WebAssembly.Memory(memory);
    console.log(this.memory);
    this.makeSampleBuffers();
    this.makeFloats();
  }
  setPort(port) {
    this.port = port;
    port.onmessage = async ({ data }) => {
      const task = pending.get(data.id);
      if (!task) {
        console.error("Task not found", data.id);
        return;
      }
      pending.delete(data.id);
      if (data.success) {
        try {
          const instance = (await WebAssembly.instantiate(data.binary, {
            env: {
              memory: task.owner.memory
            }
          })).instance;
          task.deferred.resolve({
            instance,
            params: data.params
          });
        } catch (error) {
          task.deferred.reject(error);
        }
      } else {
        task.deferred.reject(data.error);
      }
    };
  }
  setNumberOfChannels(numberOfChannels) {
    const diff = numberOfChannels - this.inputs.length;
    if (diff > 0) {
      console.log("memory grow by", diff, "channels. was:", this.config.channels, "now:", numberOfChannels);
      this.memory.grow(Math.ceil(diff * CHANNEL_BYTES / PAGE_BYTES));
      this.config.channels = numberOfChannels;
      this.makeSampleBuffers();
      this.makeFloats();
      this.setCode(this.code);
    }
  }
  createMonoBuffer(id, pos, size) {
    const structData = new Int32Array(this.memory.buffer, pos, 5);
    structData.set([
      0,
      0,
      size,
      size - 1,
      size * Float32Array.BYTES_PER_ELEMENT
    ]);
    const monoBuffer = Object.assign(new Float32Array(this.memory.buffer, pos + 5 * Int32Array.BYTES_PER_ELEMENT, size), {
      id,
      pos,
      size,
      structData
    });
    this.monoBuffers.set(id, monoBuffer);
    return monoBuffer;
  }
  makeSampleBuffers() {
    const { sampleCount: sampleCount2, sampleChannels: sampleChannels2 } = this.config;
    const sizes2 = sampleBufferSizes;
    this.samples = Array.from({
      length: sampleCount2
    }, () => Array.from({
      length: sampleChannels2
    }));
    const startPos2 = MEM_PADDING + EVENTS;
    for (let i = 0; i < sampleCount2; i++) {
      this.samples[i] = [];
      for (let c = 0; c < sampleChannels2; c++) {
        const pos = startPos2 + (i * sizes2.one + c * sizes2.channel) * Float32Array.BYTES_PER_ELEMENT;
        this.samples[i][c] = this.createMonoBuffer(`s${i}_${c}`, pos, sizes2.channel - 5);
      }
    }
  }
  makeFloats() {
    const { channels, blockSize } = this.config;
    this.floats = new Float32Array(this.memory.buffer);
    this.ints = new Int32Array(this.memory.buffer);
    this.inputs = Array.from({
      length: channels
    });
    this.outputs = Array.from({
      length: channels
    });
    const startPos2 = MEM_PADDING + EVENTS + sampleBufferSizes.bytes + CHANNEL_BYTES;
    for (let i = 0; i < channels; i++) {
      const pos = startPos2 + i * CHANNEL_BYTES;
      this.inputs[i] = this.createMonoBuffer(`i${i}`, pos, blockSize);
      this.outputs[i] = this.createMonoBuffer(`o${i}`, pos + blockSize * Float32Array.BYTES_PER_ELEMENT + 5 * Int32Array.BYTES_PER_ELEMENT, blockSize);
    }
  }
  sampleBuffers;
  setSampleBuffer(index, buffer, range) {
    this.sampleBuffers[index] = buffer;
    this.sampleBufferRanges[index] = range = range || [
      0,
      buffer[0].length
    ];
    const sample = this.samples[index];
    for (let c = 0; c < sample.length; c++) {
      const channel = buffer[Math.min(c, buffer.length - 1)];
      const len = Math.min(sample[c].length, range[1] - range[0]);
      sample[c].structData.set([
        0,
        0,
        len,
        len - 1,
        len * Float32Array.BYTES_PER_ELEMENT
      ]);
      sample[c].set(channel.subarray(range[0], range[1]));
      if (len < sample[c].length) {
        sample[c].fill(0, len);
      }
    }
  }
  sampleBufferRanges;
  setSampleBufferRange(index, range) {
    this.sampleBufferRanges[index] = range;
    this.setSampleBuffer(index, this.sampleBuffers[index], range);
  }
  get exports() {
    return this.instance?.exports;
  }
  exportEntries;
  async setCode(code) {
    if (this.isReady) {
      for (const [key, global] of Object.entries(this.exports)) {
        if (key.startsWith("export/") && global instanceof WebAssembly.Global) {
          this.exportEntries[key] = global.value;
        }
      }
    }
    const { instance, params } = await this.link(code);
    this.instance = instance;
    this.code = code;
    if (!this.isReady) {
      for (const [i, b] of this.sampleBuffers.entries()) {
        if (b)
          this.setSampleBuffer(i, b, this.sampleBufferRanges[i]);
      }
      this.exports.__start__();
      this.exports.update_exports();
      this.exports.fill(0, 0, 0, 0);
      this.exportEntries = {};
      for (const [key1, global1] of Object.entries(this.exports)) {
        if (global1 instanceof WebAssembly.Global) {
          this.exportEntries[key1] = global1.value;
        }
      }
    } else {
      this.exports.update_exports();
      for (const [key2, value] of Object.entries(this.exportEntries)) {
        try {
          if (!key2.startsWith("export/")) {
            this.exports[key2].value = value;
          }
        } catch {
        }
      }
    }
    this.params = params.map((param) => {
      const id = new Token(param.id);
      const minValue = this.exports[param.exportIdMin].value ?? 0;
      const maxValue = this.exports[param.exportIdMax].value ?? 1;
      const defaultValue = this.exports[param.name].value ?? (maxValue - minValue) * 0.5 + minValue;
      const monoParam = new MonoParam({
        ...param,
        id,
        fnId: new Token(param.fnId),
        paramId: new Token(param.paramId),
        code,
        minValue,
        maxValue,
        defaultValue
      });
      return monoParam;
    });
    this.isReady = true;
  }
  isReady;
  code;
  async link(code) {
    const deferred = Deferred();
    const id = cheapRandomId();
    pending.set(id, {
      owner: this,
      deferred
    });
    this.port.postMessage({
      id,
      link: code,
      monoBuffers: [
        ...this.monoBuffers
      ].map(([id2, monoBuffer]) => [
        id2,
        monoBuffer.pos
      ]),
      config: this.config
    });
    return deferred.promise;
  }
  config;
};

// ../../mono/dist/esm/syntax.js
var ids = /[a-zA-Z_$][a-zA-Z0-9_$]*/;
var num = /inf|nan|\d*\.?\d*e[+-]?\d+|(\d*\.((e[+-]?)?[\d]+)*\d+|\.\d+|\d+)([skKmbf]|ms)?/;
var ops = /%%|::|\?=|\+\+|--|\+=|-=|\*=|\/=|%=|<<=|>>=|&=|\^=|\|=|&&|!&|\|\||!=|==|>=|<=|>>|<<|\.\.|[[\](){}\\"'`,\-~+*/%=<>?!:;.|&^@]{1}/;
var syntax = {
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
  slice(length2) {
    const buffer = this.buffer;
    const ptr = this.readPtr;
    const slice = buffer.subarray(ptr, ptr + length2);
    if (!isFinite(slice[0])) {
      this.buffer.fill(-Infinity, 2, 2 + ptr);
      this.readPtr = this.writePtr = 2;
      return void 0;
    }
    this.readPtr = ptr + length2;
    return slice;
  }
};

// ../../scheduler-node/dist/esm/midi.js
var MIDIMessageEvent = class extends Event {
  data;
  receivedTime;
  receivedFrame;
  offsetFrame;
  deltaFrame;
  constructor(type, options) {
    super(type);
    this.data = options.data;
  }
};

// ../../scheduler-node/dist/esm/scheduler-target-processor.js
var sortByFrame = (a, b) => a.offsetFrame - b.offsetFrame;
var midiEvents = [];
var midiEventPool = Array.from({
  length: 128
}, () => new MIDIMessageEvent("midimessage", {
  data: new Uint8Array(3)
}));
var midiEventPoolPtr = 0;
var SchedulerTargetProcessor = class extends AudioWorkletProcessor {
  midiQueue = new MessageQueue();
  didError = false;
  constructor() {
    super();
    const [worklet] = new Bob((data) => this.port.postMessage(data), this).agents({
      debug: false
    });
    this.port.onmessage = ({ data }) => worklet.receive(data);
  }
  async resetError() {
    this.didError = false;
  }
  async init(buffer) {
    this.midiQueue.buffer = buffer;
  }
  process(inputs, outputs, parameters) {
    if (this.didError)
      return true;
    let message;
    let prevFrame = 0;
    let max = 16;
    midiEvents.splice(0);
    while ((message = this.midiQueue.slice(4)) && max--) {
      const event = midiEventPool[midiEventPoolPtr];
      midiEventPoolPtr = (midiEventPoolPtr + 1) % midiEventPool.length;
      event.data.set(message.subarray(1));
      event.receivedTime = message[0] || currentTime * 1e3;
      event.receivedFrame = Math.floor(event.receivedTime * 1e-3 * sampleRate);
      event.offsetFrame = event.receivedFrame - currentFrame;
      event.deltaFrame = Math.max(0, event.offsetFrame - prevFrame);
      prevFrame = event.offsetFrame;
      midiEvents.push(event);
    }
    if (midiEvents.length) {
      midiEvents.sort(sortByFrame);
      this.processMidiEvents(midiEvents);
    }
    try {
      return this.processWithMidi(inputs, outputs, parameters, midiEvents);
    } catch (error) {
      console.warn(error);
      this.didError = true;
      return true;
    }
  }
};

// ../../mono-worklet/dist/esm/util.js
var copyBuffers = (from, to, channelCount, vm) => {
  for (let channel = 0; channel < channelCount; channel++) {
    const target = to[channel];
    const source = from[channel];
    if (!target) {
      console.warn("Target channel not found:", channel, channelCount, to);
      console.warn(vm.code);
    } else if (!source) {
      target.fill(0);
    } else {
      target.set(source);
    }
  }
};

// ../../mono-worklet/dist/esm/mono-processor.js
var MidiOp = {
  144: "note_on",
  137: "note_off"
};
var _MonoProcessor = class extends SchedulerTargetProcessor {
  static get parameterDescriptors() {
    return this.parametersMap.split("").map((name) => ({
      name,
      defaultValue: 0,
      minValue: 0,
      maxValue: 1,
      automationRate: "k-rate"
    }));
  }
  vm;
  initial;
  suspended;
  disabled;
  offsetFrame;
  lastMidiEventTime;
  timeToSuspend;
  didPlay;
  constructor(options) {
    super();
    this.options = options;
    this.initial = false;
    this.suspended = true;
    this.disabled = false;
    this.offsetFrame = 0;
    this.lastMidiEventTime = 0;
    this.timeToSuspend = 5;
    this.didPlay = false;
    this.createVM();
  }
  workerPort;
  async setPort(port) {
    this.workerPort = port;
    this.vm.setPort(port);
  }
  setTimeToSuspend(ms) {
    this.timeToSuspend = ms;
  }
  async setCode(code) {
    await this.vm.setCode(code);
    if (this.initial) {
      this.initial = false;
      this.vm.exports.sampleRate.value = sampleRate;
      this.vm.exports.currentTime.value = 1;
    }
    return {
      params: this.vm.params
    };
  }
  async setSampleBuffer(index, buffer, range) {
    return this.vm.setSampleBuffer(index, buffer, range);
  }
  async setSampleBufferRange(index, range) {
    return this.vm.setSampleBufferRange(index, range);
  }
  async createVM() {
    this.initial = true;
    this.didPlay = false;
    const code = this.vm?.code;
    const sampleBuffers = this.vm?.sampleBuffers;
    this.vm = new VM();
    if (this.workerPort) {
      this.vm.setPort(this.workerPort);
      if (code) {
        this.vm.sampleBuffers = sampleBuffers;
        return this.setCode(code);
      }
    }
  }
  test(frame, end, params) {
    this.vm.exports.fill(0, frame, 0, end, ...params);
    return this.vm.floats.slice(0, length);
  }
  resume() {
    this.suspended = false;
  }
  suspend() {
    this.suspended = true;
  }
  disable() {
    this.disabled = true;
  }
  handleMidiEvent(payload, noFill = false) {
    if (!this.didPlay)
      return;
    if (!noFill) {
      this.vm.exports.fill(0, currentFrame - this.offsetFrame, 0, 0);
    }
    this.vm.exports[MidiOp[payload[0]]]?.(payload[1], payload[2]);
  }
  resetTime() {
    this.offsetFrame = currentFrame;
  }
  resetTimeAndWakeup() {
    this.resetTime();
    this.suspended = false;
    this.vm.exports.fill(0, currentFrame - this.offsetFrame, 0, 0);
  }
  processMidiEvents() {
    this.suspended = false;
  }
  processWithMidi([possibleInputs], [outputs], parameters, events) {
    if (this.disabled)
      return false;
    const { vm } = this;
    if (!vm.isReady)
      return true;
    const { parametersMap } = _MonoProcessor;
    const inputs = [];
    let activeInputChannelCount = 0;
    for (let i = 0; i < possibleInputs.length; i++) {
      const x = possibleInputs[i];
      const hasSound = x[0] !== 0 || x.at(-1) !== 0;
      if (i < vm.config.channels || hasSound) {
        if (hasSound) {
          inputs.push(x);
          activeInputChannelCount++;
        } else {
          inputs.push(null);
        }
      }
    }
    if (this.suspended) {
      if (activeInputChannelCount) {
        this.lastMidiEventTime = currentTime;
        this.suspended = false;
      } else
        return true;
    }
    const channelCount = inputs.length || 1;
    vm.setNumberOfChannels(channelCount);
    if (channelCount)
      copyBuffers(inputs, vm.inputs, channelCount, vm);
    vm.params.forEach((x, i) => {
      if (!(x.name in vm.exports))
        return;
      const value = parameters[parametersMap[i]][0] * x.scaleValue + x.minValue;
      vm.exports[x.name].value = value;
    });
    let frame = currentFrame - this.offsetFrame;
    let totalFrames = 0;
    const processEvents = [];
    if (events.length) {
      this.lastMidiEventTime = currentTime;
      for (const event of events) {
        if (event.deltaFrame) {
          processEvents.push([
            0,
            frame,
            totalFrames,
            totalFrames + event.deltaFrame
          ]);
          frame += event.deltaFrame;
          totalFrames += event.deltaFrame;
        }
        processEvents.push([
          1,
          event.data[0],
          event.data[1],
          event.data[2]
        ]);
      }
    } else {
      if (currentTime - this.lastMidiEventTime > this.timeToSuspend) {
        this.suspended = true;
      }
    }
    if (totalFrames < vm.config.blockSize) {
      processEvents.push([
        0,
        frame,
        totalFrames,
        vm.config.blockSize
      ]);
    }
    vm.ints.set(processEvents.slice(0, 128).flat(), vm.config.eventsPointer >> 2);
    vm.exports.process(1, Math.min(128, processEvents.length));
    copyBuffers(vm.outputs, outputs, channelCount, vm);
    this.didPlay = true;
    return true;
  }
  options;
};
var MonoProcessor = _MonoProcessor;
__publicField(MonoProcessor, "processorName", "mono");
__publicField(MonoProcessor, "parametersMap", "abcdefghijklmnopqrstuvwxyz");
registerProcessor(MonoProcessor.processorName, MonoProcessor);
export {
  MonoProcessor
};
//!> count++
//!> if (count % 500 === 0)
//!? 'create accessor', key, prev, next
//!? 'removing accessor', key, desc
//!? 'suspended'
//!? events
//!time 'fill'
//!timeEnd 'fill'
