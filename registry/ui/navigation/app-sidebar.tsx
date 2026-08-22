"use client"

import * as React from "react"

import { NavMain } from "@/hoogin/ui/navigation/nav-main"
import { NavProjects } from "@/hoogin/ui/navigation/nav-projects"
import { NavSecondary } from "@/hoogin/ui/navigation/nav-secondary"
import { NavUser } from "@/hoogin/ui/navigation/nav-user"
import type {
  SidebarBrand,
  SidebarMore,
  SidebarNavItem,
  SidebarProject,
  SidebarSecondaryItem,
  SidebarUser,
  SidebarUserMenu,
} from "@/hoogin/ui/navigation/sidebar.types"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/hoogin/ui/navigation/sidebar"
import { BlocksIcon } from "lucide-react"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  brand: SidebarBrand
  user?: SidebarUser
  dataMain: SidebarNavItem[]
  dataSecondary?: SidebarSecondaryItem[]
  dataProjects?: SidebarProject[]
  dataMainLabel?: string
  dataProjectsLabel?: string
  dataProjectsMore?: SidebarMore
  dataUserMenu?: SidebarUserMenu
}

export function AppSidebar({
  brand,
  user,
  dataMain,
  dataSecondary,
  dataProjects,
  dataMainLabel,
  dataProjectsLabel,
  dataProjectsMore,
  dataUserMenu,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<a href="#" aria-label={brand.name} />}
            >
              <div className="flex aspect-square size-8 items-center justify-center">
                {typeof brand.logo === "string" ? (
                  <img src={brand.logo} alt={brand.name} className="size-8" />
                ) : brand.logo ? (
                  brand.logo
                ) : (
                  <BlocksIcon className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{brand.name}</span>
                {brand.description ? (
                  <span className="truncate text-xs">{brand.description}</span>
                ) : null}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dataMain} label={dataMainLabel} />
        {dataProjects?.length ? (
          <NavProjects
            projects={dataProjects}
            label={dataProjectsLabel}
            more={dataProjectsMore}
          />
        ) : null}
        {dataSecondary?.length ? (
          <NavSecondary items={dataSecondary} className="mt-auto" />
        ) : null}
      </SidebarContent>
      {user ? (
        <SidebarFooter>
          <NavUser user={user} menu={dataUserMenu} />
        </SidebarFooter>
      ) : null}
    </Sidebar>
  )
}
