"use client"

import { useForm, useSelector } from "@tanstack/react-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { m } from "@/paraglide/messages.js"
import { Form, FormBody, FormError } from "@/hoogin/ui/forms/form"
import { FormEmailField } from "@/hoogin/ui/forms/form-email.field"
import { FormPasswordField } from "@/hoogin/ui/forms/form-password.field"
import { isRequiredField } from "@/hoogin/ui/forms/form.utils"

const signinSchema = z.object({
  email: z.string().email(m.signinForm_invalidEmail()),
  password: z.string().min(1, m.signinForm_required()),
})

export type SigninValues = z.infer<typeof signinSchema>

export type SigninFormProps = {
  error?: string | null
  onSubmit: (values: SigninValues) => void | Promise<void>
  className?: string
}

export function SigninForm({ error, onSubmit, className }: SigninFormProps) {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies SigninValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)

  return (
    <Form form={form} className={cn("flex flex-col gap-4", className)}>
      <FormBody>
        <FormEmailField
          form={form}
          name="email"
          label={m.signinForm_email()}
          placeholder="jane@acme.com"
          required={isRequiredField(signinSchema.shape.email)}
          validators={{ onChange: signinSchema.shape.email }}
        />
        <FormPasswordField
          form={form}
          name="password"
          label={m.signinForm_password()}
          required={isRequiredField(signinSchema.shape.password)}
          autoComplete="current-password"
          validators={{ onChange: signinSchema.shape.password }}
        />
      </FormBody>
      <FormError form={form} error={error} />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? m.signinForm_signingIn() : m.signinForm_signIn()}
      </Button>
    </Form>
  )
}
