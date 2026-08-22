import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { FieldDemo } from "@/hoogin/docs/field-demo"
import { baseFieldProps } from "@/hoogin/docs/field-props"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { FormSelectField } from "@/hoogin/ui/forms/form-select.field"

export const Route = createFileRoute("/docs/components/form-select-field")({
  component: FormSelectFieldPage,
})

const roles = [
  { value: "user", label: "user" },
  { value: "admin", label: "admin" },
  { value: "editor", label: "editor" },
]

const usageSource = `import { useForm } from "@tanstack/react-form"
import { Form, FormBody, FormFooter } from "@/hoogin/ui/forms/form"
import { FormSelectField } from "@/hoogin/ui/forms/form-select.field"

function Example() {
  const form = useForm({
    defaultValues: { role: "user" },
    onSubmit: async ({ value }) => console.log(value),
  })

  return (
    <Form form={form}>
      <FormBody>
        <FormSelectField
          form={form}
          name="role"
          label="Role"
          options={[
            { value: "user", label: "user" },
            { value: "admin", label: "admin" },
          ]}
        />
      </FormBody>
      <FormFooter form={form} onCancel={() => {}} />
    </Form>
  )
}`

function FormSelectFieldPage() {
  return (
    <ComponentDoc name="form-fields">
      <DocSection title="Preview">
        <Preview>
          <FieldDemo defaultValues={{ role: "user" }}>
            {(form) => (
              <FormSelectField
                form={form}
                name="role"
                label="Role"
                options={roles}
              />
            )}
          </FieldDemo>
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="A select bound to a string field. Options are passed as { value, label } pairs."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            ...baseFieldProps,
            {
              prop: "options",
              type: "{ value: string; label: string }[]",
              description: "Options rendered as select items.",
            },
            {
              prop: "placeholder",
              type: "string",
              description:
                "Text shown when no option is selected. Selects with a default value ignore it.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
