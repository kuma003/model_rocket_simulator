import type { Meta, StoryObj } from "@storybook/react";
import { StarField } from "./index";

const meta: Meta<typeof StarField> = {
  title: "Components/StarField",
  component: StarField,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#1a1a1a" },
        {
          name: "space",
          value: "linear-gradient(to bottom, #0f0f23, #1a1a2e, #16213e)",
        },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    count: {
      control: { type: "range", min: 10, max: 500, step: 10 },
      description: "表示する星の数",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 100,
  },
};

export const FewStars: Story = {
  args: {
    count: 20,
  },
};

export const ManyStars: Story = {
  args: {
    count: 300,
  },
};

export const OnSpaceBackground: Story = {
  args: {
    count: 200,
  },
  parameters: {
    backgrounds: { default: "space" },
  },
};
