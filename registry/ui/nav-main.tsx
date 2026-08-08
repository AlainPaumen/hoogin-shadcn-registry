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
import type {
  SidebarNavItem,
  SidebarNavSubItem,
} from "@/hoogin/ui/sidebar.types"

function isSubItemActive(sub: SidebarNavSubItem, fullPath: string): boolean {
  if (sub.url === fullPath) return true
  return sub.items?.some((child) => isSubItemActive(child, fullPath)) ?? false
}

function NavSubItem({
  sub,
  fullPath,
}: {
  sub: SidebarNavSubItem
  fullPath: string
}) {
  const active = isSubItemActive(sub, fullPath)
  if (!sub.items?.length) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton isActive={active} render={<Link to={sub.url} />}>
          <span>{sub.title}</span>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  }

  return (
    <Collapsible
      defaultOpen={active}
      render={<SidebarMenuSubItem />}
    >
      <SidebarMenuSubButton
        size="sm"
        isActive={active}
        className="pr-6"
        render={<Link to={sub.url} />}
      >
        <span>{sub.title}</span>
      </SidebarMenuSubButton>
      <CollapsibleTrigger
        render={
          <SidebarMenuAction className="aria-expanded:rotate-90" />
        }
      >
        <ChevronRightIcon />
        <span className="sr-only">Toggle</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {sub.items.map((child) => (
            <NavSubItem key={child.title} sub={child} fullPath={fullPath} />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

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
    return item.items?.some((sub) => isSubItemActive(sub, fullPath)) ?? false
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
                    <ChevronRightIcon />
                    <span className="sr-only">Toggle</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((sub) => (
                        <NavSubItem
                          key={sub.title}
                          sub={sub}
                          fullPath={fullPath}
                        />
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
