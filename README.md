# Crypto Market Tracker

[![CI](https://github.com/Ksiwa/Crypto-Market-Tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/Ksiwa/Crypto-Market-Tracker/actions/workflows/ci.yml)

React Native ve Expo ile geliştirilmiş, CoinGecko API üzerinden kripto para piyasa verilerini listeleyen ve detaylandıran mobil takip uygulaması.

Bu proje; Clean Architecture, TypeScript tip güvenliği, API entegrasyonu, performanslı listeleme ve teknik dokümantasyon pratiklerini göstermek amacıyla hazırlanmış bir mobil geliştirme portfolyo çalışmasıdır.

## Öne Çıkanlar

- Clean Architecture: `domain`, `data`, `presentation` katmanları ayrıldı.
- Repository Pattern: Domain katmanı veri kaynağından bağımsız tutuldu.
- Custom Hook Pattern: Ekran mantığı `useHomeViewModel` ve `useDetailViewModel` içinde toplandı.
- TypeScript strict mode: `strict`, `noImplicitAny`, `strictNullChecks` aktif.
- Zustand: Hafif global state yönetimi.
- Axios interceptor: Merkezi HTTP istemcisi ve hata dönüşümü.
- FlatList optimizasyonları: `memo`, `useCallback`, `useMemo`, `keyExtractor`, `getItemLayout`.

## Teknolojiler

- Expo 54
- React Native 0.81
- React 19
- TypeScript
- Axios
- Zustand
- React Navigation

## Klasör Yapısı

```txt
src/
  core/
    constants/
    errors/
    utils/
  data/
    api/
    dto/
    mappers/
    repositories/
  domain/
    entities/
    repositories/
    usecases/
  presentation/
    navigation/
    screens/
    store/
    theme/
```

## Kurulum

```bash
npm install
npm start
```

Metro cache temizleyerek başlatmak için:

```bash
npm run start:clear
```

## Kontroller

```bash
npm run typecheck
```

GitHub Actions içinde her push ve pull request için TypeScript kontrolü çalışır.

## API

Uygulama varsayılan olarak CoinGecko public API kullanır:

```txt
https://api.coingecko.com/api/v3
```

Şu an API anahtarı veya gizli ortam değişkeni gerektirmez.

## Proje Notları

- `package-lock.json` repoda tutulur; kurulumun tekrarlanabilir olmasını sağlar.
- Expo cache, bağımlılıklar, ortam dosyaları ve yerel yardımcı scriptler `.gitignore` ile dışarıda bırakılır.
