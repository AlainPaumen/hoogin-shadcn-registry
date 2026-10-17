---
name: hgn-building-admin-pages
description: Builds CRUD admin pages with the @hoogin AdminPage block — a record table plus a side sheet to create, view, edit and delete — and the entity forms it renders (EntityFormProps). Use when adding or changing an admin/management page for an entity, or when code touches AdminPage or EntityFormProps. Columns follow hgn-building-data-tables; fields and validation follow hgn-building-forms.
user-invocable: true
---

# Building admin pages

`AdminPage` renders a title, a "New …" button, a `DataTable` with a per-row
actions menu, and a sheet that shows your form for create, detail, edit and
delete. You supply a zod schema, columns, a form component and three async
callbacks; every `DataTable` prop passes through.

## Recipe

```tsx
// schema — one schema for field validators and AdminPage
export const noteSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, m.notes_required()),
  body: z.string(),
})
export type NoteRow = z.infer<typeof noteSchema>
export const EMPTY_NOTE: NoteRow = { title: "", body: "" }
```

```tsx
// form
import { useForm } from "@tanstack/react-form"
import type { EntityFormProps } from "@/hoogin/blocks/admin-page/admin-page"
import { Form, FormBody, FormError, FormFooter } from "@/hoogin/ui/forms/form"
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
      </FormBody>
      <FormError form={form} error={error} />
      <FormFooter form={form} onCancel={onCancel} readOnly={readOnly} showActions={showActions} />
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
  columns={noteColumns} // hgn-building-data-tables
  data={notes}
  getRowId={(row) => String(row.id)}
  schema={noteSchema}
  form={NoteForm}
  emptyState={m.notes_empty()}
  onCreate={(values) => createNote.mutateAsync(values)}
  onUpdate={(row, values) => updateNote.mutateAsync({ id: row.id!, values })}
  onDelete={(row) => deleteNote.mutateAsync(row.id!)}
/>
```

## What the form receives

| Prop | Create | Detail | Edit | Delete |
| --- | --- | --- | --- | --- |
| `initialValues` | `undefined` | row | row | row |
| `readOnly` | `false` | `true` | `false` | `true` |
| `showActions` | `true` | `true` | `true` | `false` |
| `error` | schema or server error message, shown in `FormError` | | | |

## Checklist

```
- [ ] One schema; fields validate with schema.shape.x, AdminPage gets schema={...}
- [ ] Typed EMPTY_<ENTITY> for create; defaultValues: initialValues ?? EMPTY_<ENTITY>
- [ ] disabled={readOnly} on every field
- [ ] FormFooter gets readOnly and showActions; FormError gets error
- [ ] Form has px-4 pb-4 (the sheet has no inner padding)
- [ ] Callbacks return the mutation promise; the list query is invalidated on success
- [ ] title, description, entityName, emptyState, headers, labels are m.*() keys in every locale
- [ ] Typecheck and lint pass — fix and re-run until clean
```

## Rules

1. **AdminPage validates.** It runs `schema.safeParse` and passes the parsed
   output (`result.data`, with zod transforms and defaults applied) to
   `onCreate` / `onUpdate`. Don't parse again in the form.
2. **Return the promise** from each callback. AdminPage awaits it, shows a
   thrown error's `message` in the sheet and closes only on success; a
   fire-and-forget callback closes the sheet before the save finishes.
3. **Throw translated errors.** Map backend errors (unique violations, failed
   constraints) to `m.*()` messages in your API layer — the message is shown
   as-is, and always in `FormError`, never on a field.
4. **Refresh `data` yourself** after a change (invalidate the list query).
5. **Saved-only fields** (id, created date): render them only when
   `initialValues` is set.
6. **Never edit `src/hoogin/`**: `shadcn add @hoogin/admin-page --overwrite`
   replaces it.

## Limits

- Every row gets Detail, Edit and Delete; hide nothing per row. Enforce
  permissions on the server and show its error.
- The table is client-side, with the limits in hgn-building-data-tables.

## References

- `references/props.md` — every AdminPage prop, and what each flow does.
- `references/troubleshooting.md` — symptom → cause → fix.
