import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { DataTable } from "@/hoogin/ui/data-table/data-table"
import type { DataTableColumnDef } from "@/hoogin/ui/data-table/data-table.types"
import { CurrencyCell } from "@/hoogin/ui/data-table/cells/currency.cell"
import { DateCell } from "@/hoogin/ui/data-table/cells/date.cell"
import { EmailCell } from "@/hoogin/ui/data-table/cells/email.cell"
import { TextCell } from "@/hoogin/ui/data-table/cells/text.cell"
import { BadgeCell } from "@/hoogin/ui/data-table/cells/badge.cell"

export const Route = createFileRoute("/docs/components/data-table")({
  component: DataTablePage,
})

const statuses = ["active", "pending", "refunded", "cancelled"] as const

type Status = (typeof statuses)[number]

const priorities = ["high", "medium", "low"] as const

type Priority = (typeof priorities)[number]

type Payment = {
  id: string
  username: string
  email: string
  status: Status
  priority: Priority
  createdAt: string
  amount: number
}

const payments: Payment[] = Array.from({ length: 40 }, (_, i) => ({
  id: `P-${String(i + 1).padStart(3, "0")}`,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: statuses[i % statuses.length],
  priority: priorities[i % priorities.length],
  createdAt: new Date(Date.UTC(2025, 0, 1 + i)).toISOString(),
  amount: (((i * 137) % 95) + 5) * 100,
}))

const columns: DataTableColumnDef<Payment>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <TextCell value={row.getValue("username")} />,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <EmailCell value={row.getValue("email")} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue || filterValue.length === 0) return true
      return filterValue.includes(row.getValue(columnId))
    },
    cell: ({ row }) => (
      <BadgeCell
        value={row.getValue("status")}
        variantByValue={{
          active: "default",
          pending: "secondary",
          refunded: "outline",
          cancelled: "destructive",
        }}
      />
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue || filterValue.length === 0) return true
      return filterValue.includes(row.getValue(columnId))
    },
    cell: ({ row }) => (
      <BadgeCell
        value={row.getValue("priority")}
        variantByValue={{
          high: "destructive",
          medium: "secondary",
          low: "outline",
        }}
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <CurrencyCell value={row.getValue("amount")} />,
  },
]

const columnsSource = `// columns.tsx
import type { DataTableColumnDef } from "@/hoogin/ui/data-table/data-table.types"
import { TextCell } from "@/hoogin/ui/data-table/cells/text.cell"
import { EmailCell } from "@/hoogin/ui/data-table/cells/email.cell"
import { DateCell } from "@/hoogin/ui/data-table/cells/date.cell"
import { CurrencyCell } from "@/hoogin/ui/data-table/cells/currency.cell"
import { BadgeCell } from "@/hoogin/ui/data-table/cells/badge.cell"

export const columns: DataTableColumnDef<Payment>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <TextCell value={row.getValue("username") || "-"} />
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <EmailCell value={row.getValue("email")} />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue || filterValue.length === 0) return true
      return filterValue.includes(row.getValue(columnId))
    },
    cell: ({ row }) => (
      <BadgeCell
        value={row.getValue("status")}
        variantByValue={{
          active: "default",
          pending: "secondary",
          refunded: "outline",
          cancelled: "destructive",
        }}
      />
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue || filterValue.length === 0) return true
      return filterValue.includes(row.getValue(columnId))
    },
    cell: ({ row }) => (
      <BadgeCell
        value={row.getValue("priority")}
        variantByValue={{
          high: "destructive",
          medium: "secondary",
          low: "outline",
        }}
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <DateCell value={row.getValue("createdAt")} />
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <CurrencyCell value={row.getValue("amount")} />
    ),
  },
]`

const usageSource = `// app.tsx
import { DataTable } from "@/hoogin/ui/data-table/data-table"
import { columns } from "./columns"

export function App() {
  return (
    <DataTable
      columns={columns}
      data={payments}
      filterableColumns={[
        { caption: "Username", column: "username" },
        { caption: "Email", column: "email" },
        { caption: "Amount", column: "amount"}
      ]}
      filters={[
        {
          columnId: "status",
          title: "Status",
          options: [
            { label: "Active", value: "active" },
            { label: "Pending", value: "pending" },
            { label: "Refunded", value: "refunded" },
            { label: "Cancelled", value: "cancelled" },
          ],
        },
        {
          columnId: "priority",
          title: "Priority",
          options: [
            { label: "High", value: "high" },
            { label: "Medium", value: "medium" },
            { label: "Low", value: "low" },
          ],
        },
      ]}
      filterPlaceholder="Search payments..."
      enableRowSelection
      initialPageSize={10}
    />
  )
}`

