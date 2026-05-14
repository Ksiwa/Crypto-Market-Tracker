/**
 * CoinDto — Data Transfer Object
 *
 * CoinGecko /coins/markets endpoint'inin döndürdüğü ham JSON yapısı.
 * Bu tip SADECE API yanıtlarını temsil eder — iş mantığıyla karışmaz.
 *
 * Neden ayrı DTO? API şeması değişirse sadece bu dosya ve mapper güncellenir,
 * domain katmanı ve UI tamamen korunur.
 *
 * NOT: Alan isimleri CoinGecko API'sinin snake_case sözleşmesine uyar.
 */

export interface CoinDto {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly image: string;
  readonly current_price: number;
  readonly market_cap: number;
  readonly market_cap_rank: number;
  readonly price_change_percentage_24h: number;
  readonly total_volume: number;
  readonly fully_diluted_valuation: number | null;
  readonly high_24h: number;
  readonly low_24h: number;
  readonly price_change_24h: number;
  readonly market_cap_change_24h: number;
  readonly market_cap_change_percentage_24h: number;
  readonly circulating_supply: number;
  readonly total_supply: number | null;
  readonly max_supply: number | null;
  readonly ath: number;
  readonly ath_change_percentage: number;
  readonly ath_date: string;
  readonly atl: number;
  readonly atl_change_percentage: number;
  readonly atl_date: string;
  readonly last_updated: string;
}
