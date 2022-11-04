import {
  getVats,
  Vats,
  scryLag,
  getBlockers,
  Vat,
  kilnInstall,
  kilnPause,
  kilnResume,
  getPikes,
  Pikes,
  Pike
} from '@urbit/api';
import create from 'zustand';
import produce from 'immer';
import { useCallback } from 'react';
import api from './api';
import { fakeRequest, useMockData } from './util';
import { mockPikes, mockVats } from './mock-data';

interface KilnState {
  vats: Vats;
  pikes: Pikes;
  loaded: boolean;
  lag: boolean;
  fetchLag: () => Promise<void>;
  fetchPikes: () => Promise<void>;
  changeOTASource: (ship: string) => Promise<void>;
  toggleOTAs: (desk: string, on: boolean) => Promise<void>;
  set: (s: KilnState) => void;
  initializeKiln: () => Promise<void>;
}
const useKilnState = create<KilnState>((set, get) => ({
  vats: {},
  pikes: useMockData ? mockPikes : {},
  lag: false,
  loaded: false,
  fetchPikes: async () => {
    if (useMockData) {
      await fakeRequest({}, 500);
      set({ loaded: true });
      return;
    }
    const pikes = await api.scry<Pikes>(getPikes);
    set({ pikes, loaded: true });
  },
  fetchLag: async () => {
    const lag = await api.scry<boolean>(scryLag);
    set({ lag });
  },
  changeOTASource: async (ship: string) => {
    await api.poke(kilnInstall(ship, 'kids', 'base'));
  },
  toggleOTAs: async (desk: string, on: boolean) => {
    set(
      produce((draft: KilnState) => {
        const pike = draft.pikes[desk];
        if (!pike) {
          return;
        }

        pike.zest = on ? 'live' : 'held';
      })
    );

    await api.poke(on ? kilnResume(desk) : kilnPause(desk));
    await get().fetchPikes(); // refresh pikes state
  },
  set: produce(set),
  initializeKiln: async () => {
      await get().fetchLag();
      await get().fetchPikes();
  }
}));

const selBlockers = (s: KilnState) => getBlockers(s.vats);
export function useBlockers() {
  return useKilnState(selBlockers);
}

export function useVat(desk: string): Vat | undefined {
  return useKilnState(useCallback((s) => s.vats[desk], [desk]));
}

const selPikes = (s: KilnState) => s.pikes;
export function usePikes(): Pikes {
  return useKilnState(selPikes);
}

export function usePike(desk: string): Pike | undefined {
  return useKilnState(useCallback((s) => s.pikes[desk], [desk]));
}

const selLag = (s: KilnState) => s.lag;
export function useLag() {
  return useKilnState(selLag);
}

const selLoaded = (s: KilnState) => s.loaded;
export function useKilnLoaded() {
  return useKilnState(selLoaded);
}

export default useKilnState;
