---
name: form-builder
description: Build a form with the @hoogin form components (TanStack Form v1 + zod v4) — auth, settings, create/edit entity forms, and forms driven by AdminPage. Use when asked to build/add a form or a form field, wire validation, or when the work touches useForm, FormBody/FormFooter/FormError, or any Form*Field component.
user-invocable: true
---

# Form builder

Composes forms out of `@hoogin/form-fields`. Do not hand-roll `<input>` +
validation — every control, label, error slot and a11y wiring already exists.

## Requires

- `@tanstack/react-form` **v1** (`^1.x`) — v0's `mode: "onSubmit"` API is not
  compatible; the recipe and every rule below are v1-only.
- `zod` **v4** (`^4.x`) — rule 5's `z.number({ error: "…" })` and
  `z.enum(values, { error: "…" })` are v4 syntax (v3 wants `invalid_type_error`).
- A **client-rendered SPA**: React + Vite, no server entry, no RSC. Form files
  are plain client components, so no `"use client"` directive — add one only if
  the host app renders them through a server component boundary.

## Setup

```bash
bunx --bun shadcn@latest add @hoogin/form-fields
```

15 files land in `src/hoogin/ui/forms/`; deps pull `input`, `input-group`,
`checkbox`, `select`, `textarea`, `button`, `calendar`, `popover` plus
`@tanstack/react-form`, `date-fns`, `lucide-react`, `react-day-picker`.

## Recipe

```tsx
import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import {
  Form,
  FormBody,
  FormError,
  FormFooter,
  FormHeader,
} from "@/hoogin/ui/forms/form"
import { isRequiredField } from "@/hoogin/ui/forms/form.utils"
import { FormEmailField } from "@/hoogin/ui/forms/form-email.field"
import { FormPasswordField } from "@/hoogin/ui/forms/form-password.field"
import { FormTextField } from "@/hoogin/ui/forms/form-text.field"

const profileSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type ProfileValues = z.infer<typeof profileSchema>

export type ProfileFormProps = {
  error?: string | null
  onSubmit: (values: ProfileValues) => void | Promise<void>
  onCancel: () => void
}

export function ProfileForm({ error, onSubmit, onCancel }: ProfileFormProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    } satisfies ProfileValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <Form form={form} className="flex w-full max-w-sm flex-col gap-4">
      <FormHeader title="Profile" description="Update your account." />
      <FormBody>
        <FormTextField
          form={form}
          name="name"
          label="Name"
          required={isRequiredField(profileSchema.shape.name)}
          validators={{ onChange: profileSchema.shape.name }}
        />
        <FormEmailField
          form={form}
          name="email"
          label="Email"
          required={isRequiredField(profileSchema.shape.email)}
          validators={{ onChange: profileSchema.shape.email }}
        />
        <FormPasswordField
          form={form}
          name="password"
          label="Password"
          required={isRequiredField(profileSchema.shape.password)}
          autoComplete="new-password"
          validators={{ onChange: profileSchema.shape.password }}
        />
      </FormBody>
      <FormError form={form} error={error} />
      <FormFooter form={form} onCancel={onCancel} submitLabel="Save" />
    </Form>
  )
}
```

## Fields

Every field takes `form`, `name`, `label`, `description`, `required`,
`validators`, `className`, `disabled`. The rest:

| Field | Value type | Extra props |
| --- | --- | --- |
| `FormTextField` | `string \| number` | `type`, `placeholder` |
| `FormEmailField` | `string` | `emailIcon`, `placeholder` |
| `FormPasswordField` | `string` | `keyIcon`, `autoComplete` (`current-password`), `placeholder` |
| `FormStrongPasswordField` | `string` | `keyIcon`, `autoComplete` (`new-password`), `placeholder` |
| `FormNumberField` | `number` | `placeholder` |
| `FormCurrencyField` | `number` — integer cents | `currencyIcon`, `placeholder` (`0.00`) |
| `FormDateField` | `string` — `yyyy-MM-dd` | `dateFormat` (`dd/MM/yyyy`), `showMonthYearDropdowns`, `placeholder` |
| `FormTimeField` | `string` — `HH:MM` | — |
| `FormSelectField` | `string` | `options: { value: string; label: string }[]` (required), `placeholder` |
| `FormTextareaField` | `string` | `rows`, `placeholder` |
| `FormCheckboxField` | `boolean` | — (label goes beside the box) |

