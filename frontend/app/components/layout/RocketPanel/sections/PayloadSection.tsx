import React from "react";
import { Stack } from "@mantine/core";
import UnitNumberInput from "~/components/ui/UnitNumberInput";
import type { RocketParams } from "../../../features/Rocket/types";

interface PayloadSectionProps {
  params: RocketParams;
  updateParams: (newParams: Partial<RocketParams>) => void;
}

const PayloadSection: React.FC<PayloadSectionProps> = ({
  params,
  updateParams,
}) => {
  return (
    <Stack>
      <UnitNumberInput
        label="取り付け位置"
        unitType="length"
        description="ボディ上端からの距離"
        value={params.payload.offset}
        onChange={(value) =>
          updateParams({ payload: { ...params.payload, offset: value } })
        }
        min={0}
      />
      <UnitNumberInput
        label="直径"
        unitType="length"
        value={params.payload.diameter}
        onChange={(value) =>
          updateParams({ payload: { ...params.payload, diameter: value } })
        }
        min={0}
        step={0.1}
      />
      <UnitNumberInput
        label="長さ"
        unitType="length"
        value={params.payload.length}
        onChange={(value) =>
          updateParams({ payload: { ...params.payload, length: value } })
        }
        min={0}
        step={0.1}
      />
      <UnitNumberInput
        label="質量"
        unitType="mass"
        value={params.payload.mass}
        onChange={(value) => {
          console.log("Payload mass updated:", value);
          updateParams({ payload: { ...params.payload, mass: value } });
        }}
        min={0}
        step={0.1}
      />
    </Stack>
  );
};

export default PayloadSection;