function DataTablePage() {
  return (
    <ComponentDoc name="data-table">
      <DocSection title="Preview">
        <Preview>
          <DataTable
            columns={columns}
            data={payments}
            filterableColumns={[
              { caption: "Username", column: "username" },
              { caption: "Email", column: "email" },
              { caption: "Amount", column: "amount"}
            ]}
            filters={[
              {
                columnId: "status",
                title: "Status",
                options: [
                  { label: "Active", value: "active" },
                  { label: "Pending", value: "pending" },
                  { label: "Refunded", value: "refunded" },
                  { label: "Cancelled", value: "cancelled" },
                ],
              },
              {
                columnId: "priority",
                title: "Priority",
                options: [
                  { label: "High", value: "high" },
                  { label: "Medium", value: "medium" },
                  { label: "Low", value: "low" },
                ],
              },
            ]}
            filterPlaceholder="Search payments..."
            enableRowSelection
            initialPageSize={10}
          />
        </Preview>
      </DocSection>
      <DocSection
        title="Single column filter"
        description="With only one filterable column the column picker is omitted and the search input spans the toolbar."
      >
        <Preview title="Single column filter">
          <DataTable
            columns={columns}
            data={payments}
            filterableColumns={[{ caption: "Email", column: "email" }]}
            filters={[
              {
                columnId: "status",
                title: "Status",
                options: [
                  { label: "Active", value: "active" },
                  { label: "Pending", value: "pending" },
                  { label: "Refunded", value: "refunded" },
                  { label: "Cancelled", value: "cancelled" },
                ],
              },
              {
                columnId: "priority",
                title: "Priority",
                options: [
                  { label: "High", value: "high" },
                  { label: "Medium", value: "medium" },
                  { label: "Low", value: "low" },
                ],
              },
            ]}
            filterPlaceholder="Search email..."
            initialPageSize={10}
          />
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="Define your columns as DataTableColumnDef objects in a separate file, then pass them along with your data to the DataTable component. The toolbar filters while you type and lets you pick which columns to search across. Pass filterableColumns to limit the searchable columns and set their display captions. Pass filters to render faceted filters (e.g. status) above the search row."
      >
        <CodeBlock language="tsx" code={columnsSource} />
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection
        title="Usage"
        description="Define your columns as DataTableColumnDef objects in a separate file, then pass them along with your data to the DataTable component. The toolbar filters while you type and lets you pick which columns to search across. Pass filterableColumns to limit the searchable columns."
      >
        <CodeBlock language="tsx" code={columnsSource} />
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection
        title="Notes"
        description="Keep the columns array and data array referentially stable (module scope or useMemo) so the table does not re-render on every state change."
      >
        <p className="text-sm text-muted-foreground">
          Sorting, pagination, and row selection are all handled client-side by
          TanStack Table. Reuse the same <code className="font-mono">columns</code>{" "}
          reference between renders to avoid churn.
        </p>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              prop: "columns",
              type: "DataTableColumnDef<TData, TValue>[]",
              description:
                "Column definitions with an accessorKey, header, and cell. Extends TanStack Table ColumnDef.",
            },
            {
              prop: "data",
              type: "TData[]",
              description: "The rows to display. Sortable and paginated client-side.",
            },
            {
              prop: "filterableColumns",
              type: "FilterableColumn[]",
              description:
                "Columns offered in the toolbar's column picker and searched when \"All columns\" is selected. Each entry sets the picker caption ({ caption, column }). Defaults to every visible data column.",
            },
            {
              prop: "filterPlaceholder",
              type: "string",
              description: "Placeholder for the toolbar's filter input. Defaults to \"Filter...\".",
            },
            {
              prop: "filters",
              type: "FacetedFilter[]",
              description:
                "Faceted filters rendered in a row above the search row. Each entry declares a columnId, a title, and the options ({ label, value, icon? }) shown with checkboxes. Requires the target column to have a matching filterFn.",
            },
            {
              prop: "initialSorting",
              type: "SortingState",
              description: "Initial sorting state. Defaults to [].",
            },
            {
              prop: "initialPageSize",
              type: "number",
              description: "Initial page size. Defaults to 10.",
            },
            {
              prop: "pageSizeOptions",
              type: "number[]",
              description: "Choices for the rows-per-page select. Defaults to [10, 20, 50, 100].",
            },
            {
              prop: "enableRowSelection",
              type: "boolean",
              description:
                "Prepend a selectable checkbox column and show a selected-row count. Defaults to false.",
            },
            {
              prop: "getRowId",
              type: "(row: TData) => string",
              description:
                "Stable row id for selection across pages. Defaults to the row index.",
            },
            {
              prop: "emptyState",
              type: "ReactNode",
              description: "Rendered when there are no rows. Defaults to \"No results.\".",
            },
            {
              prop: "className",
              type: "string",
              description: "Tailwind classes for the outer wrapper.",
            },
            {
              prop: "tableProps",
              type: "ComponentProps<typeof Table>",
              description: "Native table element props forwarded to the underlying Table.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
