import _ from 'lodash';
import { enableMapSet } from 'immer';
import { reduce } from './reducer';
import {
  createState,
  createSubscription,
  reduceStateN,
  BaseState,
} from '../base';
import { StorageCredentials } from '@/gear';

enableMapSet();

let numLoads = 0;

export interface BaseStorageState {
  loaded?: boolean;
  hasCredentials?: boolean;
  s3: {
    configuration: {
      buckets: Set<string>;
      currentBucket: string;
      region: string;
    };
    credentials: StorageCredentials | null;
  };
  [ref: string]: unknown;
}

export type StorageState = BaseStorageState & BaseState<BaseStorageState>;

export const useStorage = createState<BaseStorageState>(
  'Storage',
  () => ({
    loaded: false,
    hasCredentials: false,
    s3: {
      configuration: {
        buckets: new Set(),
        currentBucket: '',
        region: '',
      },
      credentials: null,
    },
  }),
  {},
  [
    (set, get) =>
      createSubscription('storage', '/all', (e) => {
        const data = _.get(e, 's3-update', false);
        if (data) {
          reduceStateN(get(), data, reduce);
        }
        numLoads += 1;
        if (numLoads === 2) {
          set({ loaded: true });
        }
      }),
  ]
);
