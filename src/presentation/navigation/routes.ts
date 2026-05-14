/**
 * Navigasyon Route Sabitleri
 *
 * Tüm ekran isimlerini string literal olarak tek yerden yönetir.
 * TypeScript ile tip güvenli navigasyon params tanımlar.
 *
 * SOLID → Single Responsibility: Sadece navigasyon sözleşmesi.
 */

/** Ekran isimleri — "magic string" kullanımını önler */
export const ROUTES = {
  HOME: 'Home',
  DETAIL: 'Detail',
} as const;

/** Route isminin tip tanımı */
export type RouteNames = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * Stack Navigator'ın parametre haritası.
 * Her ekranın aldığı params burada tanımlanır.
 * `undefined` → o ekran parametre almaz.
 */
export type RootStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.DETAIL]: {
    coinId: string;
    coinName: string; // Başlık için gerekli, API çağrısı beklenmeden gösterilebilir
  };
};
