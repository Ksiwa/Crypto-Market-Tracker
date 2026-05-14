/**
 * CoinDetailDto — Data Transfer Object
 *
 * CoinGecko /coins/{id} endpoint'inin döndürdüğü ham JSON yapısı.
 * Sadece uygulamamızın kullandığı alanları içerir (gereksiz alanlar hariç tutulmuştur).
 *
 * CoinGecko detay yanıtı büyük olduğundan, ihtiyaç duyulan
 * alt nesneler için iç interface'ler tanımlandı.
 */

/** Çoklu dil desteği için açıklama nesnesi */
interface LocalizedDescription {
  readonly en: string;
  readonly tr?: string;
}

/** Piyasa verileri alt nesnesi */
interface MarketDataDto {
  readonly current_price: Record<string, number>;
  readonly market_cap: Record<string, number>;
  readonly market_cap_rank: number;
  readonly total_volume: Record<string, number>;
  readonly price_change_percentage_24h: number;
  readonly price_change_percentage_7d: number;
  readonly price_change_percentage_30d: number;
  readonly ath: Record<string, number>;
  readonly ath_date: Record<string, string>;
  readonly total_supply: number | null;
  readonly circulating_supply: number;
  readonly market_cap_percentage?: Record<string, number>;
}

/** Görsel kaynak nesnesi */
interface ImageDto {
  readonly thumb: string;
  readonly small: string;
  readonly large: string;
}

export interface CoinDetailDto {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly description: LocalizedDescription;
  readonly image: ImageDto;
  readonly market_cap_rank: number;
  readonly market_data: MarketDataDto;
  readonly last_updated: string;
}
