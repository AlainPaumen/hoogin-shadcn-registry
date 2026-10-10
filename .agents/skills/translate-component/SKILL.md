---
name: translate-component
description: Make a @hoogin registry component translatable — add per-locale message bundles, register them on the registry item, and read them with type-safe m.*() calls, including plurals and the English hidden inside shadcn primitives. Use when authoring or shipping a translatable component inside the hoogin registry repo, or when a component's strings are still hardcoded English.
user-invocable: true
---

# Translate a component

A translatable component is a normal registry item plus **one message bundle per
locale** (a `registry:file`), read through type-safe `m.*()` calls.

## Contents

- [Steps](#steps)
- [Registry item shape](#registry-item-shape)
- [Key conventions](#key-conventions)
- [Add a locale across the registry](#add-a-locale-across-the-registry)
- [Verification](#verification)
- [References](#references)

---

## Steps

1. **Write the bundles** under `example/messages/registry/<component>/` — one
   `<locale>.json` per locale, `en.json` always (it is the fallback). Keys are
   flat and prefixed with the component name.
2. **Read them** with `m.*()`, importing from `@/paraglide/messages.js`:

   ```tsx
   import { m } from "@/paraglide/messages.js"

   <Button variant="outline" onClick={() => table.previousPage()}>
     {m.dataTable_previous()}
   </Button>
   <span>{m.dataTable_pageOf({ page, total })}</span>
   ```

   Replace every user-facing string — visible text, `aria-label`, `placeholder`,
   screen-reader text, and titles.
3. **Register the bundles** on the item in `registry/ui/registry.json` (shape
   below) and add `@hoogin/i18n` to `registryDependencies`.
4. **Sync and verify** (below).

Done when `bun run scripts/sync.ts` copies every bundle and the verify loop is
green.

## Registry item shape

Paths are relative to `registry/ui/`; `target` is relative to the consumer's `src/`
— except `messages/...` targets, which land in the project root (`example/` here,
the consumer's root on install):

```json
{
  "name": "signin-page",
  "type": "registry:block",
  "registryDependencies": ["@hoogin/form-fields", "card", "button", "@hoogin/i18n"],
  "files": [
    {
      "path": "blocks/signin-page.tsx",
      "type": "registry:block",
      "target": "hoogin/blocks/signin-page/signin-page.tsx"
    },
    {
      "path": "messages/signin-page/en.json",
      "type": "registry:file",
      "target": "messages/registry/signin-page/en.json"
    },
    {
      "path": "messages/signin-page/nl.json",
      "type": "registry:file",
      "target": "messages/registry/signin-page/nl.json"
    }
  ]
}
```

Every locale gets its own entry. `scripts/sync.ts` copies the source
(`example/messages/registry/<component>/<locale>.json`) to
`registry/ui/messages/<component>/<locale>.json`, and back.

## Key conventions

- Prefix every key with the component name in camelCase: `dataTable_next`,
  `signinPage_title`.
- Only underscores and letters — keys become exported function names.
- One flat namespace across **all** components; the merge throws on a duplicate
  key.
- Values take params: `"dataTable_pageOf": "Page {page} of {total}"` →
  `m.dataTable_pageOf({ page, total })`.
- Ship `en` for every component — it is the fallback for any locale missing the
  key.

Plural/variant syntax and the English hidden inside shadcn primitives:
`references/message-format.md`.

## Add a locale across the registry

From the repo root:

```bash
bun .agents/skills/translate-component/scripts/add-locale.ts nl --root example
```

Adds the locale to `example/project.inlang/settings.json`, creates
`example/messages/<locale>.json`, and stubs
`example/messages/registry/<component>/<locale>.json` for every component by
copying the `en` keys as placeholders. Idempotent — a second run is all skips.
Then `bun run scripts/sync.ts` to publish the stubs into `registry/ui/messages/`.

## Verification

From the repo root, in order:

1. `bun run scripts/sync.ts`
2. `cd example && bun run typecheck && bun run lint && bun run build`
3. `bunx --bun shadcn@latest build` then
   `bunx --bun shadcn@latest registry validate ./registry.json`

Done when every step passes.

## References

- `references/message-format.md` — plural/variant syntax and the strings worth
  translating inside shadcn primitives.
