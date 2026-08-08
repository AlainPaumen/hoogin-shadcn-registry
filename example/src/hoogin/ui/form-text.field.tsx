import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  FormField,
  type FormFieldProps,
  type KeysOfType,
} from "@/hoogin/ui/form.field"

export type FormTextInputType = "text" | "email" | "number" | "date"

export type FormTextInputProps<
  TFormData,
  TName extends KeysOfType<TFormData, string | number>,
> = Omit<FormFieldProps<TFormData, TName>, "children"> & {
  type?: FormTextInputType
  placeholder?: string
  disabled?: boolean
}

export function FormTextField<
  TFormData,
  TName extends KeysOfType<TFormData, string | number>,
>({
  form,
  name,
  label,
  description,
  required,
  validators,
  disabled,
  type = "text",
  placeholder,
  className,
}: FormTextInputProps<TFormData, TName>) {
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
          type={type}
          value={
            type === "number" &&
            Number.isNaN(field.state.value as number)
              ? ""
              : (field.state.value as string | number)
          }
          onChange={(event) =>
            field.handleChange(
              (type === "number"
                ? event.target.valueAsNumber
                : event.target.value) as typeof field.state.value
            )
          }
          onBlur={field.handleBlur}
          disabled={disabled}
          aria-invalid={field.invalid || undefined}
          placeholder={placeholder}
          className={cn("w-full", className)}
        />
      )}
    </FormField>
  )
}
