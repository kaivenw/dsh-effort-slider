#!/usr/bin/env node
/**
 * 把 dsh-effort-slider 装进 / 卸出某个 DSH profile。
 *
 * 只改 profile 的 package.json（依赖 + bundles）与 node_modules 软链，不动其它配置。
 * 装/卸之后都要重启 DSH 才会重新组合 profile。
 *
 * 用法：
 *   node scripts/install-profile.mjs [--profile <dir>] [--dry-run]
 *   node scripts/install-profile.mjs --uninstall [--profile <dir>]
 */

import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
// 本仓布局：安装器在 scripts/ 下，插件根是上一级；分发包布局：安装器与 package.json 同层。
const REPO = existsSync(join(HERE, 'package.json')) ? HERE : resolve(HERE, '..')
const PACKAGE_NAME = '@local/dsh-effort-slider'
const BUNDLE_NAME = PACKAGE_NAME

// 防止把别人的 package.json 目录误当插件根。
const PLUGIN_MANIFEST = join(REPO, 'package.json')
if (!existsSync(PLUGIN_MANIFEST) || JSON.parse(readFileSync(PLUGIN_MANIFEST, 'utf8')).name !== PACKAGE_NAME) {
  throw new Error('不是 dsh-effort-slider 插件目录（' + REPO + '）：缺少 name 为 ' + PACKAGE_NAME + ' 的 package.json')
}

function parseArgs(argv) {
  const options = { profile: undefined, dryRun: false, uninstall: false }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--profile') options.profile = argv[++i]
    else if (arg.startsWith('--profile=')) options.profile = arg.slice('--profile='.length)
    else if (arg === '--dry-run') options.dryRun = true
    else if (arg === '--uninstall') options.uninstall = true
    else if (arg === '--help' || arg === '-h') {
      console.log('usage: node scripts/install-profile.mjs [--profile <profile-dir>] [--dry-run] [--uninstall]')
      process.exit(0)
    } else {
      throw new Error('unknown argument: ' + arg)
    }
  }
  if (options.profile === undefined) {
    const home = process.env.DSH_HOME ? resolve(process.env.DSH_HOME) : resolve(homedir(), '.dsh')
    const profiles = join(home, 'profiles')
    const candidates = ['desktop', 'web']
    const found = candidates.find((name) => existsSync(join(profiles, name, 'package.json')))
    if (found === undefined) {
      throw new Error(
        '找不到已初始化的 DSH profile（' + join(profiles, 'desktop') + ' 与 ' + join(profiles, 'web') + ' 都不存在）。' +
        '先启动一次 DSH，或显式传 --profile <profile 目录>。'
      )
    }
    options.profile = join(profiles, found)
  } else {
    options.profile = resolve(options.profile.replace(/^~(?=\/)/, homedir()))
  }
  return options
}

function readManifest(profileDir) {
  const file = join(profileDir, 'package.json')
  if (!existsSync(file)) throw new Error('profile package.json not found: ' + file)
  return { file, value: JSON.parse(readFileSync(file, 'utf8')) }
}

function ensureBundles(manifest) {
  const dsh = manifest.dsh ?? (manifest.dsh = {})
  const profile = dsh.profile ?? (dsh.profile = {})
  if (!Array.isArray(profile.bundles)) profile.bundles = []
  return profile.bundles
}

function linkPath(profileDir) {
  return join(profileDir, 'node_modules', '@local', 'dsh-effort-slider')
}

function lstatSafe(path) {
  try {
    return lstatSync(path)
  } catch {
    return undefined
  }
}

function linkPointsTo(link, target) {
  const stat = lstatSafe(link)
  if (stat === undefined) return false
  try {
    return resolve(dirname(link), readlinkSync(link)) === target
  } catch {
    return false
  }
}

function createLink(link, target) {
  mkdirSync(dirname(link), { recursive: true })
  if (lstatSafe(link) !== undefined) unlinkSync(link)
  // Windows 上普通目录软链需要管理员权限，junction 不需要；其它平台仍是目录软链。
  symlinkSync(target, link, process.platform === 'win32' ? 'junction' : 'dir')
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const profileDir = options.profile
  const { file, value } = readManifest(profileDir)
  const dependencies = value.dependencies ?? (value.dependencies = {})
  const bundles = ensureBundles(value)
  const link = linkPath(profileDir)
  const wanted = 'link:' + REPO
  const actions = []

  if (options.uninstall) {
    if (dependencies[PACKAGE_NAME] !== undefined) {
      delete dependencies[PACKAGE_NAME]
      actions.push('remove dependency ' + PACKAGE_NAME)
    }
    const index = bundles.indexOf(BUNDLE_NAME)
    if (index >= 0) {
      bundles.splice(index, 1)
      actions.push('remove bundle ' + BUNDLE_NAME)
    }
    if (lstatSafe(link) !== undefined) actions.push('remove symlink ' + link)
  } else {
    if (dependencies[PACKAGE_NAME] !== wanted) {
      dependencies[PACKAGE_NAME] = wanted
      actions.push('dependency ' + PACKAGE_NAME + ' -> ' + wanted)
    }
    if (!bundles.includes(BUNDLE_NAME)) {
      bundles.push(BUNDLE_NAME)
      actions.push('append bundle ' + BUNDLE_NAME)
    }
    if (!linkPointsTo(link, REPO)) actions.push('symlink ' + link + ' -> ' + REPO)
  }

  const manifestChanged = actions.some((action) => action.startsWith('dependency') || action.startsWith('remove dependency') || action.startsWith('append bundle') || action.startsWith('remove bundle'))

  if (options.dryRun) {
    console.log(JSON.stringify({ profile: profileDir, plugin: REPO, uninstalled: options.uninstall, dryRun: true, actions }, null, 2))
    return
  }

  if (manifestChanged) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFile = file + '.bak-dsh-effort-slider-' + stamp
    writeFileSync(backupFile, readFileSync(file))
    writeFileSync(file, JSON.stringify(value, null, 2) + '\n')
    actions.push('wrote ' + file + ' (backup ' + backupFile + ')')
  }
  if (options.uninstall) {
    if (lstatSafe(link) !== undefined) unlinkSync(link)
  } else if (!linkPointsTo(link, REPO)) {
    createLink(link, REPO)
    actions.push('linked ' + link)
  }
  console.log(JSON.stringify({
    profile: profileDir,
    plugin: REPO,
    uninstalled: options.uninstall,
    actions,
    next: options.uninstall
      ? 'restart DSH to drop the bundle'
      : 'restart DSH to load the bundle',
  }, null, 2))
}

main()
