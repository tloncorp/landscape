import React, { useEffect } from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { Bin } from '../useNotifications';
import Notification from '../Notification';
import { useSettingsState } from '../../../state/settings';
import api from '../../../state/api';
import useContactState from '../../../state/contact';
import useDocketState, { useCharge, useCharges } from '../../../state/docket';
import useHarkState from '../../../state/hark';
import useKilnState from '../../../state/kiln';

export default {
  title: 'Notification',
  component: Notification,
} as ComponentMeta<typeof Notification>;

const mockBin: Bin = {
  time: 1672362060473,
  count: 7,
  shipCount: 1,
  unread: true,
  topYarn: {
    but: { title: '', handler: '' },
    id: '0v1.45pi5.aakuh.q0cb0.gd6fq.oks1p',
    con: [
      {
        ship: '~dev',
      },
      ': ',
      'check',
      '',
    ],
    wer: '/dm/~dev',
    time: 1672362060473,
    rope: {
      channel: null,
      desk: 'talk',
      group: null,
      thread: '/dm/~dev',
    },
  },
};

const WrappedNotification: Story = ({ ...args }: any) => {
  useCharges();

  useEffect(() => {
    window.name = 'grid';
    const { initialize: settingsInitialize, fetchAll } =
      useSettingsState.getState();
    settingsInitialize(api);
    fetchAll();
    const { fetchDefaultAlly, fetchAllies, fetchCharges } =
      useDocketState.getState();
    fetchDefaultAlly();
    fetchCharges();
    fetchAllies();
    const { initializeKiln } = useKilnState.getState();
    initializeKiln();
    useContactState.getState().initialize(api);
    useHarkState.getState().start();
  }, []);

  return (
    <MemoryRouter>
      <Notification bin={args.bin} />
    </MemoryRouter>
  );
};

export const Default = WrappedNotification.bind({});

Default.args = {
  bin: mockBin,
};
