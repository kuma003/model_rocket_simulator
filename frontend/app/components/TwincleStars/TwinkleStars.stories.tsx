import type { Meta, StoryObj } from "@storybook/react";

// TwinkleStarsコンポーネントが実装されたら、適切にimportしてください
// import { TwinkleStars } from "./index";

// 仮のコンポーネント（実際のコンポーネントに置き換えてください）
const TwinkleStars = () => <div>TwinkleStars component placeholder</div>;

const meta: Meta<typeof TwinkleStars> = {
  title: "Components/TwinkleStars",
  component: TwinkleStars,
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
