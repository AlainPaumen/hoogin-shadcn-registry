# Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Sheet closes, list unchanged | `data` not refreshed | invalidate/refetch the list query after the mutation |
| Sheet closes before the save finishes, errors lost | callback doesn't return its promise | return `mutateAsync(...)` |
| Fields editable in Detail | `disabled={readOnly}` missing | add it to every field |
| Two button rows in Delete | `showActions` not passed to `FormFooter` | pass `showActions={showActions}` |
| "Invalid input" or English error text | default zod message, or untranslated thrown error | messages in the schema; `m.*()` in thrown errors |
| Fields touch the sheet edges | no padding on `Form` | `className="flex flex-col gap-4 px-4 pb-4"` |
| Headings say "New record" | `entityName` not set | `entityName={m.x_entity()}` |
| Unhandled error when submitting invalid data | `schema.parse()` inside the form | remove it; AdminPage validates |
