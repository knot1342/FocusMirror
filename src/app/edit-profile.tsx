import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { EMAIL_PATTERN, setAccount, useAccount } from '@/hooks/use-account';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/i18n/language';

export default function EditProfileScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const account = useAccount();
  // null = untouched, so the fields follow the stored account until edited.
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [emailDraft, setEmailDraft] = useState<string | null>(null);

  const name = nameDraft ?? account.name;
  const email = emailDraft ?? account.email;
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const emailValid = EMAIL_PATTERN.test(trimmedEmail);
  const changed = trimmedName !== account.name || trimmedEmail !== account.email;
  const canSave = changed && emailValid;

  async function handleSave() {
    if (!canSave) return;
    await setAccount({ name: trimmedName, email: trimmedEmail });
    router.back();
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.backgroundElement, color: theme.text },
  ];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t.editProfile.title }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>
        <View style={styles.field}>
          <ThemedText type="small" themeColor="textSecondary">
            {t.editProfile.name}
          </ThemedText>
          <TextInput
            style={inputStyle}
            placeholder={t.editProfile.name}
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setNameDraft}
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
          />
        </View>
        <View style={styles.field}>
          <ThemedText type="small" themeColor="textSecondary">
            {t.editProfile.email}
          </ThemedText>
          <TextInput
            style={inputStyle}
            placeholder={t.editProfile.email}
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmailDraft}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
        </View>

        {emailDraft !== null && !emailValid && (
          <ThemedText type="small" style={styles.error}>
            {t.editProfile.errors.invalidEmail}
          </ThemedText>
        )}

        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.text },
            pressed && styles.pressed,
            !canSave && styles.disabled,
          ]}>
          <ThemedText type="smallBold" themeColor="background">
            {t.editProfile.save}
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
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
});
