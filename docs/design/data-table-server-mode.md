# Design: controlled / server-side mode for DataTable and AdminPage

Status: proposal (not implemented) · Items: `@hoogin/data-table`, `@hoogin/admin-page`

## Problem

`DataTable` owns sorting, global filter, column (faceted) filters and pagination in
internal `useState` / `initialState`, and runs TanStack Table's client row models
(`sortedRowModel`, `filteredRowModel`, `paginatedRowModel`, faceting). That forces
the consumer to load **every** row up front. Apps built on the template need:

- lists too large to load at once (paging, sorting and searching done by TrailBase);
- table state in the URL (shareable links, back button) via TanStack Router search
  params — the template's AGENTS.md asks for this and marks it a gap;
- a loading state while the next page is fetched.

`AdminPage` spreads its remaining props into `DataTable`, so it inherits whatever
`DataTable` supports.

## Goals

1. Every piece of table state can be **controlled** (`value` + `onChange`), in
   client mode as well — so a client-side table can also sync to the URL.
2. An opt-in **manual** (server-side) mode: the table renders `data` as the
   current page, does no sorting/filtering/paging itself, and gets the total from
   `rowCount`.
3. A `loading` state that keeps the previous page visible.
4. Helpers that make the state serialisable into TanStack Router search params.
5. **No breaking change**: all new props are optional; without them the component
   behaves exactly as today.

Non-goals: infinite scroll / virtualisation, cursor pagination (offset only, see
open questions), server-side faceting counts (optional, see below), column
visibility or selection in the URL.

## API

### State types (new, exported from `data-table.types.ts`)

```ts
import type { PaginationState, SortingState, ColumnFiltersState } from "@tanstack/react-table"

export type GlobalFilterValue = { value: string; columns: string[] } // moved from toolbar, re-exported there

export type DataTableState = {
  sorting: SortingState            // [{ id, desc }]
  pagination: PaginationState     // { pageIndex, pageSize }
  globalFilter: GlobalFilterValue
  columnFilters: ColumnFiltersState // faceted filters: [{ id, value: string[] }]
}
```

All four are plain JSON, so they round-trip through search params.

### New `DataTableProps` (all optional)

```ts
type Controlled<K extends keyof DataTableState> = {
  [P in K]?: DataTableState[P]
} & {
  [P in K as `on${Capitalize<P & string>}Change`]?: (next: DataTableState[P]) => void
}

export type DataTableProps<TData extends RowData, TValue> = {
  // ...existing props unchanged...
} & Controlled<"sorting" | "pagination" | "globalFilter" | "columnFilters"> & {
  /** Server-side mode: `data` is the current page; sorting, filtering and paging
   *  are the caller's job. Requires `rowCount` (or `pageCount`) and `getRowId`. */
  manual?: boolean
  /** Total rows matching the current filters (server count). */
  rowCount?: number
  /** Alternative to rowCount when the backend only knows the page count. */
  pageCount?: number
  /** True while the page shown is stale (fetching). */
  loading?: boolean
  /** Debounce for global-filter typing before onGlobalFilterChange fires (ms).
   *  Default 300 in manual mode, 0 otherwise. */
  globalFilterDebounce?: number
}
```

Rules:

- Each state is controlled **independently**: if `sorting` is passed the table
  reads it and calls `onSortingChange` with the resolved next value (the
  component resolves TanStack's `Updater<T>` before calling out, so consumers
  never handle updater functions). If it is not passed, internal state is used
  as today, seeded from `initialSorting` / `initialPageSize`.
- Passing a value without its `on…Change` makes it read-only (React semantics);
  a dev-only `console.warn` flags it.
- `manual` maps to `manualSorting`, `manualFiltering`, `manualPagination` all
  `true`, plus `rowCount` / `pageCount`. Manual mode with uncontrolled state is
  allowed (the consumer still gets every change via `on…Change`) but the
  recommended pattern is fully controlled.
- `manual` without `rowCount`/`pageCount` → dev warning; pagination then shows
  "page N" with Next enabled while `data.length === pageSize`.

### Behaviour changes inside DataTable (manual mode only)

