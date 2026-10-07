import { SymbolView } from 'expo-symbols';
import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  const theme = useTheme();
  const rows = Children.toArray(children);

  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      <ThemedView type="backgroundElement" style={styles.card}>
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <View style={[styles.divider, { backgroundColor: theme.backgroundSelected }]} />
            )}
            {row}
          </Fragment>
        ))}
      </ThemedView>
    </View>
  );
}

type SettingsRowProps = {
  label: string;
  value?: string;
  destructive?: boolean;
  /** Makes this an option in a pick-one list: shows a checkmark when true, instead of a chevron. */
  checked?: boolean;
  onPress?: () => void;
};

/** A tappable row with an optional current value and a chevron. */
export function SettingsRow({ label, value, destructive, checked, onPress }: SettingsRowProps) {
  const theme = useTheme();
  const isOption = checked !== undefined;

  return (
    <Pressable
      onPress={onPress}
      accessibilityState={isOption ? { selected: checked } : undefined}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: theme.backgroundSelected }]}>
      <ThemedText style={[styles.label, destructive && styles.destructive]}>{label}</ThemedText>
      {value && <ThemedText themeColor="textSecondary">{value}</ThemedText>}
      {checked && (
        <SymbolView
          name={{ ios: 'checkmark', android: 'check', web: 'check' }}
          tintColor={theme.text}
          size={20}
        />
      )}
      {!destructive && !isOption && (
        <SymbolView
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          tintColor={theme.textSecondary}
          size={16}
        />
      )}
    </Pressable>
  );
}

type SettingsToggleRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function SettingsToggleRow({ label, value, onValueChange }: SettingsToggleRowProps) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.three,
  },
  card: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  label: {
    flex: 1,
  },
  destructive: {
    color: '#E5484D',
  },
});
