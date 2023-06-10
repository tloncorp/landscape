import React from 'react';
import { IdentityPrefs } from './IdentityPrefs';
import { P2PServicePrefs } from './P2PServicePrefs';
import { LoomPrefs } from './LoomPrefs';

export const SystemResourcePrefs = () => (
  <>
    <IdentityPrefs />
    <P2PServicePrefs />
    <LoomPrefs />
  </>
);
