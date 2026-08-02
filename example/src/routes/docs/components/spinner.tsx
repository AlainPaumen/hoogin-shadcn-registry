import { createFileRoute } from "@tanstack/react-router"

import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { Spinner } from "@/hoogin/ui/spinner"

export const Route = createFileRoute("/docs/components/spinner")({
  component: SpinnerPage,
})

function SpinnerPage() {
  return (
    <ComponentDoc name="spinner">
      <DocSection title="Preview">
        <Preview>
          <div className="flex items-center gap-3">
            <Spinner />
            <Spinner className="size-6" />
            <Spinner className="size-8" />
          </div>
        </Preview>
      </DocSection>
      <DocSection title="Usage">
        <CodeBlock
          language="tsx"
          code={`import { Spinner } from "@/hoogin/ui/spinner"

export function LoadingButton() {
  return (
    <button disabled>
      <Spinner />
      Loading...
    </button>
  )
}`}
        />
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              prop: "className",
              type: "string",
              description: "Tailwind classes, e.g. size-6 for a larger spinner.",
            },
            {
              prop: "...span",
              type: "ComponentProps<\"span\">",
              description: "All native span props are forwarded.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
