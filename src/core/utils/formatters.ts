/**
 * Formatters — Para birimi ve sayı formatlama yardımcıları
 *
 * Saf (pure) fonksiyonlar, dışarıya bağımlılığı yoktur.
 * SOLID → Single Responsibility: Sadece sunum için veri dönüştürme yapar.
 */

import { LOCALIZATION } from '@core/constants/AppConstants';

/**
 * Fiyatı USD formatına dönüştürür.
 * Örnek: 45231.5  →  "$45,231.50"
 *        0.000012 →  "$0.000012"
 */
export function formatPrice(price: number): string {
  if (price >= 1) {
    return `${LOCALIZATION.CURRENCY_SYMBOL}${price.toLocaleString('en-US', {
      minimumFractionDigits: LOCALIZATION.DECIMAL_PLACES,
      maximumFractionDigits: LOCALIZATION.DECIMAL_PLACES,
    })}`;
  }
  // Küçük değerler için daha fazla ondalık basamak göster
  return `${LOCALIZATION.CURRENCY_SYMBOL}${price.toPrecision(4)}`;
}

/**
 * Market cap değerini kısaltılmış formata dönüştürür.
 * Örnek: 850_000_000_000  →  "$850.0B"
 *        1_500_000_000    →  "$1.5B"
 *        235_000_000      →  "$235.0M"
 */
export function formatMarketCap(value: number): string {
  const symbol = LOCALIZATION.CURRENCY_SYMBOL;

  if (value >= 1_000_000_000_000) {
    return `${symbol}${(value / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (value >= 1_000_000_000) {
    return `${symbol}${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
  }
  return `${symbol}${value.toLocaleString('en-US')}`;
}

/**
 * 24 saatlik yüzde değişimini formatlar.
 * Örnek:  5.23  →  "+5.23%"
 *        -2.10  →  "-2.10%"
 */
export function formatPercentageChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(LOCALIZATION.DECIMAL_PLACES)}%`;
}
