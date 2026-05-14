/**
 * CoinListItem — Optimize Edilmiş Liste Kartı
 *
 * FlatList içinde render edilen her coin satırı için bileşen.
 *
 * Performans Optimizasyonları:
 * 1. React.memo: Props değişmediğinde bileşen yeniden render edilmez.
 *    FlatList'te bu kritik öneme sahiptir — liste kaydırıldıkça tüm item'lar
 *    yeniden render edilmez.
 *
 * 2. StyleSheet.create: Stil nesneleri bileşen dışında tanımlandığından
 *    her render'da yeniden hesaplanmaz (referans stabilitesi).
 *
 * 3. Inline style YASAK: Performans kaybına neden olur, test edilemez.
 *
 * SOLID → Single Responsibility: Sadece bir coin satırını render eder.
 */

import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { Coin } from '@domain/entities/Coin';
import { colors } from '@presentation/theme/colors';
import { typography } from '@presentation/theme/typography';
import { formatPrice, formatPercentageChange } from '@core/utils/formatters';
import { LIST_ITEM } from '@core/constants/AppConstants';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CoinListItemProps {
  coin: Coin;
  onPress: (coinId: string, coinName: string) => void;
}

// ─── Bileşen ─────────────────────────────────────────────────────────────────

/**
 * memo() ile sarıldı — aynı props geldiğinde re-render atlanır.
 * FlatList scroll performansı için kritik.
 */
export const CoinListItem = memo<CoinListItemProps>(function CoinListItem({
  coin,
  onPress,
}) {
  const isPositive = coin.priceChangePercentage24h >= 0;
  const changeToneStyle = isPositive ? styles.changePositive : styles.changeNegative;
  const formattedChange = formatPercentageChange(coin.priceChangePercentage24h);
  const formattedPrice = formatPrice(coin.currentPrice);

  return (
    // Sabit yükseklik (LIST_ITEM.ITEM_HEIGHT) getItemLayout ile eşleşmelidir
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(coin.id, coin.name)}
      activeOpacity={0.7}
    >
      {/* Sol Bölüm: Rank + Logo + İsim */}
      <View style={styles.leftSection}>
        <Text style={styles.rank}>{coin.marketCapRank}</Text>

        <Image
          source={{ uri: coin.imageUrl }}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.nameContainer}>
          <Text style={styles.coinName} numberOfLines={1}>
            {coin.name}
          </Text>
          <Text style={styles.coinSymbol}>{coin.symbol}</Text>
        </View>
      </View>

      {/* Sağ Bölüm: Fiyat + Değişim */}
      <View style={styles.rightSection}>
        <Text style={styles.price}>{formattedPrice}</Text>
        <Text style={[styles.change, changeToneStyle]}>
          {formattedChange}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

// ─── Stiller ─────────────────────────────────────────────────────────────────
// StyleSheet.create ile bileşen DIŞINDA tanımlandı:
// 1. Native tarafında optimize edilir (sayısal ID'ye dönüştürülür)
// 2. Her render'da yeniden oluşturulmaz → GC baskısı azalır
// 3. Inline style yasağına uyum (KISITLAMALAR gereği)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // LIST_ITEM.ITEM_HEIGHT sabitiyle eşleşmeli — getItemLayout bunu kullanır
    height: LIST_ITEM.ITEM_HEIGHT,
    paddingHorizontal: 16,
    backgroundColor: colors.background.primary,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rank: {
    width: 28,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 10,
    backgroundColor: colors.system.skeleton,
  },
  nameContainer: {
    flex: 1,
    marginRight: 8,
  },
  coinName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  coinSymbol: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.regular,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
    minWidth: 90,
  },
  price: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  change: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginTop: 2,
  },
  changePositive: {
    color: colors.market.positive,
  },
  changeNegative: {
    color: colors.market.negative,
  },
});
