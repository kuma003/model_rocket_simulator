import type { Meta, StoryObj } from "@storybook/react";
import { SpaceObject, FloatingSpaceObjects } from "./index";

const meta: Meta<typeof SpaceObject> = {
  title: "Components/SpaceObjects",
  component: SpaceObject,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#2a1810' },
        { name: 'space', value: 'linear-gradient(to bottom, #5a3393, #354d8f, #403e80)' },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['planet', 'moon', 'asteroid'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    color: {
      control: { type: 'color' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Planet: Story = {
  args: {
    type: "planet",
    size: "large",
    color: "#4ecdc4",
  },
};

export const Moon: Story = {
  args: {
    type: "moon",
    size: "medium",
  },
};

export const Asteroid: Story = {
  args: {
    type: "asteroid",
    size: "small",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <SpaceObject type="planet" size="small" color="#ff6b6b" />
      <SpaceObject type="planet" size="medium" color="#4ecdc4" />
      <SpaceObject type="planet" size="large" color="#45b7d1" />
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
      <SpaceObject type="planet" size="large" color="#f9ca24" />
      <SpaceObject type="moon" size="large" />
      <SpaceObject type="asteroid" size="large" />
    </div>
  ),
};

// Floating Space Objects Stories
const FloatingMeta: Meta<typeof FloatingSpaceObjects> = {
  title: "Components/SpaceObjects/Floating",
  component: FloatingSpaceObjects,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: 'space',
      values: [
        { name: 'space', value: 'linear-gradient(to bottom, #5a3393, #354d8f, #403e80)' },
      ],
    },
  },
  tags: ["autodocs"],
};

export const FloatingObjects: StoryObj<typeof FloatingSpaceObjects> = {
  args: {
    count: 12,
  },
  parameters: {
    ...FloatingMeta.parameters,
  },
};