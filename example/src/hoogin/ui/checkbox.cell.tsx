import { FormattedCell } from "./formatted.cell";
import { checkBoxFormatter } from "./formatters.utils";

export function CheckboxCell({ value }: { value?: boolean }) {
    return <FormattedCell value={value} align="center" format={(value) => checkBoxFormatter(value)} />
}
