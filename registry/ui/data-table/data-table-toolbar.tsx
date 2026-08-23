"use client"

import type { ReactTable, RowData } from "@tanstack/react-table"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DataTableFacetedFilter,
  type FacetedOption,
} from "@/hoogin/ui/data-table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/hoogin/ui/data-table/data-table-view-options"
import type { FilterableColumn } from "@/hoogin/ui/data-table/data-table.types"
import type { DataTableFeatures } from "@/hoogin/ui/data-table/data-table-features"

export type GlobalFilterValue = {
  value: string
  columns: string[]
}

export type FacetedFilter = {
  columnId: string
  title: string
  options: FacetedOption[]
}

const ALL_COLUMNS = "__all__"

type DataTableToolbarProps<TData extends RowData> = {
  table: ReactTable<DataTableFeatures, TData>
  filterableColumns?: FilterableColumn[]
  filters?: FacetedFilter[]
  placeholder?: string
}

function DataTableToolbar<TData extends RowData>({
  table,
  filterableColumns,
  filters,
  placeholder = "Filter...",
}: DataTableToolbarProps<TData>) {
  const filter = (table.state.globalFilter as GlobalFilterValue | undefined) ?? {
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

  const items = [
    { value: ALL_COLUMNS, label: "Search columns", optionLabel: "All columns" },
    ...columns.map((column) => ({
      value: column.id,
      label: column.caption,
      optionLabel: column.caption,
    })),
  ]

  function updateFilter(next: GlobalFilterValue) {
    table.setGlobalFilter(next)
  }

  function handleColumnChange(value: string | null) {
    updateFilter({ ...filter, columns: value && value !== ALL_COLUMNS ? [value] : [] })
  }

  const hasFacetedSelection =
    filters?.some((filter) => {
      const value = table.getColumn(filter.columnId)?.getFilterValue()
      return Array.isArray(value) && value.length > 0
    }) ?? false

  const showReset =
    filter.value.length > 0 || filter.columns.length > 0 || hasFacetedSelection

  function resetFilters() {
    updateFilter({ value: "", columns: [] })
    filters?.forEach((filter) => {
      table.getColumn(filter.columnId)?.setFilterValue([])
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {filters && filters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                columnId={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
        </div>
      ) : null}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {columns.length > 1 ? (
            <Select value={filterValue} onValueChange={handleColumnChange} items={items}>
              <SelectTrigger className="h-8 w-36" aria-label="Search in columns">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value} label={item.label}>
                      {item.optionLabel}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : null}
          <Input
            value={filter.value}
            onChange={(event) => updateFilter({ ...filter, value: event.target.value })}
            placeholder={placeholder}
            aria-label="Filter"
            className="h-8 w-48 sm:w-64"
          />
          {showReset ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={resetFilters}
              aria-label="Reset filters"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}

export { DataTableToolbar }
