import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { getPreferences } from '@/hooks/use-preferences';

/**
 * Session start/end cue, gated by the "Session sounds" setting.
 * There is no bundled audio asset yet, so the cue is haptic feedback for now.
 */
export async function playSessionSound(kind: 'start' | 'end') {
  if (Platform.OS === 'web') return;
  const { sessionSounds } = await getPreferences();
  if (!sessionSounds) return;
  await Haptics.notificationAsync(
    kind === 'start' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning
  ).catch(() => {});
}
