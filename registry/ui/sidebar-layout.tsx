"use client"

import * as React from "react"

import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/hoogin/ui/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/hoogin/ui/sidebar"
import type {
  SidebarBrand,
  SidebarMore,
  SidebarNavItem,
  SidebarProject,
  SidebarSecondaryItem,
  SidebarUser,
  SidebarUserMenu,
} from "@/hoogin/ui/sidebar.types"
import { ThemeToggle } from "@/hoogin/ui/theme-toggle"

type SidebarLayoutProps = {
  children: React.ReactNode
  breadcrumb?: React.ReactNode
  brand: SidebarBrand
  user?: SidebarUser
  dataMain: SidebarNavItem[]
  dataSecondary?: SidebarSecondaryItem[]
  dataProjects?: SidebarProject[]
  dataMainLabel?: string
  dataProjectsLabel?: string
  dataProjectsMore?: SidebarMore
  dataUserMenu?: SidebarUserMenu
  storageKey?: string
  collapsible?: "offcanvas" | "icon" | "none"
  className?: string
}

export function SidebarLayout({
  children,
  breadcrumb,
  brand,
  user,
  dataMain,
  dataSecondary,
  dataProjects,
  dataMainLabel,
  dataProjectsLabel,
  dataProjectsMore,
  dataUserMenu,
  storageKey,
  collapsible,
  className,
}: SidebarLayoutProps) {
  return (
    <TooltipProvider>
      <SidebarProvider storageKey={storageKey} className={className}>
        <AppSidebar
          brand={brand}
          user={user}
          dataMain={dataMain}
          dataSecondary={dataSecondary}
          dataProjects={dataProjects}
          dataMainLabel={dataMainLabel}
          dataProjectsLabel={dataProjectsLabel}
          dataProjectsMore={dataProjectsMore}
          dataUserMenu={dataUserMenu}
          collapsible={collapsible}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              {breadcrumb}
            </div>
            <div className="ml-auto flex items-center gap-2 px-4">
              <ThemeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
