import { Adjust } from '@/components/icons/Adjust';
import GlobeIcon from '@/components/icons/GlobeIcon';
import KeyIcon from '@/components/icons/KeyIcon';
import ZapIcon from '@/components/icons/ZapIcon';
import { PermSummary } from '@/gear';
import React from 'react';

interface SummaryRowProps {
  /**
   * A permission summary.
   */
  summary: PermSummary;
}

// TODO: figured out mapping from permission to icon from Dan & Mark
const iconFromPerm = (perm: PermSummary) => {
  if(perm.pers.some(p => p.vane && ['ames', 'eyre', 'gall'].includes(p.vane))) {
    return <GlobeIcon />;
  }

  if(perm.pers.some(p => p.vane && p.vane === 'jael')) {
    return <KeyIcon />;
  }

  // TODO:
  // <BellIcon />
  // <SigIcon />

  return <Adjust />;
}
  
/**
 * A row summarizing a requested permission.
 * It has the description of the permission and an optional warning icon.
 */
export default function SummaryRow({ summary }: SummaryRowProps) {
  const { desc, warn } = summary;

  return (
    <div className='w-full flex justify-between content-center p-2 space-x-4'>
      <div className='flex space-x-1'>
        <div className='h-8 w-8 bg-gray-50 p-1.5'>
          {iconFromPerm(summary)}
        </div>
        <div className='flex flex-col justify-center text-sm font-medium text-gray-900'>
          {desc}
        </div>
      </div>
      {warn ? (
        <div className='flex flex-col justify-center'>
          <ZapIcon color='#FF6240' />
        </div>
      ) : null}
    </div>
  )
}
