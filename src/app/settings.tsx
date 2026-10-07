import { useCameraPermissions } from 'expo-camera';
import { router, Stack } from 'expo-router';
import { Alert, Linking, ScrollView, Share, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsRow, SettingsSection, SettingsToggleRow } from '@/components/settings-list';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { setPreferences, usePreferences } from '@/hooks/use-preferences';
import { clearSessions, useSessions } from '@/hooks/use-sessions';
import { useUsageStreak } from '@/hooks/use-usage-streak';
import { useLanguage } from '@/i18n/language';
import { LANGUAGE_NAMES } from '@/i18n/translations';
import { setNotificationsEnabled } from '@/lib/notifications';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { language, t, preference } = useLanguage();
  const preferences = usePreferences();
  const sessions = useSessions();
  const { days } = useUsageStreak();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const rows = t.settings.rows;
  const values = t.settings.values;

  async function toggleNotifications(enabled: boolean) {
    const granted = await setNotificationsEnabled(enabled);
    if (enabled && !granted) Alert.alert(rows.allowNotifications, t.settings.notificationsDenied);
  }

  function openCameraPermission() {
    // Once permission is permanently denied, only the system settings can grant it.
    if (cameraPermission && !cameraPermission.granted && cameraPermission.canAskAgain) {
      requestCameraPermission();
    } else {
      Linking.openSettings();
    }
  }

  function exportData() {
    const data = {
      exportedAt: new Date().toISOString(),
      preferences,
      usageDays: [...days].sort(),
      sessions,
    };
    Share.share({ title: t.settings.exportTitle, message: JSON.stringify(data, null, 2) }).catch(
      () => {},
    );
  }

  function confirmClearHistory() {
    const confirm = t.settings.clearConfirm;
    Alert.alert(confirm.title, confirm.message, [
      { text: confirm.cancel, style: 'cancel' },
      {
        text: confirm.confirm,
        style: 'destructive',
        onPress: () => clearSessions().then(() => Alert.alert(confirm.done)),
      },
    ]);
  }

  const calibratedAt = preferences.calibratedAt
    ? new Intl.DateTimeFormat(language, { month: 'short', day: 'numeric' }).format(
        new Date(preferences.calibratedAt),
      )
    : values.notCalibrated;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t.settings.title }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
        <SettingsSection title={t.settings.sections.account}>
          <SettingsRow label={rows.editProfile} onPress={() => router.push('/edit-profile')} />
          <SettingsRow label={rows.changePassword} onPress={() => router.push('/change-password')} />
        </SettingsSection>

        <SettingsSection title={t.settings.sections.focusSession}>
          <SettingsRow
            label={rows.dailyGoal}
            value={t.common.duration(preferences.dailyGoalMinutes)}
            onPress={() => router.push('/daily-goal')}
          />
          <SettingsRow
            label={rows.fatigueSensitivity}
            value={values.sensitivity[preferences.fatigueSensitivity]}
            onPress={() => router.push('/fatigue-sensitivity')}
          />
          <SettingsToggleRow
            label={rows.restReminders}
            value={preferences.restReminders}
            onValueChange={(restReminders) => setPreferences({ restReminders })}
          />
          <SettingsToggleRow
            label={rows.postureWarnings}
            value={preferences.postureWarnings}
            onValueChange={(postureWarnings) => setPreferences({ postureWarnings })}
          />
          <SettingsRow
            label={rows.recalibrateCamera}
            value={calibratedAt}
            onPress={() => router.push('/calibrate')}
          />
        </SettingsSection>

        <SettingsSection title={t.settings.sections.notifications}>
          <SettingsToggleRow
            label={rows.allowNotifications}
            value={preferences.notifications}
            onValueChange={toggleNotifications}
          />
          <SettingsToggleRow
            label={rows.sessionSounds}
            value={preferences.sessionSounds}
            onValueChange={(sessionSounds) => setPreferences({ sessionSounds })}
          />
        </SettingsSection>

        <SettingsSection title={t.settings.sections.appearance}>
          <SettingsRow
            label={rows.language}
            value={preference === 'system' ? t.language.system : LANGUAGE_NAMES[preference]}
            onPress={() => router.push('/language')}
          />
          <SettingsRow
            label={rows.theme}
            value={values.theme[preferences.theme]}
            onPress={() => router.push('/theme')}
          />
        </SettingsSection>

        <SettingsSection title={t.settings.sections.privacy}>
          <SettingsRow
            label={rows.cameraPermission}
            value={cameraPermission?.granted ? values.cameraAllowed : values.cameraNotAllowed}
            onPress={openCameraPermission}
          />
          <SettingsRow label={rows.exportData} onPress={exportData} />
          <SettingsRow label={rows.clearHistory} destructive onPress={confirmClearHistory} />
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
    gap: Spacing.four,
  },
});
