import React from 'react';
import { Setting } from '../components/Setting';
import {
  useSettingsState,
  SettingsState,
} from '../state/settings';

const selDnd = (s: SettingsState) => s.display.doNotDisturb;
async function toggleDnd() {
  const state = useSettingsState.getState();
  const curr = selDnd(state);
  await state.putEntry('display', 'doNotDisturb', !curr);
}

export const NotificationPrefs = () => {
  const doNotDisturb = useSettingsState(selDnd);

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
        {/* <Setting on={mentions} toggle={toggleMentions} name="Mentions">
          <p>Notify me if someone mentions my @p in a channel I&apos;ve joined</p>
        </Setting> */}
      </div>
    </>
  );
};
