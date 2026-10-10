import fs from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"

export type Options = {
  root?: string
  srcDir?: string
  outDir?: string
  settings?: string
}

export function mergeRegistryMessages({
  root = process.cwd(),
  srcDir = "messages/registry",
  outDir = "messages/.generated",
  settings = "project.inlang/settings.json",
}: Options = {}) {
  const src = path.resolve(root, srcDir)
  const out = path.resolve(root, outDir)
  const { locales = [] } = JSON.parse(
    fs.readFileSync(path.resolve(root, settings), "utf8")
  )

  const merged: Record<string, Record<string, unknown>> = {}
  const owner: Record<string, string> = {}
  for (const l of locales) merged[l] = {}

  if (fs.existsSync(src)) {
    for (const component of fs.readdirSync(src)) {
      const dir = path.join(src, component)
      if (!fs.statSync(dir).isDirectory()) continue
      for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
        const locale = path.basename(file, ".json")
        const messages = JSON.parse(
          fs.readFileSync(path.join(dir, file), "utf8")
        ) as Record<string, unknown>
        delete messages.$schema
        merged[locale] ??= {}
        for (const [key, value] of Object.entries(messages)) {
          if (owner[key] && owner[key] !== component) {
            throw new Error(
              `[i18n] Key "${key}" defined by both "${owner[key]}" and "${component}"`
            )
          }
          owner[key] = component
          merged[locale][key] = value
        }
      }
    }
  }

  fs.mkdirSync(out, { recursive: true })
  for (const [locale, messages] of Object.entries(merged)) {
    const target = path.join(out, `${locale}.json`)
    const next = JSON.stringify(
      { $schema: "https://inlang.com/schema/inlang-message-format", ...messages },
      null,
      2
    )
    // Only write on change, so Paraglide doesn't recompile in a loop
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== next) {
      fs.writeFileSync(target, next)
    }
  }
}

export function registryMessages(options: Options = {}): Plugin {
  let opts = options
  return {
    name: "registry-messages",
    // `config` runs before any plugin's buildStart, so files exist before Paraglide compiles
    config(userConfig) {
      opts = {
        root: path.resolve(userConfig.root ?? process.cwd()),
        ...options,
      }
      mergeRegistryMessages(opts)
    },
    configureServer(server) {
      const src = path.resolve(opts.root!, opts.srcDir ?? "messages/registry")
      server.watcher.add(src)
      const onChange = (f: string) => {
        if (f.startsWith(src) && f.endsWith(".json")) mergeRegistryMessages(opts)
      }
      server.watcher.on("add", onChange)
      server.watcher.on("change", onChange)
      server.watcher.on("unlink", onChange)
    },
  }
}