import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Dialog, DialogContent } from './Dialog';
import { PermissionsDialogInner } from '@/permissions/PermissionsDialog';
import { Spinner } from '@/components/Spinner';
import usePermissions from '@/permissions/usePermissions';

export const Permissions = () => {
  const { push } = useHistory();
  const {
    appName,
    desk,
    docket,
    installStatus,
    passport,
    pike,
    ship,
  } = usePermissions();

  const onInstall = useCallback(async () => {
    if (installStatus === 'installed') {
      return;
    }

    // await useDocketState.getState().approvePermissions(ship, desk);

    // await useDocketState.getState().installDocket(ship, desk);
    console.log(`installing ${ship}/${desk}...`);
    push(`/app/${desk}`);
  }, []);

  return (
    <Dialog open onOpenChange={(open) => !open && push('/')}>
      <DialogContent
        showClose={false}
        containerClass="w-full max-w-xl z-[70]"
      >
        {
          (docket || pike) && passport ? (
            <PermissionsDialogInner
              appName={appName}
              passport={passport}
              onInstall={onInstall}
            />) : (
            <div className="dialog-inner-container flex justify-center text-black">
              <Spinner className="h-10 w-10" />
            </div>
          )
        }
      </DialogContent>
    </Dialog>
  );
};
