#!/usr/bin/env node
/**
 * 打可分发的安装包：
 *   node scripts/package-dist.mjs
 *
 * 产物：dist/dsh-effort-slider-<version>.zip，解压后是一个自包含目录：
 *   dsh-effort-slider/
 *     README.md   LICENSE   install.command   install-profile.mjs
 *     package.json   index.js   client.js   cordis.patch.yml   docs/popover-high.png
 *
 * client.js 是构建产物：src/client 或构建脚本比它新时直接失败，先跑 scripts/build-client.mjs。
 */

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const PACKAGE = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
const VERSION = PACKAGE.version
const DIST = join(ROOT, 'dist')
const STAGE = join(DIST, 'dsh-effort-slider')
const ZIP = join(DIST, 'dsh-effort-slider-' + VERSION + '.zip')

function mtime(path) {
  return statSync(path).mtimeMs
}

function assertFreshClient() {
  const client = join(ROOT, 'client.js')
  if (!existsSync(client)) throw new Error('client.js 不存在，先跑 node scripts/build-client.mjs')
  const sources = [join(ROOT, 'scripts', 'build-client.mjs')]
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry)
      const stat = statSync(path)
      if (stat.isDirectory()) walk(path)
      else sources.push(path)
    }
  }
  walk(join(ROOT, 'src', 'client'))
  const newest = sources.reduce((max, path) => Math.max(max, mtime(path)), 0)
  if (mtime(client) < newest) {
    throw new Error('client.js 比 src/client 旧，先跑 node scripts/build-client.mjs 再打包')
  }
}

function distManifest() {
  return {
    name: PACKAGE.name,
    version: PACKAGE.version,
    private: true,
    type: 'module',
    description: 'Codex 风格的 DSH 推理强度滑杆：在 composer 模型座位里用可拖动渐变滑杆切换档位',
    license: 'MIT',
    exports: PACKAGE.exports,
    files: ['index.js', 'client.js', 'cordis.patch.yml', 'install-profile.mjs'],
    dsh: PACKAGE.dsh,
  }
}

function listZip() {
  try {
    return execFileSync('unzip', ['-l', ZIP], { encoding: 'utf8' })
  } catch {
    return ''
  }
}

assertFreshClient()
rmSync(DIST, { recursive: true, force: true })
mkdirSync(join(STAGE, 'docs'), { recursive: true })

for (const file of ['index.js', 'client.js', 'cordis.patch.yml']) {
  copyFileSync(join(ROOT, file), join(STAGE, file))
}
for (const file of ['README.md', 'LICENSE', 'install.command']) {
  copyFileSync(join(ROOT, 'packaging', file), join(STAGE, file))
}
copyFileSync(join(ROOT, 'scripts', 'install-profile.mjs'), join(STAGE, 'install-profile.mjs'))
copyFileSync(join(ROOT, 'docs', 'popover-high.png'), join(STAGE, 'docs', 'popover-high.png'))
chmodSync(join(STAGE, 'install.command'), 0o755)
writeFileSync(join(STAGE, 'package.json'), JSON.stringify(distManifest(), null, 2) + '\n')

execFileSync('zip', ['-r', '-X', '-q', ZIP, 'dsh-effort-slider'], { cwd: DIST })
const bytes = statSync(ZIP).size
const sha256 = createHash('sha256').update(readFileSync(ZIP)).digest('hex')
console.log('zip:    ' + ZIP)
console.log('bytes:  ' + bytes)
console.log('sha256: ' + sha256)
console.log(listZip())
