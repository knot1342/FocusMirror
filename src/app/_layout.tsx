import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Appearance, Platform } from 'react-native';

import { IntroOverlay } from '@/components/intro-overlay';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePreferences } from '@/hooks/use-preferences';
import { LanguageProvider } from '@/i18n/language';

// Keep the native splash up until IntroOverlay has rendered and takes over.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { theme } = usePreferences();
  const { session } = useAuth();

  // Native: make RN's useColorScheme (and native UI) follow the saved theme. Web handles it in use-color-scheme.web.ts.
  useEffect(() => {
    if (Platform.OS !== 'web') Appearance.setColorScheme(theme === 'system' ? 'unspecified' : theme);
  }, [theme]);

  return (
    <LanguageProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* Signed out: only the login screen. Signed in: everything else; the router redirects on change. */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!session}>
            <Stack.Screen name="index" />
          </Stack.Protected>
          <Stack.Protected guard={!!session}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="about" />
            <Stack.Screen name="admin" />
            <Stack.Screen name="calibrate" />
            <Stack.Screen name="change-password" />
            <Stack.Screen name="daily-goal" />
            <Stack.Screen name="edit-profile" />
            <Stack.Screen name="fatigue-sensitivity" />
            <Stack.Screen name="language" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="theme" />
          </Stack.Protected>
        </Stack>
        <IntroOverlay />
      </ThemeProvider>
    </LanguageProvider>
  );
}
