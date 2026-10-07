import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useLanguage } from '@/i18n/language';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const version = Constants.expoConfig?.version;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t.about.title }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
        <View style={styles.intro}>
          <ThemedText type="subtitle">FocusMirror</ThemedText>
          <ThemedText themeColor="textSecondary">{t.about.tagline}</ThemedText>
        </View>

        {t.about.sections.map((section) => (
          <ThemedView key={section.title} type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">{section.title}</ThemedText>
            {section.items.map((item) => (
              <View key={item} style={styles.bulletRow}>
                <ThemedText themeColor="textSecondary">•</ThemedText>
                <ThemedText style={styles.bulletText}>{item}</ThemedText>
              </View>
            ))}
          </ThemedView>
        ))}

        {version && (
          <ThemedText type="small" themeColor="textSecondary" style={styles.version}>
            {t.about.version} {version}
          </ThemedText>
        )}
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
    gap: Spacing.three,
  },
  intro: {
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  bulletText: {
    flex: 1,
  },
  version: {
    textAlign: 'center',
  },
});
