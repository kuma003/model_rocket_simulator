import React from "react";
import RocketPanel from "~/components/layout/RocketPanel";
import type { RocketParams } from "../Rocket/types";
import styles from "./design.module.scss";

const Design: React.FC = () => {
  const [rocketParams, setRocketParams] = React.useState<RocketParams>({
    nose: {
      length: 0,
      diameter: 0,
      thickness: 0,
      material: "plastic",
      color: "#FFFFFF",
      type: "conical",
    },
    body: {
      length: 0,
      diameter: 0,
      thickness: 0,
      material: "plastic",
      color: "#FFFFFF",
    },
    fins: {
      thickness: 0,
      material: "plastic",
      color: "#FFFFFF",
      count: 4,
      type: "trapozoidal",
      rootChord: 0,
      tipChord: 0,
      sweepLength: 0,
      height: 0,
    },
    engine: {
      name: "",
    },
  });

  return (
    <div className={styles.design}>
      <RocketPanel setRocketParams={setRocketParams} />
    </div>
  );
};
export default Design;
