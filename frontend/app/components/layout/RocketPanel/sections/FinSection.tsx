import React from "react";
import { Stack, NumberInput, Select, ColorInput } from "@mantine/core";
import type { RocketParams } from "../../../features/Rocket/types";

interface FinSectionProps {
  params: RocketParams;
  updateParams: (newParams: Partial<RocketParams>) => void;
}

const FinSection: React.FC<FinSectionProps> = ({ params, updateParams }) => {
  return (
    <Stack gap="sm">
      <NumberInput
        label="フィン数"
        value={params.fins.count}
        onChange={(value) => updateParams({ fins: { ...params.fins, count: Number(value) || 0 } })}
        min={1}
        max={8}
      />
      <Select
        label="フィンタイプ"
        value={params.fins.type}
        onChange={(value) => {
          if (value === "trapozoidal") {
            updateParams({
              fins: {
                ...params.fins,
                type: "trapozoidal",
                rootChord: 5,
                tipChord: 2,
                sweepLength: 3,
                height: 4,
              }
            });
          }
        }}
        data={[
          { value: "trapozoidal", label: "台形" },
          { value: "elliptical", label: "楕円" },
          { value: "freedom", label: "自由形状" },
        ]}
      />
      {params.fins.type === "trapozoidal" && (
        <>
          <NumberInput
            label="ルートコード (cm)"
            value={(params.fins as any).rootChord}
            onChange={(value) => updateParams({ fins: { ...params.fins, rootChord: Number(value) || 0 } as any })}
            min={0}
            step={0.1}
          />
          <NumberInput
            label="チップコード (cm)"
            value={(params.fins as any).tipChord}
            onChange={(value) => updateParams({ fins: { ...params.fins, tipChord: Number(value) || 0 } as any })}
            min={0}
            step={0.1}
          />
          <NumberInput
            label="スイープ長 (cm)"
            value={(params.fins as any).sweepLength}
            onChange={(value) => updateParams({ fins: { ...params.fins, sweepLength: Number(value) || 0 } as any })}
            min={0}
            step={0.1}
          />
          <NumberInput
            label="高さ (cm)"
            value={(params.fins as any).height}
            onChange={(value) => updateParams({ fins: { ...params.fins, height: Number(value) || 0 } as any })}
            min={0}
            step={0.1}
          />
        </>
      )}
      <NumberInput
        label="厚さ (cm)"
        value={params.fins.thickness}
        onChange={(value) => updateParams({ fins: { ...params.fins, thickness: Number(value) || 0 } })}
        min={0}
        step={0.01}
      />
      <Select
        label="材質"
        value={params.fins.material}
        onChange={(value) => updateParams({ fins: { ...params.fins, material: value as any } })}
        data={[
          { value: "plastic", label: "プラスチック" },
          { value: "balsa", label: "バルサ" },
          { value: "cardboard", label: "厚紙" },
        ]}
      />
      <ColorInput
        label="色"
        value={params.fins.color}
        onChange={(value) => updateParams({ fins: { ...params.fins, color: value } })}
      />
    </Stack>
  );
};

export default FinSection;