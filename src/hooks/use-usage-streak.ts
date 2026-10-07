import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'usage-days';

/** A local calendar day as `YYYY-MM-DD`, so days line up with the user's own midnight. */
export function toDayKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Consecutive used days ending today, or ending yesterday if today is not used yet. */
function currentStreak(days: ReadonlySet<string>, today: Date) {
  let cursor = days.has(toDayKey(today)) ? today : addDays(today, -1);
  let streak = 0;
  while (days.has(toDayKey(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function longestStreak(days: ReadonlySet<string>) {
  let longest = 0;
  for (const key of days) {
    const [year, month, day] = key.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    // Only count from the first day of each run.
    if (days.has(toDayKey(addDays(date, -1)))) continue;
    let length = 0;
    while (days.has(toDayKey(addDays(date, length)))) length++;
    longest = Math.max(longest, length);
  }
  return longest;
}

/**
 * Returns `days` with the current run replaced by `count` consecutive days ending today.
 * The day just before the new run is cleared too, so an older run can't merge into it and
 * the resulting streak is exactly `count`. Every other day is left as is.
 */
export function withCurrentStreak(days: ReadonlySet<string>, count: number, today: Date) {
  const next = new Set(days);
  let cursor = next.has(toDayKey(today)) ? today : addDays(today, -1);
  while (next.delete(toDayKey(cursor))) cursor = addDays(cursor, -1);
  for (let i = 0; i < count; i++) next.add(toDayKey(addDays(today, -i)));
  next.delete(toDayKey(addDays(today, -count)));
  return next;
}

// Module-level store so every screen using the hook shares the same days.
let usedDays: ReadonlySet<string> = new Set();
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit(next: ReadonlySet<string>) {
  usedDays = next;
  listeners.forEach((listener) => listener());
}

function persist(days: ReadonlySet<string>) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...days])).catch(() => {});
}

/** Loads the stored days once per app run and marks today as used. */
function load() {
  loading ??= AsyncStorage.getItem(STORAGE_KEY)
    .then((stored) => {
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      const next = new Set(Array.isArray(parsed) ? parsed.filter((d) => typeof d === 'string') : []);
      const today = toDayKey(new Date());
      if (!next.has(today)) {
        next.add(today);
        persist(next);
      }
      emit(next);
    })
    .catch(() => emit(new Set([toDayKey(new Date())])));
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
  return usedDays;
}

/** Rewrites the current streak to `count` days ending today (0 clears it, including today). */
export async function setCurrentStreak(count: number) {
  await load();
  const next = withCurrentStreak(usedDays, Math.max(0, Math.floor(count)), new Date());
  emit(next);
  persist(next);
}

/** Marks today as a used day and returns every used day plus the current and longest streaks. */
export function useUsageStreak() {
  const days = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    days,
    current: currentStreak(days, new Date()),
    longest: longestStreak(days),
  };
}
