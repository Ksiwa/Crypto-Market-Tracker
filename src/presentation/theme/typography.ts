/**
 * Tipografi Sabitleri
 *
 * Font boyutları ve ağırlıkları için merkezi kaynak.
 * Tasarım sistemi tutarlılığını korur; "magic number" kullanımını önler.
 */

export const typography = {
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    display: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
} as const;

export type Typography = typeof typography;
