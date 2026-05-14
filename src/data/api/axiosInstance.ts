/**
 * Axios Instance & Interceptors — Merkezi HTTP İstemcisi
 *
 * Bu dosya uygulamanın tüm HTTP trafiğini yönetir:
 * 1. Merkezi timeout, baseURL ve header yönetimi
 * 2. Request interceptor: Her isteğe ortak başlıklar ekler, loglama yapar
 * 3. Response interceptor: Başarılı yanıtları pass-through, hataları AppError'a map eder
 * 4. Ağ bağlantısı ve API hataları arasında akıllı ayrım
 *
 * SOLID → Single Responsibility: Sadece HTTP altyapısını yönetir.
 * SOLID → Open/Closed: Yeni interceptor mantığı mevcut kodu değiştirmeden eklenebilir.
 */

import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@core/constants/AppConstants';
import { AppError, type AppError as AppErrorType } from '@core/errors/AppError';

// ─── Axios Instance ────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // İsteğe özgü başlıklar veya auth token buraya eklenir
    // Örn: config.headers.Authorization = `Bearer ${getToken()}`;

    if (__DEV__) {
      console.log(
        `[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL ?? ''}${config.url ?? ''}`,
        { params: config.params },
      );
    }

    return config;
  },
  (error: unknown) => {
    // İstek gönderilmeden önce oluşan nadir hatalar (örn: header format hatası)
    if (__DEV__) {
      console.error('[API REQUEST ERROR]', error);
    }
    return Promise.reject(AppError.unknown(error));
  },
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (__DEV__) {
      console.log(
        `[API RESPONSE] ${response.status} ${response.config.url ?? ''}`,
        { dataLength: Array.isArray(response.data) ? response.data.length : 'object' },
      );
    }
    return response;
  },
  (error: unknown): Promise<never> => {
    // Hataları uygulama hata modeline dönüştür
    const appError = mapAxiosErrorToAppError(error);
    if (__DEV__) {
      console.error('[API ERROR]', appError);
    }
    return Promise.reject(appError);
  },
);

// ─── Error Mapper ─────────────────────────────────────────────────────────────

/**
 * Axios hatalarını tip güvenli AppError'a dönüştürür.
 * `any` kullanmadan Axios hata yapısını discriminated union ile ayırt eder.
 */
function mapAxiosErrorToAppError(error: unknown): AppErrorType {
  // İstek iptal edilmişse (AbortController veya axios.CancelToken)
  if (axios.isCancel(error)) {
    return AppError.cancelled();
  }

  // Axios hatasıysa yapısal analiz yap
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Sunucudan yanıt geldiyse → API hatası
    if (axiosError.response != null) {
      const statusCode = axiosError.response.status;
      const endpoint = axiosError.config?.url;
      const message = getApiErrorMessage(statusCode);
      return AppError.api(statusCode, message, endpoint);
    }

    // İstek gönderildi ama yanıt gelmedi → Ağ hatası (timeout, no internet)
    if (axiosError.request != null) {
      const isTimeout = axiosError.code === 'ECONNABORTED';
      const message = isTimeout
        ? 'Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.'
        : 'Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.';
      return AppError.network(message, axiosError);
    }
  }

  return AppError.unknown(error);
}

/**
 * HTTP status koduna göre kullanıcı dostu hata mesajı üretir.
 */
function getApiErrorMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    400: 'Geçersiz istek parametreleri.',
    401: 'Yetkilendirme başarısız. API anahtarınızı kontrol edin.',
    403: 'Bu kaynağa erişim izniniz yok.',
    404: 'İstenen kaynak bulunamadı.',
    429: 'Çok fazla istek gönderildi. Lütfen bekleyin.',
    500: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    503: 'Servis şu anda kullanılamıyor.',
  };

  return messages[statusCode] ?? `Beklenmedik bir hata oluştu (HTTP ${statusCode}).`;
}
