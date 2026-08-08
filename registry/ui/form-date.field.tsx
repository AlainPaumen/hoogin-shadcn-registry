"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
} from "@/hoogin/ui/form.field"

function parseDateValue(value: string): Date | undefined {
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

export function FormDateField<
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
  dateFormat = "dd/MM/yyyy",
  placeholder = "Select a date",
  showMonthYearDropdowns = false,
  className,
}: Omit<FormFieldProps<TFormData, TName>, "children"> & {
  disabled?: boolean
  dateFormat?: string
  placeholder?: string
  showMonthYearDropdowns?: boolean
}) {
  const [open, setOpen] = useState(false)

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
        const value = field.state.value as string
        const selected = parseDateValue(value)
        return (
          <Popover
            open={open}
            onOpenChange={(next) => {
              setOpen(next)
              if (!next) field.handleBlur()
            }}
          >
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  id={field.name}
                  disabled={disabled}
                  aria-invalid={field.invalid || undefined}
                  data-empty={!value}
                  className={cn(
                    "w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
                    className
                  )}
                />
              }
            >
              <CalendarIcon data-icon="inline-start" />
              {value
                ? selected
                  ? format(selected, dateFormat)
                  : value
                : placeholder}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout={showMonthYearDropdowns ? "dropdown" : "label"}
                selected={selected}
                onSelect={(date) => {
                  if (date) {
                    field.handleChange(
                      format(date, "yyyy-MM-dd") as typeof field.state.value
                    )
                  }
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        )
      }}
    </FormField>
  )
}
