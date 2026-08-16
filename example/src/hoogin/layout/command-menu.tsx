"use client"

import * as React from "react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { router } from "@/router"
import { sidebarData } from "@/config/sidebar.config"
import type { SidebarNavSubItem } from "@/hoogin/ui/sidebar.types"

type CommandEntry = {
  title: string
  url: string
}

type NavLike = {
  title: string
  url: string
  items?: SidebarNavSubItem[]
}

function flattenNav(items: NavLike[]): CommandEntry[] {
  return items.flatMap((item) => [
    { title: item.title, url: item.url },
    ...(item.items ? flattenNav(item.items) : []),
  ])
}

function CommandDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        showCloseButton={false}
        className="inset-x-0 top-24! mx-auto max-w-xl gap-0 overflow-hidden rounded-lg p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Search</SheetTitle>
        </SheetHeader>
        <Command className="rounded-lg border">{children}</Command>
      </SheetContent>
    </Sheet>
  )
}

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const items = React.useMemo(
    () => [...flattenNav(sidebarData.navMain), ...sidebarData.navSecondary],
    []
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search docs..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {items.map((item) => (
            <CommandItem
              key={item.url}
              value={`${item.title} ${item.url}`}
              onSelect={() => {
                setOpen(false)
                if (item.url.startsWith("http")) {
                  window.open(item.url, "_blank", "noopener,noreferrer")
                } else {
                  void router.navigate({ to: item.url })
                }
              }}
            >
              {item.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
