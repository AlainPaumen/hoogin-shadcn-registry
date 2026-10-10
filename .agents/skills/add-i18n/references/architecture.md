# Architecture

Read this to understand what the `@hoogin/i18n` item installs, where messages come
from, and why your app's own bundle always wins. You rarely need it to *use* i18n;
you need it to debug the merge or explain the setup.

## Message flow

```txt
registry item (per component)         your app
messages/registry/<c>/<locale>.json   messages/<locale>.json
            │                                   │
            └──────────┬────────────────────────┘
                       ▼
      merge plugin → messages/.generated/<locale>.json
                       ▼
      Paraglide → src/paraglide/ (typed m.*() functions)
```

The shadcn CLI copies files but can't merge into an existing JSON file, so a
component can't write into your `messages/<locale>.json`. Instead its bundles land
in their own folder, and the merge step combines them. Because your
`messages/<locale>.json` is the **last** `pathPattern`, any project can reword a
component string without touching registry files, and reinstalling a component
never erases those overrides.

The plugin writes a file for **every** locale in `settings.json`, even when no
component translates into it. A component that ships only `en` and `nl` therefore
doesn't break a project that also supports `de` — those keys fall back to the base
locale.

## The three files the base item ships

Installed to `src/i18n/` and `src/lib/i18n/`. They use only `node:` APIs, so they
work whether Vite runs on Bun or Node.

### `src/i18n/vite-plugin-registry-messages.ts`

Resolves paths from Vite's `root`, not `process.cwd()`, so it also works when
started from a Bun workspace root with `bun --filter`.

```ts
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
```

The `config` hook runs before any plugin's `buildStart`, so the merged files exist
before Paraglide compiles them — that is why `registryMessages()` must be listed
**before** `paraglideVitePlugin()`.

### `src/i18n/merge-messages.ts`

Bun runs TypeScript directly, so the merge also runs outside Vite (CI,
type-checking):

```ts
import { mergeRegistryMessages } from "./vite-plugin-registry-messages"
mergeRegistryMessages()
```

### `src/lib/i18n/format.ts`

Locale-aware formatters for the current locale:

```ts
import { getLocale } from "@/paraglide/runtime"

export const formatDate = (d: Date, opts?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(getLocale(), { dateStyle: "medium", ...opts }).format(d)

export const formatNumber = (n: number, opts?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(getLocale(), opts).format(n)

export const formatCurrency = (n: number, currency = "EUR") =>
  new Intl.NumberFormat(getLocale(), { style: "currency", currency }).format(n)
```

## Inside the registry repo

The registry repo runs the same setup to develop and type-check its components. The
only difference is the source folder the plugin reads:

```ts
registryMessages({ srcDir: "example/messages/registry" })
```

`example/messages/registry/<component>/<locale>.json` maps one-to-one onto the
consumer install target `messages/registry/<component>/<locale>.json`, so
`scripts/sync.ts` copies between them. The registry's
`example/project.inlang/settings.json` lists every locale it ships; a newly added
locale falls back to `en` until its translations arrive.
