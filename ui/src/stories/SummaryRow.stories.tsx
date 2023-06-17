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
    perm: {
      kind: {
        nom: 'Access your network keys',
        pes: []
      }
    },
  },
};

export const NoWarning: Story = {
  args: {
    perm: {
      kind: {
        nom: 'Access your network keys',
        pes: []
      }
    },
  },
};

export const Expandable: Story = {
  args: {
    perm: {
      kind: {
        nom: 'Access your network keys',
        pes: [
          {
            desc: 'Read or change your network keys',
            warn: 'This permission is required for the app to work properly',
            pers: [],
            have: 'nil',
          }
        ]
      }
    },
  },
};
