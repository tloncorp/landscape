import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Dialog, DialogClose, DialogContent } from '../components/Dialog';
import { useRecentsStore } from '../nav/search/Home';
import {
  useCharges,
  useUninstallDocketMutation,
} from '../state/docket';
import { getAppName } from '@/logic/utils';

export const RemoveApp = () => {
  const navigate = useNavigate();
  const { desk = '' } = useParams<{ desk: string }>();
  const charges = useCharges();
  const docket = charges[desk];
  const { mutate: uninstallDocket } = useUninstallDocketMutation();

  // TODO: add optimistic updates
  const handleRemoveApp = useCallback(() => {
    uninstallDocket({ desk });
    useRecentsStore.getState().removeRecentApp(desk);
  }, [desk]);

  return (
    <Dialog open onOpenChange={(open) => !open && navigate('/')}>
      <DialogContent
        showClose={false}
        className="space-y-6"
        containerClass="w-full max-w-md"
      >
        <h1 className="h4">Uninstall &ldquo;{getAppName(docket)}&rdquo;?</h1>
        <p className="pr-6 tracking-tight">
          The app tile will be removed from Landscape, all processes will be
          stopped and their data archived, and the app will stop receiving
          updates.
        </p>
        <p className="pr-6 tracking-tight">
          If the app is reinstalled, the archived data will be restored and
          you&apos;ll be able to pick up where you left off.
        </p>
        <div className="flex space-x-6">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleRemoveApp}>Uninstall</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
