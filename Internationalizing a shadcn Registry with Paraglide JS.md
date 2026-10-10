# Internationalizing a shadcn Registry with Paraglide JS

Oct 5, 2026 · @Alain Paumen

## Overview

Every component in our shadcn registry ships its own translations, so installing a component with the shadcn CLI also installs its messages in every supported language. Translations are compiled by Paraglide JS into type-safe message functions, and the active locale lives in the URL (`/en/...`, `/fr/...`).

| Concern | Choice |
| --- | --- |
| Runtime and package manager | Bun |
| Build tool | Vite |
| Router | TanStack Router (locale prefix via the router `rewrite` option) |
| UI | shadcn/ui, distributed from our own registry |
| i18n library | Paraglide JS (inlang message format, JSON files in the repo) |
| Plurals | Paraglide variants, backed by `Intl.PluralRules` |
| Dates, numbers, currency | `Intl.DateTimeFormat` and `Intl.NumberFormat` with the current locale |

Paraglide was chosen because it compiles each message into a typed function (a missing key is a TypeScript error), tree-shakes unused messages, and is the library TanStack's own i18n examples use. Translations are maintained by developers in JSON files in the repository.

## Architecture

Each component carries its own message files, and a small Vite plugin merges them into a generated folder that Paraglide reads alongside the app's own messages.

&#91;embedded content: message flow · registry to compiled messages\]

The shadcn CLI copies files but can't merge into an existing JSON file, so components can't write into the app's `messages/en.json`. Instead, they land in their own folder, and the merge step combines them. Because the app's `messages/{locale}.json` is the last path pattern, any project can reword a component string without touching the registry files, and re-installing a component never erases those overrides.

## The base `i18n` registry item

The `@acme/i18n` item holds everything that is shared by all translatable components. Every translatable component lists it in `registryDependencies`, so the CLI installs it automatically the first time.

| File (in the consumer project) | Purpose |
| --- | --- |
| `i18n/vite-plugin-registry-messages.ts` | Merges component message files into `messages/.generated/` |
| `i18n/merge-messages.ts` | Runs the same merge outside Vite (CI, type-checking) |
| `src/lib/i18n/format.ts` | Locale-aware date, number and currency helpers |

Its `dependencies` field lists `@inlang/paraglide-js`, and its `docs` field carries the one-time setup steps from the next section, which the CLI prints after installing.

### Merge plugin

The plugin uses only `node:fs` and `node:path`, so it works whether Vite runs on Bun or Node. It resolves paths from Vite's `root`, not `process.cwd()`, so it also works when started from a Bun workspace root with `bun --filter`.

```ts
// i18n/vite-plugin-registry-messages.ts
import fs from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"

export type Options = { root?: string; srcDir?: string; outDir?: string; settings?: string }

export function mergeRegistryMessages({
  root = process.cwd(),
  srcDir = "messages/registry",
  outDir = "messages/.generated",
  settings = "project.inlang/settings.json",
}: Options = {}) {
  const src = path.resolve(root, srcDir)
  const out = path.resolve(root, outDir)
  const { locales = [] } = JSON.parse(fs.readFileSync(path.resolve(root, settings), "utf8"))

  const merged: Record<string, Record<string, unknown>> = {}
  const owner: Record<string, string> = {}
  for (const l of locales) merged[l] = {}

  if (fs.existsSync(src)) {
    for (const component of fs.readdirSync(src)) {
      const dir = path.join(src, component)
      if (!fs.statSync(dir).isDirectory()) continue
      for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
        const locale = path.basename(file, ".json")
        const { $schema, ...messages } = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"))
        merged[locale] ??= {}
        for (const [key, value] of Object.entries(messages)) {
          if (owner[key] && owner[key] !== component) {
            throw new Error(`[i18n] Key "${key}" defined by both "${owner[key]}" and "${component}"`)
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
      2,
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
      opts = { root: path.resolve(userConfig.root ?? process.cwd()), ...options }
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

The plugin writes a file for every locale listed in `settings.json`, even when no component translates into it. A component that ships only `en` and `fr` therefore doesn't break a project that also supports `de`; those keys fall back to the base locale.

### Standalone merge script

Bun runs TypeScript directly, so the merge can run without Vite:

```ts
// i18n/merge-messages.ts
import { mergeRegistryMessages } from "./vite-plugin-registry-messages"
mergeRegistryMessages()
```

### Formatting helpers

```ts
// src/lib/i18n/format.ts
import { getLocale } from "@/paraglide/runtime"

