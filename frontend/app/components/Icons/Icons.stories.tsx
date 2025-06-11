import type { Meta, StoryObj } from '@storybook/react';
import PlayArrow from './PlayArrow';

const meta: Meta<typeof PlayArrow> = {
    title: 'Icons/PlayArrow',
    component: PlayArrow,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        size: {
            control: { type: 'number' },
        },
        fill: {
            control: { type: 'color' },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {size: 24, fill: 'gray', className: ''},
};
