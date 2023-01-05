import { Pike } from '@urbit/api';
import React from 'react';
import { AppList } from '../../components/AppList';
import { Button } from '../../components/Button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../../components/Dialog';
import { FullTlon16Icon } from '../../components/icons/FullTlon16Icon';
import { useSystemUpdate } from '../../logic/useSystemUpdate';
import { useCharge } from '../../state/docket';
import { usePike, useLag } from '../../state/kiln';
import { disableDefault, pluralize } from '../../state/util';
import { UpdatePreferences } from './UpdatePreferences';

function getHash(pike: Pike): string {
  const parts = pike.hash.split('.');
  return parts[parts.length - 1];
}

export const AboutSystem = () => {
  const basePike = usePike('base');
  const { systemBlocked, blockedCharges, blockedCount, freezeApps } =
    useSystemUpdate();
  const gardenBlocked = null != blockedCharges.find(charge => charge.desk == 'garden');
  const hash = basePike && getHash(basePike);
  const lag = useLag();
  
  return (
    <>
      <div className="inner-section space-y-8 relative mb-4">
        <div className="flex items-center justify-between">
          <h2 className="h4">About System</h2>
          {systemBlocked && (
            <span className="bg-orange-50 text-orange-500 text-sm font-semibold px-2 py-1 rounded-md">
              System Update Blocked
            </span>
          )}
        </div>
        <div className="leading-5 space-y-4">
          <FullTlon16Icon className="h-4" />
          <div>
            <p>
              Urbit Kernel Version ({hash})
            </p>
          </div>
          {systemBlocked ? (
            <>
            {lag ? (
              <>
              <p className="text-orange-500">
                System update failed because your runtime was out of date.
              </p>
              <p>
                Update your runtime or contact your hosting provider.
              </p>
              <p>
                Once your runtime is up to date, click retry below.
              </p>
              <Button variant="caution" onClick={freezeApps}>
                Retry System Update
              </Button>
              </>
            ) : (blockedCount == 0) ? (
              <>
              <p className="text-orange-500">
                System update failed.
              </p>
              <p>
                For additional debugging output, open the terminal and click retry below.
              </p>
              <Button variant="caution" onClick={freezeApps}>
                Retry System Update
              </Button>
              </>
            ) : (
              <>
              <p className="text-orange-500">
                Update is currently blocked by the following {pluralize('app', blockedCount)}:
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
                  Grid is the application launcher and system interface.
                  It needs an update before you can apply the System Update.
                </p>
                </>
              ) : (
                <Dialog>
                  <DialogTrigger as={Button} variant="caution">
                    Suspend {blockedCount} {pluralize('App', blockedCount)} and Apply Update
                  </DialogTrigger>
                  <DialogContent
                    showClose={false}
                    onOpenAutoFocus={disableDefault}
                    className="space-y-6 tracking-tight"
                    containerClass="w-full max-w-md"
                  >
                    <h2 className="h4">
                      Suspend {blockedCount} {pluralize('App', blockedCount)} and Apply System Update
                    </h2>
                    <p>
                      The following {pluralize('app', blockedCount)} will be suspended until their
                      developer provides an update.
                    </p>
                    <AppList apps={blockedCharges} labelledBy="blocked-apps" size="xs" />
                    <div className="flex space-x-6">
                      <DialogClose as={Button} variant="secondary">
                        Cancel
                      </DialogClose>
                      <DialogClose as={Button} variant="caution" onClick={freezeApps}>
                        Suspend {pluralize('App', blockedCount)} and Update
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              </>
            )}
            </>
          ) : (
            <p>Your urbit is up to date.</p>
          )}
        </div>
      </div>
      <UpdatePreferences />
    </>
  );
};
