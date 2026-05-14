/**
 * GetCoinDetailUseCase
 *
 * Domain iş mantığı: Belirtilen ID'ye sahip coin'in detaylarını getir.
 *
 * SOLID → Single Responsibility: Sadece "coin detayını getirme" sorumluluğu.
 * SOLID → Dependency Inversion: ICoinRepository interface'i üzerinden çalışır.
 */

import type { ICoinRepository, Result } from '@domain/repositories/ICoinRepository';
import type { CoinDetail } from '@domain/entities/CoinDetail';

export class GetCoinDetailUseCase {
  constructor(private readonly repository: ICoinRepository) {}

  /**
   * @param coinId - CoinGecko coin ID'si (örn: "bitcoin", "ethereum")
   */
  execute(coinId: string): Result<CoinDetail> {
    return this.repository.getCoinDetail(coinId);
  }
}
