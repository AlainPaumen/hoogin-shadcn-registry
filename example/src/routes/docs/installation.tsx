import { createFileRoute } from "@tanstack/react-router"

import { registryItems } from "@/config/registry"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { DocSection } from "@/hoogin/docs/doc-section"
import { DocsHeader, DocsShell } from "@/hoogin/docs/doc-page"
import { m } from "@/paraglide/messages.js"

export const Route = createFileRoute("/docs/installation")({
  component: InstallationPage,
})

function InstallationPage() {
  const allNames = registryItems.map((item) => `@hoogin/${item.name}`).join(" ")

  return (
    <DocsShell>
      <DocsHeader
        title={m.nav_installation()}
        description={m.docsInstallation_description()}
      />
      <DocSection title={m.docsInstallation_step1()}>
        <p className="text-sm text-muted-foreground">
          {m.docsInstallation_step1Body()}
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
      <DocSection title={m.docsInstallation_step2()}>
        <CodeBlock
          language="bash"
          code={`npx shadcn@latest add @hoogin/sidebar-layout`}
        />
        <p className="text-sm text-muted-foreground">
          {m.docsInstallation_step2Body()}
        </p>
      </DocSection>
      <DocSection title={m.docsInstallation_all()}>
        <CodeBlock language="bash" code={`npx shadcn@latest add ${allNames}`} />
      </DocSection>
      <DocSection title={m.docsInstallation_updates()}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {m.docsInstallation_updatesBody()}
        </p>
      </DocSection>
    </DocsShell>
  )
}
