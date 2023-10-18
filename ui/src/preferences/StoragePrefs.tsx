import React, { useCallback, useState, FormEvent, useEffect } from 'react';
import api from '../api';
import { useForm } from 'react-hook-form';
import cn from 'classnames';
import { useAsyncCall } from '../logic/useAsyncCall';
import { useStorage } from '../state/storage';
import { Button } from '../components/Button';
import { Spinner } from '../components/Spinner';
import { Urbit } from '@urbit/http-api';
import {
  StorageUpdate,
  StorageUpdateToggleService,
  toggleService,
} from '@/gear';
import { isHosted } from '@/logic/utils';
import { Toggle } from '@/components/Toggle';

interface CredentialsSubmit {
  endpoint: string;
  accessId: string;
  accessSecret: string;
  region: string;
  bucket: string;
}

type S3Update =
  | { 'set-region': string }
  | { 'set-endpoint': string }
  | { 'set-access-key-id': string }
  | { 'set-secret-access-key': string }
  | { 'set-current-bucket': string }
  | { 'add-bucket': string }
  | { 'remove-bucket': string };

function storagePoke(data: S3Update | { 'set-region': string }) {
  return {
    app: 'storage',
    mark: 'storage-action',
    json: data,
  };
}

export const StoragePrefs = () => {
  const { s3, loaded } = useStorage();
  const hostedStorage = s3.configuration.service === 'presigned-url';

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, isValid, isSubmitSuccessful },
  } = useForm<CredentialsSubmit>({
    mode: 'onChange',
  });

  const { call: addS3Credentials, status } = useAsyncCall(
    useCallback(async (data: CredentialsSubmit) => {
      api.poke(storagePoke({ 'set-endpoint': data.endpoint }));
      api.poke(storagePoke({ 'set-access-key-id': data.accessId }));
      api.poke(storagePoke({ 'set-secret-access-key': data.accessSecret }));
      api.poke(storagePoke({ 'set-current-bucket': data.bucket }));
      api.poke(storagePoke({ 'set-region': data.region }));
    }, [])
  );

  const { call: toggleS3, status: toggleStatus } = useAsyncCall(
    useCallback(() => {
      return api.trackedPoke<
        StorageUpdateToggleService,
        { storageUpdate: StorageUpdate }
      >(
        toggleService(hostedStorage ? 'credentials' : 'presigned-url'),
        { app: 'storage', path: '/all' },
        (event) =>
          'storage-update' in event &&
          'toggleService' in event['storage-update']
      );
    }, [hostedStorage])
  );

  useEffect(() => {
    useStorage.getState().initialize(api as unknown as Urbit);
  }, []);

  useEffect(() => {
    loaded && reset();
  }, [loaded, reset]);

  console.log(s3.configuration, toggleStatus);

  return (
    <div className="inner-section">
      <h2 className="h4">Remote Storage</h2>
      <div className="flex flex-col leading-5">
        {isHosted ? (
          <div className="my-6 flex items-center rounded-xl border border-gray-100 py-3 px-4">
            <label id="use-hosting" className="text-lg font-semibold">
              Use Tlon image hosting
            </label>
            <Toggle
              aria-labelledby="use-hosting"
              pressed={hostedStorage}
              onPressedChange={toggleS3}
              className="ml-auto flex-none text-blue-400"
              disabled={!s3.configuration.presignedUrl}
              loading={toggleStatus === 'loading'}
            />
          </div>
        ) : null}
        {hostedStorage && isHosted ? (
          <p>
            Your Tlon-hosted urbit comes with free image hosting for Groups and
            Talk. If you would like to use your own S3-compatible back-end for
            image hosting, you can enable it on this screen.
          </p>
        ) : (
          <>
            <p>
              Configure your urbit to enable uploading your own images or other
              files in Urbit applications.
            </p>
            <p className="mt-3">
              Read more about setting up S3 storage in the{' '}
              <a
                className="font-bold"
                rel="external"
                target="_blank"
                href="https://operators.urbit.org/manual/os/s3"
              >
                Urbit Operator's Manual
              </a>
              .
            </p>

            <form onSubmit={handleSubmit(addS3Credentials)} className="mt-6">
              <div className="mb-8 flex flex-col space-y-2">
                <label className="font-semibold" htmlFor="endpoint">
                  Endpoint<span title="Required field">*</span>
                </label>
                <div className="relative">
                  <input
                    disabled={!loaded}
                    required
                    id="endpoint"
                    type="url"
                    autoCorrect="off"
                    defaultValue={s3.credentials?.endpoint}
                    {...register('endpoint', { required: true })}
                    className="input default-ring bg-gray-50"
                  />
                  {!loaded && <Spinner className="absolute top-1 right-2" />}
                </div>
              </div>
              <div className="mb-8 flex flex-col space-y-2">
                <label className="font-semibold" htmlFor="key">
                  Access Key ID<span title="Required field">*</span>
                </label>
                <div className="relative">
                  <input
                    disabled={!loaded}
                    required
                    id="key"
                    type="text"
                    autoCorrect="off"
                    spellCheck="false"
                    defaultValue={s3.credentials?.accessKeyId}
                    {...register('accessId', { required: true })}
                    className="input default-ring bg-gray-50"
                  />
                  {!loaded && <Spinner className="absolute top-1 right-2" />}
                </div>
              </div>
              <div className="mb-8 flex flex-col space-y-2">
                <label className="font-semibold" htmlFor="secretAccessKey">
                  Secret Access Key<span title="Required field">*</span>
                </label>
                <div className="relative">
                  <input
                    disabled={!loaded}
                    required
                    id="secretAccessKey"
                    type="text"
                    autoCorrect="off"
                    spellCheck="false"
                    defaultValue={s3.credentials?.secretAccessKey}
                    {...register('accessSecret', { required: true })}
                    className="input default-ring bg-gray-50"
                  />
                  {!loaded && <Spinner className="absolute top-1 right-2" />}
                </div>
              </div>
              <div className="mb-8 flex flex-col space-y-2">
                <label className="font-semibold" htmlFor="region">
                  Region<span title="Required field">*</span>
                </label>
                <div className="relative">
                  <input
                    disabled={!loaded}
                    required
                    id="region"
                    type="text"
                    autoCorrect="off"
                    defaultValue={s3.configuration?.region}
                    {...register('region', { required: true })}
                    className="input default-ring bg-gray-50"
                  />
                  {!loaded && <Spinner className="absolute top-1 right-2" />}
                </div>
              </div>
              <div className="mb-8 flex flex-col space-y-2">
                <label className="font-semibold" htmlFor="bucket">
                  Bucket Name<span title="Required field">*</span>
                </label>
                <div className="relative">
                  <input
                    disabled={!loaded}
                    required
                    id="bucket"
                    type="text"
                    autoCorrect="off"
                    defaultValue={s3.configuration.currentBucket}
                    {...register('bucket', { required: true })}
                    className="input default-ring bg-gray-50"
                  />
                  {!loaded && <Spinner className="absolute top-1 right-2" />}
                </div>
              </div>
              <Button
                type="submit"
                disabled={!isDirty || !isValid}
                className={cn(
                  !isDirty || !isValid || isSubmitSuccessful
                    ? 'cursor-not-allowed bg-gray-200 text-gray-100'
                    : ''
                )}
              >
                {isSubmitting ? <Spinner /> : 'Save'}
                {isSubmitSuccessful && ' Successful'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
