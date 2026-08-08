"use client"

import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  FormField,
  type FormFieldProps,
  type KeysOfType,
} from "@/hoogin/ui/form.field"

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
  className,
}: Omit<FormFieldProps<TFormData, TName>, "children"> & {
  disabled?: boolean
  placeholder?: string
  autoComplete?: string
}) {
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
        <div className="relative">
          <Input
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
            className={cn("w-full pr-8", className)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((visible) => !visible)}
            className="absolute top-0 right-0 h-full w-8 rounded-l-none text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        </div>
      )}
    </FormField>
  )
}
