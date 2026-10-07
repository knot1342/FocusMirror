import { Stack } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsRow, SettingsSection } from '@/components/settings-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import {
  addSession,
  addSessions,
  clearSessions,
  makeSampleSessions,
  useSessions,
} from '@/hooks/use-sessions';
import { useTheme } from '@/hooks/use-theme';
import { setCurrentStreak, useUsageStreak } from '@/hooks/use-usage-streak';
import { useLanguage } from '@/i18n/language';

const MAX_STREAK = 3650;

/** A made-up session being edited, before it is saved. */
const DEFAULT_DRAFT = {
  daysAgo: 0,
  hour: 9,
  durationMinutes: 60,
  focusScore: 75,
  distractions: 3,
  postureWarnings: 1,
};
type Draft = typeof DEFAULT_DRAFT;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const { language, t } = useLanguage();
  const { current } = useUsageStreak();
  const sessions = useSessions();
  const [draft, setDraft] = useState(DEFAULT_DRAFT);

  /** Steps one field of the draft, kept within its range. */
  function step(field: keyof Draft, delta: number, min: number, max: number) {
    setDraft((d) => ({ ...d, [field]: clamp(d[field] + delta, min, max) }));
  }

  function saveDraft() {
    const now = new Date();
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - draft.daysAgo,
      draft.hour,
    );
    addSession({
      id: `admin-${Date.now()}`,
      startedAt: start.toISOString(),
      durationMinutes: draft.durationMinutes,
      focusScore: draft.focusScore,
      distractions: draft.distractions,
      postureWarnings: draft.postureWarnings,
    }).then(() => Alert.alert(t.admin.sessionAdded));
  }

  function confirmDeleteSessions() {
    const confirm = t.settings.clearConfirm;
    Alert.alert(confirm.title, confirm.message, [
      { text: confirm.cancel, style: 'cancel' },
      { text: confirm.confirm, style: 'destructive', onPress: () => clearSessions() },
    ]);
  }

  const hourLabel = new Intl.DateTimeFormat(language, { hour: 'numeric', minute: '2-digit' }).format(
    new Date(2000, 0, 1, draft.hour),
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t.admin.title }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
        <View style={styles.group}>
          <SettingsSection title={t.admin.sections.streak}>
            <StepperRow
              label={t.admin.currentStreak}
              value={t.streak.days(current)}
              canDecrease={current > 0}
              canIncrease={current < MAX_STREAK}
              onDecrease={() => setCurrentStreak(current - 1)}
              onIncrease={() => setCurrentStreak(current + 1)}
            />
            <SettingsRow label={t.admin.reset} destructive onPress={() => setCurrentStreak(0)} />
          </SettingsSection>
          <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
            {t.admin.streakNote}
          </ThemedText>
        </View>

        <SettingsSection title={t.admin.sections.newSession}>
          <StepperRow
            label={t.admin.day}
            value={t.admin.daysAgo(draft.daysAgo)}
            canDecrease={draft.daysAgo < 30}
            canIncrease={draft.daysAgo > 0}
            // "-" moves to an earlier day, so it raises daysAgo.
            onDecrease={() => step('daysAgo', 1, 0, 30)}
            onIncrease={() => step('daysAgo', -1, 0, 30)}
          />
          <StepperRow
            label={t.admin.startTime}
            value={hourLabel}
            canDecrease={draft.hour > 0}
            canIncrease={draft.hour < 23}
            onDecrease={() => step('hour', -1, 0, 23)}
            onIncrease={() => step('hour', 1, 0, 23)}
          />
          <StepperRow
            label={t.lastSession.duration}
            value={t.common.duration(draft.durationMinutes)}
            canDecrease={draft.durationMinutes > 5}
            canIncrease={draft.durationMinutes < 300}
            onDecrease={() => step('durationMinutes', -5, 5, 300)}
            onIncrease={() => step('durationMinutes', 5, 5, 300)}
          />
          <StepperRow
            label={t.lastSession.focusScore}
            value={String(draft.focusScore)}
            canDecrease={draft.focusScore > 0}
            canIncrease={draft.focusScore < 100}
            onDecrease={() => step('focusScore', -5, 0, 100)}
            onIncrease={() => step('focusScore', 5, 0, 100)}
          />
          <StepperRow
            label={t.lastSession.distractions}
            value={String(draft.distractions)}
            canDecrease={draft.distractions > 0}
            canIncrease={draft.distractions < 99}
            onDecrease={() => step('distractions', -1, 0, 99)}
            onIncrease={() => step('distractions', 1, 0, 99)}
          />
          <StepperRow
            label={t.lastSession.postureWarnings}
            value={String(draft.postureWarnings)}
            canDecrease={draft.postureWarnings > 0}
            canIncrease={draft.postureWarnings < 99}
            onDecrease={() => step('postureWarnings', -1, 0, 99)}
            onIncrease={() => step('postureWarnings', 1, 0, 99)}
          />
          <SettingsRow label={t.admin.addSession} onPress={saveDraft} />
        </SettingsSection>

        <View style={styles.group}>
          <SettingsSection title={t.admin.sections.sessions}>
            <SettingsRow
              label={t.admin.fillSample}
              value={t.admin.sessionCount(sessions.length)}
              onPress={() => addSessions(makeSampleSessions())}
            />
            <SettingsRow label={t.admin.deleteSessions} destructive onPress={confirmDeleteSessions} />
          </SettingsSection>
          <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
            {t.admin.sessionsNote}
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

type StepperRowProps = {
  label: string;
  value: string;
  canDecrease: boolean;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
};

function StepperRow({
  label,
  value,
  canDecrease,
  canIncrease,
  onDecrease,
  onIncrease,
}: StepperRowProps) {
  const { t } = useLanguage();

  return (
    <View style={styles.stepperRow}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <StepperButton
        icon={{ ios: 'minus', android: 'remove', web: 'remove' }}
        label={t.admin.decrease(label)}
        disabled={!canDecrease}
        onPress={onDecrease}
      />
      <ThemedText type="smallBold" style={styles.value}>
        {value}
      </ThemedText>
      <StepperButton
        icon={{ ios: 'plus', android: 'add', web: 'add' }}
        label={t.admin.increase(label)}
        disabled={!canIncrease}
        onPress={onIncrease}
      />
    </View>
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
