import type { Meta, StoryObj } from "@storybook/react";
import { FloatingParticles } from "./index";

const meta: Meta<typeof FloatingParticles> = {
  title: "Components/FloatingParticles",
  component: FloatingParticles,
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
      control: { type: "range", min: 10, max: 200, step: 5 },
      description: "表示するパーティクルの数",
    },
    className: {
      control: { type: "text" },
      description: "追加のCSSクラス",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 50,
  },
};

export const FewParticles: Story = {
  args: {
    count: 20,
  },
};

export const ManyParticles: Story = {
  args: {
    count: 100,
  },
};

export const OnSpaceBackground: Story = {
  args: {
    count: 75,
  },
  parameters: {
    backgrounds: { default: "space" },
  },
};
