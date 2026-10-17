# AdminPage props and flows

| Prop | Type | Notes |
| --- | --- | --- |
| `columns` | `DataTableColumnDef<TData>[]` | AdminPage appends the actions column |
| `data` | `TData[]` | all rows |
| `getRowId` | `(row) => string` | required |
| `schema` | `z.ZodType<TData>` | checked before `onCreate` / `onUpdate`, which get its parsed output |
| `form` | `ComponentType<EntityFormProps<TData>>` | the component: `form={NoteForm}` |
| `onCreate` | `(values) => void \| Promise<void>` | |
| `onUpdate` | `(row, values) => void \| Promise<void>` | `row` is the record before the edit |
| `onDelete` | `(row) => void \| Promise<void>` | |
| `title`, `description` | `string` | page heading |
| `entityName` | `string` | fills "New {entity}", "Edit {entity}", …; default is a translated "record" |
| any other `DataTable` prop | | `filterableColumns`, `filters`, `initialSorting`, `initialPageSize`, `emptyState`, `enableRowSelection`, `bulkActions`, `onRowSelectionChange`, … |

## Flows

- **Create / edit**: the form's `onSubmit` → `schema.safeParse(values)`. A
  failure shows the first issue's message as `error`; success awaits
  `onCreate(result.data)` / `onUpdate(row, result.data)` and closes the sheet.
  A thrown error stays in the sheet as `error`.
- **Detail**: the form read-only, with a lone Close button from `FormFooter`.
- **Delete**: the form read-only with a warning and Cancel / Delete; Delete
  awaits `onDelete(row)` and closes, or shows the error.
- Closing the sheet unmounts the form, so each open starts from fresh
  `initialValues` (no `key` needed).
