import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { FieldDemo } from "@/hoogin/docs/field-demo"
import { baseFieldProps } from "@/hoogin/docs/field-props"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { FormNumberField } from "@/hoogin/ui/forms/form-number.field"

export const Route = createFileRoute("/docs/components/form-number-field")({
  component: FormNumberFieldPage,
})

const usageSource = `import { useForm } from "@tanstack/react-form"
import { Form, FormBody, FormFooter } from "@/hoogin/ui/forms/form"
import { FormNumberField } from "@/hoogin/ui/forms/form-number.field"

function Example() {
  const form = useForm({
    defaultValues: { favoriteNumber: 0 },
    onSubmit: async ({ value }) => console.log(value),
  })

  return (
    <Form form={form}>
      <FormBody>
        <FormNumberField form={form} name="favoriteNumber" label="Favorite number" />
      </FormBody>
      <FormFooter form={form} onCancel={() => {}} />
    </Form>
  )
}`

function FormNumberFieldPage() {
  return (
    <ComponentDoc name="form-fields">
      <DocSection title="Preview">
        <Preview>
          <FieldDemo defaultValues={{ favoriteNumber: 0 }}>
            {(form) => (
              <FormNumberField
                form={form}
                name="favoriteNumber"
                label="Favorite number"
              />
            )}
          </FieldDemo>
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="A numeric input. The value is stored as a number (0 when empty)."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            ...baseFieldProps,
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
