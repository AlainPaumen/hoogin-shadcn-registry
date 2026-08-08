import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { FieldDemo } from "@/hoogin/docs/field-demo"
import { baseFieldProps } from "@/hoogin/docs/field-props"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { FormEmailField } from "@/hoogin/ui/form-email.field"

export const Route = createFileRoute("/docs/components/form-email-field")({
  component: FormEmailFieldPage,
})

const usageSource = `import { useForm } from "@tanstack/react-form"
import { Form, FormBody, FormFooter } from "@/hoogin/ui/form"
import { FormEmailField } from "@/hoogin/ui/form-email.field"

function Example() {
  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => console.log(value),
  })

  return (
    <Form form={form}>
      <FormBody>
        <FormEmailField form={form} name="email" label="Email" placeholder="ada@example.com" />
      </FormBody>
      <FormFooter form={form} onCancel={() => {}} />
    </Form>
  )
}`

function FormEmailFieldPage() {
  return (
    <ComponentDoc name="form-fields">
      <DocSection title="Preview">
        <Preview>
          <FieldDemo defaultValues={{ email: "" }}>
            {(form) => (
              <FormEmailField
                form={form}
                name="email"
                label="Email"
                placeholder="ada@example.com"
              />
            )}
          </FieldDemo>
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="An email input with a leading Mail icon inside the control."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            ...baseFieldProps,
            {
              prop: "emailIcon",
              type: "LucideIcon",
              default: "Mail",
              description: "Leading icon rendered inside the input.",
            },
            {
              prop: "placeholder",
              type: "string",
              description: "Placeholder text shown when the input is empty.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
