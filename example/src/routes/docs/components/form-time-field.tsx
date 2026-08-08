import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { FieldDemo } from "@/hoogin/docs/field-demo"
import { baseFieldProps } from "@/hoogin/docs/field-props"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { FormTimeField } from "@/hoogin/ui/form-time.field"

export const Route = createFileRoute("/docs/components/form-time-field")({
  component: FormTimeFieldPage,
})

const usageSource = `import { useForm } from "@tanstack/react-form"
import { Form, FormBody, FormFooter } from "@/hoogin/ui/form"
import { FormTimeField } from "@/hoogin/ui/form-time.field"

function Example() {
  const form = useForm({
    defaultValues: { startTime: "" },
    onSubmit: async ({ value }) => console.log(value),
  })

  return (
    <Form form={form}>
      <FormBody>
        <FormTimeField form={form} name="startTime" label="Start time" />
      </FormBody>
      <FormFooter form={form} onCancel={() => {}} />
    </Form>
  )
}`

function FormTimeFieldPage() {
  return (
    <ComponentDoc name="form-fields">
      <DocSection title="Preview">
        <Preview>
          <FieldDemo defaultValues={{ startTime: "" }}>
            {(form) => (
              <FormTimeField form={form} name="startTime" label="Start time" />
            )}
          </FieldDemo>
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="A masked HH:MM input. The Clock icon opens a popover with scrollable hour (00-23) and minute (00-59) lists."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection
        title="Validation"
        description='Completeness is validated automatically: the field reports "Required" when empty and "Enter a valid time (HH:MM)" until a full HH:MM is set. The stored value is the masked time as displayed (e.g. "14:30"). Pass your own validators to add further checks; they run alongside the built-in one.'
      >
        <PropsTable
          rows={[
            ...baseFieldProps,
            {
              prop: "value",
              type: "string",
              description:
                'Stores the masked time as displayed (e.g. "14:3-" or "14:30"). Completeness is validated automatically.',
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
