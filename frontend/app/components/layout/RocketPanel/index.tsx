import React from "react";
import type { RocketParams } from "../../features/Rocket/types";
import styles from "./rocketPanel.module.scss";
import { Settings } from "../../ui/Icons";

export interface RocketPanelProps {
  setRocketParams: (params: RocketParams) => void;
}

const RocketPanel: React.FC<RocketPanelProps> = ({ setRocketParams }) => {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Settings className={styles.icon} />
        <h2>コンポーネント設定</h2>
      </div>
    </div>
  );
};

export default RocketPanel;
