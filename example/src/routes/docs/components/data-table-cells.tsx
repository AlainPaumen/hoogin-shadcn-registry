import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { BadgeCell } from "@/hoogin/ui/data-table/cells/badge.cell"
import { ActionCell } from "@/hoogin/ui/data-table/cells/action.cell"
import { CheckboxCell } from "@/hoogin/ui/data-table/cells/checkbox.cell"
import { CurrencyCell } from "@/hoogin/ui/data-table/cells/currency.cell"
import { DateCell } from "@/hoogin/ui/data-table/cells/date.cell"
import { EmailCell } from "@/hoogin/ui/data-table/cells/email.cell"
import { TextCell } from "@/hoogin/ui/data-table/cells/text.cell"

export const Route = createFileRoute("/docs/components/data-table-cells")({
  component: DataTableCellsPage,
})

const usageSource = `// columns.tsx
import type { DataTableColumnDef } from "@/hoogin/ui/data-table/data-table.types"
import { TextCell } from "@/hoogin/ui/data-table/cells/text.cell"
import { EmailCell } from "@/hoogin/ui/data-table/cells/email.cell"
import { DateCell } from "@/hoogin/ui/data-table/cells/date.cell"
import { CurrencyCell } from "@/hoogin/ui/data-table/cells/currency.cell"
import { CheckboxCell } from "@/hoogin/ui/data-table/cells/checkbox.cell"
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
    cell: ({ row }) => <EmailCell value={row.getValue("email")} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <BadgeCell
        value={row.getValue("status")}
        variantByValue={{
          pending: "secondary",
          success: "default",
          failed: "destructive",
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
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => <CheckboxCell value={row.getValue("isActive")} />,
  },
]`

function DataTableCellsPage() {
  return (
    <ComponentDoc name="data-table-cells">
      <DocSection title="Preview">
        <Preview>
          <div className="flex flex-col gap-4">
            <TextCell value="jane.doe" />
            <EmailCell value="jane.doe@example.com" />
            <DateCell value="2025-01-15" />
            <CurrencyCell value={12500} />
            <div className="flex items-center gap-4">
              <CheckboxCell value={true} />
              <CheckboxCell value={false} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <BadgeCell value="pending" />
              <BadgeCell
                value="success"
                variantByValue={{ success: "default" }}
              />
              <BadgeCell
                value="failed"
                variantByValue={{ failed: "destructive" }}
              />
            </div>
            <ActionCell />
          </div>
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="Cells render a single typed value inside a table column. Each component wraps the shared FormattedCell and applies a formatter and alignment."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection
        title="Formatting"
        description="DateCell formats with VITE_DATE_FORMAT (default YYYY/MM/DD) and CurrencyCell with VITE_CURRENCY_SYMBOL (default $). Values are expected in cents."
      >
        <p className="text-sm text-muted-foreground">
          Amounts are stored in cents and divided by 100 for display. The
          date format supports <code className="font-mono">YYYY</code>,{" "}
          <code className="font-mono">MM</code>, and{" "}
          <code className="font-mono">DD</code> tokens.
        </p>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              prop: "value",
              type: "string",
              description: "The raw value to display. Applies to TextCell, EmailCell, and DateCell.",
            },
            {
              prop: "value",
              type: "number",
              description: "Amount in cents for CurrencyCell.",
            },
            {
              prop: "value",
              type: "boolean | undefined",
              description: "Boolean for CheckboxCell. True renders checked, false or empty renders unchecked.",
            },
            {
              prop: "value",
              type: "string",
              description: "The value from the select list to display in a badge for BadgeCell.",
            },
            {
              prop: "variant",
              type: "BadgeVariant",
              description: "Badge variant for BadgeCell. Defaults to \"secondary\".",
            },
            {
              prop: "variantByValue",
              type: "Record<string, BadgeVariant>",
              description: "Maps specific values to a badge variant, e.g. { success: \"default\", failed: \"destructive\" }.",
            },
            {
              prop: "format",
              type: "(value: T) => ReactNode",
              description: "Optional formatter on FormattedCell. Defaults to rendering the value as-is.",
            },
            {
              prop: "align",
              type: "\"left\" | \"right\" | \"center\"",
              description: "Alignment on FormattedCell. Defaults to \"left\".",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
