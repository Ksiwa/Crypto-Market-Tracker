/**
 * CoinDetailMapper — Detay DTO'dan Entity'ye Dönüştürücü
 *
 * CoinGecko /coins/{id} yanıtını (CoinDetailDto) domain modelimize (CoinDetail) dönüştürür.
 * market_data iç nesnesinin içinden ihtiyaç duyulan alanları çıkartır.
 *
 * SOLID → Single Responsibility: Sadece CoinDetailDto → CoinDetail dönüşümü.
 */

import type { CoinDetail } from '@domain/entities/CoinDetail';
import type { CoinDetailDto } from '@data/dto/CoinDetailDto';
import { PAGINATION } from '@core/constants/AppConstants';

export class CoinDetailMapper {
  static toDomain(dto: CoinDetailDto): CoinDetail {
    const { market_data: md } = dto;
    const currency = PAGINATION.VS_CURRENCY; // "usd"

    return {
      id: dto.id,
      symbol: dto.symbol.toUpperCase(),
      name: dto.name,
      // Büyük kaliteli görsel için "large" boyutunu kullan
      imageUrl: dto.image.large,
      // Açıklama içinde HTML tag'leri olabilir — saf metin için strip edilmeli
      description: stripHtmlTags(dto.description.en ?? ''),
      currentPrice: md.current_price[currency] ?? 0,
      marketCap: md.market_cap[currency] ?? 0,
      marketCapRank: dto.market_cap_rank,
      priceChangePercentage24h: md.price_change_percentage_24h ?? 0,
      priceChangePercentage7d: md.price_change_percentage_7d ?? 0,
      priceChangePercentage30d: md.price_change_percentage_30d ?? 0,
      allTimeHigh: md.ath[currency] ?? 0,
      allTimeHighDate: md.ath_date[currency] ?? '',
      totalSupply: md.total_supply,
      circulatingSupply: md.circulating_supply ?? 0,
      totalVolume: md.total_volume[currency] ?? 0,
      marketCapDominance: md.market_cap_percentage?.[dto.symbol] ?? null,
    };
  }
}

/**
 * CoinGecko açıklama alanlarındaki HTML tag'lerini temizler.
 * Örnek: "<a href='...'>Bitcoin</a>" → "Bitcoin"
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
