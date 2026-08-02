import type { ColumnDef } from "@tanstack/react-table"

export type DataTableColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
>

export type FilterableColumn = {
  caption: string
  column: string
}
