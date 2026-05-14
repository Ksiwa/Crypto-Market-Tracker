/**
 * ICoinRepository — Repository Arayüzü (Sözleşme)
 *
 * Domain katmanı bu interface'i TANIMLAR fakat IMPLEMENTE ETMEZ.
 * Data katmanı bu sözleşmeye uymak zorundadır.
 *
 * SOLID → Dependency Inversion Principle (DIP):
 * - Presentation/Domain → Abstraction (interface) bağımlı olur
 * - Data katmanı → Abstraction'ı implemente eder
 * Bu sayede Data katmanı tamamen değiştirilebilir (REST → GraphQL → Mock) ve
 * hiçbir üst katman değişmez.
 *
 * SOLID → Interface Segregation Principle (ISP):
 * Coin listesi ve detay için tek bir interface yeterli (bölmeyi aşırıya kaçmamak gerekir).
 */

import type { Coin } from '@domain/entities/Coin';
import type { CoinDetail } from '@domain/entities/CoinDetail';
import type { AppError } from '@core/errors/AppError';

/**
 * Asenkron işlemlerde başarı/hata durumunu temsil eden tip.
 * `Promise<Either<AppError, T>>` yerine daha okunaklı bir yaklaşım.
 */
export type Result<T> = Promise<{ data: T; error: null } | { data: null; error: AppError }>;

export interface ICoinRepository {
  /**
   * Sayfalı coin listesini getirir.
   * @param page   - Sayfa numarası (1'den başlar)
   * @param perPage - Sayfa başına kayıt sayısı
   */
  getCoins(page: number, perPage: number): Result<Coin[]>;

  /**
   * Belirtilen ID'ye sahip coin'in detaylarını getirir.
   * @param coinId - CoinGecko coin ID'si (örn: "bitcoin")
   */
  getCoinDetail(coinId: string): Result<CoinDetail>;
}
