import { useState } from "react"
import type { ReactNode } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import {
  AdminPage,
  type EntityFormProps,
} from "@/hoogin/blocks/admin-page/admin-page"
import type { DataTableColumnDef } from "@/hoogin/ui/data-table.types"
import { BadgeCell } from "@/hoogin/ui/badge.cell"
import { CurrencyCell } from "@/hoogin/ui/currency.cell"
import { DateCell } from "@/hoogin/ui/date.cell"
import { EmailCell } from "@/hoogin/ui/email.cell"
import { TextCell } from "@/hoogin/ui/text.cell"

export const Route = createFileRoute("/docs/blocks/admin-page")({
  component: AdminPagePage,
})

const statuses = ["active", "pending", "refunded", "cancelled"] as const

type PaymentStatus = (typeof statuses)[number]

type Payment = {
  id: string
  username: string
  email: string
  status: PaymentStatus
  createdAt: string
  amount: number
}

const paymentSchema = z.object({
  id: z.string().min(1, "Required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  status: z.enum(statuses),
  createdAt: z.string().min(1, "Required"),
  amount: z.number().positive("Amount must be greater than zero"),
})

const initialPayments: Payment[] = Array.from({ length: 15 }, (_, i) => ({
  id: `P-${String(i + 1).padStart(3, "0")}`,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: statuses[i % statuses.length],
  createdAt: new Date(Date.UTC(2025, 0, 1 + i)).toISOString().slice(0, 10),
  amount: (((i * 137) % 95) + 5) * 100,
}))

const columns: DataTableColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => <TextCell value={row.getValue("id")} />,
  },
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

function fieldErrorMessage(error: unknown): string {
  if (typeof error === "string") return error
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message: unknown }).message
    if (typeof message === "string") return message
    if (Array.isArray(message)) return message.map(fieldErrorMessage).join(", ")
  }
  return "Invalid value"
}

const isRequired = (field: keyof typeof paymentSchema.shape) =>
  !paymentSchema.shape[field].isOptional()

function FieldShell({
  label,
  errors,
  required = false,
  children,
}: {
  label: string
  errors: readonly unknown[]
  required?: boolean
  children: ReactNode
}) {
  const messages = errors.map(fieldErrorMessage)
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">
        {label}
        {required ? <span > *</span> : null}
      </label>
      {children}
      {messages.length > 0 ? (
        <p className="text-sm text-destructive">{messages.join(", ")}</p>
      ) : null}
    </div>
  )
}

