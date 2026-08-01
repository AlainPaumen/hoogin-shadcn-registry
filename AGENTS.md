# Project Rules

## Component locations

Own (hoogin) code lives in `example/src/hoogin/` in the example app, with three tiers:

- `src/hoogin/ui/` — base, standalone, reusable components (`sidebar.tsx`, `spinner.tsx`). These are the registry items.
- `src/hoogin/<group>/` — complex components that belong together, e.g. `src/hoogin/app-sidebar/` (app-sidebar + nav-main/projects/secondary/user).
- `src/hoogin/blocks/<name>/` — more complex layouts, e.g. `src/hoogin/blocks/sidebar-08/`.

Promotion rule: when a component inside a group or block is reused elsewhere, promote it to `src/hoogin/ui/` if that makes sense.

- Components pulled in from shadcn (official registry, blocks, or other third-party registries) stay wherever the CLI installs them (`src/components/ui/`, `src/components/`).
- Anything under `src/hoogin/` is own code; anything outside it is third-party shadcn code.
- When `shadcn add @hoogin/<item>` installs our own registry components, they must land in `src/hoogin/ui/` (the registry item file declares the target).

## Development workflow (example ↔ registry)

- Own components are developed in `example/src/hoogin/` (HMR in the example app), then synced into the registry.
- `bun run scripts/sync.ts` — one-shot copy `example/src/hoogin/ui/` → `registry/ui/`
- `bun run scripts/sync.ts --watch` — watch and copy on save
- `bun run scripts/sync.ts --reverse` — copy registry → example
- Only `ui/` files are registry items; group (`app-sidebar/`) and block (`blocks/`) files are app-only until they are promoted to `ui/` and registered.
- The script warns when a synced file is not registered in `registry/ui/registry.json`; register new items there (with a `target` of `hoogin/ui/<file>`) before building.
- After syncing, rebuild and validate: `bunx --bun shadcn@latest build` and `bunx --bun shadcn@latest registry validate ./registry.json`.
