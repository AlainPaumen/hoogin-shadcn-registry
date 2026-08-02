import { Outlet } from "@tanstack/react-router"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { sidebarData } from "@/config/sidebar.config"
import { SidebarLayout } from "@/hoogin/blocks/sidebar-layout/sidebar-layout"

export function BaseLayout() {
  return (
    <SidebarLayout
      brand={sidebarData.brand}
      user={sidebarData.user}
      dataMain={sidebarData.navMain}
      dataSecondary={sidebarData.navSecondary}
      dataProjects={sidebarData.projects}
      dataMainLabel={sidebarData.navMainLabel}
      dataProjectsLabel={sidebarData.projectsLabel}
      dataProjectsMore={sidebarData.projectsMore}
      dataUserMenu={sidebarData.navUserMenu}
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <Outlet />
    </SidebarLayout>
  )
}
