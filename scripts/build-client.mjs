/**
 * 把 src/client/** 打成包根的 client.js（DSH 客户端模块加载器只认
 * `window.__ModuleLoader__.load({ id, factory })` 信封）。
 *
 * 运行时 require 只能出现 platform seed 表里的 9 个模块；其余依赖全部打进 bundle。
 */
import { build } from 'esbuild'
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const ENTRY = join(ROOT, 'src', 'client', 'index.jsx')
const OUTFILE = join(ROOT, 'client.js')
const ID = '@local/dsh-effort-slider'

const SEED_MODULES = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-store',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-dockkit',
]

const HEADER = '// Generated from src/client by \`node scripts/build-client.mjs\`. Do not edit by hand.'

function wrapEnvelope(factoryBody) {
  const strict = /^"use strict";\n/.test(factoryBody)
  const body = strict ? factoryBody.slice('"use strict";\n'.length) : factoryBody
  return `${HEADER}
window.__ModuleLoader__.load({
  id: '${ID}',
  factory: (require) => {
${strict ? '"use strict";\n' : ''}const module = { exports: {} }
${body}
return Object.defineProperty({ ...module.exports }, Symbol.toStringTag, { value: 'Module' })
  },
})
`
}

function collectRequireArgs(source) {
  const args = []
  const literal = /\brequire\(\s*(["'])((?:(?!\1).)*)\1\s*\)/g
  for (const match of source.matchAll(literal)) args.push(match[2])
  const calls = source.match(/\brequire\s*\(/g) ?? []
  return { args, calls: calls.length }
}

function assertSeedOnly(source) {
  const { args, calls } = collectRequireArgs(source)
  const outside = [...new Set(args)].filter((id) => !SEED_MODULES.includes(id))
  if (outside.length) throw new Error(`运行时 require 越出 seed 表：${outside.join(', ')}`)
  if (calls !== args.length) throw new Error(`有 ${calls - args.length} 处 require 的实参不是字符串字面量`)
  const envelopes = source.split('window.__ModuleLoader__.load').length - 1
  if (envelopes !== 1) throw new Error(`window.__ModuleLoader__.load 应恰好出现 1 次，实际 ${envelopes} 次`)
  return [...new Set(args)].sort()
}

const result = await build({
  entryPoints: [ENTRY],
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'browser',
  target: ['es2020'],
  jsx: 'automatic',
  loader: { '.css': 'text' },
  external: SEED_MODULES,
  charset: 'utf8',
  legalComments: 'none',
  minify: false,
  sourcemap: false,
  logLevel: 'warning',
})
const factoryBody = result.outputFiles[0].text.trimEnd()
const output = wrapEnvelope(factoryBody)
const required = assertSeedOnly(output)
await writeFile(OUTFILE, output, 'utf8')
console.log(`built ${OUTFILE} (${Buffer.byteLength(output, 'utf8')} bytes)`)
console.log(`require args (${required.length}): ${required.join(', ')}`)