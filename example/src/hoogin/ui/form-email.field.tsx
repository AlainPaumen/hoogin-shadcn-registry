import { Mail as EmailIcon, type LucideIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"
import {
  FormField,
  type FormFieldProps,
  type KeysOfType,
} from "@/hoogin/ui/form.field"

export type FormEmailFieldProps<
  TFormData,
  TName extends KeysOfType<TFormData, string>,
> = Omit<FormFieldProps<TFormData, TName>, "children"> & {
  emailIcon?: LucideIcon
  disabled?: boolean
  placeholder?: string
}

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
  emailIcon: Icon = EmailIcon,
  placeholder,
  className,
}: FormEmailFieldProps<TFormData, TName>) {
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
        <InputGroup>
          <InputGroupAddon>
            <Icon className="text-foreground" />
          </InputGroupAddon>
          <InputGroupInput
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
            aria-invalid={field.invalid || undefined}
            placeholder={placeholder}
            className={cn("w-full", className)}
          />
        </InputGroup>
      )}
    </FormField>
  )
}
