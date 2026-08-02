import { Fragment } from "react"
import { Link, Outlet, useMatches } from "@tanstack/react-router"

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
import { getBreadcrumbs } from "@/hoogin/docs/breadcrumbs"

export function BaseLayout() {
  const matches = useMatches()
  const fullPath = matches[matches.length - 1]?.fullPath ?? ""
  const crumbs = getBreadcrumbs(fullPath)

  return (
    <SidebarLayout
      collapsible="none"
      brand={sidebarData.brand}
      dataMain={sidebarData.navMain}
      dataSecondary={sidebarData.navSecondary}
      dataMainLabel={sidebarData.navMainLabel}
      breadcrumb={
        crumbs.length ? (
          <Breadcrumb>
            <BreadcrumbList>
              {crumbs.map((crumb, index) => (
                <Fragment key={crumb.label}>
                  {index > 0 ? (
                    <BreadcrumbSeparator className="hidden md:block" />
                  ) : null}
                  <BreadcrumbItem className="hidden md:block">
                    {crumb.to ? (
                      <BreadcrumbLink render={<Link to={crumb.to} />}>
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        ) : null
      }
    >
      <Outlet />
    </SidebarLayout>
  )
}
