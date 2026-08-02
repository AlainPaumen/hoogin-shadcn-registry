import { createFileRoute } from "@tanstack/react-router"

import { sidebarData } from "@/config/sidebar.config"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { SidebarLayout } from "@/hoogin/blocks/sidebar-layout/sidebar-layout"

export const Route = createFileRoute("/docs/blocks/sidebar-layout")({
  component: SidebarLayoutPage,
})

function SidebarLayoutPage() {
  return (
    <ComponentDoc name="sidebar-layout">
      <DocSection title="Preview">
        <Preview className="p-0">
          <SidebarLayout
            collapsible="none"
            storageKey="hoogin-preview-layout"
            className="h-[560px] min-h-0 w-full overflow-hidden rounded-lg border"
            brand={sidebarData.brand}
            dataMain={sidebarData.navMain}
            dataSecondary={sidebarData.navSecondary}
            dataMainLabel={sidebarData.navMainLabel}
          >
            <div className="flex h-full min-h-0 flex-1 items-center justify-center rounded-lg border border-dashed p-8 text-sm text-muted-foreground">
              Your content goes here
            </div>
          </SidebarLayout>
        </Preview>
      </DocSection>
      <DocSection title="Usage">
        <CodeBlock
          language="tsx"
          code={`import { SidebarLayout } from "@/hoogin/blocks/sidebar-layout/sidebar-layout"

export function AppLayout() {
  return (
    <SidebarLayout
      brand={{ name: "Acme Inc" }}
      dataMain={navMain}
      dataSecondary={navSecondary}
      breadcrumb={<Breadcrumb>{/* ... */}</Breadcrumb>}
    >
      <Outlet />
    </SidebarLayout>
  )
}`}
        />
      </DocSection>
      <DocSection
        title="Props"
        description="Composes the SidebarProvider, AppSidebar, header and content area."
      >
        <PropsTable
          rows={[
            {
              prop: "children",
              type: "ReactNode",
              description: "The page content rendered in the content area.",
            },
            {
              prop: "brand",
              type: "SidebarBrand",
              description: "Brand shown in the sidebar header.",
            },
            {
              prop: "dataMain",
              type: "SidebarNavItem[]",
              description: "Main navigation groups.",
            },
            {
              prop: "breadcrumb",
              type: "ReactNode",
              description: "Rendered in the header next to the trigger.",
            },
            {
              prop: "user",
              type: "SidebarUser",
              description: "User shown in the sidebar footer.",
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
              prop: "storageKey",
              type: "string",
              description: "localStorage key for the sidebar open state.",
            },
            {
              prop: "collapsible",
              type: '"offcanvas" | "icon" | "none"',
              description: "How the sidebar collapses.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
