import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH, setAccount } from '@/hooks/use-account';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/i18n/language';
import type { Translations } from '@/i18n/translations';

type LoginError = keyof Translations['login']['errors'];

export default function LoginScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<LoginError | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('invalidEmail');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError('shortPassword');
      return;
    }
    setError(null);
    setLoading(true);
    // TODO: replace with a real auth call — any valid-looking email/password is accepted for now.
    await new Promise((resolve) => setTimeout(resolve, 600));
    await setAccount({ email: email.trim() });
    setLoading(false);
    router.replace('/home');
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.backgroundElement, color: theme.text },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.form}>
          <ThemedText type="subtitle">{t.login.title}</ThemedText>
          <ThemedText themeColor="textSecondary">{t.login.subtitle}</ThemedText>

          <TextInput
            style={inputStyle}
            placeholder={t.login.email}
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
          />
          <TextInput
            style={inputStyle}
            placeholder={t.login.password}
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={handleSignIn}
          />

          {error && (
            <ThemedText type="small" style={styles.error}>
              {t.login.errors[error]}
            </ThemedText>
          )}

          <Pressable
            onPress={handleSignIn}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: theme.text },
              (pressed || loading) && styles.pressed,
            ]}>
            {loading ? (
              <ActivityIndicator color={theme.background} />
            ) : (
              <ThemedText type="smallBold" themeColor="background">
                {t.login.signIn}
              </ThemedText>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    gap: Spacing.three,
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
