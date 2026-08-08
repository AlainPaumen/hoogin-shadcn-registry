import { Square, SquareCheck } from "lucide-react";

export function checkBoxFormatter(value: boolean | undefined) {
    return value ? <SquareCheck /> : <Square />;
}

export function currencyFormatter(value: number, symbol?: string) {
    const currencySymbol = symbol ?? import.meta.env.VITE_CURRENCY_SYMBOL ?? "€";
    return `${currencySymbol} ${(value / 100).toFixed(2)}`;
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
    const format = import.meta.env.VITE_DATE_FORMAT ?? "YYYY/MM/DD";
    return formatDate(new Date(value), format);
}

function formatDate(date: Date, format: string) {
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return format
        .replace("YYYY", year)
        .replace("MM", month)
        .replace("DD", day);
}