export const formatDate = (d: Date, opts?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(getLocale(), { dateStyle: "medium", ...opts }).format(d)

export const formatNumber = (n: number, opts?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(getLocale(), opts).format(n)

export const formatCurrency = (n: number, currency = "EUR") =>
  new Intl.NumberFormat(getLocale(), { style: "currency", currency }).format(n)
```

## One-time setup in a consumer project

A project does these steps once, before installing its first translatable component. The shadcn CLI can't patch `vite.config.ts` or `settings.json`, which is why they are manual.

1. Initialize Paraglide, which creates `project.inlang/` and `messages/en.json`:

   ```bash
   bunx @inlang/paraglide-js@latest init
   ```

2. Install the base item:

   ```bash
   bunx --bun shadcn@latest add @acme/i18n
   ```

3. Register the merge plugin before Paraglide in `vite.config.ts`:

   ```ts
   import { paraglideVitePlugin } from "@inlang/paraglide-js"
   import { registryMessages } from "./i18n/vite-plugin-registry-messages"
   
   export default defineConfig({
     plugins: [
       tanstackRouter(),
       registryMessages(),
       paraglideVitePlugin({
         project: "./project.inlang",
         outdir: "./src/paraglide",
         strategy: ["url", "baseLocale"],
       }),
       react(),
     ],
   })
   ```

4. Point Paraglide at both message sources in `project.inlang/settings.json`. The last pattern takes precedence, so the app's own messages override component messages:

   ```json
   "plugin.inlang.messageFormat": {
     "pathPattern": ["./messages/.generated/{locale}.json", "./messages/{locale}.json"]
   }
   ```

5. Add the locale prefix to the router in `router.tsx`:

   ```ts
   import { deLocalizeUrl, localizeUrl } from "./paraglide/runtime"
   
   export const router = createRouter({
     routeTree,
     rewrite: {
       input: ({ url }) => deLocalizeUrl(url),
       output: ({ url }) => localizeUrl(url),
     },
   })
   ```

6. Ignore generated output in `.gitignore`:

   ```txt
   messages/.generated/
   src/paraglide/
   ```

7. Add scripts to `package.json`:

   ```json
   "scripts": {
     "dev": "bunx --bun vite",
     "build": "bunx --bun vite build",
     "i18n": "bun i18n/merge-messages.ts && bunx @inlang/paraglide-js compile --project ./project.inlang --outdir ./src/paraglide",
     "typecheck": "bun run i18n && tsc --noEmit"
   }
   ```

The `--bun` flag makes Vite run on Bun's runtime; without it, Vite's Node shebang runs it under Node. Both work with this setup.

Components import messages from `@/paraglide/messages`. shadcn rewrites its own aliases (`@/components`, `@/lib`) but leaves this path untouched, so every consumer must use `outdir: "./src/paraglide"` with `@` mapped to `src`. Finally, set `<html lang={getLocale()}>` in the root route so screen readers use the right language.

## Authoring a translatable component

A translatable component is a normal registry item plus one `registry:file` entry per locale, each with a `target` under `messages/registry/<component>/`.

### Registry item

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "data-table",
  "type": "registry:block",
  "registryDependencies": ["@acme/i18n", "button", "table"],
  "files": [
    {
      "path": "registry/blocks/data-table/data-table.tsx",
      "type": "registry:component"
    },
    {
      "path": "registry/messages/data-table/en.json",
      "type": "registry:file",
      "target": "messages/registry/data-table/en.json"
    },
    {
      "path": "registry/messages/data-table/fr.json",
      "type": "registry:file",
      "target": "messages/registry/data-table/fr.json"
    }
  ]
}
```

### Message files

```json
{
  "$schema": "https://inlang.com/schema/inlang-message-format",
  "dataTable_previous": "Previous",
  "dataTable_next": "Next",
  "dataTable_pageOf": "Page {page} of {total}"
}
```

### Using messages in the component

```tsx
import { m } from "@/paraglide/messages"

<Button variant="outline" onClick={() => table.previousPage()}>
  {m.dataTable_previous()}
</Button>
<span>{m.dataTable_pageOf({ page, total })}</span>
```

### Plurals

Plurals use variants. Verify the exact syntax against the current inlang message-format docs, as it has changed between Paraglide versions.

```json
"dataTable_rowsSelected": [{
  "declarations": ["input count", "local countPlural = count: plural"],
  "selectors": ["countPlural"],
  "match": {
    "countPlural=one": "{count} row selected",
    "countPlural=other": "{count} rows selected"
  }
}]
```

### Strings hidden in shadcn primitives

Base shadcn components contain hardcoded English that is easy to miss. Translate these when they are part of our registry:

- Screen-reader text such as `<span className="sr-only">Close</span>` in Dialog and Sheet.
- Pagination's "Previous", "Next" and "More pages".
- Aria-labels in Breadcrumb and Carousel.
- The Calendar and DatePicker: pass react-day-picker a date-fns locale matching `getLocale()`, so month names and the first day of the week are localized.

## Registry repository setup

The registry repo runs the same Paraglide setup as a consumer, so components compile and type-check against their own messages during development. The only difference is the source folder:

```ts
registryMessages({ srcDir: "registry/messages" })
```

Because `registry/messages/<component>/<locale>.json` has the same shape as the install target `messages/registry/<component>/<locale>.json`, paths map one-to-one. The registry's `project.inlang/settings.json` lists every locale we ship, and a newly added locale simply falls back to \`en\` until its translations arrive.

Registry layout:

```txt
registry/
  blocks/
    data-table/data-table.tsx
  messages/
    data-table/
      en.json
      fr.json
  lib/
    i18n/vite-plugin-registry-messages.ts
    i18n/merge-messages.ts
    i18n/format.ts
registry.json
```

## Conventions

| Rule | Why |
| --- | --- |
| Prefix every key with the component name in camelCase: `dataTable_next`, `loginForm_submit` | Paraglide has one flat namespace; the merge throws on duplicate keys |
| Use only underscores and letters in keys | Keys become exported function names |
| Ship the base locale (`en`) for every component | It is the fallback for any missing translation |
| Import messages only from `@/paraglide/messages` | shadcn doesn't rewrite this path |
| Never edit `messages/.generated/` | It is overwritten on every merge |
| Override component wording in the app's `messages/{locale}.json` | Overrides survive re-installing or updating a component |
| Format dates and numbers only through `format.ts` | Keeps output tied to the current locale |
| Keep the merge plugin on `node:` APIs, not `Bun.*` | Consumers or tools like Vitest may load `vite.config.ts` under Node |

## Day-to-day workflows

### Install a component

```bash
bunx --bun shadcn@latest add @acme/data-table
```

The CLI copies the component and its message files. With the dev server running, the merge plugin picks up the new files and Paraglide recompiles; otherwise the next `bun run dev` handles it.

### Add a language to a project

1. Add the locale to `locales` in `project.inlang/settings.json`.
2. Create `messages/<locale>.json` for the app's own strings.
3. Restart the dev server. Registry components already translated into that locale work immediately; the rest fall back to the base locale.

### Override a component's wording

Add the same key to the app's `messages/<locale>.json`. Because it is the last path pattern, it wins over the component's message:

```json
{ "dataTable_next": "Next page" }
```

### Add a translation to the registry

1. Add `registry/messages/<component>/<locale>.json` in the registry repo.
2. Add a matching `registry:file` entry with its `target` to the item in `registry.json`.
3. Rebuild the registry. Consumers get the file the next time they run `shadcn add` for that component.

### Update a component

Re-run `shadcn add` for the component and accept the overwrite prompts. Message files in `messages/registry/` are replaced, while app-level overrides in `messages/<locale>.json` stay intact.

### CI

Run `bun run typecheck`. It merges messages and compiles Paraglide before `tsc`, so a component that references a missing key fails the build.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `[i18n] Key "x" defined by both "a" and "b"` | Two components use the same key | Rename one key with its component prefix |
| `Property 'x' does not exist` on `m` | Messages not merged or compiled yet | Run `bun run i18n`, or restart the dev server |
| Cannot resolve `@/paraglide/messages` | Paraglide `outdir` or `@` alias differs | Use `outdir: "./src/paraglide"` and map `@` to `src` |
| Plugin can't find `project.inlang/settings.json` | Vite started from a workspace root | Set `root` in the Vite config; the plugin uses it |
| Dev server recompiles in a loop | Something else writes to `messages/.generated/` | Only the merge plugin may write there |
| A string shows in English in another locale | Component has no file for that locale | Add the translation in the registry, or override it in the app |
| Inlang editor tools write duplicate messages | Multiple path patterns get written on export | Edit `messages/{locale}.json` or the registry source, never `.generated` |
