import { FormattedCell } from "./formatted.cell";

export function TextCell({ value }: { value: string }) {
    return <FormattedCell value={value} align="left" />
}