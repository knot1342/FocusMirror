import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'account';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 6;

// Passwords are never stored locally; they belong to the auth server.
export type Account = {
  name: string;
  email: string;
  passwordHash?: never;
};

export const DEFAULT_ACCOUNT: Account = {
  name: '',
  email: '',
};

// Module-level store so every screen using the hook shares the same account.
let account: Account = DEFAULT_ACCOUNT;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit(next: Account) {
  account = next;
  listeners.forEach((listener) => listener());
}

/** Loads the stored account once per app run; missing fields keep their defaults. */
export function loadAccount() {
  loading ??= AsyncStorage.getItem(STORAGE_KEY)
    .then((stored) => {
      const parsed: unknown = stored ? JSON.parse(stored) : null;
      if (parsed && typeof parsed === 'object') emit({ ...DEFAULT_ACCOUNT, ...parsed });
    })
    .catch(() => {});
  return loading;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  loadAccount();
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return account;
}

/** Updates some account fields and saves them. */
export async function setAccount(changes: Partial<Account>) {
  await loadAccount();
  const next = { ...account, ...changes };
  emit(next);
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
}

export function useAccount() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
