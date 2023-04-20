import classNames from 'classnames';
import clipboardCopy from 'clipboard-copy';
import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { useAzimuthBlock } from '../state/azimuth';
import { useShipAvailability } from '../state/connectivity';
import { UpdatePreferences } from './about-system/UpdatePreferences';

export const SystemPrefs = () => {
  return (
    <>
      <ShipPrefs />
      <P2PServicePrefs />
    </>
  );
};

export const ShipPrefs = () => {
  const { block, isLoading, isStale, forceUpdate } = useAzimuthBlock();

  return (
    <div className="inner-section space-y-8">
      <h2 className="h4">Identity</h2>
      <div className="flex flex-row items-center">
        <Avatar shipName={window.ship} size="default" />
        <div className="ml-2 flex-grow">
          <h3 className="mb-1 font-semibold">~{window.ship}</h3>
          {!isLoading && (
            <div className="flex flex-row items-center justify-start">
              <span
                className={classNames('font-semibold', {
                  'text-orange-400': isStale,
                  'text-gray-400': !isStale,
                })}
              >
                Azimuth block: {block}{' '}
              </span>
              {!isLoading && isStale && (
                <span className="ml-1 rounded border border-solid border-orange-400 px-1.5 text-xs font-semibold uppercase text-orange-400">
                  Stale
                </span>
              )}
            </div>
          )}
        </div>
        <div>
          {block && (
            <CopyButton
              type="submit"
              variant="secondary"
              className="py-1 px-3 text-sm"
              label="Copy Info"
              content={block}
            ></CopyButton>
          )}
          {!isLoading && isStale && (
            <Button
              type="submit"
              className="ml-1 bg-orange-400 py-1 px-3 text-sm"
              onClick={forceUpdate}
            >
              Update
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

type CopyButtonProps = Omit<
  ComponentProps<typeof Button>,
  'children' | 'onClick'
>;

const CopyButton = ({
  label = 'copy',
  content,
  ...buttonProps
}: {
  label: string;
  content: string;
} & CopyButtonProps) => {
  const [successMessageActive, setSuccessMesageActive] = useState(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(() => {
    if (copyTimeout.current) clearTimeout(copyTimeout.current);
    clipboardCopy(content);
    setSuccessMesageActive(true);
    copyTimeout.current = setTimeout(() => setSuccessMesageActive(false), 1000);
  }, []);

  // ensure timeout is cleared when component unmounts
  useEffect(() => {
    () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
    };
  }, []);

  return (
    <Button {...buttonProps} onClick={copy}>
      {successMessageActive ? 'Copied' : label}
    </Button>
  );
};

const P2PServicePrefs = () => {
  return (
    <div className="inner-section mt-4 space-y-8">
      <h2 className="h4">P2P Services</h2>

      <div className="leading-5">
        <h3 className="font-semibold">System Update Provider</h3>
        <p className="text-gray-400">Urbit ID of your kernel update source</p>
        <ShipInput verifyConnection={true} />

        <UpdatePreferences />
      </div>
    </div>
  );
};

const ShipInput = ({ verifyConnection }: { verifyConnection: boolean }) => {
  const [shipName, setShipName] = useState('');
  const { isChecking, availabilityStatus, checkAvailability } =
    useShipAvailability(shipName);

  return (
    <div className="flex w-full flex-row items-center">
      <div className="flex flex-1 flex-row items-center">
        <input
          type="text"
          className="mr-2 w-32 flex-1 rounded border border-solid border-gray-400 px-2 py-1"
          placeholder="~zod"
          value={shipName}
          onChange={(e) => setShipName(e.target.value)}
        />
        {verifyConnection && (
          <Button
            type="submit"
            className="py-1 px-3 text-sm"
            disabled={isChecking || !shipName}
            onClick={checkAvailability}
          >
            Save
          </Button>
        )}
      </div>
      {verifyConnection && (
        <div className="ml-2">
          {availabilityStatus === 'available' && (
            <span className="text-green-400">Available</span>
          )}
          {availabilityStatus === 'unavailable' && (
            <span className="text-red-400">Unavailable</span>
          )}
        </div>
      )}
    </div>
  );
};
