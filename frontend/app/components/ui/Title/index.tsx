import React from "react";
import { Rocket } from "../Icons";
import styles from "./title.module.scss";

const Title: React.FC = () => {
  return (
    <div className={styles.title}>
      <Rocket className={styles.icon} />
      <h1>Model Rocket Simulator</h1>
    </div>
  );
};

export default Title;
