import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { FieldDemo } from "@/hoogin/docs/field-demo"
import { baseFieldProps } from "@/hoogin/docs/field-props"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { FormTextareaField } from "@/hoogin/ui/form-textarea.field"

export const Route = createFileRoute("/docs/components/form-textarea-field")({
  component: FormTextareaFieldPage,
})

const usageSource = `import { useForm } from "@tanstack/react-form"
import { Form, FormBody, FormFooter } from "@/hoogin/ui/form"
import { FormTextareaField } from "@/hoogin/ui/form-textarea.field"

function Example() {
  const form = useForm({
    defaultValues: { bio: "" },
    onSubmit: async ({ value }) => console.log(value),
  })

  return (
    <Form form={form}>
      <FormBody>
        <FormTextareaField form={form} name="bio" label="Bio" rows={3} />
      </FormBody>
      <FormFooter form={form} onCancel={() => {}} />
    </Form>
  )
}`

function FormTextareaFieldPage() {
  return (
    <ComponentDoc name="form-fields">
      <DocSection title="Preview">
        <Preview>
          <FieldDemo defaultValues={{ bio: "" }}>
            {(form) => (
              <FormTextareaField
                form={form}
                name="bio"
                label="Bio"
                rows={3}
                placeholder="Tell us about yourself"
              />
            )}
          </FieldDemo>
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="A multi-line textarea bound to a string field."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            ...baseFieldProps,
            {
              prop: "rows",
              type: "number",
              description: "Number of visible rows. Defaults to the textarea default.",
            },
            {
              prop: "placeholder",
              type: "string",
              description: "Placeholder text shown when the textarea is empty.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
