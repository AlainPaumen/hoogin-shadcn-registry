import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { FieldDemo } from "@/hoogin/docs/field-demo"
import { baseFieldProps } from "@/hoogin/docs/field-props"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { FormSelectField } from "@/hoogin/ui/forms/form-select.field"
import { m } from "@/paraglide/messages.js"

export const Route = createFileRoute("/docs/components/form-select-field")({
  component: FormSelectFieldPage,
})

const roles = ["user", "admin", "editor"] as const

const roleLabels = {
  user: m.role_user(),
  admin: m.role_admin(),
  editor: m.role_editor(),
}

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
      <DocSection title={m.docs_preview()}>
        <Preview>
          <FieldDemo defaultValues={{ role: "user" }}>
            {(form) => (
              <FormSelectField
                form={form}
                name="role"
                label={m.role_label()}
                placeholder={m.role_placeholder()}
                options={roles.map((role) => ({
                  value: role,
                  label: roleLabels[role],
                }))}
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
      <DocSection
        title="Localization"
        description="The shadcn Select primitive owns no strings, so there is nothing to translate inside it. Translate at the call site: pass m.*() for label, description, placeholder, and each option label. With a visible label the trigger's accessible name is the <label> itself; when there is no label, pass ariaLabel to supply the accessible name."
      >
        <CodeBlock
          language="tsx"
          code={`import { m } from "@/paraglide/messages.js"

const roleLabels = {
  user: m.role_user(),
  admin: m.role_admin(),
  editor: m.role_editor(),
}

<FormSelectField
  form={form}
  name="role"
  label={m.role_label()}
  placeholder={m.role_placeholder()}
  options={roles.map((role) => ({ value: role, label: roleLabels[role] }))}
/>`}
        />
        <p className="mt-3 text-sm text-muted-foreground">
          Option labels that come from a server can't be message keys — store the
          label per locale in your data instead of generating keys at runtime.
        </p>
      </DocSection>
      <DocSection title={m.docs_props()}>
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
            {
              prop: "ariaLabel",
              type: "string",
              description:
                "Accessible name used only when no visible label is provided. When label is set, the rendered <label> is referenced instead, so ariaLabel is ignored.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
