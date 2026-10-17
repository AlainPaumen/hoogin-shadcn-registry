---
name: hgn-building-data-tables
description: Use when showing records in a table, or adding or changing columns, cells, search, faceted filters, sorting, pagination or row selection with the @hoogin DataTable (TanStack Table v9). Also applies when the work touches DataTableColumnDef, DataTable props, or any *Cell component from @hoogin/data-table-cells. For create/edit/delete pages built on the table, see hgn-building-admin-pages.
user-invocable: true
---

# Building data tables

Shows records with `@hoogin/data-table`: sortable headers, a search box,
optional faceted filters, column visibility, pagination and row selection.
You write the columns; the table brings the rest.

## Contents

- [Requires](#requires)
- [Setup](#setup)
- [Recipe](#recipe)
- [DataTable props](#datatable-props)
- [Cells](#cells)
- [Custom cells](#custom-cells)
- [Search and faceted filters](#search-and-faceted-filters)
- [Sorting](#sorting)
- [Rules](#rules)
- [Limits](#limits)
- [Troubleshooting](#troubleshooting)

---

## Requires

- `@tanstack/react-table` **v9** (`useTable({ features })`); v8 examples from
  the web (`getCoreRowModel`, `getState()`) don't apply.
- Paraglide JS for messages (`@/paraglide/messages.js`), as in the
  `hgn-internationalizing-apps` skill.
- **All rows in memory.** The table sorts, filters and pages on the client; see
  [Limits](#limits).

## Setup

```bash
bunx --bun shadcn@latest add @hoogin/data-table
```

The table lands in `src/hoogin/ui/data-table/`, the cells in
`src/hoogin/ui/data-table/cells/` (via `@hoogin/data-table-cells`), and this
skill in `.opencode/skills/hgn-building-data-tables/`. Re-run with
`--overwrite` to update. Never edit files under `src/hoogin/` — the next
`--overwrite` replaces them.

## Recipe

Columns are a typed array; define them once, outside the component:

```tsx
import type { DataTableColumnDef } from "@/hoogin/ui/data-table/data-table.types"
import { BadgeCell } from "@/hoogin/ui/data-table/cells/badge.cell"
import { CurrencyCell } from "@/hoogin/ui/data-table/cells/currency.cell"
import { DateCell } from "@/hoogin/ui/data-table/cells/date.cell"
import { EmailCell } from "@/hoogin/ui/data-table/cells/email.cell"
import { TextCell } from "@/hoogin/ui/data-table/cells/text.cell"
import { m } from "@/paraglide/messages.js"

export type Invoice = {
  id: string
  customer: string
  email: string
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
    accessorKey: "email",
    header: m.invoices_email(),
    cell: ({ row }) => <EmailCell value={row.original.email} />,
  },
  {
    accessorKey: "status",
    header: m.invoices_status(),
    // Faceted filters set an array of values; there is no named filterFn for it.
    filterFn: (row, columnId, selected: string[]) =>
      !selected?.length || selected.includes(row.getValue(columnId)),
    cell: ({ row }) => (
      <BadgeCell
        value={row.original.status}
        variantByValue={{ open: "secondary", paid: "default", void: "outline" }}
      />
    ),
  },
  {
    accessorKey: "issuedAt",
    header: m.invoices_issuedAt(),
    sortFn: "datetime",
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
  filterableColumns={[
    { caption: m.invoices_customer(), column: "customer" },
    { caption: m.invoices_email(), column: "email" },
  ]}
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

## DataTable props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `columns` | `DataTableColumnDef<TData>[]` | — | required |
| `data` | `TData[]` | — | required; **all** rows |
| `getRowId` | `(row) => string` | row index | pass it whenever rows have an id — selection and re-renders key on it |
| `filterableColumns` | `{ caption, column }[]` | every searchable column | limits the search box and names the columns in its column picker |
| `filterPlaceholder` | `string` | translated "Filter…" | search box placeholder |
| `filters` | `{ columnId, title, options: { value, label, icon? }[] }[]` | none | faceted filters above the search row |
| `initialSorting` | `{ id, desc }[]` | none | initial sort only; the user can change it |
| `initialPageSize` | `number` | `10` | |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | |
| `enableRowSelection` | `boolean` | `false` | adds a checkbox column and a "n of m selected" count |
| `emptyState` | `ReactNode` | translated "No results." | shown when nothing matches |
| `className` | `string` | | on the wrapper |
| `tableProps` | props of shadcn `Table` | | passed to the `<table>` |

## Cells

Every cell takes `value`; use `row.original.<field>` for a typed value.

| Cell | `value` | Renders | Other props |
| --- | --- | --- | --- |
| `TextCell` | `string` | muted text, left | — |
| `EmailCell` | `string` | muted text, left | — |
| `DateCell` | `string` (ISO / anything `new Date()` parses) | `formatDate`, active locale | — |
| `CurrencyCell` | `number` — integer cents | `formatCurrency(value / 100, "EUR")`, right-aligned | — |
| `CheckboxCell` | `boolean \| undefined` | checked / empty square icon, centered | — |
| `BadgeCell` | `string` | shadcn `Badge` showing `value` as-is | `variant` (default `secondary`), `variantByValue: Record<string, variant>` |
| `FormattedCell` | any `ReactNode` | muted text | `format: (value) => ReactNode`, `align: "left" \| "right" \| "center"` |
| `ActionCell` | — | "⋯" menu with Detail, Edit, Delete | `onDetail`, `onEdit`, `onDelete` |

Formatters for `FormattedCell` live in `cells/formatters.utils.tsx`:
`currencyFormatter(cents, currency = "EUR")`, `dateFormatter(iso)`,
`minutesFormatter(minutes)` (`1h 5m`), `checkBoxFormatter(bool)`,
`nationalNumberFormatter(digits)` (Belgian national number).

```tsx
cell: ({ row }) => (
  <FormattedCell
    value={row.original.duration}
    align="right"
    format={minutesFormatter}
  />
)
```

`BadgeCell` shows the raw `value`, so it suits codes and names. For a
translated label, write a custom cell (below).

## Custom cells

No cell fits? Write a small component in your app (outside `src/hoogin/`) and
reuse the formatters and `FormattedCell` so it looks like the rest:

```tsx
import { Badge } from "@/components/ui/badge"
import { m } from "@/paraglide/messages.js"

const statusLabel = {
  open: m.invoices_statusOpen,
  paid: m.invoices_statusPaid,
  void: m.invoices_statusVoid,
} satisfies Record<Invoice["status"], () => string>

export function InvoiceStatusCell({ value }: { value: Invoice["status"] }) {
  return (
    <Badge variant={value === "paid" ? "default" : "secondary"}>
      {statusLabel[value]()}
    </Badge>
  )
}
```

Keep cells presentational: no data fetching, no row mutations — pass
callbacks in from the page (as `ActionCell` does).

## Search and faceted filters

- **The search box** matches a case-insensitive substring of each cell's
  **raw value** (`row.getValue`), not the rendered text: an amount of `1250`
  cents is found by typing `1250`, not `12,50`.
- **Which columns are searched**: columns whose first non-empty value is a
  string or number, minus any with `enableGlobalFilter: false`, limited to
  `filterableColumns` when given. With more than one searchable column, a
  picker next to the box narrows the search to one column.
- **Faceted filters** (`filters` prop): each entry renders a popover with a
  checkbox per option and live counts. Selecting options sets an array on the
  column, so that column **must** have a `filterFn` that accepts `string[]`
  (see the recipe). Option `value`s must equal the column's raw values.
- A reset button clears the search and every facet.

## Sorting

- Every column with an accessor sorts by clicking its header, cycling through
  both directions and back to unsorted; string columns start ascending,
  number columns descending (`sortDescFirst` overrides). Opt out with
  `enableSorting: false`.
- The sort function is picked from the values automatically. For ISO date
  strings set `sortFn: "datetime"`; other names: `alphanumeric`,
  `alphanumericCaseSensitive`, `text`, `textCaseSensitive`, `basic`. A custom
  function works too.
- `initialSorting` uses column ids — the `accessorKey`, or `id` when you set
  one.

## Rules

1. **Type the columns** as `DataTableColumnDef<TData>[]` with `TData` your row
   type. Don't import `ColumnDef` from TanStack directly — the @hoogin type
   carries the table's feature set.
2. **Headers and labels are messages** (`m.*()`), never English literals:
   `header`, `filterableColumns[].caption`, `filters[].title`, option labels,
   `emptyState`.
3. **Prefer `row.original.<field>`** in cells: it is checked against your row
   type. `row.getValue(id)` takes whatever type the call site expects, so a
   wrong id or type compiles; keep it for generic code such as `filterFn`.
4. **Stable ids.** Use `accessorKey` for a plain field; use `id` +
   `accessorFn` for a derived value. The id is what `filterableColumns`,
   `filters`, `initialSorting` and the View menu refer to.
5. **Money is integer cents** end to end, like `FormCurrencyField` in the
   forms skill. `CurrencyCell` divides by 100.
6. **Display columns** (no accessor, e.g. a custom actions column) need an
   `id` and should set `enableSorting: false, enableHiding: false`.
7. **v9 API only**: if you need the table instance (e.g. a custom toolbar
   component), its type is `ReactTable<DataTableFeatures, TData>` and state is
   read via `table.state.*`, never `table.getState()`.

## Limits

These are current gaps in `@hoogin/data-table`; work around them, don't patch
`src/hoogin/`:

- **Client-side only.** Sorting, filtering and paging run in the browser on the
  full `data` array, and table state is not in the URL. Fine for hundreds to a
  few thousand rows; for more, filter on the server before passing `data`
  (e.g. a date range or status in your query). A server-side mode is designed
  but not built.
- **Selection is display-only.** `enableRowSelection` shows checkboxes and a
  count, but `DataTable` doesn't expose the selected rows, so bulk actions
  aren't possible yet.
- **The View menu lists column ids**, not headers. Choose readable ids
  (`issuedAt`, not `col3`), or hide technical columns with `enableHiding: false`.
- **`BadgeCell` doesn't translate** its value — use a custom cell for labels.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| A facet filters out every row | the column has no array-aware `filterFn` | add the `filterFn` from the recipe |
| `Type '"arrIncludesSome"' is not assignable` | filter fn names aren't registered in the @hoogin feature set | pass a function as `filterFn` |
| A column is missing from search | its first value isn't a string/number, or `enableGlobalFilter: false`, or it's not in `filterableColumns` | add it to `filterableColumns`, or search on a string column |
| Dates sort in the wrong order | string sort on non-ISO dates | store ISO strings and set `sortFn: "datetime"` |
| Amount shows 100× too large/small | value isn't in cents | convert to integer cents at the API boundary |
| `getState is not a function` / v8 types in errors | v8 example code | use the v9 API (`table.state.*`, `DataTableColumnDef`) |
