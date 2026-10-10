#!/usr/bin/env bun
// Add a locale across a Paraglide project (or the hoogin registry repo).
//   bun add-locale.ts <locale> [--root <dir>] [--src <dir>]
//
//   1. adds the locale to project.inlang/settings.json
//   2. creates messages/<locale>.json for the app's own strings
//   3. stubs messages/registry/<component>/<locale>.json for every component,
//      copying the en keys as placeholders
//
// Idempotent: existing locales and files are left untouched, so re-running is a
// no-op. In the registry repo: `--root example`.
import fs from "node:fs"
import path from "node:path"

const SCHEMA = "https://inlang.com/schema/inlang-message-format"

function parseArgs(argv: string[]) {
  const args = { locale: "", root: process.cwd(), src: "messages/registry" }
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--root") args.root = path.resolve(argv[++i])
    else if (argv[i] === "--src") args.src = argv[++i]
    else if (!args.locale && !argv[i].startsWith("--")) args.locale = argv[i]
  }
  return args
}

const { locale, root, src } = parseArgs(process.argv.slice(2))
if (!locale) {
  console.error("usage: bun add-locale.ts <locale> [--root <dir>] [--src <dir>]")
  process.exit(1)
}

const settingsPath = path.join(root, "project.inlang/settings.json")
if (!fs.existsSync(settingsPath)) {
  console.error(`no project.inlang/settings.json under ${root}`)
  process.exit(1)
}

const writeJson = (file: string, data: unknown) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n")
}

// 1. locale list
const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"))
const locales: string[] = settings.locales ?? []
if (locales.includes(locale)) {
  console.log(`settings.json: "${locale}" already listed`)
} else {
  settings.locales = [...locales, locale]
  writeJson(settingsPath, settings)
  console.log(`settings.json: + "${locale}"`)
}

// 2. app messages
const appFile = path.join(root, "messages", `${locale}.json`)
if (fs.existsSync(appFile)) {
  console.log(`messages/${locale}.json exists`)
} else {
  writeJson(appFile, { $schema: SCHEMA })
  console.log(`created messages/${locale}.json`)
}

// 3. component stubs, from each component's en.json
const srcDir = path.resolve(root, src)
let stubs = 0
if (fs.existsSync(srcDir)) {
  for (const component of fs.readdirSync(srcDir)) {
    const dir = path.join(srcDir, component)
    if (!fs.statSync(dir).isDirectory()) continue
    const en = path.join(dir, "en.json")
    const target = path.join(dir, `${locale}.json`)
    if (fs.existsSync(target)) {
      console.log(`stub exists: ${src}/${component}/${locale}.json`)
      continue
    }
    if (!fs.existsSync(en)) {
      console.log(`skipped (no en.json): ${src}/${component}`)
      continue
    }
    const { $schema, ...messages } = JSON.parse(fs.readFileSync(en, "utf8"))
    writeJson(target, { $schema: SCHEMA, ...messages })
    console.log(`stubbed: ${src}/${component}/${locale}.json`)
    stubs++
  }
}

console.log(`done: locale "${locale}"${stubs ? `, ${stubs} component stub(s)` : ""}`)
