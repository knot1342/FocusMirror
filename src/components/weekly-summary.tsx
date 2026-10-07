import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Accent, Spacing } from '@/constants/theme';
import { useSessions } from '@/hooks/use-sessions';
import { useTheme } from '@/hooks/use-theme';
import { toDayKey } from '@/hooks/use-usage-streak';
import { useLanguage } from '@/i18n/language';

const CHART_HEIGHT = 120;
const BAR_WIDTH = 24;

/** Focus minutes for each of the last 7 days, ending today, with the change from the week before. */
export function WeeklySummary() {
  const theme = useTheme();
  const { language, t } = useLanguage();
  const sessions = useSessions();

  const today = new Date();
  const minutesByDay = new Map<string, number>();
  for (const session of sessions) {
    const key = toDayKey(new Date(session.startedAt));
    minutesByDay.set(key, (minutesByDay.get(key) ?? 0) + session.durationMinutes);
  }
  const dayAt = (offset: number) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = dayAt(i - 6);
    return { date, minutes: minutesByDay.get(toDayKey(date)) ?? 0 };
  });
  const total = week.reduce((sum, day) => sum + day.minutes, 0);
  const previousTotal = Array.from({ length: 7 }, (_, i) => dayAt(i - 13)).reduce(
    (sum, date) => sum + (minutesByDay.get(toDayKey(date)) ?? 0),
    0,
  );
  const change = previousTotal > 0 ? Math.round(((total - previousTotal) / previousTotal) * 100) : null;
  const max = Math.max(...week.map((day) => day.minutes), 1);

  // Today is labelled by default; tapping a bar labels that day instead.
  const [selected, setSelected] = useState(6);
  const weekday = new Intl.DateTimeFormat(language, { weekday: 'short' });

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="smallBold">{t.weekly.title}</ThemedText>
      </View>

      {total === 0 ? (
        <ThemedText type="small" themeColor="textSecondary">
          {t.weekly.empty}
        </ThemedText>
      ) : (
        <>
          <View>
            <ThemedText style={styles.total}>{t.common.duration(total)}</ThemedText>
            {change !== null && (
              <ThemedText type="small" themeColor="textSecondary">
                {t.weekly.change(change)}
              </ThemedText>
            )}
          </View>

          <View>
            <View style={styles.bars}>
              {week.map((day, i) => (
                <Pressable
                  key={toDayKey(day.date)}
                  onPress={() => setSelected(i)}
                  accessibilityLabel={`${weekday.format(day.date)} ${t.common.duration(day.minutes)}`}
                  style={styles.slot}>
                  {i === selected && (
                    <ThemedText type="small" style={styles.value}>
                      {t.common.duration(day.minutes)}
                    </ThemedText>
                  )}
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max((day.minutes / max) * CHART_HEIGHT, day.minutes > 0 ? 4 : 0),
                        backgroundColor: Accent,
                        opacity: i === selected ? 1 : 0.55,
                      },
                    ]}
                  />
                </Pressable>
              ))}
            </View>
            <View style={[styles.baseline, { backgroundColor: theme.backgroundSelected }]} />
            <View style={styles.labels}>
              {week.map((day, i) => (
                <ThemedText
                  key={toDayKey(day.date)}
                  type="small"
                  themeColor={i === selected ? 'text' : 'textSecondary'}
                  style={styles.label}>
                  {i === 6 ? t.weekly.today : weekday.format(day.date)}
                </ThemedText>
              ))}
            </View>
          </View>
        </>
      )}
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
  total: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: 700,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // Room above the tallest bar for its value label.
    height: CHART_HEIGHT + 24,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  value: {
    marginBottom: Spacing.one,
  },
  bar: {
    width: BAR_WIDTH,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  baseline: {
    height: 1,
  },
  labels: {
    flexDirection: 'row',
    marginTop: Spacing.one,
  },
  label: {
    flex: 1,
    textAlign: 'center',
  },
});
