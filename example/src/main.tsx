import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { RouterProvider } from "@tanstack/react-router"

import "./index.css"
import { ErrorBoundary } from "@/hoogin/layout/error-boundary"
import { ThemeProvider } from "@/hoogin/ui/theme-provider"
import { router } from "./router"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
)
