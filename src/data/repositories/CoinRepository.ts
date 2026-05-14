/**
 * CoinRepository — ICoinRepository Implementasyonu
 *
 * Domain katmanının tanımladığı `ICoinRepository` sözleşmesini bu dosya karşılar.
 * Bu dosya Data katmanına aittir ve Axios + DTO + Mapper kullanır.
 *
 * SOLID → Liskov Substitution: ICoinRepository sözleşmesine tam uyum.
 * SOLID → Dependency Inversion: Domain katmanı bu sınıfı DOĞRUDAN TANIMAZ,
 * sadece ICoinRepository interface'ini bilir. Somut sınıf injection ile verilir.
 *
 * Clean Architecture → Tüm ağ altyapısı bu katmanda izole edilir.
 */

import type { ICoinRepository, Result } from '@domain/repositories/ICoinRepository';
import type { Coin } from '@domain/entities/Coin';
import type { CoinDetail } from '@domain/entities/CoinDetail';
import { AppError } from '@core/errors/AppError';
import { apiClient } from '@data/api/axiosInstance';
import { ENDPOINTS } from '@data/api/endpoints';
import { PAGINATION } from '@core/constants/AppConstants';
import type { CoinDto } from '@data/dto/CoinDto';
import type { CoinDetailDto } from '@data/dto/CoinDetailDto';
import { CoinMapper } from '@data/mappers/CoinMapper';
import { CoinDetailMapper } from '@data/mappers/CoinDetailMapper';

export class CoinRepository implements ICoinRepository {
  async getCoins(page: number, perPage: number): Result<Coin[]> {
    try {
      const response = await apiClient.get<CoinDto[]>(ENDPOINTS.COIN_MARKETS, {
        params: {
          vs_currency: PAGINATION.VS_CURRENCY,
          order: PAGINATION.ORDER,
          per_page: perPage,
          page,
          sparkline: false, // Sparkline verisi kullanılmıyor, bant genişliği tasarrufu
          price_change_percentage: '24h',
        },
      });

      const coins = CoinMapper.toDomainList(response.data);
      return { data: coins, error: null };
    } catch (error: unknown) {
      // Interceptor zaten AppError'a map etti, yeniden wrap etmeden ilet
      const appError = isAppError(error)
        ? error
        : AppError.unknown(error);
      return { data: null, error: appError };
    }
  }

  async getCoinDetail(coinId: string): Result<CoinDetail> {
    try {
      const response = await apiClient.get<CoinDetailDto>(ENDPOINTS.coinDetail(coinId), {
        params: {
          localization: false,     // Çoklu dil verisi gerekmez
          tickers: false,          // Borsa ticker'ları gerekmez
          market_data: true,       // Fiyat verileri gerekli
          community_data: false,   // Sosyal medya verileri gerekmez
          developer_data: false,   // Geliştirici verileri gerekmez
        },
      });

      const coinDetail = CoinDetailMapper.toDomain(response.data);
      return { data: coinDetail, error: null };
    } catch (error: unknown) {
      const appError = isAppError(error)
        ? error
        : AppError.unknown(error);
      return { data: null, error: appError };
    }
  }
}

// ─── Type Guard ───────────────────────────────────────────────────────────────

import type { AppError as AppErrorType } from '@core/errors/AppError';

/**
 * Interceptor'ın zaten dönüştürdüğü AppError nesnelerini tespit eder.
 * `any` kullanmak yerine `kind` alanını kontrol ederek tip güvenliği sağlar.
 */
function isAppError(error: unknown): error is AppErrorType {
  return (
    typeof error === 'object' &&
    error !== null &&
    'kind' in error &&
    typeof (error as Record<string, unknown>).kind === 'string'
  );
}
