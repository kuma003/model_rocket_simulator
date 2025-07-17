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
      length: 0.10, // 10cm -> 0.10m
      diameter: 0.024, // 2.4cm -> 0.024m
      thickness: 0.001, // 0.1cm -> 0.001m
      material: "plastic",
      color: "#FF0000",
      type: "conical",
    },
    body: {
      length: 0.30, // 30cm -> 0.30m
      diameter: 0.024, // 2.4cm -> 0.024m
      thickness: 0.001, // 0.1cm -> 0.001m
      material: "cardboard",
      color: "#FFFF00",
    },
    fins: {
      thickness: 0.001, // 0.1cm -> 0.001m
      material: "balsa",
      color: "#0000FF",
      count: 3,
      offset: 0.02, // 2cm -> 0.02m
      type: "trapozoidal",
      rootChord: 0.05, // 5cm -> 0.05m
      tipChord: 0.02, // 2cm -> 0.02m
      sweepLength: 0.03, // 3cm -> 0.03m
      height: 0.04, // 4cm -> 0.04m
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
