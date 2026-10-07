import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/i18n/language';

export default function SessionScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  // Only run the camera while this tab is on screen, so it turns off when you switch tabs.
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <ThemedText style={styles.title} accessibilityRole="header">
          {t.session.title}
        </ThemedText>
      </SafeAreaView>

      <View style={styles.content}>
        <ThemedView type="backgroundElement" style={styles.preview}>
          {permission?.granted ? (
            isFocused && <CameraView facing="front" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={styles.permission}>
              <SymbolView
                name={{ ios: 'camera.viewfinder', android: 'center_focus_strong', web: 'center_focus_strong' }}
                tintColor={theme.textSecondary}
                size={48}
              />
              {permission && (
                <>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
                    {t.session.cameraNeeded}
                  </ThemedText>
                  {/* Once permission is permanently denied, only the system settings can grant it. */}
                  <Pressable
                    onPress={permission.canAskAgain ? requestPermission : () => Linking.openSettings()}
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.permissionButton,
                      { borderColor: theme.text },
                      pressed && styles.pressed,
                    ]}>
                    <ThemedText type="smallBold">
                      {permission.canAskAgain ? t.session.allowCamera : t.session.openSettings}
                    </ThemedText>
                  </Pressable>
                </>
              )}
            </View>
          )}
        </ThemedView>
        <ThemedText themeColor="textSecondary" style={styles.description}>
          {t.session.description}
        </ThemedText>

        {/* TODO: start a focus session once camera tracking exists. */}
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.startButton,
            { backgroundColor: theme.text },
            pressed && styles.pressed,
          ]}>
          <SymbolView
            name={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}
            tintColor={theme.background}
            size={20}
          />
          <ThemedText style={[styles.startLabel, { color: theme.background }]}>
            {t.session.start}
          </ThemedText>
        </Pressable>
      </View>
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
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.four,
  },
  description: {
    textAlign: 'center',
  },
  preview: {
    // Centered rather than stretched: when maxHeight shrinks the box, aspectRatio narrows it too.
    alignSelf: 'center',
    width: '100%',
    aspectRatio: 3 / 4,
    maxHeight: '60%',
    borderRadius: Spacing.four,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permission: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  permissionButton: {
    borderWidth: 1,
    borderRadius: Spacing.six,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    alignSelf: 'stretch',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.six,
  },
  startLabel: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
  },
  pressed: {
    opacity: 0.6,
  },
});
