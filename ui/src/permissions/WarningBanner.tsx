import React from 'react';
import { noop } from 'lodash';
import InfoIcon from '@/components/icons/InfoIcon';
import ZapIcon from '@/components/icons/ZapIcon';

interface WarningBannerProps {
  /**
   * The number of permissions that may allow root system or identity access.
   */
  count: number;
  /**
   * Optional click handler for the banner.
   */
  onClick?: () => void;
}

/**
 * A warning banner that conditionally appears at the bottom of the 
 * permissions dialog when the agent requests sensitive permissions.
 */
export default function WarningBanner({ count, onClick = noop }: WarningBannerProps) {
  return (
    <div onClick={onClick} className="flex content-center space-x-2 w-full rounded-lg bg-red-danger p-4 cursor-pointer">
      <ZapIcon />
      <div className="text-white dark:text-black font-semibold text-md leading-4 flex flex-col justify-center">{count} permissions may allow root system or identity access</div>
      <InfoIcon />
    </div>
  );
}
