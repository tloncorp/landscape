import { S3Credentials } from '@urbit/api';
import _ from 'lodash';
import {
  BaseState,
  createState,
  createSubscription,
  pokeOptimisticallyN,
  reduceStateN,
} from '../state/base';
import api from '../state/api';
import { reduce } from './storage-reducer';

export interface GcpToken {
  accessKey: string;
  expiresIn: number;
}

export interface BaseStorageState {
  loaded: boolean;
  hasCredentials: boolean;
  gcp: {
    configured?: boolean;
    token?: GcpToken;
    isConfigured: () => Promise<boolean>;
    getToken: () => Promise<void>;
  };
  s3: {
    configuration: {
      buckets: Set<string>;
      currentBucket: string;
      region: string;
    };
    credentials: S3Credentials | null;
  };
  [ref: string]: unknown;
}

export type StorageState = BaseStorageState & BaseState<BaseStorageState>;

export const useStorageState = createState<BaseStorageState>(
  'Storage',
  (set, get) => ({
    loaded: false,
    hasCredentials: false,
    gcp: {
      isConfigured: () => {
        return api.thread({
          inputMark: 'noun',
          outputMark: 'json',
          threadName: 'gcp-is-configured',
          body: {},
        });
      },
      getToken: async () => {
        const token = await api.thread<GcpToken>({
          inputMark: 'noun',
          outputMark: 'gcp-token',
          threadName: 'gcp-get-token',
          body: {},
        });
        get().set((state) => {
          state.gcp.token = token;
        });
      },
    },
    s3: {
      configuration: {
        buckets: new Set(),
        currentBucket: '',
        region: 'global',
      },
      credentials: null,
    },
  }),
  ['loaded', 's3', 'gcp'],
  [
    (set, get) =>
      createSubscription('storage', '/all', (e) => {
        const d = _.get(e, 's3-update', false);
        if (d) {
          console.log(d);
          reduceStateN(get(), d, reduce);
          set({ loaded: true });
        }
      }),
  ]
);

export default useStorageState;
