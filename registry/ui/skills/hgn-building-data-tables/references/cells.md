# Cells

Import from `@/hoogin/ui/data-table/cells/<name>.cell`. Every cell takes
`value`; pass `row.original.<field>`.

| Cell | `value` | Renders | Other props |
| --- | --- | --- | --- |
| `TextCell` | `string` | muted text | — |
| `EmailCell` | `string` | muted text | — |
| `DateCell` | ISO `string` | `formatDate` in the active locale | — |
| `CurrencyCell` | `number`, integer cents | `formatCurrency(value / 100, "EUR")`, right-aligned | — |
| `CheckboxCell` | `boolean \| undefined` | checked / empty square, centered | — |
| `BadgeCell` | `string` | `Badge` with `labelByValue[value]`, else `label`, else `value` | `labelByValue`, `label`, `variantByValue` (keyed on the raw value), `variant` (default `secondary`) |
| `FormattedCell` | any `ReactNode` | muted text | `format: (value) => ReactNode`, `align: "left" \| "right" \| "center"` |
| `ActionCell` | — | "⋯" menu: Detail, Edit, Delete | `onDetail`, `onEdit`, `onDelete` |

## Formatters

From `cells/formatters.utils.tsx`, for `FormattedCell`'s `format`:
`currencyFormatter(cents, currency = "EUR")`, `dateFormatter(iso)`,
`minutesFormatter(minutes)` → `1h 5m`, `checkBoxFormatter(bool)`,
`nationalNumberFormatter(digits)` (Belgian national number).

```tsx
cell: ({ row }) => (
  <FormattedCell value={row.original.duration} align="right" format={minutesFormatter} />
)
```

## Custom cells

When `FormattedCell` + a formatter isn't enough, write a component in your app
(not under `src/hoogin/`) taking `{ value }`, and pass callbacks for any action
in from the page, as `ActionCell` does.
