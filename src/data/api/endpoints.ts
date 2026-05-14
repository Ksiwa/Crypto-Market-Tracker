/**
 * API Endpoint Sabitleri
 *
 * Tüm API URL'leri bu dosyadan yönetilir.
 * "Magic string" kullanımını önler; URL değişikliklerini tek noktadan yönetir.
 *
 * SOLID → Single Responsibility: Sadece endpoint tanımları.
 */

export const ENDPOINTS = {
  /**
   * Piyasa verisiyle birlikte coin listesi.
   * Örnek: GET /coins/markets?vs_currency=usd&order=market_cap_desc&page=1&per_page=50
   */
  COIN_MARKETS: '/coins/markets',

  /**
   * Belirli bir coin'in detay bilgisi.
   * Kullanım: ENDPOINTS.coinDetail("bitcoin") → "/coins/bitcoin"
   */
  coinDetail: (coinId: string): string => `/coins/${coinId}`,
} as const;
