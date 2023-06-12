import PermissionsDialog from '@/permissions/PermissionsDialog';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PermissionsDialog> = {
  title: 'Permissions/PermissionsDialog',
  tags: ['autodocs'],
  component: PermissionsDialog,
  
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof PermissionsDialog>;

export const Default: Story = {
  args: {},
};
