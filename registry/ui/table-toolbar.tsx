"use client"

import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTableViewOptions } from "@/hoogin/ui/view-options"
import type { FilterableColumn } from "@/hoogin/ui/data-table.types"

export type GlobalFilterValue = {
  value: string
  columns: string[]
}

const ALL_COLUMNS = "__all__"

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  filterableColumns?: FilterableColumn[]
  placeholder?: string
}

function DataTableToolbar<TData>({
  table,
  filterableColumns,
  placeholder = "Filter...",
}: DataTableToolbarProps<TData>) {
  const filter = (table.getState().globalFilter as GlobalFilterValue | undefined) ?? {
    value: "",
    columns: [],
  }

  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanGlobalFilter() && column.getIsVisible())
    .filter((column) =>
      !filterableColumns ||
      filterableColumns.some((filterable) => filterable.column === column.id)
    )
    .map((column) => ({
      id: column.id,
      caption:
        filterableColumns?.find((filterable) => filterable.column === column.id)
          ?.caption ?? column.id,
    }))

  const filterValue = filter.columns.length > 0 ? filter.columns[0] : ALL_COLUMNS

  function updateFilter(next: GlobalFilterValue) {
    table.setGlobalFilter(next)
  }

  function handleColumnChange(value: string | null) {
    updateFilter({ ...filter, columns: value && value !== ALL_COLUMNS ? [value] : [] })
  }

  function clearFilter() {
    updateFilter({ ...filter, value: "" })
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={filterValue} onValueChange={handleColumnChange}>
          <SelectTrigger className="h-8 w-36" aria-label="Search in columns">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={ALL_COLUMNS}>All columns</SelectItem>
            {columns.map((column) => (
              <SelectItem key={column.id} value={column.id}>
                {column.caption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={filter.value}
          onChange={(event) => updateFilter({ ...filter, value: event.target.value })}
          placeholder={placeholder}
          className="h-8 w-48 sm:w-64"
        />
        {filter.value.length > 0 ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={clearFilter}
            aria-label="Reset filter"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

export { DataTableToolbar }
