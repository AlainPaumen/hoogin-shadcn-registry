# hoogin shadcn registry

A shadcn component registry (`@hoogin`) with an example app used to develop and
verify the components. Hosted at `https://shadcn.hoogin.be`.

## Items

| Item                 | Type            | Description                                                        |
| -------------------- | --------------- | ------------------------------------------------------------------ |
| `sidebar`            | `registry:ui`   | Collapsible sidebar that persists state in `localStorage`.         |
| `app-sidebar`        | `registry:ui`   | Config-driven app sidebar (nav, projects, secondary, user menu).   |
| `theme-provider`     | `registry:ui`   | Theme provider with system detection and a keyboard shortcut.      |
| `theme-toggle`       | `registry:ui`   | Dark/light toggle button.                                          |
| `sidebar-layout`     | `registry:block`| Full app layout shell (sidebar + header + content).                |
| `spinner`            | `registry:ui`   | Lightweight loading spinner.                                       |

## Install

Add the registry to your project's `components.json`:

```json
{
  "registries": {
    "@hoogin": "https://shadcn.hoogin.be/r/{name}.json"
  }
}
```

> The `.json` suffix is required: the shadcn CLI fetches the template URL
> verbatim for custom registries.

Then add an item:

```bash
npx shadcn@latest add @hoogin/sidebar-layout
```

### Requirements

- A shadcn-initialized project (Tailwind + CSS variables, `@/*` → `./src/*`
  alias, `lucide-react` icon library).
- Items install under `src/hoogin/ui/` (components) and `src/hoogin/blocks/`
  (blocks); official dependencies land in `src/components/ui/`.
- `theme-toggle` and `sidebar-layout` need `<ThemeProvider>` (from
  `@hoogin/theme-provider`) wrapping the app root.

## Development

Own components live in `example/src/hoogin/` and are developed with HMR in the
example app, then synced into the registry.

```bash
bun run scripts/sync.ts           # example → registry
bun run scripts/sync.ts --watch   # watch and copy on save
bun run scripts/sync.ts --reverse # registry → example
```

Register new items in `registry/ui/registry.json`, then rebuild and validate:

```bash
bunx --bun shadcn@latest build
bunx --bun shadcn@latest registry validate ./registry.json
```

Serve the registry locally on `:3001`:

```bash
bun run scripts/serve.ts
# components.json → "@hoogin": "http://localhost:3001/r/{name}.json"
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
registry and deploys `public/` to GitHub Pages at `https://shadcn.hoogin.be`.
