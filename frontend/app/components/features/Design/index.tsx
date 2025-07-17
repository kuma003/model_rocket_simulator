import React from "react";
import RocketPanel from "~/components/layout/RocketPanel";
import SimulationPanel from "~/components/layout/SimulationPanel";
import RocketVisualization from "./RocketVisualization";
import type { RocketParams } from "../Rocket/types";
import styles from "./design.module.scss";

const Design: React.FC = () => {
  const [rocketParams, setRocketParams] = React.useState<RocketParams>({
    name: "新しいロケット",
    designer: "",
    nose: {
      length: 0.10,
      diameter: 0.024,
      thickness: 0.001,
      material: "plastic",
      color: "#FF0000",
      type: "conical",
    },
    body: {
      length: 0.30,
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
      offset: 0.02,
      type: "trapozoidal",
      rootChord: 0.05,
      tipChord: 0.02,
      sweepLength: 0.03,
      height: 0.04,
    },
    engine: {
      name: "Estes A10",
    },
  });

  return (
    <div className={styles.design}>
      <RocketPanel
        rocketParams={rocketParams}
        setRocketParams={setRocketParams}
      />
      <div className={styles.centerArea}>
        <RocketVisualization rocketParams={rocketParams} showCenterMarkers={true} />
      </div>
      <SimulationPanel rocketParams={rocketParams} />
    </div>
  );
};
export default Design;
