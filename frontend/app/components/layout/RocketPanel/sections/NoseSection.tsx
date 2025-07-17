import React from "react";
import { Stack, Select, ColorInput } from "@mantine/core";
import UnitNumberInput from "~/components/ui/UnitNumberInput";
import type { RocketParams } from "../../../features/Rocket/types";

interface NoseSectionProps {
  params: RocketParams;
  updateParams: (newParams: Partial<RocketParams>) => void;
}

const NoseSection: React.FC<NoseSectionProps> = ({ params, updateParams }) => {
  return (
    <Stack>
      <Select
        label="ノーズコーンタイプ"
        value={params.nose.type}
        onChange={(value) =>
          updateParams({ nose: { ...params.nose, type: value as any } })
        }
        data={[
          { value: "conical", label: "円錐型" },
          { value: "ogive", label: "オジャイブ型" },
          { value: "elliptical", label: "楕円型" },
        ]}
      />
      <UnitNumberInput
        label="長さ"
        unitType="length"
        value={params.nose.length}
        onChange={(value) =>
          updateParams({ nose: { ...params.nose, length: value } })
        }
      />
      <UnitNumberInput
        label="直径"
        unitType="length"
        value={params.nose.diameter}
        onChange={(value) =>
          updateParams({
            nose: { ...params.nose, diameter: value },
            body: { ...params.body, diameter: value },
          })
        }
      />
      <UnitNumberInput
        label="厚さ"
        unitType="length"
        value={params.nose.thickness}
        onChange={(value) =>
          updateParams({
            nose: { ...params.nose, thickness: value },
          })
        }
        decimalScale={2}
      />
      <Select
        label="材質"
        value={params.nose.material}
        onChange={(value) =>
          updateParams({ nose: { ...params.nose, material: value as any } })
        }
        data={[
          { value: "plastic", label: "プラスチック" },
          { value: "balsa", label: "バルサ" },
          { value: "cardboard", label: "厚紙" },
        ]}
      />
      <ColorInput
        label="色"
        value={params.nose.color}
        onChange={(value) =>
          updateParams({ nose: { ...params.nose, color: value } })
        }
      />
    </Stack>
  );
};

export default NoseSection;
