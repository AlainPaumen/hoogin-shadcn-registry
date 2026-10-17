---
name: hgn-building-forms
description: Builds forms with the @hoogin form components (TanStack Form v1, zod v4) — typed Form*Field controls, field-level zod validation, translated messages, server errors. Use when building or changing a form, a form field or form validation (sign-in, settings, create/edit entity forms), or when code touches useForm, Form/FormBody/FormFooter/FormError or a Form*Field. For forms inside AdminPage, also use hgn-building-admin-pages.
user-invocable: true
---

# Building forms

Compose forms from `@hoogin/form-fields`: every control, label, error slot and
a11y wiring exists already — never hand-roll `<input>` + validation.

**TanStack Form v1 and zod v4.** v0 form code and zod v3 syntax
(`z.string().email()`, `invalid_type_error`) don't apply: use `z.email()`,
`z.number({ error })`, `z.enum(values, { error })`.

## Recipe

```tsx
import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { m } from "@/paraglide/messages.js"
import { Form, FormBody, FormError, FormFooter, FormHeader } from "@/hoogin/ui/forms/form"
import { isRequiredField } from "@/hoogin/ui/forms/form.utils"
import { FormEmailField } from "@/hoogin/ui/forms/form-email.field"
import { FormTextField } from "@/hoogin/ui/forms/form-text.field"

const profileSchema = z.object({
  name: z.string().min(1, m.profileForm_required()),
  email: z.email(m.profileForm_invalidEmail()),
})

type ProfileValues = z.infer<typeof profileSchema>

export function ProfileForm({
  error,
  onSubmit,
  onCancel,
}: {
  error?: string | null
  onSubmit: (values: ProfileValues) => Promise<void>
  onCancel: () => void
}) {
  const form = useForm({
    defaultValues: { name: "", email: "" } satisfies ProfileValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <Form form={form} className="flex w-full max-w-sm flex-col gap-4">
      <FormHeader title={m.profileForm_title()} />
      <FormBody>
        <FormTextField
          form={form}
          name="name"
          label={m.profileForm_name()}
          required={isRequiredField(profileSchema.shape.name)}
          validators={{ onChange: profileSchema.shape.name }}
        />
        <FormEmailField
          form={form}
          name="email"
          label={m.profileForm_email()}
          required={isRequiredField(profileSchema.shape.email)}
          validators={{ onChange: profileSchema.shape.email }}
        />
      </FormBody>
      <FormError form={form} error={error} />
      <FormFooter form={form} onCancel={onCancel} submitLabel={m.profileForm_save()} />
    </Form>
  )
}
```

## Checklist

```
- [ ] One zod schema; each field validates with validators={{ onChange: schema.shape.x }}
- [ ] required={isRequiredField(schema.shape.x)} on each field
- [ ] Field component matches the value type (see references/fields.md)
- [ ] Labels, titles and validation messages are m.*() keys in every locale
- [ ] FormError gets the error; FormFooter gets onCancel
- [ ] Typecheck and lint pass — fix and re-run until clean (field-type errors only show there)
```

## Rules

1. **Validators are field-level only.** Never pass `validators` to `useForm`:
   such a form no longer matches the type the `Form*Field`s accept. For a
   whole-object rule, `schema.safeParse(value)` in `onSubmit` and report the
   failure through `FormError`.
2. **Cross-field rules** go on the dependent field:
   `validators={{ onChangeListenTo: ["password"], onChange: ({ value, fieldApi }) => value !== fieldApi.form.getFieldValue("password") ? m.x_passwordsDoNotMatch() : undefined }}`.
3. **`name` must match the control's value type** — a string key on
   `FormCheckboxField` doesn't compile. Schema: `z.enum` for select,
   `z.string()` for date/time, `z.number()` for number/currency (integer
   cents), `z.boolean()` for checkbox.
4. **Empty number fields are `NaN`**: use `z.number({ error: m.x_required() })`;
   replace the default enum message with `z.enum(values, { error: m.x_pick() })`.
5. **`Form` is the `<form>`**: no own `onSubmit`/`action`. Gap classes go on
   `Form`; pair fields in `<div className="flex flex-col gap-4 sm:flex-row">`.
6. **Errors appear after blur or a submit attempt**, not while typing.
7. **`defaultValues` are read once.** A form reused for another record needs
   `key={record.id}`.
8. **Never edit `src/hoogin/`**: `shadcn add @hoogin/form-fields --overwrite`
   replaces it. Custom fields go in your app.

## References

- `references/fields.md` — every field and its value type, `FormFooter` props,
  relation (foreign key) fields, writing a custom field.
- `references/server-errors.md` — showing a backend error on the field it is
  about.
- `references/troubleshooting.md` — symptom → cause → fix.
