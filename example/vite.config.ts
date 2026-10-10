import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { paraglideVitePlugin } from "@inlang/paraglide-js"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { registryMessages } from "./src/i18n/vite-plugin-registry-messages.ts"

type UrlPattern = { pattern: string; localized: [string, string][] }

// Localized pathnames: English stays as-is, Dutch is prefixed with /nl and
// translated. URLPattern matches in order, so the wildcard comes last.
// ponytail: leaf slugs (sidebar, admin-page) stay untranslated — they are
// component names, and translating them would break every external link.
const urlPatterns: UrlPattern[] = [
  { pattern: "/", localized: [["en", "/"], ["nl", "/nl"]] },
  {
    pattern: "/docs/introduction",
    localized: [
      ["en", "/docs/introduction"],
      ["nl", "/nl/documentatie/introductie"],
    ],
  },
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
  {
    pattern: "/docs/blocks/:block",
    localized: [
      ["en", "/docs/blocks/:block"],
      ["nl", "/nl/documentatie/blocks/:block"],
    ],
  },
  {
    pattern: "/docs/components",
    localized: [
      ["en", "/docs/components"],
      ["nl", "/nl/documentatie/componenten"],
    ],
  },
  {
    pattern: "/docs/blocks",
    localized: [
      ["en", "/docs/blocks"],
      ["nl", "/nl/documentatie/blocks"],
    ],
  },
  {
    pattern: "/docs",
    localized: [
      ["en", "/docs"],
      ["nl", "/nl/documentatie"],
    ],
  },
  {
    pattern: "/:path(.*)?",
    localized: [
      ["en", "/:path(.*)?"],
      ["nl", "/nl/:path(.*)?"],
    ],
  },
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    registryMessages(),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      emitTsDeclarations: true,
      strategy: ["url", "baseLocale"],
      urlPatterns,
    }),
    react(),
    tailwindcss(),
  ],
  define: {
    __LIB_VERSION__: JSON.stringify(process.env.LIB_VERSION ?? "0.0.0"),
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})