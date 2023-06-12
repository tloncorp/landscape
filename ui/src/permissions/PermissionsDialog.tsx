import React, { Dispatch, SetStateAction, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Dialog, DialogClose, DialogContent } from '@/components/Dialog';
import { Button } from '@/components/Button';
import { Passport } from '@/gear';
import WarningBanner from './WarningBanner';
import { ChevronDown16Icon } from '@/components/icons/ChevronDown16Icon';
import SummaryRow from './SummaryRow';

type ViewMode = 'Summary' | 'Source';

interface PermissionsDialogInnerProps {
  appName: string;
  passport: Passport;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
  viewMode: ViewMode;
}

export function PermissionsDialogInner({
  appName,
  passport,
  setViewMode,
  viewMode,
}: PermissionsDialogInnerProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // TODO: use the passport to render the permissions Summary
  const showWarning = passport.sys.length > 0;

  return (
    <div className="space-y-6 my-6">
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
                passport.sys.map(p => {
                  return p.kind.pes.map((pe, i) => {
                    return <SummaryRow key={i} summary={pe} />
                  })
                })
              }
            </div>
          ) : (
            <div>
              {/* A code block */}
              Source
            </div>
          )
        }
      </section>

      {viewMode === 'Summary' && showWarning ? (
        <section>
          <WarningBanner count={passport.sys.length} />
        </section>
      ) : null}
    </div>
  );
}

export default function PermissionsDialog() {
  // const passport = usePassport({ ship, desk });

  const [viewMode, setViewMode] = useState<ViewMode>('Summary');

  const appName = 'Groups';
  const passport: Passport = {
    rad: [],
    sys: [
      {
        kind: {
          nom: 'write',
          pes: [
            {
              desc: 'Access network keys or passwords',
              have: "nil",
              warn: "This app can impersonate you on the network",
              pers: [
                {
                  name: 'write',
                  vane: 'jael',
                  tail: null,
                }
              ]
            }
          ]
        }
      }
    ],
    any: [],
    new: [],
    app: [],
  };

  return (
    <Dialog open>
      <DialogContent
        showClose={false}
        containerClass="w-full max-w-md z-[70]"
      >
        <PermissionsDialogInner
          appName={appName}
          passport={passport}
          setViewMode={setViewMode}
          viewMode={viewMode}
        />
        <div className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="light-secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => { }}>
              Grant & Install
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
