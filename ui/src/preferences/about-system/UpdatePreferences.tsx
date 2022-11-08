import { Vat } from '@urbit/api';
import _ from 'lodash';
import React from 'react';
import SourceSyncer from '../../components/SourceSyncer';
import { usePike } from '../../state/kiln';

interface UpdatePreferencesProps {
  base: Vat | undefined;
}

export const UpdatePreferences = ({ base }: UpdatePreferencesProps) => {
  const desk = 'base';
  const appName = 'your Urbit';
  const pike = usePike(desk);
  const syncShip = pike?.sync?.ship;

  return (
    <SourceSyncer appName={appName} title="System Updates" syncDesk={desk} syncShip={syncShip} />
  );
};
