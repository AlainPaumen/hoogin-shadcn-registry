# Search, facet filters and sorting

## Search

- Case-insensitive substring match on each cell's raw value
  (`row.getValue`), not the rendered text.
- Searched columns: those whose first non-empty value is a string or number,
  minus `enableGlobalFilter: false`, limited to `filterableColumns` when given.
- With more than one searched column, a picker next to the input narrows search
  to one column.

## Facet filters

- Each `filters` entry renders a popover with a checkbox per option and live
  counts.
- Selecting options sets a `string[]` on the column, so the column needs the
  array `filterFn` from the main recipe. Named filter functions
  (`"arrIncludesSome"`) are not registered and don't type-check.
- The reset button clears search and every facet filter.

## Sorting

- Clicking a sortable header cycles through both directions and unsorted.
  Opt out with `enableSorting: false`.
- `sortFn` names that are registered: `alphanumeric`,
  `alphanumericCaseSensitive`, `text`, `textCaseSensitive`, `datetime`,
  `basic`; or pass a function. Unset, it's chosen from the values.
- `initialSorting` uses column ids.
