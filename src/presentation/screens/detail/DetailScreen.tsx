/**
 * DetailScreen — Coin Detay Ekranı
 *
 * Seçilen coin'in kapsamlı piyasa verilerini gösterir.
 * ScrollView tabanlı — FlatList'e gerek yok (liste değil, detay ekranı).
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@presentation/navigation/routes';
import { ROUTES } from '@presentation/navigation/routes';
import { useDetailViewModel } from './useDetailViewModel';
import { ErrorView } from '@presentation/screens/home/components/ErrorView';
import { colors } from '@presentation/theme/colors';
import { typography } from '@presentation/theme/typography';
import {
  formatPrice,
  formatMarketCap,
  formatPercentageChange,
} from '@core/utils/formatters';
import type { CoinDetail } from '@domain/entities/CoinDetail';

// ─── Navigation Props ─────────────────────────────────────────────────────────

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, typeof ROUTES.DETAIL>;

// ─── Alt Bileşenler ───────────────────────────────────────────────────────────

interface StatRowProps {
  label: string;
  value: string;
  tone?: 'positive' | 'negative';
}

function StatRow({ label, value, tone }: StatRowProps): React.JSX.Element {
  const toneStyle = tone === 'positive'
    ? statStyles.valuePositive
    : tone === 'negative'
      ? statStyles.valueNegative
      : undefined;

  return (
    <View style={statStyles.row}>
      <Text style={statStyles.label}>{label}</Text>
      <Text style={[statStyles.value, toneStyle]}>
        {value}
      </Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.system.separator,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
    flex: 1,
  },
  value: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'right',
    flex: 1,
  },
  valuePositive: {
    color: colors.market.positive,
  },
  valueNegative: {
    color: colors.market.negative,
  },
});

// ─── İçerik Bileşeni ─────────────────────────────────────────────────────────

function DetailContent({ detail }: { detail: CoinDetail }): React.JSX.Element {
  const is24hPositive = detail.priceChangePercentage24h >= 0;
  const is7dPositive = detail.priceChangePercentage7d >= 0;
  const is30dPositive = detail.priceChangePercentage30d >= 0;
  const priceChangeStyle = is24hPositive
    ? contentStyles.priceChangePositive
    : contentStyles.priceChangeNegative;

  return (
    <ScrollView
      style={contentStyles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={contentStyles.scrollContent}
    >
      {/* ── Hero Bölümü ── */}
      <View style={contentStyles.hero}>
        <Image
          source={{ uri: detail.imageUrl }}
          style={contentStyles.logo}
          resizeMode="contain"
        />
        <View style={contentStyles.heroText}>
          <Text style={contentStyles.coinName}>{detail.name}</Text>
          <Text style={contentStyles.symbol}>{detail.symbol}</Text>
        </View>
        <View style={contentStyles.rankBadge}>
          <Text style={contentStyles.rankText}>#{detail.marketCapRank}</Text>
        </View>
      </View>

      {/* ── Fiyat Bölümü ── */}
      <View style={contentStyles.priceSection}>
        <Text style={contentStyles.price}>{formatPrice(detail.currentPrice)}</Text>
        <Text style={[contentStyles.priceChange, priceChangeStyle]}>
          {formatPercentageChange(detail.priceChangePercentage24h)} (24s)
        </Text>
      </View>

      {/* ── Piyasa İstatistikleri ── */}
      <View style={contentStyles.section}>
        <Text style={contentStyles.sectionTitle}>Piyasa Bilgileri</Text>
        <StatRow label="Piyasa Değeri" value={formatMarketCap(detail.marketCap)} />
        <StatRow label="24s Hacim" value={formatMarketCap(detail.totalVolume)} />
        <StatRow
          label="7 Günlük Değişim"
          value={formatPercentageChange(detail.priceChangePercentage7d)}
          tone={is7dPositive ? 'positive' : 'negative'}
        />
        <StatRow
          label="30 Günlük Değişim"
          value={formatPercentageChange(detail.priceChangePercentage30d)}
          tone={is30dPositive ? 'positive' : 'negative'}
        />
        <StatRow label="Tüm Zamanların En Yükseği" value={formatPrice(detail.allTimeHigh)} />
        <StatRow
          label="Dolaşımdaki Arz"
          value={formatMarketCap(detail.circulatingSupply)}
        />
        <StatRow
          label="Toplam Arz"
          value={detail.totalSupply !== null ? formatMarketCap(detail.totalSupply) : 'Sınırsız'}
        />
      </View>

      {/* ── Açıklama ── */}
      {detail.description.length > 0 && (
        <View style={contentStyles.section}>
          <Text style={contentStyles.sectionTitle}>Hakkında</Text>
          <Text style={contentStyles.description} numberOfLines={8}>
            {detail.description}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const contentStyles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.background.secondary,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.system.skeleton,
  },
  heroText: {
    flex: 1,
    marginLeft: 12,
  },
  coinName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  symbol: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginTop: 2,
  },
  rankBadge: {
    backgroundColor: colors.background.elevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rankText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.brand.primary,
  },
  priceSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.background.secondary,
    marginTop: 1,
    marginBottom: 8,
  },
  price: {
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.extrabold,
    color: colors.text.primary,
  },
  priceChange: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    marginTop: 4,
  },
  priceChangePositive: {
    color: colors.market.positive,
  },
  priceChangeNegative: {
    color: colors.market.negative,
  },
  section: {
    backgroundColor: colors.background.secondary,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.secondary,
    paddingTop: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    paddingBottom: 16,
  },
});

// ─── Ana Ekran ────────────────────────────────────────────────────────────────

export function DetailScreen({ route }: DetailScreenProps): React.JSX.Element {
  const { coinId } = route.params;
  const { detail, isLoading, error, onRetry } = useDetailViewModel(coinId);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  if (error !== null) {
    return <ErrorView error={error} onRetry={onRetry} />;
  }

  if (detail === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  return <DetailContent detail={detail} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
});
