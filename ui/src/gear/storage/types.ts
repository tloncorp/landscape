import { S3Client } from '@aws-sdk/client-s3';

export type Status = 'initial' | 'idle' | 'loading' | 'success' | 'error';

export interface StorageCredentials {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
}

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

export interface GcpToken {
  accessKey: string;
  expiresIn: number;
}

export interface FileStoreFile {
  key: string;
  file: File;
  url: string;
  size: [number, number];
}

export interface Upload extends FileStoreFile {
  status: Status;
  errorMessage?: string;
}

interface UpdateStatus {
  (uploader: string, key: string, status: 'error', msg: string): void;
  (
    uploader: string,
    key: string,
    status: Omit<Status, 'error'>,
    msg?: string
  ): void;
}

export interface Uploader {
  files: Record<string, Upload>;
  getMostRecent: () => Upload | null;
  uploadFiles: (files: FileList | null) => Promise<void>;
  removeByURL: (url: string) => void;
  clear: () => void;
  prompt: () => void;
}

export interface FileStore {
  client: S3Client | null;
  uploaders: Record<string, Uploader>;
  getUploader: (key: string) => Uploader;
  createClient: (s3: StorageCredentials, region: string) => void;
  update: (key: string, updateFn: (uploader: Uploader) => void) => void;
  uploadFiles: (
    uploader: string,
    files: FileList | null,
    bucket: string
  ) => Promise<void>;
  upload: (uploader: string, upload: Upload, bucket: string) => Promise<void>;
  clear: (uploader: string) => void;
  updateFile: (
    uploader: string,
    key: string,
    file: Partial<FileStoreFile>
  ) => void;
  updateStatus: UpdateStatus;
  removeByURL: (uploader: string, url: string) => void;
  getMostRecent: (uploader: string) => Upload | null;
}

export interface UploadInputProps {
  multiple?: boolean;
  id: string;
}

export interface StorageUpdateCredentials {
  credentials: StorageCredentials;
}

export interface StorageUpdateConfiguration {
  configuration: {
      buckets: string[];
      currentBucket: string;
  };
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

export interface StorageUpdateRegion {
  setRegion: string;
}

export declare type StorageUpdate = StorageUpdateCredentials | StorageUpdateConfiguration | StorageUpdateCurrentBucket | StorageUpdateAddBucket | StorageUpdateRemoveBucket | StorageUpdateEndpoint | StorageUpdateAccessKeyId | StorageUpdateSecretAccessKey | StorageUpdateRegion;
