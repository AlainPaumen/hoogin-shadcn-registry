import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { FieldDemo } from "@/hoogin/docs/field-demo"
import { baseFieldProps } from "@/hoogin/docs/field-props"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { FormPasswordField } from "@/hoogin/ui/forms/form-password.field"

export const Route = createFileRoute("/docs/components/form-password-field")({
  component: FormPasswordFieldPage,
})

const usageSource = `import { useForm } from "@tanstack/react-form"
import { Form, FormBody, FormFooter } from "@/hoogin/ui/forms/form"
import { FormPasswordField } from "@/hoogin/ui/forms/form-password.field"

function Example() {
  const form = useForm({
    defaultValues: { password: "" },
    onSubmit: async ({ value }) => console.log(value),
  })

  return (
    <Form form={form}>
      <FormBody>
        <FormPasswordField form={form} name="password" label="Password" autoComplete="new-password" />
      </FormBody>
      <FormFooter form={form} onCancel={() => {}} />
    </Form>
  )
}`

function FormPasswordFieldPage() {
  return (
    <ComponentDoc name="form-fields">
      <DocSection title="Preview">
        <Preview>
          <FieldDemo defaultValues={{ password: "" }}>
            {(form) => (
              <FormPasswordField
                form={form}
                name="password"
                label="Password"
                autoComplete="new-password"
              />
            )}
          </FieldDemo>
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="A password input with a show/hide toggle button."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            ...baseFieldProps,
            {
              prop: "autoComplete",
              type: "string",
              default: '"current-password"',
              description:
                'Passed through to the input. Use "new-password" on sign-up forms.',
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
