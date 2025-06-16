import React from "react";
import { Stack, NumberInput, Select, ColorInput } from "@mantine/core";
import type { RocketParams } from "../../../features/Rocket/types";

interface NoseSectionProps {
  params: RocketParams;
  updateParams: (newParams: Partial<RocketParams>) => void;
}

const NoseSection: React.FC<NoseSectionProps> = ({ params, updateParams }) => {
  return (
    <Stack gap="sm">
      <Select
        label="ノーズコーンタイプ"
        value={params.nose.type}
        onChange={(value) => updateParams({ nose: { ...params.nose, type: value as any } })}
        data={[
          { value: "conical", label: "円錐型" },
          { value: "ogive", label: "オジャイブ型" },
          { value: "elliptical", label: "楕円型" },
        ]}
      />
      <NumberInput
        label="長さ (cm)"
        value={params.nose.length}
        onChange={(value) => updateParams({ nose: { ...params.nose, length: Number(value) || 0 } })}
        min={0}
        step={0.1}
      />
      <NumberInput
        label="直径 (cm)"
        value={params.nose.diameter}
        onChange={(value) => updateParams({ nose: { ...params.nose, diameter: Number(value) || 0 } })}
        min={0}
        step={0.1}
      />
      <NumberInput
        label="厚さ (cm)"
        value={params.nose.thickness}
        onChange={(value) => updateParams({ nose: { ...params.nose, thickness: Number(value) || 0 } })}
        min={0}
        step={0.01}
      />
      <Select
        label="材質"
        value={params.nose.material}
        onChange={(value) => updateParams({ nose: { ...params.nose, material: value as any } })}
        data={[
          { value: "plastic", label: "プラスチック" },
          { value: "balsa", label: "バルサ" },
          { value: "cardboard", label: "厚紙" },
        ]}
      />
      <ColorInput
        label="色"
        value={params.nose.color}
        onChange={(value) => updateParams({ nose: { ...params.nose, color: value } })}
      />
    </Stack>
  );
};

export default NoseSection;