import { Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { SettingsRow, SettingsSection } from '@/components/settings-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { setPreferences, usePreferences, type FatigueSensitivity } from '@/hooks/use-preferences';
import { useLanguage } from '@/i18n/language';

const LEVELS: FatigueSensitivity[] = ['low', 'medium', 'high'];

export default function FatigueSensitivityScreen() {
  const { t } = useLanguage();
  const { fatigueSensitivity } = usePreferences();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t.fatigue.title }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <SettingsSection title={t.fatigue.title}>
          {LEVELS.map((level) => (
            <SettingsRow
              key={level}
              label={t.settings.values.sensitivity[level]}
              checked={fatigueSensitivity === level}
              onPress={() => setPreferences({ fatigueSensitivity: level })}
            />
          ))}
        </SettingsSection>
        <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
          {t.fatigue.descriptions[fatigueSensitivity]}
        </ThemedText>
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
    gap: Spacing.two,
  },
  note: {
    paddingHorizontal: Spacing.three,
  },
});
