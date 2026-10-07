import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Accent, Spacing } from '@/constants/theme';
import { useSessions } from '@/hooks/use-sessions';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/i18n/language';

/** The most recent session's focus score and stats, linking to the Result tab. */
export function LastSession() {
  const theme = useTheme();
  const { language, t } = useLanguage();
  const session = useSessions().at(-1);

  if (!session) {
    return (
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold">{t.lastSession.title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {t.lastSession.empty}
        </ThemedText>
      </ThemedView>
    );
  }

  const when = new Intl.DateTimeFormat(language, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(session.startedAt));

  const stats = [
    { label: t.lastSession.duration, value: t.common.duration(session.durationMinutes) },
    { label: t.lastSession.distractions, value: String(session.distractions) },
    { label: t.lastSession.postureWarnings, value: String(session.postureWarnings) },
  ];

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="smallBold">{t.lastSession.title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {when}
        </ThemedText>
      </View>

      <View style={styles.scoreRow}>
        <ThemedText style={styles.score}>{session.focusScore}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          / 100 {t.lastSession.focusScore}
        </ThemedText>
      </View>
      <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
        <View style={[styles.fill, { width: `${session.focusScore}%`, backgroundColor: Accent }]} />
      </View>

      <View style={styles.stats}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {stat.label}
            </ThemedText>
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => router.navigate('/results')}
        style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
        <ThemedText type="smallBold">{t.lastSession.viewReport}</ThemedText>
        <SymbolView
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          tintColor={theme.text}
          size={14}
        />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.two,
    marginBottom: -Spacing.two,
  },
  score: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: 700,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  stats: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.6,
  },
});
