import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/i18n/language';

export default function TabLayout() {
  const theme = useTheme();
  const { t } = useLanguage();

  return (
    <NativeTabs
      tintColor={theme.text}
      // iOS keeps the system (liquid glass) bar; elsewhere match the app background.
      backgroundColor={Platform.OS === 'ios' ? undefined : theme.background}
      indicatorColor={theme.backgroundSelected}>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
        <NativeTabs.Trigger.Label>{t.tabs.home}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="results">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }}
          md="bar_chart"
        />
        <NativeTabs.Trigger.Label>{t.tabs.results}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="session">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'play.circle', selected: 'play.circle.fill' }}
          md="play_circle"
        />
        <NativeTabs.Trigger.Label>{t.tabs.session}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
