import { useMemo } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { flexRender, useTable } from "@tanstack/react-table"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DataTableColumnDef } from "@/hoogin/ui/data-table/data-table.types"
import { dataTableFeatures } from "@/hoogin/ui/data-table/data-table.types"
import { DataTableViewOptions } from "@/hoogin/ui/data-table/data-table-view-options"

export const Route = createFileRoute("/docs/components/data-table-view-options")(
  {
    component: DataTableViewOptionsPage,
  }
)

type Person = {
  name: string
  role: string
  email: string
}

const usageSource = `// The DataTable component includes view options by default:
import { DataTable } from "@/hoogin/ui/data-table/data-table"

<DataTable columns={columns} data={data} />

// Use it standalone with any TanStack Table instance:
import { DataTableViewOptions } from "@/hoogin/ui/data-table/data-table-view-options"

<DataTableViewOptions table={table} />`

function ViewOptionsPreview() {
  const columns = useMemo<DataTableColumnDef<Person>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "role", header: "Role" },
      { accessorKey: "email", header: "Email" },
    ],
    []
  )

  const data = useMemo<Person[]>(
    () => [
      { name: "Ada Lovelace", role: "Engineer", email: "ada@example.com" },
      { name: "Grace Hopper", role: "Admiral", email: "grace@example.com" },
      { name: "Alan Turing", role: "Researcher", email: "alan@example.com" },
    ],
    []
  )

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
  })

  return (
    <div className="space-y-3">
      <div className="flex">
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function DataTableViewOptionsPage() {
  return (
    <ComponentDoc name="data-table-view-options">
      <DocSection title="Preview">
        <Preview>
          <ViewOptionsPreview />
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="A dropdown to show or hide table columns. Rendered above the table (right aligned) as part of DataTable, or used standalone with any TanStack Table instance."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              prop: "table",
              type: "Table<TData>",
              description: "The TanStack Table instance used to toggle column visibility.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
