import React, { useCallback, useState } from 'react';
import { useAsyncCall } from '../logic/useAsyncCall';
import { Button } from './Button';
import { ShipName } from './ShipName';
import { Spinner } from './Spinner';

interface SourceSetterProps {
  appName: string;
  srcDesk: string;
  srcShip?: string;
  title: string;
  toggleSrc: (desk: string, ship: string) => Promise<void>;
}

export default function SourceSetter({
  appName,
  srcDesk,
  srcShip,
  title,
  toggleSrc,
}: SourceSetterProps) {
  const [newSyncShip, setNewSyncShip] = useState(srcShip ?? '');
  const { status: requestStatus, call: handleSubmit } = useAsyncCall(toggleSrc);
  const syncDirty = newSyncShip !== srcShip;

  const onUnset = useCallback(() => {
    if (!srcShip) {
      return;
    }
    if (
      // eslint-disable-next-line no-alert, no-restricted-globals
      confirm(
        `Are you sure you want to unsync ${appName}? You will no longer receive updates.`
      )
    ) {
      toggleSrc(srcDesk, srcShip);
    }
  }, [srcShip, srcDesk]);

  const handleSourceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { target } = e;
      const value = target.value.trim();
      setNewSyncShip(value.startsWith('~') ? value : `~${value}`);
    },
    []
  );

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await handleSubmit(srcDesk, newSyncShip);
    },
    [srcDesk, newSyncShip]
  );

  return (
    <>
      <h2 className="h3 mb-7">{title}</h2>
      <div className="space-y-3">
        {srcShip ? (
          <div className="inner-section relative bg-gray-100">
            <h3 className="h4 mb-5 block">Automatic updates enabled</h3>
            <p className="mb-5 leading-5">
              {appName} will automatically download and apply updates from{' '}
              <ShipName
                name={srcShip}
                truncate={false}
                className="font-mono font-semibold"
              />{' '}
              to keep itself up to date.
            </p>
            <Button onClick={onUnset} variant="destructive">
              Unsync Updates for {appName}...
            </Button>
          </div>
        ) : (
          <form
            className="inner-section relative bg-gray-100"
            onSubmit={onSubmit}
          >
            <label htmlFor="ota-source" className="h4 mb-5 block">
              Set Automatic Update Source
            </label>
            <p className="mb-5 leading-5">
              Enter a valid upstream source to receive updates for {appName}.
            </p>
            <div className="relative">
              <input
                id="ota-source"
                type="text"
                value={newSyncShip}
                onChange={handleSourceChange}
                className="input default-ring font-semibold"
              />
              {syncDirty && (
                <Button
                  type="submit"
                  className="absolute top-1 right-1 py-1 px-3 text-sm"
                >
                  {requestStatus !== 'loading' && 'Save'}
                  {requestStatus === 'loading' && (
                    <>
                      <span className="sr-only">Saving...</span>
                      <Spinner className="h-5 w-5" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </>
  );
}