| Concern | Client mode (today) | Manual mode |
| --- | --- | --- |
| Rows rendered | sorted → filtered → paginated row model | `data` as given |
| Page reset on sort/filter change | TanStack `autoResetPageIndex` | component emits `onPaginationChange({ pageIndex: 0 })` together with the sort/filter change (TanStack doesn't auto-reset under `manualPagination`) |
| Row count in footer | `getFilteredRowModel().rows.length` | `table.getRowCount()` (= `rowCount`) |
| Selected count | `getFilteredSelectedRowModel()` | `Object.keys(table.state.rowSelection).length` — selection survives paging because rows are keyed by `getRowId` (required in manual mode) |
| "Select all" header checkbox | all filtered rows | current page only (`toggleAllPageRowsSelected`), label unchanged |
| Faceted filter counts | `getFacetedUniqueValues()` | `FacetedOption.count` if the consumer provides it, otherwise no count badge |
| Global filter input | updates state per keystroke | local input state, debounced emit |

`DataTablePagination` switches to `table.getRowCount()` in both modes — in client
mode it falls back to the pre-paginated row count, so output is unchanged
(verify in v9: `table_getRowCount` returns `options.rowCount ?? prePaginated rows`).

Feature set: `dataTableFeatures` stays as is. The client row models are harmless
in manual mode (TanStack skips them when the matching `manual*` flag is set), so
`DataTableColumnDef` keeps working for both modes and no second feature set is
needed.

### Loading state

- `loading && data.length > 0`: keep rows, add `aria-busy="true"` on the table
  container and `opacity-60` on the body; pagination buttons disabled.
- `loading && data.length === 0`: render `pageSize` skeleton rows (shadcn
  `skeleton`, new registryDependency) instead of the empty state.
- Never show `emptyState` while `loading`.

Consumers get the "keep previous page" behaviour by using TanStack Query's
`placeholderData: keepPreviousData` and passing `loading={query.isFetching}`.

### Search-param helpers (new file `data-table-search.ts`, registry:lib-style file in the data-table item)

```ts
// Flat, URL-friendly shape: ?page=2&size=20&sort=-createdAt,name&q=foo&in=email&f.status=active,pending
export const dataTableSearchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  size: z.number().int().catch(10),
  sort: z.string().optional(),          // "-col,col2" → desc/asc
  q: z.string().optional(),             // global filter text
  in: z.string().optional(),            // global filter columns, comma separated
}).catchall(z.string())                 // "f.<columnId>" faceted filters

export function searchToTableState(search: DataTableSearch): DataTableState
export function tableStateToSearch(state: DataTableState): DataTableSearch // omits defaults
```

1-based `page` in the URL, 0-based `pageIndex` in the table. Defaults are omitted
so a pristine table has a clean URL. `zod` is already a dependency of
`admin-page`; the helpers live in the data-table item so plain tables can use them
too (adds `zod` to data-table's dependencies — acceptable, every template app has
it).

### Consumer pattern (TanStack Router + Query + TrailBase)

```tsx
export const Route = createFileRoute("/_authenticated/admin/customers")({
  validateSearch: dataTableSearchSchema,
  component: CustomersPage,
})

function CustomersPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const state = searchToTableState(search)
  const query = useQuery({
    queryKey: ["customers", search],
    queryFn: () => listCustomers(state), // maps to TrailBase: limit, offset, order, filter[..], count=true
    placeholderData: keepPreviousData,
  })
  const set = (patch: Partial<DataTableState>) =>
    navigate({ search: tableStateToSearch({ ...state, ...patch }), replace: true })

  return (
    <AdminPage
      manual
      data={query.data?.records ?? []}
      rowCount={query.data?.total_count}
      loading={query.isFetching}
      sorting={state.sorting} onSortingChange={(sorting) => set({ sorting })}
      pagination={state.pagination} onPaginationChange={(pagination) => set({ pagination })}
      globalFilter={state.globalFilter} onGlobalFilterChange={(globalFilter) => set({ globalFilter })}
      columnFilters={state.columnFilters} onColumnFiltersChange={(columnFilters) => set({ columnFilters })}
      /* columns, schema, form, getRowId, onCreate/onUpdate/onDelete as today */
    />
  )
}
```

`replace: true` for typing/paging keeps history usable; sort and filter changes
could push instead (consumer's choice). After `onCreate`/`onUpdate`/`onDelete`
the consumer invalidates the query; `AdminPage` needs no change for that.

The page reset on sort/filter changes is not in this code: the component emits
`onPaginationChange({ pageIndex: 0, … })` alongside the sort/filter change. To
land both in one navigation, `set` should merge patches within a tick (or the
component can offer a single `onStateChange(next: DataTableState)` — see open
questions).

## AdminPage

No new props of its own: `AdminPageProps` already is
`Omit<DataTableProps, "columns" | "data" | "getRowId"> & …`, so the new props flow
through. Two adjustments:

- the actions column keeps working (it is a display column);
- in manual mode the sheet's "detail/edit" row object comes from the current page
  — fine, as it does today.

## Compatibility

- Without any new prop, the code path is the current one: internal state,
  `initialSorting`, `initialPageSize`, client row models. Existing docs examples
  and the template's admin pages compile and behave unchanged.
- `GlobalFilterValue` moves to `data-table.types.ts` but stays re-exported from
  `data-table-toolbar.tsx`, so existing imports keep compiling.
- Types: all generics keep `TData extends RowData`; the table instance stays
  `ReactTable<DataTableFeatures, TData>`; state is read via `table.state.*`.
- New registry dependencies: `skeleton` (shadcn), `zod` (npm) for the data-table
  item. Consumers re-run `shadcn add @hoogin/data-table --overwrite`.

## Implementation plan

1. Types: `DataTableState`, `GlobalFilterValue` move, `FacetedOption.count?`.
2. `DataTable`: a small `useControllableState(value, onChange, initial)` helper
   (resolves updaters); wire the four states; `manual`, `rowCount`, `pageCount`;
   page reset folded into sort/filter emits; debounced global filter in the toolbar.
3. Pagination/toolbar/faceted filter: `getRowCount()`, manual selection count,
   optional facet counts, disabled while loading.
4. Loading UI (`aria-busy`, dimmed body, skeleton rows).
5. `data-table-search.ts` + unit tests for the search ↔ state round-trip
   (defaults omitted, invalid params caught).
6. Docs: a "Server-side" section on the data-table and admin-page docs pages with
   a fake async source (in-memory array + `setTimeout`) driven by the docs
   route's search params.
7. Verify per AGENTS.md, including `tsc -b` (table types), and test-install into
   a template app with one admin page switched to manual mode against TrailBase.

## Open questions

- Cursor pagination: TrailBase also offers cursors; offset is simpler and matches
  page numbers in the URL. Start with offset; revisit for very large tables.
- Should sorting/filter changes push history entries (`replace: false`)? Leave to
  the consumer; the docs example uses `replace: true` everywhere.
- Server-side facet counts: only if a backend can return them cheaply; the
  optional `count` keeps the door open without requiring it.
- One `onStateChange(state)` callback instead of (or besides) four
  `on…Change` props would make "sort + reset page" a single URL update without
  the consumer merging patches. Leaning towards offering both.
- Multi-sort: keep `enableMultiSort` default (shift-click); the URL format
  (`sort=-a,b`) already supports it.
