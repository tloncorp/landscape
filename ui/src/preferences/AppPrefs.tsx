import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useCharge } from '../state/docket';
import useKilnState, { usePike } from '../state/kiln';
import { getAppName } from '@/logic/utils';
import SourceSetter from '../components/SourceSetter';

export const AppPrefs = ({ match }: RouteComponentProps<{ desk: string }>) => {
  const { desk } = match.params;
  const charge = useCharge(desk);
  const appName = getAppName(charge);
  const pike = usePike(desk);
  const srcShip = pike?.sync?.ship;
  const { toggleSync } = useKilnState();

  return (
    <div className="inner-section relative space-y-8">
      <SourceSetter
        appName={appName}
        title={`${appName} Settings`}
        toggleSrc={toggleSync}
        srcDesk={desk}
        srcShip={srcShip}
      />
    </div>
  );
};
