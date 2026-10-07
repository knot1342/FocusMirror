import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'preferences';

export type FatigueSensitivity = 'low' | 'medium' | 'high';
export type ThemePreference = 'system' | 'light' | 'dark';

export type Preferences = {
  dailyGoalMinutes: number;
  fatigueSensitivity: FatigueSensitivity;
  restReminders: boolean;
  postureWarnings: boolean;
  notifications: boolean;
  sessionSounds: boolean;
  theme: ThemePreference;
  /** ISO timestamp of the last camera calibration, or null if never calibrated. */
  calibratedAt: string | null;
};

export const DEFAULT_PREFERENCES: Preferences = {
  dailyGoalMinutes: 120,
  fatigueSensitivity: 'medium',
  restReminders: true,
  postureWarnings: true,
  notifications: false,
  sessionSounds: false,
  theme: 'system',
  calibratedAt: null,
};

// Module-level store so every screen using the hook shares the same preferences.
let preferences: Preferences = DEFAULT_PREFERENCES;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit(next: Preferences) {
  preferences = next;
  listeners.forEach((listener) => listener());
}

/** Loads the stored preferences once per app run; missing fields keep their defaults. */
export function loadPreferences() {
  loading ??= AsyncStorage.getItem(STORAGE_KEY)
    .then((stored) => {
      const parsed: unknown = stored ? JSON.parse(stored) : null;
      if (parsed && typeof parsed === 'object') emit({ ...DEFAULT_PREFERENCES, ...parsed });
    })
    .catch(() => {});
  return loading;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  loadPreferences();
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return preferences;
}

/** The current preferences, for code outside React. */
export async function getPreferences() {
  await loadPreferences();
  return preferences;
}

/** Updates some preferences and saves them. */
export async function setPreferences(changes: Partial<Preferences>) {
  await loadPreferences();
  const next = { ...preferences, ...changes };
  emit(next);
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
}

export function usePreferences() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
