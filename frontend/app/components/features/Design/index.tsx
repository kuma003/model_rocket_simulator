import React, { useMemo } from "react";
import RocketPanel from "~/components/layout/RocketPanel";
import SimulationPanel from "~/components/layout/SimulationPanel";
import RocketVisualization from "./RocketVisualization";
import LaunchButton from "~/components/common/LaunchButton/LaunchButton";
import type { RocketParams } from "../Rocket/types";
import {
  calculateRocketProperties,
  calculateTrajectory,
  type RocketProperties,
  type TrajectoryData,
} from "../../../utils/calculations/simulationEngine";
import styles from "./design.module.scss";
import type { MotorData } from "../../../utils/motorParser";
import { defaultMotorData } from "../../../utils/motorParser";

const Design: React.FC = () => {
  const [rocketParams, setRocketParams] = React.useState<RocketParams>({
    name: "新しいロケット",
    designer: "",
    nose: {
      length: 0.1,
      diameter: 0.024,
      thickness: 0.001,
      material: "plastic",
      color: "#FF0000",
      type: "conical",
    },
    body: {
      length: 0.3,
      diameter: 0.024,
      thickness: 0.001,
      material: "cardboard",
      color: "#FFFF00",
    },
    fins: {
      thickness: 0.001,
      material: "balsa",
      color: "#0000FF",
      count: 3,
      offset: 0,
      type: "trapozoidal",
      rootChord: 0.05,
      tipChord: 0.02,
      sweepLength: 0.03,
      height: 0.04,
    },
    payload: {
      offset: 0.05,
      diameter: 0.02,
      length: 0.03,
      mass: 0.01,
    },
    engine: {
      ...defaultMotorData,
      name: "Estes A10",
    },
  });

  // Calculate rocket properties and trajectory once at the parent level
  const { rocketProperties, trajectoryData } = useMemo(() => {
    const rocketProperties = calculateRocketProperties(rocketParams);
    const trajectoryData = calculateTrajectory(rocketProperties);
    return { rocketProperties, trajectoryData };
  }, [rocketParams]);

  return (
    <div className={styles.design}>
      <RocketPanel
        rocketParams={rocketParams}
        setRocketParams={setRocketParams}
      />
      <div className={styles.centerArea}>
        <RocketVisualization
          rocketParams={rocketParams}
          rocketProperties={rocketProperties}
          showCenterMarkers={true}
        />
      </div>
      <SimulationPanel
        rocketParams={rocketParams}
        rocketProperties={rocketProperties}
        trajectoryData={trajectoryData}
      />
      <LaunchButton rocketParams={rocketParams} />
    </div>
  );
};
export default Design;
