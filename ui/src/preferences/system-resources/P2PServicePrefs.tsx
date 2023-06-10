import classNames from 'classnames';
import React from 'react';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import { Bullet } from '../../components/icons/Bullet';
import { Cross } from '../../components/icons/Cross';
import {
  AvailabilityStatus,
  usePeerDiscoveryShips,
  useShipAvailability,
} from '../../state/connectivity';

export const P2PServicePrefs = () => {
  const { peerDiscoveryShips } = usePeerDiscoveryShips();

  return (
    <div className="inner-section mt-4 space-y-8 leading-5">
      <h2 className="h4">P2P Services</h2>
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold">Peer Discovery</h3>
          <p className="text-gray-400">Ships your Urbit uses to find peers</p>
        </div>
        <ul className="mt-4 flex flex-col space-y-2">
          {peerDiscoveryShips?.map((ship) => (
            <li>
              <ConnectivityTester shipName={ship} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ConnectivityTester = ({ shipName }: { shipName: string }) => {
  const { status, availability, checkAvailability } =
    useShipAvailability(shipName);

  return (
    <div className="flex w-full flex-row items-center">
      <div className="flex flex-1 flex-row items-center space-x-2">
        <Avatar size="small" shipName={shipName}></Avatar>
        <h3 className="font-semibold">{shipName}</h3>
        <AvailabilityIndicator
          status={availability?.status || 'initial'}
          isChecking={status === 'loading'}
          className="flex-1"
        />
        <Button
          type="submit"
          className="py-1 px-3 text-sm"
          variant="secondary"
          disabled={status === 'loading'}
          onClick={checkAvailability}
        >
          Test Connection
        </Button>
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
