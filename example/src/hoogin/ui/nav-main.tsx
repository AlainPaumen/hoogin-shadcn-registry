import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/hoogin/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import { Link, useMatches } from "@tanstack/react-router"
import type { SidebarNavItem } from "@/hoogin/ui/sidebar.types"

export function NavMain({
  items,
  label = "Platform",
}: {
  items: SidebarNavItem[]
  label?: string
}) {
  const matches = useMatches()
  const fullPath = matches[matches.length - 1]?.fullPath ?? ""
  if (items.length === 0) {
    return null
  }

  const isItemActive = (item: SidebarNavItem) => {
    if (item.isActive) return true
    if (item.url === fullPath) return true
    if (item.items?.some((subItem) => subItem.url === fullPath)) return true
    return false
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const active = isItemActive(item)
          return (
            <Collapsible
              key={item.title}
              defaultOpen={active}
              render={<SidebarMenuItem />}
            >
              <SidebarMenuButton
                tooltip={item.title}
                render={<Link to={item.url} />}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuAction className="aria-expanded:rotate-90" />
                    }
                  >
                    <ChevronRightIcon
                    />
                    <span className="sr-only">Toggle</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton render={<Link to={subItem.url} />}>
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
