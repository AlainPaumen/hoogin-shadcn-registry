"use client"

import { useMemo, useState } from "react"
import type { ComponentType } from "react"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ActionCell } from "@/hoogin/ui/action.cell"
import { DataTable } from "@/hoogin/ui/data-table"
import type { DataTableProps } from "@/hoogin/ui/data-table"
import type { DataTableColumnDef } from "@/hoogin/ui/data-table.types"

export type EntityFormProps<TData> = {
  initialValues?: TData
  readOnly?: boolean
  showActions?: boolean
  onSubmit: (values: TData) => void | Promise<void>
  onCancel: () => void
}

type SheetState<TData> =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "detail"; row: TData }
  | { mode: "edit"; row: TData }
  | { mode: "delete"; row: TData }

export type AdminPageProps<TData> = Omit<
  DataTableProps<TData, unknown>,
  "columns" | "data" | "getRowId"
> & {
  title?: string
  description?: string
  entityName?: string
  columns: DataTableColumnDef<TData>[]
  data: TData[]
  getRowId: (row: TData) => string
  schema: z.ZodType<TData>
  form: ComponentType<EntityFormProps<TData>>
  onCreate: (values: TData) => void | Promise<void>
  onUpdate: (row: TData, values: TData) => void | Promise<void>
  onDelete: (row: TData) => void | Promise<void>
}

export function AdminPage<TData>({
  title,
  description,
  entityName = "record",
  columns,
  data,
  getRowId,
  schema,
  form: Form,
  onCreate,
  onUpdate,
  onDelete,
  ...tableProps
}: AdminPageProps<TData>) {
  const [sheetState, setSheetState] = useState<SheetState<TData>>({ mode: "closed" })
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const isOpen = sheetState.mode !== "closed"
  const isDelete = sheetState.mode === "delete"
  const readOnly = sheetState.mode === "detail" || isDelete

  function close() {
    setSheetState({ mode: "closed" })
    setError(null)
    setPending(false)
  }

  async function handleSubmit(values: TData) {
    if (sheetState.mode !== "create" && sheetState.mode !== "edit") return
    const result = schema.safeParse(values)
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid values.")
      return
    }
    try {
      setPending(true)
      if (sheetState.mode === "create") {
        await onCreate(values)
      } else {
        await onUpdate(sheetState.row, values)
      }
      close()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.")
      setPending(false)
    }
  }

  async function handleDelete() {
    if (sheetState.mode !== "delete") return
    try {
      setPending(true)
      await onDelete(sheetState.row)
      close()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.")
      setPending(false)
    }
  }

  const actionsColumn = useMemo<DataTableColumnDef<TData, unknown>>(
    () => ({
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ActionCell
            onDetail={() => setSheetState({ mode: "detail", row: row.original })}
            onEdit={() => setSheetState({ mode: "edit", row: row.original })}
            onDelete={() => setSheetState({ mode: "delete", row: row.original })}
          />
        </div>
      ),
    }),
    []
  )

  const allColumns = useMemo(
    () => [...columns, actionsColumn],
    [columns, actionsColumn]
  )

  const heading = isDelete
    ? `Delete ${entityName}?`
    : sheetState.mode === "create"
      ? `New ${entityName}`
      : sheetState.mode === "detail"
        ? `${entityName} details`
        : `Edit ${entityName}`

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          {title ? (
            <h1 className="font-heading text-xl font-medium">{title}</h1>
          ) : null}
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <Button onClick={() => setSheetState({ mode: "create" })}>
          New {entityName}
        </Button>
      </div>
      <DataTable
        {...tableProps}
        columns={allColumns}
        data={data}
        getRowId={getRowId}
      />
      <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{heading}</SheetTitle>
            {isDelete ? (
              <SheetDescription>This action cannot be undone.</SheetDescription>
            ) : null}
          </SheetHeader>
          {sheetState.mode === "closed" ? null : (
            <Form
              initialValues={
                sheetState.mode === "create" ? undefined : sheetState.row
              }
              readOnly={readOnly}
              showActions={!isDelete}
              onSubmit={handleSubmit}
              onCancel={close}
            />
          )}
          {isDelete ? (
            <p className="px-4 text-sm">
              Are you sure you want to delete this {entityName}?
            </p>
          ) : null}
          {error ? (
            <p className="px-4 text-sm text-destructive">{error}</p>
          ) : null}
          {isDelete ? (
            <SheetFooter>
              <Button variant="outline" onClick={close} disabled={pending}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={pending}
              >
                Delete
              </Button>
            </SheetFooter>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
