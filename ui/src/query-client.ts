import { QueryClient } from '@tanstack/react-query';
import { get, set, del } from 'idb-keyval';
import {
  PersistedClient,
  Persister,
} from '@tanstack/react-query-persist-client';

/**
 * Creates an Indexed DB persister
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function indexedDBPersistor(idbValidKey: IDBValidKey = window.our) {
  return {
    persistClient: async (client: PersistedClient) => {
      set(idbValidKey, client);
    },
    restoreClient: async () => get<PersistedClient>(idbValidKey),
    removeClient: async () => {
      await del(idbValidKey);
    },
  } as Persister;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

export default queryClient;
