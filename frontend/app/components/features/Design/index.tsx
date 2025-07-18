import React, { useMemo, useState } from "react";
import RocketPanel from "~/components/layout/RocketPanel";
import SimulationPanel from "~/components/layout/SimulationPanel";
import RocketVisualization from "./RocketVisualization";
import type { RocketParams } from "../Rocket/types";
import {
  calculateRocketProperties,
  calculateTrajectory,
  type RocketProperties,
  type TrajectoryData,
} from "../../../utils/calculations/simulationEngine";
import styles from "./design.module.scss";
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
  // タブを2段に分ける
  const primarySections = [
    { label: "ノーズ", value: "nose" },
    { label: "ボディ", value: "body" },
    { label: "フィン", value: "fins" },
  ];

  const secondarySections = [
    { label: "ペイロード", value: "payload" },
    { label: "エンジン", value: "engine" },
  ];
  const [activeSection, setActiveSection] = useState(primarySections[0].value);
  const [params, setParams] = useState<RocketParams>(rocketParams);

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
    </div>
  );
};
export default Design;
