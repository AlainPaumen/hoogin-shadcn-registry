import type { ReactNode } from "react"
import {
  type DeepKeys,
  type DeepValue,
  type FieldAsyncValidateOrFn,
  type FieldValidateOrFn,
  type FieldValidators,
  type FormAsyncValidateOrFn,
  type FormValidateOrFn,
  type ReactFormExtendedApi,
} from "@tanstack/react-form"

import { cn } from "@/lib/utils"
import { fieldErrorMessage } from "@/hoogin/ui/form.utils"

export type FormFieldApi<TValue> = {
  name: string
  handleChange: (value: TValue) => void
  handleBlur: () => void
  invalid: boolean
  state: {
    value: TValue
    meta: {
      isTouched: boolean
      errors: readonly unknown[]
    }
  }
}

type AnyFormApi<TFormData> = ReactFormExtendedApi<
  TFormData,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  unknown
>

export type KeysOfType<TFormData, TValue> = DeepKeys<TFormData> & {
  [K in DeepKeys<TFormData>]: DeepValue<TFormData, K> extends TValue
    ? K
    : never
}[DeepKeys<TFormData>]

type FormFieldValidators<
  TFormData,
  TName extends DeepKeys<TFormData>,
  TData extends DeepValue<TFormData, TName>,
> = FieldValidators<
  TFormData,
  TName,
  TData,
  undefined | FieldValidateOrFn<TFormData, TName, TData>,
  undefined | FieldValidateOrFn<TFormData, TName, TData>,
  undefined | FieldAsyncValidateOrFn<TFormData, TName, TData>,
  undefined | FieldValidateOrFn<TFormData, TName, TData>,
  undefined | FieldAsyncValidateOrFn<TFormData, TName, TData>,
  undefined | FieldValidateOrFn<TFormData, TName, TData>,
  undefined | FieldAsyncValidateOrFn<TFormData, TName, TData>,
  undefined | FieldValidateOrFn<TFormData, TName, TData>,
  undefined | FieldAsyncValidateOrFn<TFormData, TName, TData>
>

export type FormFieldProps<
  TFormData,
  TName extends DeepKeys<TFormData>,
> = {
  form: AnyFormApi<TFormData>
  name: TName
  label?: string
  description?: string
  required?: boolean
  validators?: FormFieldValidators<TFormData, TName, DeepValue<TFormData, TName>>
  className?: string
  children: (field: FormFieldApi<DeepValue<TFormData, TName>>) => ReactNode
}

export function FormField<TFormData, TName extends DeepKeys<TFormData>>({
  form,
  name,
  label,
  description,
  required = false,
  validators,
  className,
  children,
}: FormFieldProps<TFormData, TName>) {
  return (
    <form.Field name={name} validators={validators}>
      {(field) => {
        const messages = field.state.meta.isTouched
          ? field.state.meta.errors.map(fieldErrorMessage)
          : []
        return (
          <div className={cn("flex flex-col gap-1.5", className)}>
            {label ? (
              <label htmlFor={name} id={`${name}-label`} className="text-sm font-medium">
                {label}
                {required ? <span> *</span> : null}
              </label>
            ) : null}
            {children({
              name: field.name,
              handleChange: field.handleChange,
              handleBlur: field.handleBlur,
              invalid:
                field.state.meta.isTouched && field.state.meta.errors.length > 0,
              state: {
                value: field.state.value,
                meta: {
                  isTouched: field.state.meta.isTouched,
                  errors: field.state.meta.errors,
                },
              },
            })}
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
            {messages.length > 0 ? (
              <p
                id={`${name}-error`}
                role="alert"
                className="text-sm text-destructive"
              >
                {messages.join(", ")}
              </p>
            ) : null}
          </div>
        )
      }}
    </form.Field>
  )
}
