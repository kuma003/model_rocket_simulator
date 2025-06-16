import type { Meta, StoryObj } from "@storybook/react";
import { FloatingSpaceObjects } from "./index";
import type { FloatingSpaceObjectsProps } from "./index";

const meta: Meta<FloatingSpaceObjectsProps> = {
  title: "Effects/FloatingSpaceObjects",
  component: FloatingSpaceObjects,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0c0c0c" },
        { name: "space", value: "#1a1a2e" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  argTypes: {
    count: {
      control: { type: "number", min: 1, max: 20 },
      description: "Number of space objects to display",
    },
    className: {
      control: "text",
      description: "Additional CSS class name",
    },
  },
};

export default meta;
type Story = StoryObj<FloatingSpaceObjectsProps>;

export const Default: Story = {
  args: {
    count: 8,
  },
};

export const FewObjects: Story = {
  args: {
    count: 3,
  },
};

export const ManyObjects: Story = {
  args: {
    count: 15,
  },
};

export const WithCustomClass: Story = {
  args: {
    count: 8,
    className: "custom-space-objects",
  },
};

export const OnLightBackground: Story = {
  args: {
    count: 8,
  },
  parameters: {
    backgrounds: {
      default: "light",
    },
  },
};
