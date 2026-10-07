import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { getPreferences, setPreferences } from '@/hooks/use-preferences';

const CHANNEL_ID = 'default';
const supported = Platform.OS !== 'web';

if (supported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'FocusMirror',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

async function requestPermission() {
  await ensureChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

/** Turns local notifications on or off; returns whether they end up enabled. */
export async function setNotificationsEnabled(enabled: boolean): Promise<boolean> {
  if (!enabled || !supported) {
    await setPreferences({ notifications: false });
    if (supported) await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
    return false;
  }

  const granted = await requestPermission().catch(() => false);
  await setPreferences({ notifications: granted });
  return granted;
}

/** Shows a local notification right away, if the user has notifications turned on. */
export async function notify(title: string, body: string) {
  if (!supported) return;
  const { notifications } = await getPreferences();
  if (!notifications) return;
  await ensureChannel();
  await Notifications.scheduleNotificationAsync({ content: { title, body }, trigger: null });
}
