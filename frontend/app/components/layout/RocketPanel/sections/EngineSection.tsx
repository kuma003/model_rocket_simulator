import React, { useEffect } from "react";
import { Stack, Select } from "@mantine/core";
import type { RocketParams } from "../../../features/Rocket/types";
import ThrustCurveChart from "../../../features/ThrustCurveChart";
import { loadMotorData, type MotorData } from "../../../../utils/motorParser";

interface EngineSectionProps {
  params: RocketParams;
  updateParams: (newParams: Partial<RocketParams>) => void;
  loading: boolean;
}

const EngineSection: React.FC<EngineSectionProps> = ({
  params,
  updateParams,
  loading,
}) => {
  const [engineName, setEngineName] = React.useState(params.engine.name);
  const [motorData, setMotorData] = React.useState<MotorData | null>(null);

  useEffect(() => {
    const fetchMotor = async () => {
      if (engineName) {
        try {
          const data = await loadMotorData(engineName);
          setMotorData(data);
          if (data) {
            updateParams({ engine: data });
          }
        } catch (error) {
          console.error("Failed to load motor data:", error);
          setMotorData(null);
        }
      }
    };
    fetchMotor();
  }, [engineName]);
  return (
    <Stack>
      <Select
        label="エンジン"
        value={engineName}
        onChange={(value) => setEngineName(value || "")}
        data={[
          { value: "Estes A10", label: "Estes A10" },
          { value: "Estes A3", label: "Estes A3" },
          { value: "Estes B4", label: "Estes B4" },
          { value: "Estes C6", label: "Estes C6" },
        ]}
        allowDeselect={false}
      />
      <ThrustCurveChart motorData={motorData} loading={loading} />
    </Stack>
  );
};

export default EngineSection;
