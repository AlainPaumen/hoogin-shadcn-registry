import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { toast } from "@/components/ui/toast"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { ValueList } from "@/hoogin/docs/value-list"
import {
  AdminPage,
  type EntityFormProps,
} from "@/hoogin/blocks/admin-page/admin-page"
import type { DataTableColumnDef } from "@/hoogin/ui/data-table/data-table.types"
import { Form, FormBody, FormError, FormFooter } from "@/hoogin/ui/forms/form"
import { isRequiredField } from "@/hoogin/ui/forms/form.utils"
import { FormDateField } from "@/hoogin/ui/forms/form-date.field"
import { FormEmailField } from "@/hoogin/ui/forms/form-email.field"
import { FormNumberField } from "@/hoogin/ui/forms/form-number.field"
import { FormSelectField } from "@/hoogin/ui/forms/form-select.field"
import { FormTextField } from "@/hoogin/ui/forms/form-text.field"
import { BadgeCell } from "@/hoogin/ui/data-table/cells/badge.cell"
import { CurrencyCell } from "@/hoogin/ui/data-table/cells/currency.cell"
import { DateCell } from "@/hoogin/ui/data-table/cells/date.cell"
import { EmailCell } from "@/hoogin/ui/data-table/cells/email.cell"
import { currencyFormatter } from "@/hoogin/ui/data-table/cells/formatters.utils"
import { TextCell } from "@/hoogin/ui/data-table/cells/text.cell"

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

function PaymentForm({
  initialValues,
  readOnly,
  showActions = true,
  error,
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
    <Form form={form} className="flex flex-col gap-4 px-4 pb-4">
      {initialValues ? (
        <FormTextField
          form={form}
          name="id"
          label="Id"
          required={isRequiredField(paymentSchema.shape.id)}
          validators={{ onChange: paymentSchema.shape.id }}
          disabled={readOnly}
        />
      ) : null}
      <FormBody>
        <FormTextField
          form={form}
          name="username"
          label="Username"
          required={isRequiredField(paymentSchema.shape.username)}
          validators={{ onChange: paymentSchema.shape.username }}
          disabled={readOnly}
        />
        <FormEmailField
          form={form}
          name="email"
          label="Email"
          required={isRequiredField(paymentSchema.shape.email)}
          validators={{ onChange: paymentSchema.shape.email }}
          disabled={readOnly}
        />
        <FormSelectField
          form={form}
          name="status"
          label="Status"
          required={isRequiredField(paymentSchema.shape.status)}
          validators={{ onChange: paymentSchema.shape.status }}
          disabled={readOnly}
          options={statuses.map((status) => ({
            value: status,
            label: status,
          }))}
        />
        <FormDateField
          form={form}
          name="createdAt"
          label="Created"
          required={isRequiredField(paymentSchema.shape.createdAt)}
          validators={{ onChange: paymentSchema.shape.createdAt }}
          disabled={readOnly}
        />
        <FormNumberField
          form={form}
          name="amount"
          label="Amount (cents)"
          required={isRequiredField(paymentSchema.shape.amount)}
          validators={{ onChange: paymentSchema.shape.amount }}
          disabled={readOnly}
        />
      </FormBody>
      <FormError form={form} error={error} />
      <FormFooter
        form={form}
        onCancel={onCancel}
        readOnly={readOnly}
        showActions={showActions}
      />
    </Form>
  )
}

