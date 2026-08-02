import { createFileRoute } from "@tanstack/react-router"

import { sidebarData } from "@/config/sidebar.config"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { AppSidebar } from "@/hoogin/ui/app-sidebar"
import { SidebarProvider } from "@/hoogin/ui/sidebar"

export const Route = createFileRoute("/docs/components/app-sidebar")({
  component: AppSidebarPage,
})

function AppSidebarPage() {
  return (
    <ComponentDoc name="app-sidebar">
      <DocSection title="Preview">
        <Preview className="p-0">
          <SidebarProvider
            storageKey="hoogin-preview-app-sidebar"
            className="h-[480px] min-h-0 w-full overflow-hidden rounded-lg border"
          >
            <AppSidebar
              collapsible="none"
              brand={sidebarData.brand}
              dataMain={sidebarData.navMain}
              dataSecondary={sidebarData.navSecondary}
              dataMainLabel={sidebarData.navMainLabel}
            />
          </SidebarProvider>
        </Preview>
      </DocSection>
      <DocSection title="Usage">
        <CodeBlock
          language="tsx"
          code={`import { AppSidebar } from "@/hoogin/ui/app-sidebar"
import { SidebarProvider } from "@/hoogin/ui/sidebar"

<SidebarProvider>
  <AppSidebar
    brand={{ name: "Acme Inc", description: "Enterprise" }}
    dataMain={navMain}
    dataSecondary={navSecondary}
    dataProjects={projects}
    user={{ name: "shadcn", email: "m@example.com", avatar: "/me.jpg" }}
  />
</SidebarProvider>`}
        />
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              prop: "brand",
              type: "SidebarBrand",
              description: "Required. Name, description and logo of the app.",
            },
            {
              prop: "dataMain",
              type: "SidebarNavItem[]",
              description: "Main navigation groups with optional sub-items.",
            },
            {
              prop: "user",
              type: "SidebarUser",
              description: "User shown in the footer menu.",
            },
            {
              prop: "dataSecondary",
              type: "SidebarSecondaryItem[]",
              description: "Links pinned to the bottom of the sidebar.",
            },
            {
              prop: "dataProjects",
              type: "SidebarProject[]",
              description: "Projects list below the main navigation.",
            },
            {
              prop: "dataMainLabel",
              type: "string",
              default: '"Platform"',
              description: "Label for the main navigation group.",
            },
            {
              prop: "dataUserMenu",
              type: "SidebarUserMenu",
              description: "Items shown in the user dropdown.",
            },
            {
              prop: "collapsible",
              type: '"offcanvas" | "icon" | "none"',
              description: "Passed through to the underlying Sidebar.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
