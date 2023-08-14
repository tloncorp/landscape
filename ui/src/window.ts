import { useAppSearchStore } from './nav/Nav';
import { useRecentsStore } from './nav/search/Home';

declare global {
  interface Window {
    ship: string;
    desk: string;
    our: string;
    recents: typeof useRecentsStore.getState;
    appSearch: typeof useAppSearchStore.getState;
  }
}

export {};
