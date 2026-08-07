import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  FormField,
  type FormFieldProps,
  type KeysOfType,
} from "@/hoogin/ui/form.field"

export function FormEmailField<
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
  className,
}: Omit<FormFieldProps<TFormData, TName>, "children"> & {
  disabled?: boolean
  placeholder?: string
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
          <Input
            id={field.name}
            name={field.name}
            type="email"
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
            className={cn("w-full", className)}
          />
        )
      }}
    </FormField>
  )
}
