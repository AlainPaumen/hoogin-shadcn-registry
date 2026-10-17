---
name: hgn-building-data-tables
description: Builds record tables with the @hoogin DataTable (TanStack Table v9) — column definitions, cells, search, facet filters, sorting, pagination, row selection and bulk actions. Use when showing records in a table, adding or changing columns, cells, filters or selection, or when code touches DataTableColumnDef, DataTable or a *Cell component. For create/edit/delete pages on top of a table, use hgn-building-admin-pages.
user-invocable: true
---

# Building data tables

You write typed columns; `DataTable` adds sortable headers, search, facet
filters, column visibility, pagination and selection. It works on the full
`data` array in the browser.

**This is TanStack Table v9, not v8.** v8 code (`getCoreRowModel`,
`table.getState()`, `ColumnDef` from TanStack) does not apply. Columns are
`DataTableColumnDef<TData>[]`; a table instance is
`ReactTable<DataTableFeatures, TData>` and its state is `table.state.*`.

## Recipe

```tsx
import type { DataTableColumnDef } from "@/hoogin/ui/data-table/data-table.types"
import { BadgeCell } from "@/hoogin/ui/data-table/cells/badge.cell"
import { CurrencyCell } from "@/hoogin/ui/data-table/cells/currency.cell"
import { DateCell } from "@/hoogin/ui/data-table/cells/date.cell"
import { TextCell } from "@/hoogin/ui/data-table/cells/text.cell"
import { m } from "@/paraglide/messages.js"

export type Invoice = {
  id: string
  customer: string
  status: "open" | "paid" | "void"
  issuedAt: string // ISO date
  amount: number // integer cents
}

export const invoiceColumns: DataTableColumnDef<Invoice>[] = [
  {
    accessorKey: "customer",
    header: m.invoices_customer(),
    cell: ({ row }) => <TextCell value={row.original.customer} />,
  },
  {
    accessorKey: "status",
    header: m.invoices_status(),
    // Facet filters set a string[]; filterFn names are not registered, so pass a function.
    filterFn: (row, columnId, selected: string[]) =>
      !selected?.length || selected.includes(row.getValue(columnId)),
    cell: ({ row }) => (
      <BadgeCell
        value={row.original.status}
        labelByValue={{
          open: m.invoices_statusOpen(),
          paid: m.invoices_statusPaid(),
          void: m.invoices_statusVoid(),
        }}
        variantByValue={{ open: "secondary", paid: "default", void: "outline" }}
      />
    ),
  },
  {
    accessorKey: "issuedAt",
    header: m.invoices_issuedAt(),
    sortFn: "datetime", // only needed for ISO date strings
    cell: ({ row }) => <DateCell value={row.original.issuedAt} />,
  },
  {
    accessorKey: "amount",
    header: m.invoices_amount(),
    cell: ({ row }) => <CurrencyCell value={row.original.amount} />,
  },
]
```

```tsx
import { DataTable } from "@/hoogin/ui/data-table/data-table"

<DataTable
  columns={invoiceColumns}
  data={invoices}
  getRowId={(row) => row.id}
  filterableColumns={[{ caption: m.invoices_customer(), column: "customer" }]}
  filters={[
    {
      columnId: "status",
      title: m.invoices_status(),
      options: [
        { value: "open", label: m.invoices_statusOpen() },
        { value: "paid", label: m.invoices_statusPaid() },
        { value: "void", label: m.invoices_statusVoid() },
      ],
    },
  ]}
  initialSorting={[{ id: "issuedAt", desc: true }]}
  emptyState={m.invoices_empty()}
/>
```

Selection and bulk actions: add `enableRowSelection` and
`bulkActions={({ selectedRows, clearSelection }) => …}` — see
`references/props.md`.

## Checklist

Copy and tick off:

```
- [ ] Row type, and columns typed DataTableColumnDef<Row>[]
- [ ] Every header, caption, facet title, option label and emptyState is an m.*() key, added to every locale
- [ ] Each facet-filtered column has the array filterFn from the recipe
- [ ] getRowId passed
- [ ] Typecheck and lint pass — fix and re-run until clean
```

## Rules

1. **Cells read `row.original.<field>`** — typed. `row.getValue(id)` compiles
   with a wrong id or type; keep it for `filterFn`.
2. **Ids**: `accessorKey` for a field, `id` + `accessorFn` for a derived value.
   `filterableColumns`, `filters` and `initialSorting` refer to these ids.
3. **Money is integer cents**; `CurrencyCell` divides by 100.
4. **Facet option `value`s equal the column's raw values.** Search also matches
   raw values (`1250` cents, not `12,50`).
5. **Sorting**: leave `sortFn` unset, except `"datetime"` for ISO date strings.
6. **Display columns** (no accessor) need an `id`, `enableSorting: false` and
   `enableHiding: false`.
7. **Never edit `src/hoogin/`**: `shadcn add @hoogin/data-table --overwrite`
   replaces it. Write custom cells in your app.

## Limits

- All rows are in memory and table state is not in the URL. For large sets,
  narrow `data` in your query (a date range, a status).
- The View menu labels a column with its `filterableColumns` caption, else a
  string `header`, else its id. For a function `header`, add a caption or set
  `enableHiding: false`.

## References

- `references/props.md` — every DataTable prop; selection and bulk actions.
- `references/cells.md` — the shipped cells, formatters, custom cells.
- `references/search-and-sorting.md` — which columns search covers, facet
  filters, sort functions.
- `references/troubleshooting.md` — symptom → cause → fix.
