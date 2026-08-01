import { type LucideIcon } from "lucide-react"

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
