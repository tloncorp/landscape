import cn from 'classnames';
import React from 'react';
import {
  ConnectionCompleteStatus,
  ConnectionPendingStatus,
  ConnectionStatus,
} from '@/state/vitals';
import Bullet16Icon from './icons/Bullet16Icon';

interface ShipConnectionProps {
  ship: string;
  status?: ConnectionStatus;
  className?: string;
}

function getCompletedText(status: ConnectionCompleteStatus, ship: string) {
  switch (status.complete) {
    case 'no-data':
      return 'No connection data';
    case 'yes':
      return 'Connected';
    case 'no-dns':
      return 'Unable to connect to DNS';
    case 'no-our-planet':
      return 'Unable to reach our planet';
    case 'no-our-galaxy':
      return 'Unable to reach our galaxy';
    case 'no-their-galaxy':
      return `Unable to reach ${ship}'s galaxy`;
    case 'no-sponsor-miss':
      return `${ship}'s sponsor can't reach them`;
    case 'no-sponsor-hit':
      return `${ship}'s sponsor can reach them, but we can't`;
    default:
      return 'Unable to connect';
  }
}

function getPendingText(status: ConnectionPendingStatus, ship: string) {
  switch (status.pending) {
    case 'trying-dns':
      return 'Checking DNS';
    case 'trying-local':
      return 'Checking our galaxy';
    case 'trying-target':
      return `Checking ${ship}`;
    case 'trying-sponsor':
      return `Checking ${ship}'s sponsors (~${(status as any).ship})`;
    default:
      return 'Checking connection...';
  }
}

function getConnectionColor(status?: ConnectionStatus) {
  if (!status || 'pending' in status) {
    return 'text-gray-400';
  }

  return status.complete === 'yes' ? 'text-green-300' : 'text-red-400';
}

export function ShipConnection({
  status,
  ship,
  className,
}: ShipConnectionProps) {
  return (
    <span className={cn('flex text-base font-semibold', className)}>
      <Bullet16Icon
        className={cn('-ml-1 h-4 w-4', getConnectionColor(status))}
      />{' '}
      {!status
        ? 'No connection data'
        : 'pending' in status
        ? getPendingText(status, ship)
        : getCompletedText(status, ship)}
    </span>
  );
}
