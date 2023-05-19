import { Poke } from '../lib/types';
import { StorageUpdate, StorageUpdateCurrentBucket, StorageUpdateAddBucket, StorageUpdateRemoveBucket, StorageUpdateEndpoint, StorageUpdateAccessKeyId, StorageUpdateSecretAccessKey } from './types';

const s3Action = <T extends StorageUpdate>(
  data: any
): Poke<T> => ({
  app: 's3-store',
  mark: 's3-action',
  json: data
});

export const setCurrentBucket = (
  bucket: string
): Poke<StorageUpdateCurrentBucket> => s3Action({
  'set-current-bucket': bucket
});

export const addBucket = (
  bucket: string
): Poke<StorageUpdateAddBucket> => s3Action({
  'add-bucket': bucket
});

export const removeBucket = (
  bucket: string
): Poke<StorageUpdateRemoveBucket> => s3Action({
  'remove-bucket': bucket
});

export const setEndpoint = (
  endpoint: string
): Poke<StorageUpdateEndpoint> => s3Action({
  'set-endpoint': endpoint
});

export const setAccessKeyId = (
  accessKeyId: string
): Poke<StorageUpdateAccessKeyId> => s3Action({
  'set-access-key-id': accessKeyId
});

export const setSecretAccessKey = (
  secretAccessKey: string
): Poke<StorageUpdateSecretAccessKey> => s3Action({
  'set-secret-access-key': secretAccessKey
});

