import _ from 'lodash';
import React from 'react';
import SourceSetter from '../../components/SourceSetter';
import useKilnState, { usePike } from '../../state/kiln';

export const UpdatePreferences = () => {
  const desk = 'base';
  const appName = 'your Urbit';
  const pike = usePike(desk);
  const srcShip = pike?.sync?.ship;
  const { toggleInstall } = useKilnState();
  
  return (
    <div className="inner-section space-y-8 relative">
      <SourceSetter
        appName={appName}
        toggleSrc={toggleInstall}
        srcDesk={desk}
        srcShip={srcShip}
        title="System Updates"
      />
    </div>
  );
};
