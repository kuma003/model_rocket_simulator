import React from "react";
import { Stack, Select, ColorInput } from "@mantine/core";
import UnitNumberInput from "~/components/ui/UnitNumberInput";
import type { RocketParams } from "../../../features/Rocket/types";

interface BodySectionProps {
  params: RocketParams;
  updateParams: (newParams: Partial<RocketParams>) => void;
}

const BodySection: React.FC<BodySectionProps> = ({ params, updateParams }) => {
  return (
    <Stack>
      <UnitNumberInput
        label="長さ"
        unitType="length"
        value={params.body.length}
        onChange={(value) =>
          updateParams({ body: { ...params.body, length: value } })
        }
        min={0}
        step={0.1}
      />
      <UnitNumberInput
        label="直径"
        unitType="length"
        value={params.body.diameter}
        onChange={(value) =>
          updateParams({
            body: { ...params.body, diameter: value },
            nose: { ...params.nose, diameter: value },
          })
        }
        min={0}
        step={0.1}
      />
      <UnitNumberInput
        label="厚さ"
        unitType="length"
        value={params.body.thickness}
        onChange={(value) =>
          updateParams({
            body: { ...params.body, thickness: value },
          })
        }
        min={0}
        step={0.01}
      />
      <Select
        label="材質"
        value={params.body.material}
        onChange={(value) =>
          updateParams({ body: { ...params.body, material: value as any } })
        }
        data={[
          { value: "plastic", label: "プラスチック" },
          { value: "balsa", label: "バルサ" },
          { value: "cardboard", label: "厚紙" },
        ]}
      />
      <ColorInput
        label="色"
        value={params.body.color}
        onChange={(value) =>
          updateParams({ body: { ...params.body, color: value } })
        }
      />
    </Stack>
  );
};

export default BodySection;
