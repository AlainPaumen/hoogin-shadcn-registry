import { FormattedCell } from "./formatted.cell";
import { currencyFormatter } from "./formatters.utils";

export function CurrencyCell({ value }: { value: number }) {
    return <FormattedCell value={value} align="right" format={(value) => currencyFormatter(value)} />
}
