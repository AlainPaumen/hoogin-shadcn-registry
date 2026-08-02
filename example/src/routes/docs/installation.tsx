import { createFileRoute } from "@tanstack/react-router"

import { registryItems } from "@/config/registry"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { DocSection } from "@/hoogin/docs/doc-section"
import { DocsHeader, DocsShell } from "@/hoogin/docs/doc-page"

export const Route = createFileRoute("/docs/installation")({
  component: InstallationPage,
})

function InstallationPage() {
  const allNames = registryItems.map((item) => `@hoogin/${item.name}`).join(" ")

  return (
    <DocsShell>
      <DocsHeader
        title="Installation"
        description="Add the @hoogin registry to your shadcn project and install items."
      />
      <DocSection title="1. Register the registry">
        <p className="text-sm text-muted-foreground">
          Add the @hoogin registry to your{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">
            components.json
          </code>
          :
        </p>
        <CodeBlock
          language="json"
          code={`{
  "registries": {
    "@hoogin": "https://shadcn.hoogin.be/r/{name}.json"
  }
}`}
        />
      </DocSection>
      <DocSection title="2. Add an item">
        <CodeBlock
          language="bash"
          code={`npx shadcn@latest add @hoogin/sidebar-layout`}
        />
        <p className="text-sm text-muted-foreground">
          The CLI resolves registry dependencies automatically — for example{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">
            @hoogin/sidebar-layout
          </code>{" "}
          pulls in the base shadcn components it needs.
        </p>
      </DocSection>
      <DocSection title="Add everything at once">
        <CodeBlock language="bash" code={`npx shadcn@latest add ${allNames}`} />
      </DocSection>
      <DocSection title="Updates">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Re-run the add command to pull the latest version. Existing files are
          left untouched — pass{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">
            --overwrite
          </code>{" "}
          to replace them.
        </p>
      </DocSection>
    </DocsShell>
  )
}
