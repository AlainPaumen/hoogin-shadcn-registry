# Architecture

Read this to understand what the `@hoogin/i18n` item installs, where messages come
from, and why your app's own bundle always wins. You rarely need it to *use* i18n;
you need it to debug the merge or explain the setup.

## Message flow

```txt
registry item (per component)             your app
src/messages/registry/<c>/<locale>.json   messages/<locale>.json
            │                                       │
            └──────────┬────────────────────────────┘
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

It exports two functions (read the installed file for the code):

- `mergeRegistryMessages({ root, srcDir, outDir, settings })` — reads every
  `<srcDir>/<component>/<locale>.json`, throws when two components define the
  same key, and writes one `<outDir>/<locale>.json` per locale in
  `settings.json`. A file is only rewritten when its content changes, so
  Paraglide doesn't recompile in a loop. Defaults: `srcDir` is where
  `shadcn add` installs the bundles (`src/messages/registry` when the project
  has a `src/` dir, `messages/registry` otherwise), `outDir` is
  `messages/.generated`, `settings` is `project.inlang/settings.json`.
- `registryMessages(options)` — the Vite plugin. Its `config` hook runs the
  merge with Vite's `root`; in dev it also watches `srcDir` and re-merges on any
  bundle change.

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
