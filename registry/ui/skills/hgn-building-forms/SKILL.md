---
name: hgn-building-forms
description: Use when building or changing a form, a form field or form validation with the @hoogin form components (TanStack Form v1 + zod v4) — auth, settings, create/edit entity forms, and forms inside AdminPage. Also applies when the work touches useForm, FormBody/FormFooter/FormError, or any Form*Field component.
user-invocable: true
---

# Building forms

Composes forms out of `@hoogin/form-fields`. Do not hand-roll `<input>` +
validation — every control, label, error slot and a11y wiring already exists.

## Contents

- [Requires](#requires)
- [Setup](#setup)
- [Recipe](#recipe)
- [Fields](#fields)
- [Rules](#rules)
- [Server errors](#server-errors)
- [Inside AdminPage](#inside-adminpage)
- [Verification](#verification)

---

## Requires

- `@tanstack/react-form` **v1** (`^1.x`) — v0's `mode: "onSubmit"` API is not
  compatible; the recipe and every rule below are v1-only.
- `zod` **v4** (`^4.x`) — `z.email()`, `z.number({ error: "…" })` and
  `z.enum(values, { error: "…" })` are v4 syntax (v3 wants
  `z.string().email()` and `invalid_type_error`).
- A **client-rendered SPA**: React + Vite, no server entry, no RSC. Form files
  are plain client components, so no `"use client"` directive — add one only if
  the host app renders them through a server component boundary.
- Paraglide JS for messages (`@/paraglide/messages.js`), set up as in the
  `hgn-internationalizing-apps` skill.

## Setup

```bash
bunx --bun shadcn@latest add @hoogin/form-fields
```

The form components land in `src/hoogin/ui/forms/` (plus a shared
`src/hoogin/ui/data-table/cells/formatters.utils.tsx`); deps pull `input`,
`input-group`, `checkbox`, `select`, `textarea`, `button`, `calendar`,
`popover` plus `@tanstack/react-form`, `date-fns`, `lucide-react`,
`react-day-picker`. The same item installs this skill to
`.opencode/skills/hgn-building-forms/`; re-run the command with `--overwrite`
to update both the components and the skill. Never edit files under
`src/hoogin/` — the next `--overwrite` replaces them.

## Recipe

Every user-facing string — labels, descriptions, validation messages — is a
message from `m`, never an English literal. Add the keys to the app's
`messages/<locale>.json`, prefixed with the form's name.

```tsx
import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { m } from "@/paraglide/messages.js"
import {
  Form,
  FormBody,
  FormError,
  FormFooter,
  FormHeader,
} from "@/hoogin/ui/forms/form"
import { isRequiredField } from "@/hoogin/ui/forms/form.utils"
import { FormEmailField } from "@/hoogin/ui/forms/form-email.field"
import { FormTextField } from "@/hoogin/ui/forms/form-text.field"

const profileSchema = z.object({
  name: z.string().min(1, m.profileForm_required()),
  email: z.email(m.profileForm_invalidEmail()),
})

type ProfileValues = z.infer<typeof profileSchema>

export type ProfileFormProps = {
  error?: string | null
  onSubmit: (values: ProfileValues) => void | Promise<void>
  onCancel: () => void
}

export function ProfileForm({ error, onSubmit, onCancel }: ProfileFormProps) {
  const form = useForm({
    defaultValues: { name: "", email: "" } satisfies ProfileValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <Form form={form} className="flex w-full max-w-sm flex-col gap-4">
      <FormHeader
        title={m.profileForm_title()}
        description={m.profileForm_description()}
      />
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

A module-level schema reads its messages once, at import. That is fine with
Paraglide's default `setLocale()`, which reloads the page. If the app switches
locale without a reload, build the schema inside the component body instead
(it is cheap), so each render picks up the current locale's messages.

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

**Relations** (a foreign key to another table): no relation field ships. For a
short list, load the rows with a query and pass them to `FormSelectField` as
`options` (`value` = the id as a string, `label` = the display name). For a
long or searchable list, write a custom field (below) around a combobox.

**No field fits?** Write your own: wrap `FormField`, forward
`Omit<FormFieldProps<TFormData, TName>, "children">`, cast the value, call
`field.handleChange` on change and `field.handleBlur` on blur (popover controls:
when the popover closes) — without the blur, its errors never show. Set
`aria-invalid={field.invalid || undefined}`. Keep it in your app, e.g.
`src/components/forms/form-<name>.field.tsx`.

## Rules

1. **Type the value.** `name` is constrained to keys whose value matches the
   control — a string key on `FormCheckboxField` does not compile. So does the
   schema: `z.enum` for a select, `z.string()` for date/time, `z.number()` for
   number/currency, `z.boolean()` for checkbox.
2. **Messages live in the schema.** Never hand-roll a validator message when
   zod can say it: `z.email(m.x_invalidEmail())`. Cross-field rules stay inline
   on the dependent field, which re-validates when the other one changes:
   `validators={{ onChangeListenTo: ["password"], onChange: ({ value, fieldApi }) => value !== fieldApi.form.getFieldValue("password") ? m.x_passwordsDoNotMatch() : undefined }}`.
3. **`required` is derived, never hardcoded**: `isRequiredField(schema.shape.x)`
   (`form.utils.ts`).
4. **Errors show after a touch.** A field shows its message once it has been
   blurred, or after a submit attempt — not while the user is still typing in
   a fresh field.
5. **Number/currency go `NaN` while empty.** `z.number()` then reports
   `Invalid input: expected number, received NaN`. Use
   `z.number({ error: m.x_required() })` for the empty state, and
   `z.enum(roles, { error: m.x_selectRole() })` to replace the default
   `Invalid option: expected one of …`. `FormCurrencyField` stores cents —
   validate `z.number().int()` when whole cents are required.
6. **`Form` is the `<form>`.** No second `onSubmit`, no `action`; it is
   `noValidate` and calls `form.handleSubmit()`. Layout: put the gap classes on
   `Form` (`className="flex flex-col gap-4"`), `FormBody` owns the field stack,
   and pair fields in `<div className="flex flex-col gap-4 sm:flex-row">`.
7. **`FormFooter` needs `onCancel`.** It renders Cancel, Reset and Submit;
   relabel them with `cancelLabel`, `resetLabel`, `submitLabel`, hide Reset with
   `showReset={false}`. `readOnly` swaps to a lone "Close" button,
   `showActions={false}` renders nothing (use it when the parent owns the
   destructive confirmation). Submit is disabled until `canSubmit`.
8. **Validators are field-level only.** Never pass `validators` to `useForm`:
   a form with form-level validators no longer matches the form type the
   `Form*Field` components accept, so it does not type-check. Put each rule on
   its field (rule 2 for cross-field ones). For whole-object rules, re-parse in
   `onSubmit` — `const parsed = schema.safeParse(value)` — and report a failure
   through `FormError` (AdminPage already does this for you).
9. **`FormError` shows form-level errors via `error`** — the message your
   `onSubmit` catch produced, or the failed re-parse from rule 8.
10. **`FormTimeField` and `FormStrongPasswordField` validate themselves**
    (`HH:MM`, strength rules) and compose with whatever `validators.onChange`
    you pass, so you can skip those checks in the schema.
11. **Async submit**: `onSubmit: async ({ value }) => { await onSubmit(value) }`.
    Read `isSubmitting` via `useSelector(form.store, (s) => s.isSubmitting)` when
    you need a custom button instead of `FormFooter`.
12. **`defaultValues` are read once**, when the form mounts. A form that is
    reused for different records must remount per record: render it with
    `key={record.id}`. AdminPage already remounts its form each time the sheet
    opens.

## Server errors

Errors from the backend (a taken email, a failed constraint) belong on the
field they are about when you can tell which one; everything else goes to
`FormError`. Catch in the form's `onSubmit`, put field errors on the field's
`onSubmit` error slot — TanStack clears it as soon as the user edits that
field — and pass the rest up:

```tsx
const form = useForm({
  defaultValues,
  onSubmit: async ({ value, formApi }) => {
    try {
      await onSubmit(value)
    } catch (err) {
      if (isUniqueViolation(err, "email")) {
        formApi.setFieldMeta("email", (meta) => ({
          ...meta,
          errorMap: { ...meta.errorMap, onSubmit: m.profileForm_emailTaken() },
        }))
        return
      }
      setError(m.profileForm_saveFailed()) // shown by <FormError error={error} />
    }
  },
})
```

`isUniqueViolation` stands for whatever your API layer exposes to recognise the
error — map backend errors there, not in each form.

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
  // Form > FormBody > fields (disabled={readOnly}) > FormError error={error} > FormFooter
}
```

- `initialValues` is `undefined` while creating, so gate id-only-on-edit fields
  with `{initialValues ? <FormTextField ... /> : null}`.
- `AdminPage` re-parses your schema before `onCreate` / `onUpdate` and shows a
  failure in `error` — the schema it takes must be the one the fields validate
  against, and the form needs no re-parse of its own.
- `AdminPage` catches errors thrown by `onCreate` / `onUpdate` and shows their
  message through `error`, so the form's own `onSubmit` never sees them. Inside
  AdminPage, server errors therefore appear in `FormError`, not on a field;
  throw an `Error` whose message is already translated.

## Verification

Run the host app's own typecheck and lint — the field-type rules (1–5) and the
`useForm` generics only fail there, so a form is not done until it compiles.
