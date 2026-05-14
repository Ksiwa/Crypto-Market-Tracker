/**
 * Renk Paleti — Dark Theme
 *
 * Fintech uygulamaları için profesyonel dark mode renk sistemi.
 * Tüm renkler semantik isimlerle tanımlanır ("magic color string" yok).
 *
 * Tasarım Kararı: Dark theme seçildi çünkü fintech uygulamalarında
 * kullanıcılar uzun süre ekrana bakar; dark theme göz yorgunluğunu azaltır.
 */

export const colors = {
  // ─── Arka Plan Hiyerarşisi ───────────────────────────────────────────────
  background: {
    primary: '#0D0D0D',    // Ana ekran arka planı
    secondary: '#161616',  // Kart / modal arka planı
    elevated: '#1E1E1E',   // Lifted kart, popover
  },

  // ─── Metin ──────────────────────────────────────────────────────────────
  text: {
    primary: '#F5F5F5',    // Başlık, ana metin
    secondary: '#9E9E9E',  // Yardımcı, alt bilgi
    tertiary: '#616161',   // Placeholder, devre dışı
    inverse: '#0D0D0D',    // Koyu arka plan üzerindeki açık metin
  },

  // ─── Marka Rengi ────────────────────────────────────────────────────────
  brand: {
    primary: '#6C63FF',    // Ana aksan rengi (mor/indigo)
    light: '#8B85FF',      // Hover durumu
    dark: '#4B44CC',       // Active durumu
  },

  // ─── Finansal Durum ─────────────────────────────────────────────────────
  market: {
    positive: '#00D395',   // Yeşil — artış, kazanç
    negative: '#FF4D4D',   // Kırmızı — düşüş, kayıp
    neutral: '#9E9E9E',    // Değişim yok
  },

  // ─── Sistem ─────────────────────────────────────────────────────────────
  system: {
    separator: '#2A2A2A',  // Ayırıcı çizgi rengi
    skeleton: '#242424',   // Skeleton loader rengi
    overlay: 'rgba(0,0,0,0.6)',
  },
} as const;

/** Renk tipini dışarıya açar — themed component'ler için kullanışlı */
export type Colors = typeof colors;
