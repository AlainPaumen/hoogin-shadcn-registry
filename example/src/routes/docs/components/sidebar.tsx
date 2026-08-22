import { createFileRoute } from "@tanstack/react-router"

import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/hoogin/ui/navigation/sidebar"

export const Route = createFileRoute("/docs/components/sidebar")({
  component: SidebarPage,
})

const DEMO_CODE = `import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/hoogin/ui/navigation/sidebar"

export function SidebarDemo() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>Sidebar</SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="#">Home</a>} />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="#">Inbox</a>} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>v1.0.0</SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}`

function SidebarPage() {
  return (
    <ComponentDoc name="sidebar">
      <DocSection title="Preview">
        <Preview className="p-0">
          <SidebarProvider
            storageKey="hoogin-preview-sidebar"
            className="h-[480px] min-h-0 w-full overflow-hidden rounded-lg border"
          >
            <Sidebar collapsible="none" className="h-full">
              <SidebarHeader className="px-4 py-3 text-sm font-medium">
                Sidebar
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  {["Home", "Inbox", "Sent"].map((label) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton render={<a href="#" aria-label={label} />}>
                        {label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter className="p-4 text-xs text-muted-foreground">
                v1.0.0
              </SidebarFooter>
            </Sidebar>
          </SidebarProvider>
        </Preview>
      </DocSection>
      <DocSection title="Usage">
        <CodeBlock language="tsx" code={DEMO_CODE} />
      </DocSection>
      <DocSection title="SidebarProvider props">
        <PropsTable
          rows={[
            {
              prop: "defaultOpen",
              type: "boolean",
              default: "true",
              description: "Initial open state when nothing is stored.",
            },
            {
              prop: "storageKey",
              type: "string",
              default: "sidebar_state",
              description: "localStorage key used to persist the open state.",
            },
            {
              prop: "open",
              type: "boolean",
              description: "Controlled open state.",
            },
            {
              prop: "onOpenChange",
              type: "(open: boolean) => void",
              description: "Callback when the open state changes.",
            },
          ]}
        />
      </DocSection>
      <DocSection title="Sidebar props">
        <PropsTable
          rows={[
            {
              prop: "variant",
              type: '"sidebar" | "floating" | "inset"',
              default: '"sidebar"',
              description: "Visual variant of the sidebar.",
            },
            {
              prop: "collapsible",
              type: '"offcanvas" | "icon" | "none"',
              default: '"offcanvas"',
              description: "How the sidebar collapses.",
            },
            {
              prop: "side",
              type: '"left" | "right"',
              default: '"left"',
              description: "Which side of the screen the sidebar is on.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
