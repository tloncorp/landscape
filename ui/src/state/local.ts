import { storageVersion } from '@/constants';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import produce from 'immer';
import {
  clearStorageMigration,
  createStorageKey,
} from '@/logic/utils';

export type SubscriptionStatus = 'connected' | 'disconnected' | 'reconnecting';

interface LocalState {
  browserId: string;
  currentTheme: 'light' | 'dark';
  subscription: SubscriptionStatus;
  errorCount: number;
  airLockErrorCount: number;
  lastReconnect: number;
  onReconnect: (() => void) | null;
  set: (f: (s: LocalState) => void) => void;
}

export const useLocalState = create<LocalState>(
  persist<LocalState>(
    (set, get) => ({
      set: (f) => set(produce(get(), f)),
      currentTheme: 'light',
      browserId: '',
      subscription: 'connected',
      errorCount: 0,
      airLockErrorCount: 0,
      lastReconnect: 0,
      onReconnect: null,
    }),
    {
      name: createStorageKey('local'),
      version: storageVersion,
      migrate: clearStorageMigration,
      partialize: ({ currentTheme, browserId }) => ({
        currentTheme,
        browserId,
      }),
    }
  )
);

export function initializeBrowserId() {
  if (useLocalState.getState().browserId) {
    return;
  }

  // A persistent settings key must not change with fingerprint protection.
  // getRandomValues also works on HTTP origins, unlike randomUUID.
  const browserId = Array.from(
    crypto.getRandomValues(new Uint8Array(16)),
    (byte) => byte.toString(16).padStart(2, '0')
  ).join('');
  useLocalState.setState({ browserId });
}

const selBrowserId = (s: LocalState) => s.browserId;
export function useBrowserId() {
  return useLocalState(selBrowserId);
}

const selCurrentTheme = (s: LocalState) => s.currentTheme;
export function useCurrentTheme() {
  return useLocalState(selCurrentTheme);
}

export const setLocalState = (f: (s: LocalState) => void) =>
  useLocalState.getState().set(f);

const selSubscriptionStatus = (s: LocalState) => ({
  subscription: s.subscription,
  errorCount: s.errorCount,
  airLockErrorCount: s.airLockErrorCount,
});
export function useSubscriptionStatus() {
  return useLocalState(selSubscriptionStatus);
}

const selLast = (s: LocalState) => s.lastReconnect;
export function useLastReconnect() {
  return useLocalState(selLast);
}
