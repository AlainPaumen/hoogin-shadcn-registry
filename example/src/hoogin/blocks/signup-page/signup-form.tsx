"use client"

import { useForm, useSelector } from "@tanstack/react-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Form, FormBody, FormError } from "@/hoogin/ui/form"
import { FormEmailField } from "@/hoogin/ui/form-email.field"
import { FormPasswordField } from "@/hoogin/ui/form-password.field"
import { FormStrongPasswordField } from "@/hoogin/ui/form-strong-password.field"
import { FormTextField } from "@/hoogin/ui/form-text.field"
import { isRequiredField } from "@/hoogin/ui/form.utils"

const signupSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Required"),
  confirmPassword: z.string().min(1, "Required"),
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
            label="First Name"
            placeholder="Jane"
            required={isRequiredField(signupSchema.shape.firstName)}
            validators={{ onChange: signupSchema.shape.firstName }}
          />
          <FormTextField
            form={form}
            name="lastName"
            label="Last Name"
            placeholder="Doe"
            required={isRequiredField(signupSchema.shape.lastName)}
            validators={{ onChange: signupSchema.shape.lastName }}
          />
        </div>
        <FormEmailField
          form={form}
          name="email"
          label="Email"
          placeholder="jane@acme.com"
          required={isRequiredField(signupSchema.shape.email)}
          validators={{ onChange: signupSchema.shape.email }}
        />
        <FormStrongPasswordField
          form={form}
          name="password"
          label="Strong Password"
          required={isRequiredField(signupSchema.shape.password)}
          validators={{ onChange: signupSchema.shape.password }}
        />
        <FormPasswordField
          form={form}
          name="confirmPassword"
          label="Confirm Password"
          required={isRequiredField(signupSchema.shape.confirmPassword)}
          autoComplete="new-password"
          validators={{
            onChange: ({ value }) =>
              value && value !== form.state.values.password
                ? "Passwords do not match"
                : undefined,
          }}
        />
      </FormBody>
      <FormError form={form} error={error} />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </Button>
    </Form>
  )
}
