import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { DocSection } from "@/hoogin/docs/doc-section"
import { DocsHeader, DocsShell } from "@/hoogin/docs/doc-page"
import { m } from "@/paraglide/messages.js"

export const Route = createFileRoute("/docs/introduction")({
  component: IntroductionPage,
})

function IntroductionPage() {
  return (
    <DocsShell>
      <DocsHeader
        title={m.nav_introduction()}
        description={m.docsIntroduction_description()}
      />
      <DocSection title={m.docsIntroduction_whatIs()}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {m.docsIntroduction_whatIsBody()}
        </p>
      </DocSection>
      <DocSection
        title={m.docsIntroduction_componentsAndBlocks()}
        description={m.docsIntroduction_componentsAndBlocksDescription()}
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">
              registry:ui
            </code>{" "}
            {m.docsIntroduction_componentsBody()}
          </li>
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">
              registry:block
            </code>{" "}
            {m.docsIntroduction_blocksBody()}
          </li>
        </ul>
      </DocSection>
      <DocSection title={m.docsIntroduction_development()}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {m.docsIntroduction_developmentBody()}
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
