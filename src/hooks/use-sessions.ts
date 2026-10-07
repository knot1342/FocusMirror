import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'focus-sessions';

export type FocusSession = {
  id: string;
  /** ISO timestamp of when the session started. */
  startedAt: string;
  durationMinutes: number;
  /** Average focus level over the session, 0–100. */
  focusScore: number;
  distractions: number;
  postureWarnings: number;
};

/** Two weeks of made-up history ending today, for the Admin screen. */
export function makeSampleSessions(): FocusSession[] {
  const plan = [
    // [days ago, start hour, minutes, score, distractions, posture warnings]
    [13, 9, 50, 71, 5, 1], [12, 20, 35, 64, 7, 2], [10, 10, 80, 78, 4, 1],
    [9, 19, 45, 69, 6, 0], [8, 9, 60, 74, 3, 1], [7, 15, 25, 58, 8, 3],
    [6, 9, 90, 81, 3, 0], [5, 21, 30, 62, 6, 2], [4, 10, 55, 77, 4, 1],
    [3, 9, 75, 83, 2, 0], [1, 14, 40, 70, 5, 1], [0, 9, 65, 85, 2, 1],
  ] as const;
  const now = new Date();
  return plan.map(([daysAgo, hour, minutes, score, distractions, posture]) => {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, hour);
    return {
      id: `sample-${start.getTime()}`,
      startedAt: start.toISOString(),
      durationMinutes: minutes,
      focusScore: score,
      distractions,
      postureWarnings: posture,
    };
  });
}

// Module-level store so every screen using the hook shares the same sessions.
let sessions: readonly FocusSession[] = [];
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit(next: readonly FocusSession[]) {
  sessions = next;
  listeners.forEach((listener) => listener());
}

function load() {
  loading ??= AsyncStorage.getItem(STORAGE_KEY)
    .then((stored) => {
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) emit(parsed as FocusSession[]);
    })
    .catch(() => {});
  return loading;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  load();
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return sessions;
}

/** Saves finished sessions; one with an id that already exists replaces it. */
export async function addSessions(added: FocusSession[]) {
  await load();
  const ids = new Set(added.map((session) => session.id));
  const next = [...sessions.filter((session) => !ids.has(session.id)), ...added];
  emit(next);
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
}

export function addSession(session: FocusSession) {
  return addSessions([session]);
}

/** Deletes every recorded session. */
export async function clearSessions() {
  await load();
  emit([]);
  AsyncStorage.setItem(STORAGE_KEY, '[]').catch(() => {});
}

/** Every recorded session, oldest first. */
export function useSessions() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return [...stored].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
}
