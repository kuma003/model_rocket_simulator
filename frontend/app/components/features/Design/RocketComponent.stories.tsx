import type { Meta, StoryObj } from "@storybook/react";
import RocketComponent from "./RocketComponent";
import type { RocketParams } from "../Rocket/types";
import { calculateRocketProperties } from "../../../utils/calculations/simulationEngine";

const defaultParams: RocketParams = {
  name: "サンプルロケット",
  designer: "テスト設計者",
  nose: {
    length: 0.1, // Convert to meters
    diameter: 0.024, // Convert to meters
    thickness: 0.001, // Convert to meters
    material: "plastic",
    color: "#FF0000",
    type: "conical",
  },
  body: {
    length: 0.3, // Convert to meters
    diameter: 0.024, // Convert to meters
    thickness: 0.001, // Convert to meters
    material: "cardboard",
    color: "#FFFF00",
  },
  fins: {
    thickness: 0.001, // Convert to meters
    material: "balsa",
    color: "#0000FF",
    count: 3,
    type: "trapozoidal",
    rootChord: 0.05, // Convert to meters
    tipChord: 0.02, // Convert to meters
    sweepLength: 0.03, // Convert to meters
    height: 0.04, // Convert to meters
    offset: 0.0, // Convert to meters
  },
  payload: {
    offset: 0.05,
    diameter: 0.02,
    length: 0.03,
    mass: 0.01,
  },
  engine: {
    name: "Estes A10",
    peakThrust: 0,
    averageThrust: 0,
    burnTime: 0,
    totalImpulse: 0,
    thrustCurve: [],
    diameter: 18,
    length: 70,
    delays: "3-5-7",
    propMass: 0.0038,
    totalMass: 0.0087,
    manufacturer: "Estes",
  },
};

// Calculate rocket properties for stories
const defaultRocketProperties = calculateRocketProperties(defaultParams);

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
    rocketProperties: defaultRocketProperties,
    scale: 2,
    pitchAngle: 0,
    rollAngle: 0,
  },
};

export const SmallScale: Story = {
  args: {
    rocketParams: defaultParams,
    rocketProperties: defaultRocketProperties,
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
    rocketProperties: defaultRocketProperties,
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
    rocketProperties: defaultRocketProperties,
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
    rocketProperties: defaultRocketProperties,
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
    rocketProperties: defaultRocketProperties,
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
    rocketProperties: calculateRocketProperties({
      ...defaultParams,
      name: "オジャイブノーズロケット",
      nose: {
        ...defaultParams.nose,
        type: "ogive",
        color: "#FF6600",
      },
    }),
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
    rocketProperties: calculateRocketProperties({
      ...defaultParams,
      name: "楕円ノーズロケット",
      nose: {
        ...defaultParams.nose,
        type: "elliptical",
        color: "#9966FF",
      },
    }),
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
    rocketProperties: calculateRocketProperties({
      ...defaultParams,
      name: "4枚フィンロケット",
      fins: {
        ...defaultParams.fins,
        count: 4,
        color: "#00FF99",
      },
    }),
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
        length: 0.15, // Convert to meters
        diameter: 0.038, // Convert to meters
        type: "ogive",
        color: "#FF4500",
      },
      body: {
        ...defaultParams.body,
        length: 0.6, // Convert to meters
        diameter: 0.038, // Convert to meters
        color: "#1E90FF",
      },
      fins: {
        thickness: 0.001, // Convert to meters
        material: "balsa",
        color: "#FF1493",
        count: 4,
        offset: 0.02, // Convert to meters
        type: "trapozoidal",
        rootChord: 0.08, // Convert to meters
        tipChord: 0.03, // Convert to meters
        sweepLength: 0.05, // Convert to meters
        height: 0.06, // Convert to meters
      },
    },
    rocketProperties: calculateRocketProperties({
      ...defaultParams,
      name: "高出力ロケット",
      nose: {
        ...defaultParams.nose,
        length: 0.15,
        diameter: 0.038,
        type: "ogive",
        color: "#FF4500",
      },
      body: {
        ...defaultParams.body,
        length: 0.6,
        diameter: 0.038,
        color: "#1E90FF",
      },
      fins: {
        thickness: 0.001,
        material: "balsa",
        color: "#FF1493",
        count: 4,
        offset: 0.02,
        type: "trapozoidal",
        rootChord: 0.08,
        tipChord: 0.03,
        sweepLength: 0.05,
        height: 0.06,
      },
    }),
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

