import React from "react";
import styles from "./toppage.module.scss";
import MenuButton from "../MenuButton";
import { PlayArrow, SimpleRocket, Settings } from "../Icons";

const Top: React.FC = () => {
  return (
    <div className={styles.toppage}>
      <MenuButton
        buttons={[
          {
            label: "プレイ",
            leftIcon: <PlayArrow color="white" />,
            onClick: () => console.log("Home button clicked"),
          },
          {
            label: "設定",
            leftIcon: <Settings color="white" />,
          },
          {
            label: "ランキング",
            leftIcon: <SimpleRocket color="white" />,
          },
        ]}
      />
    </div>
  );
};

export default Top;
