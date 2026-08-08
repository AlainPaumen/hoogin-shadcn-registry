import type { PropRow } from "@/hoogin/docs/props-table"

export const baseFieldProps: PropRow[] = [
  {
    prop: "form",
    type: "ReactFormExtendedApi<TFormData>",
    description:
      "The TanStack Form instance. Pass the object returned by useForm. The component binds its own form.Field to this instance.",
  },
  {
    prop: "name",
    type: "TName",
    description:
      "A key (or dot path) of the form data, constrained to keys whose value type fits the control.",
  },
  {
    prop: "label",
    type: "string",
    description: "Field label. A required marker is appended when required is true.",
  },
  {
    prop: "required",
    type: "boolean",
    description: "Shows the required asterisk. Derive it with isRequiredField(yourZodSchema).",
  },
  {
    prop: "description",
    type: "string",
    description: "Optional helper text rendered under the control.",
  },
  {
    prop: "validators",
    type: "FieldValidators<TFormData, TName, TData>",
    description:
      "Optional field validators. Pass a zod schema per event, e.g. { onChange: yourSchema.shape.field }. Error messages come from TanStack Form's field state.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Disables the control.",
  },
  {
    prop: "className",
    type: "string",
    description: "Extra classes for the control.",
  },
]
