/**
 * useHomeViewModel — Ana Ekran Veri Mantığı
 *
 * MVVM benzeri Custom Hook Pattern:
 * - View (HomeScreen)   → Sadece render eder, hook'tan dönen state'i kullanır
 * - ViewModel (bu hook) → Veri çekme, state yönetimi, side effect'leri yönetir
 * - Model               → Zustand store + Use Case
 *
 * SOLID → Single Responsibility: Sadece HomeScreen'in veri akışını yönetir.
 * SOLID → Dependency Inversion: Repository'yi doğrudan değil, Use Case üzerinden kullanır.
 *
 * Bu sayede HomeScreen bileşeni tamamen "dumb component" haline gelir —
 * sadece props'u render eder, iş mantığına dokunmaz.
 */

import { useCallback, useEffect } from 'react';
import {
  useCoinStore,
  selectCoins,
  selectIsLoading,
  selectIsRefreshing,
  selectIsLoadingMore,
  selectError,
  selectCurrentPage,
  selectHasMorePages,
} from '@presentation/store/coinStore';
import { GetCoinsUseCase } from '@domain/usecases/GetCoinsUseCase';
import { CoinRepository } from '@data/repositories/CoinRepository';
import { PAGINATION } from '@core/constants/AppConstants';
import type { Coin } from '@domain/entities/Coin';
import type { AppError } from '@core/errors/AppError';

// ─── Dependency Composition Root ─────────────────────────────────────────────
// Gerçek bir uygulamada bu injection bir DI Container (inversify vb.) ile yapılır.
// Basitlik için burada manuel composition kullanıyoruz.
// NOT: Singleton pattern — her render'da yeni instance oluşturulmaz.
const repository = new CoinRepository();
const getCoinsUseCase = new GetCoinsUseCase(repository);

// ─── ViewModel Çıktı Tipi ─────────────────────────────────────────────────────

export interface HomeViewModelOutput {
  coins: Coin[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: AppError | null;
  hasMorePages: boolean;
  /** İlk yükleme veya pull-to-refresh sonrası tüm listeyi yeniler */
  onRefresh: () => void;
  /** Listenin sonuna gelindiğinde sonraki sayfayı yükler */
  onLoadMore: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHomeViewModel(): HomeViewModelOutput {
  // Zustand selector'ları ile sadece ilgili state parçaları seçilir
  // Bu, gereksiz re-render'ları önler (performans kritik)
  const coins = useCoinStore(selectCoins);
  const isLoading = useCoinStore(selectIsLoading);
  const isRefreshing = useCoinStore(selectIsRefreshing);
  const isLoadingMore = useCoinStore(selectIsLoadingMore);
  const error = useCoinStore(selectError);
  const currentPage = useCoinStore(selectCurrentPage);
  const hasMorePages = useCoinStore(selectHasMorePages);

  // Store action'ları doğrudan alınır — selector olmadan, bunlar primitive değil
  const {
    setCoins,
    appendCoins,
    setLoading,
    setRefreshing,
    setLoadingMore,
    setError,
    incrementPage,
    resetPage,
    setHasMorePages,
  } = useCoinStore();

  // ─── İlk Yükleme ────────────────────────────────────────────────────────────

  const fetchInitialCoins = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await getCoinsUseCase.execute(PAGINATION.INITIAL_PAGE);

    if (result.error !== null) {
      setError(result.error);
    } else {
      setCoins(result.data);
      // Sayfa tam dolu geldiyse daha fazla sayfa olabilir
      setHasMorePages(result.data.length >= PAGINATION.PAGE_SIZE);
    }

    setLoading(false);
  }, [setLoading, setError, setCoins, setHasMorePages]);

  // ─── Pull-to-Refresh ────────────────────────────────────────────────────────

  /**
   * useCallback: onRefresh referansı sadece bağımlılıklar değiştiğinde yenilenir.
   * FlatList'e prop olarak geçildiğinde gereksiz re-render'ı önler.
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    resetPage();

    const result = await getCoinsUseCase.execute(PAGINATION.INITIAL_PAGE);

    if (result.error !== null) {
      setError(result.error);
    } else {
      setCoins(result.data); // Append değil, replace
      setHasMorePages(result.data.length >= PAGINATION.PAGE_SIZE);
    }

    setRefreshing(false);
  }, [setRefreshing, setError, resetPage, setCoins, setHasMorePages]);

  // ─── Pagination — Load More ─────────────────────────────────────────────────

  /**
   * FlatList'in onEndReached callback'i — sonsuz kaydırma için.
   * Guard koşulları: zaten yüklüyorsa veya daha fazla sayfa yoksa çağrılmaz.
   */
  const onLoadMore = useCallback(async () => {
    // Aynı anda birden fazla istek gönderilmesini önle
    if (isLoadingMore || isLoading || isRefreshing || !hasMorePages) {
      return;
    }

    const nextPage = currentPage + 1;
    setLoadingMore(true);

    const result = await getCoinsUseCase.execute(nextPage);

    if (result.error !== null) {
      setError(result.error);
    } else {
      appendCoins(result.data);
      incrementPage();
      setHasMorePages(result.data.length >= PAGINATION.PAGE_SIZE);
    }

    setLoadingMore(false);
  }, [
    isLoadingMore,
    isLoading,
    isRefreshing,
    hasMorePages,
    currentPage,
    setLoadingMore,
    appendCoins,
    incrementPage,
    setHasMorePages,
    setError,
  ]);

  // ─── Mount Effect ────────────────────────────────────────────────────────────

  useEffect(() => {
    // Eğer coin listesi boşsa (uygulama ilk açıldığında) veri çek
    if (coins.length === 0) {
      void fetchInitialCoins();
    }
    // fetchInitialCoins kasıtlı olarak bağımlılıktan çıkarılmadı
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    coins,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    hasMorePages,
    onRefresh,
    onLoadMore,
  };
}
