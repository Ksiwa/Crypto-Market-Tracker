/**
 * CoinMapper — DTO'dan Entity'ye Dönüştürücü
 *
 * CoinGecko'nun ham API yanıtını (CoinDto) domain modelimize (Coin) dönüştürür.
 * API şeması veya domain modeli değişirse sadece bu dosya güncellenir.
 *
 * SOLID → Single Responsibility: Sadece CoinDto → Coin dönüşümü yapar.
 *
 * NOT: Statik metod olarak tasarlandı — instance gerektirmez, test edilmesi kolaydır.
 */

import type { Coin } from '@domain/entities/Coin';
import type { CoinDto } from '@data/dto/CoinDto';

export class CoinMapper {
  /**
   * Tek bir DTO'yu Entity'e dönüştürür.
   */
  static toDomain(dto: CoinDto): Coin {
    return {
      id: dto.id,
      symbol: dto.symbol.toUpperCase(),
      name: dto.name,
      imageUrl: dto.image,
      currentPrice: dto.current_price,
      marketCap: dto.market_cap,
      marketCapRank: dto.market_cap_rank,
      // Zaman zaman CoinGecko bu alanı null döner — güvenli fallback
      priceChangePercentage24h: dto.price_change_percentage_24h ?? 0,
      totalVolume: dto.total_volume,
    };
  }

  /**
   * DTO dizisini Entity dizisine toplu dönüştürür.
   */
  static toDomainList(dtos: CoinDto[]): Coin[] {
    return dtos.map(CoinMapper.toDomain);
  }
}