export const FinOffset: Story = {
  args: {
    rocketParams: {
      ...defaultParams,
      name: "フィンオフセットテスト",
      fins: {
        ...defaultParams.fins,
        offset: 0.05, // Convert to meters
        color: "#FF4500",
      },
    },
    rocketProperties: calculateRocketProperties({
      ...defaultParams,
      name: "フィンオフセットテスト",
      fins: {
        ...defaultParams.fins,
        offset: 0.05,
        color: "#FF4500",
      },
    }),
    scale: 2,
    pitchAngle: 0,
    rollAngle: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          "フィンのオフセットを5cmに設定。フィンの位置が後方に移動している。",
      },
    },
  },
};

export const FinOffsetComparison: Story = {
  args: {
    rocketParams: defaultParams,
    rocketProperties: defaultRocketProperties,
    scale: 1.5,
    pitchAngle: 0,
    rollAngle: 0,
  },
  decorators: [
    (Story) => (
      <svg width="800" height="400" viewBox="0 0 800 400">
        <text x="100" y="30" textAnchor="middle" fontSize="14" fill="#333">
          Offset: 0cm
        </text>
        <g transform="translate(50, 50)">
          <Story />
        </g>
        <text x="300" y="30" textAnchor="middle" fontSize="14" fill="#333">
          Offset: 3cm
        </text>
        <g transform="translate(250, 50)">
          <RocketComponent
            rocketParams={{
              ...defaultParams,
              fins: { ...defaultParams.fins, offset: 3, color: "#FF6600" },
            }}
            rocketProperties={calculateRocketProperties({
              ...defaultParams,
              fins: { ...defaultParams.fins, offset: 3, color: "#FF6600" },
            })}
            scale={1.5}
            pitchAngle={0}
            rollAngle={0}
          />
        </g>
        <text x="500" y="30" textAnchor="middle" fontSize="14" fill="#333">
          Offset: 6cm
        </text>
        <g transform="translate(450, 50)">
          <RocketComponent
            rocketParams={{
              ...defaultParams,
              fins: { ...defaultParams.fins, offset: 6, color: "#9966FF" },
            }}
            rocketProperties={calculateRocketProperties({
              ...defaultParams,
              fins: { ...defaultParams.fins, offset: 6, color: "#9966FF" },
            })}
            scale={1.5}
            pitchAngle={0}
            rollAngle={0}
          />
        </g>
        <text x="700" y="30" textAnchor="middle" fontSize="14" fill="#333">
          Offset: 9cm
        </text>
        <g transform="translate(650, 50)">
          <RocketComponent
            rocketParams={{
              ...defaultParams,
              fins: { ...defaultParams.fins, offset: 9, color: "#66FFFF" },
            }}
            rocketProperties={calculateRocketProperties({
              ...defaultParams,
              fins: { ...defaultParams.fins, offset: 9, color: "#66FFFF" },
            })}
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
        story:
          "異なるフィンオフセット値を持つロケットを並べて表示。オフセットがフィンの位置に与える影響を確認できる。",
      },
    },
  },
};

export const ComparisonView: Story = {
  args: {
    rocketParams: defaultParams,
    rocketProperties: defaultRocketProperties,
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
            rocketProperties={calculateRocketProperties({
              ...defaultParams,
              nose: { ...defaultParams.nose, type: "ogive", color: "#FF6600" },
              body: { ...defaultParams.body, color: "#66FF66" },
            })}
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
            rocketProperties={calculateRocketProperties({
              ...defaultParams,
              nose: {
                ...defaultParams.nose,
                type: "elliptical",
                color: "#9966FF",
              },
              body: { ...defaultParams.body, color: "#FF66FF" },
              fins: { ...defaultParams.fins, count: 4, color: "#66FFFF" },
            })}
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
