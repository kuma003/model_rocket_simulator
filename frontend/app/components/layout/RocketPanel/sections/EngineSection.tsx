import React from "react";
import { Stack, Select } from "@mantine/core";
import type { RocketParams } from "../../../features/Rocket/types";
import ThrustCurveChart from "../../../features/ThrustCurveChart";
import type { MotorData } from "../../../../utils/motorParser";

interface EngineSectionProps {
  params: RocketParams;
  updateParams: (newParams: Partial<RocketParams>) => void;
  motorData: MotorData | null;
  loadingMotorData: boolean;
}

const EngineSection: React.FC<EngineSectionProps> = ({
  params,
  updateParams,
  motorData,
  loadingMotorData,
}) => {
  return (
    <Stack>
      <Select
        label="エンジン"
        value={params.engine.name}
        onChange={(value) => updateParams({ engine: { name: value || "" } })}
        data={[
          { value: "Estes A10", label: "Estes A10" },
          { value: "Estes A3", label: "Estes A3" },
          { value: "Estes B4", label: "Estes B4" },
          { value: "Estes C6", label: "Estes C6" },
        ]}
        searchable
      />
      <ThrustCurveChart motorData={motorData} loading={loadingMotorData} />
    </Stack>
  );
};

export default EngineSection;
