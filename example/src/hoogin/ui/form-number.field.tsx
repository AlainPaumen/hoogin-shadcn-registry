import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  FormField,
  type FormFieldProps,
  type KeysOfType,
} from "@/hoogin/ui/form.field"

export function FormNumberField<
  TFormData,
  TName extends KeysOfType<TFormData, number>,
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
      {(field) => (
        <Input
          id={field.name}
          name={field.name}
          type="number"
          value={
            Number.isNaN(field.state.value as number)
              ? ""
              : (field.state.value as number)
          }
          onChange={(event) =>
            field.handleChange(
              event.target.valueAsNumber as typeof field.state.value
            )
          }
          onBlur={field.handleBlur}
          disabled={disabled}
          aria-invalid={field.invalid || undefined}
          aria-labelledby={label ? `${field.name}-label` : undefined}
          aria-describedby={field.invalid ? `${field.name}-error` : undefined}
          placeholder={placeholder}
          className={cn("w-full", className)}
        />
      )}
    </FormField>
  )
}
