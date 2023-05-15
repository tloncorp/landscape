import React, { useCallback } from 'react';
import { Setting } from '../components/Setting';
import { useDisplay, usePutEntryMutation } from '../state/settings';

export const NotificationPrefs = () => {
  const { doNotDisturb } = useDisplay();
  const { mutate } = usePutEntryMutation({
    bucket: 'display',
    key: 'doNotDisturb',
  });

  const toggleDnd = useCallback(async (val: boolean) => {
    mutate({ val });
  }, []);

  return (
    <>
      <div className="inner-section space-y-8">
        <h2 className="h4">Notifications</h2>
        <Setting on={doNotDisturb} toggle={toggleDnd} name="Do Not Disturb">
          <p className="leading-5">
            Blocks Urbit notifications in Landscape from appearing as badges and
            prevents browser notifications if enabled.
          </p>
        </Setting>
      </div>
    </>
  );
};
