import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { FieldDemo } from "@/hoogin/docs/field-demo"
import { baseFieldProps } from "@/hoogin/docs/field-props"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { FormTextField } from "@/hoogin/ui/forms/form-text.field"

export const Route = createFileRoute("/docs/components/form-text-field")({
  component: FormTextFieldPage,
})

const usageSource = `import { useForm } from "@tanstack/react-form"
import { Form, FormBody, FormFooter } from "@/hoogin/ui/forms/form"
import { FormTextField } from "@/hoogin/ui/forms/form-text.field"

function Example() {
  const form = useForm({
    defaultValues: { name: "" },
    onSubmit: async ({ value }) => console.log(value),
  })

  return (
    <Form form={form}>
      <FormBody>
        <FormTextField form={form} name="name" label="Name" placeholder="Ada Lovelace" />
      </FormBody>
      <FormFooter form={form} onCancel={() => {}} />
    </Form>
  )
}`

function FormTextFieldPage() {
  return (
    <ComponentDoc name="form-fields">
      <DocSection title="Preview">
        <Preview>
          <FieldDemo defaultValues={{ name: "" }}>
            {(form) => (
              <FormTextField
                form={form}
                name="name"
                label="Name"
                placeholder="Ada Lovelace"
              />
            )}
          </FieldDemo>
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="A single-line text input bound to a string form field."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            ...baseFieldProps,
            {
              prop: "type",
              type: '"text" | "email" | "number" | "date"',
              default: '"text"',
              description:
                "The underlying input type. Prefer FormEmailField, FormNumberField, and FormDateField for those types.",
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
