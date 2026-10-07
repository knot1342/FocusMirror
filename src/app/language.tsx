import { Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { SettingsRow, SettingsSection } from '@/components/settings-list';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useLanguage, type LanguagePreference } from '@/i18n/language';
import { LANGUAGE_NAMES, type Language } from '@/i18n/translations';

export default function LanguageScreen() {
  const { t, preference, setPreference } = useLanguage();

  const options: { value: LanguagePreference; label: string }[] = [
    { value: 'system', label: t.language.system },
    ...(Object.keys(LANGUAGE_NAMES) as Language[]).map((language) => ({
      value: language,
      label: LANGUAGE_NAMES[language],
    })),
  ];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t.language.title }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <SettingsSection title={t.language.title}>
          {options.map((option) => (
            <SettingsRow
              key={option.value}
              label={option.label}
              checked={preference === option.value}
              onPress={() => setPreference(option.value)}
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
