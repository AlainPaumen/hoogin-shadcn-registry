import { createRootRoute } from "@tanstack/react-router"

import { Toaster } from "@/components/ui/toast"
import { BaseLayout } from "@/hoogin/layout/base_layout"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <BaseLayout />
      <Toaster />
    </>
  )
}
