import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { toast } from "@/components/ui/toast"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { ValueList } from "@/hoogin/docs/value-list"
import {
  Form,
  FormBody,
  FormError,
  FormFooter,
  FormHeader,
} from "@/hoogin/ui/form"
import { isRequiredField } from "@/hoogin/ui/form.utils"
import { FormCheckboxField } from "@/hoogin/ui/form-checkbox.field"
import { FormCurrencyField } from "@/hoogin/ui/form-currency.field"
import { FormDateField } from "@/hoogin/ui/form-date.field"
import { FormEmailField } from "@/hoogin/ui/form-email.field"
import { FormNumberField } from "@/hoogin/ui/form-number.field"
import { FormPasswordField } from "@/hoogin/ui/form-password.field"
import { FormSelectField } from "@/hoogin/ui/form-select.field"
import { FormTextareaField } from "@/hoogin/ui/form-textarea.field"
import { FormTextField } from "@/hoogin/ui/form-text.field"
import { FormTimeField } from "@/hoogin/ui/form-time.field"

export const Route = createFileRoute("/docs/components/form-fields")({
  component: FormFieldsPage,
})

const roles = ["user", "admin", "editor"] as const

const signUpSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(roles),
  birthDate: z.string().min(1, "Required"),
  startDate: z.string().optional(),
  startTime: z.string(),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  favoriteNumber: z.number().positive("Must be greater than zero"),
  price: z
    .number()
    .int("Price must be a whole number of cents")
    .positive("Price must be greater than zero"),
  agree: z.boolean().refine((value) => value, "You must accept the terms"),
})

type SignUpValues = z.infer<typeof signUpSchema>

function SignUpForm({
  error,
  onSubmit,
  onCancel,
}: {
  error?: string | null
  onSubmit: (values: SignUpValues) => void | Promise<void>
  onCancel: () => void
}) {
  const defaultValues: SignUpValues = {
    fullName: "",
    email: "",
    password: "",
    role: "user",
    birthDate: "",
    startDate: "",
    startTime: "",
    bio: "",
    favoriteNumber: 0,
    price: 0,
    agree: false,
  }

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <Form form={form} className="flex w-full max-w-sm flex-col gap-4">
      <FormHeader
        title="Create account"
        description="Set up your profile to get started."
      />
      <FormBody>
        <FormTextField
          form={form}
          name="fullName"
          label="Full name"
          required={isRequiredField(signUpSchema.shape.fullName)}
          validators={{ onChange: signUpSchema.shape.fullName }}
          placeholder="Ada Lovelace"
        />
        <FormEmailField
          form={form}
          name="email"
          label="Email"
          required={isRequiredField(signUpSchema.shape.email)}
          validators={{ onChange: signUpSchema.shape.email }}
          placeholder="ada@example.com"
        />
        <FormPasswordField
          form={form}
          name="password"
          label="Password"
          required={isRequiredField(signUpSchema.shape.password)}
          validators={{ onChange: signUpSchema.shape.password }}
          autoComplete="new-password"
        />
        <FormSelectField
          form={form}
          name="role"
          label="Role"
          required={isRequiredField(signUpSchema.shape.role)}
          validators={{ onChange: signUpSchema.shape.role }}
          options={roles.map((role) => ({ value: role, label: role }))}
        />
        <FormDateField
          form={form}
          name="birthDate"
          label="Birth date"
          required={isRequiredField(signUpSchema.shape.birthDate)}
          validators={{ onChange: signUpSchema.shape.birthDate }}
          dateFormat="dd/MM/yyyy"
          showMonthYearDropdowns
        />
        <FormDateField form={form} name="startDate" label="Start date" />
        <FormTimeField
          form={form}
          name="startTime"
          label="Start time"
          required={isRequiredField(signUpSchema.shape.startTime)}
        />
        <FormNumberField
          form={form}
          name="favoriteNumber"
          label="Favorite number"
          required={isRequiredField(signUpSchema.shape.favoriteNumber)}
          validators={{ onChange: signUpSchema.shape.favoriteNumber }}
        />
        <FormCurrencyField
          form={form}
          name="price"
          label="Price"
          required={isRequiredField(signUpSchema.shape.price)}
          validators={{ onChange: signUpSchema.shape.price }}
          placeholder="0,00"
        />
        <FormTextareaField
          form={form}
          name="bio"
          label="Bio"
          required={isRequiredField(signUpSchema.shape.bio)}
          validators={{ onChange: signUpSchema.shape.bio }}
          rows={3}
        />
        <FormCheckboxField
          form={form}
          name="agree"
          label="I agree to the terms"
          required={isRequiredField(signUpSchema.shape.agree)}
          validators={{ onChange: signUpSchema.shape.agree }}
        />
      </FormBody>
      <FormError form={form} error={error} />
      <FormFooter
        form={form}
        onCancel={onCancel}
        submitLabel="Create account"
      />
    </Form>
  )
}

