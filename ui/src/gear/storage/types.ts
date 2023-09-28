import { S3Client } from '@aws-sdk/client-s3';

export type Status = 'initial' | 'idle' | 'loading' | 'success' | 'error';

export interface StorageConfigurationS3 {
  buckets: Set<string>;
  currentBucket: string;
  region: string;
}

export interface StorageCredentialsS3 {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface StorageCredentialsTlonHosting {
  endpoint: string;
  token: string;
}

export type StorageBackend = 's3' | 'tlon-hosting';

export interface BaseStorageState {
  loaded?: boolean;
  hasCredentials?: boolean;
  backend: StorageBackend;
  s3: {
    configuration: StorageConfigurationS3;
    credentials: StorageCredentialsS3 | null;
  };
  tlonHosting: StorageCredentialsTlonHosting;
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
  // Only one among S3 client or Tlon credentials will be set at a given time.
  s3Client: S3Client | null;
  tlonHostingCredentials: StorageCredentialsTlonHosting | null;
  uploaders: Record<string, Uploader>;
  getUploader: (key: string) => Uploader;
  createS3Client: (s3: StorageCredentialsS3, region: string) => void;
  setTlonHostingCredentials: (credentials: StorageCredentialsTlonHosting) => void;
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

export interface StorageUpdateCredentialsS3 {
  credentials: StorageCredentialsS3;
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

export declare type StorageUpdate =
  | StorageUpdateCredentialsS3
  | StorageUpdateConfiguration
  | StorageUpdateCurrentBucket
  | StorageUpdateAddBucket
  | StorageUpdateRemoveBucket
  | StorageUpdateEndpoint
  | StorageUpdateAccessKeyId
  | StorageUpdateSecretAccessKey
  | StorageUpdateRegion;
