import { CameraView, useCameraPermissions } from 'expo-camera';
import { Stack, useIsFocused, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Accent, Spacing } from '@/constants/theme';
import { setPreferences } from '@/hooks/use-preferences';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/i18n/language';

const COUNTDOWN_SECONDS = 3;

type Status = { kind: 'idle' } | { kind: 'counting'; remaining: number } | { kind: 'done' };

export default function CalibrateScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useLanguage();
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  const startCalibration = () => {
    if (timer.current) return;
    let remaining = COUNTDOWN_SECONDS;
    setStatus({ kind: 'counting', remaining });
    timer.current = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setStatus({ kind: 'counting', remaining });
        return;
      }
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
      // TODO: capture the baseline (face size and position in the frame) here once face detection exists.
      setPreferences({ calibratedAt: new Date().toISOString() });
      setStatus({ kind: 'done' });
    }, 1000);
  };

  const counting = status.kind === 'counting';
  const done = status.kind === 'done';

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t.calibrate.title }} />
      <View style={styles.content}>
        <ThemedView type="backgroundElement" style={styles.preview}>
          {done ? (
            <View style={styles.permission}>
              <SymbolView
                name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
                tintColor={Accent}
                size={64}
              />
            </View>
          ) : permission?.granted ? (
            <>
              {isFocused && <CameraView facing="front" style={StyleSheet.absoluteFill} />}
              <View style={styles.overlay} pointerEvents="none">
                <View
                  style={[styles.faceGuide, { borderColor: counting ? Accent : 'rgba(255,255,255,0.85)' }]}
                />
                {counting && <Text style={styles.countdown}>{status.remaining}</Text>}
              </View>
            </>
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

        {done ? (
          <View style={styles.message}>
            <ThemedText type="smallBold" style={styles.description}>
              {t.calibrate.saved}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.description}>
              {t.calibrate.savedBody}
            </ThemedText>
          </View>
        ) : (
          <ThemedText themeColor="textSecondary" style={styles.description}>
            {counting ? t.calibrate.hold : t.calibrate.instructions}
          </ThemedText>
        )}

        <Pressable
          onPress={done ? () => router.back() : startCalibration}
          disabled={!done && (counting || !permission?.granted)}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.text },
            !done && (counting || !permission?.granted) && styles.disabled,
            pressed && styles.pressed,
          ]}>
          <ThemedText style={[styles.buttonLabel, { color: theme.background }]}>
            {done ? t.calibrate.done : t.calibrate.start}
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
  message: {
    gap: Spacing.one,
  },
  preview: {
    alignSelf: 'center',
    width: '100%',
    aspectRatio: 3 / 4,
    maxHeight: '60%',
    borderRadius: Spacing.four,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceGuide: {
    width: '58%',
    aspectRatio: 3 / 4,
    borderWidth: 3,
    borderRadius: 1000,
  },
  countdown: {
    position: 'absolute',
    color: '#ffffff',
    fontSize: 96,
    lineHeight: 112,
    fontWeight: 700,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 12,
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
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.six,
  },
  buttonLabel: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.6,
  },
});
