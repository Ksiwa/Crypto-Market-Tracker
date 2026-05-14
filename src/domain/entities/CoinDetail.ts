/**
 * CoinDetail Entity
 *
 * Coin detay ekranı için genişletilmiş veri modeli.
 * Domain katmanında tanımlanır — herhangi bir API veya UI bağımlılığı yoktur.
 */

export interface CoinDetail {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly imageUrl: string;
  /** Coin'in resmi açıklaması (İngilizce) */
  readonly description: string;
  readonly currentPrice: number;
  readonly marketCap: number;
  readonly marketCapRank: number;
  readonly priceChangePercentage24h: number;
  readonly priceChangePercentage7d: number;
  readonly priceChangePercentage30d: number;
  /** Tüm zamanların en yüksek fiyatı */
  readonly allTimeHigh: number;
  readonly allTimeHighDate: string;
  /** Toplam arz miktarı (null olabilir — bazı coin'lerde sınırsız arz vardır) */
  readonly totalSupply: number | null;
  /** Dolaşımdaki arz miktarı */
  readonly circulatingSupply: number;
  /** 24 saatlik işlem hacmi */
  readonly totalVolume: number;
  /** Piyasa hâkimiyeti yüzdesi */
  readonly marketCapDominance: number | null;
}
