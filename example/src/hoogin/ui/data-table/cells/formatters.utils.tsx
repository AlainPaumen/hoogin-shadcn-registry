import { Square, SquareCheck } from "lucide-react";

import { formatCurrency, formatDate } from "@/lib/i18n/format";

export function checkBoxFormatter(value: boolean | undefined) {
    return value ? <SquareCheck /> : <Square />;
}

export function currencyFormatter(value: number, currency = "EUR") {
    return formatCurrency(value / 100, currency);
}

export function minutesFormatter(value: number) {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    if (hours === 0) {
        return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
}

export function nationalNumberFormatter(value: string) {
    if (!value || value.trim().length == 0) return '';

    const formattedString = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4, 6) + '-' + value.slice(6, 9) + '.' + value.slice(9);
    return formattedString;
}

export function dateFormatter(value: string) {
    return formatDate(new Date(value));
}
