import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { RouterProvider } from "@tanstack/react-router"

import "./index.css"
import { ErrorBoundary } from "@/hoogin/layout/error-boundary"
import { CommandMenu } from "@/hoogin/layout/command-menu"
import { ThemeProvider } from "@/hoogin/ui/theme/theme-provider"
import { router } from "./router"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
        <CommandMenu />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
)
