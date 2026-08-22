import { FormattedCell } from "./formatted.cell";

export function EmailCell({ value }: { value: string }) {
    return <FormattedCell value={value} align="left" />
}
