export type PropRow = {
  prop: string
  type: string
  default?: string
  description?: string
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th className="px-4 py-2 font-medium">Prop</th>
            <th className="px-4 py-2 font-medium">Type</th>
            <th className="px-4 py-2 font-medium">Default</th>
            <th className="px-4 py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                No props documented.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
            <tr key={row.prop} className="border-b last:border-b-0">
              <td className="px-4 py-2 font-mono text-xs">{row.prop}</td>
              <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                {row.type}
              </td>
              <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                {row.default ?? "—"}
              </td>
              <td className="px-4 py-2 text-muted-foreground">
                {row.description ?? ""}
              </td>
            </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
