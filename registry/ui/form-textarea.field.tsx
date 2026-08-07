import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  FormField,
  type FormFieldProps,
  type KeysOfType,
} from "@/hoogin/ui/form.field"

export function FormTextareaField<
  TFormData,
  TName extends KeysOfType<TFormData, string>,
>({
  form,
  name,
  label,
  description,
  required,
  validators,
  disabled,
  placeholder,
  rows,
  className,
}: Omit<FormFieldProps<TFormData, TName>, "children"> & {
  disabled?: boolean
  placeholder?: string
  rows?: number
}) {
  return (
    <FormField
      form={form}
      name={name}
      label={label}
      description={description}
      required={required}
      validators={validators}
      className={className}
    >
      {(field) => {
        const invalid =
          field.state.meta.isTouched && field.state.meta.errors.length > 0
        return (
          <Textarea
            id={field.name}
            name={field.name}
            value={field.state.value as string}
            onChange={(event) =>
              field.handleChange(
                event.target.value as typeof field.state.value
              )
            }
            onBlur={field.handleBlur}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            placeholder={placeholder}
            rows={rows}
            className={cn("w-full", className)}
          />
        )
      }}
    </FormField>
  )
}
