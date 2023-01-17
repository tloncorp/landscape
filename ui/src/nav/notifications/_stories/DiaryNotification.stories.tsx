import React, { useEffect } from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { noteCommentYours, noteComment } from './mock-bins';
import Notification from '../Notification';
import { useSettingsState } from '../../../state/settings';
import api from '../../../state/api';
import useContactState from '../../../state/contact';
import useDocketState, { useCharges } from '../../../state/docket';
import useHarkState from '../../../state/hark';
import useKilnState from '../../../state/kiln';
import { groupStore } from '../groups';

export default {
  title: 'Diary Notification',
  component: Notification,
} as ComponentMeta<typeof Notification>;

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
      <Notification bin={args.bin} groups={groups} />
    </MemoryRouter>
  );
};

export const CommentOnPost = WrappedNotification.bind({});
CommentOnPost.args = {
  bin: noteComment,
};

export const CommentOnYourPost = WrappedNotification.bind({});
CommentOnYourPost.args = {
  bin: noteCommentYours,
};
