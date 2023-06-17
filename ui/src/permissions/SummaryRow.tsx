import cn from 'classnames';
import { Adjust } from '@/components/icons/Adjust';
import BellIcon from '@/components/icons/BellIcon';
import { ChevronDown16Icon } from '@/components/icons/ChevronDown16Icon';
import GlobeIcon from '@/components/icons/GlobeIcon';
import KeyIcon from '@/components/icons/KeyIcon';
import SigIcon from '@/components/icons/SigIcon';
import ZapIcon from '@/components/icons/ZapIcon';
import { AppPerm, PassportPerm } from '@/gear';
import { capFirst } from '@/logic/utils';
import React, { useCallback, useMemo, useState } from 'react';
import exp from 'constants';

interface SummaryRowProps {
  /**
   * A permission bucket.
   */
  perm: PassportPerm | AppPerm;
}

/**
 * A row summarizing a requested permission.
 * It has the description of the permission and an optional warning icon.
 */
export default function SummaryRow({ perm }: SummaryRowProps) {
  const [expanded, setExpanded] = useState(false);

  // TODO: need icon identifier from perm; requested from tinnus
  // for now, return random icon placeholder
  const iconSeed = useMemo(() => Math.random(), []);
  const iconFromPerm = (perm: PassportPerm) => {

    if (iconSeed < 0.2) {
      return <GlobeIcon />;
    } else if (iconSeed < 0.4) {
      return <KeyIcon />;
    } else if (iconSeed < 0.6) {
      return <BellIcon />;
    } else if (iconSeed < 0.8) {
      return <SigIcon />;
    } else {
      return <Adjust />;
    }
  }

  // TODO: handle node perms
  if ('node' in perm) {
    return null;
  }

  // TODO: handle app perms
  if ('app' in perm) {
    return null;
  }

  const { nom, pes } = perm.kind;
  const hasWarning = pes.some(pe => pe.warn !== null);
  const expandable = pes.length > 0;

  const toggleExpanded = useCallback(() => {
    if (!expandable) return;
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <section>
      <div
        onClick={toggleExpanded}
        className={cn('w-full flex justify-between content-center p-2 space-x-4 rounded-t-lg',
          expandable && 'cursor-pointer',
          expanded && 'bg-gray-50',
        )}>
        <div className='flex space-x-1'>
          <div className='h-8 w-8 bg-gray-50 p-1.5 bg-blend-multiply'>
            {iconFromPerm(perm)}
          </div>
          <div className='flex flex-col justify-center text-sm font-medium text-gray-900'>
            {capFirst(nom)}
          </div>
        </div>
        <div className='flex flex-row space-x-3'>
          {hasWarning ? (
            <div className='flex flex-col justify-center'>
              <ZapIcon color='#FF6240' />
            </div>
          ) : null}
          {
            expandable ? (
              <div className='flex flex-col justify-center'>
                <ChevronDown16Icon className={`transform ${expanded ? 'rotate-180' : ''}`} />
              </div>
            ) : null
          }
        </div>
      </div>
      {
        expanded ? (
          <div className='flex flex-col space-y-2 rounded-b-lg bg-gray-50 px-2 py-3'>
            {
              pes.map(pe => (
                <div className='flex flex-row'>
                  <div className='text-sm font-semibold leading-4'>
                    {capFirst(pe.desc)}
                  </div>
                </div>
              ))
            }
          </div>
        ) : null
      }
    </section>
  )
}
