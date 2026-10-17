import { type Column, type ReactTable, type RowData } from '@tanstack/react-table'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { m } from '@/paraglide/messages.js'
import type { DataTableFeatures } from '@/hoogin/ui/data-table/data-table-features'
import type { FilterableColumn } from '@/hoogin/ui/data-table/data-table.types'

type DataTableViewOptionsProps<TData extends RowData> = {
  table: ReactTable<DataTableFeatures, TData>
  filterableColumns?: FilterableColumn[]
}

// Caption from filterableColumns, else a string header, else the column id.
function columnLabel<TData extends RowData>(
  column: Column<DataTableFeatures, TData, unknown>,
  filterableColumns?: FilterableColumn[]
) {
  const caption = filterableColumns?.find(
    (filterable) => filterable.column === column.id
  )?.caption
  if (caption) return caption
  const header = column.columnDef.header
  return typeof header === 'string' && header ? header : column.id
}

export function DataTableViewOptions<TData extends RowData>({
  table,
  filterableColumns,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Button
            variant='outline'
            size='sm'
            className='ms-auto hidden h-8 lg:flex'
          />
        }
      >
        <SlidersHorizontal className='size-4' />
        {m.dataTableViewOptions_view()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-37.5'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {m.dataTableViewOptions_toggleColumns()}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnLabel(column, filterableColumns)}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
