/**
 * RootNavigator — Uygulama Navigasyon Yığını
 *
 * React Navigation v6 ile tip güvenli Stack Navigator kurulumu.
 * Tüm ekranları merkezi olarak yönetir.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import type { RootStackParamList } from './routes';
import { ROUTES } from './routes';
import { colors } from '@presentation/theme/colors';
import { typography } from '@presentation/theme/typography';

// Lazy import — ekranlar ihtiyaç duyulduğunda yüklenir
import { HomeScreen } from '@presentation/screens/home/HomeScreen';
import { DetailScreen } from '@presentation/screens/detail/DetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ROUTES.HOME}
        screenOptions={{
          // Tüm ekranlar için ortak header stili
          headerStyle: {
            backgroundColor: colors.background.secondary,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: typography.fontWeight.semibold,
            fontSize: typography.fontSize.lg,
          },
          headerShadowVisible: false,
          // iOS'ta slide animasyonu, Android'de fade animasyonu
          animation: 'default',
          contentStyle: {
            backgroundColor: colors.background.primary,
          },
        }}
      >
        <Stack.Screen
          name={ROUTES.HOME}
          component={HomeScreen}
          options={{ title: 'Kripto Piyasası' }}
        />
        <Stack.Screen
          name={ROUTES.DETAIL}
          component={DetailScreen}
          options={({ route }) => ({ title: route.params.coinName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
