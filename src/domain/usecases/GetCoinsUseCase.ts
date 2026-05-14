/**
 * GetCoinsUseCase
 *
 * Domain iş mantığı: Sayfalı coin listesini getir.
 * Use case, Repository interface'i kullanır — somut implementasyonu TANIMAZ.
 *
 * SOLID → Single Responsibility: Sadece "coin listesini getirme" sorumluluğu var.
 * SOLID → Dependency Inversion: Repository'yi interface üzerinden alır (constructor injection).
 *
 * Clean Architecture → Use case katmanı:
 * - UI'dan bağımsız (test edilebilir)
 * - Veri kaynağından bağımsız (mock repository ile test edilebilir)
 */

import type { ICoinRepository, Result } from '@domain/repositories/ICoinRepository';
import type { Coin } from '@domain/entities/Coin';
import { PAGINATION } from '@core/constants/AppConstants';

export class GetCoinsUseCase {
  // Constructor injection ile bağımlılık dışarıdan verilir
  constructor(private readonly repository: ICoinRepository) {}

  /**
   * @param page - İsteğe bağlı sayfa numarası, varsayılan: 1
   */
  execute(page: number = PAGINATION.INITIAL_PAGE): Result<Coin[]> {
    return this.repository.getCoins(page, PAGINATION.PAGE_SIZE);
  }
}
