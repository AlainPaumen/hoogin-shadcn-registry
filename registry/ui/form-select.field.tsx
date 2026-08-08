import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  FormField,
  type FormFieldProps,
  type KeysOfType,
} from "@/hoogin/ui/form.field"

type SelectOption = {
  value: string
  label: string
}

export function FormSelectField<
  TFormData,
  TName extends KeysOfType<TFormData, string>,
>({
  form,
  name,
  label,
  description,
  required,
  validators,
  disabled,
  placeholder,
  options,
  className,
}: Omit<FormFieldProps<TFormData, TName>, "children"> & {
  disabled?: boolean
  placeholder?: string
  options: SelectOption[]
}) {
  return (
    <FormField
      form={form}
      name={name}
      label={label}
      description={description}
      required={required}
      validators={validators}
      className={className}
    >
      {(field) => (
        <Select
          items={options}
          value={(field.state.value as string) || undefined}
          onValueChange={(value) =>
            field.handleChange(value as typeof field.state.value)
          }
          onOpenChange={() => field.handleBlur()}
          disabled={disabled}
        >
          <SelectTrigger
            aria-invalid={field.invalid || undefined}
            className={cn("w-full", className)}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                label={option.label}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  )
}
