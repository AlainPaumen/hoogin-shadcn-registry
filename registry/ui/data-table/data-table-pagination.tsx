"use client"

import type { ReactTable, RowData } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { dataTableFeatures } from "@/hoogin/ui/data-table/data-table.types"

type DataTablePaginationProps<TData extends RowData> = {
  table: ReactTable<typeof dataTableFeatures, TData>
  pageSizeOptions?: number[]
  showSelectedCount?: boolean
}

function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions = [10, 20, 50, 100],
  showSelectedCount = false,
}: DataTablePaginationProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const rowCount = table.getFilteredRowModel().rows.length
  const pageCount = Math.max(1, table.getPageCount())
  const pageIndex = table.state.pagination.pageIndex
  const pageSize = table.state.pagination.pageSize

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {showSelectedCount ? (
        <p className="text-sm text-muted-foreground">
          {selectedCount} of {rowCount} row(s) selected.
        </p>
      ) : (
        <span />
      )}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Rows per page
          </span>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-16" aria-label="Rows per page">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          Page {pageIndex + 1} of {pageCount}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export { DataTablePagination }
