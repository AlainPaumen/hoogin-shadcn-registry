# Project Rules

## Component locations

Own (hoogin) code lives in `example/src/hoogin/` in the example app, with four tiers:

- `src/hoogin/ui/` — base, standalone, reusable components (`sidebar.tsx`, `spinner.tsx`, `app-sidebar.tsx`, `nav-*.tsx`, `sidebar.types.ts`, `theme-provider.tsx`, `theme-toggle.tsx`). These are the `registry:ui` items.
- `src/hoogin/<group>/` — complex components that belong together; promoted to `ui/` when registered (the `app-sidebar` group was promoted this way).
- `src/hoogin/blocks/<name>/` — more complex layouts. Currently `blocks/sidebar-layout/` is the `sidebar-layout` registry item (`registry:block`).
- `src/hoogin/docs/` — documentation-site building blocks (`doc-page`, `code-block`, `preview`, `props-table`, ...). Dev/docs only — never registered or synced.

Promotion rule: when a component inside a group or block is reused elsewhere, promote it to `src/hoogin/ui/` if that makes sense.

- Components pulled in from shadcn (official registry, blocks, or other third-party registries) stay wherever the CLI installs them (`src/components/ui/`, `src/components/`).
- Anything under `src/hoogin/` is own code; anything outside it is third-party shadcn code.
- When `shadcn add @hoogin/<item>` installs our own registry items, the item file declares the target: `registry:ui` items land in `src/hoogin/ui/`, `registry:block` items in `src/hoogin/blocks/<name>/`.

## Development workflow (example ↔ registry)

- The example app is both the development site (HMR) and the documentation site. Docs routes live in `example/src/routes/docs/` and render live components from `example/src/hoogin/`.
- `bun run scripts/sync.ts` — one-shot copy `example/src/hoogin/ui/` → `registry/ui/` (plus registered block file mappings) **and regenerates `example/src/config/registry.ts`** (typed item metadata from `registry/ui/registry.json`, used to drive docs install commands + descriptions).
- `bun run scripts/sync.ts --watch` — watch and copy on save
- `bun run scripts/sync.ts --reverse` — copy registry → example
- Only files referenced by items in `registry/ui/registry.json` are registry payloads; the script warns when a synced `ui/` file is not part of any registered item. Register new items there (multi-file items list every file with a `target`) before building.
- After syncing, rebuild and validate: `bunx --bun shadcn@latest build` and `bunx --bun shadcn@latest registry validate ./registry.json`.
- Registry URLs: local dev server `bun run scripts/serve.ts` on `:3001`; hosted at `https://shadcn.hoogin.be/r/{name}.json`. Consumers register it in `components.json` with `"@hoogin": "<url>/r/{name}.json"` (the CLI fetches the template verbatim — `.json` must be in the URL).
- Deployment: the GitHub Pages workflow builds the registry (`shadcn build`) and the example (`bun run build` in `example/`), merges `example/dist/` over `public/` into `_site/`, and copies `index.html` → `404.html` (SPA fallback for deep links). The docs site serves the domain root; registry JSONs stay at `/r/{name}.json`.
