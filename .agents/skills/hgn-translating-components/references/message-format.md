# Message format details

## Parameters

A message value can interpolate named parameters:

```json
{ "dataTable_pageOf": "Page {page} of {total}" }
```

```tsx
m.dataTable_pageOf({ page, total })
```

## Plurals

Plurals use Paraglide **variants**, backed by `Intl.PluralRules`. The selector name
and categories come from the number of plural forms the target locale needs.

```json
"dataTable_rowsSelected": [
  {
    "declarations": ["input count", "local countPlural = count: plural"],
    "selectors": ["countPlural"],
    "match": {
      "countPlural=one": "{count} row selected",
      "countPlural=other": "{count} rows selected"
    }
  }
]
```

`one` and `other` are the categories English needs; other locales add their own
(`few`, `many`, …). Verify the exact syntax against the current inlang
message-format docs before relying on it — it has changed between Paraglide
versions.

## Strings hidden in shadcn primitives

Base shadcn components carry hardcoded English that is easy to miss. When such a
primitive is part of our registry, translate these too:

- Screen-reader text such as `<span className="sr-only">Close</span>` in Dialog and
  Sheet.
- Pagination's "Previous", "Next", and "More pages".
- `aria-label`s in Breadcrumb and Carousel.
- The Calendar and DatePicker: pass react-day-picker a date-fns locale matching
  `getLocale()`, so month names and the first day of the week are localized.
