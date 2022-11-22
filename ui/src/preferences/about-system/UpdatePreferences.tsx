import { Vat } from '@urbit/api';
import _ from 'lodash';
import React from 'react';
import SourceSetter from '../../components/SourceSetter';
import useKilnState, { usePike } from '../../state/kiln';

// TODO
interface UpdatePreferencesProps {
  base: Vat | undefined;
}

export const UpdatePreferences = ({ base }: UpdatePreferencesProps) => {
  const desk = 'base';
  const appName = 'your Urbit';
  const pike = usePike(desk);
  const srcShip = pike?.sync?.ship;
  const { toggleInstall } = useKilnState();
  
  return (
    <SourceSetter
      appName={appName}
      toggleSrc={toggleInstall}
      srcDesk={desk}
      srcShip={srcShip}
      title="System Updates"
    />
  );
};
