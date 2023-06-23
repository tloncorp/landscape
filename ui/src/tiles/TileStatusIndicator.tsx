import { ShipConnection } from '@/components/ShipConnection';
import { Spinner } from '@/components/Spinner';
import { Bullet } from '@/components/icons/Bullet';
import { Chad, Pike, chadIsRunning } from '@/gear';
import { useConnectivityCheck } from '@/state/vitals';
import cn from 'classnames';
import React from 'react';

interface TileStatusIndicatorProps {
  status: TileStatus;
  devShip?: string;
  className?: string;
}

type TileStatus =
  | 'installing'
  | 'inactive'
  | 'awaiting-update'
  | 'active'
  | 'error';

export function getTileStatus(
  chad: Chad,
  pike: Pike | undefined,
  disabled: boolean
): TileStatus {
  if (disabled || 'suspend' in chad || pike?.zest === 'dead') {
    return 'inactive';
  }

  if ('install' in chad) {
    return 'installing';
  }

  if ('hung' in chad) {
    return 'error';
  }

  if (pike?.zest === 'held') {
    return 'awaiting-update';
  }

  if (chadIsRunning(chad)) {
    return 'active';
  }

  // unsure if this is possible
  return 'error';
}

export function TileStatusIndicator({
  status,
  devShip,
  className,
}: TileStatusIndicatorProps) {
  const installing = status === 'installing';
  const { data, showConnection } = useConnectivityCheck(devShip || '~zod', {
    useStale: true,
    enabled: !!devShip && installing,
    waitToDisplay: 10 * 1000,
  });
  const showInstallDetails =
    showConnection &&
    data &&
    'complete' in data.status &&
    data.status.complete !== 'yes';

  if (status === 'active') {
    return null;
  }

  return (
    <div className={cn('flex items-center text-gray-500', className)}>
      {status === 'error' || status === 'awaiting-update' ? (
        <>
          <Bullet className="h-4 w-4 text-orange-500" />{' '}
          {status === 'error' ? 'Errored' : 'Awaiting Update'}
        </>
      ) : installing ? (
        <>
          <Spinner className="mr-2 h-6 w-6" />
          <div className="flex flex-col">
            <span>Installing</span>
            {showInstallDetails && (
              <ShipConnection ship={devShip || '~zod'} status={data?.status} />
            )}
          </div>
        </>
      ) : (
        'Suspended'
      )}
    </div>
  );
}
