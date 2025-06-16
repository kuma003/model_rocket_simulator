import type { Meta, StoryObj } from "@storybook/react";
import { Top } from "./index";

const meta: Meta<typeof Top> = {
  title: "Components/Top",
  component: Top,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
