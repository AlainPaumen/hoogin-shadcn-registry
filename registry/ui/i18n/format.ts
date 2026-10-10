import { getLocale } from "@/paraglide/runtime"

export const formatDate = (d: Date, opts?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(getLocale(), { dateStyle: "medium", ...opts }).format(d)

export const formatNumber = (n: number, opts?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(getLocale(), opts).format(n)

export const formatCurrency = (n: number, currency = "EUR") =>
  new Intl.NumberFormat(getLocale(), { style: "currency", currency }).format(n)