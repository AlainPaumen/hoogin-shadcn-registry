---
name: hgn-internationalizing-apps
description: Use when adding or changing user-facing text, adding or switching a language/locale, overriding the wording of a @hoogin component, formatting dates/numbers/currency by locale, installing a translatable @hoogin component, setting up i18n, or debugging strings stuck in the wrong language — in a Vite + TanStack Router app with Paraglide JS and the @hoogin/i18n registry item.
user-invocable: true
---

# Internationalizing apps

Every user-facing string in the app — @hoogin components and your own code —
comes from Paraglide messages and renders in the active locale. The locale comes
from a cookie and the browser language by default (a locale in the URL is an
optional extra), and every translatable @hoogin component ships its own message
bundles.

## Contents

- [Requires](#requires)
- [How it works](#how-it-works)
- [Is it set up?](#is-it-set-up)
- [Use messages in your own code](#use-messages-in-your-own-code)
- [Add a language](#add-a-language)
- [Override a component's wording](#override-a-components-wording)
- [Switching locale](#switching-locale)
- [Install a translatable component](#install-a-translatable-component)
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
with your app's `messages/<locale>.json` into `messages/.generated/`, and
Paraglide compiles the result into typed functions in `src/paraglide/`. Your
app's `messages/<locale>.json` is the last path pattern, so it overrides any
component string and survives reinstalling the component. Details:
`references/architecture.md`.

## Is it set up?

It is when `project.inlang/settings.json` exists and `vite.config.ts` lists
`registryMessages()` above `paraglideVitePlugin(...)`. If not, follow
`references/setup.md` once, then come back here.

## Use messages in your own code

Import `m` from `@/paraglide/messages.js` — shadcn doesn't rewrite this path:

```tsx
import { m } from "@/paraglide/messages.js"

<h1>{m.notesPage_title()}</h1>
<span>{m.notesPage_count({ count })}</span>
```

Rules for your own keys:

1. **Every user-facing string is a message**: visible text, `aria-label`,
   `placeholder`, titles, toasts, and validation messages in zod schemas (see
   the `hgn-building-forms` skill).
2. **Prefix keys by feature or component** in camelCase: `notesPage_title`,
   `profileForm_save`. One flat namespace — a key that a @hoogin component
   already uses overrides that component's wording (see below), so never reuse
   a component's prefix by accident.
3. **Add every key to every locale's `messages/<locale>.json`.** A key missing
   from one locale doesn't fail the build; those users silently get the base
   locale's text.
4. **Parameters** go in braces: `"notesPage_count": "{count} notes"` →
   `m.notesPage_count({ count })`.
5. **Plurals** use Paraglide variants. Copy this shape (it compiles with
   Paraglide 2.x; `one`/`other` cover English and Dutch, other locales add
   categories such as `few` or `many` in their own file):

   ```json
   "notesPage_count": [
     {
       "declarations": ["input count", "local countPlural = count: plural"],
       "selectors": ["countPlural"],
       "match": {
         "countPlural=one": "{count} note",
         "countPlural=other": "{count} notes"
       }
     }
   ]
   ```

Format dates, numbers, and currency with the shipped helpers, so output follows
the active locale — not `toLocaleDateString()`, which reads the system locale:

```ts
import { formatDate, formatNumber, formatCurrency } from "@/lib/i18n/format"
```

## Add a language

1. Add the locale to `locales` in `project.inlang/settings.json`.
2. Create `messages/<locale>.json` with every key your app's base-locale file
   has, starting from
   `{ "$schema": "https://inlang.com/schema/inlang-message-format" }`.
3. Restart `dev`.

@hoogin components already translated into that locale switch over; the rest
fall back to the base locale until the registry ships a bundle (or you override
their keys, below).

## Override a component's wording

Add the component's key to your app's `messages/<locale>.json`. It's the last
path pattern, so it wins and survives reinstalling the component:

```json
{ "dataTable_next": "Next page" }
```

## Switching locale

Call `setLocale(locale)` from `@/paraglide/runtime.js` (the
`@hoogin/locale-toggle` item does). By default it **reloads the page** under
every strategy — with the URL strategy it navigates to the localized URL. Two
consequences:

- `m.*()` calls at module scope (e.g. messages in a zod schema defined outside
  the component) are safe: they run again after the reload.
- `getLocale()` can be read in render without subscribing to anything.

Only `setLocale(locale, { reload: false })` breaks this: then module-level
messages stay in the old language, so build such schemas inside the component.

## Install a translatable component

```bash
bunx --bun shadcn@latest add @hoogin/data-table
```

The CLI copies the component and its message bundles; the first install also
pulls `@hoogin/i18n`. With `dev` running, the merge plugin picks up the files;
otherwise restart it.

## Conventions

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
| A string stays in the base language in another locale | key missing from that locale's file, or the component has no bundle for it | add the key to `messages/<locale>.json` |
| Text stays in the old language after switching | `setLocale(…, { reload: false })` with module-level messages | let `setLocale` reload, or build those messages in the component |
| Dev server recompiles in a loop | something else writes `messages/.generated/` | let only the merge plugin write there |

## References

- `references/setup.md` — the one-time setup, for an app without Paraglide yet.
- `references/architecture.md` — the merge flow, the base item's three files,
  and why your app's messages win.
- `references/localized-urls.md` — optional locale-prefixed and translated URLs,
  plus the `deLocalizeUrl` absolute-URL gotcha and nav active-state.
