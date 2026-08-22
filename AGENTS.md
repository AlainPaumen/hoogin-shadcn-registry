# Project Rules

## Component locations

Own (hoogin) code lives in `example/src/hoogin/` in the example app, grouped by functionality:

- `src/hoogin/ui/<group>/` — reusable `registry:ui` components, one folder per functional group: `navigation/` (sidebar, app-sidebar, nav-*), `data-table/` (table + toolbar/pagination/view-options/faceted-filter + `cells/`), `forms/` (form + all `*.field.tsx`), `theme/`, `auth/`. Ungroupable singletons sit at the `ui/` root (currently `spinner.tsx`). Start a new group when ≥3 related files accumulate.
- `src/hoogin/blocks/<name>/` — more complex layouts (`sidebar-layout`, `admin-page`, `signin-page`, `signup-page`). These are the `registry:block` items.
- `src/hoogin/layout/` — example-app-only layout pieces (`base_layout`, `command-menu`, `error-boundary`). Not registered.
- `src/hoogin/docs/` — documentation-site building blocks (`doc-page`, `code-block`, `preview`, `props-table`, ...). Dev/docs only — never registered or synced.

Promotion rule: when a component inside a block is reused elsewhere, promote it to the matching `ui/<group>/` if that makes sense.

### TanStack Table (v9)

- Tables use the v9 API: `useTable({ features, ... })`. Features + row models are declared once per functional area via `tableFeatures({...})` — the shared set for data-table lives in `ui/data-table/data-table.types.ts` (`dataTableFeatures`) and is embedded in `DataTableColumnDef`, so consumers define columns without touching features.
- New table-based components should reuse `dataTableFeatures` or declare their own minimal `tableFeatures({...})`; never import row-model factories as table options (v8 style).
- All generic table types require `TData extends RowData`; components that receive a table instance take `ReactTable<typeof dataTableFeatures, TData>`; read state via `table.state.*`, never `table.getState()`.

- Components pulled in from shadcn (official registry, blocks, or other third-party registries) stay wherever the CLI installs them (`src/components/ui/`, `src/components/`).
- Anything under `src/hoogin/` is own code; anything outside it is third-party shadcn code.
- When `shadcn add @hoogin/<item>` installs our own registry items, the item file declares the target: `registry:ui` items land in `src/hoogin/ui/<group>/` mirroring this repo's grouping, `registry:block` items in `src/hoogin/blocks/<name>/`.

## Repo layout

- `registry/ui/` — registry payloads + `registry.json`; mirrors the `ui/<group>/` grouping, block payloads under `blocks/`.
- `scripts/` — automation (`sync.ts`, `serve.ts`).
- `skills/`, `workflows/`, `conventions/`, `packages/design/` — reserved for agent skills, agent workflows, coding conventions, and design tokens/packages (skeletons, content pending).
- `scan.mjs` + `dashboard.html` — OpenCode skill/session scanner and its report (repo-local tooling). `traildepot/` is its data dir — gitignored, never commit.

## Development workflow (example ↔ registry)

- The example app is both the development site (HMR) and the documentation site. Docs routes live in `example/src/routes/docs/` and render live components from `example/src/hoogin/`.
- `bun run scripts/sync.ts` — syncs every file declared in `registry/ui/registry.json` between `example/src/hoogin/` (derived from each file's install `target`) and its payload path in `registry/ui/`, **and regenerates `example/src/config/registry.ts`** (typed item metadata from `registry/ui/registry.json`, used to drive docs install commands + descriptions). No per-file mappings are hardcoded — register a new item and it syncs automatically.
- `bun run scripts/sync.ts --watch` — watch (recursively) and re-sync on save
- `bun run scripts/sync.ts --reverse` — copy registry → example
- Only files referenced by items in `registry/ui/registry.json` are registry payloads; the script warns when a `ui/` file is not part of any registered item. Register new items there (multi-file items list every file with a `target`) before building.
- After syncing, rebuild and validate: `bunx --bun shadcn@latest build` and `bunx --bun shadcn@latest registry validate ./registry.json`.
- Registry URLs: local dev server `bun run scripts/serve.ts` on `:3001`; hosted at `https://shadcn.hoogin.be/r/{name}.json`. Consumers register it in `components.json` with `"@hoogin": "<url>/r/{name}.json"` (the CLI fetches the template verbatim — `.json` must be in the URL).
- Deployment: the GitHub Pages workflow builds the registry (`shadcn build`) and the example (`bun run build` in `example/`), merges `example/dist/` over `public/` into `_site/`, and copies `index.html` → `404.html` (SPA fallback for deep links). The docs site serves the domain root; registry JSONs stay at `/r/{name}.json`.

## Verification checklist

Run from the repo root unless noted:

1. `bun run scripts/sync.ts` — keep example ↔ registry in sync before checking anything
2. `cd example && bun run typecheck` — `tsr generate && tsc --noEmit`; also run `tsc -b` (declaration emit) when touching table types — it catches variance errors `--noEmit` misses
3. `cd example && bun run lint`
4. `cd example && bun run build` — full production build
5. `bunx --bun shadcn@latest build` + `bunx --bun shadcn@latest registry validate ./registry.json`
