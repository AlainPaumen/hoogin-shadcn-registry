import { FormattedCell } from "./formatted.cell";
import { dateFormatter } from "./formatters.utils";

export function DateCell({ value }: { value: string }) {
    return <FormattedCell value={value} align="left" format={(value) => dateFormatter(value)} />
}   