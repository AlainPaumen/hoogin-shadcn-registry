"use client"

import { useState } from "react"
import {
  CheckCircle2,
  EyeIcon,
  EyeOffIcon,
  KeyRound as KeyIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react"
import type {
  DeepValue,
  FieldValidateFn,
  FieldValidateOrFn,
} from "@tanstack/react-form"

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
} from "@/hoogin/ui/form.field"

type StrongPasswordRule = {
  test: (value: string) => boolean
  message: string
}

const STRONG_PASSWORD_RULES: StrongPasswordRule[] = [
  { test: (value) => value.length >= 8, message: "8+ characters" },
  { test: (value) => /\d/.test(value), message: "a number" },
  { test: (value) => /[A-Z]/.test(value), message: "an uppercase letter" },
  { test: (value) => /[!@#$%^&*()§{}]/.test(value), message: "a special character" },
]

function strongPasswordScore(value: string): number {
  return STRONG_PASSWORD_RULES.filter((rule) => rule.test(value)).length
}

function mergeStrongPasswordValidator<
  TFormData,
  TName extends KeysOfType<TFormData, string>,
>(
  consumer:
    | undefined
    | FieldValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>
): FieldValidateFn<TFormData, TName, DeepValue<TFormData, TName>> {
  return ({ value, fieldApi }) => {
    if (value === "") return "Required"
    const unmet = STRONG_PASSWORD_RULES.filter(
      (rule) => !rule.test(String(value))
    )
    if (unmet.length > 0) {
      return `Password must contain ${unmet.map((rule) => rule.message).join(", ")}`
    }
    if (typeof consumer === "function") {
      return consumer({ value, fieldApi })
    }
    if (consumer) {
      const result = consumer["~standard"].validate(value)
      if ("issues" in result) {
        return (result.issues ?? []).map((issue) => issue.message)
      }
    }
    return undefined
  }
}

function strengthColor(score: number): string {
  if (score <= 1) return "bg-red-500"
  if (score <= 2) return "bg-orange-500"
  if (score <= 3) return "bg-teal-400"
  return "bg-teal-500"
}

function strengthText(score: number): string {
  if (score <= 1) return "Weak"
  if (score <= 2) return "Moderate"
  if (score <= 3) return "Strong"
  return "Very Strong"
}

function strengthTextColor(score: number): string {
  if (score <= 1) return "text-red-500"
  if (score <= 2) return "text-orange-500"
  if (score <= 3) return "text-teal-400"
  return "text-teal-500"
}

export function FormStrongPasswordField<
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
  autoComplete = "new-password",
  keyIcon: Icon = KeyIcon,
  className,
}: Omit<FormFieldProps<TFormData, TName>, "children"> & {
  disabled?: boolean
  placeholder?: string
  autoComplete?: string
  keyIcon?: LucideIcon
}) {
  const [show, setShow] = useState(false)

  const mergedValidators = {
    ...validators,
    onChange: mergeStrongPasswordValidator(validators?.onChange),
  }

  return (
    <FormField
      form={form}
      name={name}
      label={label}
      description={description}
      required={required}
      validators={mergedValidators}
      className={className}
    >
      {(field) => {
        const value = String(field.state.value ?? "")
        const score = strongPasswordScore(value)
        return (
          <div className="space-y-2">
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
            <div className="flex h-1 w-full gap-0.5">
              {Array.from({ length: STRONG_PASSWORD_RULES.length }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-full flex-1 rounded-full transition-colors duration-300 motion-reduce:transition-none",
                    i < score ? strengthColor(score) : "bg-secondary"
                  )}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-muted-foreground">
                Password must contain
              </span>
              <span className={strengthTextColor(score)}>
                {score > 0 ? strengthText(score) : ""}
              </span>
            </div>
            <ul className="space-y-1.5">
              {STRONG_PASSWORD_RULES.map((rule) => {
                const met = rule.test(value)
                return (
                  <li
                    key={rule.message}
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      met ? "text-teal-500" : "text-muted-foreground"
                    )}
                  >
                    {met ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : (
                      <XIcon className="size-3.5" />
                    )}
                    <span className="text-[13px]">{rule.message}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      }}
    </FormField>
  )
}