function AdminPagePreview() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments)

  const handleCreate = (values: Payment) => {
    const created: Payment = {
      ...values,
      id: `P-${String(payments.length + 1).padStart(3, "0")}`,
    }
    setPayments((prev) => [...prev, created])
    toast.add({
      type: "success",
      title: "Payment created",
      description: (
        <ValueList
          values={{ ...created, amount: currencyFormatter(created.amount) }}
        />
      ),
    })
  }

  const handleUpdate = (row: Payment, values: Payment) => {
    const updated: Payment = { ...values, id: row.id }
    setPayments((prev) =>
      prev.map((payment) => (payment.id === row.id ? updated : payment))
    )
    toast.add({
      type: "success",
      title: "Payment updated",
      description: (
        <ValueList
          values={{ ...updated, amount: currencyFormatter(updated.amount) }}
        />
      ),
    })
  }

  const handleDelete = (row: Payment) => {
    setPayments((prev) => prev.filter((payment) => payment.id !== row.id))
    toast.add({
      title: "Payment deleted",
      description: `Payment ${row.id} (${row.username}) was removed.`,
    })
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
import type { DataTableColumnDef } from "@/hoogin/ui/data-table/data-table.types"
import { TextCell } from "@/hoogin/ui/data-table/cells/text.cell"
import { EmailCell } from "@/hoogin/ui/data-table/cells/email.cell"
import { BadgeCell } from "@/hoogin/ui/data-table/cells/badge.cell"
import { DateCell } from "@/hoogin/ui/data-table/cells/date.cell"
import { CurrencyCell } from "@/hoogin/ui/data-table/cells/currency.cell"

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
import { Form, FormBody, FormError, FormFooter } from "@/hoogin/ui/forms/form"
import { FormTextField } from "@/hoogin/ui/forms/form-text.field"
import { FormEmailField } from "@/hoogin/ui/forms/form-email.field"
import { FormDateField } from "@/hoogin/ui/forms/form-date.field"
import { FormNumberField } from "@/hoogin/ui/forms/form-number.field"
import { FormSelectField } from "@/hoogin/ui/forms/form-select.field"
import { isRequiredField } from "@/hoogin/ui/forms/form.utils"
import type { EntityFormProps } from "@/hoogin/blocks/admin-page/admin-page"
import { paymentSchema } from "./schema"

export function PaymentForm({
  initialValues,
  readOnly,
  showActions,
  error,
  onSubmit,
  onCancel,
}: EntityFormProps<Payment>) {
  const form = useForm({
    defaultValues: initialValues ?? {
      username: "",
      email: "",
      status: "pending",
      createdAt: "",
      amount: 0,
    },
    onSubmit: async ({ value }) => onSubmit(value),
  })

  return (
    <Form form={form}>
      <FormBody>
        <FormTextField
          form={form}
          name="username"
          label="Username"
          required={isRequiredField(paymentSchema.shape.username)}
          validators={{ onChange: paymentSchema.shape.username }}
          disabled={readOnly}
        />
        <FormEmailField
          form={form}
          name="email"
          label="Email"
          required={isRequiredField(paymentSchema.shape.email)}
          validators={{ onChange: paymentSchema.shape.email }}
          disabled={readOnly}
        />
        {/* ...rest of the fields */}
      </FormBody>
      <FormError form={form} error={error} />
      <FormFooter
        form={form}
        onCancel={onCancel}
        readOnly={readOnly}
        showActions={showActions}
      />
    </Form>
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
        description="AdminPage wraps the DataTable, appends an actions column per row, and drives a sheet-based create / detail / edit / delete workflow. You provide the columns, the row data, a zod schema, and a form component built with TanStack Form and the @hoogin form components. The form receives initialValues (undefined when creating), readOnly for detail and delete modes, showActions (false during delete confirmation), error (schema-level failures), and onSubmit / onCancel. During delete confirmation the form renders read-only so the row can be reviewed before the destructive action."
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
              description:
                "Stable id used to identify the row being edited or deleted.",
            },
            {
              prop: "schema",
              type: "z.ZodType<TData>",
              description:
                "Validates submitted values before onCreate / onUpdate fire.",
            },
            {
              prop: "form",
              type: "ComponentType<EntityFormProps<TData>>",
              description:
                "Form component rendered in the sheet. Receives initialValues (undefined when creating), readOnly (detail and delete modes), showActions (false during delete confirmation), error (schema-level failures), onSubmit, and onCancel.",
            },
            {
              prop: "onCreate",
              type: "(values: TData) => void | Promise<void>",
              description:
                "Called with validated values from the create sheet.",
            },
            {
              prop: "onUpdate",
              type: "(row: TData, values: TData) => void | Promise<void>",
              description:
                "Called with the original row and validated values from the edit sheet.",
            },
            {
              prop: "onDelete",
              type: "(row: TData) => void | Promise<void>",
              description: "Called after confirming the delete sheet.",
            },
            {
              prop: "entityName",
              type: "string",
              description:
                'Used in the New button and sheet headings, e.g. "payment". Defaults to "record".',
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
