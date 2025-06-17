import React from "react";
import { Stack, NumberInput, Select, ColorInput } from "@mantine/core";
import type { RocketParams } from "../../../features/Rocket/types";

interface BodySectionProps {
  params: RocketParams;
  updateParams: (newParams: Partial<RocketParams>) => void;
}

const BodySection: React.FC<BodySectionProps> = ({ params, updateParams }) => {
  return (
    <Stack>
      <NumberInput
        label="長さ (cm)"
        value={params.body.length}
        onChange={(value) =>
          updateParams({ body: { ...params.body, length: Number(value) || 0 } })
        }
        min={0}
        step={0.1}
      />
      <NumberInput
        label="直径 (cm)"
        value={params.body.diameter}
        onChange={(value) =>
          updateParams({
            body: { ...params.body, diameter: Number(value) || 0 },
            nose: { ...params.nose, diameter: Number(value) || 0 },
          })
        }
        min={0}
        step={0.1}
      />
      <NumberInput
        label="厚さ (cm)"
        value={params.body.thickness}
        onChange={(value) =>
          updateParams({
            body: { ...params.body, thickness: Number(value) || 0 },
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
