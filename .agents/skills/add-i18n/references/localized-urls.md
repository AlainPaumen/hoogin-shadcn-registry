# Localized URLs

By default Paraglide only *prefixes* the locale (`/nl/docs`). This reference adds
**translated path segments** (`/nl/documentatie/introductie`) via the router
rewrite, and covers the two traps that come with it.

## Translate the path segments

Give Paraglide a `urlPatterns` list mapping each internal (canonical) path to its
localized form. Add it to `paraglideVitePlugin` in `vite.config.ts`:

```ts
import type { UrlPattern } from "@inlang/paraglide-js"

const urlPatterns: UrlPattern[] = [
  { pattern: "/", localized: [["en", "/"], ["nl", "/nl"]] },
  {
    pattern: "/docs/installation",
    localized: [
      ["en", "/docs/installation"],
      ["nl", "/nl/documentatie/installatie"],
    ],
  },
  {
    pattern: "/docs/components/:component",
    localized: [
      ["en", "/docs/components/:component"],
      ["nl", "/nl/documentatie/componenten/:component"],
    ],
  },
  // ...every route...
  // Last: the fallback wildcard. It must come after the specific patterns.
  {
    pattern: "/:path(.*)?",
    localized: [
      ["en", "/:path(.*)?"],
      ["nl", "/nl/:path(.*)?"],
    ],
  },
]
```

Rules:

- English stays unprefixed (`/docs`); every other locale is prefixed (`/nl/...`).
- URLPattern matches in order, so the wildcard goes **last**.
- Keep truly fixed segments — component and block slugs like `sidebar`,
  `admin-page` — **untranslated**. They are names, and translating them breaks
  every external link. Translate the words around them.
- Keep `emitTsDeclarations: true` on the plugin so `@/paraglide/runtime.js` and
  `@/paraglide/messages.js` have types.

With the router rewrite in place (see the skill's setup step 5), internal links
stay canonical and TanStack Router resolves routes on the de-localized path while
publishing localized hrefs.

## Trap: `deLocalizeUrl` needs an absolute URL

`deLocalizeUrl(url)` calls `new URL(url)`, so it throws `Invalid URL` on a bare
path. Two more gotchas compound it:

- `useMatches().fullPath` returns a **path** (not a URL), and is `""` before the
  first match resolves.
- A trailing-slash strip with `/\/$/` collapses the root `/` to `""`.

When you compare the current location against a canonical route — breadcrumbs,
active nav state — normalize like this:

```ts
import { deLocalizeUrl } from "@/paraglide/runtime.js"

const path = deLocalizeUrl(new URL(fullPath || "/", location.origin)).pathname
  // Strip a trailing slash, but never turn "/" into "".
  .replace(/(.+)\/$/, "$1")
```

`new URL(fullPath || "/", location.origin)` supplies the origin `deLocalizeUrl`
needs; `/(.+)` requires at least one character before the slash, so `/` survives.
Apply it in both the breadcrumbs builder and the sidebar's nav-main active check —
patching only one leaves the other's highlight broken on `/nl/...` routes.

## Trap: `setLocale` reloads the page

Under the `url` strategy, `setLocale(locale)` performs a **full page reload**
(`src/paraglide/runtime.js`). That is why it is safe to call `m.*()` at module
scope (e.g. for zod messages) and to read `getLocale()` in render without
subscribing to a store — a locale change never re-renders in place, it reloads.
A locale switcher just calls `setLocale`; see the shipped `@hoogin/locale-toggle`.
