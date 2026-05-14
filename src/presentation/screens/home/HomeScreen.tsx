/**
 * HomeScreen — Ana Liste Ekranı
 *
 * Bu bileşen "Dumb Component" rolündedir:
 * - Veri ÇEKMEZ, sadece ViewModel hook'undan gelen veriyi render eder
 * - İş mantığı yoktur, sadece UI mantığı vardır
 * - Tüm state değişimleri useHomeViewModel hook'u üzerinden yönetilir
 *
 * FlatList Performans Optimizasyonları (yorum satırlarıyla açıklandı):
 * ✅ keyExtractor     → Stable unique key
 * ✅ getItemLayout    → Sabit yükseklik bilindiğinden virtualization hesabı pas geçilir
 * ✅ memo             → CoinListItem gereksiz re-render edilmez
 * ✅ useCallback      → onPress ve diğer callback'ler stabil referansla geçilir
 * ✅ removeClippedSubviews → Görünmeyen item'ların native layer'ı kaldırılır
 * ✅ maxToRenderPerBatch  → Batch render boyutu sınırlandırılır
 * ✅ windowSize       → Render window boyutu optimize edilir
 * ✅ initialNumToRender → İlk frame'de render edilecek item sayısı
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  type ListRenderItem,
} from 'react-native';
import { useHomeViewModel } from './useHomeViewModel';
import { CoinListItem } from './components/CoinListItem';
import { ErrorView } from './components/ErrorView';
import type { Coin } from '@domain/entities/Coin';
import { colors } from '@presentation/theme/colors';
import { typography } from '@presentation/theme/typography';
import { LIST_ITEM } from '@core/constants/AppConstants';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@presentation/navigation/routes';
import { ROUTES } from '@presentation/navigation/routes';

// ─── Navigation Props Tipi ────────────────────────────────────────────────────

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, typeof ROUTES.HOME>;

// ─── Separator Bileşeni ───────────────────────────────────────────────────────
// FlatList dışında tanımlandı — her render'da yeni instance oluşturulmaz

function ListSeparator(): React.JSX.Element {
  return <View style={separatorStyle.line} />;
}

const separatorStyle = StyleSheet.create({
  line: {
    height: LIST_ITEM.SEPARATOR_HEIGHT,
    backgroundColor: colors.system.separator,
    marginLeft: 74, // rank + logo + padding = sol hizalama
  },
});

// ─── Footer Bileşeni (Sayfalama Yükleyici) ────────────────────────────────────

function ListFooter({ isLoadingMore }: { isLoadingMore: boolean }): React.JSX.Element | null {
  if (!isLoadingMore) return null;
  return (
    <View style={footerStyle.container}>
      <ActivityIndicator size="small" color={colors.brand.primary} />
    </View>
  );
}

const footerStyle = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

// ─── Ana Ekran ────────────────────────────────────────────────────────────────

export function HomeScreen({ navigation }: HomeScreenProps): React.JSX.Element {
  const {
    coins,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    onRefresh,
    onLoadMore,
  } = useHomeViewModel();

  // ── useCallback: Navigation fonksiyonu stabil referans için ────────────────
  // memo ile sarılmış CoinListItem'a geçildiğinde gereksiz re-render önlenir
  const handleCoinPress = useCallback(
    (coinId: string, coinName: string) => {
      navigation.navigate(ROUTES.DETAIL, { coinId, coinName });
    },
    [navigation],
  );

  // ── renderItem: useCallback ile stabil referans ────────────────────────────
  // FlatList, renderItem referansı değiştiğinde tüm listeyi yeniden render eder.
  // useCallback bunu önler.
  const renderItem = useCallback<ListRenderItem<Coin>>(
    ({ item }) => <CoinListItem coin={item} onPress={handleCoinPress} />,
    [handleCoinPress],
  );

  // ── keyExtractor: Stabil ve benzersiz anahtar ──────────────────────────────
  // Index yerine ID kullanmak, liste değişimlerinde doğru diff hesaplanmasını sağlar.
  // useCallback ile stabil referans (FlatList optimizasyonu).
  const keyExtractor = useCallback((item: Coin): string => item.id, []);

  // ── getItemLayout: Sabitlik varsa scroll pozisyonu anında hesaplanır ───────
  // Bu fonksiyon FlatList'in en güçlü optimizasyonudur:
  // Virtual scroll hesaplamalarında her item'ı ölçmek gerekmez.
  // ŞART: Tüm item'ların yüksekliği sabit ve LIST_ITEM.TOTAL_HEIGHT'a eşit olmalı.
  const getItemLayout = useCallback(
    (_: ArrayLike<Coin> | null | undefined, index: number) => ({
      length: LIST_ITEM.TOTAL_HEIGHT,
      offset: LIST_ITEM.TOTAL_HEIGHT * index,
      index,
    }),
    [],
  );

  // ── ListFooterComponent: useMemo ile stabil referans ──────────────────────
  const listFooter = useMemo(
    () => <ListFooter isLoadingMore={isLoadingMore} />,
    [isLoadingMore],
  );

  // ── Hata Durumu ────────────────────────────────────────────────────────────
  if (error !== null && coins.length === 0) {
    return <ErrorView error={error} onRetry={onRefresh} />;
  }

  // ── Başlangıç Yükleme Durumu ───────────────────────────────────────────────
  if (isLoading && coins.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
        <Text style={styles.loadingText}>Piyasa verileri yükleniyor...</Text>
      </View>
    );
  }

  // ── Normal Liste Görünümü ──────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Sütun başlıkları */}
      <View style={styles.header}>
        <Text style={styles.headerLeft}>#  Coin</Text>
        <Text style={styles.headerRight}>Fiyat / 24s</Text>
      </View>

      <FlatList<Coin>
        data={coins}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}         // ✅ Sabit yükseklik optimizasyonu
        ItemSeparatorComponent={ListSeparator}
        ListFooterComponent={listFooter}
        refreshing={isRefreshing}
        onRefresh={onRefresh}                 // ✅ Pull-to-refresh
        onEndReached={onLoadMore}             // ✅ Sonsuz kaydırma trigger
        onEndReachedThreshold={0.3}           // Liste %30 kaldığında tetikle
        removeClippedSubviews={true}          // ✅ Görünmeyen item'ların native view'ı kaldır
        maxToRenderPerBatch={10}              // ✅ Bir batch'te max 10 item render et
        windowSize={7}                        // ✅ Görünür alan x7 kadar render penceresi
        initialNumToRender={15}              // ✅ İlk frame'de 15 item render et
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// ─── Stiller ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    gap: 12,
  },
  loadingText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.system.separator,
  },
  headerLeft: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerRight: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContent: {
    flexGrow: 1,
  },
});
