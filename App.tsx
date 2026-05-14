/**
 * App.tsx — Uygulama Giriş Noktası (Expo)
 *
 * Minimum sorumluluk: SafeAreaProvider + Navigator'ı bağlar.
 * İş mantığı veya state burada yer ALMAZ.
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@presentation/navigation/RootNavigator';

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
