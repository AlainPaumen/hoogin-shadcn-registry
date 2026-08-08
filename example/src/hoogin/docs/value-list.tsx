import { Fragment } from "react"

export function ValueList({
  values,
  mask = [],
}: {
  values: Record<string, unknown>
  mask?: string[]
}) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-2">
      {Object.entries(values).map(([key, value]) => (
        <Fragment key={key}>
          <dt className="font-medium text-foreground">{key}</dt>
          <dd>
            {mask.includes(key)
              ? "•".repeat(String(value).length)
              : String(value)}
          </dd>
        </Fragment>
      ))}
    </dl>
  )
}
