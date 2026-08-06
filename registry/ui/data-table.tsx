"use client"

import { useMemo, useState } from "react"
import type { ComponentProps, ReactNode } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { Header, SortingState } from "@tanstack/react-table"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type {
  DataTableColumnDef,
  FilterableColumn,
} from "@/hoogin/ui/data-table.types"
import { DataTablePagination } from "@/hoogin/ui/data-table-pagination"
import {
  DataTableToolbar,
  type FacetedFilter,
  type GlobalFilterValue,
} from "@/hoogin/ui/data-table-toolbar"

export type DataTableProps<TData, TValue> = {
  columns: DataTableColumnDef<TData, TValue>[]
  data: TData[]
  filterPlaceholder?: string
  filterableColumns?: FilterableColumn[]
  filters?: FacetedFilter[]
  initialSorting?: SortingState
  initialPageSize?: number
  pageSizeOptions?: number[]
  enableRowSelection?: boolean
  getRowId?: (row: TData) => string
  emptyState?: ReactNode
  className?: string
  tableProps?: ComponentProps<typeof Table>
}

function DataTable<TData, TValue>({
  columns,
  data,
  filterPlaceholder,
  filterableColumns,
  filters,
  initialSorting,
  initialPageSize = 10,
  pageSizeOptions,
  enableRowSelection = false,
  getRowId,
  emptyState,
  className,
  tableProps,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? [])
  const [globalFilter, setGlobalFilter] = useState<GlobalFilterValue>({
    value: "",
    columns: [],
  })

  const selectionColumn = useMemo<DataTableColumnDef<TData, unknown>>(
    () => ({
      id: "select",
      enableSorting: false,
      enableHiding: false,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          disabled={!row.getCanSelect()}
          aria-label="Select row"
        />
      ),
    }),
    []
  )

  const allColumns = useMemo(
    () => (enableRowSelection ? [selectionColumn, ...columns] : columns),
    [enableRowSelection, selectionColumn, columns]
  )

  const table = useReactTable({
    data,
    columns: allColumns,
    getRowId,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const filter = (filterValue as GlobalFilterValue | undefined) ?? {
        value: "",
        columns: [],
      }
      if (!filter.value) return true
      const query = filter.value.toLowerCase()
      const cells = row
        .getAllCells()
        .filter((cell) => cell.column.getCanGlobalFilter())
        .filter(
          (cell) =>
            !filterableColumns ||
            filterableColumns.some((filterable) => filterable.column === cell.column.id)
        )
      const targets =
        filter.columns.length > 0
          ? cells.filter((cell) => filter.columns.includes(cell.column.id))
          : cells
      return targets.some((cell) =>
        String(cell.getValue() ?? "").toLowerCase().includes(query)
      )
    },
    initialState: {
      sorting: initialSorting,
      pagination: { pageSize: initialPageSize },
    },
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className={cn("w-full space-y-3", className)}>
      <DataTableToolbar
        table={table}
        filterableColumns={filterableColumns}
        filters={filters}
        placeholder={filterPlaceholder}
      />
      <div className="rounded-lg border">
        <Table {...tableProps}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <DataTableColumnHeader header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyState ?? "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        pageSizeOptions={pageSizeOptions}
        showSelectedCount={enableRowSelection}
      />
    </div>
  )
}

function DataTableColumnHeader<TData, TValue>({
  header,
  className,
}: {
  header: Header<TData, TValue>
  className?: string
}) {
  if (!header.column.getCanSort()) {
    return (
      <div className={cn("text-left font-medium", className)}>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </div>
    )
  }

  const label = flexRender(
    header.column.columnDef.header,
    header.getContext()
  )
  const sorted = header.column.getIsSorted()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "-ml-2 h-8 select-none text-left hover:bg-transparent",
        className
      )}
      onClick={header.column.getToggleSortingHandler()}
    >
      {label}
      {sorted === "asc" ? (
        <ChevronUp className="size-4" />
      ) : sorted === "desc" ? (
        <ChevronDown className="size-4" />
      ) : (
        <ChevronsUpDown className="size-4 opacity-60" />
      )}
    </Button>
  )
}

export { DataTable }
