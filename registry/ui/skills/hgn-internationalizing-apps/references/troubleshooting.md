# Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Property 'x' does not exist` on `m` | messages not merged or compiled | run `bun run i18n`, or restart `dev` |
| Can't resolve `@/paraglide/messages` | `outdir` or `@` alias differs | use `outdir: "./src/paraglide"` and map `@` → `src` |
| Plugin can't find `project.inlang/settings.json` | Vite started from a workspace root | pass `root` in the plugin options |
| `[i18n] Key "x" defined by both "a" and "b"` | two components share a key | rename one with its component prefix |
| A string stays in the base language in another locale | key missing from that locale's file, or the component has no bundle for it | add the key to `messages/<locale>.json` |
| Text stays in the old language after switching | `setLocale(…, { reload: false })` with module-level messages | let `setLocale` reload, or build those messages in the component |
| Dev server recompiles in a loop | something else writes `messages/.generated/` | let only the merge plugin write there |
