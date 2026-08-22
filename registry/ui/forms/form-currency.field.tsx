"use client"

import { useState } from "react"
import { Euro as EuroIcon, type LucideIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  FormField,
  type FormFieldProps,
  type KeysOfType,
} from "@/hoogin/ui/forms/form.field"

function formatCurrencyAmount(cents: number): string {
  if (!Number.isFinite(cents)) return ""
  return (cents / 100).toFixed(2)
}

function rawDraftFromCents(cents: number): string {
  if (!Number.isFinite(cents) || cents === 0) return ""
  return formatCurrencyAmount(cents)
}

function sanitizeCurrencyInput(raw: string): string {
  const cleaned = raw.replace(/[^\d.,]/g, "")
  const separatorIndex = cleaned.search(/[.,]/)
  const whole =
    separatorIndex === -1
      ? cleaned
      : cleaned.slice(0, separatorIndex)
  const trimmedWhole = whole.replace(/^0+(?=\d)/, "")
  if (separatorIndex === -1) return trimmedWhole
  const fraction = cleaned
    .slice(separatorIndex + 1)
    .replace(/[.,]/g, "")
    .slice(0, 2)
  return `${trimmedWhole}.${fraction}`
}

function parseToCents(draft: string): number {
  if (draft === "") return NaN
  const amount = Number(draft)
  if (!Number.isFinite(amount)) return NaN
  return Math.round(amount * 100)
}

function CurrencyInput({
  id,
  value,
  icon: Icon,
  disabled,
  invalid,
  placeholder,
  onChange,
  onBlur,
}: {
  id: string
  value: number
  icon: LucideIcon
  disabled?: boolean
  invalid: boolean
  placeholder?: string
  onChange: (cents: number) => void
  onBlur: () => void
}) {
  const [draft, setDraft] = useState("")
  const [focused, setFocused] = useState(false)

  return (
    <InputGroup>
      <InputGroupAddon>
        <Icon className="text-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        name={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        readOnly={!focused}
        value={focused ? draft : formatCurrencyAmount(value)}
        onFocus={() => {
          setDraft(rawDraftFromCents(value))
          setFocused(true)
        }}
        onChange={(event) => {
          const next = sanitizeCurrencyInput(event.target.value)
          setDraft(next)
          onChange(parseToCents(next))
        }}
        onBlur={() => {
          setFocused(false)
          onBlur()
        }}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        placeholder={placeholder}
      />
    </InputGroup>
  )
}

export type FormCurrencyFieldProps<
  TFormData,
  TName extends KeysOfType<TFormData, number>,
> = Omit<FormFieldProps<TFormData, TName>, "children"> & {
  currencyIcon?: LucideIcon
  placeholder?: string
  disabled?: boolean
}

export function FormCurrencyField<
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
  currencyIcon = EuroIcon,
  placeholder = "0.00",
  className,
}: FormCurrencyFieldProps<TFormData, TName>) {
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
        <CurrencyInput
          id={field.name}
          value={field.state.value as number}
          icon={currencyIcon}
          disabled={disabled}
          invalid={field.invalid}
          placeholder={placeholder}
          onChange={(cents) =>
            field.handleChange(cents as typeof field.state.value)
          }
          onBlur={field.handleBlur}
        />
      )}
    </FormField>
  )
}
