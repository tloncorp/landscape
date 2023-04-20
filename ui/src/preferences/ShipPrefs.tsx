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
import { Spinner } from '../components/Spinner';
import { Bullet } from '../components/icons/Bullet';
import { Cross } from '../components/icons/Cross';
import { useAzimuthBlock } from '../state/azimuth';
import {
  AvailabilityStatus,
  usePeerDiscoveryShips,
  useShipAvailability,
} from '../state/connectivity';

export const SystemPrefs = () => (
  <>
    <ShipPrefs />
    <P2PServicePrefs />
    <StoragePrefs />
  </>
);

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
  const { peerDiscoveryShips, isLoading: isLoadingPeerDiscoveryShips } =
    usePeerDiscoveryShips();

  return (
    <div className="inner-section mt-4 space-y-8 leading-5">
      <h2 className="h4">P2P Services</h2>

      <div className="space-y-3">
        <div>
          <h3 className="font-semibold">Peer Discovery</h3>
          <p className="text-gray-400">Ships your Urbit uses to find peers</p>
        </div>
        <div className="mt-4 flex flex-col space-y-2">
          {peerDiscoveryShips?.map((ship) => (
            <ConnectivityTester shipName={ship} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AvailabilityIndicator = ({
  isChecking,
  status,
  className,
}: {
  isChecking: boolean;
  status: AvailabilityStatus;
  className?: string;
}) => {
  return (
    <div className={classNames('flex space-x-0.5', className)}>
      {isChecking ? (
        <Spinner className="h-4 w-4 text-blue-500" />
      ) : (
        <div className="flex flex-1 flex-row items-center">
          {status === 'available' && (
            <>
              <span className="font-semibold text-blue-400">Available</span>
              <Bullet className="h-5 w-5 text-blue-500" />
            </>
          )}
          {status === 'unavailable' && (
            <>
              <span className="font-semibold text-orange-400">Unavailable</span>
              <Cross className="h-5 w-5 p-1 text-orange-400" />
            </>
          )}
        </div>
      )}
    </div>
  );
};

const ConnectivityTester = ({ shipName }: { shipName: string }) => {
  const { isChecking, availabilityStatus, refresh } =
    useShipAvailability(shipName);

  return (
    <div className="flex w-full flex-row items-center">
      <div className="flex flex-1 flex-row items-center space-x-2">
        <Avatar size="small" shipName={shipName}></Avatar>
        <h3 className="font-semibold">{shipName}</h3>
        <AvailabilityIndicator
          status={availabilityStatus}
          isChecking={isChecking}
          className="flex-1"
        />
        <Button
          type="submit"
          className="py-1 px-3 text-sm"
          variant="secondary"
          disabled={isChecking}
          onClick={refresh}
        >
          Test Connection
        </Button>
      </div>
    </div>
  );
};

const useStorage = () => {
  return {
    free: 3000000,
    total: 4096000,
  };
};

const StoragePrefs = () => {
  const { free, total } = useStorage();

  return (
    <div className="inner-section mt-4 space-y-8 leading-5">
      <h2 className="h4">Loom</h2>
      <div className="space-y-3">
        <div className="overflow-hidden rounded-full rounded bg-green-200 ">
          <div
            className="h-2 bg-green-300"
            style={{ width: (free / total) * 100 + '%' }}
          ></div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-semibold">
            {Math.round(free / 1000)}/{Math.round(total / 1000)}mb free
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Optimize Your Urbit's Loom</h3>
        <p className="text-gray-400">
          Deduplicate objects in storage to free up space using |pack.{' '}
          <a
            href="https://operators.urbit.org/manual/running/vere#pack"
            target="_blank"
            className="underline"
          >
            Learn more
          </a>
        </p>
        <Button variant="primary" className="mt-4">
          Pack Loom
        </Button>
      </div>
    </div>
  );
};
