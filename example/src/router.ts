import { createRouter } from "@tanstack/react-router"

import { deLocalizeUrl, localizeUrl } from "@/paraglide/runtime"
import { routeTree } from "./routeTree.gen"

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  // Match routes on the de-localized path, publish localized hrefs. Keeps a
  // single route tree while URLs stay locale-prefixed and translated.
  rewrite: {
    input: ({ url }) => deLocalizeUrl(url),
    output: ({ url }) => localizeUrl(url),
  },
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
