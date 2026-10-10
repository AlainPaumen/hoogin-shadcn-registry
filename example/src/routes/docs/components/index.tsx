import { createFileRoute } from "@tanstack/react-router"

import { registryItems } from "@/config/registry"
import { DocsHeader, DocsShell } from "@/hoogin/docs/doc-page"
import { localizeHref } from "@/paraglide/runtime.js"
import { m } from "@/paraglide/messages.js"

export const Route = createFileRoute("/docs/components/")({
  component: ComponentsOverviewPage,
})

function ComponentsOverviewPage() {
  const components = registryItems.filter((item) => item.type === "registry:ui")

  return (
    <DocsShell>
      <DocsHeader
        title={m.docsComponents_title()}
        description={m.docsComponents_description()}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {components.map((item) => (
          <a
            key={item.name}
            href={localizeHref(`/docs/components/${item.name}`)}
            className="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <span className="font-medium">{item.title}</span>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.description}
            </p>
          </a>
        ))}
      </div>
    </DocsShell>
  )
}
