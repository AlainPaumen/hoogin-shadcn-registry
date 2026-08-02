import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { DocSection } from "@/hoogin/docs/doc-section"
import { DocsHeader, DocsShell } from "@/hoogin/docs/doc-page"

export const Route = createFileRoute("/docs/introduction")({
  component: IntroductionPage,
})

function IntroductionPage() {
  return (
    <DocsShell>
      <DocsHeader
        title="Introduction"
        description="What is @hoogin and how the registry is organized."
      />
      <DocSection title="What is @hoogin?">
        <p className="text-sm leading-relaxed text-muted-foreground">
          @hoogin is a shadcn component registry maintained by Hoogin. Every
          item is plain source code installed into your project by the shadcn
          CLI — no wrapper libraries, no runtime, just components you own and
          can edit.
        </p>
      </DocSection>
      <DocSection
        title="Components and blocks"
        description="Items come in two flavors."
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">
              registry:ui
            </code>{" "}
            — standalone reusable components such as the collapsible{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">
              sidebar
            </code>{" "}
            and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">
              theme-provider
            </code>
            .
          </li>
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">
              registry:block
            </code>{" "}
            — cohesive layouts that compose several components, like{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">
              sidebar-layout
            </code>
            .
          </li>
        </ul>
      </DocSection>
      <DocSection title="Development workflow">
        <p className="text-sm leading-relaxed text-muted-foreground">
          This very site is the development environment. Every component page
          renders the live component — edit the source in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">
            example/src/hoogin/
          </code>{" "}
          and the preview updates with hot module replacement.
        </p>
        <CodeBlock
          language="bash"
          code={`bun run dev # in example/ — the docs & dev site
bun run scripts/sync.ts # copy example → registry
bunx --bun shadcn@latest build
bunx --bun shadcn@latest registry validate ./registry.json`}
        />
      </DocSection>
    </DocsShell>
  )
}
