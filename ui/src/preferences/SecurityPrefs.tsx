import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { Dialog, DialogContent } from '../components/Dialog';

export const SecurityPrefs = () => {
  const [allSessions, setAllSessions] = useState(false);
  const { push } = useHistory();

  return (
    <Dialog
      open
      onOpenChange={(open) => !open && push('/leap/system-preferences')}
    >
      <DialogContent containerClass="w-1/3" showClose={false}>
        <h3 className="h4 mb-6 flex items-center">Log Out</h3>
        <div className="flex flex-1 flex-col justify-center space-y-6">
          <div className="flex flex-col space-y-3">
            <p className="leading-5">
              Logging out of Landscape will additionally log you out of any
              applications installed on your urbit.
            </p>
            <p className="leading-5">
              You&apos;ll need to log into your urbit again in order to access
              its apps.
            </p>
          </div>
          <Checkbox
            defaultChecked={false}
            checked={allSessions}
            onCheckedChange={() => setAllSessions((prev) => !prev)}
          >
            Log out of all connected sessions.
          </Checkbox>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => push('/leap/system-preferences')}
            >
              Cancel
            </Button>
            <form method="post" action="/~/logout">
              {allSessions && <input type="hidden" name="all" />}
              <Button>Logout</Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
