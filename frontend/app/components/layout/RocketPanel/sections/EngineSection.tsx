import React, { useEffect } from "react";
import { Stack, Select } from "@mantine/core";
import type { RocketParams } from "../../../features/Rocket/types";
import ThrustCurveChart from "../../../features/ThrustCurveChart";
import { loadMotorData, type MotorData } from "../../../../utils/motorParser";

interface EngineSectionProps {
  params: RocketParams;
  updateParams: (newParams: Partial<RocketParams>) => void;
}

const EngineSection: React.FC<EngineSectionProps> = ({
  params,
  updateParams,
}) => {
  const [engineName, setEngineName] = React.useState(params.engine.name);
  const [motorData, setMotorData] = React.useState<MotorData | null>(null);

  // Update local state when params.engine.name changes (e.g., from import)
  useEffect(() => {
    if (params.engine.name !== engineName) {
      setEngineName(params.engine.name);
    }
  }, [params.engine.name]);

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
      <ThrustCurveChart motorData={motorData} loading={motorData == null} />
    </Stack>
  );
};

export default EngineSection;
