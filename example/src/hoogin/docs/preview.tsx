import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function Preview({
  title = "Preview",
  children,
  className,
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between gap-2 border-b bg-muted/50 px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
      </div>
      <div className={cn("flex items-center justify-center p-8", className)}>
        {children}
      </div>
    </div>
  )
}
