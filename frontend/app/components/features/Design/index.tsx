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
      length: 10,
      diameter: 2.4,
      thickness: 0.1,
      material: "plastic",
      color: "#FF0000",
      type: "conical",
    },
    body: {
      length: 30,
      diameter: 2.4,
      thickness: 0.1,
      material: "cardboard",
      color: "#FFFF00",
    },
    fins: {
      thickness: 0.1,
      material: "balsa",
      color: "#0000FF",
      count: 3,
      offset: 2,
      type: "trapozoidal",
      rootChord: 5,
      tipChord: 2,
      sweepLength: 3,
      height: 4,
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
        <RocketVisualization rocketParams={rocketParams} />
      </div>
      <SimulationPanel rocketParams={rocketParams} />
    </div>
  );
};
export default Design;
