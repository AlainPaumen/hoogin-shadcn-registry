"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { m } from "@/paraglide/messages.js"

export type SubjectOption = {
  name: string
}

type SubjectSwitcherProps = {
  /** First line, describing what kind of subject this is. */
  title: string
  /** The selectable subjects; each option is one subject. */
  subjects: SubjectOption[]
  /** Name of the selected subject, controlled by the caller. */
  value: string | undefined
  onSelect?: (subject: SubjectOption) => void
}

export function SubjectSwitcher({
  title,
  subjects,
  value,
  onSelect,
}: SubjectSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selected = subjects.find((subject) => subject.name === value) ?? subjects[0]

  if (subjects.length === 0 || !selected) {
    return null
  }

  function handleOpenChange(next: boolean) {
    setIsOpen(next)
    if (!next) {
      setSearch("")
    }
  }

  function handleSelect(subject: SubjectOption) {
    onSelect?.(subject)
    setIsOpen(false)
  }

  // Only one subject: nothing to switch, render the trigger statically.
  if (subjects.length === 1) {
    return (
      <div className="grid min-w-56 py-2 pl-2.5 text-sm leading-tight">
        <span className="truncate text-xs text-muted-foreground">{title}</span>
        <span className="truncate font-medium">{selected.name}</span>
      </div>
    )
  }

  const visibleSubjects = subjects
    .filter((subject) =>
      subject.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            className="h-auto w-full min-w-56 justify-stretch px-2.5 py-2"
            aria-label={title}
          />
        }
      >
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate text-xs text-muted-foreground">{title}</span>
          <span className="truncate font-medium">{selected.name}</span>
        </div>
        <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-(--anchor-width) min-w-56 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={title}
          />
          <CommandList>
            {visibleSubjects.length === 0 ? (
              <CommandEmpty>{m.subjectSwitcher_noResults()}</CommandEmpty>
            ) : (
              <CommandGroup>
                {visibleSubjects.map((subject) => (
                  <CommandItem
                    key={subject.name}
                    value={subject.name}
                    onSelect={() => handleSelect(subject)}
                  >
                    {subject.name}
                    {subject.name === selected.name ? (
                      <CheckIcon className="ml-auto" />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
