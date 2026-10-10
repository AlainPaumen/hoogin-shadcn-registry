import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { LocaleToggle } from "@/hoogin/ui/locale-toggle"
import { m } from "@/paraglide/messages.js"

export const Route = createFileRoute("/docs/components/locale-toggle")({
  component: LocaleTogglePage,
})

function LocaleTogglePage() {
  return (
    <ComponentDoc name="locale-toggle">
      <DocSection title={m.docs_preview()}>
        <Preview>
          <LocaleToggle />
        </Preview>
      </DocSection>
      <DocSection title={m.docs_usage()}>
        <CodeBlock
          language="tsx"
          code={`import { LocaleToggle } from "@/hoogin/ui/locale-toggle"

<header>
  <LocaleToggle locales={["en", "nl"]} />
</header>`}
        />
      </DocSection>
      <DocSection title={m.docs_props()}>
        <PropsTable
          rows={[
            {
              prop: "locales",
              type: "Locale[]",
              default: '["en", "nl"]',
              description:
                "Locales to list in the dropdown. Must match the locales in your Paraglide project.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
