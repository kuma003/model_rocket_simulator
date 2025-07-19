import type { Meta, StoryObj } from "@storybook/react";
import RocketComponent from "./RocketComponent";
import type { RocketParams } from "../Rocket/types";

// 基本的なロケットパラメータ
const basicRocketParams: RocketParams = {
  name: "基本ロケット",
  designer: "テスト設計者",
  nose: {
    length: 0.1,
    diameter: 0.024,
    thickness: 0.001,
    material: "plastic",
    color: "#FF0000",
    type: "conical",
  },
  body: {
    length: 0.3,
    diameter: 0.024,
    thickness: 0.001,
    material: "cardboard",
    color: "#FFFF00",
  },
  fins: {
    thickness: 0.001,
    material: "balsa",
    color: "#0000FF",
    count: 3,
    type: "trapozoidal",
    rootChord: 0.05,
    tipChord: 0.02,
    sweepLength: 0.03,
    height: 0.04,
    offset: 0.0,
  },
  payload: {
    offset: 0.05,
    diameter: 0.02,
    length: 0.03,
    mass: 0.01,
  },
  engine: {
    name: "Estes A10",
    peakThrust: 9.5,
    averageThrust: 4.6,
    burnTime: 0.5,
    totalImpulse: 2.3,
    thrustCurve: [],
    diameter: 18,
    length: 70,
    delays: "3-5-7",
    propMass: 0.0038,
    totalMass: 0.0087,
    manufacturer: "Estes",
  },
};

// RocketSpecsに合わせたモックデータ
const mockRocketProperties = {
  dryMass: 50,
  inertiaMoment: 1000,
  stabilityMargin: 1.5,
  specs: {
    ref_len: 0.4,
    diam: 0.024,
    mass_dry: 0.05,
    mass_i: 0.0587,
    mass_f: 0.0549,
    CGlen_i: 0.2,
    CGlen_f: 0.21,
    Iyz: 0.001,
    CPlen: 0.25,
    Cd: 0.45,
    Cna: 12.0,
    Cmq: -0.5,
    vel_1st: 0,
    op_time: 0.5,
    engine: basicRocketParams.engine,
  },
};

const meta: Meta<typeof RocketComponent> = {
  title: "Design/RocketComponent",
  component: RocketComponent,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "ロケットの3D表示コンポーネント。SVGを使用してロケットの形状を描画します。",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
        <svg
          width="600"
          height="400"
          viewBox="0 0 600 400"
          style={{ border: "1px solid #ddd", backgroundColor: "white" }}
        >
          <Story />
        </svg>
      </div>
    ),
  ],
  argTypes: {
    scale: {
      control: { type: "range", min: 0.5, max: 5, step: 0.1 },
      description: "表示スケール",
    },
    pitchAngle: {
      control: { type: "range", min: -45, max: 45, step: 5 },
      description: "ピッチ角（度）",
    },
    rollAngle: {
      control: { type: "range", min: -90, max: 90, step: 10 },
      description: "ロール角（度）",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rocketParams: basicRocketParams,
    rocketProperties: mockRocketProperties,
    scale: 2,
    pitchAngle: 0,
    rollAngle: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "基本的なロケット表示。コニカルノーズと3枚フィン構成。",
      },
    },
  },
};

export const SmallScale: Story = {
  args: {
    rocketParams: basicRocketParams,
    rocketProperties: mockRocketProperties,
    scale: 1,
    pitchAngle: 0,
    rollAngle: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "小さなスケールで表示。",
      },
    },
  },
};

export const LargeScale: Story = {
  args: {
    rocketParams: basicRocketParams,
    rocketProperties: mockRocketProperties,
    scale: 4,
    pitchAngle: 0,
    rollAngle: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "大きなスケールで表示。",
      },
    },
  },
};

export const WithPitchAngle: Story = {
  args: {
    rocketParams: basicRocketParams,
    rocketProperties: mockRocketProperties,
    scale: 2,
    pitchAngle: 30,
    rollAngle: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "30度のピッチ角を適用した表示。",
      },
    },
  },
};

export const WithRollAngle: Story = {
  args: {
    rocketParams: basicRocketParams,
    rocketProperties: mockRocketProperties,
    scale: 2,
    pitchAngle: 0,
    rollAngle: 45,
  },
  parameters: {
    docs: {
      description: {
        story: "45度のロール角を適用した表示。フィンの見え方が変化します。",
      },
    },
  },
};
