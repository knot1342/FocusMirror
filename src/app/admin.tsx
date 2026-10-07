import { Stack } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsRow, SettingsSection } from '@/components/settings-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { setCurrentStreak, useUsageStreak } from '@/hooks/use-usage-streak';
import { useLanguage } from '@/i18n/language';

const MAX_STREAK = 3650;

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { current } = useUsageStreak();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t.admin.title }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
        <View style={styles.group}>
          <SettingsSection title={t.admin.sections.streak}>
            <View style={styles.stepperRow}>
              <ThemedText style={styles.label}>{t.admin.currentStreak}</ThemedText>
              <StepperButton
                icon={{ ios: 'minus', android: 'remove', web: 'remove' }}
                label={t.admin.decrease}
                disabled={current <= 0}
                onPress={() => setCurrentStreak(current - 1)}
              />
              <ThemedText type="smallBold" style={styles.value}>
                {t.streak.days(current)}
              </ThemedText>
              <StepperButton
                icon={{ ios: 'plus', android: 'add', web: 'add' }}
                label={t.admin.increase}
                disabled={current >= MAX_STREAK}
                onPress={() => setCurrentStreak(current + 1)}
              />
            </View>
            <SettingsRow label={t.admin.reset} destructive onPress={() => setCurrentStreak(0)} />
          </SettingsSection>
          <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
            {t.admin.streakNote}
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

type StepperButtonProps = {
  icon: SymbolViewProps['name'];
  label: string;
  disabled: boolean;
  onPress: () => void;
};

function StepperButton({ icon, label, disabled, onPress }: StepperButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={Spacing.one}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.stepperButton,
        { backgroundColor: theme.backgroundSelected },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <SymbolView name={icon} tintColor={theme.text} size={18} />
    </Pressable>
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
    gap: Spacing.four,
  },
  group: {
    gap: Spacing.two,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  label: {
    flex: 1,
  },
  value: {
    minWidth: 64,
    textAlign: 'center',
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    paddingHorizontal: Spacing.three,
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.3,
  },
});
