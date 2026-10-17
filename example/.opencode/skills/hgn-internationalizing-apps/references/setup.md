# One-time setup

Read this only when the app has no Paraglide setup yet (no `project.inlang/`
or no `registryMessages()` in `vite.config.ts`). Do it once, before the first
translatable component. The shadcn CLI can't patch
config, so only steps 1–2 are commands; the rest are edits.

1. **Init Paraglide.** `bunx @inlang/paraglide-js@latest init` — creates
   `project.inlang/` and `messages/en.json`. Done when both exist.
2. **Add the base item.** `bunx --bun shadcn@latest add @hoogin/i18n` — installs
   `src/i18n/vite-plugin-registry-messages.ts`, `src/i18n/merge-messages.ts`,
   `src/lib/i18n/format.ts`, `@inlang/paraglide-js`, and the `hgn-internationalizing-apps` skill
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
   translate the path segments themselves, see `localized-urls.md`.
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
