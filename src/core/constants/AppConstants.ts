/**
 * AppConstants
 * Uygulama genelinde kullanılan tüm sabit değerler burada tanımlanır.
 * "Magic string/number" kullanımını engellemek için tek kaynak (Single Source of Truth).
 *
 * SOLID → Single Responsibility: Sadece sabit değerleri tutar.
 */

export const API_CONFIG = {
  BASE_URL: 'https://api.coingecko.com/api/v3',
  TIMEOUT_MS: 15_000,
  RETRY_COUNT: 3,
} as const;

export const PAGINATION = {
  /** FlatList'te bir seferde çekilen coin sayısı */
  PAGE_SIZE: 50,
  /** İlk yükleme sayfası */
  INITIAL_PAGE: 1,
  /** CoinGecko desteklediği para birimi */
  VS_CURRENCY: 'usd',
  /** Sıralama kriteri */
  ORDER: 'market_cap_desc',
} as const;

export const LIST_ITEM = {
  /**
   * FlatList getItemLayout için sabit yükseklik (px).
   * Bu değer CoinListItem bileşeninin gerçek render yüksekliğiyle eşleşmelidir.
   */
  ITEM_HEIGHT: 80,
  SEPARATOR_HEIGHT: 1,
  get TOTAL_HEIGHT(): number {
    return this.ITEM_HEIGHT + this.SEPARATOR_HEIGHT;
  },
} as const;

export const LOCALIZATION = {
  CURRENCY_SYMBOL: '$',
  DECIMAL_PLACES: 2,
  LARGE_NUMBER_DECIMALS: 0,
} as const;
