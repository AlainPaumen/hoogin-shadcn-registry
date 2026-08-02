# Project Rules

## Component locations

Own (hoogin) code lives in `example/src/hoogin/` in the example app, with three tiers:

- `src/hoogin/ui/` — base, standalone, reusable components (`sidebar.tsx`, `spinner.tsx`, `app-sidebar.tsx`, `nav-*.tsx`, `sidebar.types.ts`, `theme-provider.tsx`, `theme-toggle.tsx`). These are the `registry:ui` items.
- `src/hoogin/<group>/` — complex components that belong together; promoted to `ui/` when registered (the `app-sidebar` group was promoted this way).
- `src/hoogin/blocks/<name>/` — more complex layouts. Currently `blocks/sidebar-layout/` is the `sidebar-layout` registry item (`registry:block`).

Promotion rule: when a component inside a group or block is reused elsewhere, promote it to `src/hoogin/ui/` if that makes sense.

- Components pulled in from shadcn (official registry, blocks, or other third-party registries) stay wherever the CLI installs them (`src/components/ui/`, `src/components/`).
- Anything under `src/hoogin/` is own code; anything outside it is third-party shadcn code.
- When `shadcn add @hoogin/<item>` installs our own registry items, the item file declares the target: `registry:ui` items land in `src/hoogin/ui/`, `registry:block` items in `src/hoogin/blocks/<name>/`.

## Development workflow (example ↔ registry)

- Own components are developed in `example/src/hoogin/` (HMR in the example app), then synced into the registry.
- `bun run scripts/sync.ts` — one-shot copy `example/src/hoogin/ui/` → `registry/ui/` (plus registered block file mappings)
- `bun run scripts/sync.ts --watch` — watch and copy on save
- `bun run scripts/sync.ts --reverse` — copy registry → example
- Only files referenced by items in `registry/ui/registry.json` are registry payloads; the script warns when a synced `ui/` file is not part of any registered item. Register new items there (multi-file items list every file with a `target`) before building.
- After syncing, rebuild and validate: `bunx --bun shadcn@latest build` and `bunx --bun shadcn@latest registry validate ./registry.json`.
- Registry URLs: local dev server `bun run scripts/serve.ts` on `:3001`; hosted at `https://shadcn.hoogin.be/r/{name}.json`. Consumers register it in `components.json` with `"@hoogin": "<url>/r/{name}.json"` (the CLI fetches the template verbatim — `.json` must be in the URL).
