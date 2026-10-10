import { LanguagesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getLocale, setLocale, type Locale } from "@/paraglide/runtime.js"

const DEFAULT_LOCALES: Locale[] = ["en", "nl"]

export function LocaleToggle({
  locales = DEFAULT_LOCALES,
}: {
  locales?: Locale[]
}) {
  const current = getLocale()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={current.toUpperCase()}
            className="aria-expanded:bg-muted"
          />
        }
      >
        <LanguagesIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-24">
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={(locale) => setLocale(locale)}
        >
          {locales.map((locale) => (
            <DropdownMenuRadioItem
              key={locale}
              value={locale}
              closeOnClick
            >
              {locale.toUpperCase()}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
