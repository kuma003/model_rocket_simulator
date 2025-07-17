import type { Meta, StoryObj } from "@storybook/react";
import RocketPanel from "./index";
import type { RocketParams } from "../../features/Rocket/types";

// Mock the motor data loading for Storybook
const mockMotorData = {
  "Estes A10": {
    name: "Estes A10",
    thrustCurve: [
      { time: 0.026, thrust: 0.478 },
      { time: 0.055, thrust: 1.919 },
      { time: 0.093, thrust: 4.513 },
      { time: 0.124, thrust: 8.165 },
      { time: 0.146, thrust: 10.956 },
      { time: 0.166, thrust: 12.64 },
      { time: 0.179, thrust: 11.046 },
      { time: 0.194, thrust: 7.966 },
      { time: 0.203, thrust: 6.042 },
      { time: 0.209, thrust: 3.154 },
      { time: 0.225, thrust: 1.421 },
      { time: 0.26, thrust: 1.225 },
      { time: 0.333, thrust: 1.41 },
      { time: 0.456, thrust: 1.206 },
      { time: 0.575, thrust: 1.195 },
      { time: 0.663, thrust: 1.282 },
      { time: 0.76, thrust: 1.273 },
      { time: 0.811, thrust: 1.268 },
      { time: 0.828, thrust: 0.689 },
      { time: 0.85, thrust: 0 }
    ],
    totalImpulse: 2.5,
    averageThrust: 2.94,
    burnTime: 0.85,
    peakThrust: 12.64
  },
  "Estes A3": {
    name: "Estes A3",
    thrustCurve: [
      { time: 0.024, thrust: 0.195 },
      { time: 0.048, thrust: 0.899 },
      { time: 0.086, thrust: 2.658 },
      { time: 0.11, thrust: 4.183 },
      { time: 0.14, thrust: 5.83 },
      { time: 0.159, thrust: 5.395 },
      { time: 0.18, thrust: 4.301 },
      { time: 0.199, thrust: 3.635 },
      { time: 0.215, thrust: 2.736 },
      { time: 0.234, thrust: 2.267 },
      { time: 0.258, thrust: 2.15 },
      { time: 0.315, thrust: 2.072 },
      { time: 0.441, thrust: 1.993 },
      { time: 0.554, thrust: 2.033 },
      { time: 0.605, thrust: 2.072 },
      { time: 0.673, thrust: 1.954 },
      { time: 0.764, thrust: 1.954 },
      { time: 0.874, thrust: 2.072 },
      { time: 0.931, thrust: 2.15 },
      { time: 0.953, thrust: 2.072 },
      { time: 0.966, thrust: 1.719 },
      { time: 0.977, thrust: 1.173 },
      { time: 0.993, thrust: 0.547 },
      { time: 1.01, thrust: 0 }
    ],
    totalImpulse: 2.5,
    averageThrust: 2.48,
    burnTime: 1.01,
    peakThrust: 5.83
  },
  "Estes C6": {
    name: "Estes C6",
    thrustCurve: [
      { time: 0.02, thrust: 0.5 },
      { time: 0.05, thrust: 2.1 },
      { time: 0.08, thrust: 4.8 },
      { time: 0.12, thrust: 8.5 },
      { time: 0.15, thrust: 12.2 },
      { time: 0.18, thrust: 15.8 },
      { time: 0.22, thrust: 18.5 },
      { time: 0.25, thrust: 16.2 },
      { time: 0.28, thrust: 14.1 },
      { time: 0.32, thrust: 12.5 },
      { time: 0.45, thrust: 10.8 },
      { time: 0.62, thrust: 9.2 },
      { time: 0.85, thrust: 7.5 },
      { time: 1.2, thrust: 5.8 },
      { time: 1.5, thrust: 4.2 },
      { time: 1.8, thrust: 2.8 },
      { time: 2.0, thrust: 1.5 },
      { time: 2.2, thrust: 0 }
    ],
    totalImpulse: 10.0,
    averageThrust: 4.55,
    burnTime: 2.2,
    peakThrust: 18.5
  }
};

// Mock the loadMotorData function for Storybook
if (typeof window !== 'undefined') {
  (window as any).__mockMotorData = mockMotorData;
}

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
    offset: 0,
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
      default: "space",
      values: [
        { name: "dark", value: "#1a1a1a" },
        {
          name: "space",
          value: "linear-gradient(to bottom, #5a3393, #354d8f, #403e80)",
        },
        {
          name: "cosmic",
          value: "radial-gradient(ellipse at center, #1a0f3a 0%, #0d051a 70%, #000000 100%)",
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
        offset: 0,
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
        offset: 0,
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
        offset: 0,
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

export const WithThrustCurve: Story = {
  args: {
    rocketParams: {
      ...defaultParams,
      name: "スラストカーブ表示テスト",
      engine: {
        name: "Estes A10",
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "エンジンセクションでスラストカーブの表示をテストできます。エンジンを変更すると異なるスラストカーブが表示されます。",
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Auto-select the engine section to show the thrust curve
    const canvas = canvasElement;
    const engineButton = canvas.querySelector('[data-value="エンジン"]') as HTMLElement;
    if (engineButton) {
      engineButton.click();
    }
  },
};