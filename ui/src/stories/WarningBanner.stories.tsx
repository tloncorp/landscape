import WarningBanner from '@/permissions/WarningBanner';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof WarningBanner> = {
  title: 'Permissions/WarningBanner',
  tags: ['autodocs'],
  component: WarningBanner,
  
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof WarningBanner>;

export const Three: Story = {
  args: {
    count: 3,
  },
};
