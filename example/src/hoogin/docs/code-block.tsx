"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckIcon, CopyIcon } from "lucide-react"

export function CodeBlock({
  code,
  language = "bash",
  className,
}: {
  code: string
  language?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      <div className="flex items-center justify-between gap-2 border-b bg-muted/50 px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {language}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="size-6"
          onClick={copy}
          aria-label="Copy code"
        >
          {copied ? (
            <CheckIcon className="size-3.5" />
          ) : (
            <CopyIcon className="size-3.5" />
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}
