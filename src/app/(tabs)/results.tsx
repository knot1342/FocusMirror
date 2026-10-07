import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/i18n/language';

// TODO: list session reports once focus sessions are recorded.
export default function ResultsScreen() {
  const theme = useTheme();
  const { t } = useLanguage();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <ThemedText style={styles.title} accessibilityRole="header">
          {t.results.title}
        </ThemedText>
      </SafeAreaView>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}>
        <ThemedView type="backgroundElement" style={styles.card}>
          <SymbolView
            name={{ ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' }}
            tintColor={theme.textSecondary}
            size={40}
          />
          <View style={styles.cardText}>
            <ThemedText type="smallBold">{t.results.emptyTitle}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.centered}>
              {t.results.emptyBody}
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
  },
  content: {
    width: '100%',
    // Keeps the last card clear of the tab bar.
    paddingBottom: Spacing.five,
    maxWidth: 600,
    alignSelf: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  card: {
    alignItems: 'center',
    borderRadius: Spacing.three,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  cardText: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  centered: {
    textAlign: 'center',
  },
});