No field fits? Write one in `<hoogin>/ui/forms/form-<name>.field.tsx`: wrap
`FormField`, forward `Omit<FormFieldProps<TFormData, TName>, "children">`, cast
the value, call `field.handleChange` + `field.handleBlur`, set
`aria-invalid={field.invalid || undefined}`. To ship it from the registry rather
than your own app, see `references/hoogin-repo.md`.

## Rules

1. **Type the value.** `name` is constrained to keys whose value matches the
   control — a string key on `FormCheckboxField` does not compile. So does the
   schema: `z.enum` for a select, `z.string()` for date/time, `z.number()` for
   number/currency, `z.boolean()` for checkbox.
2. **Messages live in the schema.** Never hand-roll a validator message when
   zod can say it: `z.string().email("Invalid email address")`. Cross-field
   rules stay inline and read the other field off the form:
   `validators={{ onChange: ({ value }) => value !== form.state.values.password ? "Passwords do not match" : undefined }}`.
3. **`required` is derived, never hardcoded**: `isRequiredField(schema.shape.x)`
   (`form.utils.ts`).
4. **Errors need a touch.** A field renders its message only after blur. Inputs
   wire `onBlur={field.handleBlur}`; popover controls (select, date, time) fire
   it on close. Leave it out and errors never appear.
5. **Number/currency go `NaN` while empty.** `z.number()` then reports
   `Invalid input: expected number, received NaN`. Use
   `z.number({ error: "Required" })` for the empty state, and
   `z.enum(roles, { error: "Select a role" })` to replace the default
   `Invalid option: expected one of …`. `FormCurrencyField` stores cents —
   validate `z.number().int()` when whole cents are required.
6. **`Form` is the `<form>`.** No second `onSubmit`, no `action`; it is
   `noValidate` and calls `form.handleSubmit()`. Layout: put the gap classes on
   `Form` (`className="flex flex-col gap-4"`), `FormBody` owns the field stack,
   and pair fields in `<div className="flex flex-col gap-4 sm:flex-row">`.
7. **`FormFooter` needs `onCancel`.** `readOnly` swaps to a lone "Close" button,
   `showActions={false}` renders nothing (use it when the parent owns the
   destructive confirmation). Submit is disabled until `canSubmit`.
8. **`FormError` takes server errors via `error`** and shows form-level store
   errors too — pass the message your `onSubmit` catch produced. Cross-field
   rules that must block submit belong on `useForm({ validators: { onSubmit } })`.
9. **`FormTimeField` and `FormStrongPasswordField` validate themselves**
   (`HH:MM`, strength rules) and compose with whatever `validators.onChange` you
   pass, so you can skip those checks in the schema.
10. **Async submit**: `onSubmit: async ({ value }) => { await onSubmit(value) }`.
    Read `isSubmitting` via `useSelector(form.store, (s) => s.isSubmitting)` when
    you need a custom button instead of `FormFooter`.

## Inside AdminPage

`@hoogin/admin-page` renders your form in a sheet and drives create / detail /
edit / delete. Accept `EntityFormProps<TData>` and forward it:

```tsx
import type { EntityFormProps } from "@/hoogin/blocks/admin-page/admin-page"

export function PaymentForm({
  initialValues,
  readOnly,
  showActions = true,
  error,
  onSubmit,
  onCancel,
}: EntityFormProps<Payment>) {
  const form = useForm({
    defaultValues: (initialValues ?? { /* create defaults */ }) satisfies Payment,
    onSubmit: async ({ value }) => { await onSubmit(value) },
  })
  // Form > FormBody > fields (disabled={readOnly}) > FormError > FormFooter
}
```

`initialValues` is `undefined` while creating, so gate id-only-on-edit fields
with `{initialValues ? <FormTextField ... /> : null}`. `AdminPage` re-parses your
schema before `onCreate` / `onUpdate` — the schema argument it takes must be the
same one the fields validate against.

## Verification

Run the host app's own typecheck and lint — the field-type rules (1–5) and the
`useForm` generics only fail there, so a form is not done until it compiles.

Working inside the hoogin registry repo itself (editing or adding a
`form-*.field.tsx` under `example/src/hoogin/ui/forms/`)? The extra
sync/build/validate loop and the reference implementations live in
`references/hoogin-repo.md`.