function PaymentForm({
  initialValues,
  readOnly,
  showActions = true,
  onSubmit,
  onCancel,
}: EntityFormProps<Payment>) {
  const form = useForm({
    defaultValues: (initialValues ?? {
      id: "",
      username: "",
      email: "",
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 10),
      amount: 0,
    }) satisfies Payment,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-4 px-4 pb-4"
    >
      {initialValues ? (
        <form.Field
          name="id"
          validators={{ onChange: paymentSchema.shape.id }}
        >
          {(field) => (
            <FieldShell
              label="Id"
              required={isRequired("id")}
              errors={
                field.state.meta.isTouched ? field.state.meta.errors : []
              }
            >
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                disabled={readOnly}
              />
            </FieldShell>
          )}
        </form.Field>
      ) : null}
      <form.Field
        name="username"
        validators={{ onChange: paymentSchema.shape.username }}
      >
        {(field) => (
          <FieldShell
              label="Username"
              required={isRequired("username")}
              errors={
              field.state.meta.isTouched ? field.state.meta.errors : []
            }
          >
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
              disabled={readOnly}
            />
          </FieldShell>
        )}
      </form.Field>
      <form.Field
        name="email"
        validators={{ onChange: paymentSchema.shape.email }}
      >
        {(field) => (
          <FieldShell
              label="Email"
              required={isRequired("email")}
              errors={
              field.state.meta.isTouched ? field.state.meta.errors : []
            }
          >
            <Input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
              disabled={readOnly}
            />
          </FieldShell>
        )}
      </form.Field>
      <form.Field
        name="status"
        validators={{ onChange: paymentSchema.shape.status }}
      >
        {(field) => (
          <FieldShell
              label="Status"
              required={isRequired("status")}
              errors={
              field.state.meta.isTouched ? field.state.meta.errors : []
            }
          >
            <Select
              value={field.state.value}
              onValueChange={(value) =>
                field.handleChange(value as PaymentStatus)
              }
              onOpenChange={() => field.handleBlur()}
              disabled={readOnly}
              items={statuses.map((status) => ({ value: status, label: status }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status} label={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldShell>
        )}
      </form.Field>
      <form.Field
        name="createdAt"
        validators={{ onChange: paymentSchema.shape.createdAt }}
      >
        {(field) => (
          <FieldShell
              label="Created"
              required={isRequired("createdAt")}
              errors={
              field.state.meta.isTouched ? field.state.meta.errors : []
            }
          >
            <Input
              id={field.name}
              name={field.name}
              type="date"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
              disabled={readOnly}
            />
          </FieldShell>
        )}
      </form.Field>
      <form.Field
        name="amount"
        validators={{ onChange: paymentSchema.shape.amount }}
      >
        {(field) => (
          <FieldShell
              label="Amount (cents)"
              required={isRequired("amount")}
              errors={
              field.state.meta.isTouched ? field.state.meta.errors : []
            }
          >
            <Input
              id={field.name}
              name={field.name}
              type="number"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.valueAsNumber)}
              onBlur={field.handleBlur}
              disabled={readOnly}
            />
          </FieldShell>
        )}
      </form.Field>
      {showActions ? (
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {readOnly ? "Close" : "Cancel"}
          </Button>
          {!readOnly ? (
            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              )}
            </form.Subscribe>
          ) : null}
        </div>
      ) : null}
    </form>
  )
}

function AdminPagePreview() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments)

  const handleCreate = (values: Payment) => {
    setPayments((prev) => [
      ...prev,
      { ...values, id: `P-${String(prev.length + 1).padStart(3, "0")}` },
    ])
  }

  const handleUpdate = (row: Payment, values: Payment) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === row.id ? { ...values, id: row.id } : payment
      )
    )
  }

  const handleDelete = (row: Payment) => {
    setPayments((prev) => prev.filter((payment) => payment.id !== row.id))
  }

  return (
    <AdminPage
      title="Payments"
      description="Manage payment records."
      entityName="payment"
      columns={columns}
      data={payments}
      getRowId={(row) => row.id}
      schema={paymentSchema}
      form={PaymentForm}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      filterableColumns={[
        { caption: "Id", column: "id" },
        { caption: "Username", column: "username" },
        { caption: "Email", column: "email" },
      ]}
      filters={[
        {
          columnId: "status",
          title: "Status",
          options: statuses.map((status) => ({
            label: status,
            value: status,
          })),
        },
      ]}
      filterPlaceholder="Search payments..."
      initialPageSize={5}
    />
  )
}

