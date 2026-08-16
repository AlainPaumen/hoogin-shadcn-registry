"use client"

import * as React from "react"
import { PlusCircleIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export type FacetedOption = {
  label: string
  value: string
  icon?: LucideIcon
}

type DataTableFacetedFilterProps = {
  columnId: string
  column: {
    getFilterValue: () => unknown
    setFilterValue: (value: unknown) => void
    getFacetedUniqueValues?: () => Map<unknown, number>
  }
  title: string
  options: FacetedOption[]
}

function DataTableFacetedFilter({
  column,
  title,
  options,
}: DataTableFacetedFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filterValue = column?.getFilterValue()
  const selectedValues = Array.isArray(filterValue) ? new Set(filterValue) : new Set()

  const setFilterValue = column?.setFilterValue

  function handleSelect(value: string) {
    const newSet = new Set(selectedValues)
    if (newSet.has(value)) {
      newSet.delete(value)
    } else {
      newSet.add(value)
    }
    setFilterValue?.(Array.from(newSet))
  }

  function handleClear() {
    setFilterValue?.([])
  }

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger render={<Button variant="outline" className="border-dashed" />}>
        <PlusCircleIcon className="mr-2 size-4" />
        {title}
        {selectedValues.size > 0 ? (
          <>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Badge
              variant="secondary"
              className="rounded-sm px-1 font-normal sm:hidden"
            >
              {selectedValues.size}
            </Badge>
            {selectedValues.size > 2 ? (
              <Badge
                variant="secondary"
                className="hidden rounded-sm px-1 font-normal sm:inline-flex"
              >
                {selectedValues.size} selected
              </Badge>
            ) : (
              <div className="hidden space-x-1 sm:flex">
                {options
                  .filter((option) => selectedValues.has(option.value))
                  .map((option) => (
                    <Badge
                      key={option.value}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {option.label}
                    </Badge>
                  ))}
              </div>
            )}
          </>
        ) : null}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={title}
          />
          <CommandList>
            {filteredOptions.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div className="pointer-events-none mr-2 flex size-4 items-center justify-center">
                    <Checkbox
                      checked={selectedValues.has(option.value)}
                      onCheckedChange={() => handleSelect(option.value)}
                      aria-label={option.label}
                    />
                  </div>
                  {option.icon && (
                    <option.icon className="mr-2 size-4 text-muted-foreground" />
                  )}
                  <span>{option.label}</span>
                  {column.getFacetedUniqueValues?.().get(option.value) ? (
                    <span className="ml-auto font-mono text-xs text-muted-foreground">
                      {column.getFacetedUniqueValues?.().get(option.value)}
                    </span>
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    value="__clear__"
                    onSelect={handleClear}
                    className="justify-center text-center"
                  >
                    Clear Filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { DataTableFacetedFilter }
