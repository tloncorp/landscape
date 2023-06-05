import { chadIsRunning, Pike, Treaty } from '@/gear';
import clipboardCopy from 'clipboard-copy';
import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { Button, PillButton } from './Button';
import * as Dialog from '@radix-ui/react-dialog';
import { DialogClose, DialogContent, DialogTrigger } from './Dialog';
import { DocketHeader } from './DocketHeader';
import { Spinner } from './Spinner';
import { PikeMeta } from './PikeMeta';
import {
  ChargeWithDesk,
  useInstallDocketMutation,
  useTreaty,
} from '../state/docket';
import { getAppHref, getAppName } from '@/logic/utils';
import { addRecentApp } from '../nav/search/Home';
import { TreatyMeta } from './TreatyMeta';

type InstallStatus = 'uninstalled' | 'installing' | 'installed';

type App = ChargeWithDesk | Treaty;
interface AppInfoProps {
  docket: App;
  pike?: Pike;
  treatyInfoShip?: string;
  className?: string;
}

function getInstallStatus(docket: App): InstallStatus {
  if (!('chad' in docket)) {
    return 'uninstalled';
  }
  if (chadIsRunning(docket.chad)) {
    return 'installed';
  }
  if ('install' in docket.chad) {
    return 'installing';
  }
  return 'uninstalled';
}

function getRemoteDesk(docket: App, pike?: Pike, treatyInfoShip?: string) {
  if (pike && pike.sync) {
    return [pike.sync.ship, pike.sync.desk];
  }
  if ('chad' in docket) {
    return [treatyInfoShip ?? '', docket.desk];
  }
  const { ship, desk } = docket;
  return [ship, desk];
}

export const AppInfo: FC<AppInfoProps> = ({
  docket,
  pike,
  className,
  treatyInfoShip,
}) => {
  const installStatus = getInstallStatus(docket);
  const [ship, desk] = getRemoteDesk(docket, pike, treatyInfoShip);
  const publisher = pike?.sync?.ship ?? ship;
  const [copied, setCopied] = useState(false);
  const treaty = useTreaty(ship, desk);
  const { mutate: installDocketMutation } = useInstallDocketMutation();

  const installApp = async () => {
    if (installStatus === 'installed') {
      return;
    }

    installDocketMutation({ ship, desk });
  };

  const copyApp = useCallback(() => {
    setCopied(true);
    clipboardCopy(`/1/desk/${publisher}/${desk}`);

    setTimeout(() => {
      setCopied(false);
    }, 1250);
  }, [publisher, desk]);

  const installing = installStatus === 'installing';

  if (!docket) {
    // TODO: maybe replace spinner with skeletons
    return (
      <div className="dialog-inner-container flex justify-center text-black">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className={cn('text-black', className)}>
      <DocketHeader docket={docket}>
        <div className="col-span-2 flex items-center space-x-4 md:col-span-1">
          {installStatus === 'installed' && (
            <PillButton
              variant="alt-primary"
              as="a"
              href={getAppHref(docket.href)}
              target="_blank"
              rel="noreferrer"
              onClick={() => addRecentApp(docket.desk)}
            >
              Open App
            </PillButton>
          )}
          {installStatus !== 'installed' && (
            <Dialog.Root>
              <DialogTrigger asChild>
                <PillButton variant="alt-primary" disabled={installing}>
                  {installing ? (
                    <>
                      <Spinner />
                      <span className="sr-only">Installing...</span>
                    </>
                  ) : (
                    'Get App'
                  )}
                </PillButton>
              </DialogTrigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed top-0 bottom-0 left-0 right-0 z-[60] transform-gpu bg-black opacity-30" />
                <DialogContent
                  showClose={false}
                  className="space-y-6"
                  containerClass="w-full max-w-md z-[70]"
                >
                  <h2 className="h4">
                    Install &ldquo;{getAppName(docket)}&rdquo;
                  </h2>
                  <p className="pr-6 tracking-tight">
                    This application will be able to view and interact with the
                    contents of your Urbit. Only install if you trust the
                    developer.
                  </p>
                  <div className="flex space-x-6">
                    <DialogClose asChild>
                      <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={installApp}>
                        Get &ldquo;{getAppName(docket)}&rdquo;
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog.Portal>
            </Dialog.Root>
          )}
          <PillButton variant="alt-secondary" onClick={copyApp}>
            {!copied && 'Copy App Link'}
            {copied && 'copied!'}
          </PillButton>
        </div>
      </DocketHeader>
      <div className="space-y-6">
        {pike ? (
          <>
            <hr className="-mx-5 border-gray-50 sm:-mx-8" />
            <PikeMeta pike={pike} />
          </>
        ) : null}
        {!treaty ? null : (
          <>
            <hr className="-mx-5 border-gray-50 sm:-mx-8" />
            <TreatyMeta treaty={treaty} />
          </>
        )}
      </div>
    </div>
  );
};
