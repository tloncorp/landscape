import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DialogClose } from '@/components/Dialog';
import { Button } from '@/components/Button';
import { Passport } from '@/gear';
import WarningBanner from './WarningBanner';
import { ChevronDown16Icon } from '@/components/icons/ChevronDown16Icon';
import SummaryRow from './SummaryRow';
import { fakeSeal } from './temp';

type ViewMode = 'Summary' | 'Source';

interface PermissionsDialogInnerProps {
  appName: string;
  passport: Passport;
  presentableSeal: string[] | null;
  onInstall: () => void;
}

export function PermissionsDialogInner({
  appName,
  passport,
  presentableSeal,
  onInstall,
}: PermissionsDialogInnerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('Summary');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const showWarning = passport.sys.length > 0;

  const passportPerms = [...passport.sys, ...passport.any, ...passport.new, ...passport.rad, ...passport.app];

  return (
    <div className="space-y-6">
      <section className='flex justify-between items-center'>
        <span className="h4">
          "{appName}" Requires Permissions
        </span>
        <DropdownMenu.Root onOpenChange={(open) => setIsDropdownOpen(open)} open={isDropdownOpen}>
          <DropdownMenu.Trigger asChild className="appearance-none">
            <Button variant='light-secondary'>
              {viewMode}&nbsp;<ChevronDown16Icon />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="dropdown">
            <DropdownMenu.Item className="dropdown-item" onSelect={() => setViewMode('Summary')}>
              Summary
            </DropdownMenu.Item>
            <DropdownMenu.Item className="dropdown-item" onSelect={() => setViewMode('Source')}>
              Source
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </section>

      <section>
        {
          viewMode === 'Summary' ? (
            <div className="space-y-5">
              {
                passportPerms.map((p, i) => {
                  return (
                    <SummaryRow key={i} perm={p} />
                  )
                })
              }
            </div>
          ) : (
            <div className="bg-gray-50 rounded-md p-4">
              <pre className="text-xs font-mono text-gray-800">
                {presentableSeal?.map((s) => `${s}\n`)}
              </pre>
            </div>
          )
        }
      </section>

      {viewMode === 'Summary' && showWarning ? (
        <WarningBanner count={passport.sys.length} />
      ) : null}

      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button onClick={() => history.back()} variant="light-secondary">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={onInstall}>
            Grant & Install
          </Button>
        </DialogClose>
      </div>
    </div>
  );
}
