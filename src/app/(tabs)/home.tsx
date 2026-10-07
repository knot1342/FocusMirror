import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LastSession } from '@/components/last-session';
import { SideMenu } from '@/components/side-menu';
import { StreakCalendar } from '@/components/streak-calendar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WeeklySummary } from '@/components/weekly-summary';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/i18n/language';

export default function HomeScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.titleRow}>
          <Pressable
            onPress={() => setMenuOpen(true)}
            hitSlop={Spacing.two}
            accessibilityLabel={t.home.openMenu}
            style={({ pressed }) => pressed && styles.pressed}>
            <SymbolView
              name={{ ios: 'line.3.horizontal', android: 'menu', web: 'menu' }}
              tintColor={theme.text}
              size={28}
            />
          </Pressable>
          <ThemedText style={styles.title} accessibilityRole="header">
            FocusMirror
          </ThemedText>
        </View>

        {/* TODO: open the profile screen once it exists. */}
        <Pressable
          hitSlop={Spacing.two}
          accessibilityLabel={t.home.profile}
          style={({ pressed }) => pressed && styles.pressed}>
          <SymbolView
            name={{ ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' }}
            tintColor={theme.text}
            size={32}
          />
        </Pressable>
      </SafeAreaView>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}>
        <StreakCalendar />
        <LastSession />
        <WeeklySummary />
      </ScrollView>

      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={[
          {
            label: t.menu.home,
            icon: { ios: 'house', android: 'home', web: 'home' },
            onPress: () => {},
          },
          {
            label: t.menu.settings,
            icon: { ios: 'gearshape', android: 'settings', web: 'settings' },
            onPress: () => router.push('/settings'),
          },
          {
            label: t.menu.about,
            icon: { ios: 'info.circle', android: 'info', web: 'info' },
            onPress: () => router.push('/about'),
          },
          {
            label: t.menu.admin,
            icon: {
              ios: 'wrench.and.screwdriver',
              android: 'admin_panel_settings',
              web: 'admin_panel_settings',
            },
            onPress: () => router.push('/admin'),
          },
          {
            label: t.menu.signOut,
            icon: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' },
            onPress: () => router.replace('/'),
          },
        ]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  content: {
    padding: Spacing.three,
    // Keeps the last card clear of the tab bar.
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
  },
  pressed: {
    opacity: 0.6,
  },
});
