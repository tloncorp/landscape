import { Poke } from '@urbit/http-api';
import { StorageUpdate, StorageUpdateCurrentBucket, StorageUpdateAddBucket, StorageUpdateRemoveBucket, StorageUpdateEndpoint, StorageUpdateAccessKeyId, StorageUpdateSecretAccessKey, StorageUpdateRegion } from './types';

const storageAction = <T extends StorageUpdate>(
  data: any
): Poke<T> => ({
  app: 'storage',
  mark: 'storage-action',
  json: data
});

export const setCurrentBucket = (
  bucket: string
): Poke<StorageUpdateCurrentBucket> => storageAction({
  'set-current-bucket': bucket
});

export const addBucket = (
  bucket: string
): Poke<StorageUpdateAddBucket> => storageAction({
  'add-bucket': bucket
});

export const removeBucket = (
  bucket: string
): Poke<StorageUpdateRemoveBucket> => storageAction({
  'remove-bucket': bucket
});

export const setEndpoint = (
  endpoint: string
): Poke<StorageUpdateEndpoint> => storageAction({
  'set-endpoint': endpoint
});

export const setAccessKeyId = (
  accessKeyId: string
): Poke<StorageUpdateAccessKeyId> => storageAction({
  'set-access-key-id': accessKeyId
});

export const setSecretAccessKey = (
  secretAccessKey: string
): Poke<StorageUpdateSecretAccessKey> => storageAction({
  'set-secret-access-key': secretAccessKey
});

export const setRegion = (
  region: string
): Poke<StorageUpdateRegion> => storageAction({
  'set-region': region
})
