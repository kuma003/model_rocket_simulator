import React from "react";
import { Rocket } from "../Icons";
import styles from "./title.module.scss";

const Title: React.FC = () => {
  return (
    <div className={styles.title}>
      <Rocket className={styles.icon} />
      <h1>
        Model Rocket
        <br />
        Simulator
      </h1>
      <h2>LAUNCH MISSIONS</h2>
    </div>
  );
};

export default Title;
