import React, { useState, useEffect, FormEvent } from 'react';
import api from '../api';
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
import { useAsyncCall } from '../logic/useAsyncCall';
import { useCallback } from 'react';

type S3Update =
  | { 'set-region': string }
  | { 'set-public-url-base': string }
  | { 'set-endpoint': string }
  | { 'set-access-key-id': string }
  | { 'set-secret-access-key': string }
  | { 'set-current-bucket': string }
  | { 'add-bucket': string }
  | { 'remove-bucket': string };

function storagePoke(data: S3Update) {
  return {
    app: 'storage',
    mark: 'storage-action',
    json: data,
  };
}

export const StoragePrefs = () => {
  const { s3, loaded } = useStorage();
  const hostedStorage = s3.configuration.service === 'presigned-url';

  const [endpoint, setEndpoint] = useState('');
  const [accessId, setAccessId] = useState('');
  const [accessSecret, setAccessSecret] = useState('');
  const [region, setRegion] = useState('');
  const [publicUrlBase, setPublicUrlBase] = useState('');
  const [bucket, setBucket] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const { call: toggleS3, status: toggleStatus } = useAsyncCall(
    useCallback(() => {
      return api.trackedPoke<
        StorageUpdateToggleService,
        { 'storage-update': StorageUpdate }
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
    if (loaded) {
      setEndpoint(s3.credentials?.endpoint ?? '');
      setAccessId(s3.credentials?.accessKeyId ?? '');
      setAccessSecret(s3.credentials?.secretAccessKey ?? '');
      setRegion(s3.configuration?.region ?? '');
      setPublicUrlBase(s3.configuration?.publicUrlBase ?? '');
      setBucket(s3.configuration?.currentBucket ?? '');
    }
  }, [loaded]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSaved(false);
    try {
      await api.poke(storagePoke({ 'set-endpoint': endpoint }));
      await api.poke(storagePoke({ 'set-access-key-id': accessId }));
      await api.poke(storagePoke({ 'set-secret-access-key': accessSecret }));
      await api.poke(storagePoke({ 'set-current-bucket': bucket }));
      await api.poke(storagePoke({ 'set-region': region }));
      await api.poke(storagePoke({ 'set-public-url-base': publicUrlBase }));
      setSaved(true);
    } finally {
      setSubmitting(false);
    }
  }

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

            <form onSubmit={onSubmit} className="mt-6">
              <div className="mb-8 flex flex-col space-y-2">
                <label className="font-semibold" htmlFor="endpoint">
                  Endpoint
                </label>
                <div className="relative">
                  <input
                    disabled={!loaded}
                    id="endpoint"
                    type="text"
                    autoCorrect="off"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    className="input default-ring bg-gray-50"
                  />
                  {!loaded && <Spinner className="absolute top-1 right-2" />}
                </div>
              </div>
              <div className="mb-8 flex flex-col space-y-2">
                <label className="font-semibold" htmlFor="key">
                  Access Key ID
                </label>
                <div className="relative">
                  <input
                    disabled={!loaded}
                    id="key"
                    type="text"
                    autoCorrect="off"
                    spellCheck="false"
                    value={accessId}
                    onChange={(e) => setAccessId(e.target.value)}
                    className="input default-ring bg-gray-50"
                  />
                  {!loaded && <Spinner className="absolute top-1 right-2" />}
                </div>
              </div>
              <div className="mb-8 flex flex-col space-y-2">
                <label className="font-semibold" htmlFor="secretAccessKey">
                  Secret Access Key
                </label>
                <div className="relative">
                  <input
                    disabled={!loaded}
                    id="secretAccessKey"
                    type="text"
                    autoCorrect="off"
                    spellCheck="false"
                    value={accessSecret}
                    onChange={(e) => setAccessSecret(e.target.value)}
                    className="input default-ring bg-gray-50"
                  />
                  {!loaded && <Spinner className="absolute top-1 right-2" />}
                </div>
              </div>
              <div className="mb-8 flex flex-col space-y-2">
                <label className="font-semibold" htmlFor="region">
                  Region
                </label>
                <div className="relative">
                  <input
                    disabled={!loaded}
                    id="region"
                    type="text"
                    autoCorrect="off"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="input default-ring bg-gray-50"
                  />
                  {!loaded && <Spinner className="absolute top-1 right-2" />}
                </div>
              </div>
              <div className="mb-8 flex flex-col space-y-2">
                <label className="font-semibold" htmlFor="publicUrlBase">
                  Public URL base
                </label>
                <div className="relative">
                  <input
                    disabled={!loaded}
                    id="publicUrlBase"
                    type="text"
                    autoCorrect="off"
                    value={publicUrlBase}
                    onChange={(e) => setPublicUrlBase(e.target.value)}
                    className="input default-ring bg-gray-50"
                  />
                  {!loaded && <Spinner className="absolute top-1 right-2" />}
                </div>
              </div>
              <div className="mb-8 flex flex-col space-y-2">
                <label className="font-semibold" htmlFor="bucket">
                  Bucket Name
                </label>
                <div className="relative">
                  <input
                    disabled={!loaded}
                    id="bucket"
                    type="text"
                    autoCorrect="off"
                    value={bucket}
                    onChange={(e) => setBucket(e.target.value)}
                    className="input default-ring bg-gray-50"
                  />
                  {!loaded && <Spinner className="absolute top-1 right-2" />}
                </div>
              </div>
              <Button type="submit" disabled={!loaded || submitting}>
                {submitting ? <Spinner /> : saved ? 'Saved' : 'Save'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
