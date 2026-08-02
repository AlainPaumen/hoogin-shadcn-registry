import type { ReactNode } from "react"

import type { RegistryItem } from "@/config/registry"
import { getRegistryItem } from "@/config/registry"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { DocSection } from "@/hoogin/docs/doc-section"
import { InstallCommand } from "@/hoogin/docs/install-command"

const REGISTRY_JSON = `{
  "registries": {
    "@hoogin": "https://shadcn.hoogin.be/r/{name}.json"
  }
}`

export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 py-6">
      {children}
    </div>
  )
}

export function DocsHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="space-y-2">
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      {description ? (
        <p className="text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}

export function DocPage({
  item,
  children,
}: {
  item: RegistryItem
  children: ReactNode
}) {
  return (
    <DocsShell>
      <DocsHeader title={item.title} description={item.description} />
      {children}
      <DocSection
        title="Installation"
        description="Add the component to your project with the shadcn CLI."
      >
        <InstallCommand name={item.name} />
        <p className="text-sm text-muted-foreground">
          Make sure the @hoogin registry is configured in your{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">
            components.json
          </code>
          :
        </p>
        <CodeBlock code={REGISTRY_JSON} language="json" />
      </DocSection>
      <DocSection title="Registry metadata">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium">
            {item.type}
          </span>
          {item.registryDependencies?.map((dep) => (
            <span
              key={dep}
              className="rounded-full border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              {dep}
            </span>
          ))}
        </div>
        <CodeBlock
          language="tsx"
          code={item.files.map((file) => file.target).join("\n")}
        />
      </DocSection>
    </DocsShell>
  )
}

export function ComponentDoc({
  name,
  children,
}: {
  name: string
  children: ReactNode | ((item: RegistryItem) => ReactNode)
}) {
  const item = getRegistryItem(name)
  if (!item) return null
  return (
    <DocPage item={item}>
      {typeof children === "function" ? children(item) : children}
    </DocPage>
  )
}
