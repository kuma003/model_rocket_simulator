import type { Meta, StoryObj } from "@storybook/react";
import Title from "./index";

const meta: Meta<typeof Title> = {
  title: "Components/Title",
  component: Title,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#1a1a1a" },
        {
          name: "gradient",
          value: "linear-gradient(to bottom, #5a3393, #354d8f, #403e80)",
        },
      ],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnGradientBackground: Story = {
  parameters: {
    backgrounds: { default: "gradient" },
  },
};
