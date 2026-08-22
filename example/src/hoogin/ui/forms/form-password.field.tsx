"use client"

import { useState } from "react"
import {
  EyeIcon,
  EyeOffIcon,
  KeyRound as KeyIcon,
  type LucideIcon,
} from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"
import {
  FormField,
  type FormFieldProps,
  type KeysOfType,
} from "@/hoogin/ui/forms/form.field"

export type FormPasswordFieldProps<
  TFormData,
  TName extends KeysOfType<TFormData, string>,
> = Omit<FormFieldProps<TFormData, TName>, "children"> & {
  keyIcon?: LucideIcon
  disabled?: boolean
  placeholder?: string
  autoComplete?: string
}

export function FormPasswordField<
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
  autoComplete = "current-password",
  keyIcon: Icon = KeyIcon,
  className,
}: FormPasswordFieldProps<TFormData, TName>) {
  const [show, setShow] = useState(false)

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
            type={show ? "text" : "password"}
            value={field.state.value as string}
            onChange={(event) =>
              field.handleChange(
                event.target.value as typeof field.state.value
              )
            }
            onBlur={field.handleBlur}
            disabled={disabled}
            autoComplete={autoComplete}
            aria-invalid={field.invalid || undefined}
            placeholder={placeholder}
            className={cn("w-full", className)}
          />
          <InputGroupButton
            tabIndex={-1}
            size="icon-xs"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((visible) => !visible)}
          >
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroup>
      )}
    </FormField>
  )
}
