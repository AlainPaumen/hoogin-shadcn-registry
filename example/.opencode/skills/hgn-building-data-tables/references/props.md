# DataTable props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `columns` | `DataTableColumnDef<TData>[]` | — | required |
| `data` | `TData[]` | — | required; all rows |
| `getRowId` | `(row) => string` | row index | pass it whenever rows have an id; selection keys on it |
| `filterableColumns` | `{ caption, column }[]` | every searchable column | limits search; captions name columns in the search column picker and the View menu |
| `filterPlaceholder` | `string` | translated "Filter…" | search placeholder |
| `filters` | `{ columnId, title, options: { value, label, icon? }[] }[]` | none | facet filters above the search row |
| `initialSorting` | `{ id, desc }[]` | none | initial sort only |
| `initialPageSize` | `number` | `10` | |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | |
| `enableRowSelection` | `boolean` | `false` | checkbox column and "n of m selected" count |
| `onRowSelectionChange` | `(selectedRows: TData[]) => void` | none | fires on user selection changes, rows across pages; needs `enableRowSelection` |
| `bulkActions` | `({ selectedRows, clearSelection }) => ReactNode` | none | bar between toolbar and table while rows are selected; needs `enableRowSelection` |
| `emptyState` | `ReactNode` | translated "No results." | |
| `className` | `string` | | on the wrapper |
| `tableProps` | props of shadcn `Table` | | passed to the `<table>` |

## Selection and bulk actions

```tsx
<DataTable
  columns={invoiceColumns}
  data={invoices}
  getRowId={(row) => row.id}
  enableRowSelection
  bulkActions={({ selectedRows, clearSelection }) => (
    <Button
      variant="destructive"
      size="sm"
      onClick={async () => {
        await voidInvoices.mutateAsync(selectedRows.map((row) => row.id))
        clearSelection()
      }}
    >
      {m.invoices_voidSelected({ count: selectedRows.length })}
    </Button>
  )}
/>
```

- The header checkbox selects the current page.
- `selectedRows` only holds rows still in `data`, so it stays correct after a
  refetch; call `clearSelection()` when the action is done.
- Selection survives sorting, filtering and paging; filtered-out rows stay
  selected.
- For the selection outside the table (page header, dialog), use
  `onRowSelectionChange` and keep the rows in state. It fires on user changes,
  not on `data` changes.
