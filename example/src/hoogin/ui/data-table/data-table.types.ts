import type { ColumnDef, RowData } from "@tanstack/react-table"
import type { DataTableFeatures } from "@/hoogin/ui/data-table/data-table-features"

export type DataTableColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<DataTableFeatures, TData, TValue>

export type FilterableColumn = {
  caption: string
  column: string
}
