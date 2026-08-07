import { Checkbox } from "@/components/ui/checkbox"
import {
  FormField,
  type FormFieldProps,
  type KeysOfType,
} from "@/hoogin/ui/form.field"

export function FormCheckboxField<
  TFormData,
  TName extends KeysOfType<TFormData, boolean>,
>({
  form,
  name,
  label,
  description,
  required,
  validators,
  disabled,
  className,
}: Omit<FormFieldProps<TFormData, TName>, "children"> & {
  disabled?: boolean
}) {
  return (
    <FormField
      form={form}
      name={name}
      description={description}
      required={required}
      validators={validators}
      className={className}
    >
      {(field) => {
        const invalid =
          field.state.meta.isTouched && field.state.meta.errors.length > 0
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              id={field.name}
              name={field.name}
              checked={field.state.value as boolean}
              onCheckedChange={(checked) =>
                field.handleChange(checked as typeof field.state.value)
              }
              onBlur={field.handleBlur}
              disabled={disabled}
              aria-invalid={invalid || undefined}
            />
            <label
              htmlFor={field.name}
              className="text-sm font-medium select-none"
            >
              {label}
              {required ? <span> *</span> : null}
            </label>
          </div>
        )
      }}
    </FormField>
  )
}
