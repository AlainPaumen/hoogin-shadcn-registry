"use client"

import { useEffect, useRef, useState } from "react"
import { Clock as ClockIcon } from "lucide-react"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  FormField,
  type FormFieldProps,
  type KeysOfType,
} from "@/hoogin/ui/forms/form.field"

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/
const TIME_MESSAGE = "Enter a valid time (HH:MM)"

function isValidDigit(position: number, digit: string, chars: string[]): boolean {
  const value = Number(digit)
  switch (position) {
    case 0:
      return value <= 2
    case 1:
      return chars[0] !== "2" || value <= 3
    case 3:
      return value <= 5
    default:
      return true
  }
}

function fillMask(digits: string): string {
  const chars = ["-", "-", ":", "-", "-"]
  let index = 0
  for (const position of [0, 1, 3, 4]) {
    while (
      index < digits.length &&
      !isValidDigit(position, digits[index], chars)
    ) {
      index++
    }
    if (index >= digits.length) break
    chars[position] = digits[index]
    index++
  }
  return chars.join("")
}

function maskFromValue(value: string): string {
  return fillMask(value.replace(/\D/g, ""))
}

function matchedValue(mask: string, start: number): string {
  const digits = mask.replace(/\D/g, "")
  const tens = digits[start]
  const ones = digits[start + 1]
  if (tens === undefined) return ""
  if (ones !== undefined) return `${tens}${ones}`
  return String(Number(tens) * 10).padStart(2, "0")
}

function setPart(mask: string, start: number, value: string): string {
  const chars = mask.split("")
  const charStart = start >= 2 ? start + 1 : start
  chars[charStart] = value[0]
  chars[charStart + 1] = value[1]
  return chars.join("")
}

function mergeTimeValidator<
  TFormData,
  TName extends KeysOfType<TFormData, string>,
>(
  consumer:
    | undefined
    | FieldValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>
): FieldValidateFn<TFormData, TName, DeepValue<TFormData, TName>> {
  return ({ value, fieldApi }) => {
    if (value === "") return "Required"
    if (!TIME_PATTERN.test(String(value))) return TIME_MESSAGE
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

function TimeColumn({
  label,
  values,
  active,
  onSelect,
}: {
  label: string
  values: string[]
  active: string
  onSelect: (value: string) => void
}) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center" })
  }, [active])

  return (
    <div className="flex w-14 flex-col">
      <p className="pb-1 text-center text-xs font-medium text-muted-foreground">
        {label}
      </p>
      <ul className="max-h-48 flex-1 overflow-y-auto">
        {values.map((value) => {
          const selected = value === active
          return (
            <li key={value}>
              <button
                type="button"
                ref={selected ? activeRef : undefined}
                aria-pressed={selected}
                onClick={() => onSelect(value)}
                className={cn(
                  "flex h-7 w-full items-center justify-center rounded-md text-sm tabular-nums hover:bg-muted",
                  selected && "bg-primary text-primary-foreground hover:bg-primary"
                )}
              >
                {value}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function TimeInput({
  id,
  value,
  disabled,
  invalid,
  onChange,
  onBlur,
}: {
  id: string
  value: string
  disabled?: boolean
  invalid: boolean
  onChange: (mask: string) => void
  onBlur: () => void
}) {
  const [mask, setMask] = useState(() => maskFromValue(value))
  const [focused, setFocused] = useState(false)
  const [open, setOpen] = useState(false)

  const update = (next: string) => {
    setMask(next)
    onChange(next)
  }

  return (
    <InputGroup>
      <InputGroupInput
        id={id}
        name={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={focused ? mask : maskFromValue(value)}
        onFocus={() => {
          setMask(maskFromValue(value))
          setFocused(true)
        }}
        onChange={(event) =>
          update(fillMask(event.target.value.replace(/\D/g, "")))
        }
        onBlur={() => {
          setFocused(false)
          onBlur()
        }}
        disabled={disabled}
        aria-invalid={invalid || undefined}
      />
      <InputGroupAddon>
        <Popover
          open={open && !disabled}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) onBlur()
          }}
        >
          <PopoverTrigger
            render={
              <InputGroupButton
                size="icon-xs"
                type="button"
                aria-label="Pick time"
                className="text-foreground"
              />
            }
          >
            <ClockIcon />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex gap-1 p-1">
              <TimeColumn
                label="Hours"
                values={HOURS}
                active={matchedValue(mask, 0)}
                onSelect={(hour) => update(setPart(mask, 0, hour))}
              />
              <TimeColumn
                label="Minutes"
                values={MINUTES}
                active={matchedValue(mask, 2)}
                onSelect={(minute) => {
                  update(setPart(mask, 2, minute))
                  setOpen(false)
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  )
}

export type FormTimeFieldProps<
  TFormData,
  TName extends KeysOfType<TFormData, string>,
> = Omit<FormFieldProps<TFormData, TName>, "children"> & {
  disabled?: boolean
}

export function FormTimeField<
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
  className,
}: FormTimeFieldProps<TFormData, TName>) {
  const mergedValidators = {
    ...validators,
    onChange: mergeTimeValidator(validators?.onChange),
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
      {(field) => (
        <TimeInput
          id={field.name}
          value={field.state.value as string}
          disabled={disabled}
          invalid={field.invalid}
          onChange={(mask) =>
            field.handleChange(mask as typeof field.state.value)
          }
          onBlur={field.handleBlur}
        />
      )}
    </FormField>
  )
}
