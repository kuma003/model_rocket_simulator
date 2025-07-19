import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { MantineProvider } from '@mantine/core';
import RocketSelectionModal from './RocketSelectionModal';

const meta: Meta<typeof RocketSelectionModal> = {
  title: 'Features/RocketSelection/RocketSelectionModal',
  component: RocketSelectionModal,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1b3e' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ],
  argTypes: {
    opened: {
      control: 'boolean',
      description: 'Whether the modal is open',
    },
    onClose: {
      action: 'onClose',
      description: 'Function called when modal should close',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RocketSelectionModal>;

/**
 * Default story showing the rocket selection modal in opened state
 */
export const Default: Story = {
  args: {
    opened: true,
    onClose: action('onClose'),
  },
};

/**
 * Story showing the modal in closed state
 */
export const Closed: Story = {
  args: {
    opened: false,
    onClose: action('onClose'),
  },
};

/**
 * Interactive story where users can toggle the modal state
 */
export const Interactive: Story = {
  args: {
    opened: true,
    onClose: action('onClose'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive version where you can test opening and closing the modal.',
      },
    },
  },
};