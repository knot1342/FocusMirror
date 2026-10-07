import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/i18n/language';

const PANEL_WIDTH = 280;

export type SideMenuItem = {
  label: string;
  icon: SymbolViewProps['name'];
  onPress: () => void;
};

type SideMenuProps = {
  open: boolean;
  onClose: () => void;
  items: SideMenuItem[];
};

export function SideMenu({ open, onClose, items }: SideMenuProps) {
  const theme = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(withTiming(open ? 1 : 0, { duration: 220 }));
  }, [open, progress]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.get() }));
  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.get(), [0, 1], [-PANEL_WIDTH, 0]) }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { pointerEvents: open ? 'auto' : 'none' }]}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={t.menu.close} />
      </Animated.View>

      <Animated.View
        style={[
          styles.panel,
          { backgroundColor: theme.background, paddingTop: insets.top + Spacing.three },
          panelStyle,
        ]}>
        <ThemedText type="smallBold" style={styles.brand}>
          FocusMirror
        </ThemedText>

        {items.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => {
              onClose();
              item.onPress();
            }}
            style={({ pressed }) => [
              styles.item,
              pressed && { backgroundColor: theme.backgroundElement },
            ]}>
            <SymbolView name={item.icon} tintColor={theme.text} size={22} />
            <ThemedText>{item.label}</ThemedText>
          </Pressable>
        ))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: PANEL_WIDTH,
    paddingHorizontal: Spacing.three,
    gap: Spacing.one,
  },
  brand: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
});
