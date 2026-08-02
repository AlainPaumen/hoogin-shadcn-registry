import { createFileRoute, Link } from "@tanstack/react-router"

import favicon from "@/assets/favicon.svg"
import { Button } from "@/components/ui/button"
import { registryItems } from "@/config/registry"
import { CodeBlock } from "@/hoogin/docs/code-block"

export const Route = createFileRoute("/")({
  component: HomeComponent,
})

const REGISTRY_JSON = `{
  "registries": {
    "@hoogin": "https://shadcn.hoogin.be/r/{name}.json"
  }
}`

function HomeComponent() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-12 py-16 text-center">
      <div className="flex flex-col items-center gap-4">
        <img src={favicon} alt="@hoogin" className="size-14" />
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight">
          @hoogin — shadcn registry
        </h1>
        <p className="max-w-xl text-muted-foreground">
          A collection of shadcn components and blocks maintained by Hoogin.
          Collapsible sidebars, theme switching, and full application layouts —
          install them with one command.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button render={<Link to="/docs/introduction" />}>Get started</Button>
          <Button
            variant="outline"
            render={<Link to="/docs/components" />}
          >
            Browse components
          </Button>
        </div>
      </div>

      <div className="w-full space-y-4 text-left">
        <CodeBlock
          language="bash"
          code={`npx shadcn@latest init\nnpx shadcn@latest add @hoogin/sidebar-layout`}
        />
        <CodeBlock language="json" code={REGISTRY_JSON} />
      </div>

      <div className="grid w-full gap-3 text-left sm:grid-cols-2">
        {registryItems
          .filter((item) => item.type === "registry:ui")
          .map((item) => (
            <a
              key={item.name}
              href={`/docs/components/${item.name}`}
              className="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <span className="font-medium">{item.title}</span>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            </a>
          ))}
      </div>

      <div className="w-full space-y-3 text-left">
        <h2 className="text-sm font-medium text-muted-foreground">Blocks</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {registryItems
            .filter((item) => item.type === "registry:block")
            .map((item) => (
              <a
                key={item.name}
                href={`/docs/blocks/${item.name}`}
                className="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <span className="font-medium">{item.title}</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </a>
            ))}
        </div>
      </div>
    </div>
  )
}
