import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Dialog, DialogClose, DialogContent } from '../components/Dialog';
import { useRecentsStore } from '../nav/search/Home';
import {
  useCharges,
  useToggleDocketMutation,
} from '../state/docket';
import { getAppName } from '@/logic/utils';

export const SuspendApp = () => {
  const navigate = useNavigate();
  const { desk = '' } = useParams<{ desk: string }>();
  const charges = useCharges();
  const charge = charges[desk];
  const { mutate: toggleDocket } = useToggleDocketMutation();

  // TODO: add optimistic updates
  const handleSuspendApp = useCallback(() => {
    toggleDocket({ desk });
    useRecentsStore.getState().removeRecentApp(desk);
  }, [desk]);

  if ('suspend' in charge.chad) {
    navigate('/');
  }

  return (
    <Dialog open onOpenChange={(open) => !open && navigate('/')}>
      <DialogContent
        showClose={false}
        className="space-y-6"
        containerClass="w-full max-w-md"
      >
        <h1 className="h4">Suspend &ldquo;{getAppName(charge)}&rdquo;</h1>
        <p className="pr-6 tracking-tight">
          All processes will be stopped and data archived. The app will continue
          to receive updates from its publisher.
        </p>
        <p className="pr-6 tracking-tight">
          When unsuspended, archived data will be loaded and all processes will
          resume running, so you can pick up where you left off.
        </p>
        <div className="flex space-x-6">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSuspendApp}>Suspend</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
