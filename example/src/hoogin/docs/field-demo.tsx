import { useForm } from "@tanstack/react-form"
import type { ReactNode } from "react"

import { toast } from "@/components/ui/toast"
import { ValueList } from "@/hoogin/docs/value-list"
import { Form, FormBody, FormFooter } from "@/hoogin/ui/forms/form"

function useFieldDemoForm<TValues extends Record<string, unknown>>(
  defaultValues: TValues,
) {
  return useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      toast.add({
        type: "success",
        title: "Submitted",
        description: <ValueList values={value} />,
      })
    },
  })
}

export type FieldDemoForm<
  TValues extends Record<string, unknown>,
> = ReturnType<typeof useFieldDemoForm<TValues>>

export function FieldDemo<TValues extends Record<string, unknown>>({
  defaultValues,
  children,
}: {
  defaultValues: TValues
  children: (form: FieldDemoForm<TValues>) => ReactNode
}) {
  const form = useFieldDemoForm(defaultValues)
  return (
    <Form form={form} className="flex w-full max-w-sm flex-col gap-4">
      <FormBody>{children(form)}</FormBody>
      <FormFooter form={form} onCancel={() => {}} submitLabel="Submit" />
    </Form>
  )
}
