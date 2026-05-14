/**
 * AppError — Merkezi Hata Tipleri
 *
 * Discriminated Union kullanarak `any` tipi olmadan tam tip güvenliği sağlar.
 * Her hata türü kendi `kind` etiketiyle ayırt edilir (TypeScript exhaustiveness checking).
 *
 * SOLID → Open/Closed: Yeni hata türleri mevcut kodu bozmadan eklenebilir.
 */

/** Ağ bağlantısı sırasında oluşan hatalar (timeout, no internet vb.) */
export interface NetworkError {
  readonly kind: 'NetworkError';
  readonly message: string;
  readonly originalError?: unknown;
}

/** API'nin 4xx / 5xx dönmesi durumundaki hatalar */
export interface ApiError {
  readonly kind: 'ApiError';
  readonly statusCode: number;
  readonly message: string;
  readonly endpoint?: string;
}

/** İstek iptal edildiğinde (AbortController / Axios cancel) */
export interface CancelledError {
  readonly kind: 'CancelledError';
  readonly message: string;
}

/** Bilinmeyen / beklenmedik hatalar */
export interface UnknownError {
  readonly kind: 'UnknownError';
  readonly message: string;
  readonly originalError?: unknown;
}

/** Uygulama genelinde kullanılan hata union tipi */
export type AppError = NetworkError | ApiError | CancelledError | UnknownError;

// ─── Factory Functions ─────────────────────────────────────────────────────────
// Tip güvenli hata nesnesi oluşturucular — "new Error()" yerine kullanılır.

export const AppError = {
  network: (message: string, originalError?: unknown): NetworkError => ({
    kind: 'NetworkError',
    message,
    originalError,
  }),

  api: (statusCode: number, message: string, endpoint?: string): ApiError => ({
    kind: 'ApiError',
    statusCode,
    message,
    endpoint,
  }),

  cancelled: (message = 'İstek iptal edildi.'): CancelledError => ({
    kind: 'CancelledError',
    message,
  }),

  unknown: (originalError: unknown): UnknownError => ({
    kind: 'UnknownError',
    message: 'Beklenmedik bir hata oluştu.',
    originalError,
  }),
} as const;
