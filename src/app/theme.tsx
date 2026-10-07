import { Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { SettingsRow, SettingsSection } from '@/components/settings-list';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { setPreferences, usePreferences, type ThemePreference } from '@/hooks/use-preferences';
import { useLanguage } from '@/i18n/language';

const OPTIONS: ThemePreference[] = ['system', 'light', 'dark'];

export default function ThemeScreen() {
  const { t } = useLanguage();
  const { theme } = usePreferences();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t.theme.title }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <SettingsSection title={t.theme.title}>
          {OPTIONS.map((option) => (
            <SettingsRow
              key={option}
              label={t.settings.values.theme[option]}
              checked={theme === option}
              onPress={() => setPreferences({ theme: option })}
            />
          ))}
        </SettingsSection>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    padding: Spacing.three,
  },
});
