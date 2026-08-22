import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { FieldDemo } from "@/hoogin/docs/field-demo"
import { baseFieldProps } from "@/hoogin/docs/field-props"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { FormDateField } from "@/hoogin/ui/forms/form-date.field"

export const Route = createFileRoute("/docs/components/form-date-field")({
  component: FormDateFieldPage,
})

const usageSource = `import { useForm } from "@tanstack/react-form"
import { Form, FormBody, FormFooter } from "@/hoogin/ui/forms/form"
import { FormDateField } from "@/hoogin/ui/forms/form-date.field"

function Example() {
  const form = useForm({
    defaultValues: { birthDate: "" },
    onSubmit: async ({ value }) => console.log(value),
  })

  return (
    <Form form={form}>
      <FormBody>
        <FormDateField
          form={form}
          name="birthDate"
          label="Birth date"
          dateFormat="dd/MM/yyyy"
          showMonthYearDropdowns
        />
      </FormBody>
      <FormFooter form={form} onCancel={() => {}} />
    </Form>
  )
}`

function FormDateFieldPage() {
  return (
    <ComponentDoc name="form-fields">
      <DocSection title="Preview">
        <Preview>
          <FieldDemo defaultValues={{ birthDate: "" }}>
            {(form) => (
              <FormDateField
                form={form}
                name="birthDate"
                label="Birth date"
                dateFormat="dd/MM/yyyy"
                showMonthYearDropdowns
              />
            )}
          </FieldDemo>
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="A date picker bound to a string field. The stored value is always ISO yyyy-MM-dd; dateFormat only controls how the selected date is displayed in the trigger."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            ...baseFieldProps,
            {
              prop: "dateFormat",
              type: "string",
              default: '"dd/MM/yyyy"',
              description:
                "Display format for the selected date using date-fns tokens. The stored value stays ISO yyyy-MM-dd regardless.",
            },
            {
              prop: "placeholder",
              type: "string",
              default: '"Select a date"',
              description: "Text shown when no date is selected.",
            },
            {
              prop: "showMonthYearDropdowns",
              type: "boolean",
              default: "false",
              description:
                "Renders month and year dropdowns in the calendar caption instead of the plain month label. With dropdowns enabled the year range is 100 years back to the end of the current year.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
