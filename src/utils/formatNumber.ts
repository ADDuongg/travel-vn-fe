export function formatCount(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatAreaKm2(value: number, locale: string) {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)} km2`;
}
