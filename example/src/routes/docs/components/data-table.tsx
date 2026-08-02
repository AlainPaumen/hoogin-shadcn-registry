import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { DataTable } from "@/hoogin/ui/data-table"
import type { DataTableColumnDef } from "@/hoogin/ui/data-table.types"
import { CurrencyCell } from "@/hoogin/ui/currency.cell"
import { DateCell } from "@/hoogin/ui/date.cell"
import { EmailCell } from "@/hoogin/ui/email.cell"
import { TextCell } from "@/hoogin/ui/text.cell"

export const Route = createFileRoute("/docs/components/data-table")({
  component: DataTablePage,
})

type Payment = {
  id: string
  username: string
  email: string
  createdAt: string
  amount: number
}

const payments: Payment[] = Array.from({ length: 40 }, (_, i) => ({
  id: `P-${String(i + 1).padStart(3, "0")}`,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
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
import type { DataTableColumnDef } from "@/hoogin/ui/data-table.types"
import { TextCell } from "@/hoogin/ui/text.cell"
import { EmailCell } from "@/hoogin/ui/email.cell"
import { DateCell } from "@/hoogin/ui/date.cell"
import { CurrencyCell } from "@/hoogin/ui/currency.cell"

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
import { DataTable } from "@/hoogin/ui/data-table"
import { columns } from "./columns"

export function App() {
  return (
    <DataTable
      columns={columns}
      data={payments}
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
            enableRowSelection
            initialPageSize={10}
          />
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="Define your columns as DataTableColumnDef objects in a separate file, then pass them along with your data to the DataTable component."
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
