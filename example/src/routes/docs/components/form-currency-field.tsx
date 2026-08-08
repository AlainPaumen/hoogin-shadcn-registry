import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { FieldDemo } from "@/hoogin/docs/field-demo"
import { baseFieldProps } from "@/hoogin/docs/field-props"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { FormCurrencyField } from "@/hoogin/ui/form-currency.field"

export const Route = createFileRoute("/docs/components/form-currency-field")({
  component: FormCurrencyFieldPage,
})

const usageSource = `import { useForm } from "@tanstack/react-form"
import { Form, FormBody, FormFooter } from "@/hoogin/ui/form"
import { FormCurrencyField } from "@/hoogin/ui/form-currency.field"

function Example() {
  const form = useForm({
    defaultValues: { price: 0 },
    onSubmit: async ({ value }) => console.log(value),
  })

  return (
    <Form form={form}>
      <FormBody>
        <FormCurrencyField form={form} name="price" label="Price" />
      </FormBody>
      <FormFooter form={form} onCancel={() => {}} />
    </Form>
  )
}`

function FormCurrencyFieldPage() {
  return (
    <ComponentDoc name="form-fields">
      <DocSection title="Preview">
        <Preview>
          <FieldDemo defaultValues={{ price: 0 }}>
            {(form) => (
              <FormCurrencyField form={form} name="price" label="Price" />
            )}
          </FieldDemo>
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description='A masked decimal input with a leading currency icon. The stored value is always whole cents; type "0.00" to format the masked input while typing.'
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            ...baseFieldProps,
            {
              prop: "currencyIcon",
              type: "LucideIcon",
              default: "Euro",
              description:
                "Leading icon. The icon replaces the currency symbol in the displayed amount; the stored value stays cents regardless.",
            },
            {
              prop: "placeholder",
              type: "string",
              default: '"0.00"',
              description: "Placeholder text shown when the input is empty.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
