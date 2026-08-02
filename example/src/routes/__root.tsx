import { createRootRoute } from "@tanstack/react-router"

import { ThemeProvider } from "@/hoogin/ui/theme-provider"
import { BaseLayout } from "@/hoogin/layout/base_layout"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider>
      <BaseLayout/>
    </ThemeProvider>
  )
}
