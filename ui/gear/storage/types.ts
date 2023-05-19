export interface StorageCredentials {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface StorageConfiguration {
 buckets: Set<string>;
 currentBucket: string;
}

export interface StorageState {
 configuration: StorageConfiguration;
 credentials: StorageCredentials | null;
}

export interface StorageUpdateCredentials {
 credentials: StorageCredentials;
}

export interface StorageUpdateConfiguration {
 configuration: {
   buckets: string[];
   currentBucket: string;
 }
}

export interface StorageUpdateCurrentBucket {
 setCurrentBucket: string;
}

export interface StorageUpdateAddBucket {
 addBucket: string;
}

export interface StorageUpdateRemoveBucket {
 removeBucket: string;
}

export interface StorageUpdateEndpoint {
 setEndpoint: string;
}

export interface StorageUpdateAccessKeyId {
 setAccessKeyId: string;
}

export interface StorageUpdateSecretAccessKey {
 setSecretAccessKey: string;
}

export type StorageUpdate =
 StorageUpdateCredentials
| StorageUpdateConfiguration
| StorageUpdateCurrentBucket
| StorageUpdateAddBucket
| StorageUpdateRemoveBucket
| StorageUpdateEndpoint
| StorageUpdateAccessKeyId
| StorageUpdateSecretAccessKey;
