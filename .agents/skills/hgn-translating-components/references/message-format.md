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

Plurals use Paraglide **variants**, backed by `Intl.PluralRules`. This is the
shipped `dataTable_rowsSelected` message
(`example/src/messages/registry/data-table/en.json`), which compiles with
Paraglide 2.x — copy its shape:

```json
"dataTable_rowsSelected": [
  {
    "declarations": [
      "input selected",
      "input total",
      "local countPlural = selected: plural"
    ],
    "selectors": ["countPlural"],
    "match": {
      "countPlural=one": "{selected} of {total} row selected.",
      "countPlural=other": "{selected} of {total} rows selected."
    }
  }
]
```

```tsx
m.dataTable_rowsSelected({ selected: selectedCount, total: rowCount })
```

Every `input` becomes a parameter; the `local … : plural` declaration picks the
plural category of one of them. `one` and `other` are the categories English and
Dutch need; other locales add their own (`few`, `many`, …) in their own bundle.

## Strings hidden in shadcn primitives

Base shadcn components carry hardcoded English that is easy to miss. When such a
primitive is part of our registry, translate these too:

- Screen-reader text such as `<span className="sr-only">Close</span>` in Dialog and
  Sheet.
- Pagination's "Previous", "Next", and "More pages".
- `aria-label`s in Breadcrumb and Carousel.
- The Calendar and DatePicker: pass react-day-picker a date-fns locale matching
  `getLocale()`, so month names and the first day of the week are localized.
