import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { useTheme } from "@/hoogin/ui/theme-provider"

export const Route = createFileRoute("/docs/components/theme-provider")({
  component: ThemeProviderPage,
})

function ThemePreview() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">
        Current theme:{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">
          {theme}
        </code>
      </p>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => setTheme("light")}>
          Light
        </Button>
        <Button size="sm" variant="outline" onClick={() => setTheme("dark")}>
          Dark
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setTheme("system")}>
          System
        </Button>
      </div>
    </div>
  )
}

function ThemeProviderPage() {
  return (
    <ComponentDoc name="theme-provider">
      <DocSection title="Preview">
        <Preview>
          <ThemePreview />
        </Preview>
      </DocSection>
      <DocSection title="Usage">
        <CodeBlock
          language="tsx"
          code={`import { ThemeProvider, useTheme } from "@/hoogin/ui/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <Component />
    </ThemeProvider>
  )
}

function Component() {
  const { theme, setTheme } = useTheme()
  // ...
}`}
        />
      </DocSection>
      <DocSection
        title="Props"
        description="The provider is installed at the root of your app — it does not render any markup."
      >
        <PropsTable
          rows={[
            {
              prop: "defaultTheme",
              type: '"dark" | "light" | "system"',
              default: '"system"',
              description: "Theme used when nothing is stored yet.",
            },
            {
              prop: "storageKey",
              type: "string",
              default: '"theme"',
              description: "localStorage key used to persist the theme.",
            },
            {
              prop: "disableTransitionOnChange",
              type: "boolean",
              default: "true",
              description: "Disable CSS transitions when switching themes.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
