import React from 'react';
import { PermissionsDialogInner } from '@/permissions/PermissionsDialog';
import { Dialog, DialogContent } from '@/components/Dialog';
import { fakePassport, fakeSeal } from '@/permissions/temp';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PermissionsDialogInner> = {
  title: 'Permissions/PermissionsDialogInner',
  tags: ['autodocs'],
  component: PermissionsDialogInner,
  decorators: [
    (Story) => (
      <Dialog open>
        <DialogContent
          showClose={false}
          containerClass="w-full max-w-xl z-[70]"
        >
          <Story />
        </DialogContent>
      </Dialog>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof PermissionsDialogInner>;

export const Default: Story = {
  args: {
    appName: 'Some Cool App',
    passport: fakePassport,
    presentableSeal: fakeSeal.split('\n'),
    onInstall: () => { },
  },
};
