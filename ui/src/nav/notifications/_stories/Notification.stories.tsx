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
import { groupStore } from '../groups';

export default {
  title: 'Talk Notification',
  component: Notification,
} as ComponentMeta<typeof Notification>;

const mockDm: Bin = {
  time: 1672362060473,
  count: 45,
  shipCount: 1,
  unread: false,
  topYarn: {
    but: { title: 'Reply', handler: '' },
    id: '0v1.45pi5.aakuh.q0cb0.gd6fq.oks1p',
    con: [
      {
        ship: '~rapfyr-diglyt',
      },
      ': ',
      'send me a message there when you get this too just to make sure it works',
      '',
    ],
    wer: '/dm/~rapfyr-diglyt',
    time: 1672362060473,
    rope: {
      channel: null,
      desk: 'talk',
      group: null,
      thread: '/dm/~rapfyr-diglyt',
    },
  },
};

const mockReply: Bin = {
  time: 1672362060473,
  count: 1,
  shipCount: 1,
  unread: false,
  topYarn: {
    but: { title: '', handler: '' },
    id: '0v1.45pi5.aakuh.q0cb0.gd6fq.oks1p',
    con: [
      {
        ship: '~dev',
      },
      ' replied to your message ',
      '“check”: ',
      'seen',
    ],
    wer: '/dm/~dev',
    time: 1672362060473,
    rope: {
      channel: '',
      desk: 'groups',
      group: '~zod/test',
      thread: '/groups/~zod/test',
    },
  },
};

const WrappedNotification: Story = ({ ...args }: any) => {
  const { groups, retrieve } = groupStore();
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
    retrieve();
  }, []);

  return (
    <MemoryRouter>
      <div className="rounded-xl bg-gray-50 p-4">
        <Notification bin={args.bin} groups={groups} />
      </div>
    </MemoryRouter>
  );
};

export const SingleDM = WrappedNotification.bind({});
export const Reply = WrappedNotification.bind({});

SingleDM.args = {
  bin: mockDm,
};

Reply.args = {
  bin: mockReply,
};
