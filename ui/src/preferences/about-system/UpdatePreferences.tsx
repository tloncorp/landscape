import _ from 'lodash';
import React from 'react';
import SourceSetter from '../../components/SourceSetter';
import useKilnState, { usePike } from '../../state/kiln';

export const UpdatePreferences = () => {
  const desk = 'base';
  const appName = '%base';
  const pike = usePike(desk);
  const srcShip = pike?.sync?.ship;
  const { toggleInstall } = useKilnState();

  return (
    <div className="inner-section relative space-y-8">
      <SourceSetter
        appName={appName}
        toggleSrc={toggleInstall}
        srcDesk={desk}
        srcShip={srcShip}
        title="%base Updates"
      />
    </div>
  );
};
