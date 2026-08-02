import { sidebarData } from "@/config/sidebar.config"

export type Crumb = {
  label: string
  to?: string
}

export function getBreadcrumbs(fullPath: string): Crumb[] {
  const groups = sidebarData.navMain
  const path = fullPath.replace(/\/$/, "")

  for (const group of groups) {
    for (const sub of group.items ?? []) {
      if (sub.url === path) {
        return [
          {
            label: group.title,
            to: group.url !== path ? group.url : undefined,
          },
          { label: sub.title },
        ]
      }
    }
    if (group.url === path) {
      return [{ label: group.title, to: group.url }]
    }
  }

  return []
}
