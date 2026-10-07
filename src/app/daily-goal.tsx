import { Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { SettingsRow, SettingsSection } from '@/components/settings-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { setPreferences, usePreferences } from '@/hooks/use-preferences';
import { useLanguage } from '@/i18n/language';

const GOAL_OPTIONS = [30, 60, 90, 120, 180, 240, 300];

export default function DailyGoalScreen() {
  const { t } = useLanguage();
  const { dailyGoalMinutes } = usePreferences();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t.dailyGoal.title }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <SettingsSection title={t.dailyGoal.section}>
          {GOAL_OPTIONS.map((minutes) => (
            <SettingsRow
              key={minutes}
              label={t.common.duration(minutes)}
              checked={dailyGoalMinutes === minutes}
              onPress={() => setPreferences({ dailyGoalMinutes: minutes })}
            />
          ))}
        </SettingsSection>
        <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
          {t.dailyGoal.note}
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
