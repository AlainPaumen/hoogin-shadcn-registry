# Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Type error on `form={form}` of every field | `validators` passed to `useForm` | move each rule to its field |
| Type error on `name` | key's value type doesn't match the field | pick the field for that type, or fix the schema |
| `expected number, received NaN` | empty number/currency field | `z.number({ error: m.x_required() })` |
| `Invalid option: expected one of …` | default enum message | `z.enum(values, { error: m.x_pick() })` |
| A custom field never shows errors | no `field.handleBlur()` | call it on blur / popover close |
| Form shows the previous record's values | `defaultValues` read once | `key={record.id}` on the form |
| Required asterisk wrong | `required` hardcoded | `isRequiredField(schema.shape.x)` |
| English validation text in another locale | literal message in the schema | `m.*()` key in every locale |
