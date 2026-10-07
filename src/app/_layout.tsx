import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Appearance, Platform } from 'react-native';

import { IntroOverlay } from '@/components/intro-overlay';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePreferences } from '@/hooks/use-preferences';
import { LanguageProvider } from '@/i18n/language';

// Keep the native splash up until IntroOverlay has rendered and takes over.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { theme } = usePreferences();

  // Native: make RN's useColorScheme (and native UI) follow the saved theme. Web handles it in use-color-scheme.web.ts.
  useEffect(() => {
    if (Platform.OS !== 'web') Appearance.setColorScheme(theme === 'system' ? 'unspecified' : theme);
  }, [theme]);

  return (
    <LanguageProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} />
        <IntroOverlay />
      </ThemeProvider>
    </LanguageProvider>
  );
}