function FormFieldsPreview() {
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (values: SignUpValues) => {
    if (values.email === "taken@example.com") {
      setError("This email is already registered.")
      return
    }
    setError(null)
    toast.add({
      type: "success",
      title: "Account created",
      description: <ValueList values={values} mask={["password"]} />,
    })
  }

  return (
    <SignUpForm
      error={error}
      onSubmit={handleSubmit}
      onCancel={() => setError(null)}
    />
  )
}

const usageSource = `// form.tsx
import { useForm } from "@tanstack/react-form"
import { Form, FormBody, FormError, FormFooter, FormHeader } from "@/hoogin/ui/form"
import { isRequiredField } from "@/hoogin/ui/form.utils"
import { FormTextField } from "@/hoogin/ui/form-text.field"
import { FormEmailField } from "@/hoogin/ui/form-email.field"
import { FormPasswordField } from "@/hoogin/ui/form-password.field"
import { FormSelectField } from "@/hoogin/ui/form-select.field"
import { FormDateField } from "@/hoogin/ui/form-date.field"
import { FormTimeField } from "@/hoogin/ui/form-time.field"
import { FormTextareaField } from "@/hoogin/ui/form-textarea.field"
import { FormCheckboxField } from "@/hoogin/ui/form-checkbox.field"
import { FormCurrencyField } from "@/hoogin/ui/form-currency.field"
import { z } from "zod"

const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["user", "admin", "editor"]),
  birthDate: z.string().min(1),
  startDate: z.string().optional(),
  startTime: z.string(),
  bio: z.string().min(10),
  agree: z.boolean().refine((value) => value),
  price: z.number().int().positive(),
})

export function SignUpForm({
  error,
  onCancel,
}: {
  error?: string | null
  onCancel: () => void
}) {
  const form = useForm({
    defaultValues: { fullName: "", email: "", password: "", role: "user", birthDate: "", startDate: "", startTime: "", bio: "", agree: false },
    onSubmit: async ({ value }) => {
      await api.signUp(value)
    },
  })

  return (
    <Form form={form}>
      <FormHeader title="Create account" />
      <FormBody>
        <FormTextField
          form={form}
          name="fullName"
          label="Full name"
          required={isRequiredField(signUpSchema.shape.fullName)}
          validators={{ onChange: signUpSchema.shape.fullName }}
        />
        <FormEmailField
          form={form}
          name="email"
          label="Email"
          required={isRequiredField(signUpSchema.shape.email)}
          validators={{ onChange: signUpSchema.shape.email }}
        />
        <FormPasswordField
          form={form}
          name="password"
          label="Password"
          required={isRequiredField(signUpSchema.shape.password)}
          validators={{ onChange: signUpSchema.shape.password }}
        />
        <FormSelectField
          form={form}
          name="role"
          label="Role"
          validators={{ onChange: signUpSchema.shape.role }}
          options={[{ value: "user", label: "user" }, { value: "admin", label: "admin" }]}
        />
        <FormDateField
          form={form}
          name="birthDate"
          label="Birth date"
          required={isRequiredField(signUpSchema.shape.birthDate)}
          validators={{ onChange: signUpSchema.shape.birthDate }}
          dateFormat="dd/MM/yyyy"
          showMonthYearDropdowns
        />
        <FormDateField form={form} name="startDate" label="Start date" />
        <FormTimeField
          form={form}
          name="startTime"
          label="Start time"
        />
        <FormCurrencyField
          form={form}
          name="price"
          label="Price"
          validators={{ onChange: signUpSchema.shape.price }}
        />
        <FormTextareaField
          form={form}
          name="bio"
          label="Bio"
          validators={{ onChange: signUpSchema.shape.bio }}
        />
        <FormCheckboxField
          form={form}
          name="agree"
          label="I agree to the terms"
          validators={{ onChange: signUpSchema.shape.agree }}
        />
      </FormBody>
      <FormError form={form} error={error} />
      <FormFooter form={form} onCancel={onCancel} submitLabel="Create account" />
    </Form>
  )
}`

