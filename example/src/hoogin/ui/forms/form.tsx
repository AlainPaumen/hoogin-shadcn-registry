"use client"

import type { ReactNode } from "react"
import { useSelector } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  fieldErrorMessage,
  isFieldLevelErrorMap,
} from "@/hoogin/ui/forms/form.utils"

type FormStateLike = {
  canSubmit: boolean
  isSubmitting: boolean
  errors: readonly unknown[]
}

type FormStoreLike = {
  get: () => FormStateLike
  subscribe: (
    listener: (value: FormStateLike) => void
  ) => { unsubscribe: () => void }
}

export type FormApiLike = {
  store: FormStoreLike
  handleSubmit: () => Promise<void>
  reset: () => void
}

export function Form({
  form,
  className,
  children,
}: {
  form: FormApiLike
  className?: string
  children?: ReactNode
}) {
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
      className={className}
    >
      {children}
    </form>
  )
}

export function FormHeader({
  title,
  description,
  className,
}: {
  title?: ReactNode
  description?: ReactNode
  className?: string
}) {
  return (
    <header className={cn("space-y-1", className)}>
      {title ? (
        <h2 className="font-heading text-base font-medium">{title}</h2>
      ) : null}
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </header>
  )
}

export function FormBody({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>
}

export function FormFooter({
  form,
  onCancel,
  cancelLabel = "Cancel",
  submitLabel = "Save",
  resetLabel = "Reset",
  showReset = true,
  readOnly = false,
  showActions = true,
  className,
}: {
  form: FormApiLike
  onCancel: () => void
  cancelLabel?: string
  submitLabel?: string
  resetLabel?: string
  showReset?: boolean
  readOnly?: boolean
  showActions?: boolean
  className?: string
}) {
  const canSubmit = useSelector(form.store, (state) => state.canSubmit)
  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)

  if (!showActions) return null

  return (
    <footer className={cn("mt-2 flex justify-end gap-2", className)}>
      <Button type="button" variant="outline" onClick={onCancel}>
        {readOnly ? "Close" : cancelLabel}
      </Button>
      {!readOnly ? (
        <>
          {showReset ? (
            <Button type="button" variant="ghost" onClick={() => form.reset()}>
              {resetLabel}
            </Button>
          ) : null}
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </>
      ) : null}
    </footer>
  )
}

const EMPTY_STORE: FormStoreLike = {
  get: () => ({
    canSubmit: false,
    isSubmitting: false,
    errors: [],
  }),
  subscribe: () => ({ unsubscribe: () => {} }),
}

export function FormError({
  form,
  error,
  className,
}: {
  form?: FormApiLike
  error?: string | null
  className?: string
}) {
  const formErrors = useSelector(form?.store ?? EMPTY_STORE, (state) =>
    state.errors
      .filter((fieldError) => !isFieldLevelErrorMap(fieldError))
      .map(fieldErrorMessage)
      .filter(Boolean)
      .join("\n")
  )

  const messages = [error, formErrors].filter(
    (message): message is string => Boolean(message)
  )
  if (messages.length === 0) return null

  return (
    <p className={cn("text-sm text-destructive", className)}>
      {messages.join(", ")}
    </p>
  )
}
