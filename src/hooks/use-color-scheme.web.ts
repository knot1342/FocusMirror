import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { usePreferences } from '@/hooks/use-preferences';

const subscribeNoop = () => () => {};

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 * react-native-web has no Appearance.setColorScheme, so the theme preference is applied here.
 */
export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
  const colorScheme = useRNColorScheme();
  const { theme } = usePreferences();

  if (!hasHydrated) {
    return 'light';
  }

  return theme === 'system' ? colorScheme : theme;
}
