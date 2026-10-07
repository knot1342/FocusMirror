import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocales } from 'expo-localization';
import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { translations, type Language, type Translations } from './translations';

export type LanguagePreference = 'system' | Language;

const STORAGE_KEY = 'language-preference';

function isLanguagePreference(value: unknown): value is LanguagePreference {
  return value === 'system' || (typeof value === 'string' && value in translations);
}

type LanguageContextValue = {
  /** The language currently shown. */
  language: Language;
  /** What the user picked; 'system' follows the device language. */
  preference: LanguagePreference;
  setPreference: (preference: LanguagePreference) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locales = useLocales();
  const [preference, setPreferenceState] = useState<LanguagePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (isLanguagePreference(stored)) setPreferenceState(stored);
      })
      .catch(() => {});
  }, []);

  function setPreference(next: LanguagePreference) {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }

  const systemLanguage: Language = locales[0]?.languageCode === 'ja' ? 'ja' : 'en';
  const language = preference === 'system' ? systemLanguage : preference;

  return (
    <LanguageContext value={{ language, preference, setPreference, t: translations[language] }}>
      {children}
    </LanguageContext>
  );
}

export function useLanguage() {
  const context = use(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
