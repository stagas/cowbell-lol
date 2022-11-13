<h1>
typescript-minimal-template <a href="https://npmjs.org/package/typescript-minimal-template"><img src="https://img.shields.io/badge/npm-v9.0.2-F00.svg?colorA=000"/></a> <a href="src"><img src="https://img.shields.io/badge/loc-2-FFF.svg?colorA=000"/></a> <a href="https://cdn.jsdelivr.net/npm/typescript-minimal-template@9.0.2/dist/typescript-minimal-template.min.js"><img src="https://img.shields.io/badge/brotli-92b-333.svg?colorA=000"/></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-F0B.svg?colorA=000"/></a>
</h1>

<p></p>

minimal typescript template

<h4>
<table><tr><td title="Triple click to select and copy paste">
<code>npm i typescript-minimal-template </code>
</td><td title="Triple click to select and copy paste">
<code>pnpm add typescript-minimal-template </code>
</td><td title="Triple click to select and copy paste">
<code>yarn add typescript-minimal-template</code>
</td></tr></table>
</h4>

## Examples

<details id="example$node" title="node" open><summary><span><a href="#example$node">#</a></span>  <code><strong>node</strong></code></summary>  <ul>    <details id="source$node" title="node source code" open><summary><span><a href="#source$node">#</a></span>  <code><strong>view source</strong></code></summary>  <a href="example/node.ts">example/node.ts</a>  <p>

```ts
import { add } from 'typescript-minimal-template'

console.log(add(1, 2))
```

</p>
</details></ul></details><details id="example$web" title="web" open><summary><span><a href="#example$web">#</a></span>  <code><strong>web</strong></code></summary>  <ul>    <details id="source$web" title="web source code" open><summary><span><a href="#source$web">#</a></span>  <code><strong>view source</strong></code></summary>  <a href="example/web.ts">example/web.ts</a>  <p>

```ts
import { add } from 'typescript-minimal-template'

const main = document.querySelector('main')!

main.innerHTML = `<h1>1 + 2 = ${add(1, 2)}</h1>`
```

</p>
</details></ul></details>

# [🥁 Use this template 🥁](https://github.com/stagas/typescript-minimal-template/generate)

## Features

- TypeScript with [SWC](https://swc.rs/)
- **JSX/TSX** out of the box
- Outputs both **CommonJS** and **ES Modules**, ready to **publish on npm**
- Automatic dist bundling using [bunzee](https://github.com/stagas/bunzee)
- Documentation generation using [dokio](https://github.com/stagas/dokio)
- Isomorphic Node.js and real browser testing incl. coverage and snapshots with [utr](https://github.com/stagas/utr)
- Examples / Playground using [devito](https://github.com/stagas/devito)
- Evergreen using [pull-configs](https://github.com/stagas/pull-configs)
- [ESLint](https://eslint.org/)
- [dprint](https://dprint.dev/)
- [Husky](https://typicode.github.io/husky/)

## API

<p>  <details id="add$1" title="Function" open><summary><span><a href="#add$1">#</a></span>  <code><strong>add</strong></code><em>(a, b)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="a$3" title="Parameter" ><summary><span><a href="#a$3">#</a></span>  <code><strong>a</strong></code>    </summary>    <ul><p>number</p>        </ul></details><details id="b$4" title="Parameter" ><summary><span><a href="#b$4">#</a></span>  <code><strong>b</strong></code>    </summary>    <ul><p>number</p>        </ul></details>  <p><strong>add</strong><em>(a, b)</em>  &nbsp;=&gt;  <ul>number</ul></p></p>    </ul></details></p>

## Contributing

[Fork](https://github.com/stagas/typescript-minimal-template/fork) or [edit](https://github.dev/stagas/typescript-minimal-template) and submit a PR.

All contributions are welcome!

## License

<a href="LICENSE">MIT</a> &copy; 2022 [stagas](https://github.com/stagas)
