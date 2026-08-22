import { createFileRoute } from "@tanstack/react-router"

import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { ThemeToggle } from "@/hoogin/ui/theme/theme-toggle"

export const Route = createFileRoute("/docs/components/theme-toggle")({
  component: ThemeTogglePage,
})

function ThemeTogglePage() {
  return (
    <ComponentDoc name="theme-toggle">
      <DocSection title="Preview">
        <Preview>
          <ThemeToggle />
        </Preview>
      </DocSection>
      <DocSection title="Usage">
        <CodeBlock
          language="tsx"
          code={`import { ThemeToggle } from "@/hoogin/ui/theme/theme-toggle"

<header>
  <ThemeToggle />
</header>`}
        />
      </DocSection>
      <DocSection
        title="Props"
        description="Renders a Button and forwards all button props."
      >
        <PropsTable
          rows={[
            {
              prop: "variant",
              type: '"default" | "outline" | "ghost" | ...',
              default: '"ghost"',
              description: "Button variant.",
            },
            {
              prop: "size",
              type: '"default" | "sm" | "lg" | "icon" | ...',
              default: '"icon"',
              description: "Button size.",
            },
            {
              prop: "...button",
              type: "ButtonPrimitive.Props",
              description: "All native button props are forwarded.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
