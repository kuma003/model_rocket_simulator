import type { Meta, StoryObj } from "@storybook/react";
import RocketComponent from "./RocketComponent";
import type { RocketParams } from "../Rocket/types";

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

const meta: Meta<typeof RocketComponent> = {
  title: "Components/RocketComponent",
  component: RocketComponent,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#1a1a1a" },
        {
          name: "space",
          value: "linear-gradient(to bottom, #5a3393, #354d8f, #403e80)",
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <svg width="400" height="300" viewBox="0 0 400 300">
        <Story />
      </svg>
    ),
  ],
  argTypes: {
    rocketParams: {
      control: "object",
      description: "ロケットの設計パラメータ",
    },
    scale: {
      control: { type: "range", min: 0.5, max: 10, step: 0.5 },
      description: "表示スケール（px/cm）",
    },
    pitchAngle: {
      control: { type: "range", min: -90, max: 90, step: 5 },
      description: "ピッチ角（度）",
    },
    rollAngle: {
      control: { type: "range", min: -180, max: 180, step: 10 },
      description: "ロール角（度）",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rocketParams: defaultParams,
    scale: 2,
    pitchAngle: 0,
    rollAngle: 0,
  },
};

export const SmallScale: Story = {
  args: {
    rocketParams: defaultParams,
    scale: 1,
    pitchAngle: 0,
    rollAngle: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "小さなスケールで表示。複数のロケットを並べて比較する際に使用。",
      },
    },
  },
};

export const LargeScale: Story = {
  args: {
    rocketParams: defaultParams,
    scale: 5,
    pitchAngle: 0,
    rollAngle: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "大きなスケールで表示。詳細な確認に使用。",
      },
    },
  },
};

export const PitchAngle45: Story = {
  args: {
    rocketParams: defaultParams,
    scale: 2,
    pitchAngle: 45,
    rollAngle: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "45度のピッチ角で表示。飛行中の姿勢を表現。",
      },
    },
  },
};

export const RollAngle90: Story = {
  args: {
    rocketParams: defaultParams,
    scale: 2,
    pitchAngle: 0,
    rollAngle: 90,
  },
  parameters: {
    docs: {
      description: {
        story: "90度のロール角で表示。フィンの見え方が変化。",
      },
    },
  },
};

export const CombinedAngles: Story = {
  args: {
    rocketParams: defaultParams,
    scale: 2,
    pitchAngle: 30,
    rollAngle: 45,
  },
  parameters: {
    docs: {
      description: {
        story: "ピッチ角とロール角を同時に適用。3D的な姿勢を表現。",
      },
    },
  },
};

export const OgiveNose: Story = {
  args: {
    rocketParams: {
      ...defaultParams,
      name: "オジャイブノーズロケット",
      nose: {
        ...defaultParams.nose,
        type: "ogive",
        color: "#FF6600",
      },
    },
    scale: 2,
    pitchAngle: 0,
    rollAngle: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "オジャイブ型ノーズコーンを使用したロケット。",
      },
    },
  },
};

export const EllipticalNose: Story = {
  args: {
    rocketParams: {
      ...defaultParams,
      name: "楕円ノーズロケット",
      nose: {
        ...defaultParams.nose,
        type: "elliptical",
        color: "#9966FF",
      },
    },
    scale: 2,
    pitchAngle: 0,
    rollAngle: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "楕円型ノーズコーンを使用したロケット。",
      },
    },
  },
};

export const FourFins: Story = {
  args: {
    rocketParams: {
      ...defaultParams,
      name: "4枚フィンロケット",
      fins: {
        ...defaultParams.fins,
        count: 4,
        color: "#00FF99",
      },
    },
    scale: 2,
    pitchAngle: 0,
    rollAngle: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "4枚フィン構成のロケット。安定性が向上。",
      },
    },
  },
};

export const HighPowerRocket: Story = {
  args: {
    rocketParams: {
      ...defaultParams,
      name: "高出力ロケット",
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
        color: "#1E90FF",
      },
      fins: {
        ...defaultParams.fins,
        count: 4,
        rootChord: 8,
        tipChord: 3,
        sweepLength: 5,
        height: 6,
        color: "#FF1493",
      },
    },
    scale: 1.5,
    pitchAngle: 0,
    rollAngle: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "高出力用の大型ロケット。より大きなサイズと強化されたフィン。",
      },
    },
  },
};

export const ComparisonView: Story = {
  args: {
    rocketParams: defaultParams,
    scale: 1.5,
    pitchAngle: 0,
    rollAngle: 0,
  },
  decorators: [
    (Story) => (
      <svg width="800" height="300" viewBox="0 0 800 300">
        <g transform="translate(50, 50)">
          <Story />
        </g>
        <g transform="translate(250, 50)">
          <RocketComponent
            rocketParams={{
              ...defaultParams,
              nose: { ...defaultParams.nose, type: "ogive", color: "#FF6600" },
              body: { ...defaultParams.body, color: "#66FF66" },
            }}
            scale={1.5}
            pitchAngle={0}
            rollAngle={0}
          />
        </g>
        <g transform="translate(450, 50)">
          <RocketComponent
            rocketParams={{
              ...defaultParams,
              nose: {
                ...defaultParams.nose,
                type: "elliptical",
                color: "#9966FF",
              },
              body: { ...defaultParams.body, color: "#FF66FF" },
              fins: { ...defaultParams.fins, count: 4, color: "#66FFFF" },
            }}
            scale={1.5}
            pitchAngle={0}
            rollAngle={0}
          />
        </g>
      </svg>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "複数のロケットを並べて比較表示。異なる設計の比較検討に使用。",
      },
    },
  },
};
