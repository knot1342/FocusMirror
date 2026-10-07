import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Accent, Spacing } from '@/constants/theme';
import { toDayKey, useUsageStreak } from '@/hooks/use-usage-streak';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/i18n/language';

/** Gap between one used day starting to fill and the next, earliest day first. */
const FILL_STAGGER_MS = 25;
const FILL_DURATION_MS = 400;

/** Month grid that highlights every day the app was used, with the current and best streaks. */
export function StreakCalendar() {
  const theme = useTheme();
  const { language, t } = useLanguage();
  const { days, current, longest } = useUsageStreak();

  const today = new Date();
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const isCurrentMonth =
    month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  // Leading blanks so the 1st lands under its weekday (weeks start on Sunday).
  const cells: (Date | null)[] = [
    ...Array<null>(month.getDay()).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1),
    ),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = new Intl.DateTimeFormat(language, { year: 'numeric', month: 'long' }).format(
    month,
  );

  // Used days fill in date order, so each one's delay is its position among this month's used days.
  let usedOrder = 0;

  function shiftMonth(delta: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
  }

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <ThemedText style={styles.statValue}>{t.streak.days(current)}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t.streak.current}
          </ThemedText>
        </View>
        <View style={styles.stat}>
          <ThemedText style={styles.statValue}>{t.streak.days(longest)}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t.streak.longest}
          </ThemedText>
        </View>
      </View>

      <View style={styles.monthRow}>
        <Pressable
          onPress={() => shiftMonth(-1)}
          hitSlop={Spacing.two}
          accessibilityLabel={t.streak.previousMonth}
          style={({ pressed }) => pressed && styles.pressed}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            tintColor={theme.text}
            size={20}
          />
        </Pressable>
        <ThemedText type="smallBold">{monthLabel}</ThemedText>
        <Pressable
          onPress={() => shiftMonth(1)}
          disabled={isCurrentMonth}
          hitSlop={Spacing.two}
          accessibilityLabel={t.streak.nextMonth}
          style={({ pressed }) => [pressed && styles.pressed, isCurrentMonth && styles.disabled]}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            tintColor={theme.text}
            size={20}
          />
        </Pressable>
      </View>

      <View style={styles.grid}>
        {t.streak.weekdays.map((weekday, i) => (
          <View key={`weekday-${i}`} style={styles.cell}>
            <ThemedText type="small" themeColor="textSecondary">
              {weekday}
            </ThemedText>
          </View>
        ))}
        {cells.map((date, i) => {
          if (!date) return <View key={`blank-${i}`} style={styles.cell} />;
          const key = toDayKey(date);
          const isToday = key === toDayKey(today);
          if (days.has(key)) {
            const order = usedOrder++;
            return (
              <View key={key} style={styles.cell}>
                <UsedDay
                  label={`${key} ${t.streak.used}`}
                  day={date.getDate()}
                  delay={order * FILL_STAGGER_MS}
                />
              </View>
            );
          }
          return (
            <View key={key} style={styles.cell}>
              <View
                accessibilityLabel={key}
                style={[styles.day, isToday && { borderColor: theme.text, borderWidth: 1 }]}>
                <ThemedText type="small">{date.getDate()}</ThemedText>
              </View>
            </View>
          );
        })}
      </View>
    </ThemedView>
  );
}

/** A used day that fades from white to orange after `delay` ms. */
function UsedDay({ label, day, delay }: { label: string; day: number; delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(withDelay(delay, withTiming(1, { duration: FILL_DURATION_MS })));
  }, [delay, progress]);

  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.get(), [0, 1], ['#FFFFFF', Accent]),
  }));
  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.get(), [0, 1], ['#000000', '#FFFFFF']),
  }));

  return (
    <Animated.View accessibilityLabel={label} style={[styles.day, boxStyle]}>
      <Animated.Text style={[styles.dayNumber, textStyle]}>{day}</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  stats: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 700,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.3,
  },
});
