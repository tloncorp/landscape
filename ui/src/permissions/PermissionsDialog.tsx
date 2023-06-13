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
  onInstall: () => void;
}

export function PermissionsDialogInner({
  appName,
  passport,
  onInstall,
}: PermissionsDialogInnerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('Summary');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const showWarning = passport.sys.length > 0;

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
              {/* TODO: render app passport bucket */}
              {
                [...passport.sys, ...passport.any, ...passport.new, ...passport.rad].map(p => {
                  return p.kind.pes.map((pe, i) => {
                    return <SummaryRow key={i} summary={pe} />
                  })
                })
              }
            </div>
          ) : (
            <div className="bg-gray-100 rounded-md p-4">
              <pre className="text-xs font-mono text-gray-600">
                {/* TODO: use real seal from scry; style to match wireframe */}
                {fakeSeal}
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
