import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { MIN_PASSWORD_LENGTH } from '@/hooks/use-account';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/i18n/language';
import type { Translations } from '@/i18n/translations';
import { supabase } from '@/lib/supabase';

type PasswordError = keyof Translations['changePassword']['errors'];

export default function ChangePasswordScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<PasswordError | null>(null);
  const [saving, setSaving] = useState(false);
  const { session } = useAuth();

  function validate(): PasswordError | null {
    if (!current || !next || !confirm) return 'missing';
    if (next.length < MIN_PASSWORD_LENGTH) return 'shortPassword';
    if (next === current) return 'samePassword';
    if (next !== confirm) return 'mismatch';
    return null;
  }

  async function handleSave() {
    const result = validate();
    setError(result);
    if (result || saving || !session?.user.email) return;
    setSaving(true);
    // Supabase doesn't check the old password on update, so confirm it by signing in again first.
    const check = await supabase.auth.signInWithPassword({ email: session.user.email, password: current });
    if (check.error) {
      setSaving(false);
      setError('wrongCurrent');
      return;
    }
    const update = await supabase.auth.updateUser({ password: next });
    setSaving(false);
    if (update.error) {
      setError('failed');
      return;
    }
    Alert.alert(t.changePassword.updated);
    router.back();
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.backgroundElement, color: theme.text },
  ];

  const fields = [
    { label: t.changePassword.current, value: current, onChange: setCurrent, isNew: false },
    { label: t.changePassword.new, value: next, onChange: setNext, isNew: true },
    { label: t.changePassword.confirm, value: confirm, onChange: setConfirm, isNew: true },
  ];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t.changePassword.title }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>
        {fields.map((field, index) => {
          const last = index === fields.length - 1;
          return (
            <View key={field.label} style={styles.field}>
              <ThemedText type="small" themeColor="textSecondary">
                {field.label}
              </ThemedText>
              <TextInput
                style={inputStyle}
                placeholder={field.label}
                placeholderTextColor={theme.textSecondary}
                value={field.value}
                onChangeText={field.onChange}
                secureTextEntry
                autoCapitalize="none"
                autoComplete={field.isNew ? 'new-password' : 'current-password'}
                textContentType={field.isNew ? 'newPassword' : 'password'}
                returnKeyType={last ? 'done' : 'next'}
                onSubmitEditing={last ? handleSave : undefined}
              />
            </View>
          );
        })}

        {error && (
          <ThemedText type="small" style={styles.error}>
            {t.changePassword.errors[error]}
          </ThemedText>
        )}

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.text },
            pressed && styles.pressed,
          ]}>
          <ThemedText type="smallBold" themeColor="background">
            {t.changePassword.save}
          </ThemedText>
        </Pressable>
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
  field: {
    gap: Spacing.one,
  },
  input: {
    height: 48,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  error: {
    color: '#E5484D',
  },
  button: {
    height: 48,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