const usageSource = `// admin/columns.tsx
import type { DataTableColumnDef } from "@/hoogin/ui/data-table.types"
import { TextCell } from "@/hoogin/ui/text.cell"
import { EmailCell } from "@/hoogin/ui/email.cell"
import { BadgeCell } from "@/hoogin/ui/badge.cell"
import { DateCell } from "@/hoogin/ui/date.cell"
import { CurrencyCell } from "@/hoogin/ui/currency.cell"

export const columns: DataTableColumnDef<Payment>[] = [
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
  // ...
]

// admin/schema.ts
import { z } from "zod"

export const paymentSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  status: z.enum(["active", "pending", "refunded", "cancelled"]),
  createdAt: z.string().min(1),
  amount: z.number().positive(),
})

// admin/form.tsx
import { useForm } from "@tanstack/react-form"
import { Input } from "@/components/ui/input"
import type { EntityFormProps } from "@/hoogin/blocks/admin-page/admin-page"

export function PaymentForm({
  initialValues,
  readOnly,
  onSubmit,
  onCancel,
}: EntityFormProps<Payment>) {
  const form = useForm({
    defaultValues: initialValues ?? { username: "", email: "", status: "pending", createdAt: "", amount: 0 },
    onSubmit: async ({ value }) => onSubmit(value),
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="username"
        validators={{ onChange: paymentSchema.shape.username }}
      >
        {(field) => (
          <Input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            disabled={readOnly}
          />
        )}
      </form.Field>
      {/* ...rest of the fields */}
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit })}>
        {({ canSubmit }) => (
          <Button type="submit" disabled={!canSubmit}>
            Save
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}

// admin/page.tsx
import { AdminPage } from "@/hoogin/blocks/admin-page/admin-page"
import { columns } from "./columns"
import { paymentSchema } from "./schema"
import { PaymentForm } from "./form"

export function AdminPage() {
  return (
    <AdminPage
      title="Payments"
      entityName="payment"
      columns={columns}
      data={payments}
      getRowId={(row) => row.id}
      schema={paymentSchema}
      form={PaymentForm}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  )
}`

function AdminPagePage() {
  return (
    <ComponentDoc name="admin-page">
      <DocSection title="Preview">
        <Preview>
          <AdminPagePreview />
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="AdminPage wraps the DataTable, appends an actions column per row, and drives a sheet-based create / detail / edit / delete workflow. You provide the columns, the row data, a zod schema, and a form component built with TanStack Form. The form receives initialValues (undefined when creating), readOnly for detail and delete modes, showActions (false during delete confirmation), and onSubmit / onCancel. During delete confirmation the form renders read-only so the row can be reviewed before the destructive action."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection
        title="Notes"
        description="The page is controlled: it never mutates the data itself. Call onCreate / onUpdate / onDelete to persist changes. The schema is used as a safety net before each create or update — submitted values that fail validation keep the sheet open with an inline error."
      >
        <p className="text-sm text-muted-foreground">
          Pass getRowId so rows are tracked by a stable key. Any DataTable prop
          (filters, filterableColumns, pagination, selection, ...) can be
          forwarded through AdminPage.
        </p>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              prop: "columns",
              type: "DataTableColumnDef<TData>[]",
              description: "Column definitions rendered by the data table.",
            },
            {
              prop: "data",
              type: "TData[]",
              description: "The rows to display.",
            },
            {
              prop: "getRowId",
              type: "(row: TData) => string",
              description: "Stable id used to identify the row being edited or deleted.",
            },
            {
              prop: "schema",
              type: "z.ZodType<TData>",
              description: "Validates submitted values before onCreate / onUpdate fire.",
            },
            {
              prop: "form",
              type: "ComponentType<EntityFormProps<TData>>",
              description: "Form component rendered in the sheet. Receives initialValues (undefined when creating), readOnly (detail mode), onSubmit, and onCancel.",
            },
            {
              prop: "onCreate",
              type: "(values: TData) => void | Promise<void>",
              description: "Called with validated values from the create sheet.",
            },
            {
              prop: "onUpdate",
              type: "(row: TData, values: TData) => void | Promise<void>",
              description: "Called with the original row and validated values from the edit sheet.",
            },
            {
              prop: "onDelete",
              type: "(row: TData) => void | Promise<void>",
              description: "Called after confirming the delete sheet.",
            },
            {
              prop: "entityName",
              type: "string",
              description: "Used in the New button and sheet headings, e.g. \"payment\". Defaults to \"record\".",
            },
            {
              prop: "title",
              type: "string",
              description: "Optional heading above the data table.",
            },
            {
              prop: "description",
              type: "string",
              description: "Optional subtitle below the heading.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
