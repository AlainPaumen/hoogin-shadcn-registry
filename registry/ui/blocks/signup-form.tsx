"use client"

import { useForm, useSelector } from "@tanstack/react-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { m } from "@/paraglide/messages.js"
import { Form, FormBody, FormError } from "@/hoogin/ui/forms/form"
import { FormEmailField } from "@/hoogin/ui/forms/form-email.field"
import { FormPasswordField } from "@/hoogin/ui/forms/form-password.field"
import { FormStrongPasswordField } from "@/hoogin/ui/forms/form-strong-password.field"
import { FormTextField } from "@/hoogin/ui/forms/form-text.field"
import { isRequiredField } from "@/hoogin/ui/forms/form.utils"

const signupSchema = z.object({
  firstName: z.string().min(1, m.signupForm_required()),
  lastName: z.string().min(1, m.signupForm_required()),
  email: z.string().email(m.signupForm_invalidEmail()),
  password: z.string().min(1, m.signupForm_required()),
  confirmPassword: z.string().min(1, m.signupForm_required()),
})

export type SignupValues = z.infer<typeof signupSchema>

export type SignupFormProps = {
  error?: string | null
  onSubmit: (values: SignupValues) => void | Promise<void>
  className?: string
}

export function SignupForm({ error, onSubmit, className }: SignupFormProps) {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    } satisfies SignupValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)

  return (
    <Form form={form} className={cn("flex flex-col gap-4", className)}>
      <FormBody>
        <div className="flex flex-col gap-4 sm:flex-row">
          <FormTextField
            form={form}
            name="firstName"
            label={m.signupForm_firstName()}
            placeholder={m.signupForm_firstNamePlaceholder()}
            required={isRequiredField(signupSchema.shape.firstName)}
            validators={{ onChange: signupSchema.shape.firstName }}
          />
          <FormTextField
            form={form}
            name="lastName"
            label={m.signupForm_lastName()}
            placeholder={m.signupForm_lastNamePlaceholder()}
            required={isRequiredField(signupSchema.shape.lastName)}
            validators={{ onChange: signupSchema.shape.lastName }}
          />
        </div>
        <FormEmailField
          form={form}
          name="email"
          label={m.signupForm_email()}
          placeholder="jane@acme.com"
          required={isRequiredField(signupSchema.shape.email)}
          validators={{ onChange: signupSchema.shape.email }}
        />
        <FormStrongPasswordField
          form={form}
          name="password"
          label={m.signupForm_strongPassword()}
          required={isRequiredField(signupSchema.shape.password)}
          validators={{ onChange: signupSchema.shape.password }}
        />
        <FormPasswordField
          form={form}
          name="confirmPassword"
          label={m.signupForm_confirmPassword()}
          required={isRequiredField(signupSchema.shape.confirmPassword)}
          autoComplete="new-password"
          validators={{
            onChange: ({ value }) =>
              value && value !== form.state.values.password
                ? m.signupForm_passwordsDoNotMatch()
                : undefined,
          }}
        />
      </FormBody>
      <FormError form={form} error={error} />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? m.signupForm_creatingAccount() : m.signupForm_createAccount()}
      </Button>
    </Form>
  )
}
