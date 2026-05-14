/**
 * Coin Entity
 *
 * Domain katmanının temel veri modeli. Bu interface UI framework'üne veya
 * API'ye BAĞIMLI DEĞİLDİR. Sadece iş kurallarını temsil eder.
 *
 * Clean Architecture → Domain katmanı dışarıya bağımlı olmaz,
 * dışarısı domain katmanına bağımlı olur (Dependency Rule).
 */

export interface Coin {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  /** CoinGecko'nun küçük boyutlu ikon URL'si */
  readonly imageUrl: string;
  /** Anlık USD fiyatı */
  readonly currentPrice: number;
  /** Toplam piyasa değeri (USD) */
  readonly marketCap: number;
  /** Market cap sıralama pozisyonu */
  readonly marketCapRank: number;
  /** Son 24 saatlik fiyat değişimi (yüzde) */
  readonly priceChangePercentage24h: number;
  /** 24 saatlik işlem hacmi */
  readonly totalVolume: number;
}
