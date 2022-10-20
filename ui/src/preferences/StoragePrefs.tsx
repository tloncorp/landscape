import React, { useCallback, useState, FormEvent, useEffect } from 'react';
import api from '../state/api';
import {
  addBucket,
  setAccessKeyId,
  setCurrentBucket,
  setEndpoint,
  setSecretAccessKey,
} from '@urbit/api';
import { useAsyncCall } from '../logic/useAsyncCall';
import { useStorageState } from '../state/storage';

interface CredentialsSubmit {
  endpoint: string;
  accessId: string;
  accessSecret: string;
  bucket: string;
}

export const StoragePrefs = () => {
  const { s3, ...storageState } = useStorageState();

  useEffect(() => {
    useStorageState.getState().initialize(api);
  }, []);

  const { call: addS3Credentials, status } = useAsyncCall(
    useCallback(async (data: CredentialsSubmit) => {
      api.poke(setEndpoint(data.endpoint));
      api.poke(setAccessKeyId(data.accessId));
      api.poke(setSecretAccessKey(data.accessSecret));
      api.poke(addBucket(data.bucket));
      api.poke(setCurrentBucket(data.bucket));
    }, [])
  );

  return (
    <div className="inner-section space-y-8">
      <h2 className="h4">Remote Storage</h2>
      <div className="flex flex-col space-y-3 leading-5">
        <p>
          Configure your urbit to enable uploading your own images or other
          files in Urbit applications.
        </p>
        <p>
          <a
            className="font-bold"
            href="https://operators.urbit.org/manual/os/s3"
          >
            Read more about setting up S3 storage
          </a>{' '}
          on Urbit.org.
        </p>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-semibold" htmlFor="endpoint">
          Endpoint
        </label>
        <input
          id="endpoint"
          type="text"
          value={s3.credentials?.endpoint}
          className="input default-ring bg-gray-50"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="font-semibold" htmlFor="key">
          Access Key ID
        </label>
        <input
          id="key"
          type="text"
          value={s3.credentials?.accessKeyId}
          className="input default-ring bg-gray-50"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="font-semibold" htmlFor="secretAccessKey">
          Secret Access Key
        </label>
        <input
          id="secretAccessKey"
          type="text"
          value={s3.credentials?.secretAccessKey}
          className="input default-ring bg-gray-50"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="font-semibold" htmlFor="bucket">
          Bucket Name
        </label>
        <input
          id="bucket"
          type="text"
          value={s3.configuration.currentBucket}
          className="input default-ring bg-gray-50"
        />
      </div>
    </div>
  );
};