function FormFieldsPage() {
  return (
    <ComponentDoc name="form-fields">
      <DocSection title="Preview">
        <Preview>
          <FormFieldsPreview />
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="Each field component binds its own form.Field: pass the form, the field name, and optional validators. The component renders a label, control, optional description, error slot, and invalid visual state. Names are constrained to keys of the form data whose value type fits the control — pass a string key to a checkbox and it will not compile."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection
        title="Notes"
        description="Error messages come from TanStack Form's field state, so raw Standard Schema issues are normalized through fieldErrorMessage. Required indicators are derived from the zod schema with isRequiredField. FormFooter is bound to the form: the submit button is disabled until canSubmit and it resets through form.reset(); pass readOnly or showActions={false} to render only a cancel button."
      >
        <p className="text-sm text-muted-foreground">
          Annotate defaultValues with your schema's inferred type so field
          values keep their widest type: const defaultValues: SignUpValues ={" "}
          {"{ ... }"}.
        </p>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              prop: "form",
              type: "ReactFormExtendedApi<TFormData>",
              description:
                "The TanStack Form instance. Pass the object returned by useForm. Form wires handleSubmit on the <form> element; each field component binds its own form.Field to this instance.",
            },
            {
              prop: "name",
              type: "TName",
              description:
                "A key (or dot path) of the form data. Constrained to keys whose value type matches the control, so a checkbox accepts only boolean fields.",
            },
            {
              prop: "validators",
              type: "FieldValidators<TFormData, TName, TData>",
              description:
                "Optional field validators. Pass a zod schema per event, e.g. { onChange: signUpSchema.shape.email }. The schema is checked against the field's value type.",
            },
            {
              prop: "label",
              type: "string",
              description:
                "Field label. A required marker is appended when required is true.",
            },
            {
              prop: "required",
              type: "boolean",
              description:
                "Shows the required asterisk. Derive it with isRequiredField(yourZodSchema).",
            },
            {
              prop: "description",
              type: "string",
              description: "Optional helper text rendered under the control.",
            },
            {
              prop: "options",
              type: "{ value: string; label: string }[]",
              description: "FormSelectField options rendered as select items.",
            },
            {
              prop: "dateFormat",
              type: "string",
              description:
                'FormDateField display format for the selected date using date-fns tokens. Defaults to "PPP" (e.g. "Aug 7, 2026"). The stored value stays ISO yyyy-MM-dd regardless.',
            },
            {
              prop: "placeholder",
              type: "string",
              description:
                'FormDateField text shown when no date is selected. Defaults to "Select a date".',
            },
            {
              prop: "showMonthYearDropdowns",
              type: "boolean",
              description:
                "FormDateField renders month and year dropdowns in the calendar caption instead of the plain month label. Defaults to false. With dropdowns enabled the year range is 100 years back to the end of the current year.",
            },
            {
              prop: "currencyIcon",
              type: "LucideIcon",
              description:
                'FormCurrencyField leading icon. Defaults to the Euro icon. The icon replaces the currency symbol in the displayed amount. The stored value stays cents regardless.',
            },
            {
              prop: "value",
              type: "string",
              description:
                'FormTimeField stores the masked time as displayed (e.g. "14:3-" or "14:30"). Completeness is validated automatically: the field reports "Required" when empty and "Enter a valid time (HH:MM)" until a full HH:MM is set. The Clock icon opens a popover with scrollable hour (00-23) and minute (00-59) lists.',
            },
            {
              prop: "onCancel",
              type: "() => void",
              description: "FormFooter cancel/close button handler.",
            },
            {
              prop: "submitLabel",
              type: "string",
              description:
                'FormFooter submit button label. Defaults to "Save".',
            },
            {
              prop: "readOnly",
              type: "boolean",
              description:
                'FormFooter renders only the cancel button (label "Close").',
            },
            {
              prop: "showActions",
              type: "boolean",
              description:
                "FormFooter renders nothing when false. Set false during destructive confirmations owned by the caller.",
            },
            {
              prop: "error",
              type: "string",
              description:
                "FormError shows this message alongside any form-level errors from the form store.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
