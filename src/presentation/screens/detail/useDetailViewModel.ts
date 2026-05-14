/**
 * useDetailViewModel — Coin Detay Ekranı Veri Mantığı
 *
 * HomeScreen ile aynı MVVM pattern'ini uygular:
 * - View (DetailScreen) sadece render eder
 * - Bu hook veri çekme ve state yönetimini üstlenir
 *
 * SOLID → Single Responsibility: Sadece detay ekranının veri akışı.
 */

import { useCallback, useEffect } from 'react';
import {
  useCoinStore,
  selectDetail,
  selectIsDetailLoading,
  selectDetailError,
} from '@presentation/store/coinStore';
import { GetCoinDetailUseCase } from '@domain/usecases/GetCoinDetailUseCase';
import { CoinRepository } from '@data/repositories/CoinRepository';
import type { CoinDetail } from '@domain/entities/CoinDetail';
import type { AppError } from '@core/errors/AppError';

// ─── Composition Root ─────────────────────────────────────────────────────────
const repository = new CoinRepository();
const getCoinDetailUseCase = new GetCoinDetailUseCase(repository);

// ─── ViewModel Çıktı Tipi ─────────────────────────────────────────────────────

export interface DetailViewModelOutput {
  detail: CoinDetail | null;
  isLoading: boolean;
  error: AppError | null;
  onRetry: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDetailViewModel(coinId: string): DetailViewModelOutput {
  const detail = useCoinStore(selectDetail);
  const isLoading = useCoinStore(selectIsDetailLoading);
  const error = useCoinStore(selectDetailError);

  const { setDetail, setDetailLoading, setDetailError } = useCoinStore();

  const fetchDetail = useCallback(async () => {
    setDetailLoading(true);
    setDetailError(null);

    const result = await getCoinDetailUseCase.execute(coinId);

    if (result.error !== null) {
      setDetailError(result.error);
    } else {
      setDetail(result.data);
    }

    setDetailLoading(false);
  }, [coinId, setDetail, setDetailLoading, setDetailError]);

  // Ekran açıldığında detay çek, ekrandan çıkıldığında state'i temizle
  useEffect(() => {
    void fetchDetail();

    return () => {
      // Ekrandan çıkıldığında eski detay temizlenir (bir sonraki coin için hazır)
      setDetail(null);
      setDetailError(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinId]);

  return {
    detail,
    isLoading,
    error,
    onRetry: fetchDetail,
  };
}
