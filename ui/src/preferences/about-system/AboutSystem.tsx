import { Pike } from '@/gear';
import React from 'react';
import { AppList } from '../../components/AppList';
import { Button } from '../../components/Button';
import {
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '../../components/Dialog';
import * as Dialog from '@radix-ui/react-dialog';
import { FullTlon16Icon } from '../../components/icons/FullTlon16Icon';
import { useSystemUpdate } from '../../logic/useSystemUpdate';
import { usePike, useLag } from '../../state/kiln';
import useVereState from '../../state/vere';
import { isHosted } from '@/logic/utils';
import { disableDefault, pluralize } from '@/logic/utils';
import { UpdatePreferences } from './UpdatePreferences';
import { ShipCode } from '@/components/ShipCode';

function getHash(pike: Pike): string {
  const parts = pike.hash.split('.');
  return parts[parts.length - 1];
}

export const AboutSystem = () => {
  const basePike = usePike('base');
  const { systemBlocked, blockedCharges, blockedCount, freezeApps } =
    useSystemUpdate();
  const gardenBlocked =
    null != blockedCharges.find((charge) => charge.desk == 'landscape');
  const hash = basePike && getHash(basePike);
  const lag = useLag();

  const vere = useVereState.getState();
  const { isLatest, vereVersion, latestVereVersion, loaded } = vere;

  const runtimeUpToDate = !loaded || isLatest;

  return (
    <>
      <div className="inner-section relative mb-4 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="h3">About System</h2>
          {systemBlocked && (
            <span className="rounded-md bg-orange-50 px-2 py-1 text-sm font-semibold text-orange-500">
              Runtime update blocked
            </span>
          )}
        </div>
        <div className="space-y-4 leading-5">
          <FullTlon16Icon className="h-4" />
          <div>
            <p>
              Arvo kernel version{' '}
              <span className="font-mono font-semibold">{hash}</span>
            </p>
          </div>
          {systemBlocked ? (
            <>
              {lag ? (
                <>
                  <p className="text-orange-500">
                    Kernel update failed because your runtime was out of date.
                  </p>
                  <p>
                    Your runtime version is {vereVersion}, the latest runtime
                    version is {latestVereVersion}.
                  </p>
                  <p>Update your runtime or contact your hosting provider.</p>
                  <p>Once your runtime is up to date, click retry below.</p>
                  <Button variant="caution" onClick={freezeApps}>
                    Retry Kernel Update
                  </Button>
                </>
              ) : blockedCount == 0 ? (
                <>
                  <p className="text-orange-500">Kernel update failed.</p>
                  <p>
                    For additional debugging output, open the terminal and click
                    retry below.
                  </p>
                  <Button variant="caution" onClick={freezeApps}>
                    Retry Kernel Update
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-orange-500">
                    Update is currently blocked by the following{' '}
                    {pluralize('app', blockedCount)}:
                  </p>
                  <AppList
                    apps={blockedCharges}
                    labelledBy="blocked-apps"
                    size="xs"
                    className="font-medium"
                  />
                  {gardenBlocked ? (
                    <>
                      <p>
                        Landscape is the application launcher and system
                        interface. It needs an update before you can apply the
                        %base update.
                      </p>
                    </>
                  ) : (
                    <Dialog.Root>
                      <DialogTrigger asChild>
                        <Button variant="caution">
                          Suspend {blockedCount}{' '}
                          {pluralize('App', blockedCount)} and Apply %base
                          Update
                        </Button>
                      </DialogTrigger>
                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed top-0 bottom-0 left-0 right-0 z-[60] transform-gpu bg-black opacity-30" />
                        <DialogContent
                          showClose={false}
                          onOpenAutoFocus={disableDefault}
                          className="space-y-6 tracking-tight"
                          containerClass="w-full max-w-md z-[70]"
                        >
                          <h2 className="h4">
                            Suspend {blockedCount}{' '}
                            {pluralize('App', blockedCount)} and Apply %base
                            Update
                          </h2>
                          <p>
                            The following {pluralize('app', blockedCount)} will
                            be suspended until their developer provides an
                            update.
                          </p>
                          <AppList
                            apps={blockedCharges}
                            labelledBy="blocked-apps"
                            size="xs"
                          />
                          <div className="flex space-x-6">
                            <DialogClose asChild>
                              <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button variant="caution" onClick={freezeApps}>
                                Suspend {pluralize('App', blockedCount)} and
                                Update
                              </Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog.Portal>
                    </Dialog.Root>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {runtimeUpToDate ? (
                <>
                  <p>Vere runtime version {vereVersion}</p>
                  <p>You are running the latest runtime.</p>
                </>
              ) : (
                <>
                  <p className="text-orange-500">
                    Your version is {vereVersion}, the latest published version
                    is {latestVereVersion}.
                  </p>
                  {!isHosted ? (
                    <p className="text-orange-500">
                      <a
                        className="font-bold text-blue-500"
                        href="https://operators.urbit.org/manual/os/updates#runtime-updates"
                      >
                        Update your runtime{' '}
                      </a>
                      or contact your hosting provider.
                    </p>
                  ) : (
                    <p className="text-orange-500">
                      Tlon Hosting is currently updating your runtime. Please{' '}
                      <a
                        className="font-bold text-blue-500"
                        href="mailto:support@tlon.io"
                      >
                        contact support
                      </a>{' '}
                      for more information.
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      <UpdatePreferences />
      <div className="inner-section relative mt-4 space-y-6">
        <h2 className="h3">+code</h2>
        <p className="leading-5">
          Reveal your +code below to sign in to other services. Your +code is a{' '}
          <strong>root-level</strong> access key for the system; handle it with
          care.
        </p>
        <ShipCode />
      </div>
    </>
  );
};
