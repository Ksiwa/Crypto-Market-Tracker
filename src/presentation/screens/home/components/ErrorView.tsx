/**
 * ErrorView — Merkezi Hata Bileşeni
 *
 * Tüm API hata durumlarını kullanıcıya anlamlı biçimde gösterir.
 * AppError'un discriminated union yapısından yararlanarak
 * her hata tipine özel mesaj sunar.
 *
 * SOLID → Single Responsibility: Sadece hata durumunu render eder.
 */

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { AppError } from '@core/errors/AppError';
import { colors } from '@presentation/theme/colors';
import { typography } from '@presentation/theme/typography';

interface ErrorViewProps {
  error: AppError;
  onRetry: () => void;
}

/**
 * AppError'un `kind` alanına göre kullanıcıya özel mesaj döndürür.
 * Exhaustive switch pattern — tüm hata tipleri ele alınmak zorundadır.
 */
function getErrorDisplayData(error: AppError): { title: string; subtitle: string; emoji: string } {
  switch (error.kind) {
    case 'NetworkError':
      return {
        emoji: '📡',
        title: 'Bağlantı Sorunu',
        subtitle: error.message,
      };
    case 'ApiError':
      return {
        emoji: error.statusCode === 429 ? '⏱️' : '⚠️',
        title: error.statusCode === 429 ? 'Çok Fazla İstek' : `Sunucu Hatası (${error.statusCode})`,
        subtitle: error.message,
      };
    case 'CancelledError':
      return {
        emoji: '🚫',
        title: 'İstek İptal Edildi',
        subtitle: error.message,
      };
    case 'UnknownError':
      return {
        emoji: '❓',
        title: 'Beklenmedik Hata',
        subtitle: 'Lütfen uygulamayı yeniden başlatmayı deneyin.',
      };
  }
}

export const ErrorView = memo<ErrorViewProps>(function ErrorView({ error, onRetry }) {
  const { emoji, title, subtitle } = getErrorDisplayData(error);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryText}>Tekrar Dene</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: colors.background.primary,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: colors.brand.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});
