import type { Meta, StoryObj } from "@storybook/react";
import RocketPanel from "./index";
import type { RocketParams } from "../../features/Rocket/types";

const defaultParams: RocketParams = {
  name: "サンプルロケット",
  designer: "テスト設計者",
  nose: {
    length: 10,
    diameter: 2.4,
    thickness: 0.1,
    material: "plastic",
    color: "#FF0000",
    type: "conical",
  },
  body: {
    length: 30,
    diameter: 2.4,
    thickness: 0.1,
    material: "cardboard",
    color: "#FFFF00",
  },
  fins: {
    thickness: 0.1,
    material: "balsa",
    color: "#0000FF",
    count: 3,
    type: "trapozoidal",
    rootChord: 5,
    tipChord: 2,
    sweepLength: 3,
    height: 4,
  },
  engine: {
    name: "Estes A10",
  },
};

const meta: Meta<typeof RocketPanel> = {
  title: "Layout/RocketPanel",
  component: RocketPanel,
  parameters: {
    layout: "padded",
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
  args: {
    setRocketParams: () => {},
  },
  argTypes: {
    rocketParams: {
      control: "object",
      description: "Current rocket parameters",
    },
    setRocketParams: {
      action: "setRocketParams",
      description: "Callback function to update rocket parameters",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rocketParams: defaultParams,
  },
};

export const EmptyRocket: Story = {
  args: {
    rocketParams: {
      name: "",
      designer: "",
      nose: {
        length: 0,
        diameter: 0,
        thickness: 0,
        material: "plastic",
        color: "#FFFFFF",
        type: "conical",
      },
      body: {
        length: 0,
        diameter: 0,
        thickness: 0,
        material: "plastic",
        color: "#FFFFFF",
      },
      fins: {
        thickness: 0,
        material: "plastic",
        color: "#FFFFFF",
        count: 3,
        type: "trapozoidal",
        rootChord: 0,
        tipChord: 0,
        sweepLength: 0,
        height: 0,
      },
      engine: {
        name: "",
      },
    },
  },
};

export const ElipticalFins: Story = {
  args: {
    rocketParams: {
      ...defaultParams,
      name: "楕円フィンロケット",
      fins: {
        thickness: 0.1,
        material: "balsa",
        color: "#00FF00",
        count: 4,
        type: "elliptical",
        rootChord: 6,
        height: 5,
      },
    },
  },
};

export const HighPowerRocket: Story = {
  args: {
    rocketParams: {
      ...defaultParams,
      name: "高出力ロケット",
      designer: "上級設計者",
      nose: {
        ...defaultParams.nose,
        length: 15,
        diameter: 3.8,
        type: "ogive",
        color: "#FF4500",
      },
      body: {
        ...defaultParams.body,
        length: 60,
        diameter: 3.8,
        material: "plastic",
        color: "#1E90FF",
      },
      fins: {
        thickness: 0.2,
        material: "plastic",
        color: "#FF1493",
        count: 4,
        type: "trapozoidal",
        rootChord: 8,
        tipChord: 3,
        sweepLength: 5,
        height: 6,
      },
      engine: {
        name: "Estes C6",
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    rocketParams: defaultParams,
  },
  parameters: {
    docs: {
      description: {
        story: "インタラクティブなロケットパネル。各パラメータを変更して、コールバック関数の動作を確認できます。",
      },
    },
  },
};