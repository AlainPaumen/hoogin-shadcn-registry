---
name: hgn-internationalizing-apps
description: Add internationalization to a Vite + TanStack Router app with Paraglide JS and the @hoogin/i18n registry item (locale from cookie/browser, or optionally locale-prefixed URLs) — install translatable components, add a language, override wording, and format dates and numbers by locale. Use when asked to add i18n/localization, add or switch a language/locale, install a translatable @hoogin component, or debug strings stuck in the wrong language.
user-invocable: true
---

# Add i18n

Wire Paraglide JS into a Vite + TanStack Router app so that @hoogin registry
components and your own strings render in the active locale. The locale comes
from a cookie and the browser language by default (a locale in the URL is an
optional extra), and every translatable component ships its own message bundles.

## Contents

- [Requires](#requires)
- [How it works](#how-it-works)
- [One-time setup](#one-time-setup)
- [Install a translatable component](#install-a-translatable-component)
- [Add a language](#add-a-language)
- [Override a component's wording](#override-a-components-wording)
- [Use messages in your own code](#use-messages-in-your-own-code)
- [Conventions](#conventions)
- [Troubleshooting](#troubleshooting)
- [References](#references)

---

## Requires

- Bun as package manager and runtime, Vite, TanStack Router, a client SPA.
- `@inlang/paraglide-js` — installed by the base item, not by hand.

## How it works

A translatable component ships one message bundle per locale (a `registry:file`
that installs to `src/messages/registry/<component>/<locale>.json` — or
`messages/registry/...` in a project without `src/`). A Vite plugin merges those
with your app's `messages/<locale>.json` into `messages/.generated/`,
and Paraglide compiles the result into typed functions in `src/paraglide/`. Your
app's `messages/<locale>.json` is the last path pattern, so it overrides any
component string and survives reinstalling the component.

The merge flow and the three files the base item ships live in
`references/architecture.md`.

## One-time setup

Do this once, before the first translatable component. The shadcn CLI can't patch
config, so only steps 1–2 are commands; the rest are edits.

1. **Init Paraglide.** `bunx @inlang/paraglide-js@latest init` — creates
   `project.inlang/` and `messages/en.json`. Done when both exist.
2. **Add the base item.** `bunx --bun shadcn@latest add @hoogin/i18n` — installs
   `src/i18n/vite-plugin-registry-messages.ts`, `src/i18n/merge-messages.ts`,
   `src/lib/i18n/format.ts`, `@inlang/paraglide-js`, and this skill
   (`.opencode/skills/hgn-internationalizing-apps/`).
3. **Register the merge plugin before Paraglide** in `vite.config.ts`:

   ```ts
   import { paraglideVitePlugin } from "@inlang/paraglide-js"
   import { registryMessages } from "./src/i18n/vite-plugin-registry-messages"

   export default defineConfig({
     plugins: [
       registryMessages(), // first — it writes the files Paraglide compiles
       paraglideVitePlugin({
         project: "./project.inlang",
         outdir: "./src/paraglide",
         emitTsDeclarations: true,
         // Stored choice, then the browser language. Prepend "url" for
         // locale-prefixed URLs (step 5).
         strategy: ["cookie", "preferredLanguage", "baseLocale"],
       }),
     ],
   })
   ```

   Done when `registryMessages()` is listed above `paraglideVitePlugin`. It needs
   no options: it reads the bundles from where `shadcn add` puts them
   (`src/messages/registry`, or `messages/registry` without `src/`).

4. **Point Paraglide at both message sources** in `project.inlang/settings.json`.
   The last pattern wins:

   ```json
   "plugin.inlang.messageFormat": {
     "pathPattern": ["./messages/.generated/{locale}.json", "./messages/{locale}.json"]
   }
   ```

5. **Optional — locale in the URL.** Skip this unless you want `/nl/...` URLs
   (shareable, crawlable per locale). Prepend `"url"` to `strategy` in step 3,
   then rewrite the router's URLs in `router.tsx`:

   ```ts
   import { deLocalizeUrl, localizeUrl } from "@/paraglide/runtime.js"

   export const router = createRouter({
     routeTree,
     rewrite: {
       input: ({ url }) => deLocalizeUrl(url),
       output: ({ url }) => localizeUrl(url),
     },
   })
   ```

   The base locale (`en`) stays unprefixed; every other locale gets `/nl/...`. To
   translate the path segments themselves, see `references/localized-urls.md`.
   Without this step, switch locales with `setLocale()` from
   `@/paraglide/runtime.js` (the `@hoogin/locale-toggle` item does that).

6. **Ignore generated output** in `.gitignore`: `messages/.generated/` and
   `src/paraglide/`.

7. **Add scripts** to `package.json`:

   ```json
   "i18n": "bun src/i18n/merge-messages.ts && paraglide-js compile --project ./project.inlang --outdir ./src/paraglide --emit-ts-declarations",
   "typecheck": "bun run i18n && tsc --noEmit"
   ```

   `typecheck` merges and compiles first, so a component referencing a missing key
   fails the build.

8. **Tag the document language** in your entry file:

   ```ts
   document.documentElement.lang = getLocale()
   document.documentElement.dir = getTextDirection()
   ```

Done when `bun run dev` starts clean and `import { m } from
"@/paraglide/messages.js"` typechecks.

## Install a translatable component

```bash
bunx --bun shadcn@latest add @hoogin/data-table
```

The CLI copies the component and its message bundles; the first install also pulls
`@hoogin/i18n`. With `dev` running, the merge plugin picks up the files;
otherwise restart it.

## Add a language

1. Add the locale to `locales` in `project.inlang/settings.json`.
2. Create `messages/<locale>.json` for your own strings, starting from
   `{ "$schema": "https://inlang.com/schema/inlang-message-format" }`.
3. Restart `dev`.

Components already translated into that locale appear; the rest fall back to `en`.

## Override a component's wording

Add the key to your app's `messages/<locale>.json`. It's the last path pattern, so
it wins and survives reinstalling the component:

```json
{ "dataTable_next": "Next page" }
```

## Use messages in your own code

Import from `@/paraglide/messages.js` — shadcn doesn't rewrite this path:

```tsx
import { m } from "@/paraglide/messages.js"

<Button>{m.dataTable_previous()}</Button>
<span>{m.dataTable_pageOf({ page, total })}</span>
```

Format dates, numbers, and currency through the shipped helpers so output follows
the active locale. Reach for these over `toLocaleDateString()`, which reads the
system locale instead:

```ts
import { formatDate, formatNumber, formatCurrency } from "@/lib/i18n/format"
```

## Conventions

- Keys are flat and prefixed by component name: `dataTable_next`, `signinForm_email`.
- Override wording in `messages/<locale>.json`. Never edit installed bundles under
  `src/messages/registry/` — `shadcn add --overwrite` replaces them; change the
  wording in the registry instead.
- `messages/.generated/` and `src/paraglide/` are build output; the merge plugin
  and Paraglide own them.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Property 'x' does not exist` on `m` | messages not merged or compiled | run `bun run i18n`, or restart `dev` |
| Can't resolve `@/paraglide/messages` | `outdir` or `@` alias differs | use `outdir: "./src/paraglide"` and map `@` → `src` |
| Plugin can't find `project.inlang/settings.json` | Vite started from a workspace root | pass `root` in the plugin options |
| `[i18n] Key "x" defined by both "a" and "b"` | two components share a key | rename one with its component prefix |
| A string stays English in another locale | component has no bundle for that locale | add the translation in the registry, or override it in the app |
| Dev server recompiles in a loop | something else writes `messages/.generated/` | let only the merge plugin write there |

## References

- `references/architecture.md` — the merge flow, the base item's three files, and
  why your app's messages win.
- `references/localized-urls.md` — translate path segments, plus the
  `deLocalizeUrl` absolute-URL gotcha and nav active-state.
- Authoring or shipping a translatable component inside the registry repo is a
  different job — use the `hgn-translating-components` skill.
