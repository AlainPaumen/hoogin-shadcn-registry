import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { FieldDemo } from "@/hoogin/docs/field-demo"
import { baseFieldProps } from "@/hoogin/docs/field-props"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { FormCheckboxField } from "@/hoogin/ui/forms/form-checkbox.field"

export const Route = createFileRoute("/docs/components/form-checkbox-field")({
  component: FormCheckboxFieldPage,
})

const usageSource = `import { useForm } from "@tanstack/react-form"
import { Form, FormBody, FormFooter } from "@/hoogin/ui/forms/form"
import { FormCheckboxField } from "@/hoogin/ui/forms/form-checkbox.field"

function Example() {
  const form = useForm({
    defaultValues: { agree: false },
    onSubmit: async ({ value }) => console.log(value),
  })

  return (
    <Form form={form}>
      <FormBody>
        <FormCheckboxField
          form={form}
          name="agree"
          label="I agree to the terms"
          required
        />
      </FormBody>
      <FormFooter form={form} onCancel={() => {}} />
    </Form>
  )
}`

function FormCheckboxFieldPage() {
  return (
    <ComponentDoc name="form-fields">
      <DocSection title="Preview">
        <Preview>
          <FieldDemo defaultValues={{ agree: false }}>
            {(form) => (
              <FormCheckboxField
                form={form}
                name="agree"
                label="I agree to the terms"
                required
              />
            )}
          </FieldDemo>
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="A checkbox bound to a boolean field. The label is rendered next to the control."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection
        title="Validation"
        description="Checkboxes have no invalid visual state. Mark a terms checkbox required and pass a validators callback to block submission until checked."
      >
        <PropsTable rows={baseFieldProps} />
      </DocSection>
    </ComponentDoc>
  )
}
