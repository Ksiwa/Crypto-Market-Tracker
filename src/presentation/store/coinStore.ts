/**
 * Coin Store — Zustand Global State Yönetimi
 *
 * Uygulamanın merkezi state deposu. Hem state değerlerini hem de
 * bu state'i güncelleyen action'ları tek bir yerde toplar.
 *
 * Neden Zustand?
 * - Redux'a göre çok daha az boilerplate
 * - Context'e göre re-render optimizasyonu (selector ile)
 * - TypeScript ile mükemmel tip desteği
 *
 * SOLID → Single Responsibility: Sadece coin listesi ve detay state'ini yönetir.
 * SOLID → Open/Closed: Yeni slice'lar mevcut store'u bozmadan eklenebilir.
 *
 * Pattern: Store, sadece STATE tutar. Veri çekme mantığı Custom Hook'larda.
 * Bu ayrım, store'un test edilmesini kolaylaştırır.
 */

import { create } from 'zustand';
import type { Coin } from '@domain/entities/Coin';
import type { CoinDetail } from '@domain/entities/CoinDetail';
import type { AppError } from '@core/errors/AppError';

// ─── State Tipi ───────────────────────────────────────────────────────────────

interface CoinListState {
  coins: Coin[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: AppError | null;
  currentPage: number;
  hasMorePages: boolean;
}

interface CoinDetailState {
  detail: CoinDetail | null;
  isDetailLoading: boolean;
  detailError: AppError | null;
}

// ─── Action Tipi ─────────────────────────────────────────────────────────────

interface CoinListActions {
  setCoins: (coins: Coin[]) => void;
  appendCoins: (coins: Coin[]) => void;  // Sayfalama için
  setLoading: (isLoading: boolean) => void;
  setRefreshing: (isRefreshing: boolean) => void;
  setLoadingMore: (isLoadingMore: boolean) => void;
  setError: (error: AppError | null) => void;
  incrementPage: () => void;
  resetPage: () => void;
  setHasMorePages: (hasMore: boolean) => void;
}

interface CoinDetailActions {
  setDetail: (detail: CoinDetail | null) => void;
  setDetailLoading: (isLoading: boolean) => void;
  setDetailError: (error: AppError | null) => void;
}

// ─── Store Tipi (Birleşik) ────────────────────────────────────────────────────

type CoinStore = CoinListState & CoinListActions & CoinDetailState & CoinDetailActions;

// ─── Başlangıç State'leri ─────────────────────────────────────────────────────

const initialListState: CoinListState = {
  coins: [],
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  error: null,
  currentPage: 1,
  hasMorePages: true,
};

const initialDetailState: CoinDetailState = {
  detail: null,
  isDetailLoading: false,
  detailError: null,
};

// ─── Store Oluşturma ──────────────────────────────────────────────────────────

export const useCoinStore = create<CoinStore>((set) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  ...initialListState,
  ...initialDetailState,

  // ── Liste Action'ları ─────────────────────────────────────────────────────
  setCoins: (coins) => set({ coins }),

  appendCoins: (newCoins) =>
    set((state) => ({
      // Mükerrer kayıtları önlemek için ID bazlı filtreleme
      coins: [
        ...state.coins,
        ...newCoins.filter((nc) => !state.coins.some((c) => c.id === nc.id)),
      ],
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setRefreshing: (isRefreshing) => set({ isRefreshing }),
  setLoadingMore: (isLoadingMore) => set({ isLoadingMore }),
  setError: (error) => set({ error }),

  incrementPage: () => set((state) => ({ currentPage: state.currentPage + 1 })),
  resetPage: () => set({ currentPage: 1, hasMorePages: true }),
  setHasMorePages: (hasMorePages) => set({ hasMorePages }),

  // ── Detay Action'ları ─────────────────────────────────────────────────────
  setDetail: (detail) => set({ detail }),
  setDetailLoading: (isDetailLoading) => set({ isDetailLoading }),
  setDetailError: (detailError) => set({ detailError }),
}));

// ─── Selector'lar ─────────────────────────────────────────────────────────────
// Selector'lar, bileşenin sadece ihtiyaç duyduğu state'i seçmesini sağlar.
// Bu, gereksiz re-render'ları önler (performans optimizasyonu).

export const selectCoins = (state: CoinStore): Coin[] => state.coins;
export const selectIsLoading = (state: CoinStore): boolean => state.isLoading;
export const selectIsRefreshing = (state: CoinStore): boolean => state.isRefreshing;
export const selectIsLoadingMore = (state: CoinStore): boolean => state.isLoadingMore;
export const selectError = (state: CoinStore): AppError | null => state.error;
export const selectCurrentPage = (state: CoinStore): number => state.currentPage;
export const selectHasMorePages = (state: CoinStore): boolean => state.hasMorePages;

export const selectDetail = (state: CoinStore): CoinDetail | null => state.detail;
export const selectIsDetailLoading = (state: CoinStore): boolean => state.isDetailLoading;
export const selectDetailError = (state: CoinStore): AppError | null => state.detailError;
