# Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| A facet filter hides every row | no array `filterFn` on the column | add the `filterFn` from the recipe |
| `Type '"arrIncludesSome"' is not assignable` | filter function names aren't registered | pass a function as `filterFn` |
| A column is missing from search | first value isn't a string/number, `enableGlobalFilter: false`, or not in `filterableColumns` | add it to `filterableColumns`, or search a string column |
| The View menu shows a column id | function `header` and no `filterableColumns` caption | add a caption, or `enableHiding: false` |
| `bulkActions` never shows | `enableRowSelection` not set | set it |
| Dates sort wrongly | non-ISO strings, or no `sortFn: "datetime"` | store ISO strings and set `sortFn: "datetime"` |
| Amount 100× off | value isn't in cents | convert to integer cents at the API boundary |
| `getState is not a function`, v8 types in errors | v8 code | use the v9 API (`table.state.*`, `DataTableColumnDef`) |
| A facet option matches nothing | option `value` differs from the raw column value | use the raw values (`"paid"`, not the label) |
