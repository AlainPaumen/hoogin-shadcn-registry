import { type LucideIcon } from "lucide-react"
import { type ReactNode } from "react"

export type SidebarBrand = {
  name: string
  description?: string
  logo?: ReactNode
}

export type SidebarUser = {
  name: string
  email: string
  avatar: string
}

export type SidebarNavItem = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export type SidebarSecondaryItem = {
  title: string
  url: string
  icon: LucideIcon
}

export type SidebarProject = {
  name: string
  url: string
  icon: LucideIcon
}

export type SidebarMore = {
  label: string
  url: string
}

export type SidebarUserMenuItem = {
  label: string
  url: string
  icon?: LucideIcon
}

export type SidebarUserMenuGroup = {
  items: SidebarUserMenuItem[]
}

export type SidebarUserMenu = SidebarUserMenuGroup[]
