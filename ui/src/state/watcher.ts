import produce from 'immer';
import create from 'zustand';

export type Watcher = {
  time: number;
};

export type WatcherState = {
  watchers: Record<string, Watcher>;
  addWatcher: (key: string, watcher: Watcher) => void;
  removeWatcher: (key: string) => void;
};

export const useWatcherStore = create<WatcherState>((set) => ({
  watchers: {},
  addWatcher: (key, watcher) =>
    set(
      produce((state) => {
        state.watchers[key] = watcher;
      })
    ),
  removeWatcher: (key) =>
    set(
      produce((state) => {
        delete state.watchers[key];
      })
    ),
}));
