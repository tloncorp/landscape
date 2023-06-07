import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';

export const SecurityPrefs = () => {
  const [allSessions, setAllSessions] = useState(false);

  return (
    <div className="inner-section space-y-8">
      <h2 className="h4">Log Out</h2>
      <div className="flex flex-1 flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-3">
          <p className="leading-5">
            Logging out of Landscape will additionally log you out of any
            applications installed on your urbit.
          </p>
          <p className="leading-5">
            You&apos;ll need to log into your urbit again in order to access its
            apps.
          </p>
        </div>
        <Checkbox
          defaultChecked={false}
          checked={allSessions}
          onCheckedChange={() => setAllSessions((prev) => !prev)}
        >
          Log out of all connected sessions
        </Checkbox>
        <div className="flex justify-end space-x-2">
          <form method="post" action="/~/logout">
            {allSessions && <input type="hidden" name="all" />}
            <Button>Log Out</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
