# Server errors

A backend error about one field (a taken email, a failed unique constraint)
goes on that field; everything else goes to `FormError`. Catch in the form's
`onSubmit` and set the field's `onSubmit` error — TanStack clears it as soon as
the user edits that field:

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
      setError(m.profileForm_saveFailed()) // rendered by <FormError error={error} />
    }
  },
})
```

`isUniqueViolation` stands for your API layer's error mapping — recognise
backend errors there, not in each form.

Inside AdminPage this doesn't apply: AdminPage catches the error first and
shows it in `FormError` (see hgn-building-admin-pages).
