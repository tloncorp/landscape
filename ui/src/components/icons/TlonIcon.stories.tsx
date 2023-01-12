import React from 'react';

import { ComponentMeta } from '@storybook/react';

import TlonIcon from './TlonIcon';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Tlon Icon',
  component: TlonIcon,
} as ComponentMeta<typeof TlonIcon>;

export const Primary = () => <TlonIcon />;
