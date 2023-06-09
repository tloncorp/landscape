import SummaryRow from '@/permissions/SummaryRow';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SummaryRow> = {
  title: 'Permissions/SummaryRow',
  tags: ['autodocs'],
  component: SummaryRow,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SummaryRow>;

export const HasWarning: Story = {
  args: {
    summary: {
      desc: 'Access your network keys',
      warn: 'This permission is required for the app to work properly',
      pers: [],
      have: 'nil',
    },
  },
};

export const NoWarning: Story = {
  args: {
    summary: {
      desc: 'Send notifications',
      warn: null,
      pers: [],
      have: 'nil',
    },
  },
};

export const Eyre: Story = {
  args: {
    summary: {
      desc: 'Communicate with ships or clearweb sites',
      warn: null,
      pers: [
        {
          name: 'write',
          vane: 'eyre',
          tail: null,
        }
      ],
      have: 'nil',
    },
  },
};
