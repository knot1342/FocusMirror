import type { Session } from '@supabase/supabase-js';
import { useSyncExternalStore } from 'react';

import { supabase } from '@/lib/supabase';

type AuthState = { session: Session | null; loading: boolean };

// Module-level store so every screen sees the same signed-in state.
let state: AuthState = { session: null, loading: true };
let started = false;
const listeners = new Set<() => void>();

function emit(next: AuthState) {
  state = next;
  listeners.forEach((listener) => listener());
}

function start() {
  if (started) return;
  started = true;
  supabase.auth
    .getSession()
    .then(({ data }) => emit({ session: data.session, loading: false }))
    .catch(() => emit({ session: null, loading: false }));
  supabase.auth.onAuthStateChange((_event, session) => emit({ session, loading: false }));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  start();
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

/** The current Supabase session (null when signed out) and whether it is still being restored. */
export function useAuth() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export function signOut() {
  return supabase.auth.signOut();
}
