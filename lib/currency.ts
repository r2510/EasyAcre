/**
 * Currency symbols by ISO 4217 code for display (price_per_sqft, avg_price).
 * Used so prices show in the country's currency (e.g. ₹ for India, £ for UK).
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  GBP: '£',
  EUR: '€',
  JPY: '¥',
  INR: '₹',
  AED: 'AED ',
  SAR: 'SAR ',
  QAR: 'QAR ',
  SGD: 'S$',
  CNY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF ',
  SEK: 'kr',
  DKK: 'kr',
  NOK: 'kr',
  CZK: 'Kč',
  PLN: 'zł',
  TRY: '₺',
  RUB: '₽',
  KRW: '₩',
  TWD: 'NT$',
  IDR: 'Rp',
  PHP: '₱',
  VND: '₫',
  ILS: '₪',
  MXN: 'MX$',
  BRL: 'R$',
  ARS: '$',
  COP: '$',
  PEN: 'S/',
  CLP: '$',
  ZAR: 'R',
  NGN: '₦',
  KES: 'KSh',
  EGP: 'E£',
  MAD: 'DH',
  ETB: 'Br',
  NZD: 'NZ$',
  THB: '฿',
  MYR: 'RM',
  HUF: 'Ft',
};

export function getCurrencySymbol(currencyCode: string | undefined | null): string {
  if (!currencyCode) return '$';
  return CURRENCY_SYMBOLS[currencyCode.toUpperCase()] ?? currencyCode + ' ';
}

/**
 * Format a price string (e.g. "$350", "$1.1M") using the country's currency symbol.
 * Strips any leading currency symbol from the value and prepends the correct one.
 */
export function formatPrice(value: string | undefined | null, currencyCode: string | undefined | null): string {
  if (value == null || value === '') return '—';
  const symbol = getCurrencySymbol(currencyCode);
  const numericPart = value.replace(/^[^0-9.,\-]+/, '').trim() || value;
  return symbol + numericPart;
}
