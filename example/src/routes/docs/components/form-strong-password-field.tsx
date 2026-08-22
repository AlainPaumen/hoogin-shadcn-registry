import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { FieldDemo } from "@/hoogin/docs/field-demo"
import { baseFieldProps } from "@/hoogin/docs/field-props"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { FormStrongPasswordField } from "@/hoogin/ui/forms/form-strong-password.field"

export const Route = createFileRoute(
  "/docs/components/form-strong-password-field"
)({
  component: FormStrongPasswordFieldPage,
})

const usageSource = `import { useForm } from "@tanstack/react-form"
import { Form, FormBody, FormFooter } from "@/hoogin/ui/forms/form"
import { FormStrongPasswordField } from "@/hoogin/ui/forms/form-strong-password.field"

function Example() {
  const form = useForm({
    defaultValues: { password: "" },
    onSubmit: async ({ value }) => console.log(value),
  })

  return (
    <Form form={form}>
      <FormBody>
        <FormStrongPasswordField
          form={form}
          name="password"
          label="Password"
          autoComplete="new-password"
        />
      </FormBody>
      <FormFooter form={form} onCancel={() => {}} />
    </Form>
  )
}`

function FormStrongPasswordFieldPage() {
  return (
    <ComponentDoc name="form-fields">
      <DocSection title="Preview">
        <Preview>
          <FieldDemo defaultValues={{ password: "" }}>
            {(form) => (
              <FormStrongPasswordField
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
        description="A password input with a show/hide toggle, a four-segment strength meter, and a live checklist of the strength rules."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection
        title="Validation"
        description='Strength is enforced automatically: the field reports "Required" when empty and "Password must contain …" listing the unmet rules until all four are satisfied. The stored value is the raw password. Pass your own validators to add further checks (e.g. not in a breach list); they run alongside the built-in one.'
      >
        <PropsTable
          rows={[
            ...baseFieldProps,
            {
              prop: "autoComplete",
              type: "string",
              default: '"new-password"',
              description:
                'Passed through to the input. Use "current-password" when re-entering an existing password.',
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
