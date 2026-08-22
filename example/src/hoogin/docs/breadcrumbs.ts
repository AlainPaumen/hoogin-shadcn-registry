import { sidebarData } from "@/config/sidebar.config"
import type { SidebarNavSubItem } from "@/hoogin/ui/navigation/sidebar.types"

export type Crumb = {
  label: string
  to?: string
}

function collectCrumbs(
  sub: SidebarNavSubItem,
  path: string,
): Crumb[] | null {
  if (sub.url === path) {
    return [{ label: sub.title }]
  }
  for (const child of sub.items ?? []) {
    const crumbs = collectCrumbs(child, path)
    if (crumbs) {
      return [
        {
          label: sub.title,
          to: sub.url !== path ? sub.url : undefined,
        },
        ...crumbs,
      ]
    }
  }
  return null
}

export function getBreadcrumbs(fullPath: string): Crumb[] {
  const groups = sidebarData.navMain
  const path = fullPath.replace(/\/$/, "")

  for (const group of groups) {
    if (group.url === path) {
      return [{ label: group.title, to: group.url }]
    }
    for (const sub of group.items ?? []) {
      const crumbs = collectCrumbs(sub, path)
      if (crumbs) {
        return [
          {
            label: group.title,
            to: group.url !== path ? group.url : undefined,
          },
          ...crumbs,
        ]
      }
    }
  }

  return []
}
