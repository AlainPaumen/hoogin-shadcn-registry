"use client"

import * as React from "react"

import { NavMain } from "@/hoogin/app-sidebar/nav-main"
import { NavProjects } from "@/hoogin/app-sidebar/nav-projects"
import { NavSecondary } from "@/hoogin/app-sidebar/nav-secondary"
import { NavUser } from "@/hoogin/app-sidebar/nav-user"
import type {
  SidebarMore,
  SidebarNavItem,
  SidebarProject,
  SidebarSecondaryItem,
  SidebarUser,
} from "@/hoogin/app-sidebar/sidebar.types"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/hoogin/ui/sidebar"
import favicon from "@/assets/favicon.svg"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: SidebarUser
  dataMain: SidebarNavItem[]
  dataSecondary: SidebarSecondaryItem[]
  dataProjects: SidebarProject[]
  dataMainLabel?: string
  dataProjectsLabel?: string
  dataProjectsMore?: SidebarMore
}

export function AppSidebar({
  user,
  dataMain,
  dataSecondary,
  dataProjects,
  dataMainLabel,
  dataProjectsLabel,
  dataProjectsMore,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center">
                <img src={favicon} alt="Acme Inc" className="size-8" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Acme Inc</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dataMain} label={dataMainLabel} />
        <NavProjects
          projects={dataProjects}
          label={dataProjectsLabel}
          more={dataProjectsMore}
        />
        <NavSecondary items={dataSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
