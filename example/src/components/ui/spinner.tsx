import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="spinner"
      className={cn(
        "size-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Spinner }
