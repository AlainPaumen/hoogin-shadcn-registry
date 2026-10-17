---
name: hgn-building-admin-pages
description: Use when building or changing a CRUD admin page — a list of records with create, view, edit and delete in a side sheet — with the @hoogin AdminPage block, or when writing the entity form an AdminPage renders (EntityFormProps). Builds on hgn-building-data-tables (columns, cells, filters) and hgn-building-forms (fields, validation).
user-invocable: true
---

# Building admin pages

`@hoogin/admin-page` is a page-sized block: a title, a "New …" button, a
`DataTable` with an actions column, and a sheet that shows your entity form to
create, view, edit or delete a record. You supply columns, a zod schema, a form
component and three async callbacks.

## Contents

- [Requires](#requires)
- [Setup](#setup)
- [Recipe](#recipe)
- [AdminPage props](#adminpage-props)
- [The entity form](#the-entity-form)
- [How the flows work](#how-the-flows-work)
- [Rules](#rules)
- [Limits](#limits)
- [Troubleshooting](#troubleshooting)

---

## Requires

- The `hgn-building-data-tables` skill for columns and cells, and the
  `hgn-building-forms` skill for the form's fields and validation — this skill
  only covers what AdminPage adds.
- `zod` v4, TanStack Form v1, Paraglide JS messages.

## Setup

```bash
bunx --bun shadcn@latest add @hoogin/admin-page
```

Lands in `src/hoogin/blocks/admin-page/` and pulls `@hoogin/data-table`,
`@hoogin/data-table-cells` and `sheet`. Install `@hoogin/form-fields` too for
the entity form. This skill installs to
`.opencode/skills/hgn-building-admin-pages/`. Never edit `src/hoogin/`.

## Recipe

Four pieces: schema, columns, form, page.

```tsx
// schema
import { z } from "zod"
import { m } from "@/paraglide/messages.js"

export const noteSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, m.notes_required()),
  body: z.string(),
})
export type NoteRow = z.infer<typeof noteSchema>
export const EMPTY_NOTE: NoteRow = { title: "", body: "" }
```

```tsx
// columns — see hgn-building-data-tables
export const noteColumns: DataTableColumnDef<NoteRow>[] = [
  {
    accessorKey: "title",
    header: m.notes_noteTitle(),
    cell: ({ row }) => <TextCell value={row.original.title} />,
  },
]
```

```tsx
// form
import { useForm } from "@tanstack/react-form"
import type { EntityFormProps } from "@/hoogin/blocks/admin-page/admin-page"
import { Form, FormBody, FormError, FormFooter } from "@/hoogin/ui/forms/form"
import { FormTextareaField } from "@/hoogin/ui/forms/form-textarea.field"
import { FormTextField } from "@/hoogin/ui/forms/form-text.field"
import { isRequiredField } from "@/hoogin/ui/forms/form.utils"

export function NoteForm({
  initialValues,
  readOnly,
  showActions = true,
  error,
  onSubmit,
  onCancel,
}: EntityFormProps<NoteRow>) {
  const form = useForm({
    defaultValues: initialValues ?? EMPTY_NOTE,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <Form form={form} className="flex flex-col gap-4 px-4 pb-4">
      <FormBody>
        <FormTextField
          form={form}
          name="title"
          label={m.notes_noteTitle()}
          disabled={readOnly}
          required={isRequiredField(noteSchema.shape.title)}
          validators={{ onChange: noteSchema.shape.title }}
        />
        <FormTextareaField
          form={form}
          name="body"
          label={m.notes_body()}
          rows={8}
          disabled={readOnly}
          validators={{ onChange: noteSchema.shape.body }}
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
```

```tsx
// page
import { AdminPage } from "@/hoogin/blocks/admin-page/admin-page"

<AdminPage
  title={m.notes_title()}
  description={m.notes_description()}
  entityName={m.notes_entity()}
  columns={noteColumns}
  data={notes}
  getRowId={(row) => String(row.id)}
  schema={noteSchema}
  form={NoteForm}
  emptyState={m.notes_empty()}
  onCreate={(values) => createNote(values)}
  onUpdate={(row, values) => updateNote(row.id!, values)}
  onDelete={(row) => deleteNote(row.id!)}
/>
```

## AdminPage props

| Prop | Type | Notes |
| --- | --- | --- |
| `columns` | `DataTableColumnDef<TData>[]` | your columns; AdminPage appends the actions column |
| `data` | `TData[]` | all rows (the table is client-side) |
| `getRowId` | `(row) => string` | **required** |
| `schema` | `z.ZodType<TData>` | checked before `onCreate` / `onUpdate`, which get its parsed output |
| `form` | `ComponentType<EntityFormProps<TData>>` | the component, not an element: `form={NoteForm}` |
| `onCreate` | `(values) => void \| Promise<void>` | |
| `onUpdate` | `(row, values) => void \| Promise<void>` | `row` is the record as it was |
| `onDelete` | `(row) => void \| Promise<void>` | |
| `title`, `description` | `string` | page heading |
| `entityName` | `string` | fills "New {entity}", "Edit {entity}", …; defaults to a translated "record", but pass your own message |
| every other `DataTable` prop | | `filterableColumns`, `filters`, `initialSorting`, `initialPageSize`, `emptyState`, `enableRowSelection`, `bulkActions`, `onRowSelectionChange`, … — see hgn-building-data-tables |

## The entity form

AdminPage renders `form` with `EntityFormProps<TData>`:

| Prop | Create | Detail | Edit | Delete |
| --- | --- | --- | --- | --- |
| `initialValues` | `undefined` | the row | the row | the row |
| `readOnly` | `false` | `true` | `false` | `true` |
| `showActions` | `true` | `true` | `true` | `false` |
| `error` | last error | last error | last error | last error |

Forward them as in the recipe:

- `defaultValues: initialValues ?? EMPTY_<ENTITY>` — keep a typed empty record
  next to the schema.
- `disabled={readOnly}` on **every** field, and pass `readOnly` and
  `showActions` to `FormFooter` (it then shows a lone Close button in detail,
  and nothing in delete, where AdminPage renders the destructive footer).
- `<FormError form={form} error={error} />` — that's where AdminPage shows
  schema and server errors.
- `className="… px-4 pb-4"` on `Form`: the sheet has no inner padding.
- Fields that only exist once saved (an id, a created date): render them only
  when `initialValues` is set.

## How the flows work

- **Create / edit**: the form's `onSubmit` calls AdminPage, which runs
  `schema.safeParse(values)`. On failure it shows the first issue's message in
  `error`; on success it awaits `onCreate(result.data)` /
  `onUpdate(row, result.data)` and closes the sheet. The callbacks get the
  parsed output, so zod transforms, coercions and defaults (`.trim()`,
  `z.coerce.number()`, `.default(…)`) are already applied. A thrown error stays in the sheet as `error` (its
  `message`).
- **Delete**: the form is shown read-only with a warning and Cancel / Delete
  buttons; Delete awaits `onDelete(row)` and closes, or shows the error.
- **After a change** the sheet closes; refresh `data` yourself (e.g. invalidate
  the list query in your mutation's `onSuccess`). AdminPage doesn't refetch.
- The sheet unmounts the form when it closes, so every open starts from fresh
  `initialValues` — no `key` needed.

## Rules

1. **One schema** for the fields' validators and the `schema` prop, so the
   per-field checks and AdminPage's final check agree.
2. **Don't re-parse in the form.** AdminPage already validates; a
   `schema.parse()` in the form's `onSubmit` only adds an unhandled throw.
3. **Throw translated errors** from `onCreate` / `onUpdate` / `onDelete`: the
   `message` is shown as-is. Map backend errors (unique violations, failed
   constraints) to `m.*()` messages in your API layer.
4. **Callbacks return the promise** (`(values) => mutation.mutateAsync(values)`),
   so AdminPage can show the pending state and catch errors. A callback that
   fires and forgets closes the sheet before the save finishes.
5. **All strings are messages**: `title`, `description`, `entityName`,
   `emptyState`, column headers, field labels.

## Limits

Current gaps in `@hoogin/admin-page`; work around them, don't patch
`src/hoogin/`:

- **Server errors land in `FormError`, never on a field**: AdminPage catches
  them before the form sees them.
- **Every row gets Detail, Edit and Delete**; there's no per-row permission or
  hiding an action. Enforce permissions on the server and show the error.
- **Client-side table** with all of DataTable's limits (no server paging).
  Bulk actions work through DataTable's `bulkActions` prop, next to the
  per-row actions.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Sheet closes but the list doesn't change | `data` isn't refreshed | invalidate/refetch the list query after the mutation |
| Sheet closes before saving finishes, errors lost | callback doesn't return its promise | return `mutateAsync(...)` |
| Fields editable in Detail view | `disabled={readOnly}` missing | add it to every field |
| Two button rows in Delete view | `showActions` not forwarded to `FormFooter` | pass `showActions={showActions}` |
| "Invalid input" or English error text | default zod message, or untranslated thrown error | messages in the schema, `m.*()` in thrown errors |
| Form fields touch the sheet edges | no padding on `Form` | `className="flex flex-col gap-4 px-4 pb-4"` |
| Headings say "New record" / "Nieuw item" | `entityName` not set | pass `entityName={m.x_entity()}` |
