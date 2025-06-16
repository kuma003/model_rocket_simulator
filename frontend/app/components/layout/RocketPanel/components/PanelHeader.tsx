import React from "react";
import { Settings } from "../../../ui/Icons";
import styles from "../rocketPanel.module.scss";

const PanelHeader: React.FC = () => {
  return (
    <div className={styles.header}>
      <Settings className={styles.icon} />
      <h2>コンポーネント設定</h2>
    </div>
  );
};

export default PanelHeader;