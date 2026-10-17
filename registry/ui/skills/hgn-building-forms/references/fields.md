# Fields

Import from `@/hoogin/ui/forms/form-<name>.field`. Every field takes `form`,
`name`, `label`, `description`, `required`, `validators`, `className`,
`disabled`.

| Field | Value type | Extra props |
| --- | --- | --- |
| `FormTextField` | `string \| number` | `type`, `placeholder` |
| `FormEmailField` | `string` | `emailIcon`, `placeholder` |
| `FormPasswordField` | `string` | `keyIcon`, `autoComplete` (default `current-password`), `placeholder` |
| `FormStrongPasswordField` | `string` | `keyIcon`, `autoComplete` (default `new-password`), `placeholder`; validates strength itself |
| `FormNumberField` | `number` | `placeholder` |
| `FormCurrencyField` | `number`, integer cents | `currencyIcon`, `placeholder` (`0.00`) |
| `FormDateField` | `string`, `yyyy-MM-dd` | `dateFormat` (default `dd/MM/yyyy`), `showMonthYearDropdowns`, `placeholder` |
| `FormTimeField` | `string`, `HH:MM` | validates the format itself |
| `FormSelectField` | `string` | `options: { value, label }[]` (required), `placeholder` |
| `FormTextareaField` | `string` | `rows`, `placeholder` |
| `FormCheckboxField` | `boolean` | label sits beside the box |

Self-validating fields combine their own check with your `validators.onChange`.

## Layout pieces

- `FormHeader`: `title`, `description`.
- `FormFooter`: `onCancel` (required); Cancel, Reset and Submit buttons,
  relabelled with `cancelLabel`, `resetLabel`, `submitLabel`; `showReset={false}`
  hides Reset; `readOnly` shows a lone Close; `showActions={false}` renders
  nothing. Submit stays disabled until the form can submit.
- `FormError`: `error` (a message string) plus the form's own errors.
- Custom submit button: read `useSelector(form.store, (s) => s.isSubmitting)`.

## Relation fields (foreign keys)

No relation field ships. For a short list, load the rows with a query and use
`FormSelectField` with `options` (`value` = id as a string, `label` = display
name). For a long or searchable list, write a custom field around a combobox.

## Custom fields

Wrap `FormField` from `@/hoogin/ui/forms/form.field`, accept
`Omit<FormFieldProps<TFormData, TName>, "children">`, and in its child:

- cast `field.state.value` to your type;
- call `field.handleChange(value)` on change and `field.handleBlur()` on blur
  (for popover controls, when the popover closes) — without the blur its
  errors never show;
- set `aria-invalid={field.invalid || undefined}`.

Keep it in your app, e.g. `src/components/forms/form-<name>.field.tsx`.
